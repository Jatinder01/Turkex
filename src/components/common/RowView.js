/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {colors, Fonts, Images} from '../../theme';

const RowView = props => {
  return (
    <View style={styles.orderView}>
      <Text
        style={[
          styles.dateText,
          {
            fontSize: 14,
            maxWidth: '50%',
          },
          props.labelTextStyle,
        ]}>
        {props.label}
      </Text>
      <Text
        onPress={props.onPress}
        style={[styles.dateText, props.dataTextStyle]}>
        {props.data}
      </Text>
    </View>
  );
};
export default RowView;
const styles = StyleSheet.create({
  orderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textColor,
  },
  dateText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.inactiveTextColor,
    maxWidth: '50%',
  },
});
