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
    exercises: Map<String, Object>;
	entities: any;
}

export interface State {}

class ExerciseDescriptionContainer extends React.Component<Props, State> {
    textInput: any;

	// componentDidMount() {
	// 	const { loadCategories} = this.props;
	// 	loadCategories();
	// }
    
	render() {
		const { navigation, exercises, entities } = this.props;
        const ex = navigation.getParam('exercise', []);
        console.log('ex', ex);
        
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Exercise</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Form>
                        <Text style={{textAlign:"center"}}>{ex.get('exerciseName')}</Text>
                        <Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f=' + ex.get('exerciseImg') +'&d=muscle.png'}} style={{height: 200, width: null, flex: 1}}/>
                        <Text>{ex.get('description')}</Text>
                        <Button style={{marginLeft:"auto",marginRight:"auto"}} onPress={() => this.props.navigation.navigate("Sets")}>
                            <Text>Next</Text>
                        </Button>
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
})(ExerciseDescriptionContainer);

const mapStateToProps = (state, props) => {

	// const { entities } = state;
	// const exercises = entities.get('exercises');
	// const indexDay = props.navigation.getParam('indexDay', 0);
	// const countDay = props.navigation.getParam('countDay', 0);

	// let arrDaysJson= [];
	// let i;
	// for (i=0; i<=countDay; i++){
	// 	if (i==indexDay){
	// 		arrDaysJson.push({exercises:[{category: props.navigation.getParam('categoryId', null)}]});
	// 	} else {
	// 		arrDaysJson.push({});
	// 	}
	// }
	// console.log('arrDaysJson',arrDaysJson);
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	
	
	
	
    return {
		initialValues: {
			est: '1111',
			// days:[
			// 	{
			// 		exercises:[
			// 			{
			// 				exercise: '111'
			// 			}
			// 		]
			// 	},
			// 	{
			// 		exercises:[
			// 			{
			// 				exercise: '2222'
			// 			}
			// 		]
			// 	},
			// 	{
			// 		exercises:[
			// 			{
			// 				exercise: '333'
			// 			}
			// 		]
			// 	},
			// ]
		}
	
    };
}

export default connect(mapStateToProps, null)(CategoriesForm);
