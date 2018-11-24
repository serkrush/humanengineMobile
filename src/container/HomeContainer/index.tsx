import * as React from "react";
import { connect } from "react-redux";
//import Home from "../../stories/screens/Home";
import ViewWorkout from "../HomeContainer/ViewWorkout";
//import datas from "./data";
// import { loadWorkoutsUser } from '../../models/workouts';
import { loadTraining } from '../../models/training';
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
	loadTraining: () => Action<any>;
	trainings: Map<String, Object>;
}
// X4j9WHAuvuMS
export interface State {}
class HomeContainer extends React.Component<Props, State> {

	componentDidMount() {
		const { loadTraining } = this.props;
		Auth.getToken().then(token => console.log("token", token));
        loadTraining();
	}

	render() {
		const { trainings } = this.props;
		console.log('trainings', trainings);
		
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
					<ViewWorkout trainings={trainings} />
					
					
					{/* <List>
						{trainings && trainings.map((t, i) => (
						<ListItem
							key={'training_' + i}
						>
							kkkk
						</ListItem>
						))}
					</List> */}
				</Content>
			</Container>
		);
	}
}

const mapStateToProps = (state) => {
    const { entities } = state;
	
    return {
		trainings: entities.get('training'),
    };
}

export default connect(mapStateToProps, {loadTraining})(HomeContainer);
