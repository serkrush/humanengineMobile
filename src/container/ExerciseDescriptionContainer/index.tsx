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
    exercises: Map<String, Object>;
	entities: any;
}

export interface State {}

class ExerciseDescriptionContainer extends React.Component<Props, State> {
    textInput: any;
    
	render() {
		const { navigation } = this.props;
        const ex = navigation.getParam('exercise', []);
        
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Exercise</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Form>
                        <Text style={{textAlign:"center",fontSize:17,fontWeight:"bold"}}>{ex.get('exerciseName')}</Text>
                        <Image source={{uri: Workout['mIP'] + '/upload/file?s=exercises&f=' + ex.get('exerciseImg') +'&d=muscle.png'}} style={{height: 200, width: null, flex: 1, marginTop:20}}/>
                        <Text style={{marginTop:20}}>{ex.get('description')}</Text>
						<Button 
							style={{marginLeft:"auto",marginRight:"auto", marginTop:20}} 
							onPress={() => this.props.navigation.navigate("Sets",{
								indexDay: this.props.navigation.getParam('indexDay', 0),
								indexExercise: this.props.navigation.getParam('indexExercise', 0),
								countDay: this.props.navigation.getParam('countDay', 0),
								categoryId: this.props.navigation.getParam('categoryId', null),
								exerciseId: ex.get('id'),
							})}
						>
                            <Text>Next</Text>
                        </Button>
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
})(ExerciseDescriptionContainer);


export default connect(null, null)(CategoriesForm);
