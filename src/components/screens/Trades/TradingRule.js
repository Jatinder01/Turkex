/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
const TradingRules = ({
  isRuleShow,
  closePress,
  tradeRule,
  tradingFees,
  textColor,
  showStopLimitRule,
}) => {
  // console.log("tradeRule=-=-=", tradeRule);
  // console.log("tradingFees=-=-=", tradingFees);

  if (isRuleShow == true) {
    return (
      <View style={styles.mainView}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
          ]}
        >
          {showStopLimitRule == true ? (
            <>
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: -10,
                  alignSelf: "flex-end",
                  // backgroundColor: "red",
                }}
                onPress={closePress}
              >
                <Image
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                  source={{ uri: Images.icon_cancel_light }}
                />
              </TouchableOpacity>
              <View>
                <Text style={[textColor, { fontFamily: Fonts.medium }]}>
                  {strings.trade_tab.to_sell_a_coin}
                </Text>
              </View>
              <View style={styles.textView}>
                <View />
                <Text style={[{ fontFamily: Fonts.medium }, textColor]}>
                  Trading Rules
                </Text>
                <View />
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Minimum Trade Amount:</Text>
                <Text style={[styles.textValue, textColor]}>
                  {tradeRule?.min_amount} {tradeRule?.base_unit}
                </Text>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Maker Trading Fee:</Text>
                <Text style={textColor}>
                  {parseFloat((tradingFees?.maker || 0.002) * 100).toFixed(4)}%
                  {/* {(tradingFees?.maker || 0.002) * 100}% */}
                </Text>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Taker Trading Fee:</Text>
                <Text style={textColor}>
                  {parseFloat((tradingFees?.taker || 0.001) * 100).toFixed(4)}%
                </Text>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Minimum Order Size :</Text>
                <Text style={[styles.textValue, textColor]}>
                  {tradeRule?.min_total} {tradeRule?.quote_unit}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.textView]}>
                <View style={{ width: 40 }} />
                <Text style={[{ fontFamily: Fonts.medium }, textColor]}>
                  Trading Rules
                </Text>
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 40,
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    // marginTop: -10,
                  }}
                  onPress={closePress}
                >
                  <Image
                    style={{ height: 20, width: 20, resizeMode: "contain" }}
                    source={{ uri: Images.icon_cancel_light }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Minimum Trade Amount:</Text>
                <Text style={[styles.textValue, textColor]}>
                  {tradeRule?.min_amount} {tradeRule?.base_unit}
                </Text>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Maker Trading Fee:</Text>
                <Text style={textColor}>
                  {/* {(tradingFees?.maker || 0.002) * 100}% */}
                  {parseFloat((tradingFees?.maker || 0.002) * 100).toFixed(4)}%
                </Text>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Taker Trading Fee:</Text>
                <Text style={textColor}>
                  {parseFloat((tradingFees?.taker || 0.001) * 100).toFixed(4)}%
                </Text>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Minimum Order Size :</Text>
                <Text style={[styles.textValue, textColor]}>
                  {tradeRule?.min_total} {tradeRule?.quote_unit}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  } else {
    return null;
  }
};
// Minimum Trade Amount:0.0002 ETHMaker Trading Fee:0.2000 %Taker Trading Fee:0.2000 %Minimum Order Size :0.0001BTC

const styles = StyleSheet.create({
  mainView: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    // backgroundColor: Colors.screenBgLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: 10,
    marginBottom: 19,
    paddingVertical: 15,
    shadowColor: colors.lightGray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: "95%",
    shadowRadius: 1,
    shadowOpacity: 0.8,
  },
  textView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
  },
  textValue: { textTransform: "uppercase" },
});

export default TradingRules;
