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
	Form
} from "native-base";
import { Image } from 'react-native';

import Workout from "../../models/workouts";
import styles from '../../stories/screens/Home/styles';
import { reduxForm } from "redux-form";

export interface Props {
    navigation: any;
}

export interface State {}

class WorkoutTimerContainer extends React.Component<Props, State> {
    textInput: any;
    
	render() {
		const { navigation } = this.props;
        
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Training app</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Text>Next</Text>
				</Content>
			</Container>
		);
	}
}

const WorkoutTimerForm = reduxForm({
	form: "workoutTimer",
})(WorkoutTimerContainer);


export default connect(null, null)(WorkoutTimerForm);
