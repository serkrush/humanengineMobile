
import * as React from 'react';
import { connect } from 'react-redux'

import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import { Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

import NavigationService from "./NavigationService";
import Login from "./container/LoginContainer";
import Home from "./container/HomeContainer";
import BlankPage from "./container/BlankPageContainer";
import Sidebar from "./container/SidebarContainer";
import Auth from "./auth";
import { loadApp } from "src/models/pages";

const Drawer = DrawerNavigator(
	{
		Home: { screen: Home },
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
	},
	{
		initialRouteName: "Drawer",
		headerMode: "none",
	},
);

interface Props {
	promise: Promise<boolean>;
	then: (value: boolean) => JSX.Element;
}

interface State {
	value: boolean;
}

class Deferred extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			value: false,
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
	
	// componentDidMount() {
	// 	this.props.loadApp();
	// 	console.log('app mounted');
		
	// }

	public render() {
		console.log('IApp rendered');
		
		return (
		<Root>
			<Deferred promise={Auth.isUserAuthenticated()} then={isUser => {
				return isUser ?
					<AppUser ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef); } }/>
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
