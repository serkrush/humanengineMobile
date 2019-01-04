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
	Card, CardItem, Radio
} from "native-base";
import { Image, TouchableOpacity } from 'react-native';

import Workout from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
import { Field, FieldArray, reduxForm } from "redux-form";

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

	RadioButton({ selected, val, input, changeState, indexDay, exercise, indexExercise }) {
		return (
			<Radio
				{...input}
				onPress={() => {input.onChange(val); changeState(); console.log('exercise:', exercise, 'indexDay:',indexDay, 'indexExercise:',indexExercise); this.props.navigation.navigate("ExerciseDescription", {exercise: exercise, indexDay:indexDay, indexExercise:indexExercise})  }}
				selected={selected === val}
				style={{position:"absolute",height:'100%',width:'100%',opacity:0}}
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
									console.log('eeeeeeeee',e);
									
									let _exercise = entities.getIn(['exercises', e]);
									const inExercise = this.props.navigation.getParam('indexExercise', 0);
                                        
										return <TouchableOpacity 
													key={"exercise_"+i+"_"+Math.random()} 
													style={{width:"50%"}} 
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
															name={'days[' + this.props.navigation.getParam('indexDay', 0) + '].exercises[' + inExercise + '].exercise'}
															component={this.RadioButton}
															label={_exercise.get('exerciseName')}
															val={_exercise.get('id')}
															selected={this.state.selected}
															indexDay = { this.props.navigation.getParam('indexDay', 0) }
															indexExercise = { this.props.navigation.getParam('indexExercise', 0) }
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
