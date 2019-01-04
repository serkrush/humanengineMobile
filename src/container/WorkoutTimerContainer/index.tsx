import React, { Component } from 'react';
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
	
} from "native-base";
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { connect } from "react-redux";

function Timer({ interval, style }) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds() / 10)
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())},</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  )
}

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[ styles.button, { backgroundColor: background }]}
      activeOpacity={disabled ? 1.0 : 0.7}
    >
      <View style={styles.buttonBorder}>
        <Text style={[ styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}
function Lap({ number, interval, fastest, slowest }) {
  const lapStyle = [
    styles.lapText,
    fastest && styles.fastest,
    slowest && styles.slowest,
  ]
  return (
    <View style={styles.lap}>
      <Text style={lapStyle}>Lap {number}</Text>
      <Timer style={[lapStyle, styles.lapTimer]} interval={interval}/>
    </View>
  )
}

function LapsTable({ laps, timer }) {
  const finishedLaps = laps.slice(1)
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (finishedLaps.length >= 2) {
    finishedLaps.forEach(lap => {
      if (lap < min) min = lap
      if (lap > max) max = lap
    })
  }
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={index === 0 ? timer + lap : lap}
          fastest={lap === min}
          slowest={lap === max}
        />
      ))}
    </ScrollView>
  )
}

function ButtonsRow({ children }) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}
export interface Props {
	navigation: any;
    exercises: Map<String, Object>;
	entities: any;
}

export interface State {
}

class WorkoutTimerContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      now: 0,
      laps: [ ],
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  start = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
      laps: [0],
    })
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime()})
    }, 100)
  }
  
  lap = () => {
    const timestamp = new Date().getTime()
    const { laps, now, start } = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timestamp,
      now: timestamp,
    })
  }

  stop = () => {
    clearInterval(this.timer)
    const { laps, now, start } = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,
    })
  }
  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0,
    })
  }
  resume = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
    })
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime()})
    }, 100)
  }
  render() {
    const { exercises,entities } = this.props;
    const { now, start, laps } = this.state
    const timer = now - start
    const days = this.props.navigation.getParam('days', {}).toJS();
    const day = days[this.props.navigation.getParam('tabDay', 0)];
    // console.log('222', this.props.navigation.getParam('tabDay', 0),day);
    
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name="ios-arrow-back" />
                    </Button>
                </Left>
                <Body>
                    <Title>Workout</Title>
                </Body>
                <Right />
            </Header>
            
            <Content>
                <View>
                    {
                        // for (i=0;i<=countSets;i++){

                        // }
                        day && day.exercises.map((d,i)=>{
                            let _exercise = entities.getIn(['exercises', d.exercise]);

                            return <View>
                                        <Text>{_exercise.get('exerciseName')}</Text>
                                        <Text>{_exercise.get('exerciseName')}</Text>
                                    </View>
                            
                        })
                    }
                </View>
                <View>
                    
                    <Timer
                    interval={laps.reduce((total, curr) => total + curr, 0) + timer}
                    style={styles.timer}
                    />
                    {laps.length === 0 && (
                    <ButtonsRow>
                        <RoundButton
                        title='Lap'
                        color='#8B8B90'
                        background='#151515'
                        disabled
                        />
                        <RoundButton
                        title='Start'
                        color='#50D167'
                        background='#1B361F'
                        onPress={this.start}
                        />
                    </ButtonsRow>
                    )}
                    {start > 0 && (
                    <ButtonsRow>
                        <RoundButton
                        title='Lap'
                        color='#FFFFFF'
                        background='#3D3D3D'
                        onPress={this.lap}
                        />
                        <RoundButton
                        title='Stop'
                        color='#E33935'
                        background='#3C1715'
                        onPress={this.stop}
                        />
                    </ButtonsRow>
                    )}
                    {laps.length > 0 && start === 0 && (
                    <ButtonsRow>
                        <RoundButton
                        title='Reset'
                        color='#FFFFFF'
                        background='#3D3D3D'
                        onPress={this.reset}
                        />
                        <RoundButton
                        title='Start'
                        color='#50D167'
                        background='#1B361F'
                        onPress={this.resume}
                        />
                    </ButtonsRow>
                    )}
                    <LapsTable laps={laps} timer={timer}/>
                </View>
            </Content>
        </Container>
    )
  }
}

const styles = StyleSheet.create({

  timer: {
    color: '#FFFFFF',
    fontSize: 76,
    fontWeight: '200',
    width: 110,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 80,
    marginBottom: 30,
  },
  lapText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  lapTimer: {
    width: 30,
  },
  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#151515',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  scrollView: {
    alignSelf: 'stretch',
  },
  fastest: {
    color: '#4BC05F',
  },
  slowest: {
    color: '#CC3531',
  },
  timerContainer: {
    flexDirection: 'row',
  }
})

const mapStateToProps = (state, props) => {

	const { entities } = state;
	const exercises = entities.get('exercises');
	console.log('mapStateToProps',exercises);
    
	
    return {
        exercises,
        entities
    };
}

export default connect(mapStateToProps, null)(WorkoutTimerContainer);