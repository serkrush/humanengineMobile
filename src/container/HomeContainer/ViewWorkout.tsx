import * as React from "react";
import { Image, View, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text } from 'native-base';

export interface Props {
	// index: string;
    workouts: Map<String, Object>;
    navigation: any;
}

export interface State {}
class ViewWorkout extends React.Component<Props, State> {

	render() {
		const { workouts } = this.props;

		return (

            <View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
                
                {
                    workouts && workouts.map((t, i) => {
                        return<TouchableOpacity key={"workout_"+i+"_"+Math.random()} style={{width:"50%"}}  onPress={() => this.props.navigation.navigate("Workout")}><View>
                                <Card /*onPress={() => navigate('Workout', {name: 'Workout'})}*/>
                                    <CardItem cardBody>
                                        <Image source={{uri: 'http://192.168.77.123:3030/upload/file?s=workouts&f=' + t.get('workoutImg') +'&d=muscle.png'}} style={{height: 125, width: null, flex: 1}}/>
                                    </CardItem>
                                    <CardItem style={{backgroundColor:"#dee1e5"}}>
                                        <Text>{t.get('workoutName')}</Text>
                                    </CardItem>
                                </Card>
                            </View></TouchableOpacity>;
                    })
                }
            </View>

		);
	}
}

export default ViewWorkout;
