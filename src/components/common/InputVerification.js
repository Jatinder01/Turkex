import React from "react";

import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";

const InputVerification = ({
  value,
  inputLabel,
  onChangeText,
  placeHolder,
  secureTextEntry,
  verifyLable,
  verifyInputStyle,
  keyboardStyle,
  onKeyPress,
  multiline,
  maxLength,
  editable,
  inputRightOnpress,
  rightLabel,
  inputRightLabel,
  showButton,
  scanOnPress,
  maxOnPress,
  hideCounterBtns,
  maxTxt,
  hideScan,
  hideMax,
  sendOnPress,
  sendTxt,
  txtBtn,
  returnKeyType,
}) => {
  const { inputStyle, labelStyle, containerStyle, placeholderStyle } = styles;
  return (
    <View style={[styles.darkInputBloc]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {inputLabel != undefined && (
          <Text
            style={[
              styles.labelText,
              { color: ThemeManager.colors.textColor5 },
              verifyLable,
            ]}
          >
            {inputLabel}
          </Text>
        )}
        <TouchableOpacity onPress={inputRightOnpress}>
          <Text
            style={[
              styles.rightText,
              { color: ThemeManager.colors.textColor1 },
              rightLabel,
            ]}
          >
            {inputRightLabel}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        secureTextEntry={secureTextEntry}
        value={value}
        placeholder={placeHolder}
        onChangeText={onChangeText}
        multiline={multiline}
        style={[
          {
            backgroundColor: ThemeManager.colors.tabBackground,
            // borderColor: colors.greyTxt,
            // borderWidth: 1,

            // marginBottom: 10,
            color: ThemeManager.colors.textColor1,
            fontFamily: Fonts.medium,

            paddingRight: 10,
            paddingLeft: 20,
            fontSize: 14,
            lineHeight: 23,
            height: 48,
            borderRadius: 6,
            marginBottom: 0,
          },
          // inputStyle,
          verifyInputStyle,
        ]}
        autoCorrect={false}
        placeholderTextColor={ThemeManager.colors.inactiveTextColor}
        keyboardType={keyboardStyle}
        onKeyPress={onKeyPress}
        maxLength={maxLength}
        editable={editable}
        returnKeyType={returnKeyType}
        // disabled="disabled"
      />
      {showButton == true && (
        <View style={[styles.counterBtns, hideCounterBtns]}>
          <View style={hideScan}>
            <TouchableWithoutFeedback onPress={scanOnPress}>
              <Image
                style={{ height: 30, width: 30 }}
                source={Images.icons_scan}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={[styles.maxStyle, hideMax]}>
            <TouchableWithoutFeedback onPress={maxOnPress}>
              <Text style={styles.maxTxt}>{maxTxt}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
      {txtBtn == true && (
        <View style={[styles.sendBtns]}>
          <TouchableWithoutFeedback onPress={sendOnPress}>
            <Text style={styles.sendTxt}>{sendTxt}</Text>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  darkInputBloc: {
    paddingBottom: 5,
    marginBottom: 1,
  },
  labelText: {
    color: ThemeManager.colors.inactiveTextColor,
    marginBottom: 10,
    fontFamily: Fonts.regular,
    fontSize: 14,
    letterSpacing: -0.35,
    fontWeight: "500",
  },
  inputStyle: {
    color: ThemeManager.colors.textColor1,
    fontFamily: Fonts.medium,

    paddingRight: 10,
    paddingLeft: 20,
    fontSize: 14,
    lineHeight: 23,
    height: 48,
    // borderRadius: 10,
    marginBottom: 0,
    // backgroundColor: ThemeManager.colors.tabBackground,
  },
  rightText: {
    color: ThemeManager.colors.selectedTextColor,
    fontFamily: Fonts.regular,

    fontSize: 14,
  },
  counterBtns: {
    position: "absolute",
    right: 0,
    top: 38,
    flexDirection: "row",
    width: 50,
    justifyContent: "center",
    // backgroundColor:"red"
  },
  maxTxt: {
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.medium,

    fontSize: 14,
  },
  maxStyle: {
    alignSelf: "center",
    paddingRight: 10,
  },
  placeholderStyle: {
    fontFamily: Fonts.medium,

    fontSize: 14,
    fontWeight: "500",
  },
  sendBtns: {
    position: "absolute",
    right: 0,
    top: 33,
    // flexDirection: 'row',
    width: 100,
    height: 47,
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: ThemeManager.colors.textColor,
    alignItems: "center",
    fontFamily: Fonts.medium,
  },
  sendTxt: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: ThemeManager.colors.textColor,
    textAlign: "center",
  },
});

export { InputVerification };
