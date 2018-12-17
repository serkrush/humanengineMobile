import * as React from "react";
import { connect } from "react-redux";

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
	Item, Input, Card, CardItem, ScrollableTab
} from "native-base";
import { Image, TouchableOpacity } from 'react-native';
import { Action } from 'redux';
// import { loadCategories } from '../../models/categories';
import { saveWorkouts } from "../../models/workouts";

// import {Workout} from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
// import { loadWorkoutExercises } from '../../models/workouts';
// import {  TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { Field, FieldArray, reduxForm } from "redux-form";
import { List } from 'immutable';

const required = value => (value ? undefined : "Required");

export interface Props {
    navigation: any;
	saveWorkouts: (data) => Action;
	// entities: any;
}

export interface State {
	countSets: number;
}

class SetsContainer extends React.Component<Props, State> {
	
	
	constructor(props) {
		super(props);
		this.state = {
			countSets: 0
		};

		this.loopSets = this.loopSets.bind(this);
		this.newWorkout = this.newWorkout.bind(this);
	}

	newWorkout(data) {
		console.log("data", data);

		const { saveWorkouts } = this.props;
		saveWorkouts(data);
		this.props.navigation.navigate("NewWorkout", {});


		// if (valid) {
		// 	//this.props.navigation.navigate("Drawer");
		// } else {
		// 	Toast.show({
		// 		text: "Enter Valid Username & password!",
		// 		duration: 2000,
		// 		position: "top",
		// 		textStyle: { textAlign: "center" },
		// 	});
		// }
	}

	renderInput({ input, meta: { touched, error } }) {
		return (
			<Item error={error && touched}>
				<Input
					ref={c => (this.textInput = c)}
					placeholder="Set"
					secureTextEntry={false}
					{...input}
				/>
			</Item>
		);
	}

	loopSets(countSets){
		console.log('loopSets',countSets,this.state.countSets);
		let vLoopSets = [];
		let i = 0;
		for (i=0;i<=countSets;i++){
			vLoopSets.push(<View key = {i}>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[0].sets[" + i + "].set" }
									component={this.renderInput} 
									validate={[required]} 
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[0].sets[" + i + "].weight" }
									component={this.renderInput} 
									validate={[required]} 
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[0].sets[" + i + "].reps" }
									component={this.renderInput} 
									validate={[required]} 
								/>
							</View>
			// <View key = {i}><Text>loop</Text></View>
			);
		}
		return vLoopSets;
		
	}
    
	render() {
		const { handleSubmit } = this.props;
		// const ex = navigation.getParam('exercises', []); 
		console.log('this.state.countSets',this.state.countSets);
		
        
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Sets</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Form>
						<View style={styles.contentPadding}>
							{ this.loopSets(this.state.countSets) }
							<Button 
								onPress={()=>{/*let newCountSets =this.state.countSets+1*1;*/ /*this.state.countSets=this.state.countSets+1*/ this.setState({ countSets: this.state.countSets+1 })}}
							>
								<Text>Add</Text>
							</Button>
						</View>
						<View padder>
							<Button block onPress={handleSubmit(this.newWorkout)}>
								<Text>Save</Text>
							</Button>
						</View>
                    </Form>

				</Content>
			</Container>
		);
	}
}

const CategoriesForm = reduxForm({
	form: "newWorkout",
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(SetsContainer);



export default connect(null, {saveWorkouts})(CategoriesForm);
