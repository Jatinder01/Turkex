import React from "react";

import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { ThemeManager } from "../../../ThemeManager";

const InputDark = ({
  value,
  onChangeText,
  placeHolder,
  secureTextEntry,
  labelText,
  editable,
  keyboardType,
  lightStyle,
  onKeyPress,
  maxLength,
  returnKeyType,
}) => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  return (
    <View style={[styles.darkInputBloc]}>
      <Text
        style={[styles.labelText, { color: ThemeManager.colors.textColor }]}
      >
        {labelText}
      </Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        value={value}
        placeholder={placeHolder}
        onChangeText={onChangeText}
        style={[
          // { backgroundColor: ThemeManager.colors.inputColor },
          inputStyle,
          lightStyle,
        ]}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCorrect={false}
        placeholderTextColor={ThemeManager.colors.textColor}
        editable={editable}
        returnKeyType={returnKeyType}
        onKeyPress={onKeyPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  darkInputBloc: {
    marginRight: 15,
    marginLeft: 15,
    paddingTop: 18,
    paddingBottom: 8,
  },
  labelText: {
    fontSize: 18,
    color: "#283348",
    marginBottom: 10,
  },
  inputStyle: {
    color: "#ffff",
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 18,
    lineHeight: 23,
    backgroundColor: "#283348",
    height: 46,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopEndRadius: 5,
    marginBottom: 0,
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1,
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export { InputDark };
