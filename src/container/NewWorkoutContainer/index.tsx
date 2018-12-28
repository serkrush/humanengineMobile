import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { UPDATE } from "../../redux/actions";

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
	Item, Input, Tab, Tabs, ScrollableTab, Fab, Card, CardItem, ActionSheet, Root
} from "native-base";
import { Image, TextInput, TouchableOpacity, Alert } from 'react-native';

import styles from '../../stories/screens/Home/styles';
import { saveWorkouts } from "../../models/workouts";
import { Field, FieldArray, reduxForm, getFormValues, arrayRemove, submit } from "redux-form";
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
}
class NewWorkoutContainer extends React.Component<Props, State> {

	textInput: any;
	constructor(props: Props) {
		
		super(props);
		// .days[0].exercises.length
		const workoutDays = this.props.workout.get('days').toJS();
		
		this.state = {
			active: 'true',
			addDay: false,
			indexDay: 0,
			indexExercise: workoutDays?workoutDays[0].exercises.length:0,
			flagDelete: false
		};
		this.newWorkout = this.newWorkout.bind(this);
	}

	newWorkout(data) {
		console.log('2222', data);
		
		const { saveWorkouts } = this.props;
		saveWorkouts(data);
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


	// test(){
	// 	console.log('test');
	// 	this.props.dispatch(submit('remoteSubmit'))
	// 	// dispatch(submitFormValues(values))
	// 	// const { handleSubmit } = this.props;
	// 	// this.newWorkout;
	// }

	

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
		const { handleSubmit, workout } = this.props;

		console.log('alertDelete0', this);

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
				<Content>
					<Form>
						<View style={styles.contentPadding}>
							<Field 
								name="workoutName" 
								component={this.renderInput} 
								validate={[required]} />
						</View>
						<View style={styles.contentPadding}>
							<Field 
								name="description" 
								component={this.renderTextarea} 
								validate={[required]} />
						</View>
						<FieldArray name="days" component={renderDays} _this={this} _workout={workout} _addDay={this.state.addDay} />


						<View padder>
							<Button block onPress={handleSubmit(this.newWorkout)}>
								<Text>Save</Text>
							</Button>
						</View>
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
						
						<Button style={{ backgroundColor: '#ff9052' }} onPress={() => {this.setState({addDay: true});console.log('addDay',this.state.addDay);} }>
							<Text style={{position:"absolute", left:-80, color:"#000"}}>{(this.state.active)?"Day":""}</Text>
							<Text>+</Text>
						</Button>
						
						<Button 
							style={{ backgroundColor: '#ff9052' }} 
							onPress={() => {console.log('this.state.indexDay',this.state.indexDay);
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
	const { handleSubmit } = _this.props;
	console.log('alertDelete', _this);
	//handleSubmit(this.newWorkout)
	
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
		await console.log('yes',_this.state.indexDay);
		await _fields.remove(_index);
		await _this.props.dispatch(submit('newWorkout'));
		// await _this.props.dispatch(arrayRemove('newWorkout', 'days['+_this.state.indexDay+'].exercises', _index));
		// await _this.test();// _this.props.handleSubmit(_this.newWorkout);
	
	}
	else {
		await console.log('no');
	}
}

// function submit(values) {
// 	console.log(values);
	
//     //Can log the values to the console, but submitFormValues actionCreator does not appear to be dispatched.
//     // return new Promise(function(resolve) { resolve(submitFormValues(values))} )
// }

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
			
            // <div key={"day_"+index} className="relative mt-4">
            //     <button
            //         type="button"
            //         title="Remove Day"
            //         onClick={() => fields.remove(index)}
            //         className = "p-5 block ml-auto absolute pin-r text-grey-700 hover:text-grey-600">
            //         <h3><i className="fas fa-trash-alt fa-lg"></i></h3>
            //     </button>
                
            //     <FieldArray name={`${day}.exercises`} component={renderExercises} exercises={exercises} categories={categories} indexDay={index} _this={_this}/>
                
            // </div>
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
				
				var BUTTONS = [ "Change", "Delete" ];
				// var DESTRUCTIVE_INDEX = 3;
				// var CANCEL_INDEX = 4;
				return 	<TouchableOpacity 
							key={"exercise_"+index+Math.random()}
							onPress={() =>{
								ActionSheet.show(
									{
										options: BUTTONS,
									},
									buttonIndex => {
										if (buttonIndex==1){
											console.log('index1',index);
											
											alertDelete(fields,index,_this);
											// fields.remove(index);
											// _this.props.handleSubmit(_this.newWorkout)

										}
										
										_this.setState({ clicked: BUTTONS[buttonIndex] });

									}
								)
							}}
						>
							<Card>
								<CardItem>
									<View><Button 
											onPress={() =>{
												console.log('index2',index);
												fields.remove(index)
											}}
										>
											<Text>Del{index}</Text>
										</Button></View>
									<Body style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
										<View style={{width:"30%"}}>
											<Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f='+ exerciseImg +'&d=muscle.png'}} style={{ height: 75, width: 90, flex: 1}}/>
										</View>
										<View style={{width:"70%", paddingLeft: 5}}>
											{<FieldArray name={`${exercise}.sets`} component={renderSets} sets={exerciseSetsInfo} />}
											{/* {(exerciseSetsInfo===null)?<FieldArray name={`${exercise}.sets`} component={renderSets} sets={exerciseSetsInfo} />:<Text></Text>} */}
										</View>
									</Body>
								</CardItem>
							</Card>
						</TouchableOpacity>
			}
		)}
	</View>
}

const renderSets = ({ fields, indexExercise, sets, exercises, categories, meta: { error, submitFailed } }) => {
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
				<Text>name</Text>
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
	onSubmit: (data) => { console.log('data',data);  },
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




export default connect(mapStateToProps, {saveWorkouts, mapDispatchToProps})(NewWorkout);
