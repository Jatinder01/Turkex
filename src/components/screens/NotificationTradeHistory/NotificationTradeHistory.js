/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, FlatList } from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import fonts from "../../../theme/fonts";
import {
  ButtonPrimary,
  ConvertInput,
  OrderListItem,
  Wrap,
  Loader,
  InputField,
  CustomEmptyView,
} from "../../common";
import BorderLine from "../../common/BorderLine";
import TradeHeader from "../../common/TradeHeader";
import styles from "./NotificationTradeHistoryStyle";
import PagerView from "react-native-pager-view";
// import ActionSheet from 'react-native-actionsheet';
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import DatePicker from "react-native-date-picker";
import {
  resetTradeHistory,
  getMarketList,
  getTreadHistory,
  getUserAllBalance,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import Moment from "moment";

// const {height} = Dimensions.get('window');

// const todayDate = new Date().toJSON().slice(0, 10);

let paramOpenOrder;
let paramOrder;
let paramTrade;
const NotificationTradeHistory = (props) => {
  const [pageLimit, setPageLImit] = useState(10);
  const [pageNumberTrade, setPageNumberTrade] = useState(1);

  const {
    marketCoinInfo,
    tradeHistoryLoading,
    tradeHistory,
    totalRecordsTradeHistory,
  } = useSelector((state) => state?.orderHistoryReducer);
  //   const arrPair = [{name: 'All'}, ...orderHistoryReducer?.marketCoinInfo];

  const dispatch = useDispatch();
  useEffect(() => {
    var currentRoute = props?.navigation?.state?.routeName;
    console.log("props=-=-=-=-=gh-=", JSON.stringify(props));
    props.navigation.addListener("didFocus", async (event) => {
      if (currentRoute === event.state.routeName) {
        dispatch(getUserAllBalance());

        paramTrade = {
          page: `${pageNumberTrade}`,
          limit: pageLimit,
        };

        dispatch(resetTradeHistory());
        dispatch(getMarketList());
        let linkConcat = "&market=" + props?.market;
        dispatch(getTreadHistory(paramTrade, linkConcat));
      }
    });
    props.navigation.addListener("didBlur", (event) => {});
    return () => {};
  }, []);
  const getName = (name) => {
    let data = marketCoinInfo.find((value) => value.id == name);
    return data?.name;
  };
  const getFilterString = (text) => {
    switch (text) {
      case "New":
        return "wait";
      case "Pending":
        return "pending";
      case "Done":
        return "done";
      case "Cancelled":
        return "cancel";
      case "Rejected":
        return "reject";
      case "Sell":
        return "sell";
      case "Buy":
        return "buy";
      case "Limit":
        return "limit";
      case "Market":
        return "market";
      case "Stop Loss Limit":
        return "stop_loss_limit";
      case "Take Profit Limit":
        return "take_profit_limit";
      case "All":
        return "";
    }
  };
  const renderTradeHistory = () => {
    return (
      <View>
        <Loader isLoading={tradeHistoryLoading} />
        {tradeHistory.length > 0 ? (
          <View>
            <FlatList
              keyboardShouldPersistTaps={"handled"}
              data={tradeHistory}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5 }}
              bounces={false}
              contentContainerStyle={{ flexGrow: 1 }}
              onEndReachedThreshold={0.1}
              extraData={tradeHistory}
              onEndReached={() => {
                isCloseToBottomTrade();
              }}
              scrollEnabled={true}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      backgroundColor: ThemeManager.colors.inputColor,
                      flex: 1,
                      margin: 2,
                      padding: 10,
                    }}
                  >
                    <View style={styles.orderView}>
                      <Text
                        style={[
                          styles.nameText,
                          { color: ThemeManager.colors.textColor1 },
                        ]}
                      >
                        {getName(item.market)}
                      </Text>

                      <Text
                        style={[
                          styles.dateText,
                          { color: ThemeManager.colors.inactiveTextColor },
                        ]}
                      >
                        {Moment(item.created_at).format("DD-MM-YY hh:mm:ss")}
                      </Text>
                    </View>
                    <View style={styles.orderView}>
                      <Text
                        style={[
                          styles.limitText,
                          {
                            color:
                              item.side === "buy"
                                ? ThemeManager.colors.textGreenColor
                                : ThemeManager.colors.textRedColor,
                          },
                        ]}
                      >
                        {item.side.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.orderView}>
                      <Text
                        style={[
                          styles.dateText,
                          {
                            fontSize: 14,
                          },
                        ]}
                      >
                        {strings.trade_tab.price}
                      </Text>
                      <Text
                        style={[
                          styles.dateText,
                          { color: ThemeManager.colors.textColor1 },
                        ]}
                      >
                        {item.price}
                      </Text>
                    </View>
                    <View style={styles.orderView}>
                      <Text
                        style={[
                          styles.dateText,
                          {
                            fontSize: 14,
                          },
                        ]}
                      >
                        {strings.trade_tab.amount}
                      </Text>
                      <Text
                        style={[
                          styles.dateText,
                          { color: ThemeManager.colors.textColor1 },
                        ]}
                      >
                        {item.amount}
                      </Text>
                    </View>
                    <View style={styles.orderView}>
                      <Text
                        style={[
                          styles.dateText,
                          {
                            fontSize: 14,
                          },
                        ]}
                      >
                        {strings.trade_tab.fee}
                      </Text>
                      <Text
                        style={[
                          styles.dateText,
                          { color: ThemeManager.colors.textColor1 },
                        ]}
                      >
                        {item.fee_amount} {item.fee_currency.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.orderView}>
                      <Text
                        style={[
                          styles.dateText,
                          {
                            fontSize: 14,
                          },
                        ]}
                      >
                        {strings.trade_tab.total}
                      </Text>
                      <Text
                        style={[
                          styles.dateText,
                          { color: ThemeManager.colors.textColor1 },
                        ]}
                      >
                        {item.total}
                      </Text>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={() => {
                return <View style={{ height: 100 }}></View>;
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 20,
              }}
            ></View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 100,
                  // flex: 1,
                }}
              >
                {/* <Image
                  source={{uri: ThemeManager.ImageIcons.icon_no_open_order}}
                  style={{
                    height: 80,
                    width: 80,
                    resizeMode: 'contain',
                    marginTop: 100,
                  }}
                /> */}
                <CustomEmptyView />
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.spot.no_Trade_History}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const isCloseToBottomTrade = () => {
    let page = pageNumberTrade + 1;

    if (tradeHistory.length != totalRecordsTradeHistory) {
      paramTrade = {
        page: `${page}`,
        limit: pageLimit,
      };
      setPageNumberTrade(page);
      dispatch(getTreadHistory(paramTrade, ""));
    }
  };

  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.bgDarkwhite },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 10,
          marginHorizontal: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}
        >
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_back }}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        <Text
          style={[
            {
              fontSize: 18,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor1,
            },
          ]}
        >
          {"Trade History"}
        </Text>
        <View style={{ width: 25 }}></View>
      </View>
      <View
        style={{
          // backgroundColor: ThemeManager.colors.bgDarkwhite,
          flex: 1,
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            flex: 1,
            marginTop: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <View key="3">{renderTradeHistory()}</View>
          </View>
        </View>
      </View>
    </Wrap>
  );
};
export default NotificationTradeHistory;
