import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {ThemeManager} from '../../../ThemeManager';
import {colors} from '../../theme';

const ButtonDashboardNew = props => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, props.style]}
      onPress={props.onPress}>
      <Image
        resizeMode="contain"
        source={props.btnIcon}
        style={[styles.ImgStyle, props.iconStyle]}
      />
      <Text style={[styles.textStyle]}>{props.btnText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 12,
    paddingTop: 5,
    letterSpacing: 0,
    fontWeight: '500',
    color: colors.lightText,
  },
  ImgStyle: {
    width: 30,
    height: 30,
  },
});

export {ButtonDashboardNew};
