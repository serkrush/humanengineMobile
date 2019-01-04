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
	View
} from "native-base";
import { Image, TouchableHighlight, ListView } from 'react-native';

import Workout from "../../models/workouts";
import styles from '../../stories/screens/Home/styles';
import { reduxForm } from "redux-form";
import TimeFormatter from 'minutes-seconds-milliseconds';

export interface Props {
    navigation: any;
}

export interface State {
	isRunning: boolean,
	mainTimer: any,
	// lapTimer: any,
	mainTimerStart: any,
	// lapTimerStart: any,
}

let laps = [
	{name: 'Lap 1', value: '00.00.01'},
	{name: 'Lap 2', value: '00.00.02'},
	{name: 'Lap 3', value: '00.00.03'},
	{name: 'Lap 4', value: '00.00.04'},
	{name: 'Lap 5', value: '00.00.05'},
];
let ds = new ListView.DataSource({
	rowHasChanged: (row1, row2) => row1 !== row2,
});

class WorkoutTimerContainer extends React.Component<Props, State> {
	
	constructor(props) {
		super(props);
		this.state = {
			dataSource: ds.cloneWithRows(laps),
			isRunning: false,
			mainTimer: null,
			// lapTimer: null,
			mainTimerStart: null,
			// lapTimerStart: null,
		};
		this.handleStartStop = this.handleStartStop.bind(this);
	}

	_renderTile(){
		return(
			<View style={{borderBottomWidth: 0.5,
						paddingTop: 20,
						paddingBottom: 10,
						backgroundColor: '#F9F9F9',}}>
				<Text style={{alignSelf: 'center',
							fontWeight: '600',}}>Stopwatch</Text>
			</View>
		);
	}

	_renderTimers(){
		return(
			<View style={{backgroundColor: '#FFFFFF',justifyContent:'center',flex:1,}}>
				<View style={{borderWidth:0.5,alignSelf:'center'}}>
					{/* <Text style={{fontSize:18,alignSelf:'flex-end',fontWeight:'100'}}>{ TimeFormatter(this.state.lapTimer) }</Text> */}
					<Text style={{fontSize:60,alignSelf:'flex-end'}}>{ TimeFormatter(this.state.mainTimer) }</Text>
				</View>
			</View>
		);
	}

	_renderButtons(){
		return(
			<View style={{flexDirection:'row',justifyContent:'space-around',paddingTop:15,paddingBottom:30}}>
				<TouchableHighlight underlayColor='#777' onPress={this.handleLapReset.bind(this)} style={{height:80,width:80,borderRadius:40,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
					<Text>Lap</Text>
				</TouchableHighlight>
				<TouchableHighlight underlayColor='#777' onPress={this.handleStartStop} style={{height:80,width:80,borderRadius:40,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
					
					<Text style={{color:'#00cc00'}}>{this.state.isRunning?'Stop':'Start'}</Text>
				</TouchableHighlight>
			</View>
		);
	}
	_renderLaps(){
		return(
			<View style={{}}>
				<ListView 
					enableEmptySections={true}
					dataSource={this.state.dataSource}
					renderRow={(rowData)=>(
						<View style={{flexDirection:'row',justifyContent:'space-around',height:40,paddingTop:10,borderBottomWidth:0.5,borderBottomColor:'#ddd'}}>
							<Text style={{fontSize:16,color:'#777'}}>
								{rowData.name}
							</Text>
							<Text style={{fontSize:20,color:'#000',fontWeight:'300'}}>
								{rowData.value}
							</Text>
						</View>
					)}/>
			</View>
		)
	}

	handleStartStop(){
		let { isRunning, firstTime, mainTimer/*, lapTimer*/ } = this.state;
		console.log('handleStartStop',isRunning);
		
		if (isRunning){
			clearInterval(this.interval);
			this.setState({
				isRunning: false
			});
			return;
		}

		this.setState({
			mainTimerStart: new Date(),
			// lapTimerStart: new Date(),
			isRunning: true
		})

		this.interval = setInterval(()=>{
			this.setState({
				mainTimer: new Date() - this.state.mainTimerStart + mainTimer,
				// lapTimer: new Date() - this.state.lapTimerStart + lapTimer,
			})
		},30);
		
	}
	handleLapReset(){
		return '';
	}
    
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
				<Content style={{flex: 1}}>
					<View style={{flex: 1,}}>
						{this._renderTile()}
						{this._renderTimers()}
					</View>
					<View style={{flex: 2, backgroundColor: '#F0EFF5',}}>
						{this._renderButtons()}
						{this._renderLaps()}
					</View>
				</Content>
			</Container>
		);
	}
}


// const options = {
// 	container: {
// 		backgroundColor: '#000',
// 		padding: 5,
// 		borderRadius: 5,
// 		width: 220,
// 	},
// 	text: {
// 		fontSize: 30,
// 		color: '#FFF',
// 		marginLeft: 7,
// 	}
// };




const WorkoutTimerForm = reduxForm({
	form: "workoutTimer",
})(WorkoutTimerContainer);


export default connect(null, null)(WorkoutTimerForm);
