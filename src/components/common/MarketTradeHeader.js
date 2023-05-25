/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";

const MarketTradeHeader = (props) => {
  const { textStyle, viewStyle } = styles;
  return (
    <View
      style={[
        styles.viewMainContainer,
        { backgroundColor: ThemeManager.colors.dashboardDarkBg },
      ]}
    >
      <SafeAreaView />
      {/* <View style={{position: 'relative'}}> */}
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <View>
            <TouchableOpacity onPress={props.onBackPress}>
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_back }}
                style={{ height: 20, width: 20, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
              props.pairStyleView,
            ]}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={props.onMarketChangePress}
            >
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_swap_c }}
                style={[
                  {
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                  },
                  props.swapIconStyle,
                ]}
              />
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    marginLeft: 5,
                    color: ThemeManager.colors.textColor,
                  },
                  props.pairTextStyle,
                ]}
              >
                {props.currencyPair}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={props.onPressTrade}>
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_trade_right }}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={props.disabled}
              onPress={props.onPressStar}
            >
              <Image
                source={props.favIcon}
                style={[
                  {
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    marginHorizontal: 5,
                    tintColor: props.favSelected
                      ? ThemeManager.colors.selectedTextColor
                      : null,
                  },
                  props.favIconStyle,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewMainContainer: { marginTop: 10 },
  viewStyle: {
    flexDirection: "row",
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'relative',
    shadowOpacity: 0,
    // flexWrap: 'wrap',
    paddingTop: 20,
    // paddingBottom: 20,
    // backgroundColor:colors.lightThemeBg,
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    // marginTop: 10,
  },
  textStyle: {
    // fontFamily: `${Avenir_Medium}`,
    fontSize: 18,
    color: colors.white,
    // textTransform: 'uppercase',
    textAlign: "center",
    letterSpacing: -0.45,
    fontWeight: "500",
  },
  trandeHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "yellow",
  },
  iconLeft: {
    // width: 24,
    // justifyContent: 'center',
    alignSelf: "center",
    paddingRight: 15,
  },
  titleRightBlock: {
    justifyContent: "flex-end",
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  openTextStyle: {
    fontSize: 16,
    color: colors.blackTxt,
    textAlign: "right",
  },
  backImg: {
    tintColor: colors.blackTxt,
    height: 18,
    width: 15,
  },
  drpdwn: {
    marginLeft: 7,
    height: 8,
    width: 12,
  },
  starImg: {
    height: 18,
    width: 18,
  },
  starImg1: {
    height: 22,
    width: 22,
  },
});
export default MarketTradeHeader;
