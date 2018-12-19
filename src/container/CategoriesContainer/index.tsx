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
	Card, CardItem, Radio
} from "native-base";
import { Image, TouchableOpacity } from 'react-native';
import { Action } from 'redux';
import { loadCategories } from '../../models/categories';

import Workout from "../../models/workouts";

import styles from '../../stories/screens/Home/styles';
import { Field, reduxForm, change } from "redux-form";

// import { RadioButton } from './RadioButton'

const required = value => (value ? undefined : "Required");

export interface Props {
	navigation: any;
	categories: Map<String, Object>;
	loadCategories: (data) => Action<any>;
}

export interface State {
	selected: string,
}

class CategoriesContainer extends React.Component<Props, State> {
	
	constructor(props) {
		super(props);
		this.state = {
			selected: ''
		};
		this.RadioButton = this.RadioButton.bind(this);
	}

	RadioButton({ selected, val, input, changeState, indexDay, exercises }) {
		return (
			<Radio
				{...input}
				onPress={() => {input.onChange(val); changeState(); this.props.navigation.navigate("Exercises", {exercises: exercises, indexDay:indexDay})  }}
				selected={selected === val}
				style={{position:"absolute",height:'100%',width:'100%',opacity:0}}
				// color="transparent"
			/>
		)
	}

	onPress (selected: string) {
		this.setState({
			selected
		})
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
						<View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
						{
							categories && categories.valueSeq().map((c,i)=>{
								console.log('c',c);
								

								return  <TouchableOpacity 
											key={"category_"+i+"_"+Math.random()} 
											style={{width:"50%",position:"relative"}} 
											// onPress={() => {
											// 				this.props.navigation.navigate("Exercises", {
											// 																exercises: c.get('exercises'), 
											
											// 																indexDay: this.props.navigation.getParam('indexDay', 0),
											// 																countDay: this.props.navigation.getParam('countDay', 0)
											// 															}
											// 												)
											// 				}
											// 		}
										><View>
											<Card>
													<CardItem cardBody>
														<Image source={{uri: Workout['mIP'] + '/upload/file?s=categories&f=' + c.get('categoryImg') +'&d=muscle.png'}} style={{height: 125, width: null, flex: 1}}/>
													</CardItem>
													<CardItem cardBody>
														<Text>{c.get('categoryName')}</Text>
													</CardItem>
												</Card>
									<Field
										
										name={'days[' + this.props.navigation.getParam('indexDay', 0) + '].exercises[0].category'}
										component={this.RadioButton}
										label={c.get('categoryName')}
										val={c.get('id')}
										selected={this.state.selected}
										indexDay = { this.props.navigation.getParam('indexDay', 0) }
										exercises = { c.get('exercises') }
										changeState={() => this.onPress(c.get('id'))}
									/>
								</View></TouchableOpacity>;
								// return <TouchableOpacity 
								// 			key={"category_"+i+"_"+Math.random()} 
								// 			style={{width:"50%"}} 
								// 			onPress={() => {
								// 							this.props.navigation.navigate("Exercises", {
								// 																			exercises: c.get('exercises'), 
								// 																			categoryId: c.get('id'),
								// 																			indexDay: this.props.navigation.getParam('indexDay', 0),
								// 																			countDay: this.props.navigation.getParam('countDay', 0)
								// 																		}
								// 															)
								// 							}
								// 					}>
								// 			<View>
								// 				<Card>
								// 					<CardItem cardBody>
								// 						<Image source={{uri: Workout['mIP'] + '/upload/file?s=categories&f=' + c.get('categoryImg') +'&d=muscle.png'}} style={{height: 125, width: null, flex: 1}}/>
								// 					</CardItem>
								// 					<CardItem cardBody>
								// 						<Text>{c.get('categoryName')}</Text>
								// 					</CardItem>
								// 				</Card>
								// 			</View>
								// 		</TouchableOpacity>;
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
		entities
    };
}

export default connect(mapStateToProps, {loadCategories, change})(CategoriesForm);
