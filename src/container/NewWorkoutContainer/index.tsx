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
// import { saveWorkouts } from '../../models/workouts';
import { Field, FieldArray, reduxForm, change, arrayRemoveAll } from "redux-form";
import Workout from "../../models/workouts";


const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	workout: Map<string, any>;
    exercises: Map<string, any>;
	// saveWorkouts: (data) => Action;
}

export interface State {
	_fields: any,
	indexDay: number,
	indexExercise: number
}
class NewWorkoutContainer extends React.Component<Props, State> {
	textInput: any;
	constructor(props: Props) {
		
		super(props);
		// .days[0].exercises.length
		const workoutDays = this.props.workout.get('days').toJS();
		
		this.state = {
			active: 'true',
			indexDay: 0,
			indexExercise: workoutDays?workoutDays[0].exercises.length:0
		};
		// this.addWorkout = this.addWorkout.bind(this);
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
						<FieldArray name="days" component={renderDays} _this={this} _workout={workout} />
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
						
						<Button style={{ backgroundColor: '#ff9052' }} onPress={() => this.setState({_fields: this.state._fields.push({})}) }>
							<Text style={{position:"absolute", left:-80, color:"#000"}}>{(this.state.active)?"Day":""}</Text>
							<Text>+</Text>
						</Button>
						
						<Button 
							style={{ backgroundColor: '#ff9052' }} 
							onPress={() => this.props.navigation.navigate("Categories", {
																							indexDay: this.state.indexDay,
																							indexExercise: this.state.indexExercise,
																							countDay: (this.state._fields)?this.state._fields.length:0
																						})} 
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


const renderDays = ({ fields, _this, _workout, meta: { error, submitFailed } }) => {
	_this.setState({_fields: fields});

	console.log('fields',fields);
	// console.log('exercises', _this.props.exercises.getIn([exercise]));
	

	const days = _workout.get('days').toJS();

	console.log('days', days[1].exercises.length);
	

	if (fields.length==0){fields.push({})};
	return <View>
		<Tabs renderTabBar={()=> <ScrollableTab />} onChangeTab={({ i, ref }) => {_this.setState({indexDay: i});_this.setState({indexExercise: days[i].exercises.length});}}>
					{
						fields.map((day, index) => (
							<Tab 
								key={"day_"+index}
								heading={"Day"+(index*1+1*1)}
							>
		<View>
			{days && days.map((d,i)=>{
				if (index==i){
					return <Root key={"day_"+i+Math.random()}>
						{d.exercises.map((_d,_i)=>{
							let exerciseInfo =  _this.props.exercises.getIn([_d.exercise]);
							let vSets = 0;
							let vReps = 0;
							let vRm = 0;
							let vRest = 0;
							_d.sets.map((s,is)=>{
								vSets+=s.set;
								vReps+=s.rep;
								vRm+=s.rm;
								vRest+=s.rest;
							})


							var BUTTONS = [ "Change", "Delete", "Cancel" ];
							var DESTRUCTIVE_INDEX = 3;
							var CANCEL_INDEX = 4;
							
							
							return 	<TouchableOpacity 
										key={"exercise_"+_i+Math.random()}
										onPress={() =>{
											ActionSheet.show(
												{
													options: BUTTONS,
													cancelButtonIndex: CANCEL_INDEX,
													destructiveButtonIndex: DESTRUCTIVE_INDEX,
												},
												buttonIndex => {
													if (buttonIndex==1){
														Alert.alert(
															'Delete',
															'Delete exercise?',
															[
																{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
																{text: 'OK', onPress: () => {console.log('fields3',_this.props.newWorkout);
																arrayRemoveAll('newWorkout', 'days')/*fields.remove(0)*/
																// change('newWorkout','values.days', undefined)
																
																}},
															],
															{ cancelable: false }
														);
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
														<Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f=' + exerciseInfo.get('exerciseImg') +'&d=muscle.png'}} style={{ height: 75, width: 90, flex: 1}}/>
													</View>
													<View style={{width:"70%", paddingLeft: 5}}>
														<Text>{exerciseInfo.get('exerciseName')}</Text>
														<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
															<View style={{width:'50%'}}>
																<Text>Sets: {vSets}</Text>
															</View>
															<View style={{width:'50%'}}>
																<Text>Reps: {vReps}</Text>
															</View>
															<View style={{width:'50%'}}>
																<Text>1RM: {vRm}</Text>
															</View>
															<View style={{width:'50%'}}>
																<Text>Rest: {vRest}</Text>
															</View>
														</View>
													</View>
												</Body>
											</CardItem>
										</Card>
									</TouchableOpacity>
						})}
					</Root>
				}
			})}
		</View>
		</Tab>
	))
}
</Tabs>
	</View>
	

	
	
	
}

const NewWorkout = reduxForm({
	form: "newWorkout",
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
	enableReinitialize: true,
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

export default connect(mapStateToProps, null)(NewWorkout);
