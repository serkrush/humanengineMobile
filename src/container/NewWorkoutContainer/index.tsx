import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";

import {
	Container,
	Header,
	Title,
	Content,
	Text,
	Button,
	Icon,
	Left,
	Body,
	Right,
	Form,
	View,
	Item, Input, Tab, Tabs, ScrollableTab, Fab, Card, CardItem, ActionSheet
} from "native-base";
import { Image, TextInput, TouchableOpacity } from 'react-native';

import styles from '../../stories/screens/Home/styles';
import { saveWorkouts } from "../../models/workouts";
import { Field, FieldArray, reduxForm,  submit } from "redux-form";
import Workout from "../../models/workouts";
import AlertAsync from "react-native-alert-async";


const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	workout: Map<string, any>;
    exercises: Map<string, any>;
	saveWorkouts: (data) => Action;
}

export interface State {
	_fields: any,
	indexDay: number,
	indexExercise: number,
	flagDelete: boolean,
	addDay: boolean,
	active: boolean,
}
class NewWorkoutContainer extends React.Component<Props, State> {

	textInput: any;
	constructor(props: Props) {
		
		super(props);
		const workoutDays = this.props.workout.get('days').toJS();
		
		this.state = {
			active: false,
			addDay: false,
			indexDay: 0,
			indexExercise: workoutDays?workoutDays[0].exercises.length:0,
			flagDelete: false,
		};
	}

	renderInput({ input, meta: { touched, error } }) {
		return (
			<Item error={error && touched}>
				<Input
					ref={c => (this.textInput = c)}
					placeholder="WorkoutName"
					secureTextEntry={false}
					{...input}
				/>
			</Item>
		);
	}


	renderTextarea({ input, meta: { touched, error } }){
		return (
			<Item error={error && touched}>
				<TextInput
					ref={c => (this.textInput = c)}
					placeholder="Description1"
					secureTextEntry={false}
					multiline={true}
					numberOfLines={1}
					{...input}
				/>
			</Item>
		);
	}

	render() {
		const { workout } = this.props;
		let styleContent = 1;
		(this.state.active)?styleContent=0.2:styleContent=1;

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Training App</Title>
					</Body>
					<Right />
				</Header>
				<Content style={{opacity:styleContent}}>
					<Form>
						<View style={styles.contentPadding}>
							<Text>Workout name</Text>
							<Field 
								name="workoutName" 
								component={this.renderInput} 
								validate={[required]} />
						</View>
						<View style={styles.contentPadding}>
							<Text style={{marginTop:15}}>Workout description</Text>
							<Field 
								name="description" 
								component={this.renderTextarea} 
								validate={[required]} />
						</View>
						<FieldArray name="days" component={renderDays} _this={this} _workout={workout} _addDay={this.state.addDay} />
					</Form>

				</Content>

				<View style={{ flex: 1, position:"absolute", bottom:0, right:0 }}>
					<Fab
						active={this.state.active}
						direction="up"
						containerStyle={{ }}
						style={{ backgroundColor: '#00a6ff' }}
						position="bottomRight"
						onPress={() => this.setState({ active: !this.state.active })}
					>
						<Text>+</Text>
						
						<Button style={{ backgroundColor: '#ff9052' }} onPress={() => {this.setState({addDay: true});} }>
							<Text style={{position:"absolute", left:-80, color:"#000"}}>{(this.state.active)?"Day":""}</Text>
							<Text>+</Text>
						</Button>
						
						<Button 
							style={{ backgroundColor: '#ff9052' }} 
							onPress={() => {
											this.props.navigation.navigate("Categories", {
																							indexDay: this.state.indexDay,
																							indexExercise: this.state.indexExercise,
																							countDay: (this.state._fields)?this.state._fields.length:0
																						})}
									} 
						>
							<Text style={{position:"absolute", left:-80, color:"#000"}}>{(this.state.active)?"Exercise":""}</Text>
							<Text>+</Text>
						</Button>
					</Fab>
				</View>
			</Container>
		);
	}
}

async function alertDelete(_fields,_index, _this) {
	
	const choice = await AlertAsync(
		'Title',
		'Message',
		[
			{text: 'Yes', onPress: () =>  'yes'},
			{text: 'No', onPress: () => Promise.resolve('no')},
		],
		{
			cancelable: true,
			onDismiss: () => 'no',
		},
	);
	
	if (choice === 'yes') {
		await _fields.remove(_index);
		await _this.props.dispatch(submit('newWorkout'));
	}
	else {
		await console.log('no');
	}
}

const renderDays = ({ fields, _this, _workout, _addDay, meta: { error, submitFailed } }) => {
	
	if (fields.length==0 || _addDay){fields.push({});_this.setState({addDay: false})};
	let _days = _workout.get('days').toJS();
	return <View>
			<Tabs renderTabBar={()=> {return <ScrollableTab />}} onChangeTab={(i, ref)=> {_this.setState({indexDay:i.i, indexExercise:(_days[i.i])?_days[i.i].exercises.length:0});}}>
			{
				fields.map((day, index) => (
					<Tab 
						key={"day_"+index}
						heading={"Day"+(index*1+1*1)}
					>
					
						<FieldArray name={`${day}.exercises`} component={renderExercises} _workout={_workout} _day={_workout.get('days').toJS()} indexDay={index} _this={_this}/>
					</Tab>
		))}
		</Tabs>
    </View>
	
}

const renderExercises = ({ indexDay, _workout, _day, fields, _this, meta: { error, submitFailed } }) => {
	
    return <View>
		{fields && fields.map((exercise, index) => 
			{
				let exerciseInfo = (_day[indexDay] && _day[indexDay].exercises[index] && _day[indexDay].exercises[index].exercise)?_this.props.exercises.getIn([_day[indexDay].exercises[index].exercise]):'';
				let exerciseSetsInfo = (_day[indexDay] && _day[indexDay].exercises[index] && _day[indexDay].exercises[index].sets)?_day[indexDay].exercises[index].sets:null;
				
				let exerciseImg = '';
				if (exerciseInfo!='' && exerciseInfo){
					exerciseImg = exerciseInfo.get('exerciseImg');
				}
				let exerciseName = '';
				if (exerciseInfo!='' && exerciseInfo){
					exerciseName = exerciseInfo.get('exerciseName');
				}
				
				var BUTTONS = [ "Change", "Delete" ];
				return 	<TouchableOpacity 
							key={"exercise_"+index+Math.random()}
							onPress={() =>{
								ActionSheet.show(
									{
										options: BUTTONS,
									},
									buttonIndex => {
										if (buttonIndex==1){
											alertDelete(fields,index,_this);
										} else if (buttonIndex==0){
											console.log('change');
											_this.props.navigation.navigate("Sets",{
												indexDay: indexDay,
												indexExercise: index,
												countSets: _day[indexDay].exercises[index].sets.length - 1
											})
										}
										
										_this.setState({ clicked: BUTTONS[buttonIndex] });

									}
								)
							}}
						>
							<Card>
								<CardItem>
									<Body style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
										<View style={{width:"30%"}}>
											<Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f='+ exerciseImg +'&d=muscle.png'}} style={{ height: 75, width: 90, flex: 1}}/>
										</View>
										<View style={{width:"70%", paddingLeft: 5}}>
											{<FieldArray name={`${exercise}.sets`} component={renderSets} sets={exerciseSetsInfo} exerciseName={exerciseName} />}
										</View>
									</Body>
								</CardItem>
							</Card>
						</TouchableOpacity>
			}
		)}
	</View>
}

const renderSets = ({ fields, indexExercise, sets, exerciseName, meta: { error, submitFailed } }) => {
	let vItogSets = 0;
	let vItogReps = 0;
	let vItogRm = 0;
	let vItogRest = 0;
	sets && sets.map((s,i)=>{
		vItogSets += s.set;
		vItogReps += s.rep;
		vItogRm += s.rm;
		vItogRest += s.rest;
	})
    return <View>
				<Text style={{fontSize:17,fontWeight:"bold"}}>{exerciseName}</Text>
				<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
					<View style={{width:'50%'}}>
						<Text>Sets: {vItogSets}</Text>
					</View>
					<View style={{width:'50%'}}>
						<Text>Reps: {vItogReps}</Text>
					</View>
					<View style={{width:'50%'}}>
						<Text>1RM: {vItogRm}</Text>
					</View>
					<View style={{width:'50%'}}>
						<Text>Rest: {vItogRest}</Text>
					</View>
				</View>
			</View>
}

const NewWorkout = reduxForm({
	form: "newWorkout",
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
	enableReinitialize: true,
	// onSubmit: submit,
	onSubmit: (data, dispatch, props) => { props.saveWorkouts(data); },
})(NewWorkoutContainer);


const mapStateToProps = (state, props) => {
	const { entities, requestResult } = state;

	let workoutId = '5c18bb09831ccc36bd058fc5';//props.workoutId;
	// if (requestResult && requestResult.has('workouts') && requestResult.get('workouts').has(UPDATE)) {
	// 	workoutId = requestResult.getIn(['workouts', UPDATE]).first();
	// }
	
	const workout = (workoutId && entities.get('workouts'))?entities.get('workouts').get(workoutId):null;
	
	
	return{
		workout,
		initialValues : workout ? workout.toJS() : {},
		exercises: entities.get('exercises'),
	}
}




export default connect(mapStateToProps, {saveWorkouts})(NewWorkout);