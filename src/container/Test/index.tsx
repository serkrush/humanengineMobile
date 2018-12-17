import * as React from "react";
import { connect } from "react-redux";
import { UPDATE } from "../../redux/actions";
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
	Item, Input, Card, CardItem, ScrollableTab
} from "native-base";
import { Action } from 'redux';
// import { loadCategories } from '../../models/categories';
import { saveWorkouts, loadWorkoutPage } from "../../models/workouts";

// import {Workout} from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
// import { loadWorkoutExercises } from '../../models/workouts';
// import {  TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { Field, FieldArray, reduxForm } from "redux-form";

const required = value => (value ? undefined : "Required");

export interface Props {
  navigation: any;
	saveWorkouts: (data) => Action;
  loadWorkoutPage: (id:string) => void;
  workoutId: string;
	// entities: any;
}

export interface State {
  countSets: number;
}

class Test extends React.Component<Props, State> {
	
	constructor(props) {
		super(props);
		this.state = {
			countSets: 0
		};

		this.newWorkout = this.newWorkout.bind(this);
	}

	newWorkout(data) {
		console.log("data", data);

		const { saveWorkouts } = this.props;
    const tt = saveWorkouts(data);
    console.log('tt', tt);
    

		// }
	}

	renderInput({ input, meta: { touched, error } }) {
		return (
			<Item error={error && touched}>
				<Input
					ref={c => (this.textInput = c)}
					placeholder="Set"
					secureTextEntry={false}
					{...input}
				/>
			</Item>
		);
	}

  
  componentDidMount() {
    const { loadWorkoutPage, workoutId } = this.props;
    //const workoutId = /*id?id:*/ null;
    loadWorkoutPage(workoutId);
  }
    
	render() {
		const { handleSubmit } = this.props;
		// const ex = navigation.getParam('exercises', []); 
		console.log('this.state.countSets',this.state.countSets);
		
        
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
							  <Icon name="ios-arrow-back" />
						  </Button>
					</Left>
					<Body>
						<Title>Sets</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Form>
						<View style={styles.contentPadding}>
                <Field 
									name={"workoutName" }
									component={this.renderInput} 
									validate={[required]} 
								/>
							
						</View>
						<View padder>
							<Button block onPress={handleSubmit(this.newWorkout)}>
								<Text>Save</Text>
							</Button>
						</View>
                    </Form>

				</Content>
			</Container>
		);
	}
}

const CategoriesForm = reduxForm({
  form: "newWorkout",
  enableReinitialize: true,
})(Test);

const mapStateToProps = (state, props) => {
  const { entities, requestResult } = state;
  console.log('state', state);
  console.log('props', props);

  let workoutId = props.workoutId;
  if (requestResult && requestResult.has('workouts') && requestResult.get('workouts').has(UPDATE)) {
        workoutId = requestResult.getIn(['workouts', UPDATE]).first();
  }
  
  const workout = (workoutId && entities.get('workouts'))?entities.get('workouts').get(workoutId):null;
  
  console.log('workoutId', workoutId, workout);
  return{
    initialValues : workout ? workout.toJS() : {},
  }
}


export default connect(mapStateToProps, {saveWorkouts, loadWorkoutPage})(CategoriesForm);
