import * as React from "react";
import { connect } from "react-redux";
import ViewWorkout from "../HomeContainer/ViewWorkout";
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
} from "native-base";
// import { AppRegistry, FlatList, StyleSheet, View } from 'react-native';

import { Map } from 'immutable';
import styles from '../../stories/screens/Home/styles';//"../stories/screens/styles";
import UserContext from "../../UserContext";

export interface Props {
	navigation: any;
	data: Object;
	workouts: Map<String, Object>;
	loadWorkoutsUser: () => Action<any>;
}

export interface State {
	userId: string;
}
class HomeContainer extends React.Component<Props, State> {
	
	constructor(props) {
		super(props);
		this.renderContainer = this.renderContainer.bind(this);
	}

	async componentDidMount() {
		const { loadWorkoutsUser} = this.props;
		Auth.getToken().then(token => console.log("token", token));
		
		const userId = await Auth.getUserId() || '';
		this.setState({ userId });
		loadWorkoutsUser();
	}
	
	renderContainer(user) {
		const { workouts, navigation } = this.props;
		let workoutsUser = [];
		let workoutsPublic = [];
		workouts && workouts.map((t, i) => {
			
			if (t.get('userId')===user.userId){
				workoutsUser.push(t);
			}
			if (t.get('status')==='public'){
				workoutsPublic.push(t);
			}
			
		});

		return <Container style={styles.container}>
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
			<Content style={styles.contentPadding}>
				<Text style={{ fontSize:20, fontWeight: 'bold' }}>My Workouts</Text>
				{(workoutsUser)?<ViewWorkout navigation={navigation} workouts={workoutsUser} />:null}
				<Text style={{ fontSize:20, fontWeight: 'bold', marginTop:10 }}>Templates</Text>
				{(workoutsPublic)?<ViewWorkout navigation={navigation} workouts={workoutsPublic} />:null}
			</Content>
			<Button 
				onPress={() => this.props.navigation.navigate("NewWorkout", {})} 
				style={{position:"absolute",right:10,bottom:20,borderRadius:50,backgroundColor:"#00a6ff"}}
			>
				<Text> + </Text>
			</Button>
		</Container>
	}

	public render() {
		return <UserContext.Consumer>
				{
					this.renderContainer
				}
			</UserContext.Consumer>
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
