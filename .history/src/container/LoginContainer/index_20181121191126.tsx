import * as React from "react";
import { Action } from "redux";
import { connect } from "react-redux";
import { TextInput } from "react-native";
import moment from "moment-timezone";

import Auth from "../../auth";
import { loginUser } from "../../models/identity";

import { Form, View, Text, Button, Item, Input, Icon } from "native-base";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import Login from "../../stories/screens/Login";

const required = value => (value ? undefined : "Required");
const maxLength = max => value => (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength15 = maxLength(15);
const minLength = min => value => (value && value.length < min ? `Must be ${min} characters or more` : undefined);
const minLength8 = minLength(8);
const email = value =>
	value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? "Invalid email address" : undefined;
const alphaNumeric = value => (value && /[^a-zA-Z0-9 ]/i.test(value) ? "Only alphanumeric characters" : undefined);

export interface Props {
	navigation: any;
	valid: boolean;
	loginUser: (data) => Action;
}
export interface State {}

class LoginForm extends React.Component<Props  & InjectedFormProps<{}, State>> {
	textInput: any;
	constructor(props: Props) {
		super(props);
		this.login = this.login.bind(this);
	}

	renderInput({ input, meta: { touched, error } }) {
		return (
			<Item error={error && touched}>
				<Icon active name={input.name === "userEmail" ? "person" : "unlock"} />
				<Input
					ref={c => (this.textInput = c)}
					placeholder={input.name === "userEmail" ? "Email" : "Password"}
					secureTextEntry={input.name === "password" ? true : false}
					{...input}
				/>
			</Item>
		);
	}

	login(data) {
		console.log("data", data);

		const { loginUser } = this.props;
		loginUser(data);

		// if (valid) {
		// 	//this.props.navigation.navigate("Drawer");
		// } else {
		// 	Toast.show({
		// 		text: "Enter Valid Username & password!",
		// 		duration: 2000,
		// 		position: "top",
		// 		textStyle: { textAlign: "center" },
		// 	});
		// }
	}

	render() {
		const {error, handleSubmit } = this.props;

		const mycomp = (
			<Form>
				<Field
					component={TextInput}
					type="hidden"
					name="timezone"
					style={{ height: 0 }}/>
				<Field name="userEmail" component={this.renderInput} validate={[email, required]} />
				<Field
					name="password"
					value="X4j9WHAuvuMS"
					component={this.renderInput}
					validate={[alphaNumeric, minLength8, maxLength15, required]}
				/>
				{
					error && <View padder>
						<Text style={{color: "red", textAlign: 'center'}}>{error}</Text>
					</View>
				}
				<View padder>
					<Button block onPress={handleSubmit(this.login)}>
						<Text>Login Max !</Text>
					</Button>
				</View>
			</Form>
		);
		return <Login loginForm={mycomp} />;
	}
}
const LoginContainer = reduxForm({
	form: "login",
	initialValues: { timezone: moment.tz.guess() },
})(LoginForm);

// const mapStateToProps = (state) => {
// 	const { entities } = state;
// 	return {};
// };

export default connect(null, { loginUser })(LoginContainer);
