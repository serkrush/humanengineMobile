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
	Item, Input
} from "native-base";
import { TextInput } from "react-native";
import { Action } from 'redux';

import { saveWorkouts } from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
import { Field, reduxForm, arrayRemove } from "redux-form";

const required = value => (value ? undefined : "Required");

export interface Props {
    navigation: any;
	saveWorkouts: (data) => Action;
}

export interface State {
	countSets: number;
	inputValue: string;
}

class SetsContainer extends React.Component<Props, State> {
	
	constructor(props) {
		super(props);
		this.state = {
			countSets: this.props.navigation.getParam('countSets', 0),
			inputValue: "0" 
		};

		this.loopSets = this.loopSets.bind(this);
		this.newWorkout = this.newWorkout.bind(this);
		this.renderInput = this.renderInput.bind(this);
	}

	newWorkout(data) {
		const { saveWorkouts } = this.props;
		console.log('data sets', data);
		
		saveWorkouts(data);
		this.props.navigation.navigate("NewWorkout", {});
	}

	renderInput({ input, meta: { touched, error }, inputProps }) {
		input.value = String(input.value);
		console.log('input111',input, inputProps, this.props);
		// const { ...inputProps } = props;
		
		return (
			<Item 
				error={error && touched} 
				style={{width:'19%'}}
			>
				<TextInput
					onChangeText={input.onChange}
					onBlur={input.onBlur}
					onFocus={input.onFocus}
					value= {input.value}
					keyboardType="numeric"
					style={{borderWidth:1,marginLeft:0,marginRight:0,marginTop:10,textAlign:"center",padding:0}}
					defaultValue="1"
				/>
			</Item>
		);
	}

	loopSets(countSets){
		let vLoopSets = [];
		let i = 0;
		for (i=0;i<=countSets;i++){
			let vIndex = i;
			
			vLoopSets.push(<View key = {i}  style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].set" }
									component={(val) => {
										console.log('input set val.',val, val.input.value);
										if(val.input.value==''){
											console.log('null');
											
										} else {
											console.log('not null');

										}
										return (
											<Item 
												style={{width:'19%'}}
											>
												<TextInput
													onChangeText={val.input.onChange}
													onBlur={val.input.onBlur}
													onFocus={val.input.onFocus}
													value= {(val.input.value=='')?String(i):String(val.input.value)}
													keyboardType="numeric"
													editable = {false}
													style={{borderWidth:0,marginLeft:0,marginRight:0,marginTop:10,textAlign:"center",padding:0,width:'100%'}}
													// defaultValue="1"
												/>
											</Item>
										);
									}}
									validate={[required]}
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].rep" }
									component={this.renderInput} 
									validate={[required]} 
									placeholder="Rep"
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].rest" }
									component={this.renderInput} 
									validate={[required]} 
									placeholder="Rest"
								/>
								<Field 
									name={"days[" + this.props.navigation.getParam('indexDay', 0) + "].exercises[" + this.props.navigation.getParam('indexExercise', 0) + "].sets[" + i + "].rm" }
									component={this.renderInput} 
									validate={[required]} 
									placeholder="RM"
								/>
								<Button 
									style={{width:'21%', marginTop:10,padding:0,textAlign:"center", marginLeft:1, backgroundColor:"#47525e", fontSize:6, height:50}}
									onPress={() => {
														console.log('del',this.props.navigation.getParam('indexDay', 0),this.props.navigation.getParam('indexExercise', 0),i,vIndex,this);
														this.props.dispatch(arrayRemove('newWorkout', 'days[' + this.props.navigation.getParam('indexDay', 0) + '].exercises[' + this.props.navigation.getParam('indexExercise', 0) + '].sets', vIndex));
														this.setState({ countSets: countSets - 1 })
													}}
								>
									<Text>Delete</Text>
								</Button>
							</View>
			);
		}
		return vLoopSets;
		
	}
    
	render() {
		const { handleSubmit } = this.props;

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
							<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
								<View style={{width:'19%'}}>
									<Text style={{textAlign:"center", fontWeight:"bold"}}>Set</Text>
								</View>
								<View style={{width:'19%'}}>
									<Text style={{textAlign:"center", fontWeight:"bold"}}>Rep</Text>
								</View>
								<View style={{width:'19%'}}>
									<Text style={{textAlign:"center", fontWeight:"bold"}}>Rest</Text>
								</View>
								<View style={{width:'19%'}}>
									<Text style={{textAlign:"center", fontWeight:"bold"}}>RM</Text>
								</View>
							</View>
							{ this.loopSets(this.state.countSets) }
							<Button 
								onPress={()=>{/*let newCountSets =this.state.countSets+1*1;*/ /*this.state.countSets=this.state.countSets+1*/ this.setState({ countSets: this.state.countSets+1 })}}
							>
								<Text>Add</Text>
							</Button>
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
	destroyOnUnmount: false, // <------ preserve form data
	forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(SetsContainer);



export default connect(null, {saveWorkouts})(CategoriesForm);
