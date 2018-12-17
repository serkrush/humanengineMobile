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
	Item, Input, Tab, Tabs, ScrollableTab, Fab, Textarea
} from "native-base";

import styles from '../../stories/screens/Home/styles';
// import { saveWorkouts } from '../../models/workouts';
import { Field, FieldArray, reduxForm } from "redux-form";


const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	workout: Map<string, any>;
	// saveWorkouts: (data) => Action;
}

export interface State {
	_fields: any,
	indexDay: number
}
class NewWorkoutContainer extends React.Component<Props, State> {
	textInput: any;
	constructor(props: Props) {
		
		super(props);
		this.state = {
			active: 'true',
			indexDay: 0
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

	renderTextarea({ textarea, meta: { touched, error } }){
		return (
			<Item error={error && touched}>
				<Textarea
					ref={c => (this.textInput = c)}
					placeholder="Description"
					secureTextEntry={false}
					{...textarea}
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

	console.log('_workout', _workout);
	

	if (fields.length==0){fields.push({})};
	return	<View>
				<Tabs renderTabBar={()=> <ScrollableTab />} onChangeTab={({ i, ref }) => _this.setState({indexDay: i})}>
					{
						fields.map((day, index) => (
							<Tab 
								key={"day_"+index}
								heading={"Day"+(index*1+1*1)}
							>
								{
									_workout && _workout.size > 0 && _workout.valueSeq().map((w,i)=>{
										console.log('w',w.days);
										return <Text>111</Text>
									})
								}
							</Tab>
						))
					}
				</Tabs>
			</View>;
}

const NewWorkout = reduxForm({
	form: "newWorkout",
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
	enableReinitialize: true,
})(NewWorkoutContainer);

const mapStateToProps = (state, props) => {
	const { entities, requestResult } = state;

	let workoutId = props.workoutId;
	if (requestResult && requestResult.has('workouts') && requestResult.get('workouts').has(UPDATE)) {
		workoutId = requestResult.getIn(['workouts', UPDATE]).first();
	}
	
	const workout = (workoutId && entities.get('workouts'))?entities.get('workouts').get(workoutId):null;
	
	console.log('workoutId', workoutId, workout);
	return{
		workout,
		initialValues : workout ? workout.toJS() : {},
	}
}

export default connect(mapStateToProps, null)(NewWorkout);
