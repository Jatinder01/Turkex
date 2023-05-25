import React from 'react';

import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {Fonts} from '../../theme';

const SelectPaymentOption = props => {
  const {selectBtn, labelStyle, containerStyle} = styles;
  return (
    <View style={[styles.optionsBloc]}>
      <TouchableOpacity
        style={[
          selectBtn,
          props.btnSelected,
          {backgroundColor: ThemeManager.colors.dashboardDarkBg},
        ]}
        onPress={props.onPress}>
        <Image source={props.optionSelected} />
        <Text
          style={[
            styles.selectBtnText,
            {color: ThemeManager.colors.textColor1},
          ]}>
          {props.btnLabel}
        </Text>
        <Image source={props.paymentType} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  selectBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
    backgroundColor: '#fff',
    paddingRight: 10,
    paddingLeft: 10,
    lineHeight: 23,
    height: 48,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopEndRadius: 5,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: ThemeManager.colors.inactiveTextColor,
    marginBottom: 15,
  },
  selectBtnText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.selectedTextColor,
    flex: 1,
    paddingLeft: 10,
  },
});

export {SelectPaymentOption};
