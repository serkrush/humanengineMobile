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
	List,
	ListItem,
	
} from "native-base";
// import { AppRegistry, FlatList, StyleSheet, View } from 'react-native';

import styles from '../../stories/screens/Home/styles';//"../stories/screens/styles";

export interface Props {
	navigation: any;
}
// X4j9WHAuvuMS
export interface State {}
class WorkoutContainer extends React.Component<Props, State> {

	render() {
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
					<Text>11111</Text>
				</Content>
			</Container>
		);
	}
}

// const mapStateToProps = (state,) => {
// 	const { entities } = state;
// 	const workouts = entities.get('workouts');
	
//     return {
// 		workouts: workouts,
//     };
// }

// export default connect(mapStateToProps, {loadWorkoutsUser})(HomeContainer);
export default connect(null, null)(WorkoutContainer);
