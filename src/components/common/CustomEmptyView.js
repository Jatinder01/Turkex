import React from "react";

import {
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import LottieView from "lottie-react-native";
const CustomEmptyView = (props) => {
  //   console.log("s-=", props);
  return (
    <View style={props.style}>
      <LottieView
        style={{ height: 100, width: 100 }}
        source={Images.finalSplash}
        autoPlay
        loop={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectCurrency: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    marginTop: 15,
  },
  currencyImageText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
  },
  currencyImageBoldText: {
    color: ThemeManager.colors.textColor,
    fontWeight: "800",
    fontSize: 18,
    marginLeft: 10,
    fontFamily: Fonts.bold,
  },
  currencyImageLightText: {
    color: ThemeManager.colors.inactiveTextColor,
    fontSize: 14,
    marginLeft: 5,
    fontFamily: Fonts.medium,
  },
  button: {
    justifyContent: "center",
  },
  currencyIcon: {
    width: 26,
    height: 26,
    marginRight: 5,
  },
});

export { CustomEmptyView };
