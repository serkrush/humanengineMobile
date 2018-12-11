import React from 'react'
import PropTypes from 'prop-types'
import { Body, ListItem, Text, Radio, Right } from 'native-base'

type Props = {
  label: string,
  SVGPathSegLinetoHorizontalRel: string,
  onPress: Function,
  selected: string,
}

export default class RadioButton extends React.Component<void, Props, void> {
  onPress (onChange, val, changeState) {
    onChange(val)
    changeState()
  }


  render () {
    const { selected, val, input, changeState } = this.props
  
    return (
 
          <Radio
            {...input}
            onPress={() => this.onPress(input.onChange, val, changeState)}
            selected={selected === val}
          />
    )
  }
}

// Prop type warnings
RadioButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  val: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
}