import React from 'react';
import ReactNative from 'react-native';

const {TouchableNativeFeedback, TouchableWithoutFeedback} = ReactNative;

export default Button = props => (
  <TouchableWithoutFeedback
    delayPressIn={0}
    background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
    {...props}>
    {props.children}
  </TouchableWithoutFeedback>
);
