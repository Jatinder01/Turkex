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
import { colors, Fonts } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";

const CurrencyType = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, props.darkStyle]}
      onPress={props.buttonClicked}
    >
      <View style={styles.selectCurrency}>
        <View style={styles.currencyImageText}>
          <Image source={{ uri: props.coinIcon }} style={styles.currencyIcon} />
          <Text
            style={[
              styles.currencyImageBoldText,
              props.BoldTitleStyle,
              { color: ThemeManager.colors.textColor },
            ]}
          >
            {props.CoinFullName}
          </Text>
          <Text style={styles.currencyImageLightText}>
            {props.CoinShortName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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

export { CurrencyType };
