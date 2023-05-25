import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  buttonBackground,
  buttonTextColor,
  loginScreenTitleColor,
  normal,
  bold,
  titleFont,
  Avenir_Heavy,
  Avenir_Black,
  Avenir_Book,
  Avenir_Light,
  Avenir_Medium,
  Avenir_Roman,
  Avenir,
} from '../../../app.json';
import {ThemeManager} from '../../../ThemeManager';
import {colors, Fonts} from '../../theme';

const LoginTitle = ({title, subTitle, styleProp, styleProp1}) => {
  return (
    <View>
      <Text
        style={[
          styles.title,
          styleProp1,
          {color: ThemeManager.colors.textColor},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.subTitleText,
          styleProp,
          {color: ThemeManager.colors.textColor},
        ]}>
        {subTitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    color: colors.blackTxt,
    fontFamily: Fonts.regular,
    marginBottom: 10,
  },
  subTitleText: {
    fontSize: 13,
    color: colors.blackTxt,
    fontFamily: Fonts.medium,
    letterSpacing: -0.35,
  },
});

export {LoginTitle};
