import React from "react";

import {
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { colors, Fonts } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";

const ButtonSelectCurrency = (props) => {
  // console.log("F----", props.coinIcon);
  return (
    <>
      <View>
        <View style={props.customMainContainer}>
          <View style={[styles.selectCurrency, props.styleDropDown]}>
            <View style={styles.currencyImageText}>
              <Image
                source={{ uri: props.coinIcon }}
                style={{ width: 25, height: 25 }}
              />
              <Text
                style={[
                  styles.currencyImageBoldText,
                  props.customSymbol,
                  { color: ThemeManager.colors.textColor1 },
                ]}
              >
                {props.coinName}
              </Text>
              <Text
                style={[
                  styles.currencyImageLightText,
                  props.customCoinName,
                  { color: ThemeManager.colors.textColor1 },
                ]}
              >
                {props.coinSymbol}
              </Text>
            </View>
            {/* <Image
              source={{uri: ThemeManager.ImageIcons.icon_dropdown}}
              style={{
                width: 18,
                height: 18,
                tintColor: ThemeManager.colors.textColor,
              }}
            /> */}
          </View>
          {props.AvailBal && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={[
                  styles.availBal,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                Available Balance
              </Text>
              <Text
                style={[
                  styles.availBal,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.AvailBal}
              </Text>
            </View>
          )}
          {props.minimumDeposit && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={[
                  styles.availBal,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                Minimum Deposit
              </Text>
              <Text
                style={[
                  styles.availBal,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.minimumDeposit}
              </Text>
            </View>
          )}
          {props.networkType && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={[
                  styles.availBal,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                Network
              </Text>
              <Text
                style={[
                  styles.availBal,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.networkType}
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectCurrency: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    backgroundColor: ThemeManager.colors.tabBackground,
    // borderWidth: 1,
    // borderColor: ThemeManager.colors.selectedTextColor,
    borderRadius: 6,
    height: 48,
  },
  currencyImageText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  currencyImageBoldText: {
    color: colors.darkBlack,
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "500",
  },
  currencyImageLightText: {
    // marginLeft: 15,
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginLeft: 10,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: colors.greyTxt,
  },
  availBal: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
  },
});

export { ButtonSelectCurrency };
