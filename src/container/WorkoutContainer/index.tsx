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
		
	// componentDidMount() {
	// 	const { loadWorkoutExercises, navigation} = this.props;
		
	// 	loadWorkoutExercises(navigation.getParam('workout', []));
	// }

	render() {
		const { navigation, exercises, entities } = this.props;
		const workout = navigation.getParam('workout', []);
		const days = workout.get('days');

		if ( entities && entities.has('exercises') ){
			console.log('cool!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', entities.getIn(['exercises', '5bd7112891c9f47706258a96']));	
			console.log('cool2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', exercises.has('5bd7112891c9f47706258a96'));	
		}
		console.log('exercise', exercises);
		console.log('exercise has', "5bd7112891c9f47706258a96" in exercises);
		

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent>
						<Icon
							active
							name="menu"
							onPress={() => this.props.navigation.navigate("DrawerOpen")}
						/>
						</Button>
					</Left>
					<Body>
						<Title>Home</Title>
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
						<Button style={{marginLeft:'auto',marginRight:'auto',marginTop:30, backgroundColor:'#47525e'}}>
							<Text>Start Workout</Text>
						</Button>
						<Button style={{marginLeft:'auto',marginRight:'auto',marginTop:15, backgroundColor:'#47525e'}}>
							<Text>History</Text>
						</Button>
					</View>

					<Text>{workout.get('description')}</Text>

					<Tabs renderTabBar={()=> <ScrollableTab />}>

						{
							days && days.map((day, i) => {
								return<Tab key={"day_" + i} heading={"Day" + (i*1 + 1*1)}>
									{
										day && day.valueSeq().map((exercise, e)=>{
											return <View key={"exercise_"+e+"_"+Math.random()}>
												{
													exercise && exercise.size>0 && exercise.map((ex, ei)=>{
														// console.log('ex', ex.get('exercise'), ex.get('sets'));
														let _exercise = entities.getIn(['exercises', ex.get('exercise')]);
														
														
														
														return 	<Card key={"ex"+ei+"_"+Math.random()}>
																	<CardItem>
																		<Body>
																			<Text>
																				{_exercise.get('exerciseName')}
																				
																				{<Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f=' + _exercise.get('exerciseImg')+'&d=muscle.png'}} style={{height: 50, width: 50}}/>}
																			</Text>
																		</Body>
																	</CardItem>
																</Card>;
														// return <Text key={"ex"+ei+"_"+Math.random()}>
														// 	<View>{ex.get('exercise')}</View>
														// </Text>;
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
