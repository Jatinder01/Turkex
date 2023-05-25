/* eslint-disable react/self-closing-comp */
import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";
import { Images, colors } from "../../theme/";

const Wrap = (props) => {
  return (
    <>
      {/* {Platform.OS == 'ios' ? (
        props.darkMode == true ? (
          <StatusBar barStyle="light-content" translucent={true} />
        ) : (
          <StatusBar barStyle="dark-content" translucent={true} />
        )
      ) : null} */}
      {/* <ImageBackground style={[
        { height: "100%", width: '100%', backgroundColor: 'red' }
      ]}
        source={Images.darkBG}
      > */}
      <SafeAreaView style={[styles.wrapStyle, props.style]}>
        <View
          collapsable={props.collapsable}
          style={[styles.wrapInsideStyle, props.screenStyle]}
        >
          {props.children}
        </View>
      </SafeAreaView>
      <SafeAreaView
        style={[styles.wrapBottom, props.bottomStyle]}
      ></SafeAreaView>
      {/* </ImageBackground> */}

    </>
  );
};

const styles = StyleSheet.create({
  wrapStyle: {
    backgroundColor: colors.White,
    flex: 1,
  },
  wrapInsideStyle: {
    flex: 1,
    backgroundColor: colors.White,
  },
  wrapBottom: {
    backgroundColor: colors.White,
  },
});

export { Wrap };
