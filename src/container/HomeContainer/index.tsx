import * as React from "react";
import { connect } from "react-redux";
//import Home from "../../stories/screens/Home";
import ViewWorkout from "../HomeContainer/ViewWorkout";
import { remove, clone, push } from "lodash";
//import datas from "./data";
// import { loadWorkoutsUser } from '../../models/workouts';
// import { loadTraining } from '../../models/training';
import { loadWorkoutsUser } from '../../models/workouts';
import { Action } from 'redux';
import Auth from "../../auth";
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
	List,
	ListItem,
	
} from "native-base";
// import { AppRegistry, FlatList, StyleSheet, View } from 'react-native';

import { Map } from 'immutable';
import styles from '../../stories/screens/Home/styles';//"../stories/screens/styles";

export interface Props {
	navigation: any;
	data: Object;
	workouts: Map<String, Object>;
	loadWorkoutsUser: () => Action<any>;
}
// X4j9WHAuvuMS
export interface State {}
class HomeContainer extends React.Component<Props, State> {
	private _userId = null;

	async componentDidMount() {
		const { loadWorkoutsUser } = this.props;
		Auth.getToken().then(token => console.log("token", token));
		this._userId = await Auth.getUserId();
		loadWorkoutsUser();
	}

	render() {
		const { workouts } = this.props;
		
		let workoutsUser = [];
		let workoutsPublic = [];
		workouts && workouts.map((t, i) => {
			if (t.get('userId')==this._userId){
				workoutsUser.push(t);
			}
			if (t.get('status')=='public'){
				workoutsPublic.push(t);
			}
			
			console.log('workoutsUser', workoutsUser, workoutsPublic);
			
		});
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
					<Text style={{ fontSize:20, fontWeight: 'bold' }}>My Workouts</Text>
					{(workoutsUser)?<ViewWorkout workouts={workoutsUser} />:null}
					<Text style={{ fontSize:20, fontWeight: 'bold', marginTop:10 }}>Templates</Text>
					{(workoutsPublic)?<ViewWorkout workouts={workoutsPublic} />:null}
				</Content>
			</Container>
		);
	}
}

const mapStateToProps = (state,) => {
	const { entities } = state;
	const workouts = entities.get('workouts');
	
    return {
		workouts: workouts,
    };
}

export default connect(mapStateToProps, {loadWorkoutsUser})(HomeContainer);
