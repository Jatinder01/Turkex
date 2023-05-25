/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import fonts from "../../../theme/fonts";
import {
  ButtonPrimary,
  OrderListItem,
  Wrap,
  Loader,
  CustomEmptyView,
} from "../../common";
import BorderLine from "../../common/BorderLine";
import TradeHeader from "../../common/TradeHeader";
import styles from "./SpotTradeStyle";
import PagerView from "react-native-pager-view";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import DatePicker from "react-native-date-picker";
import {
  getOrderHistory,
  resetOrderHistory,
  resetTradeHistory,
  cancelOrder,
  getMarketList,
  getTreadHistory,
  getOpenOrders,
  getUserAllBalance,
  resetOpenOrderHistory,
  resetOpenOrderSingleHistory,
  cancelAllOrderWithoutParams,
  resetOpenOrderAllHistory,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import Moment from "moment";
import * as constants from "../../../Constants";
import SelectDropdown from "react-native-select-dropdown";
import DropDownPicker from "react-native-dropdown-picker";
const { height } = Dimensions.get("window");
const OrderType = [
  "All",
  "Limit",
  "Market",
  "Stop Loss Limit",
  "Take Profit Limit",
];
const Type = ["All", "Buy", "Sell"];
const arrStateFilter = [
  "All",
  "Pending",
  "New",
  "Done",
  "Cancelled",
  "Rejected",
];
const todayDate = new Date().toJSON().slice(0, 10);
const tabData = [
  {
    tabName: strings.spot.open_orders,
    selected: true,
  },
  {
    tabName: strings.spot.open_history,
    selected: false,
  },
  {
    tabName: strings.spot.trade_history,
    selected: false,
  },
];
let paramOpenOrder;
let paramOrder;
let paramTrade;
const ToggleSwitch = ({
  labelName,
  toggle,
  list,
  selectedIndex,
  onPress,
  notPair,
  onPressItem,
  smallHeight,
  tradePair,
}) => {
  // console.log("list=-=-=-=-", list);
  const [selectedVal, setSelectedVal] = useState(0);
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          borderTopColor: ThemeManager.colors.borderColor,
          borderTopWidth: 0.8,
          paddingHorizontal: tradePair ? 0 : 15,
        }}
      >
        <Text
          style={{
            color: ThemeManager.colors.headerText,
            fontSize: 16,
            fontFamily: Fonts.regular,
            paddingVertical: 15,
          }}
        >
          {labelName}
        </Text>
        <Image
          source={{ uri: toggle ? Images.listDropDown : Images.listArrow }}
          style={{ height: 15, width: 15, resizeMode: "contain" }}
        />
      </TouchableOpacity>
      {toggle && (
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          data={list} // showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled
          // contentContainerStyle={{ height: 200 }}

          style={{
            paddingHorizontal: tradePair ? 0 : 15,
            height: smallHeight ? 120 : 150,
            backgroundColor: ThemeManager.colors.SwapInput,
          }}
          scrollEnabled={true}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedVal(index);
                  let itm = notPair ? item : item;

                  onPressItem(itm, index);
                }}
              >
                <Text
                  style={{
                    color:
                      selectedIndex == index
                        ? ThemeManager.colors.textColor
                        : ThemeManager.colors.headerText,
                    fontFamily: fonts.regular,
                    fontSize: 16,
                    paddingVertical: 5,
                  }}
                >
                  {notPair ? item : item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};
const SpotTrade = (props) => {
  const tabRef = useRef(null);

  const pairDD = useRef(null);
  const stateDD = useRef(null);
  const TypeDD = useRef(null);
  const OrderTypeDD = useRef(null);
  const ActionSheetOrders = useRef(null);

  const [tabIndex, setTabIndex] = useState(0);
  const [showCancelVisible, setShowCancelVisible] = useState(false);
  const [showSingleCancelVisible, setShowSingleCancelVisible] = useState(false);

  const [hideAll, setHideHall] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(
    strings.spot.all_open_orders
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLImit] = useState(10);
  const [pageNumberTrade, setPageNumberTrade] = useState(1);
  const [pageNumberOrder, setPageNumberOrder] = useState(1);

  const tradeReducer = useSelector((state) => state?.tradeReducer);
  const orderHistoryReducer = useSelector(
    (state) => state?.orderHistoryReducer
  );
  console.log("orderHistoryReducer=-=-=-=>>>>", orderHistoryReducer);
  console.log(
    "orderHistoryReducertradeHistory=-=-=-=>>>>",
    orderHistoryReducer?.tradeHistory
  );

  const [showFilter, setShowFilter] = useState(false);

  const [cancelOrderItem, setCancelOrderItem] = useState("");

  const [showOrderHistoryFilter, setOrderHistoryShowFilter] = useState(false);
  const [showTradeHistoryFilter, setshowTradeHistoryFilter] = useState(false);

  const [pairFilter, setpairFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [typeFilter, settTypeFilter] = useState("All");
  const [orderTypeFilter, setOrderTypeFilter] = useState("All");
  const [pairId, setPairId] = useState("");
  const [fromDate, setfromDate] = useState("YYYY-MM-DD");
  const [toDate, setToDate] = useState("YYYY-MM-DD");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const arrPair = [{ name: "All" }, ...orderHistoryReducer?.marketCoinInfo];
  const [fromDateSelected, setfromDateSelected] = useState(null);

  const [orderHistoryFilter, setOrderHistoryFilter] = useState(false);
  const [tradeHistoryFilter, setTradeHistoryFilter] = useState(false);
  const [minimumToDate, setMinimumToDate] = useState(null);
  const [selectedDepositPairIndex, setSelectedDepositPairIndex] = useState(0);
  const [selectedDepositStateIndex, setSelectedDepositStateIndex] = useState(0);
  const [selectedDepositTypeIndex, setSelectedDepositTypeIndex] = useState(0);

  //eg
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { name: "All" },
    ...orderHistoryReducer?.marketCoinInfo,
  ]);
  const [item, setItem] = useState(null);
  //eg
  const [pairToggle, setPairToggle] = useState(false);
  const [stateToggle, setStateToggle] = useState(false);
  const [typeToggle, setTypeToggle] = useState(false);
  const [orderToggle, setOrderToggle] = useState(false);
  const [pairToggleIndex, setPairToggleIndex] = useState(0);
  const [stateToggleIndex, setStateToggleIndex] = useState(0);
  const [typeToggleIndex, setTypeToggleIndex] = useState(0);
  const [orderToggleIndex, setOrderToggleIndex] = useState(0);
  const [selectedDepositOrderTypeIndex, setSelectedDepositOrderTypeIndex] =
    useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    var currentRoute = props?.navigation?.state?.routeName;

    props.navigation.addListener("didFocus", async (event) => {
      if (currentRoute === event.state.routeName) {
        paramOpenOrder = {
          page: `${pageNumber}`,
          limit: pageLimit,
        };
        paramOrder = {
          page: `${pageNumberOrder}`,
          limit: pageLimit,
        };
        paramTrade = {
          page: `${pageNumberTrade}`,
          limit: pageLimit,
        };
        dispatch(resetOpenOrderHistory());
        // dispatch(resetOpenOrderSingleHistory());
        dispatch(resetOrderHistory());
        dispatch(resetTradeHistory());
        dispatch(getMarketList());
        dispatch(resetOpenOrderAllHistory());
        dispatch(getOpenOrders(paramOpenOrder, "&state=wait", true));
        dispatch(getOrderHistory(paramOrder, "", true));

        dispatch(getTreadHistory(paramTrade, ""));
      }
    });
    props.navigation.addListener("didBlur", (event) => { });
    return () => { };
  }, []);
  const getName = (name) => {
    let data = orderHistoryReducer?.marketCoinInfo.find(
      (value) => value.id == name
    );
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
        <Loader isLoading={orderHistoryReducer?.tradeHistoryLoading} />
        {orderHistoryReducer?.tradeHistory.length > 0 ? (
          <View>
            <FlatList
              keyboardShouldPersistTaps={"handled"}
              data={orderHistoryReducer?.tradeHistory}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5 }}
              bounces={false}
              // contentContainerStyle={{height: height - 80}}
              contentContainerStyle={{ flexGrow: 1 }}
              onEndReachedThreshold={0.1}
              extraData={orderHistoryReducer?.tradeHistory}
              onEndReached={() => {
                isCloseToBottomTrade();
              }}
              // onEndReached={isCloseToBottomTrade}
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
                              item?.side === "buy"
                                ? ThemeManager.colors.textGreenColor
                                : ThemeManager.colors.textRedColor,
                          },
                        ]}
                      >
                        {item?.side?.toUpperCase()}
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
                        {/* {' ('}
                        {item.coin2}
                        {')'} */}
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
                        {/* {' ('}
                        {item.coin1}
                        {')'} */}
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
                        {/* {' ('}
                        {item.coin1}
                        {')'} */}
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
                        {/* {' ('}
                        {item.coin2}
                        {')'} */}
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
                // marginTop: 20,
              }}
            ></View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // flex: 1,
                }}
              >
                <CustomEmptyView style={{ marginTop: 100 }} />
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

  const isCloseToBottom = () => {
    let page = pageNumber + 1;

    if (
      orderHistoryReducer?.openOrders.length <
      orderHistoryReducer?.totalRecordsOpenOrder
    ) {
      paramOpenOrder = {
        page: `${page}`,
        limit: pageLimit,
      };
      setPageNumber(page);
      dispatch(getOpenOrders(paramOpenOrder, "&state=wait", true));
    }
  };
  const isCloseToBottomOrderHistory = () => {
    let page = pageNumberOrder + 1;

    if (
      orderHistoryReducer?.orderHistory.length <
      orderHistoryReducer?.totalrecords
    ) {
      paramOrder = {
        page: `${page}`,
        limit: pageLimit,
      };
      setPageNumberOrder(page);
      if (orderHistoryFilter) {
        let linkConcat = "";
        if (pairFilter != "All") {
          linkConcat = linkConcat + "&market=" + pairId;
        }
        if (stateFilter != "All") {
          linkConcat =
            linkConcat + "&state=" + getFilterString(stateFilter).toLowerCase();
        }
        if (typeFilter != "All") {
          linkConcat =
            linkConcat + "&type=" + getFilterString(typeFilter).toLowerCase();
        }
        if (orderTypeFilter != "All") {
          linkConcat =
            linkConcat +
            "&ord_type=" +
            getFilterString(orderTypeFilter).toLowerCase();
        }

        dispatch(getOrderHistory(paramOrder, linkConcat, true));
      } else {
        dispatch(getOrderHistory(paramOrder, "", true));
      }
    }
  };
  const isCloseToBottomTrade = () => {
    let page = pageNumberTrade + 1;

    if (
      orderHistoryReducer?.tradeHistory.length <
      orderHistoryReducer?.totalRecordsTradeHistory
    ) {
      paramTrade = {
        page: `${page}`,
        limit: pageLimit,
      };
      setPageNumberTrade(page);
      dispatch(getTreadHistory(paramTrade, ""));
    }
  };

  const updateOrderList = () => {
    let params = {
      page: "1",
      limit: pageLimit,
    };

    dispatch(
      getOpenOrders(
        params,
        `&market=${tradeReducer?.selectedCoinPair?.base_unit +
        tradeReducer?.selectedCoinPair?.quote_unit
        }&state=wait`,
        true
      )
    ).then((res) => {
      dispatch(getUserAllBalance());
    });
  };
  const renderOpenOrders = () => {
    return (
      <View style={{ flex: 1 }}>
        <Loader isLoading={orderHistoryReducer?.openOrderHistoryLoading} />
        {orderHistoryReducer?.openOrders?.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              keyboardShouldPersistTaps={"handled"}
              data={orderHistoryReducer?.openOrders}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5, paddingBottom: 60 }}
              bounces={false}
              // contentContainerStyle={{height: height - 80}}
              contentContainerStyle={{ flexGrow: 1 }}
              onEndReachedThreshold={0.1}
              extraData={orderHistoryReducer?.openOrders}
              ListFooterComponent={() => {
                return <View style={{ height: 100 }}></View>;
              }}
              onEndReached={() => {
                isCloseToBottom();
              }}
              scrollEnabled={true}
              renderItem={({ item, index }) => {
                if (item.ord_type === "market") {
                  return null;
                } else {
                  if (selectedOrders === strings.spot.all_open_orders) {
                    return (
                      <View
                        style={{
                          backgroundColor: ThemeManager.colors.whiteScreen,
                          marginVertical: 5,
                          marginHorizontal: 5,
                        }}
                      >
                        <OrderListItem
                          pairName={getName(item.market)}
                          side={item.side}
                          state={item.state}
                          createdAt={Moment(item.created_at).format(
                            "DD-MM-YY hh:mm:ss"
                          )}
                          avg={item.avg_price}
                          price={item.price}
                          filled={item.executed_volume}
                          amount={item.origin_volume}
                          ord_type={item.ord_type}
                          quote_unit={""}
                          cancelOrderItem={() => {
                            setShowSingleCancelVisible(true);
                            setCancelOrderItem(item.id);
                          }}
                          didSelectItem={(sender) => {
                            if (
                              item.state == "pending" ||
                              item.state == "wait"
                            ) {
                            }
                          }}
                        />
                      </View>
                    );
                  } else if (selectedOrders === strings.spot.sell_orders) {
                    return (
                      <>
                        {item.side !== "buy" ? (
                          <View
                            style={{
                              backgroundColor: ThemeManager.colors.whiteScreen,
                              marginVertical: 5,
                              marginHorizontal: 5,
                            }}
                          >
                            <OrderListItem
                              pairName={getName(item.market)}
                              side={item.side}
                              state={item.state}
                              createdAt={Moment(item.created_at).format(
                                "DD-MM-YY hh:mm:ss"
                              )}
                              avg={item.avg_price}
                              price={item.price}
                              filled={item.executed_volume}
                              amount={item.origin_volume}
                              ord_type={item.ord_type}
                              // side={item.side}
                              quote_unit={""}
                              cancelOrderItem={() => {
                                setShowSingleCancelVisible(true);
                                setCancelOrderItem(item.id);
                              }}
                              didSelectItem={(sender) => {
                                if (
                                  item.state == "pending" ||
                                  item.state == "wait"
                                ) {
                                }
                              }}
                            />
                          </View>
                        ) : null}
                      </>
                    );
                  } else if (selectedOrders === strings.spot.buy_orders) {
                    return (
                      <>
                        {item.side !== "sell" ? (
                          <View
                            style={{
                              backgroundColor: ThemeManager.colors.whiteScreen,
                              marginVertical: 5,
                              marginHorizontal: 5,
                            }}
                          >
                            <OrderListItem
                              pairName={getName(item.market)}
                              side={item.side}
                              state={item.state}
                              createdAt={Moment(item.created_at).format(
                                "DD-MM-YY hh:mm:ss"
                              )}
                              avg={item.avg_price}
                              price={item.price}
                              filled={item.executed_volume}
                              amount={item.origin_volume}
                              ord_type={item.ord_type}
                              // side={item.side}
                              quote_unit={""}
                              cancelOrderItem={() => {
                                setShowSingleCancelVisible(true);
                                setCancelOrderItem(item.id);
                              }}
                              didSelectItem={(sender) => {
                                if (
                                  item.state == "pending" ||
                                  item.state == "wait"
                                ) {
                                  // this.props.navigation.navigate('OrderDetail', { TransactionId: item.id })
                                }
                              }}
                            />
                          </View>
                        ) : null}
                      </>
                    );
                  }
                }
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // flex: 1,
                }}
              >
                {/* <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_no_open_order }}
                  style={{
                    height: 80,
                    width: 80,
                    resizeMode: "contain",
                    marginTop: 100,
                  }}
                /> */}
                <CustomEmptyView style={{ marginTop: 70 }} />
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.spot.no_open_orders}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderOrderHistory = () => {
    return (
      <View>
        <Loader isLoading={orderHistoryReducer?.orderHistoryLoading} />
        {orderHistoryReducer?.orderHistory !== [] ? (
          <View>
            {orderHistoryReducer?.orderHistory.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setHideHall(!hideAll);
                }}
                style={styles.headerStyle}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_select }}
                  style={[
                    styles.selectIconStyle,
                    {
                      tintColor: hideAll
                        ? ThemeManager.colors.selectedTextColor
                        : null,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.hideText,
                    { color: ThemeManager.colors.textColor1 },
                  ]}
                >
                  {strings.trade_tab.hide_all_cancelled}
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
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
                      source={{
                        uri: ThemeManager.ImageIcons.icon_no_open_order,
                      }}
                      style={{
                        height: 80,
                        width: 80,
                        resizeMode: "contain",
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
                      {strings.spot.no_order_history}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <FlatList
              data={orderHistoryReducer?.orderHistory}
              keyboardShouldPersistTaps={"handled"}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5 }}
              bounces={false}
              onEndReachedThreshold={0.1}
              extraData={orderHistoryReducer?.orderHistory}
              onEndReached={() => {
                isCloseToBottomOrderHistory();
                // alert('hello');
              }}
              ListFooterComponent={() => {
                return <View style={{ height: 100 }}></View>;
              }}
              // contentContainerStyle={{flexGrow: 1}}
              scrollEnabled={true}
              renderItem={({ item, index }) => {
                return (
                  <>
                    {item.state === "cancel" && hideAll ? null : (
                      <TouchableOpacity
                        onPress={() => {
                          Actions.currentScene != "OrderDetails" &&
                            Actions.push("OrderDetails", { detail: item });
                        }}
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
                          <View style={styles.flexEnd}>
                            <Text style={styles.dateText}>{item.dateTime}</Text>
                            <Image
                              source={{
                                uri: ThemeManager.ImageIcons.icon_forward,
                              }}
                              style={styles.forwardIcon}
                            />
                          </View>
                        </View>
                        <View style={styles.orderView}>
                          <Text
                            style={[
                              styles.limitText,
                              {
                                color:
                                  item.side == "sell"
                                    ? colors.appRed
                                    : colors.appGreen,
                                textTransform: "capitalize",
                              },
                            ]}
                          >
                            {item.ord_type}/{item.side}
                          </Text>
                          <View style={styles.statusView}>
                            <Text style={[styles.limitText, { fontSize: 13 }]}>
                              {item.state === "done"
                                ? strings.spot.filled
                                : item.state === "cancel"
                                  ? strings.spot.cancelled
                                  : item.state}
                            </Text>
                          </View>
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
                            {strings.orderDetails.amount}
                          </Text>
                          <Text
                            style={[
                              styles.dateText,
                              { color: ThemeManager.colors.textColor1 },
                            ]}
                          >
                            {item.executed_volume}
                            {"/"}
                            {item.origin_volume}
                            <Text style={styles.dateText}></Text>
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
                            {/* <Text style={styles.dateText}>
                          {'/'}
                          {item.price}
                        </Text> */}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                );
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
            >
              <TouchableOpacity
                onPress={() => {
                  ActionSheetOrders.current.show();
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text>{selectedOrders}</Text>
                <Image
                  source={Images.icon_dropDown}
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowCancelVisible(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.textColor1,
                  }}
                >
                  {strings.spot.cancel_all}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // flex: 1,
                }}
              >
                {/* <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_no_open_order }}
                  style={{
                    height: 80,
                    width: 80,
                    resizeMode: "contain",
                    marginTop: 100,
                  }}
                /> */}
                <CustomEmptyView style={{ marginTop: 70 }} />
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.spot.no_open_orders}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const timeStamp = (value) => {
    var myDate = value;
    myDate = myDate.split("-");
    var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2]);
    return newDate.getTime() / 1000;
  };

  const renderDatePicker = () => {
    var date1 = new Date();
    return (
      <>
        {fromDateSelected ? (
          <DatePicker
            modal
            fadeToColor="white"
            open={showDatePicker}
            mode="date"
            date={date1}
            maximumDate={date1}
            // theme={ThemeManager.colors.themeColor === "dark" ? "dark" : "light"}
            // textColor={ThemeManager.colors.textColor1}
            textColor={"black"}
            onConfirm={(date) => {
              let value = Moment(date).format("YYYY-MM-DD");
              setfromDate(value);
              setMinimumToDate(date);
              setShowDatePicker(false);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
          />
        ) : (
          <DatePicker
            modal
            fadeToColor="white"
            open={showDatePicker}
            mode="date"
            date={date1}
            maximumDate={date1}
            minimumDate={minimumToDate}
            // theme={ThemeManager.colors.themeColor === "dark" ? "dark" : "light"}
            // textColor={ThemeManager.colors.textColor1}
            textColor={"black"}
            onConfirm={(date) => {
              let value = Moment(date).format("YYYY-MM-DD");
              setToDate(value);

              setShowDatePicker(false);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
          />
        )}
      </>
    );
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
          {strings.trade_tab.spot}
        </Text>

        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
          onPress={() => {
            if (tabIndex != 0) {
              if (tabIndex == 1) {
                setOrderHistoryShowFilter(true);
              } else {
                setshowTradeHistoryFilter(true);
              }
            }
          }}
        >
          {tabIndex != 0 && (
            <Image
              source={{ uri: Images.icon_filter_trade }}
              style={[
                {
                  height: 22,
                  width: 22,
                  resizeMode: "contain",
                  tintColor: ThemeManager.colors.textColor1,
                },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            flex: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {tabData.map((tab, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (index === 0) {
                        setTabIndex(index);
                        tabRef.current.setPage(0);
                      } else if (index === 1) {
                        setTabIndex(index);
                        tabRef.current.setPage(1);
                      } else {
                        setTabIndex(index);
                        tabRef.current.setPage(2);
                      }
                    }}
                    style={{ marginRight: 10 }}
                  >
                    <TradeHeader
                      title={tab.tabName}
                      underLine={tabIndex == index ? true : false}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            <BorderLine />
            <PagerView
              ref={tabRef}
              style={{ flex: 1 }}
              scrollEnabled={false}
              initialPage={0}
              onPageScroll={(event) => { }}
              onPageSelected={(event) => {
                if (event.nativeEvent.position === 0) {
                  setTabIndex(0);
                } else if (event.nativeEvent.position === 1) {
                  setTabIndex(1);
                } else {
                  setTabIndex(2);
                }
              }}
            >
              <View
                key="1"
                style={{
                  backgroundColor: ThemeManager.colors.modalBox,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      ActionSheetOrders.current.show();
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {selectedOrders}
                    </Text>
                    <Image
                      source={{ uri: Images.icon_dropDown }}
                      style={{
                        height: 12,
                        width: 10,
                        resizeMode: "contain",
                        marginLeft: 5,
                      }}
                    />
                  </TouchableOpacity>
                  {orderHistoryReducer?.openOrderHistoryLoading?.length > 0 && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: ThemeManager.colors.selectedTextColor,

                        borderRadius: 2,
                      }}
                      onPress={() => {
                        setShowCancelVisible(true);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.textColor,

                          paddingVertical: 2,
                          paddingHorizontal: 10,
                        }}
                      >
                        {strings.spot.cancel_all}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {renderOpenOrders()}
              </View>
              <View
                key="2"
                style={
                  {
                    // backgroundColor: ThemeManager.colors.tabBackground,
                  }
                }
              >
                {renderOrderHistory()}
              </View>
              <View
                key="3"
                style={
                  {
                    // backgroundColor: ThemeManager.colors.tabBackground,
                  }
                }
              >
                {renderTradeHistory()}
              </View>
            </PagerView>
          </View>
        </View>
      </View>
      {/* {renderDatePicker()} */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCancelVisible}
        onRequestClose={() => setShowCancelVisible(false)}
      >
        <Wrap
          // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setShowCancelVisible(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.whiteScreen,
                marginHorizontal: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
            >
              <Image
                source={{ uri: Images.icon_caution }}
                style={{
                  height: 50,
                  width: 50,
                  resizeMode: "contain",
                  alignSelf: "center",
                  marginVertical: 15,
                  tintColor: "red",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 16,
                  fontFamily: Fonts.light,
                  color: ThemeManager.colors.textColor1,
                }}
              >
                {strings.spot.are_you_sure}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  //   alignItems: 'center',
                  justifyContent: "space-between",
                  marginVertical: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowCancelVisible(false);
                  }}
                  style={{
                    backgroundColor: ThemeManager.colors.tabBackground,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    flex: 1,
                    marginRight: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {strings.spot.cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowCancelVisible(false);
                    dispatch(cancelAllOrderWithoutParams())
                      .then((res) => {
                        // updateOrderList();
                        setPageNumber(1);
                        dispatch(resetOpenOrderHistory());
                        // dispatch(resetOpenOrderSingleHistory());
                        // param = {
                        //   page: 1,
                        //   limit: pageLimit,
                        // };
                        // dispatch(getOpenOrders(param, '&state=wait', true));
                      })
                      .catch((err) => alert(constants.APP_NAME, err));
                  }}
                  style={{
                    backgroundColor: ThemeManager.colors.selectedTextColor,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    marginLeft: 5,
                    borderRadius: 5,

                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {strings.spot.confirm}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setShowCancelVisible(false);
              }}
            ></TouchableOpacity>
          </View>
        </Wrap>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSingleCancelVisible}
        onRequestClose={() => setShowSingleCancelVisible(false)}
      >
        <Wrap
          // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setShowSingleCancelVisible(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.whiteScreen,
                marginHorizontal: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
            >
              <Image
                source={{ uri: Images.icon_caution }}
                style={{
                  height: 50,
                  width: 50,
                  resizeMode: "contain",
                  alignSelf: "center",
                  marginVertical: 15,
                  tintColor: "red",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 16,
                  fontFamily: Fonts.light,
                  color: ThemeManager.colors.textColor1,
                }}
              >
                {strings.spot.are_you_sure_cancel}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  //   alignItems: 'center',
                  justifyContent: "space-between",
                  marginVertical: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowSingleCancelVisible(false);
                  }}
                  style={{
                    backgroundColor: ThemeManager.colors.tabBackground,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    flex: 1,
                    marginRight: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {strings.spot.cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(resetOpenOrderHistory());

                    // dispatch(resetOpenOrderSingleHistory());
                    setShowSingleCancelVisible(false);
                    dispatch(cancelOrder(cancelOrderItem))
                      .then((res) => {
                        setPageNumber(1);
                        paramOpenOrder = {
                          page: `${pageNumber}`,
                          limit: pageLimit,
                        };
                        dispatch(
                          getOpenOrders(paramOpenOrder, "&state=wait", true)
                        );
                      })
                      .catch((err) => Alert.alert(constants.APP_NAME, err));
                  }}
                  style={{
                    backgroundColor: ThemeManager.colors.selectedTextColor,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    marginLeft: 5,
                    borderRadius: 5,

                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {strings.spot.confirm}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setShowSingleCancelVisible(false);
              }}
            ></TouchableOpacity>
          </View>
        </Wrap>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOrderHistoryFilter}
        onRequestClose={() => setOrderHistoryShowFilter(false)}
      >
        <Wrap
          // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setOrderHistoryShowFilter(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.DashboardBG,
                // marginHorizontal: 15,
                borderRadius: 8,
                marginTop: 80,
                // paddingHorizontal: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: 40,
                  marginHorizontal: 20,
                  marginTop: 15,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      alignSelf: "flex-end",
                      fontFamily: Fonts.bold,
                      fontSize: 18,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {strings.trade_tab.filter}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setOrderHistoryShowFilter(false)}
                  >
                    <View>
                      <Image
                        source={{ uri: ThemeManager.ImageIcons.icon_close_main }
                        }
                        style={{
                          alignSelf: "flex-end",
                          width: 20,
                          height: 20,
                          // tintColor: ThemeManager.colors.textColor1,
                          resizeMode: "contain",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                style={{
                  marginTop: 15,
                  width: "100%",
                }}
              >
                <View>
                  <ToggleSwitch
                    labelName={strings.trade_tab.pair}
                    toggle={pairToggle}
                    onPress={() => {
                      if (!pairToggle) {
                        setPairToggle(true);
                        setStateToggle(false);
                        setTypeToggle(false);
                        setOrderToggle(false);
                      } else {
                        setPairToggle(false);
                        setStateToggle(false);
                        setTypeToggle(false);
                        setOrderToggle(false);
                      }
                    }}
                    onPressItem={(val, index) => {
                      console.log("=-=pair-=-=->>>>>-", val, index);
                      // let replaceVal = val.replace("/", "");
                      setPairToggleIndex(index);
                      if (index == 0) {
                        setPairId("");
                        // selectedIndex(index)
                      } else {
                        setPairId(val.id);
                        // selectedIndex(index)
                      }
                      setpairFilter(val.id);
                      // setPairToggle(false);
                    }}
                    list={arrPair}
                    selectedIndex={pairToggleIndex}
                  />
                  <ToggleSwitch
                    labelName={strings.trade_tab.state}
                    toggle={stateToggle}
                    onPress={() => {
                      // setArrStateFilter(!arr);
                      if (!stateToggle) {
                        setStateToggle(true);
                        setPairToggle(false);
                        setTypeToggle(false);
                        setOrderToggle(false);
                      } else {
                        setStateToggle(false);
                        setPairToggle(false);
                        setTypeToggle(false);
                        setOrderToggle(false);
                      }
                    }}
                    notPair={true}
                    list={arrStateFilter}
                    onPressItem={(val, index) => {
                      console.log("=-=state-=-=->>>>>-", val, index);
                      setStateFilter(val);
                      setStateToggleIndex(index);
                      // setStateToggle(false);
                    }}
                    selectedIndex={stateToggleIndex}
                  />
                  <ToggleSwitch
                    labelName={strings.trade_tab.type}
                    toggle={typeToggle}
                    onPress={() => {
                      // setArrStateFilter(!arr);
                      if (!typeToggle) {
                        setStateToggle(false);
                        setPairToggle(false);
                        setTypeToggle(true);
                        setOrderToggle(false);
                      } else {
                        setStateToggle(false);
                        setPairToggle(false);
                        setTypeToggle(false);
                        setOrderToggle(false);
                      }
                    }}
                    notPair={true}
                    list={Type}
                    onPressItem={(val, index) => {
                      console.log("=-=Type-=-=->>>>>-", val, index);
                      settTypeFilter(val);
                      setTypeToggleIndex(index);
                      // setTypeToggle(false);
                    }}
                    smallHeight={true}
                    selectedIndex={typeToggleIndex}
                  />
                  <ToggleSwitch
                    labelName={strings.trade_tab.order_type}
                    toggle={orderToggle}
                    onPress={() => {
                      // setArrStateFilter(!arr);
                      if (!orderToggle) {
                        setStateToggle(false);
                        setPairToggle(false);
                        setTypeToggle(false);
                        setOrderToggle(true);
                      } else {
                        setStateToggle(false);
                        setPairToggle(false);
                        setTypeToggle(false);
                        setOrderToggle(false);
                      }
                    }}
                    notPair={true}
                    list={OrderType}
                    onPressItem={(val, index) => {
                      console.log("=-OrderType=-=-=->>>>>-", val, index);
                      setOrderTypeFilter(val);
                      setOrderToggleIndex(index);
                      // setOrderToggle(false);
                    }}
                    selectedIndex={orderToggleIndex}
                  />
                  <BorderLine />
                </View>

                <View>
                  {/* <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                  /> */}
                  {/* <DropDownPicker
                    items={items}
                    defaultNull={item === null}
                    placeholder="Select an item"
                    placeholderStyle={{ fontWeight: "bold" }}
                    onChangeItem={(item) => {
                      // this.setState({
                      //   item: item.value,
                      // });
                      setItem(item);
                    }}
                    dropDownMaxHeight={240}
                  /> */}
                  {/* <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                      marginBottom: 8,
                    }}
                  >
                    {strings.trade_tab.pair}
                  </Text> */}
                  {/* 
                  <SelectDropdown
                    ref={pairDD}
                    data={arrPair}
                    dropdownOverlayColor={"transparent"}
                    defaultValue={pairFilter}
                    defaultValueByIndex={selectedDepositPairIndex}
                    onSelect={(selectedItem, index) => {
                      setpairFilter(selectedItem.name);
                      setSelectedDepositPairIndex(index);
                    }}
                    defaultButtonText={pairFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      if (index == 0) {
                        setPairId("");
                      } else {
                        setPairId(selectedItem.id);
                      }
                      return selectedItem.name;
                      // }
                    }}
                    // rowTextForSelection={(item, index) => {
                    //   return item.name;
                    // }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      fontSize: 13,
                      // color: ThemeManager.colors.textColor1,
                      color: "red",
                      fontFamily: fonts.medium,
                      height: 40,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    dropdownStyle={{
                      height: 240,
                      // backgroundColor: "red",
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      console.log("selectedItem=-=www+++-=-", selectedItem);
                      console.log("selectedItem=-++www+-index", index);

                      return (
                        <View style={[styles.dropdown3BtnChildStyle]}>
                          <Text
                            style={[
                              styles.dropdown3BtnTxt,
                              {
                                color: ThemeManager.colors.textColor1,
                                textTransform: "capitalize",
                                fontFamily: Fonts.regular,
                                marginLeft: 5,
                              },
                            ]}
                          >
                            {selectedItem?.name}
                          </Text>

                          <Image
                            source={{ uri: Images.icon_dropDown }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              tintColor: ThemeManager.colors.textColor1,
                              marginRight: 8,
                            }}
                          />
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      console.log(
                        "print item -0-0-0>>",
                        item,
                        "=-=index=-=",
                        index
                      );
                      return (
                        <>
                          <View
                            style={{
                              flex: 1,

                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",

                              // paddingHorizontal: 15,
                              // paddingVertical: 8,
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdown3RowTxt,
                                {
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.regular,
                                  textTransform: "capitalize",
                                },
                              ]}
                            >
                              {item?.name}
                            </Text>
                          </View>
                        </>
                      );
                    }}
                  /> */}
                </View>
                <View>
                  {/* <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 8,
                    }}
                  >
                    {strings.trade_tab.state}
                  </Text> */}
                  {/* <SelectDropdown
                    dropdownOverlayColor={"transparent"}
                    ref={stateDD}
                    data={arrStateFilter}
                    defaultValue={stateFilter}
                    defaultValueByIndex={selectedDepositStateIndex}
                    onSelect={(selectedItem, index) => {
                      setStateFilter(selectedItem);
                      setSelectedDepositStateIndex(index);
                    }}
                    defaultButtonText={pairFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // if (index == 0) {
                      //   setPairId("");
                      // } else {
                      //   setPairId(selectedItem.id);
                      // }
                      return selectedItem;
                      // }
                    }}
                    // rowTextForSelection={(item, index) => {
                    //   return item.name;
                    // }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    dropdownStyle={{
                      height: 240,
                      // backgroundColor: "red",
                    }}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      fontSize: 13,
                      // color: ThemeManager.colors.textColor1,
                      color: "red",
                      fontFamily: fonts.medium,
                      height: 40,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      console.log("selectedItem=-=www+++-=-", selectedItem);
                      console.log("selectedItem=-++www+-index", index);

                      return (
                        <View style={[styles.dropdown3BtnChildStyle]}>
                          <Text
                            style={[
                              styles.dropdown3BtnTxt,
                              {
                                color: ThemeManager.colors.textColor1,
                                textTransform: "capitalize",
                                fontFamily: Fonts.regular,
                                marginLeft: 5,
                              },
                            ]}
                          >
                            {selectedItem}
                          </Text>

                          <Image
                            source={{ uri: Images.icon_dropDown }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              tintColor: ThemeManager.colors.textColor1,
                              marginRight: 8,
                            }}
                          />
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      console.log(
                        "print item -0-0-0>>",
                        item,
                        "=-=index=-=",
                        index
                      );
                      return (
                        <>
                          <View
                            style={{
                              flex: 1,

                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",

                              // paddingHorizontal: 15,
                              // paddingVertical: 8,
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdown3RowTxt,
                                {
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.regular,
                                  textTransform: "capitalize",
                                },
                              ]}
                            >
                              {item}
                            </Text>
                          </View>
                        </>
                      );
                    }}
                  /> */}
                  {/* <SelectDropdown
                    ref={stateDD}
                    data={arrStateFilter}
                    defaultValue={stateFilter}
                    dropdownOverlayColor={"transparent"}
                    onSelect={(selectedItem, index) => {
                      setStateFilter(selectedItem);
                    }}
                    defaultButtonText={stateFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      height: 50,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    buttonTextStyle={[
                      styles.dropdown1BtnTxtStyle,
                      {
                        color: ThemeManager.colors.textColor1,
                        fontFamily: fonts.medium,
                        fontSize: 14,
                      },
                    ]}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <Image
                          source={{
                            uri: ThemeManager.ImageIcons.icon_forward_arrow,
                          }}
                          style={{
                            width: 12,
                            height: 12,
                            resizeMode: "contain",
                          }}
                        />
                      );
                    }}
                  /> */}
                </View>
                <View>
                  {/* <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 8,
                    }}
                  >
                    {strings.trade_tab.type}
                  </Text> */}
                  {/* <SelectDropdown
                    dropdownOverlayColor={"transparent"}
                    ref={TypeDD}
                    data={Type}
                    defaultValue={typeFilter}
                    defaultValueByIndex={selectedDepositTypeIndex}
                    onSelect={(selectedItem, index) => {
                      // setStateFilter(selectedItem);
                      settTypeFilter(selectedItem);
                      setSelectedDepositTypeIndex(index);
                    }}
                    defaultButtonText={pairFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // if (index == 0) {
                      //   setPairId("");
                      // } else {
                      //   setPairId(selectedItem.id);
                      // }
                      return selectedItem;
                      // }
                    }}
                    // rowTextForSelection={(item, index) => {
                    //   return item.name;
                    // }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      fontSize: 13,
                      // color: ThemeManager.colors.textColor1,
                      color: "red",
                      fontFamily: fonts.medium,
                      height: 40,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      console.log("selectedItem=-=www+++-=-", selectedItem);
                      console.log("selectedItem=-++www+-index", index);

                      return (
                        <View style={[styles.dropdown3BtnChildStyle]}>
                          <Text
                            style={[
                              styles.dropdown3BtnTxt,
                              {
                                color: ThemeManager.colors.textColor1,
                                textTransform: "capitalize",
                                fontFamily: Fonts.regular,
                                marginLeft: 5,
                              },
                            ]}
                          >
                            {selectedItem}
                          </Text>

                          <Image
                            source={{ uri: Images.icon_dropDown }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              tintColor: ThemeManager.colors.textColor1,
                              marginRight: 8,
                            }}
                          />
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      console.log(
                        "print item -0-0-0>>",
                        item,
                        "=-=index=-=",
                        index
                      );
                      return (
                        <>
                          <View
                            style={{
                              flex: 1,

                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",

                              // paddingHorizontal: 15,
                              // paddingVertical: 8,
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdown3RowTxt,
                                {
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.regular,
                                  textTransform: "capitalize",
                                },
                              ]}
                            >
                              {item}
                            </Text>
                          </View>
                        </>
                      );
                    }}
                  /> */}
                  {/* <SelectDropdown
                    ref={TypeDD}
                    data={Type}
                    defaultValue={typeFilter}
                    dropdownOverlayColor={"transparent"}
                    onSelect={(selectedItem, index) => {
                      settTypeFilter(selectedItem);
                    }}
                    defaultButtonText={typeFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      height: 50,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    buttonTextStyle={[
                      styles.dropdown1BtnTxtStyle,
                      {
                        color: ThemeManager.colors.textColor1,
                        fontFamily: fonts.medium,
                        fontSize: 14,
                      },
                    ]}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <Image
                          source={{
                            uri: ThemeManager.ImageIcons.icon_forward_arrow,
                          }}
                          style={{
                            width: 12,
                            height: 12,
                            resizeMode: "contain",
                          }}
                        />
                      );
                    }}
                  /> */}
                </View>
                <View>
                  {/* <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 8,
                    }}
                  >
                    {strings.trade_tab.order_type}
                  </Text> */}
                  {/* <SelectDropdown
                    // dropdownOverlayColor={"transparent"}
                    // ref={TypeDD}
                    // data={Type}
                    // defaultValue={typeFilter}
                    ref={OrderTypeDD}
                    data={OrderType}
                    // defaultValueByIndex={0}
                    dropdownOverlayColor={"transparent"}
                    defaultValue={orderTypeFilter}
                    defaultValueByIndex={selectedDepositOrderTypeIndex}
                    onSelect={(selectedItem, index) => {
                      // setStateFilter(selectedItem);
                      setOrderTypeFilter(selectedItem);
                      setSelectedDepositOrderTypeIndex(index);
                    }}
                    defaultButtonText={pairFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // if (index == 0) {
                      //   setPairId("");
                      // } else {
                      //   setPairId(selectedItem.id);
                      // }
                      return selectedItem;
                      // }
                    }}
                    // rowTextForSelection={(item, index) => {
                    //   return item.name;
                    // }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    dropdownStyle={{
                      height: 240,
                      // backgroundColor: "red",
                    }}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      fontSize: 13,
                      // color: ThemeManager.colors.textColor1,
                      color: "red",
                      fontFamily: fonts.medium,
                      height: 40,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      console.log("selectedItem=-=www+++-=-", selectedItem);
                      console.log("selectedItem=-++www+-index", index);

                      return (
                        <View style={[styles.dropdown3BtnChildStyle]}>
                          <Text
                            style={[
                              styles.dropdown3BtnTxt,
                              {
                                color: ThemeManager.colors.textColor1,
                                textTransform: "capitalize",
                                fontFamily: Fonts.regular,
                                marginLeft: 5,
                              },
                            ]}
                          >
                            {selectedItem}
                          </Text>

                          <Image
                            source={{ uri: Images.icon_dropDown }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              tintColor: ThemeManager.colors.textColor1,
                              marginRight: 8,
                            }}
                          />
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      console.log(
                        "print item -0-0-0>>",
                        item,
                        "=-=index=-=",
                        index
                      );
                      return (
                        <>
                          <View
                            style={{
                              flex: 1,

                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",

                              // paddingHorizontal: 15,
                              // paddingVertical: 8,
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdown3RowTxt,
                                {
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.regular,
                                  textTransform: "capitalize",
                                },
                              ]}
                            >
                              {item}
                            </Text>
                          </View>
                        </>
                      );
                    }}
                  /> */}
                  {/* <SelectDropdown
                    ref={OrderTypeDD}
                    data={OrderType}
                    // defaultValueByIndex={0}
                    dropdownOverlayColor={"transparent"}
                    defaultValue={orderTypeFilter}
                    onSelect={(selectedItem, index) => {
                      setOrderTypeFilter(selectedItem);
                    }}
                    defaultButtonText={orderTypeFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      height: 50,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    buttonTextStyle={[
                      styles.dropdown1BtnTxtStyle,
                      {
                        color: ThemeManager.colors.textColor1,
                        fontFamily: fonts.medium,
                        fontSize: 14,
                      },
                    ]}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <Image
                          source={{
                            uri: ThemeManager.ImageIcons.icon_forward_arrow,
                          }}
                          style={{
                            width: 12,
                            height: 12,
                            resizeMode: "contain",
                          }}
                        />
                      );
                    }}
                  /> */}
                </View>
              </ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: 20,
                  paddingBottom: 40,
                  // marginBottom: 20,
                  // flex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOrderHistoryFilter(false);

                    dispatch(resetOrderHistory());
                    setpairFilter("All");
                    setStateFilter("All");
                    settTypeFilter("All");
                    setOrderTypeFilter("All");
                    setPairToggleIndex(0);
                    setStateToggleIndex(0);
                    setTypeToggleIndex(0);
                    setOrderToggleIndex(0);
                    // pairDD.current.reset();
                    // stateDD.current.reset();
                    // TypeDD.current.reset();
                    // OrderTypeDD.current.reset();
                    let param = {
                      page: "1",
                      limit: "10",
                    };

                    setPageNumberOrder(1);
                    paramOrder = {
                      page: `${1}`,
                      limit: pageLimit,
                    };

                    dispatch(getOrderHistory(paramOrder, "", true));
                    setOrderHistoryShowFilter(false);
                  }}
                  style={{
                    height: 50,
                    marginTop: 20,
                    width: "43%",
                    // width: 140,
                    // backgroundColor: ThemeManager.colors.Purewhite,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    marginLeft: 15,
                    borderWidth: 1.2,
                    borderColor: ThemeManager.colors.withdrawText,
                  }}
                >
                  <Text
                    style={{
                      color: ThemeManager.colors.withdrawText,
                      fontSize: 16,
                      fontFamily: Fonts.medium,
                    }}
                  >
                    {"Reset"}
                  </Text>
                </TouchableOpacity>
                {/* <ButtonPrimary
                    title={"Reset"}
                    touchableStyle={{ width: "42%" }}
                    style={{
                      height: 50,
                      marginTop: 20,
                      width: "80%",
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      setOrderHistoryFilter(false);

                      dispatch(resetOrderHistory());
                      setpairFilter("All");
                      setStateFilter("All");
                      settTypeFilter("All");
                      setOrderTypeFilter("All");
                      setPairToggleIndex(0);
                      setStateToggleIndex(0);
                      setTypeToggleIndex(0);
                      setOrderToggleIndex(0);
                      // pairDD.current.reset();
                      // stateDD.current.reset();
                      // TypeDD.current.reset();
                      // OrderTypeDD.current.reset();
                      let param = {
                        page: "1",
                        limit: "10",
                      };

                      setPageNumberOrder(1);
                      paramOrder = {
                        page: `${1}`,
                        limit: pageLimit,
                      };

                      dispatch(getOrderHistory(paramOrder, "", true));
                      setOrderHistoryShowFilter(false);
                    }}
                  /> */}
                <ButtonPrimary
                  title={strings.spot.confirm}
                  onPress={() => {
                    setOrderHistoryFilter(true);
                    setPageNumberOrder(1);

                    paramOrder = {
                      page: `${1}`,
                      limit: pageLimit,
                    };
                    dispatch(resetOrderHistory());
                    let linkConcat = "";
                    if (pairFilter != "All") {
                      linkConcat = linkConcat + "&market=" + pairId;
                    }
                    if (stateFilter != "All") {
                      linkConcat =
                        linkConcat +
                        "&state=" +
                        getFilterString(stateFilter).toLowerCase();
                    }
                    if (typeFilter != "All") {
                      linkConcat =
                        linkConcat +
                        "&type=" +
                        getFilterString(typeFilter).toLowerCase();
                    }
                    if (orderTypeFilter != "All") {
                      linkConcat =
                        linkConcat +
                        "&ord_type=" +
                        getFilterString(orderTypeFilter).toLowerCase();
                    }

                    dispatch(getOrderHistory(paramOrder, linkConcat, true));
                    setOrderHistoryShowFilter(false);
                  }}
                  touchableStyle={{ width: "50%" }}
                  style={{
                    height: 50,
                    marginTop: 20,

                    // width: "100%",
                    backgroundColor: ThemeManager.colors.selectedTextColor,
                    borderRadius: 6,
                  }}
                />
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTradeHistoryFilter}
        onRequestClose={() => setshowTradeHistoryFilter(false)}
      >
        <Wrap
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {renderDatePicker()}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setshowTradeHistoryFilter(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.DashboardBG,
                // marginHorizontal: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
            >
              <View
                style={{
                  marginTop: 15,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    height: 40,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontFamily: Fonts.bold,
                        fontSize: 18,
                        color: ThemeManager.colors.textColor1,
                      }}
                    >
                      Filter
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setshowTradeHistoryFilter(false)}
                    >
                      <View>
                        <Image
                          source={{ uri: ThemeManager.ImageIcons.icon_close_main }
                          }
                          style={{
                            alignSelf: "flex-end",
                            width: 20,
                            height: 20,
                            // tintColor: ThemeManager.colors.textColor1,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 8,
                      marginTop: 15,
                    }}
                  >
                    From Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setfromDateSelected(true);
                      setShowDatePicker(true);
                    }}
                    style={{
                      height: 40,
                      backgroundColor: ThemeManager.colors.SwapInput,
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          color: ThemeManager.colors.textColor,
                          marginLeft: 15,
                        }}
                      >
                        {fromDate}
                      </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        source={{
                          // uri: ThemeManager.ImageIcons.icon_forward_arrow,
                          uri: Images.listArrow,
                        }}
                        style={{
                          width: 15,
                          height: 15,
                          resizeMode: "contain",
                          marginRight: 8,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 8,
                      marginTop: 20,
                    }}
                  >
                    To Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setfromDateSelected(false);
                      setShowDatePicker(true);
                    }}
                    style={{
                      height: 40,
                      backgroundColor: ThemeManager.colors.SwapInput,
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          color: ThemeManager.colors.textColor,
                          marginLeft: 15,
                        }}
                      >
                        {toDate}
                      </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        source={{
                          // uri: ThemeManager.ImageIcons.icon_forward_arrow,
                          uri: Images.listArrow,
                        }}
                        style={{
                          width: 15,
                          height: 15,
                          resizeMode: "contain",
                          marginRight: 8,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                {/* <ToggleSwitch
                  labelName={strings.trade_tab.pair}
                  toggle={pairToggle}
                  onPress={() => {
                    if (!pairToggle) {
                      setPairToggle(true);
                      setStateToggle(false);
                      setTypeToggle(false);
                      setOrderToggle(false);
                    } else {
                      setPairToggle(false);
                      setStateToggle(false);
                      setTypeToggle(false);
                      setOrderToggle(false);
                    }
                  }}
                  onPressItem={(val, index) => {
                    console.log("=-=pair-=-=->>>>>-", val, index);
                    // let replaceVal = val.replace("/", "");
                    setPairToggleIndex(index);
                    if (index == 0) {
                      setPairId("");
                      // selectedIndex(index)
                    } else {
                      setPairId(val.id);
                      // selectedIndex(index)
                    }
                    setpairFilter(val.id);
                    // setPairToggle(false);
                  }}
                  list={arrPair}
                  selectedIndex={pairToggleIndex}
                  tradePair={true}
                /> */}
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 8,
                      marginTop: 20,
                    }}
                  >
                    Pair
                  </Text>
                  <SelectDropdown
                    ref={pairDD}
                    data={arrPair}
                    dropdownOverlayColor={"transparent"}
                    defaultValue={pairFilter}
                    defaultValueByIndex={selectedDepositPairIndex}
                    onSelect={(selectedItem, index) => {
                      setpairFilter(selectedItem.name);
                      setSelectedDepositPairIndex(index);
                    }}
                    defaultButtonText={pairFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      if (index == 0) {
                        setPairId("");
                      } else {
                        setPairId(selectedItem.id);
                      }
                      return selectedItem.name;
                      // }
                    }}
                    // rowTextForSelection={(item, index) => {
                    //   return item.name;
                    // }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.borderColor },
                    // ]}
                    dropdownStyle={{
                      height: 240,
                      // backgroundColor: "red",
                    }}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      fontSize: 13,
                      // color: ThemeManager.colors.textColor1,
                      color: "red",
                      fontFamily: fonts.medium,
                      height: 40,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      console.log("selectedItem=-=www+++-=-", selectedItem);
                      console.log("selectedItem=-++www+-index", index);

                      return (
                        <View style={[styles.dropdown3BtnChildStyle]}>
                          <Text
                            style={[
                              styles.dropdown3BtnTxt,
                              {
                                color: ThemeManager.colors.textColor1,
                                textTransform: "capitalize",
                                fontFamily: Fonts.regular,
                                marginLeft: 5,
                              },
                            ]}
                          >
                            {selectedItem?.name}
                          </Text>

                          <Image
                            source={{ uri: Images.icon_dropDown }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              tintColor: ThemeManager.colors.textColor1,
                              marginRight: 8,
                            }}
                          />
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      console.log(
                        "print item -0-0-0>>",
                        item,
                        "=-=index=-=",
                        index
                      );
                      return (
                        <>
                          <View
                            style={{
                              // flex: 1,

                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",

                              // paddingHorizontal: 15,
                              // paddingVertical: 8,
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdown3RowTxt,
                                {
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.regular,
                                  textTransform: "capitalize",
                                },
                              ]}
                            >
                              {item?.name}
                            </Text>
                          </View>
                        </>
                      );
                    }}
                  />
                  {/* <SelectDropdown
                    ref={pairDD}
                    data={arrPair}
                    // defaultValueByIndex={0}
                    defaultValue={pairFilter}
                    dropdownOverlayColor={"transparent"}
                    onSelect={(selectedItem, index) => {
                      setpairFilter(selectedItem.name);
                    }}
                    defaultButtonText={pairFilter}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      if (index == 0) {
                        setPairId("");
                      } else {
                        setPairId(selectedItem.id);
                      }
                      return selectedItem.name;
                      // }
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.name;
                    }}
                    // buttonStyle={[
                    //   styles.dropdown1BtnStyle,
                    //   { backgroundColor: ThemeManager.colors.SwapInput },
                    // ]}
                    buttonStyle={{
                      // width: "100%",
                      width: "100%",
                      borderRadius: 6,
                      height: 50,
                      marginBottom: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      // backgroundColor: "red",
                    }}
                    buttonTextStyle={[
                      styles.dropdown1BtnTxtStyle,
                      {
                        color: ThemeManager.colors.textColor,
                        fontFamily: fonts.medium,
                        fontSize: 14,
                      },
                    ]}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <Image
                          source={{
                            uri: ThemeManager.ImageIcons.icon_forward_arrow,
                          }}
                          style={{
                            width: 12,
                            height: 12,
                            resizeMode: "contain",
                          }}
                        />
                      );
                    }}
                  /> */}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingBottom: 30,
                    marginTop: 20,
                    // width: "100%",
                    // backgroundColor: "red",
                  }}
                >
                  {/* <ButtonPrimary
                    showGradient={true}
                    title={"Reset"}
                    touchableStyle={{ width: "42%" }}
                    style={{
                      height: 50,
                      marginTop: 20,
                      width: "80%",
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      setpairFilter("All");
                      setStateFilter("All");
                      settTypeFilter("All");
                      setOrderTypeFilter("All");
                      setfromDate("YYYY-MM-DD");
                      setToDate("YYYY-MM-DD");

                      dispatch(resetTradeHistory());
                      paramTrade = {
                        page: `${1}`,
                        limit: pageLimit,
                      };
                      setPageNumberTrade(1);
                      setTradeHistoryFilter(false);
                      dispatch(getTreadHistory(paramTrade, ""));
                      setshowTradeHistoryFilter(false);
                    }}
                  /> */}
                  <TouchableOpacity
                    onPress={() => {
                      setpairFilter("All");
                      setStateFilter("All");
                      settTypeFilter("All");
                      setOrderTypeFilter("All");
                      setfromDate("YYYY-MM-DD");
                      setToDate("YYYY-MM-DD");

                      dispatch(resetTradeHistory());
                      paramTrade = {
                        page: `${1}`,
                        limit: pageLimit,
                      };
                      setPageNumberTrade(1);
                      setTradeHistoryFilter(false);
                      dispatch(getTreadHistory(paramTrade, ""));
                      setshowTradeHistoryFilter(false);
                    }}
                    style={{
                      height: 50,
                      marginTop: 20,
                      width: "43%",
                      // width: 140,
                      // backgroundColor: ThemeManager.colors.Purewhite,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      marginLeft: 15,
                      borderWidth: 1.2,
                      borderColor: ThemeManager.colors.withdrawText,
                    }}
                  >
                    <Text
                      style={{
                        color: ThemeManager.colors.withdrawText,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                      }}
                    >
                      {"Reset"}
                    </Text>
                  </TouchableOpacity>
                  <ButtonPrimary
                    title={strings.spot.confirm}
                    onPress={() => {
                      let linkConcat = "";
                      dispatch(resetTradeHistory());
                      if (pairFilter != "All") {
                        linkConcat = linkConcat + "&market=" + pairId;
                      }
                      if (fromDate != "" && fromDate != "YYYY-MM-DD") {
                        linkConcat =
                          linkConcat + "&time_from=" + timeStamp(fromDate);
                      }
                      if (toDate != "" && toDate != "YYYY-MM-DD") {
                        linkConcat =
                          linkConcat + "&time_to=" + timeStamp(toDate);
                      }
                      if (fromDate == "YYYY-MM-DD") {
                        linkConcat = linkConcat;
                      }
                      if (toDate == "YYYY-MM-DD") {
                        linkConcat = linkConcat;
                      }

                      paramTrade = {
                        page: `${1}`,
                        limit: pageLimit,
                      };

                      setPageNumberTrade(1);
                      setTradeHistoryFilter(true);
                      dispatch(getTreadHistory(paramTrade, linkConcat));
                      setshowTradeHistoryFilter(false);
                    }}
                    // touchableStyle={{ width: "42%" }}
                    // style={{
                    //   height: 50,
                    //   marginTop: 20,
                    //   width: "80%",
                    //   backgroundColor: ThemeManager.colors.selectedTextColor,
                    //   borderRadius: 4,
                    // }}
                    touchableStyle={{ width: "50%" }}
                    style={{
                      height: 50,
                      marginTop: 20,

                      // width: "100%",
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      borderRadius: 6,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showFilter}
        onRequestClose={() => setShowFilter(false)}
      >
        <Wrap
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setShowFilter(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.whiteScreen,
                marginHorizontal: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
            >
              <View
                style={{
                  marginTop: 15,
                  width: "100%",
                  alignItems: "center",
                }}
              ></View>
              <View
                style={{
                  marginTop: 15,
                  width: "100%",
                  alignItems: "center",
                }}
              ></View>
            </View>
          </View>
        </Wrap>
      </Modal>

      <ActionSheet
        ref={ActionSheetOrders}
        options={[
          <TouchableOpacity
            onPress={() => {
              setSelectedOrders(strings.spot.all_open_orders);
              ActionSheetOrders.current.hide();
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
              width: "100%",
              flex: 1,
              borderBottomWidth: 0.5,
              borderBottomColor: "#707988",
            }}
          >
            <Text
              style={{
                color:
                  selectedOrders === strings.spot.all_open_orders
                    ? ThemeManager.colors.selectedTextColor
                    : ThemeManager.colors.textColor1,
              }}
            >
              {strings.spot.all_open_orders}
            </Text>
          </TouchableOpacity>,
          <TouchableOpacity
            onPress={() => {
              setSelectedOrders(strings.spot.sell_orders);
              ActionSheetOrders.current.hide();
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
              width: "100%",
              flex: 1,

              borderBottomWidth: 0.5,
              borderBottomColor: "#707988",
            }}
          >
            <Text
              style={{
                color:
                  selectedOrders === strings.spot.sell_orders
                    ? ThemeManager.colors.selectedTextColor
                    : ThemeManager.colors.textColor1,
              }}
            >
              {strings.spot.sell_orders}
            </Text>
          </TouchableOpacity>,

          <TouchableOpacity
            onPress={() => {
              setSelectedOrders(strings.spot.buy_orders);
              ActionSheetOrders.current.hide();
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
              width: "100%",
              flex: 1,
              borderBottomWidth: 0.5,
              borderBottomColor: "#707988",
            }}
          >
            <Text
              style={{
                color:
                  selectedOrders === strings.spot.buy_orders
                    ? ThemeManager.colors.selectedTextColor
                    : ThemeManager.colors.textColor1,
              }}
            >
              {strings.spot.buy_orders}
            </Text>
          </TouchableOpacity>,
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
              width: "100%",
              flex: 1,
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.textColor1,
              }}
            >
              {strings.buy_sell_market.cancel}
            </Text>
          </View>,
        ]}
        cancelButtonIndex={3}
        styles={{
          messageBox: { height: "100" },
          body: {
            backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
          },
          titleBox: {
            backgroundColor: "#2D2D2D",
          },
        }}
        tintColor={ThemeManager.colors.selectedTextColor}
        onPress={(index) => {
          if (index !== 4) {
            if (index === 0) {
              setSelectedOrders(strings.spot.all_open_orders);
            } else if (index === 1) {
              setSelectedOrders(strings.spot.sell_orders);
            } else if (index === 2) {
              setSelectedOrders(strings.spot.buy_orders);
            }
          }
        }}
      />
    </Wrap>
  );
};
export default SpotTrade;
