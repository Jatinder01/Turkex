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
  resetOpenOrderHistory,
} from "../../Redux/Actions";
import { Loader } from "./Loader";
import { Actions } from "react-native-router-flux";
import * as constants from "../../Constants";
import { CustomEmptyView } from "./CustomEmptyView";

const TradeOpenOrder = (props) => {
  const orderHistoryReducer = useSelector(
    (state) => state?.orderHistoryReducer
  );

  const tradeReducer = useSelector((state) => state?.tradeReducer);
  const dispatch = useDispatch();

  function updateOrderList() {
    dispatch(resetOpenOrderHistory());
    let params = {
      page: "1",
      limit: "5",
    };

    dispatch(
      getOpenOrders(
        params,
        `&market=${
          tradeReducer?.selectedCoinPair?.base_unit +
          tradeReducer?.selectedCoinPair?.quote_unit
        }&state=wait`,
        true
      )
    ).then((res) => {
      dispatch(getUserAllBalance());
    });
  }
  // const updateOrderList = () => {
  //   let params = {
  //     page: '1',
  //     limit: '10',
  //   };
  //   dispatch(getUserAllBalance()).then(res => {
  //     dispatch(resetOpenOrderHistory());

  //     dispatch(
  //       getOpenOrders(
  //         params,
  //         `&market=${
  //           tradeReducer?.selectedCoinPair?.base_unit +
  //           tradeReducer?.selectedCoinPair?.quote_unit
  //         }&state=wait`,
  //         true,
  //       ),
  //     );
  //   });
  // };
  function renderHistoryList() {
    if (orderHistoryReducer?.orderHistoryLoading) {
      return <Spinner />;
    }
    let listArray = orderHistoryReducer?.openOrders;

    // orderHistoryReducer?.marketCoinInfo == null ? (
    //   <View />
    // ) : (
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          style={{ width: "100%", flex: 1 }}
          data={listArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <OrderListItem
                pairName={
                  tradeReducer.selectedCoinPair.base_unit +
                  "/" +
                  tradeReducer.selectedCoinPair.quote_unit
                }
                side={item.side}
                state={item.state}
                pairNameStyle={{ color: ThemeManager.colors.textColor1 }}
                filledStyle={{ color: ThemeManager.colors.textColor1 }}
                priceTextStyle={{ color: ThemeManager.colors.textColor1 }}
                createdAt={Moment(item.created_at).format("DD-MM-YY hh:mm:ss")}
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
                  }
                }}
              />
            );
          }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 30 }}>
              <Image
                style={{ height: 80, width: 50 }}
                resizeMode="center"
                source={Images.noItemFound}
                tintColor={colors.lightTxtColor}
              />
              <Text
                style={{
                  color: colors.lightTxtColor,
                  fontFamily: Fonts.PoppinsRegular,
                }}
              >
                No open orders
              </Text>
            </View>
          }
        />
        {/* {listArray.length == 0 && (
          <View style={{alignItems: 'center', marginTop: 30}}>
            <Image
              style={{height: 80, width: 50}}
              resizeMode="center"
              source={Images.noItemFound}
              tintColor={colors.lightTxtColor}
            />
            <Text
              style={{
                color: colors.lightTxtColor,
                fontFamily: Fonts.PoppinsRegular,
              }}>
              No open orders
            </Text>
          </View>
        )} */}
        {listArray?.length > 5 && (
          <TouchableOpacity
            onPress={() =>
              Actions.currentScene != "SpotTrade" && Actions.SpotTrade()
            }
            style={{ justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                alignSelf: "flex-end",
                color: ThemeManager.colors.textColor,
              }}
            >
              More Orders
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
    // );
  }

  return (
    <View>
      {orderHistoryReducer?.openOrders?.length != 0 ? (
        <View>
          <View style={{ alignItems: "flex-end", marginTop: 8 }}>
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
                          tradeReducer.selectedCoinPair.base_unit +
                          tradeReducer.selectedCoinPair.quote_unit;
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
          </View>
          {renderHistoryList()}
        </View>
      ) : (
        <View>
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
                resizeMode: 'contain',
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
export { TradeOpenOrder };
const styles = StyleSheet.create({});
