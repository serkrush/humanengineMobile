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
	Item, Input, Card, CardItem, Radio
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
	// jsonDays: any;
}

export interface State {
	selected: string,
}

class ExercisesContainer extends React.Component<Props, State> {
	
	constructor(props) {
		super(props);
		this.state = {
			selected: ''
		};
		this.RadioButton = this.RadioButton.bind(this);
	}

	RadioButton({ selected, val, input, changeState, indexDay, exercise }) {
		return (
			<Radio
				{...input}
				onPress={() => {input.onChange(val); changeState(); this.props.navigation.navigate("ExerciseDescription", {exercise: exercise, indexDay:indexDay})  }}
				selected={selected === val}
				style={{position:"absolute",height:'100%',width:'100%',opacity:0}}
				// color="transparent"
			/>
		)
	}

	onPress (selected: string) {
		this.setState({
			selected
		})
	}
    
	render() {
		const { entities } = this.props;
		const ex = this.props.navigation.getParam('exercises', []);
        
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
                                    
                                        
										return <TouchableOpacity 
													key={"exercise_"+i+"_"+Math.random()} 
													style={{width:"50%"}} 
												// 	onPress={() => {this.props.navigation.navigate("ExerciseDescription", {
												// 																			exercise: _exercise,
												// 																			indexDay: this.props.navigation.getParam('indexDay', 0),
												// 																			countDay: this.props.navigation.getParam('countDay', 0),
												// 																			categoryId: this.props.navigation.getParam('categoryId', null),
												// 																			// selectExercise: _exercise.get('id'),
												// 																			// jsonDays: jsonDays
																														
												// })}}
												>
													<View>
														<Card>
															<CardItem cardBody>
																<Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f=' + _exercise.get('exerciseImg') +'&d=muscle.png'}} style={{height: 125, width: null, flex: 1}}/>
															</CardItem>
															<CardItem cardBody>
																<Text>{_exercise.get('exerciseName')}</Text>
															</CardItem>
														</Card>
														<Field
															name={'days[' + this.props.navigation.getParam('indexDay', 0) + '].exercises[0].exercise'}
															component={this.RadioButton}
															label={_exercise.get('exerciseName')}
															val={_exercise.get('id')}
															selected={this.state.selected}
															indexDay = { this.props.navigation.getParam('indexDay', 0) }
															exercise = { _exercise }
															changeState={() => this.onPress(_exercise.get('id'))}
														/>
													</View>
												</TouchableOpacity>;
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
	console.log('mapStateToProps');

	const { entities } = state;
	const exercises = entities.get('exercises');
	
	
    return {
        exercises,
		entities,
    };
}

export default connect(mapStateToProps, null)(CategoriesForm);
