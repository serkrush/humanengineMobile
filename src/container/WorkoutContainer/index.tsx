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

import Workout from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';

export interface Props {
	navigation: any;
}

export interface State {}
class WorkoutContainer extends React.Component<Props, State> {

	render() {
		const { navigation } = this.props;
		const workout = navigation.getParam('workout', []);
		
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


			


				</Content>
			</Container>
		);
	}
}

const mapStateToProps = (state, props) => {
	console.log('state',state);
	console.log('props',props);
	
	
    return {
		// workouts: workouts,
    };
}

// export default connect(mapStateToProps, {loadWorkoutsUser})(HomeContainer);
export default connect(mapStateToProps, null)(WorkoutContainer);
