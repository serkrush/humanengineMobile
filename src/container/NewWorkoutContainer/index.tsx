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
import { Field, FieldArray, reduxForm, InjectedFormProps } from "redux-form";


const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	changeWorkout: (data) => Action;
}

export interface State {
	days : number;
}
class NewWorkoutContainer extends React.Component<Props, State> {
	textInput: any;
	constructor(props: Props) {
		
		super(props);
		this.state = {
            days: 1,
            // myError: ''
        };
		this.addWorkout = this.addWorkout.bind(this);
		this.dayPlus = this.dayPlus.bind(this);
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

	dayPlus(){
		this.state.set('days',5);
	}

	

	render() {
		const {error, handleSubmit, fDays } = this.props;

		console.log('days', this.state.days);
		

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



						{
							error && <View padder>
								<Text style={{color: "red", textAlign: 'center'}}>{error}</Text>
							</View>
						}
						<Button 
							onPress={handleSubmit(this.addWorkout)}
							style={{position:"absolute",right:10,bottom:20,borderRadius:50,backgroundColor:"#00a6ff"}}
						>
							<Text> + </Text>
						</Button>
					</Form>




						<Tabs renderTabBar={()=> <ScrollableTab />}>
							<Tab heading="Tab1">
								<Text>1111</Text>
							</Tab>
							<Tab heading="Tab2">
								<Text>2222</Text>
							</Tab>
							<Tab heading="Tab3">
								<Text>333</Text>
							</Tab>
							<Tab heading="Tab4">
								<Text>4444</Text>
							</Tab>
							<Tab heading="Tab5">
								<Text>555</Text>
							</Tab>
						</Tabs>








					
				</Content>


				<View style={{position:"absolute",right:10,bottom:20,flex: 1, flexDirection: "row", flexWrap: 'wrap'}}>
					<Text>Day</Text>
					<Button 
						onPress={()=> <Text>1111</Text>}
						style={{borderRadius:50,backgroundColor:"#ff9052"}}>
						<Text> + </Text>
					</Button>
				</View>
			</Container>
		);
	}
}



// const renderDays = ({ fields, _this, meta: { error, submitFailed } }) => {
// 	console.log('fields',fields);
// 	console.log('_this',_this);
// 	fields.map((day, index) => {
// 		console.log('day',day);
// 		return <Text>www</Text>;
// 	});
// 	return <Button onPress={fields.push({})}>
// 			<Text>qqq</Text>
// 		</Button>;
	
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
    
//     //     {fields.map((day, index) => (
//     //         <div key={"day_"+index} className="relative mt-4">
//     //             <button
//     //                 type="button"
//     //                 title="Remove Day"
//     //                 onClick={() => fields.remove(index)}
//     //                 className = "p-5 rounded bg-red-500 hover:bg-red-400 text-white block ml-auto absolute pin-r">
//     //                 <h3><i className="fas fa-trash-alt fa-lg"></i></h3>
//     //             </button>
                
//     //             <FieldArray name={`${day}.exercises`} component={renderExercises} exercises={exercises} categories={categories} indexDay={index} _this={_this}/>
                
//     //         </div>
//     //     ))}
//     // </div>
// }

const NewWorkout = reduxForm({
	form: "newWorkout",
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
