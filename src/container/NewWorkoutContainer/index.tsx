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
	Item, Input, Tab, Tabs, ScrollableTab, Fab
} from "native-base";

import styles from '../../stories/screens/Home/styles';
import { changeWorkout } from '../../models/workouts';
import { Field, FieldArray, reduxForm } from "redux-form";


const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	changeWorkout: (data) => Action;
}

export interface State {
	_fields: any
}
class NewWorkoutContainer extends React.Component<Props, State> {
	textInput: any;
	constructor(props: Props) {
		
		super(props);
		this.state = {
			active: 'true'
		};
		this.addWorkout = this.addWorkout.bind(this);
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

	addWorkout(data) {
		const { changeWorkout } = this.props;
		changeWorkout(data);
	}

	render() {	

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Workout</Title>
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
						<FieldArray name="days" component={renderDays} _this={this} />
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
						
						<Button style={{ backgroundColor: '#ff9052' }} onPress={() => this.props.navigation.navigate("Categories", {})} >
							<Text style={{position:"absolute", left:-80, color:"#000"}}>{(this.state.active)?"Exercise":""}</Text>
							<Text>+</Text>
						</Button>
					</Fab>
				</View>
			</Container>
		);
	}
}


const renderDays = ({ fields, _this, meta: { error, submitFailed } }) => {
	_this.setState({_fields: fields})
	if (fields.length==0){fields.push({})};
	return	<View>
				<Tabs renderTabBar={()=> <ScrollableTab />}>
					{fields.map((day, index) => (
						<Tab key={"day_"+index} heading={"Day"+(index*1+1*1)} >
								<Text>1111</Text>
						</Tab>
					))}
				</Tabs>
			</View>;
}

const NewWorkout = reduxForm({
	form: "newWorkout",
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(NewWorkoutContainer);

export default connect(null, {changeWorkout})(NewWorkout);
