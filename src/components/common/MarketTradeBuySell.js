/* eslint-disable react-native/no-inline-styles */
import moment from "moment";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Fonts } from "../../theme";

const Item = ({ date, price, amount, taker_type }) => {
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
        marginTop: 0,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
          // marginRight: 4,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: ThemeManager.colors.textColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {date}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            // justifyContent: 'flex-end',
          }}
        >
          <Text
            style={{
              color: taker_type == "sell" ? colors.appRed : colors.appGreen,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {price}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            // justifyContent: 'flex-end',
          }}
        >
          <Text
            style={{
              color: ThemeManager.colors.textColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MarketTradeBuySellMemo = (props) => {
  const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    let dd = moment(a).format("hh:mm:ss");
    return dd;
  };
  const { publicTrade } = useSelector((state) => state?.marketSocketReducer);

  const renderItem = ({ item }) => {
    return (
      <Item
        date={timeConverter(item?.trades[0].date)}
        price={item?.trades[0].price}
        amount={item?.trades[0].amount}
        taker_type={item?.trades[0].taker_type}
      />
    );
  };
  console.log("==========SCRENN000000", publicTrade);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        scrollEnabled={false}
        data={publicTrade}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 50,
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.regular,
                fontSize: 16,
              }}
            >
              No Data
            </Text>
          </View>
        }
      />
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

export const MarketTradeBuySell = React.memo(MarketTradeBuySellMemo);
