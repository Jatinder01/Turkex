/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Fonts } from "../../theme";
import ActionSheet from "react-native-actionsheet";
import { strings } from "../../../Localization";
import Singleton from "../../Singleton";
import PercentageChange from "../screens/Trades/PercentageChange";
import WebView from "react-native-webview";
import END_POINT from "../../EndPoints";

const BuySellMarketHeaderMemo = (props) => {
  const marketSocketReducer = useSelector((state) => state.marketSocketReducer);
  const tradeReducer = useSelector((state) => state.tradeReducer);
  const FundsReducer = useSelector((state) => state.FundsReducer);
  const renderUsdPrice = (type) => {
    if (
      tradeReducer.selectedCoinPair.quote_unit == type &&
      FundsReducer.coinToUsdData[type.toUpperCase()]
    ) {
      return FundsReducer.coinToUsdData[type.toUpperCase()].USD;
    } else {
      return 1;
    }
  };
  const renderLastPrice = (type) => {
    for (var index in marketSocketReducer?.marketData) {
      if (marketSocketReducer?.marketData[index].name == type) {
        // return Singleton.getInstance().numbersToBillion(
        //   parseFloat(totalValue)?.toFixed(4),
        // );
        return marketSocketReducer?.marketData[index];
      }
    }
  };
  var volumeCheck = tradeReducer?.selectedCoinPair?.price_change_percent?.slice(
    0,
    -1
  );
  // return (
  //   <View style={{ flex: 1 }} collapsable={false}>
  //     <WebView
  //       // ref={'webview'}
  //       androidHardwareAccelerationDisabled
  //       style={{
  //         width: Dimensions.get("window").width,
  //         height: 400,
  //         paddingTop: 5,
  //         backgroundColor: ThemeManager.colors.SwapInput,
  //       }}
  //       collapsable={false}
  //       source={{
  //         uri:
  //           ThemeManager.colors.themeColor === "light"
  //             ? `${END_POINT.GRAPH_URL}${
  //                 tradeReducer.selectedCoinPair.base_unit.toUpperCase() +
  //                 "/" +
  //                 tradeReducer.selectedCoinPair.quote_unit.toUpperCase()
  //               }`
  //             : `${END_POINT.GRAPH_URL_DARK}${
  //                 tradeReducer.selectedCoinPair.base_unit.toUpperCase() +
  //                 "/" +
  //                 tradeReducer.selectedCoinPair.quote_unit.toUpperCase()
  //               }`,
  //       }}
  //       javaScriptEnabled={true}
  //       domStorageEnabled={true}
  //       startInLoadingState={true}
  //       scalesPageToFit={true}
  //       mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
  //       scrollEnabled
  //     />
  //   </View>
  // );
  console.log("GRAPH======", `${END_POINT.GRAPH_URL}${tradeReducer.selectedCoinPair.base_unit.toUpperCase() +
    "/" +
    tradeReducer.selectedCoinPair.quote_unit.toUpperCase()
    }`);
  return (
    <View collapsable={false}>
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginHorizontal: 10,
          marginVertical: 8,
        }}
      >
        <View style={{ alignItems: "flex-start" }}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: Fonts.medium,
              color: volumeCheck >= 0 ? colors.appGreen : colors.appRed,
            }}
          >
            {renderLastPrice(tradeReducer.selectedCoinPair.name) != undefined
              ? renderLastPrice(tradeReducer.selectedCoinPair.name).last
              : " "}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.inactiveTextColor,
            }}
          >
            ≈$
            {Singleton.getInstance().funComma(
              renderUsdPrice(tradeReducer.selectedCoinPair.quote_unit) !=
                undefined &&
                renderLastPrice(tradeReducer.selectedCoinPair.name) != undefined
                ? (
                  renderLastPrice(tradeReducer.selectedCoinPair.name).last *
                  renderUsdPrice(tradeReducer.selectedCoinPair.quote_unit)
                )?.toFixed(4)
                : " "
            )}
          </Text>
          <PercentageChange
            pair={`${tradeReducer?.selectedCoinPair?.base_unit.toUpperCase()}/${tradeReducer?.selectedCoinPair?.quote_unit.toUpperCase()}`}
          />
          {/* <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.medium,
                          color:
                            volumeCheck >= 0 ? colors.appGreen : colors.appRed,
                        }}>
                        {tradeReducer.selectedCoinPair.price_change_percent}
                      </Text> */}
        </View>
        <View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <View style={{ marginRight: 15, flex: 3 }}>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textColor,
                  fontSize: 11,
                }}
              >
                {strings.buy_sell_market_screen.hight24h}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                {renderLastPrice(tradeReducer.selectedCoinPair.name) !=
                  undefined
                  ? renderLastPrice(tradeReducer.selectedCoinPair.name).high
                  : " "}
              </Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textColor,
                  fontSize: 11,
                  // textAlign: "right",
                }}
              >
                {strings.buy_sell_market_screen.vol24h}
                {`(${tradeReducer.selectedCoinPair.quote_unit.toUpperCase()})`}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.inactiveTextColor,
                  // textAlign: "right",
                }}
              >
                {renderLastPrice(tradeReducer.selectedCoinPair.name) !=
                  undefined
                  ? Singleton.getInstance().numbersToBillion(
                    renderLastPrice(tradeReducer.selectedCoinPair.name)
                      .total_volume
                  )
                  : " "}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ marginRight: 15 }}>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textColor,
                  fontSize: 11,
                }}
              >
                {strings.buy_sell_market_screen.low24h}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                {renderLastPrice(tradeReducer.selectedCoinPair.name) !=
                  undefined
                  ? renderLastPrice(tradeReducer.selectedCoinPair.name).low
                  : " "}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        collapsable={false}
        style={{
          height: 500,
          backgroundColor: props.backgroundColorCode,
        }}
      >
        <WebView
          // ref={'webview'}
          style={{
            width: Dimensions.get("window").width,
            height: 400,
            paddingTop: 5,
            backgroundColor: ThemeManager.colors.SwapInput,
          }}
          androidHardwareAccelerationDisabled={false}
          androidLayerType={"software"}
          source={{
            uri:
              ThemeManager.colors.themeColor === "light"
                ? `${END_POINT.GRAPH_URL}${tradeReducer.selectedCoinPair.base_unit.toUpperCase() +
                "/" +
                tradeReducer.selectedCoinPair.quote_unit.toUpperCase()
                }`
                : `${END_POINT.GRAPH_URL_DARK}${tradeReducer.selectedCoinPair.base_unit.toUpperCase() +
                "/" +
                tradeReducer.selectedCoinPair.quote_unit.toUpperCase()
                }`,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
          scrollEnabled
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buySellTabBlock: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  btnBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    borderBottomWidth: 0,
  },
  btnText: {
    fontSize: 13,
    lineHeight: 44,
    color: "#333",
  },
  textUppercase: {
    textTransform: "uppercase",
  },
  btnActive: {
    backgroundColor: "#900",
  },
});

// export {MarketTradeBuySell};

export const BuySellMarketHeader = React.memo(BuySellMarketHeaderMemo);
