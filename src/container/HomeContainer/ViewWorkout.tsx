import * as React from "react";
import { Image, View } from 'react-native';
import { Card, CardItem, Text } from 'native-base';

export interface Props {
	// index: string;
	trainings: Map<String, Object>;
}
// X4j9WHAuvuMS
export interface State {}
class ViewWorkout extends React.Component<Props, State> {

	render() {
		const { trainings } = this.props;
		
		return (
            <View style={{ flexDirection: "row", flex: 1, justifyContent: 'space-between' }}>
                {
                    trainings && trainings.valueSeq().map((t, i) => {
                        return<Card key={"training_"+i} style={{width:"50%"}}>
                                <CardItem cardBody>
                                    <Image source={{uri: 'http://192.168.77.123:3030/upload/file?s=workouts&f=' + t.get('workout').get('workoutImg') +'&d=muscle.png'}} style={{height: 125, width: null, flex: 1}}/>
                                </CardItem>
                                <CardItem style={{backgroundColor:"#dee1e5"}}>
                                    <Text>{t.get('workout').get('workoutName')}</Text>
                                </CardItem>
                            </Card>;
                    })
                }
            </View>
		);
	}
}

export default ViewWorkout;
