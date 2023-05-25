import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {colors, Fonts} from '../../theme';
import {ThemeManager} from '../../../ThemeManager';
import ActionSheet from 'react-native-actionsheet';

const ActionSheets = ({onPress, children, defaultBtn, defaultBtnText}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, defaultBtn]}
      onPress={onPress}>
      <Text style={[styles.textStyle, defaultBtnText]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    color: ThemeManager.colors.textColor,
    fontSize: 16,
    // fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 24,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderRadius: 10,
  },
  buttonStyle: {
    height: 50,
    maxHeight: 50,
    justifyContent: 'center',
    alignSelf: 'stretch',
    // backgroundColor: ThemeManager.colors.tabBackground,
    borderRadius: 3,
  },
});

export {ActionSheets};
