/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";
import moment from "moment";
import { colors, Fonts } from "../../theme";
import { useSelector } from "react-redux";
import { normal, Avenir_Medium } from "../../../app.json";
import { ThemeManager } from "../../../ThemeManager";
import Singleton from "../../Singleton";

function PairItems({ price, amount, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginLeft: 5,
          marginBottom: 1,
          // backgroundColor: "green",
        }}
      >
        <Text
          style={{
            color: ThemeManager.colors.textRedColor,
            // flex: 0,
            fontSize: 9,
            // flexWrap: 0,
            // flexShrink: 0,
            fontFamily: Fonts.regular,
          }}
        >
          {price}
        </Text>
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              color: ThemeManager.colors.textColor,
              // flex: 1,
              // flex: 0,
              // flexShrink: 0,

              // flexWrap: 0,
              alignSelf: "flex-end",
              fontSize: 9,
              fontFamily: Fonts.regular,
              textAlign: "right",
            }}
          >
            {amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const AskBook = (props) => {
  const marketSocketReducer = useSelector(
    (state) => state?.marketSocketReducer
  );
  const pricePrecision = props.pricePrecision;
  // console.log("AskBook====", props.actualPrecision);
  // console.log("AskBook==pricePrecision==", props.pricePrecision);

  // console.log(
  //   'marketSocketReducer?.sellData=-=-=>>>',
  //   marketSocketReducer?.sellData,
  // );
  // console.log(
  //   'marketSocketReducer?.sellDataLarge=-=-=>>>',
  //   marketSocketReducer?.sellDataLarge,
  // );

  //props.marketCoinInfo.find(
  //   value => value.name == props.selectedCoinPair.name,
  // );
  const renderItem = ({ item }) => {
    // let price = parseFloat(item[0]).toFixed(props.pricePrecision);
    let price = Singleton.getInstance().ParseFloatNumber(
      item[0],
      props.pricePrecision
    );
    let price1 = Singleton.getInstance().ParseFloatNumber(
      item[0],
      props.actualPrecision
    );

    // let amount = parseFloat(item[1]).toFixed(props.pricePrecision);
    let amount = parseFloat(item[1]);

    return (
      <PairItems
        amount={amount}
        price={price}
        onPress={() => {
          // props.onPress(`${price}`, `${amount}`);
          props.onPress(`${price1}`, `${amount}`);
        }}
      />
    );
  };
  return (
    <View style={[props.lisView]}>
      {marketSocketReducer?.sellData != undefined && (
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{ height: props.largeData ? 500 : 190 }}
          // nestedScrollEnabled={true}
          inverted
          bounces={false}
          data={
            props.largeData
              ? marketSocketReducer?.sellDataLarge
              : marketSocketReducer?.sellData
          }
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View
              style={[
                props.largeData ? styles.noRecordLargeData : styles.noRecord,
              ]}
            >
              <Text
                style={[
                  styles.noRecordText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                No records found!
              </Text>
            </View>
          }
        />
      )}
    </View>
    // </CardWhite>
  );
};

const styles = StyleSheet.create({
  tableTradeBlock: {
    backgroundColor: ThemeManager.colors.whiteScreen,
    zIndex: 2,
    // height: '100%',
    marginHorizontal: 0,
    borderRadius: 0,
    // height: 160,
    // paddingBottom: 10,
    // backgroundColor:"green",
    // marginLeft: 10
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: Fonts.regular,
    alignSelf: "center",
    color: colors.redTxt,
    fontSize: 13,
    paddingTop: 5,
  },
  tableTr: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ThemeManager.colors.whiteScreen,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 15,
  },
  tableTh: {
    flex: 1,
    maxWidth: "33.3333%",
  },
  tableThTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: ThemeManager.colors.whiteScreen,
  },
  textRight: {
    textAlign: "right",
  },
  tableTrd: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // backgroundColor: ThemeManager.colors.whiteScreen,
    // backgroundColor: 'red',
    // paddingLeft: 10,
    // paddingBottom: 5,
    // backgroundColor:"yellow"
  },
  tableTd: {
    flex: 1,
    // maxWidth: '48%',
    // backgroundColor: 'red',
    flexDirection: "row",
    // backgroundColor:"green",
    // marginLeft: 10,
  },
  textDark: {
    color: ThemeManager.colors.textRedColor,
  },
  textDarkRed: {
    color: ThemeManager.colors.whiteScreen,
  },
  tableTdTextRight: {
    justifyContent: "flex-start",
  },
  tableTdTextEnd: {
    justifyContent: "flex-end",
  },
  tableTdTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: ThemeManager.colors.textColor,
    letterSpacing: 0,
    fontWeight: "500",
  },
  noRecord: {
    alignItems: "center",
    justifyContent: "center",
    // color: ThemeManager.colors.textColor,
    fontSize: 10,
    // paddingBottom: 40,
    // marginTop: 40,
    // backgroundColor: "red",
    // flex: 1,
    height: Platform.OS == "android" ? 160 : 140,
  },
  noRecordLargeData: {
    alignItems: "center",
    justifyContent: "center",
    // color: ThemeManager.colors.textColor,
    fontSize: 10,
    // paddingBottom: 40,
    // marginTop: 100,
    // backgroundColor: "red",
    // flex: 1,
    height: Platform.OS == "android" ? 350 : 300,
  },
  noRecordText: {
    alignItems: "center",
    justifyContent: "center",

    color: ThemeManager.colors.textColor,
    fontSize: 10,
    // paddingBottom: 40,
    // marginTop: 40,
    // backgroundColor: "red",
  },
});

export { AskBook };
{
  /* <View
style={[
  styles.tableTrd,
  {backgroundColor: ThemeManager.colors.dashboardDarkBg},
]}>
<View style={styles.tableTd}>
  <Text
    style={[
      styles.tableTdTextStyle,
      styles.textDark,
     
    ]}>
    {price}
  </Text>
</View>
<View style={{maxWidth: '45%'}}>
  <Text
    style={[
      styles.tableTdTextStyle,
      {color: ThemeManager.colors.textColor},
    ]}>
    {amount}
  </Text>
</View>
</View> */
}
