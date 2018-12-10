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

export interface Props {
    navigation: any;
    // exercises: Map<String, Object>;
	// entities: any;
}

export interface State {}

class SetsContainer extends React.Component<Props, State> {
    textInput: any;

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
    
	render() {
		// const { navigation, exercises, entities } = this.props;
        // const ex = navigation.getParam('exercises', []);
        
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
						<Field 
							name="set" 
							component={this.renderInput} 
							// validate={[required]} 
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
