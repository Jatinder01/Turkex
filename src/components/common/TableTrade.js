/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import Singleton from "../../Singleton";
import { colors, Fonts, Images } from "../../theme";
import { useSelector } from "react-redux";
function PairItems({
  coinA,
  coinB,
  lastPrice,
  vol,
  change,
  tabType,
  didSelectItem,
  total_Vol,
}) {
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  return (
    // <View style={styles.tableTrd}>
    <TouchableOpacity
      style={[
        styles.tableTrd,
        { backgroundColor: ThemeManager.colors.dashboardDarkBg },
      ]}
      onPress={didSelectItem}
    >
      <View style={[styles.tableTd]}>
        <Text
          style={[
            styles.tableTdTextStyle,
            styles.textDark,
            {
              color: ThemeManager.colors.textColor2,
              fontFamily: Fonts.semiBold,
              fontSize: 13,
            },
          ]}
        >
          {coinA}
        </Text>
        <Text
          style={[
            styles.tableTdTextStyle,
            {
              // alignSelf: 'flex-end',
              fontSize: 12,
              color: ThemeManager.colors.textColor3,
              fontFamily: Fonts.semiBold,
              // bottom: 8,
              alignSelf: "center",
              textAlign: "center",
            },
          ]}
        >
          /{coinB}
        </Text>
      </View>
      <View
        style={{
          // flex: 1,
          // maxWidth: '30%',
          // height: 30,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "70%",
        }}
      >
        <View
          style={[
            styles.tableTd1,
            {
              justifyContent: "flex-end",
              marginRight: 40,
              // backgroundColor: "red",
            },
          ]}
        >
          <Text
            style={[
              styles.tableTdTextStyle,
              styles.textDark /*styles.textDarkRed*/,

              { color: ThemeManager.colors.textColor4 },
            ]}
          >
            {Singleton.getInstance().ParseFloatNumber(lastPrice, 5)}
          </Text>
        </View>

        <View style={[styles.tableTd3, styles.tableTdTextRight]}>
          {tabType == 3 ? (
            <Text
              style={[
                styles.tableTdTextStyle,
                styles.textDark,
                {
                  color: ThemeManager.colors.textColor,
                  width: "100%",
                  textAlign: "right",
                },
              ]}
            >
              {total_Vol}
            </Text>
          ) : (
            <Text
              style={[
                styles.tableTdTextStyle,
                tabType == 2 ? styles.volCurrentText1 : styles.volCurrentText,
                {
                  width: "100%",
                },
              ]}
            >
              {change}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
    // {/* </View> */}
  );
}

const TableTrade = (props) => {
  // console.log("data--------------")
  return (
    <View
      style={[
        styles.tableTradeBlock,
        {
          backgroundColor: ThemeManager.colors.dashboardDarkBg,
        },
      ]}
    >
      <View
        style={[
          styles.tableTr,
          {
            backgroundColor: ThemeManager.colors.dashboardDarkBg,
          },
        ]}
      >
        <View style={styles.tableTh}>
          {props.tabType == 0 ? (
            <Text
              style={[
                styles.tableThTextStyle,
                { color: ThemeManager.colors.headerText },
              ]}
            >
              {props.tableThFirstText}
            </Text>
          ) : (
            <TouchableOpacity
              // onPress={props.allMarketClicked}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.tableThTextStyle,
                  { color: ThemeManager.colors.headerText },
                ]}
              >
                {props.tableThFirstText}
              </Text>
              {/* <Image
                source={{uri: Images.icon_dropDown}}
                style={{
                  left: 4,
                  height: 10,
                  width: 10,
                  resizeMode: 'contain',
                  // tintColor: 'black',
                }}
              /> */}
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flex: 1,
            // maxWidth: '30%',
            // height: 30,
            flexDirection: "row",
            justifyContent: "flex-end",
            // alignItems: "center",
          }}
        >
          <View
            style={[
              styles.tableTh,
              {
                // justifyContent: "flex-end",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                marginRight: 20,
              },
            ]}
          >
            <Text
              style={[
                styles.tableThTextStyle,
                {
                  color: ThemeManager.colors.headerText,
                  marginRight: -10,
                  minWidth: 80,
                },
              ]}
            >
              {props.tableThSecondText}
            </Text>
          </View>
          <View style={[styles.tableTh, styles.tableTdTextRight]}>
            <Text
              style={[
                styles.tableThTextStyle,
                { textAlign: "right", color: ThemeManager.colors.headerText },
              ]}
            >
              {props.tableThThirdText}
            </Text>
          </View>
        </View>
      </View>
      {props.data?.length > 0 ? (
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          scrollEnabled={false}
          data={props.data}
          renderItem={({ item }) => (
            <PairItems
              didSelectItem={() => props.selectedMarketItem(item)}
              coinA={item?.base_unit?.toUpperCase()}
              coinB={item?.quote_unit?.toUpperCase()}
              lastPrice={item?.last}
              vol={item?.volume}
              change={item?.price_change_percent}
              tabType={props.tabType}
              total_Vol={parseFloat(item?.total_volume).toFixed(2)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View
          style={{
            height: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.tableThTextStyle}>No Data</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableTradeBlock: {
    backgroundColor: colors.white,
    // height: '100%',
    // flex: 1,
    paddingBottom: 0,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: Fonts.regular,
    alignSelf: "center",
    color: colors.black,
    fontSize: 13,
    paddingTop: 5,
  },
  tableHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  tableLabelTextStyle: {
    color: "#3C3C3C",
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  tableTr: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tableTh: {
    flex: 1,
    maxWidth: "33.3333%",
  },
  tableThTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: colors.greyTxt,
    letterSpacing: -0.3,
    fontWeight: "500",
    textAlign: "left",
  },
  textRight: {
    textAlign: "right",
  },
  tableTrd: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 15,
    paddingVertical: 10,
  },
  tableTd: {
    // flex: 1,
    maxWidth: "40%",
    // height: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tableTd3: {
    // flex: 1,
    maxWidth: "30%",
    // backgroundColor: 'red',
    // height: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tableTd1: {
    flex: 1,
    // backgroundColor: 'red',
    maxWidth: "60%",
    // height: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textDark: {
    color: colors.black,
    // paddingVertical: 2,
    alignSelf: "center",
  },
  textDarkRed: {
    color: "#C00000",
  },
  tableTdTextRight: {
    justifyContent: "flex-end",
  },
  volCurrentText: {
    color: colors.white,
    fontSize: 12,
    backgroundColor: colors.appGreen,
    borderRadius: 4,
    overflow: "hidden",
    width: "85%",
    textAlign: "center",
    paddingVertical: 8,
    alignSelf: "center",
  },
  volCurrentText1: {
    color: colors.white,
    fontSize: 12,
    backgroundColor: colors.appRed,
    borderRadius: 4,
    overflow: "hidden",
    width: "85%",
    textAlign: "center",
    paddingVertical: 8,
    alignSelf: "center",
  },

  tableTdTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: ThemeManager.colors.headerInActiveText,
    // paddingVertical: 8,
  },
});

export { TableTrade };
