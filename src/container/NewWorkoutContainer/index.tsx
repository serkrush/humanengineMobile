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
	Item, Input, Tab, Tabs, ScrollableTab
} from "native-base";

import styles from '../../stories/screens/Home/styles';
import { changeWorkout } from '../../models/workouts';
// import {  TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { Field, FieldArray, reduxForm } from "redux-form";


const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	changeWorkout: (data) => Action;
}

export interface State {
}
class NewWorkoutContainer extends React.Component<Props, State> {
	textInput: any;
	constructor(props: Props) {
		
		super(props);
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
		console.log("data", data);

		const { changeWorkout } = this.props;
		changeWorkout(data);
	}

	render() {
		const {error, handleSubmit } = this.props;		

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent>
						<Icon
							active
							name="menu"
							onPress={() => this.props.navigation.navigate("DrawerOpen")}
						/>
						</Button>
					</Left>
					<Body>
						<Title>Workout</Title>
					</Body>
					<Right />
				</Header>
				<Content>
					<Form>
						<Field 
							name="workoutName" 
							component={this.renderInput} 
							validate={[required]} />

						<FieldArray name="days" component={renderDays} _this={this} />
						<Button 
				onPress={() => this.props.navigation.navigate("Categories", {})} 
				style={{position:"absolute",right:10,bottom:20,borderRadius:50,backgroundColor:"#00a6ff"}}
			>
				<Text> add exercise </Text>
			</Button>
						{
							error && <View padder>
								<Text style={{color: "red", textAlign: 'center'}}>{error}</Text>
							</View>
						}
						<Button 
							onPress={handleSubmit(this.addWorkout)}
							style={{position:"absolute",right:10,bottom:20,borderRadius:50,backgroundColor:"#00a6ff"}}
						>
							<Text> Save </Text>
						</Button>
					</Form>
					
				</Content>
			</Container>
		);
	}
}



const renderDays = ({ fields, _this, meta: { error, submitFailed } }) => {
	console.log('fields',fields);
	console.log('_this',_this);
// 	fields.map((day, index) => {
// 		console.log('day',day);
// 		return <Text>www</Text>;
// 	});
	// return <Button onPress={fields.push({})}>
	// 		<Text>qqq</Text>
	// 	</Button>;
	if (fields.length==0){fields.push({})};
	return	<View>
				<Button onPress={() => fields.push({})}>
					<Text>qqq</Text>
				</Button>
				
				{console.log('fields', fields.size, fields.length)
				}
				<Tabs renderTabBar={()=> <ScrollableTab />}>
					{fields.map((day, index) => (
						<Tab key={"day_"+index} heading="Tab1">
							<Text>1111</Text>
						</Tab>
					))}
				</Tabs>
			</View>;
	
//     // return <div>
//     //     <button 
//     //         type="button" 
//     //         onClick={() => fields.push({})}
//     //         className = "w-32 py-2 mt-4 rounded bg-orange-500 hover:bg-orange-400 text-white">
//     //         Add Day
//     //     </button>
        
//     //     <div className="text-red-400">
//     //         {submitFailed && error && <span>{error}</span>}
//     //     </div>
    

//     // </div>
}

const NewWorkout = reduxForm({
	form: "newWorkout",
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(NewWorkoutContainer);

// const mapStateToProps = (state, props) => {
// 	const { entities } = state;
// 	const exercises = entities.get('exercises');
	
	
//     return {
// 		exercises,
// 		entities,
//     };
// }

// export default connect(mapStateToProps, {loadWorkoutsUser})(HomeContainer);
export default connect(null, {changeWorkout})(NewWorkout);
