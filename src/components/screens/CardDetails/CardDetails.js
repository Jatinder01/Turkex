/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { ButtonPrimary, CryptoInput, Header, Loader, Wrap } from "../../common";
import { Fonts, Images } from "../../../theme";
import { Actions } from "react-native-router-flux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemeManager } from "../../../../ThemeManager";
import ConvertHeader from "../../common/ConvertHeader";
import { strings } from "../../../../Localization";
import WebView from "react-native-webview";
import SelectDropdown from "react-native-select-dropdown";
import {
  getActiveCoinList,
  postBuySell,
  getPaymentGatewayKetDetails,
  transactionBuySell,
  getProfile1,
  transactionCallback,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import * as constants from "../../../Constants";
import styles from "./CardDetailsStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import NetInfo from "@react-native-community/netinfo";
import Singleton from "../../../Singleton";
// import DeviceInfo from 'react-native-device-info';
import DeviceCountry, {
  TYPE_ANY,
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
} from "react-native-device-country";

let fiatArr = [];
let coinArr = [];
const CardDetails = (props) => {
  const dispatch = useDispatch();

  const { isThemeUpdate } = useSelector((state) => state.tradeReducer);
  const [buySelected, setBuySelected] = useState(props.buySell);
  const buySellReducer = useSelector((state) => state?.buySellReducer);
  const [ipAddress, setIpAddress] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [showWeb, setShowWeb] = useState(false);
  const [showPaymentWeb, setShowPaymentWeb] = useState(false);

  const [webUrl, setWebUrl] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const paymentGatewayReducer = useSelector(
    (state) => state?.paymentGatewayReducer
  );
  const transactionBuySellReducer = useSelector(
    (state) => state?.transactionBuySellReducer
  );
  const transactionCallbackReducer = useSelector(
    (state) => state?.transactionCallbackReducer
  );

  useEffect(() => {
    // CookieManager.setFromResponse(
    //   'https://stage-exchange.xchangemonster.com/',
    //   `_ga=GA1.2.43675832.1647236952; _gid=GA1.2.2037557356.1650254644; _barong_session=974307db158472be680355acebcddf7f`,
    //   // `JwtToken=${token}; Path=/;`,
    // ).then(success => {
    //   console.log('CookieManager.setFromResponse =>', success);
    // });
    // CookieManager.set('http://example.com', {
    //   _ga='GA1.2.43675832.1647236952', _gid='GA1.2.2037557356.1650254644', _barong_session='974307db158472be680355acebcddf7f'
    // }).then((done) => {
    //   console.log('CookieManager.set =>', done);
    // });

    // dispatch(getActiveCoinList());

    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  useEffect(() => {
    DeviceCountry.getCountryCode(TYPE_TELEPHONY)
      .then((result) => {
        setCountryCode(result.code.toUpperCase());
      })
      .catch((e) => {
        console.log(e);
      });
    dispatch(getPaymentGatewayKetDetails());
    dispatch(getProfile1());
    getUserDetails();
  }, []);
  const getUserDetails = () => {
    setIpAddress(global.ipAddress);
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then(async (res) => {});
  };
  // const INJECTED_JAVASCRIPT = `(function() {
  //   const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  // })();`;
  // const checkConnection = state => {
  //   console.log('Internet State card details: ', state);
  //   setIpAddress(state.details.ipAddress);
  //   // global.isConnected = state.isConnected;
  //   // global.isInternetReachable =
  //   //   state.isInternetReachable == null ? true : state.isInternetReachable;
  //   // showNetworkErr();
  //   // console.log('CONNECTED ' + global.isConnected + " REACH " + global.isInternetReachable)
  // };
  //   const runFirst = `
  //   setTimeout(function() {
  //       window.alert("Click me!");
  //       document.getElementById("h1_element").innerHTML =
  //       "What is your favourite language?";
  //       document.getElementById("h2_element").innerHTML =
  //       "We will see!";
  //     }, 1000);
  //   true; // note: this is required, or you'll sometimes get silent failures
  // `;

  //   const runBeforeFirst = `
  //   window.isNativeApp = true;
  //   true; // note: this is required, or you'll sometimes get silent failures
  // `;

  return (
    <>
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.tabBackground }}
        screenStyle={[
          styles.screenStyle,
          { backgroundColor: ThemeManager.colors.tabBackground },
        ]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={{ backgroundColor: ThemeManager.colors.tabBackground }}
      >
        {showPaymentWeb === false && (
          <>
            {showWeb ? (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 10,
                    marginHorizontal: 15,
                    height: 50,
                    // flex: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      // Actions.pop();
                      setShowWeb(false);
                      //   setShowConvertModal(false);
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_back }}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                </View>
                <WebView
                  style={{ flex: 1 }}
                  source={{
                    uri: webUrl,
                  }}
                  scalesPageToFit={true}
                  onShouldStartLoadWithRequest={() => true}
                  onLoadStart={() => setShowLoader(true)}
                  onLoad={() => setShowLoader(false)}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  onNavigationStateChange={(data) => {
                    if (data?.url.includes("success")) {
                      dispatch(
                        transactionCallback(
                          transactionBuySellReducer?.gooneyTrxBuySell?.uuid,
                          "success",
                          transactionBuySellReducer?.gooneyTrxBuySell
                            ?.purchaseId
                        )
                      )
                        .then((res) => {
                          setShowWeb(false);
                          Actions.currentScene != "ChooseCrypto" &&
                            Actions.pop();

                          Alert.alert(
                            constants.APP_NAME_CAPS,
                            strings.trade_tab.payment_success
                          );
                        })
                        .catch((err) => {});
                    }
                    if (data?.url.includes("fail")) {
                      dispatch(
                        transactionCallback(
                          transactionBuySellReducer?.gooneyTrxBuySell?.uuid,
                          "fail",
                          transactionBuySellReducer?.gooneyTrxBuySell
                            ?.purchaseId
                        )
                      )
                        .then((res) => {
                          setShowWeb(false);
                          Alert.alert(
                            constants.APP_NAME_CAPS,
                            strings.trade_tab.payment_failed
                          );
                          Actions.pop();
                        })
                        .catch((err) => {});
                    }
                  }}
                  onMessage={(event) => {}}
                />
                <Loader isLoading={showLoader} />
              </>
            ) : (
              <View>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 20,
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
                </View>
                <Loader isLoading={transactionBuySellReducer?.isLoading} />
                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  {buySelected ? (
                    <View
                      style={{
                        marginHorizontal: 5,
                        backgroundColor: ThemeManager.colors.tabBackground,
                        flex: 1,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: ThemeManager.colors.whiteScreen,
                          flex: 1,
                          marginHorizontal: 5,
                          marginTop: 30,
                          borderRadius: 10,
                          shadowColor: ThemeManager.colors.textColor1,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.23,
                          shadowRadius: 2.62,

                          elevation: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 20,
                            marginTop: 20,
                            fontFamily: Fonts.medium,
                            textAlign: "center",
                          }}
                        >
                          {strings.trade_tab.buy_crypto_with}
                        </Text>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 17,
                            fontFamily: Fonts.medium,
                            textAlign: "center",
                            marginVertical: 10,
                          }}
                        >
                          {strings.trade_tab.choose_payment_method}
                        </Text>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.medium,
                            textAlign: "center",
                            marginBottom: 20,
                          }}
                        >
                          1 {props.fromCurrency}
                          {" ~ "}
                          {parseFloat(props.currentRate).toFixed(6)}{" "}
                          {props.toCurrency}
                        </Text>
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 10,
                            flex: 1,
                          }}
                        >
                          <View style={{ alignItems: "center" }}>
                            <Text
                              style={{
                                color: ThemeManager.colors.inactiveTextColor,
                                fontSize: 17,
                                fontFamily: Fonts.medium,
                              }}
                            >
                              {strings.trade_tab.send}
                            </Text>
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 12,
                                fontFamily: Fonts.medium,
                                textTransform: "uppercase",
                                // width: '35%',
                                flexShrink: 1,
                              }}
                            >
                              {props?.currencyValue} {props?.toCurrency}
                            </Text>
                          </View>

                          <View style={{ marginTop: -8 }}>
                            <Text
                              style={{
                                fontSize: 30,
                                fontFamily: Fonts.bold,
                                color: ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              →
                            </Text>
                          </View>
                          <View style={{ alignItems: "center" }}>
                            <Text
                              style={{
                                color: ThemeManager.colors.inactiveTextColor,
                                fontSize: 17,
                                fontFamily: Fonts.medium,
                                textAlign: "right",
                              }}
                            >
                              {strings.trade_tab.receive}
                            </Text>
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 12,
                                fontFamily: Fonts.medium,
                                textTransform: "uppercase",
                                flexShrink: 1,
                                // width: '35%',
                              }}
                            >
                              {parseFloat(props?.coinValue).toFixed(8)}{" "}
                              {props?.fromCurrency}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            height: 1,
                            backgroundColor:
                              ThemeManager.colors.inactiveTextColor,
                            opacity: 0.6,
                            marginTop: 20,
                          }}
                        />
                        <View
                          style={{ marginVertical: 20, marginHorizontal: 10 }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 18,
                              fontFamily: Fonts.medium,
                            }}
                          >
                            {strings.trade_tab.visa_mastercard}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: Images.icon_visa }}
                                style={{
                                  height: 50,
                                  width: 60,
                                  resizeMode: "contain",
                                }}
                              />
                              <Image
                                source={{ uri: Images.icon_mastercard }}
                                style={{
                                  height: 50,
                                  width: 60,
                                  resizeMode: "contain",
                                }}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                dispatch(
                                  transactionBuySell(
                                    props.toCurrency,
                                    props.fromCurrency,
                                    props.currencyValue,
                                    props.coinValue,
                                    paymentGatewayReducer?.gooneyKey?.data,
                                    countryCode,
                                    ipAddress
                                  )
                                )
                                  .then((res) => {
                                    if (res?.returnType === "REDIRECT") {
                                      setWebUrl(res?.redirectUrl);
                                      setShowWeb(true);
                                    }
                                  })
                                  .catch((err) => {});
                              }}
                              style={{
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: ThemeManager.colors.Depositbtn,
                                padding: 10,
                                borderRadius: 5,
                              }}
                            >
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor,
                                  fontFamily: Fonts.regular,
                                  fontSize: 14,
                                }}
                              >
                                {strings.trade_tab.add_card}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            height: 1,
                            backgroundColor:
                              ThemeManager.colors.inactiveTextColor,
                            opacity: 0.6,
                            marginTop: 20,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            Actions.pop();
                          }}
                          style={{
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: ThemeManager.colors.Depositbtn,
                            padding: 10,
                            borderRadius: 5,
                            marginHorizontal: 20,
                            marginVertical: 30,
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.regular,
                              fontSize: 16,
                            }}
                          >
                            {strings.trade_tab.previous}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginHorizontal: 5,
                        backgroundColor: ThemeManager.colors.tabBackground,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: ThemeManager.colors.whiteScreen,
                          flex: 1,
                          marginHorizontal: 5,
                          marginTop: 30,
                          borderRadius: 10,
                          shadowColor: ThemeManager.colors.textColor1,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.23,
                          shadowRadius: 2.62,

                          elevation: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 20,
                            marginTop: 20,
                            fontFamily: Fonts.medium,
                            textAlign: "center",
                          }}
                        >
                          {strings.trade_tab.sell_crypto_with}
                        </Text>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 17,
                            fontFamily: Fonts.medium,
                            textAlign: "center",
                            marginVertical: 10,
                          }}
                        >
                          {strings.trade_tab.choose_payment_method}
                        </Text>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.medium,
                            textAlign: "center",
                            marginBottom: 10,
                          }}
                        >
                          1 {props.fromCurrency.toUpperCase()}
                          {" ~ "}
                          {parseFloat(props.currentRate).toFixed(6)}{" "}
                          {props.toCurrency.toUpperCase()}
                        </Text>
                        <View
                          style={{
                            // flexDirection: 'row',
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginHorizontal: 10,
                          }}
                        >
                          <View style={{ alignItems: "center" }}>
                            <Text
                              style={{
                                color: ThemeManager.colors.inactiveTextColor,
                                fontSize: 17,
                                fontFamily: Fonts.medium,
                              }}
                            >
                              {strings.trade_tab.sell}
                            </Text>
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 12,
                                fontFamily: Fonts.medium,
                                textTransform: "uppercase",
                              }}
                            >
                              {props?.coinValue}{" "}
                              {props?.fromCurrency.toUpperCase()}
                            </Text>
                          </View>
                          <View style={{ alignItems: "center", marginTop: -8 }}>
                            <Text
                              style={{
                                fontSize: 30,
                                fontFamily: Fonts.bold,
                                color: ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              →
                            </Text>
                          </View>
                          <View style={{ alignItems: "center" }}>
                            <Text
                              style={{
                                color: ThemeManager.colors.inactiveTextColor,
                                fontSize: 17,
                                fontFamily: Fonts.medium,
                                textAlign: "right",
                              }}
                            >
                              {strings.trade_tab.receive}
                            </Text>
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 12,
                                fontFamily: Fonts.medium,
                                textTransform: "uppercase",
                              }}
                            >
                              {parseFloat(props?.currencyValue).toFixed(8)}{" "}
                              {props?.toCurrency.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            height: 1,
                            backgroundColor:
                              ThemeManager.colors.inactiveTextColor,
                            opacity: 0.6,
                            marginTop: 20,
                          }}
                        />
                        <View
                          style={{ marginVertical: 20, marginHorizontal: 10 }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 18,
                              fontFamily: Fonts.medium,
                            }}
                          >
                            {strings.trade_tab.visa_mastercard}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: Images.icon_visa }}
                                style={{
                                  height: 50,
                                  width: 60,
                                  resizeMode: "contain",
                                }}
                              />
                              <Image
                                source={{ uri: Images.icon_mastercard }}
                                style={{
                                  height: 50,
                                  width: 60,
                                  resizeMode: "contain",
                                }}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                dispatch(
                                  transactionBuySell(
                                    props.fromCurrency,
                                    props.toCurrency,
                                    props.coinValue,
                                    props.currencyValue,
                                    paymentGatewayReducer?.gooneyKey?.data,
                                    countryCode,
                                    ipAddress
                                  )
                                )
                                  .then((res) => {
                                    if (res?.returnType === "REDIRECT") {
                                      setWebUrl(res?.redirectUrl);
                                      setShowWeb(true);
                                    }
                                  })
                                  .catch((err) => {
                                    console.log(
                                      "errr response trx buy sell=-=-=->>>",
                                      err
                                    );
                                  });
                              }}
                              style={{
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: ThemeManager.colors.Depositbtn,
                                padding: 10,
                                borderRadius: 5,
                              }}
                            >
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor,
                                  fontFamily: Fonts.regular,
                                  fontSize: 14,
                                }}
                              >
                                {strings.trade_tab.add_card}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            height: 1,
                            backgroundColor:
                              ThemeManager.colors.inactiveTextColor,
                            opacity: 0.6,
                            marginTop: 20,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            Actions.pop();
                          }}
                          style={{
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: ThemeManager.colors.Depositbtn,
                            padding: 10,
                            borderRadius: 5,
                            marginHorizontal: 20,
                            marginVertical: 30,
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.regular,
                              fontSize: 16,
                            }}
                          >
                            {strings.trade_tab.previous}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </KeyboardAwareScrollView>
              </View>
            )}
          </>
        )}
      </Wrap>
    </>
  );
};

export default CardDetails;
