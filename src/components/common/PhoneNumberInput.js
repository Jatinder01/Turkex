/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Images, Fonts } from "../../theme";
import fonts from "../../theme/fonts";

const PhoneNumberInput = ({
  value,
  inputLabel,
  onChangeText,
  placeHolder,
  secureTextEntry,
  verifyLable,
  verifyInputStyle,
  countryCodeText,
  countryCodeClicked,
  customStyle,
  maxLength,
  hideSendBtns,
  sendOnPress,
  sendTxt,
  showButton,
  flag,
  codeTextStyle,
  placeHolderTextColor,
}) => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  return (
    <View style={[styles.darkInputBloc, customStyle]}>
      <Text style={[styles.labelText, verifyLable]}>{inputLabel}</Text>
      <TouchableOpacity
        style={[styles.countryCode, { flexDirection: "row" }]}
        onPress={countryCodeClicked}
      >
        {/* <Image style={{width: 20, height: 20}} source={flag} /> */}
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            marginTop: Platform.OS === "ios" ? 2 : 0,
          }}
        >
          <Text style={[styles.labelText, { fontSize: 20 }]}>{flag}</Text>
          <Text
            style={[
              {
                fontSize: 14,
                fontFamily: fonts.regular,
                marginHorizontal: 4,
                marginTop: 4,
              },
              codeTextStyle,
            ]}
            onPress={countryCodeClicked}
          >
            {"+"}
            {countryCodeText}
          </Text>
          <View style={{ justifyContent: "center", marginRight: 4 }}>
            <Image
              style={{
                width: 10,
                height: 10,
                resizeMode: "contain",
              }}
              source={{ uri: Images.icon_dropDown }}
            />
          </View>
        </View>
        <View
          style={{
            height: 30,
            width: 1,
            backgroundColor: "#707988",
            marginLeft: 5,
          }}
        ></View>
      </TouchableOpacity>
      <TextInput
        secureTextEntry={secureTextEntry}
        value={value}
        keyboardType="numeric"
        placeholder={placeHolder}
        onChangeText={onChangeText}
        style={[inputStyle, verifyInputStyle]}
        autoCorrect={false}
        // placeholderTextColor={ThemeManager.colors.inactiveTextColor}
        placeholderTextColor={placeHolderTextColor}
        maxLength={maxLength}
        returnKeyType={"done"}
      />
      {showButton == true && (
        <View style={[styles.sendBtns, hideSendBtns]}>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 50,
    marginHorizontal: 16,
  },
  labelText: {
    fontSize: 17,
  },
  inputStyle: {
    color: "#000",
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 14,
    width: "80%",
    alignSelf: "center",
    height: 50,
  },
  countryCode: {
    // width: 85,
    // justifyContent: 'space-around',
    // // alignItems: 'center',
    paddingLeft: 10,
  },
  sendBtns: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 100,
    height: 50,
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
  },
  sendTxt: {
    fontSize: 14,
    textAlign: "center",
  },
});
export { PhoneNumberInput };
