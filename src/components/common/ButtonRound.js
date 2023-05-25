import React from 'react';
import {colors} from '../../theme';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import {ThemeManager} from '../../../ThemeManager';
const ButtonRound = ({onPress, children, btnStyle}) => {
  return (
    <TouchableOpacity style={[styles.buttonStyle, btnStyle]} onPress={onPress}>
      <Text style={styles.textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    alignSelf: 'center',
    color: ThemeManager.colors.textColor,
    fontSize: 18,
    fontWeight: '500',
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonStyle: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    // borderColor: ThemeManager.colors.selectedTextColor,
    borderRadius: 30,
    // borderWidth: 1,
    marginTop: 20,
    paddingLeft: 60,
    paddingRight: 60,
    backgroundColor: ThemeManager.colors.selectedTextColor,
    shadowColor: '#000',
  },
});

export {ButtonRound};
