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

class ExercisesContainer extends React.Component<Props, State> {
    textInput: any;

	// componentDidMount() {
	// 	const { loadCategories} = this.props;
	// 	loadCategories();
	// }
    
	render() {
		const { navigation, exercises, entities } = this.props;
        const ex = navigation.getParam('exercises', []);
        
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Exercises</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Form>
                        <View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
                            {
                                ex && ex.map((e,i)=>{
                                    let _exercise = entities.getIn(['exercises', e]);
                                    console.log('_exercise',_exercise, _exercise.get('exerciseName'));
                                    
                                        
                                        return <TouchableOpacity key={"exercise_"+i+"_"+Math.random()} style={{width:"50%"}} onPress={() => this.props.navigation.navigate("ExerciseDescription", {exercise: _exercise})}><View><Card>
                                            <CardItem cardBody>
                                                <Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f=' + _exercise.get('exerciseImg') +'&d=muscle.png'}} style={{height: 125, width: null, flex: 1}}/>
                                            </CardItem>
                                            <CardItem cardBody>
                                                <Text>{_exercise.get('exerciseName')}</Text>
                                            </CardItem>
                                            </Card>
                                        </View></TouchableOpacity>;
                                })
                            }
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
})(ExercisesContainer);

const mapStateToProps = (state, props) => {
	const { entities } = state;
	const exercises = entities.get('exercises');
	
	
    return {
        exercises,
        entities
    };
}

export default connect(mapStateToProps, null)(CategoriesForm);
