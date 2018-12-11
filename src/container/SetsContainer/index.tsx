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

import Workout from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
// import { loadWorkoutExercises } from '../../models/workouts';
// import {  TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { Field, FieldArray, reduxForm } from "redux-form";
import { List } from 'immutable';

const required = value => (value ? undefined : "Required");

export interface Props {
    navigation: any;
    // exercises: Map<String, Object>;
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
	}

	// componentDidMount() {
	// 	const { loadCategories} = this.props;
	// 	loadCategories();
	// }

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
			vLoopSets.push(<View key = {i}><Text>loop</Text></View>);
		}
		return vLoopSets;
		
	}
    
	render() {
		// const { navigation, exercises, entities } = this.props;
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
							<Field 
								name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[0].sets[0].set" }
								component={this.renderInput} 
								validate={[required]} 
							/>
							<Field 
								name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[0].sets[0].weight" }
								component={this.renderInput} 
								validate={[required]} 
							/>
							<Field 
								name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[0].sets[0].reps" }
								component={this.renderInput} 
								validate={[required]} 
							/>
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



export default connect(null, null)(CategoriesForm);
