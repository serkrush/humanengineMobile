import * as React from "react";
import { connect } from "react-redux";
import Home from "../../stories/screens/Home";
import datas from "./data";
import Auth from "../../auth";

export interface Props {
	navigation: any;
	data: Object;
}
// X4j9WHAuvuMS
export interface State {}
class HomeContainer extends React.Component<Props, State> {

	componentDidMount() {
		Auth.getToken().then(token => console.log("token", token));
	}

	render() {
		return <Home navigation={this.props.navigation} list={datas} />;
	}
}

export default connect(null, null)(HomeContainer);
