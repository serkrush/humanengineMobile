import React from 'react'
import { connect } from "react-redux";
import { saveWorkouts } from "../../models/workouts";
import { Field, reduxForm } from 'redux-form'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

export interface Props {
	navigation: any;
	saveWorkouts: (data) => Action;
}

export interface State {
	userId: string;
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    color: 'white',
    height: 30,
    lineHeight: 30,
    marginTop: 10,
    textAlign: 'center',
    width: 250
  },
  container: {

  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    height: 37,
    width: 250
  }
})




  const renderInput = ({ input: { onChange, ...restInput }}) => {
	return <TextInput style={styles.input} onChangeText={onChange} {...restInput} />
  }
  
  
  const Form = props => {
	const submit = values => {
		console.log('submitting form', values);
		const { saveWorkouts } = props;
		saveWorkouts(values);
	}
	const { handleSubmit } = props
  
	return (
	  <View style={styles.container}>
		<Text>Email:</Text>
		<Field name="workoutName" component={renderInput} />
		<TouchableOpacity onPress={handleSubmit(submit)}>
		  <Text style={styles.button}>Submit</Text>
		</TouchableOpacity>
	  </View>
	)
  }


export default connect(null, {saveWorkouts})(reduxForm({
	form: 'test'
  })(Form));