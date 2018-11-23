import * as React from "react";
import { connect } from "react-redux";
//import Home from "../../stories/screens/Home";
//import datas from "./data";
// import { loadWorkoutsUser } from '../../models/workouts';
import { loadTraining } from '../../models/training';
import { loadCountries } from '../../models/country';
import { Action } from 'redux';
import Auth from "../../auth";
import { View, Text } from "native-base";

export interface Props {
	navigation: any;
	data: Object;
	loadTraining: () => Action<any>,
	loadCountries: () => Action<any>,
}
// X4j9WHAuvuMS
export interface State {}
class HomeContainer extends React.Component<Props, State> {

	componentDidMount() {
		const { loadTraining } = this.props;
		Auth.getToken().then(token => console.log("token", token));
		loadCountries();
        loadTraining();
	}

	render() {
		return (
			<View
				style={{
					flexDirection: 'row',
					height: 100,
					padding: 20,
				}}>
				<View style={{backgroundColor: 'blue', flex: 0.3}} />
				<View style={{backgroundColor: 'red', flex: 0.5}} />
				<Text>Hello World!</Text>
			</View>
		// <Home navigation={this.props.navigation} list={datas} />
		);
	}
}

const mapStateToProps = (state) => {
    const { entities } = state;
    console.log('entities', entities);
	// console.log('entities w', entities.get('data'));
	const identity = entities && entities.get('identity');
	console.log('identity',identity);
	
	entities && entities.map((entiti, index) => {
        console.log('enti', index,entiti);
		
	})
	
    return {
        // workouts: entities.get('workouts'),
        // exercises: entities.get('exercises'),
    };
}

export default connect(mapStateToProps, {loadTraining, loadCountries})(HomeContainer);
