/* eslint-disable react-native/no-inline-styles */
import { func } from "prop-types";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { strings } from "../../../Localization";
import { ThemeManager } from "../../../ThemeManager";
// import {APP_NAME} from '../../Constants';
import Singleton from "../../Singleton";
import { colors, Fonts, Images } from "../../theme";
import { OrderListItem } from "./OrderListItem";
import { Spinner } from "./Spinner";
import Moment from "moment";
import BorderLine from "./BorderLine";
import {
  cancelAllOrder,
  getUserAllBalance,
  cancelOrder,
  getOpenOrders,
  resetOpenOrderSingleHistory,
  getOpenOrdersSingle,
} from "../../Redux/Actions";
import { Loader } from "./Loader";
import { Actions } from "react-native-router-flux";
import * as constants from "../../Constants";
import { CustomEmptyView } from "./CustomEmptyView";

const TradeOpenOrderLimited = (props) => {
  const { openOrderHistoryLoading, openOrdersSingle } = useSelector(
    (state) => state?.orderHistoryReducer
  );

  const { selectedCoinPair } = useSelector((state) => state?.tradeReducer);
  // console.log("openOrdersSingle=-=-=-=->>>>>", openOrdersSingle);
  const dispatch = useDispatch();

  function updateOrderList() {
    dispatch(resetOpenOrderSingleHistory());
    let params = {
      page: "1",
      limit: "5",
    };
    if (props.kycStatus) {
      dispatch(
        getOpenOrdersSingle(
          params,
          `&market=${
            selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
          }&state=wait`,
          true
        )
      ).then((res) => {
        dispatch(getUserAllBalance());
      });
    } else {
      dispatch(resetOpenOrderSingleHistory());
    }
  }

  function renderHistoryList() {
    if (openOrderHistoryLoading) {
      return <Spinner />;
    }
    let listArray = openOrdersSingle;

    return (
      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          style={{ width: "100%", flex: 1, height: 260 }}
          data={listArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            if (item?.ord_type == "market") {
              if (item?.ord_type == "market" && listArray?.length == 1) {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 50,
                    }}
                  >
                    {/* <Image
                      source={{
                        uri: ThemeManager.ImageIcons.noOpenOrder,
                      }}
                      style={{
                        height: 100,
                        width: 100,
                        resizeMode: "contain",
                        // tintColor: ThemeManager.colors.inactiveTextColor,
                      }}
                    /> */}
                    <CustomEmptyView />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {strings.trade_tab.no_open_order}
                    </Text>
                  </View>
                );
              } else {
                return <View />;
              }
            } else {
              return (
                <>
                  {index > 4 ? null : (
                    <OrderListItem
                      pairName={
                        selectedCoinPair?.base_unit +
                        "/" +
                        selectedCoinPair?.quote_unit
                      }
                      side={item.side}
                      state={item.state}
                      pairNameStyle={{ color: ThemeManager.colors.textColor1 }}
                      filledStyle={{ color: ThemeManager.colors.textColor1 }}
                      priceTextStyle={{ color: ThemeManager.colors.textColor1 }}
                      createdAt={Moment(item.created_at).format(
                        "DD-MM-YY hh:mm:ss"
                      )}
                      avg={item.avg_price}
                      price={item.price}
                      filled={item.executed_volume}
                      amount={item.origin_volume}
                      ord_type={item.ord_type}
                      quote_unit="dd"
                      cancelOrderItem={() => {
                        Alert.alert(
                          constants.APP_NAME_CAPS,
                          strings.spot.are_you_sure_cancel,
                          [
                            {
                              text: "Cancel",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            },
                            {
                              text: "Confirm",
                              onPress: () => {
                                dispatch(cancelOrder(item.id))
                                  .then((res) => {
                                    updateOrderList();
                                  })
                                  .catch((err) =>
                                    Alert.alert(constants.APP_NAME_CAPS, err)
                                  );
                              },
                            },
                          ]
                        );
                      }}
                      didSelectItem={(sender) => {
                        if (item.state == "pending" || item.state == "wait") {
                          // this.props.navigation.navigate('OrderDetail', { TransactionId: item.id })
                        }
                      }}
                    />
                  )}
                </>
              );
            }
          }}
          ListFooterComponent={(item, index) => {
            return (
              <View>
                {listArray?.length > 4 && item?.ord_type === "market" && (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      height: 50,
                      //   backgroundColor: 'red',
                    }}
                    onPress={() =>
                      Actions.currentScene != "SpotTrade" && Actions.SpotTrade()
                    }
                  >
                    <Text
                      style={[
                        {
                          fontSize: 16,
                          alignSelf: "flex-end",
                          color: ThemeManager.colors.textColor,
                        },
                        props.moreTextColor,
                      ]}
                    >
                      More Orders
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 50,
              }}
            >
              {/* <Image
                source={{
                  uri: ThemeManager.ImageIcons.noOpenOrder,
                }}
                style={{
                  height: 100,
                  width: 100,
                  resizeMode: "contain",
                  // tintColor: ThemeManager.colors.inactiveTextColor,
                }}
              /> */}
              <CustomEmptyView />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                {strings.trade_tab.no_open_order}
              </Text>
            </View>
          }
        />
        {/* {listArray.length == 0 && (
          <View style={{alignItems: 'center', marginTop: 30}}>
            <Image
              style={[
                {height: 80, width: 50, tintColor: colors.lightTxtColor},
                props.imageStyle,
              ]}
              resizeMode="center"
              source={Images.noItemFound}
              // tintColor={colors.lightTxtColor}
            />
            <Text
              style={[
                {
                  color: colors.lightTxtColor,
                  fontFamily: Fonts.PoppinsRegular,
                  marginBottom: 130,
                },
                props.noOpenOrderTextStyle,
              ]}>
              No open orders
            </Text>
          </View>
        )} */}
      </View>
    );
    // );
  }

  return (
    <View View style={{ flex: 1 }}>
      {openOrdersSingle?.length != 0 ? (
        <View>
          <View style={{ alignItems: "flex-end", marginTop: 8 }}>
            {openOrdersSingle[0]?.ord_type == "market" &&
            openOrdersSingle?.length == 1 ? null : (
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 30,
                  justifyContent: "center",
                  backgroundColor: ThemeManager.colors.inputColor,
                  borderRadius: 5,
                }}
                onPress={() => {
                  Alert.alert(
                    constants.APP_NAME_CAPS,
                    strings.spot.are_you_sure,
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "Confirm",
                        onPress: () => {
                          let pairValue =
                            selectedCoinPair?.base_unit +
                            selectedCoinPair?.quote_unit;
                          dispatch(cancelAllOrder(pairValue))
                            .then((res) => {
                              updateOrderList();
                            })
                            .catch((err) =>
                              Alert.alert(constants.APP_NAME_CAPS, err)
                            );
                        },
                      },
                    ]
                  );
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: ThemeManager.colors.textColor1,
                    fontFamily: Fonts.medium,
                    textAlign: "center",
                  }}
                >
                  Cancel All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {renderHistoryList()}
        </View>
      ) : (
        <View style={{ flex: 1, minHeight: 300 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: -100,
            }}
          >
            {/* <Image
              source={{
                uri: ThemeManager.ImageIcons.noOpenOrder,
              }}
              style={{
                height: 100,
                width: 100,
                resizeMode: "contain",
                // tintColor: ThemeManager.colors.inactiveTextColor,
              }}
            /> */}
            <CustomEmptyView />
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.inactiveTextColor,
              }}
            >
              {strings.trade_tab.no_open_order}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
export { TradeOpenOrderLimited };
const styles = StyleSheet.create({});
