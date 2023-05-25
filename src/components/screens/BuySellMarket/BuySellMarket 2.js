/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component, useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  AsyncStorage,
  TouchableWithoutFeedback,
  Alert,
  Slider,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  useWindowDimensions,
  Animated,
  I18nManager,
  NativeModules,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { colors, Fonts, Images } from "../../../theme";
import {
  buySellSocket,
  tradeValuesUpdate,
  getBalanceDetails,
  callTradeSocket,
  getUserAllBalance,
  getPublicTrade,
  placeTradeOrder,
  stopPreviousConnection,
  getTreadingRules,
  getTreadingFeee,
  tradeSocketClose,
  updateMarketPair,
  resetTradeValuesUpdate,
  getMarketList,
  getFavMarketData,
  updateFavMarketData,
} from "../../../Redux/Actions";

import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../../ThemeManager";
import {
  BuySellMarketHeader,
  Loader,
  MarketPairChangeModal,
  MarketTradeBuySell,
  OrderBook,
  Wrap,
} from "../../common";
import styles from "./BuySellMarketStyle";
import MarketTradeHeader from "../../common/MarketTradeHeader";

import fonts from "../../../theme/fonts";
import { strings } from "../../../../Localization";

import Singleton from "../../../Singleton";
import { useDispatch, useSelector } from "react-redux";
import PercentageChange from "../Trades/PercentageChange";

import * as constants from "../../../Constants";
import { EventRegister } from "react-native-event-listeners";
import ViewShot, { captureRef, captureScreen } from "react-native-view-shot";
import CameraRoll from "@react-native-community/cameraroll";
import Share from "react-native-share";
import { showMessage, hideMessage } from "react-native-flash-message";
var RNFS = require("react-native-fs");
import WebView from "react-native-webview";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
const graphHtml = require("../../../graphComponents/main.html");
// const {ScreenshotModule} = NativeModules;
const BuySellMarket = (props) => {
  // const viewShot = useRef(null);
  // const ActionSheetAsk = useRef(null);
  const [favCoinPair, setFavCoinPair] = useState(false);
  const { selectedCoinPair } = useSelector((state) => state?.tradeReducer);
  const [modalVisibleMarketPair, setModalVisibleMarketPair] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [btnSelected, setBtnSelected] = useState(true);
  // const intervalInstance = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMarketList());
    getFavList();
    props.navigation.addListener("didFocus", function () {
      dispatch(
        updateMarketPair(
          selectedCoinPair.base_unit + selectedCoinPair.quote_unit
        )
      );
      dispatch(
        buySellSocket({
          pair: selectedCoinPair.base_unit + selectedCoinPair.quote_unit,
        })
      );
    });

    return () => {
      dispatch(stopPreviousConnection());
      dispatch(tradeSocketClose());
      // intervalInstance.current.clearInterval();
    };
  }, []);
  const getFavList = async () => {
    const arr = await Singleton.getInstance().getData("favArr");
    // console.log("Singleton=-=-=fav arr->>", JSON.parse(arr));

    let value = JSON.parse(arr);
    let status = value.find(
      (val) =>
        val.name ===
        `${selectedCoinPair.base_unit.toUpperCase()}/${selectedCoinPair.quote_unit.toUpperCase()}`
    );
    if (status != undefined) {
      setFavCoinPair(true);
    } else {
      setFavCoinPair(false);
    }
    // console.log("Singleton=-=-=->>status", status);
  };
  const publicTradeSocket = () => {
    dispatch(
      callTradeSocket({
        pair: selectedCoinPair.base_unit + selectedCoinPair.quote_unit,
        // auth: '',
      })
    );
  };

  const renderOrderBook = () => {
    return (
      <View>
        <OrderBook />
      </View>
    );
  };
  const renderMarketTrades = () => {
    return <MarketTradeBuySell />;
  };

  const hasAndroidPermission = async () => {
    if (Platform.OS === "android") {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      let status = await PermissionsAndroid.request(permission);

      if (status === "granted") {
        savePicture();
        return true;
      } else {
        Alert.alert(
          constants.APP_NAME,
          strings.buy_sell_market_screen.camera_permission_denied
        );
        console.log("permission rejected");
      }
      return status === "granted";
    } else {
      savePicture();
    }
  };
  const savePicture = async (uri) => {
    const type = "photo";
    const album = "XChangeMonster";
    // ScreenshotModule.takeScreenshot().then(res => {
    //   console.log('takeScreenshot=-=-=->>res', res);
    // });
    // captureRef(viewRef, {
    //   format: "jpg",
    //   quality: 0.8
    // }).then(
    //   uri => console.log("Image saved to", uri),
    //   error => console.error("Oops, snapshot failed", error)
    // );
    //-----------------
    captureScreen({
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => {
        console.log("Image saved to=-=-=-=-=-=>>>", uri);
        RNFS.readFile(uri, "base64").then((res) => {
          let urlString = "data:image/jpeg;base64," + res;
          let options = {
            title: "Market Update",
            message:
              selectedCoinPair.base_unit.toUpperCase() +
              "/" +
              selectedCoinPair.quote_unit.toUpperCase(),
            url: urlString,
            type: "image/jpeg",
          };
          Share.open(options)
            .then((res) => {})
            .catch((err) => {
              err && console.log("err=-=-=-=->>>>", err);
            });
        });
      },
      (error) => console.error("Oops, snapshot failed", error)
    );
    //---------------
    // viewShot.current.capture().then(uri => {
    //   RNFS.readFile(uri, 'base64').then(res => {
    //     let urlString = 'data:image/jpeg;base64,' + res;
    //     let options = {
    //       title: 'Share Title',
    //       message: 'Share Message',
    //       url: urlString,
    //       type: 'image/jpeg',
    //     };
    //     Share.open(options)
    //       .then(res => {})
    //       .catch(err => {
    //         err && console.log('err=-=-=-=->>>>', err);
    //       });
    //   });
    // });
  };
  const captureImage = () => {
    hasAndroidPermission();
  };

  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.BackgroundDarkView }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.BackgroundDarkView },
      ]}
      collapsable={false}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.BackgroundDarkView }}
    >
      {/* <ViewShot
        ref={viewShot}
        options={{format: 'jpg', quality: 1.0}}
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.BackgroundDarkView,
        }}> */}

      <View
        collapsable={false}
        style={[
          styles.viewMainContainer,
          { backgroundColor: ThemeManager.colors.BackgroundDarkView },
        ]}
      >
        <MarketTradeHeader
          onMarketChangePress={() => {
            setModalVisibleMarketPair(true);
          }}
          onBackPress={() => Actions.pop()}
          favIconStyle={{
            tintColor: favCoinPair
              ? ThemeManager.colors.selectedTextColor
              : null,
          }}
          pairStyleView={{ marginLeft: 30 }}
          pairTextStyle={{
            color: ThemeManager.colors.textColor,
            fontSize: 16,
            fontFamily: Fonts.medium,
          }}
          // swapIconStyle={{tintColor: ThemeManager.colors.selectedTextColor}}

          // favIcon={
          //   favCoinPair
          //     ? { uri: Images.fav_icon }
          //     : { uri: ThemeManager.ImageIcons.icon_star }
          favIcon={
            favCoinPair
              ? { uri: ThemeManager.ImageIcons.icon_star }
              : { uri: ThemeManager.ImageIcons.icon_star }
          }
          favSelected={favCoinPair}
          onPressTrade={() => {
            captureImage();
          }}
          onPressStar={() => {
            Singleton.getInstance()
              .saveToFav(selectedCoinPair)
              .then((res) => {
                EventRegister.emit("favRefresh", "it works!!!");
                favCoinPair ? setFavCoinPair(false) : setFavCoinPair(true);
              })
              .catch((err) => {
                console.log("ERROR_DAP----", err);
              });
          }}
          currencyPair={
            selectedCoinPair.base_unit.toUpperCase() +
            "/" +
            selectedCoinPair.quote_unit.toUpperCase()
          }
        />

        <ScrollView
          bounces={false}
          collapsable={false}
          showsVerticalScrollIndicator={false}
        >
          <View collapsable={false} style={{ marginTop: 10, flex: 1 }}>
            <BuySellMarketHeader
              backgroundColorCode={ThemeManager.colors.DashboardBG}
            />
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setBtnSelected(true);
                  // if (i.i === 1) {
                  // setInfoTabSelected(true);

                  // alert('ds');
                  // } else {
                  dispatch(tradeSocketClose());
                  // setInfoTabSelected(false);
                  // }
                }}
              >
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: fonts.regular,
                  }}
                >
                  {strings.buy_sell_market.order_book}
                </Text>
                {btnSelected && (
                  <View
                    style={{
                      height: 4,
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      width: 80,
                    }}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  publicTradeSocket();
                  setBtnSelected(false);
                }}
              >
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: fonts.regular,
                  }}
                >
                  {strings.buy_sell_market.market_trades}
                </Text>
                {btnSelected === false ? (
                  <View
                    style={{
                      height: 4,
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      width: 100,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      height: 4,
                      // backgroundColor: ThemeManager.colors.selectedTextColor,
                      width: 100,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10, marginHorizontal: 8 }}>
              {btnSelected ? (
                <View>{renderOrderBook()}</View>
              ) : (
                <View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {strings.buy_sell_market.time}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {strings.buy_sell_market.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {strings.buy_sell_market.amount}
                    </Text>
                  </View>
                  {renderMarketTrades()}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          marginHorizontal: 15,
          alignItems: "center",
          flex: 0.1,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
              height: 45,
              width: "35%",
              backgroundColor: ThemeManager.colors.textGreenColor,
              borderRadius: 8,
            }}
            onPress={() => {
              setTimeout(() => {
                Actions.jump("_Trades", { item: "buy", value: props.item });
              }, 300);
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: Fonts.regular,
                fontSize: 15,
              }}
            >
              {strings.buy_sell_market.buy}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
              height: 45,
              width: "35%",
              backgroundColor: ThemeManager.colors.textRedColor,
              borderRadius: 8,
            }}
            onPress={() => {
              Actions.jump("_Trades", { item: "sell", value: props.item });
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: Fonts.regular,
                fontSize: 15,
              }}
            >
              {strings.buy_sell_market.sell}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </ViewShot> */}
      {modalVisibleMarketPair && (
        <MarketPairChangeModal
          closeModal={() => {
            setModalVisibleMarketPair(false);
            setLoader(true);
            setTimeout(function () {
              setLoader(false);
            }, 2000);
          }}
          visible={modalVisibleMarketPair}
        />
      )}
      <Loader isLoading={isLoading} />
    </Wrap>
  );
};

export default BuySellMarket;
