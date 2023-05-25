import React from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";

import { Fonts } from "../../theme";

const CheckboxWithImg = (props) => {
  return (
    <TouchableOpacity
      style={[
        styles.checboxBlock,
        styles.marginBottom,
        props.checkBoxStyle,
        props.isChecked,
      ]}
      onPress={props.buttonClicked}
    >
      <Image
        style={[styles.checboxBlockimg, props.checkboxImgPosition]}
        source={props.checkboxImg}
      />
      <Text
        style={[
          styles.checboxBlockText,
          props.setHeight,
          props.labelColor,
          props.isCheckedText,
        ]}
      >
        {props.checkboxLabel}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  checboxBlock: {
    // position: "relative",
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: `#C00000`,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    // borderRadius: 8,
    // marginVertical: 20,
    // paddingLeft: 35,
    // backgroundColor: "yellow",
  },
  checboxBlockText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: "#C00000",
    // height: 56,
    // lineHeight: 56,
    marginLeft: 15,
  },
  checboxBlockimg: {
    // position: 'absolute',
    // right: 15,
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  marginBottom: {
    marginVertical: 30,
  },
});

export { CheckboxWithImg };
