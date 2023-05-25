import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts, colors, Images } from "../../theme";
import fonts from "../../theme/fonts";
import LinearGradient from "react-native-linear-gradient";
const ButtonPrimary = (props) => {
  return (
    <TouchableOpacity
      disabled={props.enable ? true : false}
      onPress={props.onPress}
      // style={{ flex: 1 }}
      style={[props.touchableStyle]}
    >
      {props.showGradient ? (
        <View
          // style={{
          //   justifyContent: 'center',
          //   alignItems: 'center',
          // }}
          style={[styles.btnStyle, props.style]}
        >
          <Text style={[styles.btnTextSimpleStyle, props.textSimpleStyle]}>
            {props.title}
          </Text>
        </View>
      ) : (
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          // colors={["#64B77C", "#347899", "#1F5BA7"]}
          colors={["#287FFF", "#7662FD"]}

          // style={{
          //   justifyContent: 'center',
          //   alignItems: 'center',
          // }}
          style={[styles.btnStyle, props.style]}
        >
          <Text style={[styles.btnTextStyle, props.textstyle]}>
            {props.title}
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    // backgroundColor: ThemeManager.colors.Depositbtn,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 25,
  },
  btnTextStyle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    // color: ThemeManager.colors.textColor,
    color: "white",
  },
  btnTextSimpleStyle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    // color: ThemeManager.colors.textColor,
    color: "white",
  },
});

export { ButtonPrimary };
