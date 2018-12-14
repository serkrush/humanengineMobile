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
	Item, Input, Tab, Tabs, ScrollableTab, Fab, Textarea
} from "native-base";
// import { AppRegistry, FlatList, StyleSheet, View } from 'react-native';
import { Field, FieldArray, reduxForm } from "redux-form";
import { saveWorkouts } from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';//"../stories/screens/styles";

export interface Props {
	navigation: any;
	saveWorkouts: (data) => Action;
}

export interface State {
	userId: string;
}
class TestContainer extends React.Component<Props, State> {
	textInput: any;
	constructor(props) {
        super(props);
        

		this.testWorkout = this.testWorkout.bind(this);
    }
    
    testWorkout(data) {
		console.log("data", data);

		const { saveWorkouts } = this.props;
		saveWorkouts(data);

		// if (valid) {
		// 	//this.props.navigation.navigate("Drawer");
		// } else {
		// 	Toast.show({
		// 		text: "Enter Valid Username & password!",
		// 		duration: 2000,
		// 		position: "top",
		// 		textStyle: { textAlign: "center" },
		// 	});
		// }
	}

	renderInput({ input, meta: { touched, error } }) {
		return (
			<Item error={error && touched}>
				<Input
					ref={c => (this.textInput = c)}
					placeholder="WorkoutName"
					secureTextEntry={false}
					{...input}
				/>
			</Item>
		);
	}

	public render() {
        const { handleSubmit } = this.props;

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
                        <Title>Test</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={styles.contentPadding}>
                    <Form>
                        <View style={styles.contentPadding}>
                            <Field 
                                name="workoutName" 
                                component={this.renderInput} 
                                />
                        </View>
                        <View padder>
							<Button block onPress={handleSubmit(this.testWorkout)}>
								<Text>Save</Text>
							</Button>
						</View>
                    </Form>
                </Content>
            </Container>
        )
	}
}


const TestWorkout = reduxForm({
    form: "testWorkout",
    enableReinitialize: true
})(TestContainer);

export default connect(null, {saveWorkouts})(TestWorkout);
