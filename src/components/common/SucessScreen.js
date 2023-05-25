/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";

import { ThemeManager } from "../../../ThemeManager";
import { Fonts, Images } from "../../theme";
import { ButtonRound, Spinner } from "../common";
import LinearGradient from "react-native-linear-gradient";
import { Wrap } from "./Wrap";
import { ButtonPrimary } from "./ButtonPrimary";
const SucessScreen = (props) => {
  return (
    <Wrap
      // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
      style={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
    >
      <View
        style={[
          styles.TopScreen,
          { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
        ]}
      >
        {/* <ImageBackground
          source={props.imageSource}
          style={styles.profieImage}
        /> */}
        <LinearGradient
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#64B77C", "#347899", "#1F5BA7"]}
          style={{
            height: 150,
            width: 150,
            borderRadius: 75,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={props.imageSource}
            style={{ height: 80, width: 80, resizeMode: "contain" }}
          />
        </LinearGradient>
      </View>
      <View
        style={[
          styles.BottomScreen,
          { backgroundColor: ThemeManager.colors.dashboardDarkBg },
        ]}
      >
        {/* <Image
          source={{uri: ThemeManager.ImageIcons.icon_select}}
          style={{width: 24, height: 24}}
        /> */}
        <Text
          style={[
            styles.TextSuccessful,
            { color: ThemeManager.colors.textColor },
          ]}
        >
          {props.title}
        </Text>
        <Text
          style={[
            styles.TextCongrats,
            { color: ThemeManager.colors.inactiveTextColor },
          ]}
        >
          {props.text1}{" "}
        </Text>
        <Text
          style={[
            styles.TextCongrats,
            { color: ThemeManager.colors.inactiveTextColor },
          ]}
        >
          {props.text2}
        </Text>
      </View>
      {renderButton(props)}
    </Wrap>
  );
};
const renderButton = (props) => {
  if (props.loginLoading) {
    return <Spinner size="large" />;
  }
  return (
    <ButtonPrimary
      style={{ marginBottom: 40 }}
      title={"Back to home"}
      onPress={props.buttonClicked}
    />
  );
};
const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  viewMainContainer: {
    backgroundColor: ThemeManager.colors.tabBackground,
    flex: 1,
    alignContent: "center",
  },
  TopScreen: {
    backgroundColor: ThemeManager.colors.inactiveTextColor,
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  profieImage: {
    width: "92%",
    height: 243,
    borderColor: "#000",
  },
  BottomScreen: {
    backgroundColor: ThemeManager.colors.tabBackground,
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  TextSuccessful: {
    color: ThemeManager.colors.selectedTextColor,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 5,
    marginTop: 20,
    textAlign: "center",
  },
  TextCongrats: {
    color: ThemeManager.colors.textGreenColor,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 21,
  },
});
export { SucessScreen };
