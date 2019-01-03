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
	
} from "native-base";
import { Image, View } from 'react-native';
import { Tab, Tabs, ScrollableTab, Card, CardItem, } from 'native-base';

import Workout from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
// import { loadWorkoutExercises } from '../../models/workouts';
// import {  TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

export interface Props {
	navigation: any;
	exercises: Map<String, Object>;
	entities: any;
	// loadWorkoutExercises: (data) => Action<any>;
}

export interface State {}

class WorkoutContainer extends React.Component<Props, State> {

	render() {
		const { navigation, exercises, entities } = this.props;
		const workout = navigation.getParam('workout', []);
		console.log('workout',workout);
		
		const days = workout.get('days');

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Workout</Title>
					</Body>
					<Right />
				</Header>
				
				<Content>
					<View style={{position:'relative',height: 250}}>
						<Image 
							source={{uri: Workout['mIP'] + '/upload/file?s=workouts&f=' + workout.get('workoutImg') +'&d=muscle.png'}} 
							style={{position: 'absolute',width: '100%',height: '100%',}}
						/>
						<View style={{position: 'absolute',width: '100%',height: '100%',backgroundColor: '#FFF', opacity:0.8}}></View>
						<Text style={{textAlign:'center', fontSize:25, marginTop:40, fontWeight:'bold'}}>{workout.get('workoutName')}</Text>
						<Button style={{marginLeft:'auto',marginRight:'auto',marginTop:30, backgroundColor:'#47525e'}} onPress={() => this.props.navigation.navigate("WorkoutTimer")}>
							<Text>Start Workout</Text>
						</Button>
						<Button style={{marginLeft:'auto',marginRight:'auto',marginTop:15, backgroundColor:'#47525e'}}>
							<Text>History</Text>
						</Button>
					</View>

					<Text>{ workout.get('description') }</Text>

					<Tabs renderTabBar={ ()=> <ScrollableTab /> }>

						{
							days && days.map((day, i) => {
								return<Tab key={"day_" + i} heading={"Day" + (i*1 + 1*1)}>
									{
										day && day.valueSeq().map((exercise, e)=>{
											return <View key={"exercise_"+e+"_"+Math.random()}>
												{
													exercise && exercise.size>0 && exercise.map((ex, ei)=>{
														let _set = 0;
														let _rep = 0;
														let _rm = 0;
														let _rest = 0;
														ex.get('sets') && ex.get('sets').map((set)=>{
															_set +=  set.get('set');
															_rep +=  set.get('rep');
															_rm +=  set.get('rm');
															_rest +=  set.get('rest');
														})

														let _exercise = entities.getIn(['exercises', ex.get('exercise')]);
														
														return 	<Card key={"ex"+ei+"_"+Math.random()}>
																	<CardItem>
																		<Body>
																			<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap', alignItems: "center" }}>
																				<View style={{ width: "25%" }}>
																					{ <Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f=' + _exercise.get('exerciseImg')+'&d=muscle.png'}} style={{height: 50}}/> }
																				</View>
																				<View style={{ width: "75%", paddingLeft: 15 }}>
																					<Text>
																						{ _exercise.get('exerciseName') }
																					</Text>
																					<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
																						<View style={{width:"50%"}}>
																							<Text style={{color: "#CCC"}}>
																								Sets: {_set}
																							</Text>
																						</View>
																						<View style={{width:"50%"}}>
																							<Text style={{color: "#CCC"}}>
																								Reps: {_rep}
																							</Text>
																						</View>
																					</View>
																					<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
																						<View style={{width:"50%"}}>
																							<Text style={{color: "#CCC"}}>
																								RM: {_rm}
																							</Text>
																						</View>
																						<View style={{width:"50%"}}>
																							<Text style={{color: "#CCC"}}>
																								Rest: {_rest}
																							</Text>
																						</View>
																					</View>
																					
																				</View>
																			</View>
																		</Body>
																	</CardItem>
																</Card>;

													})
												}
											</View>;
										})
									}</Tab>;
							})
						}
					</Tabs>
			

				</Content>
			</Container>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { entities } = state;
	const exercises = entities.get('exercises');
	
	
    return {
		exercises,
		entities,
    };
}

// export default connect(mapStateToProps, {loadWorkoutsUser})(HomeContainer);
export default connect(mapStateToProps, null)(WorkoutContainer);
