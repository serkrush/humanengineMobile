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
	Item, Input, Tab, Tabs, ScrollableTab
} from "native-base";
import { Action } from 'redux';
import { loadCategories } from '../../models/categories';

// import Workout from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
// import { loadWorkoutExercises } from '../../models/workouts';
// import {  TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { Field, FieldArray, reduxForm } from "redux-form";

export interface Props {
	navigation: any;
	categories: Map<String, Object>;
	loadCategories: (data) => Action<any>;
}

export interface State {}

class CategoriesContainer extends React.Component<Props, State> {
    textInput: any;

	componentDidMount() {
		const { loadCategories} = this.props;
		loadCategories();
	}
    
	render() {
		const { navigation, categories } = this.props;
		console.log('categories',categories);
		
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Categories</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Form>
                        
                    </Form>
					<Text>Cat</Text>

				</Content>
			</Container>
		);
	}
}

const CategoriesForm = reduxForm({
	form: "newWorkout",
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(CategoriesContainer);

const mapStateToProps = (state, props) => {
	const { entities } = state;
	const categories = entities.get('categories');
	
	
    return {
		categories,
		entities,
    };
}

export default connect(mapStateToProps, {loadCategories})(CategoriesForm);
