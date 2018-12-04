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
	Card, CardItem, Input, Item
} from "native-base";
import { Image, TouchableOpacity, TextInput } from 'react-native';
import { Action } from 'redux';
import { loadCategories } from '../../models/categories';

import Workout from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
import { Field, reduxForm } from "redux-form";

const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	categories: Map<String, Object>;
	loadCategories: (data) => Action<any>;
}

export interface State {
	categoryForm: string;
}

class CategoriesContainer extends React.Component<Props, State> {
	textInput: any;
	constructor(props) {
		super(props);
		this.state = {
			categoryForm: "",
		};
	}

	renderInput({ input, meta: { touched, error } }) {
		return (
			<Item error={error && touched}>
				<Input
					ref={c => (this.textInput = c)}
					placeholder="Category"
					secureTextEntry={false}
					{...input}
				/>
			</Item>
		);
	}

	componentDidMount() {
		const { loadCategories} = this.props;
		console.log('componentDidMount categories');
		
		loadCategories();
	}
    
	render() {
		const { categories } = this.props;
		
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Categories</Title>
					</Body>
					<Right />
				</Header>
				<Content>
                    <Form>
						<View style={styles.contentPadding}>
							<Field 
								name="category" 
								component={this.renderInput} 
								validate={[required]} />
						</View>
						<Button onPress={(fields) => {console.log('tuk'); fields.push();						}}><Text>tuk</Text></Button>
						<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
						{
							categories && categories.valueSeq().map((c,i)=>{
								
								return <TouchableOpacity key={"category_"+i+"_"+Math.random()} style={{width:"50%"}} onPress={() => {this.setState({categoryForm: 'fields'});this.props.navigation.navigate("Exercises", {exercises: c.get('exercises')})}}><View><Card>
								<CardItem cardBody>
									<Image source={{uri: Workout['mIP'] + '/upload/file?s=categories&f=' + c.get('categoryImg') +'&d=muscle.png'}} style={{height: 125, width: null, flex: 1}}/>
								</CardItem>
								<CardItem cardBody>
									<Text>{c.get('categoryName')}</Text>
								</CardItem>
								</Card>
                            </View></TouchableOpacity>;
							})
						}
						
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
})(CategoriesContainer);

const mapStateToProps = (state, props) => {
	const { entities } = state;
	const categories = entities.get('categories');
	
	
    return {
		categories,
		entities,
    };
}

export default connect(mapStateToProps, {loadCategories})(CategoriesForm);
