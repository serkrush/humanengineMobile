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
	Item, Input
} from "native-base";
import { Action } from 'redux';

import { saveWorkouts } from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
import { Field, reduxForm } from "redux-form";

const required = value => (value ? undefined : "Required");

export interface Props {
    navigation: any;
	saveWorkouts: (data) => Action;
}

export interface State {
	countSets: number;
}

class SetsContainer extends React.Component<Props, State> {
	
	constructor(props) {
		super(props);
		this.state = {
			countSets: 0,
			text: 0 
		};

		this.loopSets = this.loopSets.bind(this);
		this.newWorkout = this.newWorkout.bind(this);
		this.renderInput = this.renderInput.bind(this);
	}

	newWorkout(data) {
		const { saveWorkouts } = this.props;
		console.log('data sets', data);
		
		saveWorkouts(data);
		this.props.navigation.navigate("NewWorkout", {});
	}

	renderInput({ input, meta: { touched, error } }) {

		return (
			<Item error={error && touched}>
				<Input
					// ref={c => (this.textInput = c)}
					placeholder="Set"
					secureTextEntry={false}
					keyboardType="numeric"
					returnKeyType="go"
					onChangeText={(text) => this.setState({text})}
        			value={this.state.text}
					{...input}
				/>
			</Item>
		);
	}

	loopSets(countSets){
		console.log('loopSets',countSets,this.state.countSets);
		<Field 
			name={"days[0].exercises[0].sets[0].set" }
			component={this.renderInput} 
			validate={[required]} 
			placeholder="Set"
		/>
		let vLoopSets = [];
		let i = 0;
		for (i=0;i<=countSets;i++){
			vLoopSets.push(<View key = {i}>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].set" }
									component={this.renderInput} 
									validate={[required]} 
									placeholder="Set"
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].rep" }
									component={this.renderInput} 
									validate={[required]} 
									placeholder="Rep"
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].rest" }
									component={this.renderInput} 
									validate={[required]} 
									placeholder="Rest"
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].rm" }
									component={this.renderInput} 
									validate={[required]} 
									placeholder="RM"
								/>
							</View>
			// <View key = {i}><Text>loop</Text></View>
			);
		}
		return vLoopSets;
		
	}
    
	render() {
		const { handleSubmit } = this.props;
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
