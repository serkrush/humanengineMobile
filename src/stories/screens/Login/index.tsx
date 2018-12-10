import * as React from "react";

import { Image, Platform } from "react-native";
import { Container, Content, Header, Body, Title, Text, View, Icon, Footer } from "native-base";
import Workout from "../../../models/workouts";
// import styles from "./styles";
export interface Props {
	loginForm: any;
}
export interface State {}
class Login extends React.Component<Props, State> {
	render() {
		return (
			<Container>
				<Header style={{ height: 200 }}>
					<Body style={{ alignItems: "center" }}>
					{console.log(Workout['mIP'] + '/static/big-logo.png')}
					
						<Image source={{uri: Workout['mIP'] + '/static/big-logo.png'}} style={{height:100, width:100}}/>
						{/* <Icon name="flash" style={{ fontSize: 104 }} /> */}
						<View padder>
							<Text style={{ color: Platform.OS === "ios" ? "#000" : "#FFF" }} />
						</View>
					</Body>
				</Header>
				<Content>
					{this.props.loginForm}
				</Content>
				{/* <Footer style={{ backgroundColor: "#F8F8F8" }}>
					<View style={{ alignItems: "center", opacity: 0.5, flexDirection: "row" }}>
						<View padder>
							<Text style={{ color: "#000" }}>Made with love at </Text>
						</View>
						<Image
							source={{ uri: "https://geekyants.com/images/logo-dark.png" }}
							style={{ width: 422 / 4, height: 86 / 4 }}
						/>
					</View>
				</Footer> */}
			</Container>
		);
	}
}

export default Login;
