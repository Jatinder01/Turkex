import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import moment from "moment";
import { colors, Fonts } from "../../theme";
import { normal, Avenir_Medium } from "../../../app.json";
import { useSelector } from "react-redux";
import { ThemeManager } from "../../../ThemeManager";
import Singleton from "../../Singleton";

function PairItems({ total, price, amount, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.tableTrd,
          { backgroundColor: ThemeManager.colors.dashboardDarkBg },
        ]}
      >
        <View style={styles.tableTd1}>
          <Text style={[styles.tableTdTextStyle, styles.textDarkRed]}>
            {price}
          </Text>
        </View>
        <View style={styles.tableTd}>
          <Text
            style={[
              styles.tableTdTextStyle,
              styles.textDark,
              { color: ThemeManager.colors.textColor, textAlign: "right" },
            ]}
          >
            {amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const BidsBook = (props) => {
  const marketSocketReducer = useSelector(
    (state) => state?.marketSocketReducer
  );
  const pricePrecision = props.pricePrecision;

  // props.marketCoinInfo.find(
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
        onPress={() => props.onPress(`${price1}`, `${amount}`)}
      />
    );
  };
  return (
    // <CardWhite cardStyle={[styles.tableTradeBlock,]}>
    <View style={[props.lisView]}>
      {marketSocketReducer?.buyData != undefined && (
        <FlatList
          // nestedScrollEnabled={true}
          // scrollEnabled
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{ height: props.largeData ? 500 : 190 }}
          data={
            props.largeData
              ? marketSocketReducer?.buyDataLarge
              : marketSocketReducer?.buyData
          }
          // contentContainerStyle={{height: 180}}
          bounces={false}
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
          // ListEmptyComponent={
          //   <View
          //     style={[
          //       styles.noRecord,
          //       { backgroundColor: ThemeManager.colors.dashboardDarkBg },
          //     ]}
          //   >
          //     <Text
          //       style={[
          //         styles.noRecord,
          //         { color: ThemeManager.colors.textColor },
          //       ]}
          //     >
          //       No records found!
          //     </Text>
          //   </View>
          // }
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
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: Fonts.regular,
    alignSelf: "center",
    color: ThemeManager.colors.textRedColor,
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
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ThemeManager.colors.whiteScreen,
    // paddingHorizontal: 10,
    // paddingBottom: 5,
    marginLeft: 5,
    marginBottom: 1,
    // maxHeight: 300,
    // backgroundColor:"red"
  },
  tableTd: {
    flex: 1,
    maxWidth: "50%",
    flexDirection: "row",
    // backgroundColor:"green",
    justifyContent: "flex-end",
  },
  tableTd1: {
    flex: 1,
    maxWidth: "40%",
    flexDirection: "row",
    // backgroundColor:"green"
  },
  textDark: {
    color: ThemeManager.colors.textColor,
  },
  textDarkRed: {
    color: ThemeManager.colors.textGreenColor,
  },
  tableTdTextRight: {
    justifyContent: "flex-start",
  },
  tableTdTextEnd: {
    justifyContent: "flex-end",
  },
  tableTdTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: 9,
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
    // backgroundColor: "yellow",
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
    // backgroundColor: "yellow",
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
    // backgroundColor: "yellow",
  },
  // noRecord: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   color: ThemeManager.colors.textColor,
  //   fontSize: 10,
  //   paddingBottom: 40,
  //   marginTop: 100,
  //   backgroundColor: "red",
  //   // alignItems: "center",
  //   // justifyContent: "center",
  //   // color: ThemeManager.colors.textColor,
  //   // fontSize: 9,
  //   // paddingBottom: 40,
  //   // marginTop: 100,
  //   // backgroundColor: "yellow",
  // },
});

export { BidsBook };
