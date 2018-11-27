
import * as React from 'react';
import { connect } from 'react-redux'

import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import { Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

import NavigationService from "./NavigationService";
import Login from "./container/LoginContainer";
import Home from "./container/HomeContainer";
import Workout from "./container/WorkoutContainer";
import BlankPage from "./container/BlankPageContainer";
import Sidebar from "./container/SidebarContainer";
import Auth from "./auth";
import { loadApp } from "./models/pages";
import UserContext from "./UserContext";

const Drawer = DrawerNavigator(
	{
		Home: { screen: Home },
		Workout: { screen: Workout },
	},
	{
		drawerWidth: deviceWidth - 50,
		drawerPosition: "left",
		contentComponent: (props: any) => <Sidebar {...props} />,
	},
);

const AppGuest = StackNavigator(
	{
		Login: { screen: Login },
		BlankPage: { screen: BlankPage },
		Drawer: { screen: Drawer },
	},
	{
		initialRouteName: "Login",
		headerMode: "none",
	},
);

const AppUser = StackNavigator(
	{
		Login: { screen: Login },
		BlankPage: { screen: BlankPage },
		Drawer: { screen: Drawer },
		Workout: { screen: Workout },
	},
	{
		initialRouteName: "Drawer",
		headerMode: "none",
	},
);

interface Props {
	promise: Promise<string>;
	then: (value: string) => JSX.Element;
}

interface State {
	value: string;
}

class Deferred extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
		};
	}
	componentDidMount() {
		this.props.promise.then(value => {
			this.setState({value});
		});
	}
	render() {
		const then = this.props.then || (value => <span>{value}</span>);
		return then(this.state.value);
	}
}

export interface IAppProps {
	loadApp: () => void;
}

class IApp extends React.Component<IAppProps, any> {
	private _userId = "";

	componentDidMount() {
		this.props.loadApp();
		console.log('app mounted');
	}

	render() {
		console.log('IApp rendered', this._userId);
		
		return (
				<Root>
					<Deferred promise={Auth.getUserId()} then={userId => {
						return userId != null && userId.length > 0 ?
							<UserContext.Provider value={{userId}}>
								<AppUser ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef); } }/>
							</UserContext.Provider>				
							:
							<AppGuest ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef); } }/>} 
					}/>
				</Root>
			
		);
	}
}

const mapState2Props = state => {
	return {
	};
}

export default connect(mapState2Props, { loadApp })(IApp);
