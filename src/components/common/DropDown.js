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
import {Dropdown} from 'react-native-material-dropdown';
import {Fonts} from '../../theme';
import {ThemeManager} from '../../../ThemeManager';

const DropDownButton = ({
  value,
  inputLabel,
  btnLabel,
  onChangeText,
  placeHolder,
  secureTextEntry,
  labelText,
  selectedItem,
  currentValue,
  customDrpdwn,
  customTxt,
  customSelectBtn,
  customDrpContainer,
  hideArrow,
}) => {
  const {selectBtn, labelStyle, containerStyle} = styles;
  return (
    <View style={[styles.darkInputBloc, customDrpdwn]}>
      <Text style={[styles.labelText, customTxt]}>{inputLabel}</Text>
      <View style={[selectBtn, customSelectBtn]}>
        <Dropdown
          containerStyle={[styles.drpContainer, customDrpContainer]}
          renderAccessory={<View />}
          itemTextStyle={styles.selectBtnText}
          inputContainerStyle={{borderBottomWidth: 0}}
          label={placeHolder}
          value={currentValue}
          data={value}
          onChangeText={(item, index) => selectedItem(item, index)}>
          {/* <Text style={styles.selectBtnText}>{btnLabel}</Text> */}
        </Dropdown>
        <View>
          <Image
            source={{uri: ThemeManager.ImageIcons.icon_dropdown}}
            style={[styles.dropArrow, hideArrow]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  darkInputBloc: {
    paddingBottom: 8,
    marginBottom: 18,
  },
  labelText: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    color: 'red',
    marginBottom: 10,
  },
  selectBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    backgroundColor: '#fff',
    paddingRight: 10,
    paddingLeft: 10,
    lineHeight: 23,
    height: 48,
    backgroundColor: ThemeManager.colors.tabBackground,
    // borderTopEndRadius: 5,
    // borderTopLeftRadius: 5,
    // borderBottomEndRadius: 5,
    // borderBottomLeftRadius: 5,
    // borderTopEndRadius: 5,

    // borderWidth: 1,
    // borderColor: ThemeManager.colors.selectedTextColor,
  },
  selectBtnText: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.inactiveTextColor,
  },
  drpContainer: {
    flex: 1,
    marginTop: -15,
  },
  dropArrow: {
    width: 10,
    height: 5,
    marginRight: 5,
  },
});

export {DropDownButton};
