import React from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {Fonts, colors, Images} from '../../theme/';

const TabIcon = props => {
  return (
    <View style={[styles.viewMainContainer, props.style]}>
      <Image
        source={
          props.focused ? {uri: props.activeImg} : {uri: props.defaultImg}
        }
        style={props.ImgSize}
      />
      <Text
        style={[
          styles.titleText,
          {
            color: props.focused
              ? ThemeManager.colors.selectedTextColor
              : ThemeManager.colors.inactiveTextColor,
          },
        ]}>
        {props.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewMainContainer: {
    // marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    // height: 30,
    alignItems: 'center',
  },
  titleText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textColor,
  },
});

export {TabIcon};
