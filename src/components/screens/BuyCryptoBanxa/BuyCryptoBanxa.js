/* eslint-disable react/self-closing-comp */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  SafeAreaView,
  Dimensions,
  Modal,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  BankListDropDown,
  BankListDropDownWithdraw,
  ButtonPrimary,
  BuySellCryptoInput,
  CryptoInput,
  FiatDropDown,
  Header,
  InputField,
  Loader,
  Wrap,
} from "../../common";
import { colors, Fonts, Images } from "../../../theme";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../../ThemeManager";
import ConvertHeader from "../../common/ConvertHeader";
import { strings } from "../../../../Localization";
import WebView from "react-native-webview";
import Clipboard from "@react-native-clipboard/clipboard";
// import CookieManager from 'react-native-cookies';
// import CookieManager from '@react-native-cookies/cookies';
import SelectDropdown from "react-native-select-dropdown";
import {
  banxaSupportedCurrency,
  banxaSupportedCurrencySell,
  getProfile1,
  getCoinAddress,
  banxaPaymentMethod,
  banxaPriceConversion,
  banxaBuyCrypto,
  banxaBuyCryptoCallback,
  banxaSupportedNetwork,
  banxaSingleOrder,
  banxaconfirmSell,
  getCurrencyDetails,
  getActiveCoinList,
  getFundsLimit,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import * as constants from "../../../Constants";
import styles from "./BuyCryptoBanxaStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { showMessage } from "react-native-flash-message";
import { parse } from "@babel/core";
import Singleton from "../../../Singleton";
// var _ = require('lodash');
import debounce from "lodash.debounce";
import FundLimit from "./FundLimit";

const BuyCryptoBanxa = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountSell, setAmountSell] = useState("");
  const [fiatSelected, setFiatSelected] = useState(null);
  const [fiatSelectedCurrency, setFiatSelectedCurrency] = useState("");
  const [fiatCurrencyId, setFiatCurrencyId] = useState("");
  const [coinCurrencyId, setCoinCurrencyId] = useState(null);
  const [cryptoSelected, setCryptoSelected] = useState(null);
  const { fundsLimitInfo } = useSelector((state) => state?.fundsLimitReducer);

  const activeCoin = useSelector((state) => state?.activeCoin);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [networkList, setNetworkList] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [fiatAmountOne, setFiatAmountOne] = useState("");
  const [cryptoAmountOne, setCryptoAmountOne] = useState("");
  const [fiatAmountCurrency, setFiatAmountCurrency] = useState("");
  const [cryptoAmountCurrency, setCryptoAmountCurrency] = useState("");
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [totalFee, setTotalFee] = useState("");
  const [price, setPrice] = useState("");
  const [youWillGet, setYouWillGet] = useState("");
  const [showWeb, setShowWeb] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [webUrl, setWebUrl] = useState("");
  const [buyOrderId, setBuyOrderId] = useState("");
  const [sellOrderId, setSellOrderId] = useState("");
  const [sellSuccessOrderId, setSellSuccessOrderId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trxHash, setTrxHash] = useState("");
  const [modalPopUpVisible, setModalPopUpVisible] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [coinBalance, setCoinBalance] = useState("");
  const [paymentMethodIdBuy, setPaymentMethodIdBuy] = useState("");
  const [paymentMethodIdSell, setPaymentMethodIdSell] = useState("");
  const [userData, setUserData] = useState(null);
  const [checkVerification, setCheckVerification] = useState(false);
  const [tierStatus, setTierStatus] = useState("");
  const [selectTerms, setSelectTerms] = useState(false);

  const [address, setAddress] = useState("");
  const banxaSupportedCurrenciesReducer = useSelector(
    (state) => state?.banxaSupportedCurrenciesReducer
  );
  const banxaSupportedCurrenciesSellReducer = useSelector(
    (state) => state?.banxaSupportedCurrenciesSellReducer
  );
  const banxaPaymentMethodReducer = useSelector(
    (state) => state?.banxaPaymentMethodReducer
  );
  const banxaPriceConversionReducer = useSelector(
    (state) => state?.banxaPriceConversionReducer
  );

  const banxaBuyCryptoReducer = useSelector(
    (state) => state?.banxaBuyCryptoReducer
  );
  const [usdRate, setUsdRate] = useState("");
  const [usdRateFiat, setUsdRateFiat] = useState("");

  const [buyBtnSelected, setBuyBtnSelected] = useState(true);

  const [overAllLimit, setoverAllLimit] = useState("");
  const [totalTransaction, settotalTransaction] = useState("");
  const [noOfTransaction, setNoOfTransaction] = useState("");
  const [dailyLimitUSD, setdailyLimitUSD] = useState("");
  const [showFundLimit, setshowFundLimit] = useState(false);
  const [buyButtonEnabled, setBuyButtonEnabled] = useState(false);
  const [sellButtonEnabled, setSellButtonEnabled] = useState(false);
  const [calculatedBuy, setCalculatedBuy] = useState("0.00");
  const [calculatedSell, setCalculatedSell] = useState("0.00");
  const [calculateAmountBuy, setCalculateAmountBuy] = useState("1");

  const [calculateAmountSell, setCalculateAmountSell] = useState("1");
  useEffect(() => {
    setAmount("");
    setAmountSell("");
    dispatch(getFundsLimit());
    dispatch(getActiveCoinList());
    dispatch(getProfile1())
      .then(async (res) => {
        let statusTier = await checkUserVerificationStatusDeposit();
        // checkTwoFaStatusDeposit();
      })
      .catch((err) => {});
    dispatch(banxaSupportedCurrency("buy"))
      .then((res) => {
        console.log("check response here=-=-=coin id", res?.coins[0]?.id);

        setCoinCurrencyId(res?.coins[0]?.id);
        // let usdPrice = getUsdPrice(res?.coins[0]?.id);
        let usdPrice = res?.coins[0]?.price;

        let fiatUsdRate = res?.fiats[0]?.price;
        setUsdRateFiat(fiatUsdRate);
        setUsdRate(usdPrice);
        setFiatSelected(res?.fiats[0]);
        setFiatSelectedCurrency(res?.fiats[0].id);
        setFiatCurrencyId(res?.fiats[0].id);
        setCryptoCurrency(res?.coins[0].id);
        setCryptoSelected(res?.coins[0]);
        console.log("check response here=-=-=", JSON.stringify(res));
        let coinName = res?.coins[0]?.id;
        dispatch(getCurrencyDetails({ coinName }))
          .then((response) => {
            setCoinBalance(response?.balance);
          })
          .catch((err) => {});

        // dispatch(getCoinAddress(res?.coins[0]?.id, res?.coins[0]?.networks[0]));
        dispatch(banxaPaymentMethod(res?.fiats[0].id, res?.coins[0]?.id))
          .then((resp) => {
            console.log(
              "banxaPaymentMethod response here=-=-=start",
              JSON.stringify(resp)
            );
            console.log("check value=-=-=-=-=->>", res?.fiats[0].id);

            console.log("check value=-=-=-=-=->>+++", fiatSelectedCurrency);
            console.log(
              "check value=-=-=-=-=->>+++fiatCurrencyId",
              fiatCurrencyId
            );
            console.log(
              "check value=-=-=-=-=->>+++coinCurrencyId",
              coinCurrencyId
            );
            setMinAmount(resp[0]?.transaction_limits[0]?.min);
            setMaxAmount(resp[0]?.transaction_limits[0]?.max);

            dispatch(banxaSupportedNetwork("buy", res?.coins[0]?.id))
              .then((res) => {
                console.log(
                  "banxaSupportedNetwork buy=-=-=++----",
                  JSON.stringify(res)
                );
                setNetworkList(res);
                setSelectedNetwork(res[0]);

                setAddress(res[0].address);
              })
              .catch((err) => {});
            setPaymentMethod(resp[0].name);
            setPaymentMethodId(resp[0].id);
            dispatch(
              banxaPriceConversion(res?.fiats[0]?.id, res?.coins[0]?.id, 1)
            )
              .then((response) => {
                console.log(
                  "banxaPriceConversion response here=-=-=",
                  JSON.stringify(response)
                );
                setPaymentMethodData(response?.data?.prices);
                response?.data?.prices.map((item, index) => {
                  console.log("resp[0].id response item=-map=-=", resp[0].id);
                  if (resp[0].id == item?.payment_method_id) {
                    console.log(
                      "banxaPriceConversion response item=-map=-=",
                      JSON.stringify(item)
                    );
                    console.log(
                      "item?.payment_method_id response item=-=-=",
                      item?.payment_method_id
                    );
                    console.log(
                      "response[0].coin_amount=-=-=",
                      item?.coin_amount
                    );
                    setTotalFee(item?.spot_price_fee);
                    setYouWillGet(item?.coin_amount);
                    setCryptoAmount(item?.coin_amount);
                    setCryptoAmountCurrency(item?.coin_code);
                    setFiatAmount(item?.fiat_amount);
                    // setFiatAmountOne(item?.fiat_amount);
                    // setCryptoAmountOne(item?.coin_amount);
                    setFiatAmountCurrency(item?.fiat_code);
                  }
                });
              })
              .catch((err) => {});
          })
          .catch((err) => {});

        // setNetworkList(res?.coins[0]?.networks);
        // setSelectedNetwork(res?.coins[0]?.networks[0]);
      })
      .catch((err) => {});
    // dispatch(banxaSupportedCurrencySell('sell'));
    getFundLimit();
    return () => {
      // cleanup
    };
  }, []);

  const getUsdPrice = (name) => {
    let data = activeCoin?.activeCoinInfo?.find((value) => value.id == name);
    return data;
  };

  const getFundLimit = () => {
    console.log("fundsLimitInfo?.limits=-=-=->>>", fundsLimitInfo);
    let overAllLimit = parseFloat(
      fundsLimitInfo?.limits?.over_all_limit_in_usd
    );
    let totalTransaction = parseFloat(fundsLimitInfo?.transactions?.total);
    let dailyLimitUSD = parseFloat(fundsLimitInfo?.limits?.daily_limit_in_usd);
    setoverAllLimit(overAllLimit);
    settotalTransaction(totalTransaction);
    setdailyLimitUSD(dailyLimitUSD);
    setNoOfTransaction(fundsLimitInfo?.transactions?.count);
  };
  const checkUserVerificationStatusDeposit = () => {
    return new Promise(async (resolve, rej) => {
      let tierStatusValue = "";
      var res = await Singleton.getInstance().getData(constants.USER_DATA);
      let parsedRes = JSON.parse(res);

      setUserData(parsedRes);

      try {
        let confirmations = parsedRes?.labels.find(
          (item) => item?.value === "verified" && item?.key === "tier_1"
        );
        // return confirmations;
        if (confirmations === undefined) {
          setCheckVerification(false);

          Alert.alert(constants.APP_NAME, "KYC is not verified.");
          tierStatusValue = "unverified";
        } else if (confirmations?.value === "verified") {
          tierStatusValue = "tier_1";
          setTierStatus(tierStatusValue);

          let confirmations_tier2 = parsedRes?.labels.find(
            (item) => item?.value === "verified" && item?.key === "tier_2"
          );

          let confirmations_tier3 = parsedRes?.labels.find(
            (item) => item?.value === "verified" && item?.key === "tier_3"
          );
          let confirmations_tier4 = parsedRes?.labels.find(
            (item) => item?.value === "verified" && item?.key === "tier_4"
          );

          if (confirmations_tier2?.value === "verified") {
            tierStatusValue = "tier_2";
            setTierStatus(tierStatusValue);
          }
          if (confirmations_tier3?.value === "verified") {
            tierStatusValue = "tier_3";
            setTierStatus(tierStatusValue);
          }
          if (confirmations_tier4?.value === "verified") {
            tierStatusValue = "tier_3";
            setTierStatus(tierStatusValue);
          }
          setTierStatus(tierStatusValue);
        } else {
          // alert('hello');
          Alert.alert(constants.APP_NAME, "KYC is not verified.");
          setCheckVerification(false);
        }
      } catch (err) {}

      return resolve(tierStatus);
    });
  };

  const getResult = (
    text,
    cryptoId,
    fiatId,
    methodId,
    minAmounts,
    maxAmounts
  ) => {
    // console.log('chec text value=-=++-=-=->>+++++', text);
    // console.log('chec text value=-=++-=-=->>cryptoId', cryptoId);

    // console.log('chec text value=-=++-=-=->>fiatId', fiatId);
    // console.log('chec text value=-=++-=-=->>fiatCurrencyId', fiatCurrencyId);
    // console.log('chec text value=-=++-=-=->>paymentMethodId', methodId);
    console.log(
      "minAmount=-=-=>",
      minAmount,
      " text=-",
      text,
      " maxAmount=-=-",
      maxAmount
    );
    if (text >= parseFloat(minAmounts) && text <= parseFloat(maxAmounts)) {
      dispatch(banxaPriceConversion(fiatId, cryptoId, text ? text : 1))
        .then((response) => {
          console.log(
            "banxaPriceConversion response here=-=-=",
            JSON.stringify(response)
          );
          setPaymentMethodData(response?.data?.prices);

          response?.data?.prices.map((item, index) => {
            if (methodId == item?.payment_method_id) {
              setTotalFee(item?.spot_price_fee);
              setYouWillGet(item?.coin_amount);
              setCalculateAmountBuy(text);
              setCryptoAmount(item?.coin_amount);
              setCryptoAmountCurrency(item?.coin_code);
              setFiatAmount(item?.fiat_amount);
              setFiatAmountCurrency(item?.fiat_code);
              // setFiatAmountOne(item?.fiat_amount);
              // setCryptoAmountOne(item?.coin_amount);
              setSelectedPayment(0);
            }
          });
        })
        .catch((err) => {});
    } else {
      dispatch(banxaPriceConversion(fiatId, cryptoId, 1))
        .then((response) => {
          console.log(
            "banxaPriceConversion response here=-=-=",
            JSON.stringify(response)
          );
          setPaymentMethodData(response?.data?.prices);
          response?.data?.prices.map((item, index) => {
            if (methodId == item?.payment_method_id) {
              setTotalFee(item?.spot_price_fee);
              setYouWillGet(item?.coin_amount);
              setCalculateAmountBuy("1");
              setCryptoAmount(item?.coin_amount);
              setCryptoAmountCurrency(item?.coin_code);
              setFiatAmount(item?.fiat_amount);
              setFiatAmountCurrency(item?.fiat_code);
              // setFiatAmountOne(item?.fiat_amount);
              // setCryptoAmountOne(item?.coin_amount);
              setSelectedPayment(0);
            }
          });
        })
        .catch((err) => {});

      Singleton.getInstance().showError(
        `${strings.trade_tab.order_for_yours_selected}${minAmounts} and ${maxAmounts}`
      );
    }
  };
  const getResultSell = (
    text,
    cryptoId,
    fiatId,
    methodId,
    minAmounts,
    maxAmounts
  ) => {
    console.log("chec text value=-=++-=-=->>", text);
    if (text >= parseFloat(minAmounts) && text <= parseFloat(maxAmounts)) {
      dispatch(banxaPriceConversion(cryptoId, fiatId, text ? text : 1))
        .then((response) => {
          console.log(
            "banxaPriceConversion response here=-=-=",
            JSON.stringify(response)
          );
          setCalculateAmountSell(text);
          setPaymentMethodData(response?.data?.prices);
          response?.data?.prices.map((item, index) => {
            if (methodId == item?.payment_method_id) {
              setTotalFee(item?.spot_price_fee);
              setYouWillGet(item?.fiat_amount);
              setCryptoAmount(item?.coin_amount);
              setCryptoAmountCurrency(item?.coin_code);
              setFiatAmount(item?.fiat_amount);
              setFiatAmountCurrency(item?.fiat_code);
              // setFiatAmountOne(item?.fiat_amount);
              // setCryptoAmountOne(item?.coin_amount);
              setSelectedPayment(0);
            }
          });
        })
        .catch((err) => {});
    } else {
      dispatch(banxaPriceConversion(cryptoId, fiatId, 1))
        .then((response) => {
          console.log(
            "banxaPriceConversion response here=-=-=",
            JSON.stringify(response)
          );
          setCalculateAmountSell("1");
          setPaymentMethodData(response?.data?.prices);
          response?.data?.prices.map((item, index) => {
            if (methodId == item?.payment_method_id) {
              setTotalFee(item?.spot_price_fee);
              setYouWillGet(item?.fiat_amount);
              setCryptoAmount(item?.coin_amount);
              setCryptoAmountCurrency(item?.coin_code);
              setFiatAmount(item?.fiat_amount);
              setFiatAmountCurrency(item?.fiat_code);
              setFiatAmountOne(item?.fiat_amount);
              setCryptoAmountOne(item?.coin_amount);
              setSelectedPayment(0);
            }
          });
        })
        .catch((err) => {});
      Singleton.getInstance().showError(
        `${strings.trade_tab.order_for_yours_selected}${minAmounts} and ${maxAmounts}`
      );
    }
  };

  const debounceCalled = (
    text,
    cryptoId,
    fiatId,
    methodId,
    minAmounts,
    maxAmounts
  ) => {
    console.log(cryptoId, "text===========", text, fiatId, methodId);
    debounceLoadData(text, cryptoId, fiatId, methodId, minAmounts, maxAmounts);
  };
  const debounceCalledSell = (
    text,
    cryptoId,
    fiatId,
    methodId,
    minAmounts,
    maxAmounts
  ) => {
    console.log(cryptoId, "text===========", text, fiatId, methodId);
    debounceLoadDataSell(
      text,
      cryptoId,
      fiatId,
      methodId,
      minAmounts,
      maxAmounts
    );
  };
  const debounceLoadData = useCallback(debounce(getResult, 800), []);
  const debounceLoadDataSell = useCallback(debounce(getResultSell, 800), []);

  const copyToClipboard = () => {
    Clipboard.setString(walletAddress);
    // Toast.showWithGravity(
    //   strings.aboutUs.deviceIdCopied,
    //   Toast.SHORT,
    //   Toast.BOTTOM,
    // );
    Singleton.getInstance().showMsg(strings.trade_tab.address_copied);
    // showMessage({
    //   message: strings.trade_tab.address_copied,
    //   backgroundColor: ThemeManager.colors.tabBottomBorder,
    //   autoHide: true,
    //   duration: 3000,
    //   type: "success",
    //   icon: "success",
    //   position: "right",
    //   style: { marginHorizontal: 10, borderRadius: 10, marginTop: 40 },
    // });
  };
  const checkCondition = () => {
    let result = [true, ""];
    // if (orderDetail?.order !== undefined) {
    //   if (orderDetail?.order?.status !== 'waitingPayment') {
    //     result = [false, 'Order is in still pending state'];
    //   } else if (orderDetail?.order?.wallet_address === null) {
    //     result = [
    //       false,
    //       'Order is still in processing state?. Wallet address found empty ',
    //     ];
    //   }
    // }
    return result;
  };
  return (
    <>
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        screenStyle={[
          styles.screenStyle,
          { backgroundColor: ThemeManager.colors.DashboardBG },
        ]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      >
        <Loader
          isLoading={
            banxaSupportedCurrenciesReducer?.isLoading ||
            banxaPaymentMethodReducer?.isLoading ||
            banxaPriceConversionReducer?.isLoading ||
            banxaSupportedCurrenciesSellReducer?.isLoading ||
            banxaBuyCryptoReducer?.isLoading
          }
        />
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
                console.log("onNavigationStateChange=-=data-=->>>", data);
                console.log(
                  "onNavigationStateChange=-=-=->>>",
                  data?.url.includes("success")
                );
                if (buyBtnSelected) {
                  if (data?.url?.includes("success")) {
                    dispatch(getFundsLimit());
                    setAmount("");
                    setCalculateAmountBuy("1");
                    setShowWeb(false);
                    Alert.alert(
                      constants.APP_NAME,
                      strings.trade_tab.payment_success
                    );
                  }
                  if (data?.url?.includes("fail")) {
                    dispatch(getFundsLimit());
                    setAmount("");
                    setCalculateAmountBuy("1");

                    setShowWeb(false);
                    Alert.alert(
                      constants.APP_NAME_CAPS,
                      strings.trade_tab.payment_failed
                    );
                  }
                  if (data?.url?.includes("cancel")) {
                    dispatch(getFundsLimit());
                    setAmount("");
                    setCalculateAmountBuy("1");

                    setShowWeb(false);

                    Alert.alert(constants.APP_NAME_CAPS, "Payment cancel");
                  }
                } else {
                  if (data?.url?.includes("success")) {
                    dispatch(getFundsLimit());
                    setShowWeb(false);
                    Alert.alert(
                      constants.APP_NAME_CAPS,
                      strings.trade_tab.payment_success
                    );
                    dispatch(banxaSingleOrder(sellOrderId))
                      .then((res) => {
                        console.log(
                          "console==-=-banxa single order succ=-=-=>>",
                          JSON.stringify(res)
                        );
                        setWalletAddress(res?.data?.order?.wallet_address);
                        setPaymentStatus(res?.data?.order?.status);
                        setSellSuccessOrderId(res?.data?.order?.id);
                        setAmountSell("");
                        setCalculateAmountSell("1");
                        setShowWeb(false);
                        // Alert.alert(
                        //   constants.APP_NAME,
                        //   strings.trade_tab.payment_success,
                        // );
                      })
                      .catch((err) => {});
                  }
                  if (data?.url?.includes("fail")) {
                    dispatch(getFundsLimit());
                    setAmountSell("");
                    setCalculateAmountSell("1");

                    setShowWeb(false);
                    Alert.alert(
                      constants.APP_NAME_CAPS,
                      strings.trade_tab.payment_failed
                    );
                  }
                  if (data?.url?.includes("cancel")) {
                    dispatch(getFundsLimit());
                    setAmountSell("");
                    setCalculateAmountSell("1");

                    setShowWeb(false);
                    Alert.alert(constants.APP_NAME_CAPS, "Payment cancel");
                  }
                }
              }}
              onMessage={(event) => {
                console.log(
                  "event.nativeEvent.data-=-=-=>>>",
                  event.nativeEvent.data
                );
              }}
            />
            <Loader isLoading={showLoader} />
          </>
        ) : (
          <>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 15,
                marginHorizontal: 15,
                marginBottom: 10,
                // flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Actions.pop();
                  //   setShowConvertModal(false);
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
                {strings.trade_tab.buy_sell_crypto}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Actions.currentScene != "BanxaOrderList" &&
                    Actions.push("BanxaOrderList");
                  // setModalPopUpVisible(true);
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_note_time }}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    marginRight: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View
                style={{
                  backgroundColor: ThemeManager.colors.DashboardBG,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    width: Dimensions.get("window").width,
                    // flex: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      // dispatch(banxaSupportedCurrency('buy'));
                      setBuyBtnSelected(true);
                      setAddress("");
                      setAmount("");
                      setCalculateAmountBuy("1");

                      setPrice("");
                      setYouWillGet("");
                      setPaymentMethod("");
                      setTotalFee("");
                      setCryptoAmount("");
                      setCryptoAmountCurrency("");
                      setFiatAmount("");
                      setFiatAmountOne("");
                      setCryptoAmountOne("");
                      setFiatAmountCurrency("");
                      setSelectTerms(false);
                      dispatch(banxaSupportedCurrency("buy"))
                        .then((res) => {
                          console.log("=-=-=-=-=-=-=-buy=-=-=-=-=-=-=");
                          let usdPrice = res?.coins[0]?.price;
                          let fiatUsdRate = res?.fiats[0]?.price;
                          setUsdRateFiat(fiatUsdRate);
                          setUsdRate(usdPrice);
                          setFiatSelected(res?.fiats[0]);
                          setFiatSelectedCurrency(res?.fiats[0]?.id);
                          setCryptoSelected(res?.coins[0]);
                          // setNetworkList(res?.coins[0]?.networks);
                          // setSelectedNetwork(res?.coins[0]?.networks[0]);
                          setCryptoCurrency(res?.coins[0]?.id);
                          console.log(
                            "check response here=-=-=",
                            JSON.stringify(res)
                          );
                          console.log(
                            "check response here=-=-=fiats",
                            JSON.stringify(res?.fiats[0])
                          );
                          console.log(
                            "check response here=-=-=Crypto",
                            JSON.stringify(res?.coins[0])
                          );

                          dispatch(
                            banxaSupportedNetwork("buy", res?.coins[0]?.id)
                          )
                            .then((res) => {
                              console.log(
                                "banxaSupportedNetwork buy=+++++-=-=",
                                JSON.stringify(res)
                              );
                              setNetworkList(res);
                              setSelectedNetwork(res[0]);
                              setAddress(res[0].address);
                            })
                            .catch((err) => {});
                          dispatch(
                            banxaPaymentMethod(
                              res?.fiats[0].id,
                              res?.coins[0]?.id
                            )
                          )
                            .then((resp) => {
                              console.log(
                                "banxaPaymentMethod response here=-=-=",
                                JSON.stringify(resp)
                              );
                              setPaymentMethod(resp[0].name);
                              setPaymentMethodId(resp[0].id);
                              setMinAmount(resp[0]?.transaction_limits[0]?.min);
                              setMaxAmount(resp[0]?.transaction_limits[0]?.max);
                              dispatch(
                                banxaPriceConversion(
                                  res?.fiats[0]?.id,
                                  res?.coins[0]?.id,
                                  1
                                )
                              )
                                .then((response) => {
                                  console.log(
                                    "banxaPriceConversion response here=-=-=",
                                    JSON.stringify(response)
                                  );
                                  setPaymentMethodData(response?.data?.prices);
                                  response?.data?.prices.map((item, index) => {
                                    console.log(
                                      "resp[0].id response item=-map=-=",
                                      resp[0].id
                                    );
                                    if (resp[0].id == item?.payment_method_id) {
                                      console.log(
                                        "banxaPriceConversion response item=-map=-=",
                                        JSON.stringify(item)
                                      );
                                      console.log(
                                        "item?.payment_method_id response item=-=-=",
                                        item?.payment_method_id
                                      );
                                      console.log(
                                        "response[0].spot_price_fee=-=-=",
                                        item?.spot_price_fee
                                      );
                                      setTotalFee(item?.spot_price_fee);
                                      setYouWillGet(item?.coin_amount);
                                      setCryptoAmount(item?.coin_amount);
                                      setCryptoAmountCurrency(item?.coin_code);
                                      setFiatAmount(item?.fiat_amount);
                                      setFiatAmountCurrency(item?.fiat_code);
                                      setFiatAmountOne(item?.fiat_amount);
                                      setCryptoAmountOne(item?.coin_amount);
                                    }
                                  });
                                })
                                .catch((err) => {});
                            })
                            .catch((err) => {});
                        })
                        .catch((err) => {});
                    }}
                    style={{
                      // flex: 1,
                      width: Dimensions.get("window").width / 2 - 20,
                      backgroundColor: buyBtnSelected
                        ? ThemeManager.colors.Depositbtn
                        : ThemeManager.colors.SwapInput,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: buyBtnSelected
                        ? "transparent"
                        : ThemeManager.colors.Depositbtn,
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: buyBtnSelected
                          ? ThemeManager.colors.textColor
                          : ThemeManager.colors.textColor1,
                        fontSize: 18,
                        fontFamily: Fonts.medium,
                      }}
                    >
                      {strings.trade_tab.buy_crypto}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setAddress("");
                      setAmountSell("");
                      setCalculateAmountSell("1");

                      setPrice("");
                      setYouWillGet("");
                      setPaymentMethod("");
                      setTotalFee("");
                      setCryptoAmount("");
                      setCryptoAmountCurrency("");
                      setFiatAmount("");
                      setFiatAmountCurrency("");
                      setFiatAmountOne("");
                      setCryptoAmountOne("");
                      setSelectTerms(false);

                      dispatch(banxaSupportedCurrencySell("sell"))
                        .then((res) => {
                          console.log(
                            "banxaSupportedCurrencySell response here=-=-=",
                            JSON.stringify(res)
                          );
                          let usdPrice = res?.coins[0]?.price;

                          let fiatUsdRate = res?.fiats[0]?.price;
                          setUsdRateFiat(fiatUsdRate);
                          setUsdRate(usdPrice);
                          setFiatSelected(res?.fiats[0]);
                          setFiatSelectedCurrency(res?.fiats[0]?.id);
                          setCryptoSelected(res?.coins[0]);
                          setCryptoCurrency(res?.coins[0]?.id);
                          let coinName = res?.coins[0]?.id;
                          dispatch(getCurrencyDetails({ coinName }))
                            .then((response) => {
                              console.log(
                                "getCurrencyDetails response here=-=-=",
                                JSON.stringify(response),
                                setCoinBalance(response?.balance)
                              );
                            })
                            .catch((err) => {});
                          dispatch(
                            banxaPaymentMethod(
                              res?.coins[0]?.id,
                              res?.fiats[0].id
                            )
                          )
                            .then((resp) => {
                              console.log(
                                "banxaPaymentMethod response here=-=-=",
                                JSON.stringify(resp)
                              );
                              setPaymentMethod(resp[0]?.name);
                              setPaymentMethodId(resp[0]?.id);
                              setMinAmount(resp[0]?.transaction_limits[0]?.min);
                              setMaxAmount(resp[0]?.transaction_limits[0]?.max);
                              dispatch(
                                banxaSupportedNetwork("sell", res?.coins[0]?.id)
                              )
                                .then((res) => {
                                  console.log(
                                    "banxaSupportedNetwork=-=- sell=-=-=",
                                    JSON.stringify(res)
                                  );
                                  setAddress(res[0].address);
                                  setNetworkList(res);
                                  setSelectedNetwork(res[0]);
                                })
                                .catch((err) => {});
                              dispatch(
                                banxaPriceConversion(
                                  res?.coins[0]?.id,
                                  res?.fiats[0]?.id,
                                  1
                                )
                              )
                                .then((response) => {
                                  console.log(
                                    "banxaPriceConversion response here=-=-=",
                                    JSON.stringify(response)
                                  );
                                  setPaymentMethodData(response?.data?.prices);
                                  response?.data?.prices.map((item, index) => {
                                    console.log(
                                      "resp[0].id response item=-map=-=",
                                      resp[0].id
                                    );
                                    if (resp[0].id == item?.payment_method_id) {
                                      setTotalFee(item?.spot_price_fee);
                                      setYouWillGet(item?.fiat_amount);
                                      setCryptoAmount(item?.coin_amount);
                                      setCryptoAmountCurrency(item?.coin_code);
                                      setFiatAmount(item?.fiat_amount);
                                      setFiatAmountCurrency(item?.fiat_code);
                                      setFiatAmountOne(item?.fiat_amount);
                                      setCryptoAmountOne(item?.coin_amount);
                                    }
                                  });
                                })
                                .catch((err) => {});
                            })
                            .catch((err) => {});
                        })
                        .catch((err) => {});
                      setBuyBtnSelected(false);
                    }}
                    style={{
                      width: Dimensions.get("window").width / 2 - 20,

                      backgroundColor: buyBtnSelected
                        ? ThemeManager.colors.SwapInput
                        : ThemeManager.colors.Depositbtn,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: buyBtnSelected
                        ? ThemeManager.colors.Depositbtn
                        : "transparent",
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: buyBtnSelected
                          ? ThemeManager.colors.textColor1
                          : ThemeManager.colors.textColor,
                        fontSize: 18,
                        fontFamily: Fonts.medium,
                      }}
                    >
                      {strings.trade_tab.sell_crypto}
                    </Text>
                  </TouchableOpacity>
                </View>
                <>
                  {buyBtnSelected ? (
                    <View
                      style={{
                        marginHorizontal: 20,
                        marginVertical: 20,
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 14,
                              fontFamily: Fonts.bold,
                            }}
                          >
                            {strings.trade_tab.i_want_to_spend}
                          </Text>
                          <TouchableOpacity
                            style={{
                              height: 30,
                              width: 30,
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                            onPress={() => {
                              setshowFundLimit(!showFundLimit);
                            }}
                          >
                            <Image
                              // source={{uri: Images.icon_dropDown}}
                              source={{ uri: Images.icon_info }}
                              style={{
                                height: 22,
                                width: 22,
                                resizeMode: "contain",
                                tintColor:
                                  ThemeManager.colors.inactiveTextColor,
                              }}
                            />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            minHeight: 50,
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderWidth: 0.6,
                            borderRadius: 4,
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <TextInput
                              value={amount}
                              onChangeText={(value) => {
                                if (!value) {
                                  setBuyButtonEnabled(false);
                                  setCalculatedBuy("0.00");
                                  setCalculateAmountBuy("1");
                                }
                                var validNumber = new RegExp(/^\d*\.?\d*$/);
                                let overAllLimit = parseFloat(
                                  fundsLimitInfo?.limits?.over_all_limit_in_usd
                                );
                                console.log(
                                  "fundsLimitInfo?-==-=->>",
                                  fundsLimitInfo
                                );
                                const countTransaction =
                                  fundsLimitInfo?.transactions?.count;
                                let totalTransaction = parseFloat(
                                  fundsLimitInfo?.transactions?.total
                                );
                                let yearTransaction = parseFloat(
                                  fundsLimitInfo?.transactions?.year
                                );
                                let dayTransaction = parseFloat(
                                  fundsLimitInfo?.transactions?.h24
                                );
                                let dailyLimitUSD = parseFloat(
                                  fundsLimitInfo?.limits?.daily_limit_in_usd
                                );
                                if (validNumber.test(value)) {
                                  setAmount(value);
                                  setCalculatedBuy(
                                    parseFloat(usdRateFiat) * parseFloat(value)
                                  );
                                  let val =
                                    parseFloat(usdRate) * parseFloat(value);
                                  // if (parseFloat(coinBalance) >= value) {
                                  // if (
                                  //   value >= parseFloat(minAmount) &&
                                  //   value <= parseFloat(maxAmount)
                                  // ) {
                                  if (tierStatus == "tier_1") {
                                    let totalAmount =
                                      parseFloat(val) +
                                      parseFloat(totalTransaction);

                                    if (
                                      1 * totalAmount > 1 * overAllLimit ||
                                      countTransaction > 2
                                    ) {
                                      Singleton.getInstance().showError(
                                        "Limit exceeded. Upgrade to KYC tier 2."
                                      );
                                    } else {
                                      setBuyButtonEnabled(true);
                                    }
                                  } else if (tierStatus == "tier_2") {
                                    let totalAmount =
                                      parseFloat(val) +
                                      parseFloat(yearTransaction);

                                    if (1 * totalAmount > 1 * overAllLimit) {
                                      Singleton.getInstance().showError(
                                        "Limit exceeded. Upgrade to KYC tier 3."
                                      );
                                    } else {
                                      setBuyButtonEnabled(true);
                                    }
                                  } else if (tierStatus == "tier_3") {
                                    let totalAmount =
                                      parseFloat(val) +
                                      parseFloat(yearTransaction);

                                    let dailyLimit =
                                      parseFloat(val) +
                                      parseFloat(dayTransaction);
                                    if (1 * dailyLimit > 1 * dailyLimitUSD) {
                                      Singleton.getInstance().showError(
                                        "Daily limit exceeded."
                                      );
                                    } else {
                                      if (1 * totalAmount < 1 * overAllLimit) {
                                        setBuyButtonEnabled(true);
                                      } else {
                                        Singleton.getInstance().showError(
                                          `Your Annual limit is $${overAllLimit} exceeded.`
                                        );
                                        return;
                                      }
                                    }
                                  }
                                  debounceCalled(
                                    value,
                                    cryptoCurrency,
                                    fiatSelectedCurrency,
                                    paymentMethodId,
                                    minAmount,
                                    maxAmount
                                  );
                                  // }
                                  // else {
                                  //   // Singleton.getInstance().showError(
                                  //   //   `${strings.trade_tab.order_for_yours_selected}${minAmount} and ${maxAmount}`,
                                  //   // );
                                  // }
                                  // } else {
                                  //   Singleton.getInstance().showError(
                                  //     strings.buy_sell_market_screen
                                  //       .insufficient_balance,
                                  //   );
                                  // }
                                }
                              }}
                              onEndEditing={(e) => {
                                console.log(
                                  "e.onEndEditing.text here=-=-=",
                                  JSON.stringify(e.nativeEvent.text)
                                );
                              }}
                              onSubmitEditing={(e) => {
                                console.log(
                                  "e.nativeEvent.text here=-=-=",
                                  JSON.stringify(e.nativeEvent.text)
                                );
                              }}
                              keyboardType={"numeric"}
                              placeholder={"Enter Amount"}
                              placeholderTextColor={
                                ThemeManager.colors.anouncementtextColour
                              }
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                                paddingHorizontal: 14,
                              }}
                            />
                          </View>

                          <View
                            style={{
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                              // borderColor: ThemeManager.colors.textColor1,
                              // borderWidth: 0.8,
                              // borderRadius: 4,
                              alignSelf: "flex-end",
                              // marginRight: 5,
                              flex: 0.4,
                            }}
                          >
                            {banxaSupportedCurrenciesReducer?.banxaSupportedCurrenciesInfo !==
                              null &&
                              banxaSupportedCurrenciesReducer
                                ?.banxaSupportedCurrenciesInfo?.fiats?.length >
                                0 && (
                                <SelectDropdown
                                  key={"first"}
                                  data={
                                    banxaSupportedCurrenciesReducer
                                      ?.banxaSupportedCurrenciesInfo?.fiats
                                  }
                                  // defaultValueByIndex={3}
                                  onSelect={(selectedItem, index) => {
                                    console.log(
                                      "selectedItem=-=-=-=->>>>>",
                                      selectedItem,
                                      index
                                    );
                                    setCalculatedBuy("0.00");

                                    let fiatUsd = selectedItem.price;
                                    setUsdRateFiat(fiatUsd);
                                    setCalculatedBuy(
                                      parseFloat(fiatUsd) * parseFloat(amount)
                                    );
                                    // setAmount('');
                                    setFiatAmountOne("");
                                    setCryptoAmountOne("");
                                    setFiatSelectedCurrency(selectedItem.id);
                                    dispatch(
                                      banxaPaymentMethod(
                                        selectedItem.id,
                                        cryptoCurrency
                                      )
                                    )
                                      .then((resp) => {
                                        console.log(
                                          "banxaPaymentMethod response here=-=-=",
                                          JSON.stringify(resp)
                                        );
                                        setPaymentMethod(resp[0].name);
                                        setPaymentMethodId(resp[0].id);
                                        setMinAmount(
                                          resp[0]?.transaction_limits[0]?.min
                                        );
                                        setMaxAmount(
                                          resp[0]?.transaction_limits[0]?.max
                                        );
                                        // setAmount('');
                                        dispatch(
                                          banxaPriceConversion(
                                            selectedItem.id,
                                            cryptoCurrency,
                                            amount
                                          )
                                        )
                                          .then((response) => {
                                            console.log(
                                              "banxaPriceConversion response here=-=-=",
                                              JSON.stringify(response)
                                            );
                                            setPaymentMethodData(
                                              response?.data?.prices
                                            );
                                            response?.data?.prices.map(
                                              (item, index) => {
                                                if (
                                                  resp[0].id ==
                                                  item?.payment_method_id
                                                ) {
                                                  console.log(
                                                    "banxaPriceConversion response item=-map=-=",
                                                    JSON.stringify(item)
                                                  );
                                                  console.log(
                                                    "item?.payment_method_id response item=-=-=",
                                                    item?.payment_method_id
                                                  );
                                                  console.log(
                                                    "response[0].spot_price_fee=-=-=",
                                                    item?.spot_price_fee
                                                  );
                                                  setTotalFee(
                                                    item?.spot_price_fee
                                                  );
                                                  setYouWillGet(
                                                    item?.coin_amount
                                                  );
                                                  setCryptoAmount(
                                                    item?.coin_amount
                                                  );

                                                  setCryptoAmountCurrency(
                                                    item?.coin_code
                                                  );
                                                  setFiatAmount(
                                                    item?.fiat_amount
                                                  );
                                                  setFiatAmountCurrency(
                                                    item?.fiat_code
                                                  );
                                                }
                                              }
                                            );
                                          })
                                          .catch((err) => {});
                                      })
                                      .catch((err) => {});
                                    setSelectedPayment(0);
                                    //
                                  }}
                                  // buttonStyle={styles.dropdown3BtnStyle}
                                  buttonStyle={{
                                    width: "100%",
                                    borderBottomRightRadius: 4,
                                    borderTopRightRadius: 4,
                                    height: 49,
                                    alignSelf: "flex-end",
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                  }}
                                  renderCustomizedButtonChild={(
                                    selectedItem,
                                    index
                                  ) => {
                                    console.log(
                                      "selectedItem=-=-=-",
                                      selectedItem
                                    );
                                    return (
                                      <View
                                        style={[
                                          styles.dropdown3BtnChildStyle,
                                          // {
                                          //   backgroundColor:
                                          //     ThemeManager.colors.Depositbtn,
                                          // },
                                        ]}
                                      >
                                        <Image
                                          source={{
                                            uri:
                                              selectedItem?.icon != null
                                                ? selectedItem?.icon
                                                : fiatSelected?.icon,
                                          }}
                                          style={{
                                            height: 20,
                                            width: 20,
                                            resizeMode: "contain",
                                            // tintColor: ThemeManager.colors.textColor1,
                                            // tintColor: 'black',
                                          }}
                                        />
                                        <Text
                                          style={[
                                            styles.dropdown3BtnTxt,
                                            {
                                              color:
                                                ThemeManager.colors.textColor1,
                                            },
                                          ]}
                                        >
                                          {selectedItem
                                            ? selectedItem.name.toUpperCase()
                                            : fiatSelected?.name.toUpperCase()}
                                        </Text>

                                        <Image
                                          source={{ uri: Images.icon_dropDown }}
                                          style={{
                                            height: 15,
                                            width: 15,
                                            resizeMode: "contain",
                                            tintColor:
                                              ThemeManager.colors.textColor1,
                                            // tintColor: 'black',
                                          }}
                                        />
                                      </View>
                                    );
                                  }}
                                  // dropdownStyle={styles.dropdown3DropdownStyle}
                                  dropdownStyle={[
                                    // styles.dropdown3DropdownStyle,
                                    {
                                      backgroundColor:
                                        ThemeManager.colors.tabBackground,
                                    },
                                  ]}
                                  // rowStyle={styles.dropdown3RowStyle}
                                  rowStyle={[
                                    // styles.dropdown3RowStyle,
                                    {
                                      backgroundColor:
                                        ThemeManager.colors.tabBackground,
                                    },
                                  ]}
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
                                            // flexDirection: 'row',
                                            // justifyContent: 'flex-start',
                                            // justifyContent: 'center',
                                            // alignItems: 'flex-start',
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                            alignItems: "center",

                                            paddingHorizontal: 15,
                                            paddingVertical: 10,
                                          }}
                                        >
                                          <Image
                                            source={{
                                              uri: item?.icon,
                                            }}
                                            style={{
                                              height: 20,
                                              width: 20,
                                              resizeMode: "contain",
                                              // tintColor: ThemeManager.colors.textColor1,
                                              // tintColor: 'black',
                                            }}
                                          />
                                          <Text
                                            style={[
                                              styles.dropdown3RowTxt,
                                              {
                                                color:
                                                  ThemeManager.colors
                                                    .textColor1,
                                              },
                                            ]}
                                          >
                                            {item?.name.toUpperCase()}
                                          </Text>
                                        </View>
                                      </>
                                    );
                                  }}
                                />
                              )}
                          </View>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              color: ThemeManager.colors.selectedTextColor,
                              fontSize: 10,
                              fontFamily: Fonts.regular,
                              marginVertical: 5,
                            }}
                          >
                            {"$"}
                            {calculatedBuy
                              ? parseFloat(calculatedBuy).toFixed(2)
                              : "0"}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.i_want_to_buy}
                        </Text>
                        <View
                          style={{
                            borderRadius: 4,
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderWidth: 0.6,
                            flex: 1,
                            // padding: 1,
                            // paddingHorizontal: 5,
                            height: 50,
                            width: "70%",
                          }}
                        >
                          {banxaSupportedCurrenciesReducer?.banxaSupportedCurrenciesInfo !==
                            null && (
                            <SelectDropdown
                              key={"second"}
                              data={
                                banxaSupportedCurrenciesReducer
                                  ?.banxaSupportedCurrenciesInfo?.coins
                              }
                              // defaultValueByIndex={3}
                              onSelect={(selectedItem, index) => {
                                console.log(
                                  "selectedItem=-=-=-=>>>",
                                  selectedItem,
                                  index
                                );
                                setSelectedPayment(0);
                                // setAmount('');
                                setCryptoSelected(selectedItem);
                                setCryptoCurrency(selectedItem.id);
                                // let usdPrice = getUsdPrice(selectedItem.id);
                                // setUsdRate(usdPrice?.price);
                                let usdPrice = selectedItem?.price;

                                setUsdRate(usdPrice);
                                dispatch(
                                  banxaSupportedNetwork("buy", selectedItem.id)
                                )
                                  .then((res) => {
                                    console.log(
                                      "banxaSupportedNetwork buy=-=++++++-=---",
                                      JSON.stringify(res)
                                    );
                                    setNetworkList(res);
                                    setSelectedNetwork(res[0]);
                                    setAddress(res[0].address);
                                  })
                                  .catch((err) => {});
                                // dispatch(
                                //   getCoinAddress(
                                //     selectedItem.id,
                                //     selectedNetwork,
                                //   ),
                                // );
                                dispatch(
                                  banxaPaymentMethod(
                                    fiatSelectedCurrency,
                                    selectedItem.id
                                  )
                                )
                                  .then((resp) => {
                                    console.log(
                                      "banxaPaymentMethod response here=-=-=",
                                      JSON.stringify(resp)
                                    );
                                    setPaymentMethod(resp[0].name);
                                    setPaymentMethodId(resp[0].id);
                                    setMinAmount(
                                      resp[0]?.transaction_limits[0]?.min
                                    );
                                    setMaxAmount(
                                      resp[0]?.transaction_limits[0]?.max
                                    );
                                    // setMinAmount(
                                    //   resp[0]?.transaction_limits[0]?.min,
                                    // );
                                    // setMaxAmount(
                                    //   resp[0]?.transaction_limits[0]?.max,
                                    // );
                                    // setAmount('');
                                    setFiatAmountOne("");
                                    setCryptoAmountOne("");
                                    dispatch(
                                      banxaPriceConversion(
                                        fiatSelectedCurrency,
                                        selectedItem.id,
                                        amount
                                      )
                                    )
                                      .then((response) => {
                                        console.log(
                                          "banxaPriceConversion response here=-=-=",
                                          JSON.stringify(response)
                                        );
                                        setPaymentMethodData(
                                          response?.data?.prices
                                        );
                                        response?.data?.prices.map(
                                          (item, index) => {
                                            if (
                                              resp[0].id ==
                                              item?.payment_method_id
                                            ) {
                                              console.log(
                                                "banxaPriceConversion response item=-map=-=",
                                                JSON.stringify(item)
                                              );
                                              console.log(
                                                "item?.payment_method_id response item=-=-=",
                                                item?.payment_method_id
                                              );
                                              console.log(
                                                "response[0].spot_price_fee=-=-=",
                                                item?.spot_price_fee
                                              );
                                              setTotalFee(item?.spot_price_fee);
                                              setYouWillGet(item?.coin_amount);
                                              setCryptoAmount(
                                                item?.coin_amount
                                              );
                                              setCryptoAmountCurrency(
                                                item?.coin_code
                                              );

                                              setFiatAmount(item?.fiat_amount);
                                              setFiatAmountCurrency(
                                                item?.fiat_code
                                              );
                                            }
                                          }
                                        );
                                      })
                                      .catch((err) => {});
                                  })
                                  .catch((err) => {});
                                console.log(
                                  "selectedItem.networks=-=-=-=>>>",
                                  selectedItem.networks
                                );
                                console.log(
                                  "selectedItem.networks[0]-=>>>",
                                  selectedItem.networks[0]
                                );
                                // setSelectedNetwork(
                                //   selectedItem.networks[0].name,
                                // );
                              }}
                              // buttonStyle={styles.dropdown3BtnStyle}
                              buttonStyle={{
                                // marginTop: 5,
                                // marginBottom: 5,
                                width: "100%",
                                marginLeft: 8,
                                // marginHorizontal: 5,
                                borderRadius: 4,
                                height: 48,
                                backgroundColor:
                                  ThemeManager.colors.tabBackground,
                                alignItems: "center",
                                justifyContent: "center",
                                // alignSelf: 'flex-end',
                                // marginVertical: 10,
                                // backgroundColor: ThemeManager.colors.Depositbtn,
                              }}
                              renderCustomizedButtonChild={(
                                selectedItem,
                                index
                              ) => {
                                console.log("selectedItem=-=-=-", selectedItem);
                                return (
                                  <View
                                    style={[
                                      styles.dropdown3BtnChildStyle,
                                      // {
                                      //   backgroundColor:
                                      //     ThemeManager.colors.Depositbtn,
                                      // },
                                    ]}
                                  >
                                    <Image
                                      source={{
                                        uri:
                                          selectedItem?.icon != null
                                            ? selectedItem?.icon
                                            : cryptoSelected?.icon,
                                      }}
                                      style={{
                                        height: 20,
                                        width: 20,
                                        resizeMode: "contain",
                                        // tintColor: ThemeManager.colors.textColor1,
                                        // tintColor: 'black',
                                      }}
                                    />
                                    <Text
                                      style={[
                                        styles.dropdown3BtnTxt,
                                        {
                                          color: ThemeManager.colors.textColor1,
                                        },
                                      ]}
                                    >
                                      {selectedItem
                                        ? selectedItem.name.toUpperCase()
                                        : cryptoSelected?.name.toUpperCase()}
                                    </Text>

                                    <Image
                                      source={{ uri: Images.icon_dropDown }}
                                      style={{
                                        height: 15,
                                        width: 15,
                                        resizeMode: "contain",
                                        tintColor:
                                          ThemeManager.colors.textColor1,
                                        // tintColor: 'black',
                                      }}
                                    />
                                  </View>
                                );
                              }}
                              // dropdownStyle={styles.dropdown3DropdownStyle}
                              dropdownStyle={[
                                // styles.dropdown3DropdownStyle,
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
                              // rowStyle={styles.dropdown3RowStyle}
                              rowStyle={[
                                // styles.dropdown3RowStyle,
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
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
                                        // flexDirection: 'row',
                                        // justifyContent: 'flex-start',
                                        // justifyContent: 'center',
                                        // alignItems: 'flex-start',
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",

                                        paddingHorizontal: 15,
                                        paddingVertical: 10,
                                      }}
                                    >
                                      <Image
                                        source={{
                                          uri: item?.icon,
                                        }}
                                        style={{
                                          height: 20,
                                          width: 20,
                                          resizeMode: "contain",
                                          // tintColor: ThemeManager.colors.textColor1,
                                          // tintColor: 'black',
                                        }}
                                      />
                                      <Text
                                        style={[
                                          styles.dropdown3RowTxt,
                                          {
                                            color:
                                              ThemeManager.colors.textColor1,
                                          },
                                        ]}
                                      >
                                        {item?.name.toUpperCase()}
                                      </Text>
                                    </View>
                                  </>
                                );
                              }}
                            />
                          )}
                        </View>

                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.select_network}
                        </Text>
                        <View
                          style={{
                            borderRadius: 4,
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderWidth: 0.6,
                            flex: 1,
                            height: 50,
                            width: "70%",
                            // padding: 1,
                            // paddingHorizontal: 5,
                          }}
                        >
                          {networkList !== null && (
                            <SelectDropdown
                              key={"third"}
                              data={networkList}
                              // defaultValueByIndex={3}
                              onSelect={(selectedItem, index) => {
                                console.log(
                                  "selectedItem=-=-=00000-0>>>",
                                  selectedItem
                                );
                                setSelectedPayment(0);

                                // setSelectedNetwork(selectedItem);
                                // dispatch(
                                //   getCoinAddress(cryptoCurrency, selectedItem),
                                // );
                                dispatch(
                                  banxaSupportedNetwork("buy", cryptoCurrency)
                                )
                                  .then((res) => {
                                    console.log(
                                      "banxaSupportedNetwork buy=-=-=---==---",
                                      JSON.stringify(res)
                                    );
                                    setNetworkList(res);
                                    setSelectedNetwork(res[0]);
                                    setAddress(res[0].address);
                                  })
                                  .catch((err) => {});
                              }}
                              // buttonStyle={styles.dropdown3BtnStyle}
                              buttonStyle={{
                                // marginTop: 5,
                                // marginBottom: 5,
                                width: "100%",
                                marginLeft: 8,
                                // marginHorizontal: 5,
                                height: 48,
                                // backgroundColor: 'white',
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 4,
                                // alignSelf: 'flex-end',
                                // marginVertical: 10,
                                // marginTop: 1,
                                backgroundColor:
                                  ThemeManager.colors.tabBackground,
                              }}
                              renderCustomizedButtonChild={(
                                selectedItem,
                                index
                              ) => {
                                console.log(
                                  "selectedItem=++++++++-=-=-",
                                  selectedItem
                                );
                                console.log(
                                  "selectedNetwork=++++++++-=-=-",
                                  selectedNetwork
                                );
                                return (
                                  <View
                                    style={[
                                      styles.dropdown3BtnChildStyle,
                                      // {
                                      //   backgroundColor: ThemeManager.colors.Depositbtn,
                                      // },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.dropdown3BtnTxt,
                                        {
                                          color: ThemeManager.colors.textColor1,
                                        },
                                      ]}
                                    >
                                      {selectedItem
                                        ? selectedItem?.name?.toUpperCase()
                                        : selectedNetwork?.name?.toUpperCase()}
                                    </Text>

                                    <Image
                                      source={{ uri: Images.icon_dropDown }}
                                      style={{
                                        height: 15,
                                        width: 15,
                                        resizeMode: "contain",
                                        tintColor:
                                          ThemeManager.colors.textColor1,
                                        // tintColor: 'black',
                                      }}
                                    />
                                  </View>
                                );
                              }}
                              // dropdownStyle={styles.dropdown3DropdownStyle}
                              dropdownStyle={[
                                // styles.dropdown3DropdownStyle,
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
                              // rowStyle={styles.dropdown3RowStyle}
                              rowStyle={[
                                // styles.dropdown3RowStyle,
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
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
                                        // flexDirection: 'row',
                                        // justifyContent: 'flex-start',
                                        // justifyContent: 'center',
                                        // alignItems: 'flex-start',
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",

                                        paddingHorizontal: 15,
                                        paddingVertical: 10,
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.dropdown3RowTxt,
                                          {
                                            color:
                                              ThemeManager.colors.textColor1,
                                          },
                                        ]}
                                      >
                                        {item?.name?.toUpperCase()}
                                      </Text>
                                    </View>
                                  </>
                                );
                              }}
                            />
                          )}
                        </View>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.address}
                        </Text>
                        <View
                          style={{
                            // height: 50,
                            minHeight: 50,
                            width: "100%",
                            justifyContent: "center",
                            // alignItems: 'center',
                            borderWidth: 0.6,
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 15,
                              fontFamily: Fonts.bold,
                              paddingHorizontal: 10,
                              paddingVertical: 10,
                              textAlign: "left",
                            }}
                          >
                            {address ? address : "Loading..."}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.select_payment_method}
                        </Text>
                        {banxaPaymentMethodReducer?.banxaPaymentMethodInfo !=
                          null && (
                          <FlatList
                            keyboardShouldPersistTaps={"handled"}
                            data={
                              banxaPaymentMethodReducer?.banxaPaymentMethodInfo
                            }
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{
                              flexGrow: 1,
                              borderTopLeftRadius: 30,
                              borderTopRightRadius: 30,
                            }}
                            renderItem={({ item, index }) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelectedPayment(index);
                                    setPaymentMethod(item?.name);
                                    setPaymentMethodId(item?.id);
                                    // setPaymentMethodData(response?.data?.prices);
                                    console.log(
                                      "paymentMethodData=-=-----=-->>>",
                                      paymentMethodData
                                    );
                                    console.log("item=-=-----=-->>>", item);

                                    paymentMethodData.map((value, index) => {
                                      if (
                                        item?.id == value?.payment_method_id
                                      ) {
                                        console.log(
                                          "banxaPriceConversion response item=-map=-=",
                                          JSON.stringify(value)
                                        );
                                        console.log(
                                          "item?.payment_method_id response item=-=-=",
                                          value.payment_method_id
                                        );
                                        console.log(
                                          "response[0].spot_price_fee=-=-=",
                                          value.spot_price_fee
                                        );
                                        setTotalFee(value?.spot_price_fee);
                                        setYouWillGet(value?.coin_amount);
                                        setCryptoAmount(value?.coin_amount);
                                        setCryptoAmountCurrency(
                                          value?.coin_code
                                        );
                                        setFiatAmount(value?.fiat_amount);
                                        setFiatAmountCurrency(value?.fiat_code);
                                      }
                                    });
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderColor:
                                      ThemeManager.colors.anouncementtextColour,
                                    borderWidth: 0.8,
                                    borderRadius: 4,
                                    padding: 12,
                                    marginBottom: 15,
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View
                                      style={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: 10,
                                        borderWidth: 0.6,
                                        borderColor:
                                          ThemeManager.colors
                                            .anouncementtextColour,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <View
                                        style={{
                                          backgroundColor:
                                            selectedPayment == index
                                              ? ThemeManager.colors
                                                  .selectedTextColor
                                              : null,
                                          height: 12,
                                          width: 12,
                                          borderRadius: 6,
                                        }}
                                      />
                                    </View>
                                    <Text
                                      style={{
                                        color: ThemeManager.colors.textColor1,
                                        fontSize: 14,
                                        fontFamily: Fonts.regular,
                                        marginLeft: 10,
                                      }}
                                    >
                                      {item?.name}
                                    </Text>
                                  </View>
                                  <View>
                                    <Image
                                      source={{ uri: item?.logo_url }}
                                      style={{
                                        height: 30,
                                        width: 40,
                                        resizeMode: "contain",
                                      }}
                                    />
                                  </View>
                                </TouchableOpacity>
                              );
                            }}
                          />
                        )}
                        <View style={{ marginTop: 10 }}>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.trade_tab.payment_method}
                            </Text>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color: ThemeManager.colors.textColor1,
                                  fontWeight: "700",
                                },
                              ]}
                            >
                              {paymentMethod}
                            </Text>
                          </View>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.trade_tab.total_including_fee}
                            </Text>
                            {fiatAmountCurrency ? (
                              <Text
                                style={[
                                  styles.textStyle,
                                  { color: ThemeManager.colors.textColor1 },
                                ]}
                              >
                                {amount ? calculateAmountBuy : 0}{" "}
                                {fiatAmountCurrency}
                              </Text>
                            ) : null}
                          </View>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.trade_tab.price}
                            </Text>
                            {fiatAmountCurrency ? (
                              <Text
                                style={[
                                  styles.textStyle,
                                  { color: ThemeManager.colors.textColor1 },
                                ]}
                              >
                                {calculateAmountBuy
                                  ? parseFloat(fiatAmount) /
                                    parseFloat(calculateAmountBuy)
                                  : parseFloat(fiatAmount) / 1}{" "}
                                {fiatAmountCurrency + " = "}
                                {calculateAmountBuy
                                  ? parseFloat(cryptoAmount) /
                                    parseFloat(calculateAmountBuy)
                                  : parseFloat(cryptoAmount) / 1}{" "}
                                {cryptoAmountCurrency}
                              </Text>
                            ) : null}
                          </View>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.spot.you_will_get}
                            </Text>
                            {fiatAmountCurrency ? (
                              <Text
                                style={[
                                  styles.textStyle,
                                  { color: ThemeManager.colors.textColor1 },
                                ]}
                              >
                                {/* {fiatAmount +
                                  ' ' +
                                  fiatAmountCurrency +
                                  ' = ' +
                                  cryptoAmount +
                                  ' ' +
                                  cryptoAmountCurrency} */}
                                {cryptoAmount + " " + cryptoAmountCurrency}
                              </Text>
                            ) : null}
                            {/* <Text
                              style={[
                                styles.textStyle,
                                {color: ThemeManager.colors.textColor1},
                              ]}>
                              {youWillGet}
                            </Text> */}
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setSelectTerms(!selectTerms);
                          }}
                          style={{
                            height: 40,
                            width: 40,
                            justifyContent: "flex-end",
                            alignItems: "center",
                            // marginTop: 8,
                          }}
                        >
                          <View
                            style={{
                              height: 18,
                              width: 18,
                              borderColor: ThemeManager.colors.textColor1,
                              borderWidth: 0.8,
                              borderRadius: 4,

                              marginRight: 15,
                            }}
                          >
                            {selectTerms && (
                              <Image
                                source={{ uri: Images.icon_checked }}
                                style={{
                                  height: 15,
                                  width: 15,
                                  resizeMode: "contain",
                                  tintColor: ThemeManager.colors.textColor1,
                                }}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            // alignSelf: 'center',
                            marginBottom: 10,
                            marginTop: 30,
                            marginLeft: -10,
                          }}
                          onPress={() =>
                            Linking.openURL(
                              "https://banxa.com/wp-content/uploads/2022/06/Customer-Terms-and-Conditions-1-July-2022-1.pdf"
                            )
                          }
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              // textDecorationLine: 'underline',
                            }}
                          >
                            {strings.trade_tab.i_agree_with}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {buyButtonEnabled && selectTerms ? (
                        <TouchableOpacity
                          disabled={false}
                          onPress={() => {
                            console.log(
                              "amount || amount.length < 0=-=-",
                              amount
                            );
                            console.log(
                              "amount || amount.length < 0=-=-",
                              amount.length
                            );

                            if (amount === "" || amount.length == 0) {
                              Singleton.getInstance().showError(
                                "Please enter amount"
                              );
                            } else if (address == null || address.length < 0) {
                              Singleton.getInstance().showError(
                                "Address not found"
                              );
                            } else {
                              console.log(
                                "=-=-=-=>>>>>selectedNetwork?.code",
                                selectedNetwork?.code
                              );
                              dispatch(
                                banxaBuyCrypto(
                                  fiatSelectedCurrency,
                                  cryptoCurrency,
                                  address,
                                  "buy",
                                  selectedNetwork?.code,
                                  amount,
                                  paymentMethodId
                                )
                              )
                                .then((response) => {
                                  console.log(
                                    "banxaBuyCrypto url response-=-=-=-=->>>",
                                    JSON.stringify(response)
                                  );
                                  setBuyOrderId(response?.data.order.id);
                                  setWebUrl(response?.data.order.checkout_url);
                                  setShowWeb(true);
                                })
                                .catch((err) => {
                                  console.log(
                                    "banxaBuyCrypto url err-=-=-=-=->>>",
                                    JSON.stringify(err)
                                  );
                                });
                            }
                          }}
                          style={[
                            styles.buyBtn,
                            {
                              backgroundColor:
                                buyButtonEnabled && selectTerms
                                  ? ThemeManager.colors.selectedTextColor
                                  : "#60B4B977",
                            },
                          ]}
                        >
                          <Text
                            style={{ color: ThemeManager.colors.textColor }}
                          >
                            {strings.trade_tab.buy_now}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          disabled={true}
                          style={[
                            styles.buyBtn,
                            {
                              backgroundColor:
                                buyButtonEnabled && selectTerms
                                  ? ThemeManager.colors.selectedTextColor
                                  : "#60B4B977",
                            },
                          ]}
                        >
                          <Text
                            style={{ color: ThemeManager.colors.textColor }}
                          >
                            {strings.trade_tab.buy_now}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <View
                      style={{
                        marginHorizontal: 20,
                        marginVertical: 20,
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 14,
                              fontFamily: Fonts.bold,
                            }}
                          >
                            {strings.trade_tab.i_want_to_spend}
                          </Text>
                          <TouchableOpacity
                            style={{
                              height: 30,
                              width: 30,
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                            onPress={() => {
                              setshowFundLimit(!showFundLimit);
                            }}
                          >
                            <Image
                              // source={{uri: Images.icon_dropDown}}
                              source={{ uri: Images.icon_info }}
                              style={{
                                height: 22,
                                width: 22,
                                resizeMode: "contain",
                                tintColor:
                                  ThemeManager.colors.inactiveTextColor,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            minHeight: 50,
                            // backgroundColor: 'yellow',
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderWidth: 0.6,
                            borderRadius: 4,
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <TextInput
                              value={amountSell}
                              onChangeText={(value) => {
                                console.log("minAmount=-=-=>>>0 ", minAmount);
                                if (!value) {
                                  setSellButtonEnabled(false);
                                  setCalculatedSell("0.00");
                                  setCalculateAmountSell("1");
                                  console.log("minAmount=-=-=>>>2", minAmount);
                                }
                                var validNumber = new RegExp(/^\d*\.?\d*$/);
                                let overAllLimit = parseFloat(
                                  fundsLimitInfo?.limits?.over_all_limit_in_usd
                                );
                                const countTransaction =
                                  fundsLimitInfo?.transactions?.count;
                                let totalTransaction = parseFloat(
                                  fundsLimitInfo?.transactions?.total
                                );
                                let yearTransaction = parseFloat(
                                  fundsLimitInfo?.transactions?.year
                                );
                                let dayTransaction = parseFloat(
                                  fundsLimitInfo?.transactions?.h24
                                );
                                let dailyLimitUSD = parseFloat(
                                  fundsLimitInfo?.limits?.daily_limit_in_usd
                                );
                                if (validNumber.test(value)) {
                                  setAmountSell(value);

                                  setCalculatedSell(
                                    parseFloat(value) * parseFloat(usdRate)
                                  );
                                  console.log(
                                    "maxAmount=-=-coinBalance",
                                    coinBalance
                                  );
                                  console.log(
                                    "maxAmount=-=-coinBalance1",
                                    coinBalance <= value
                                  );
                                  console.log(
                                    "maxAmount=-=-coinBalance2",
                                    coinBalance > value
                                  );
                                  let val =
                                    parseFloat(usdRate) * parseFloat(value);

                                  if (parseFloat(coinBalance) >= value) {
                                    // if (
                                    //   value >= parseFloat(minAmount) &&
                                    //   value <= parseFloat(maxAmount)
                                    // ) {
                                    if (tierStatus == "tier_1") {
                                      let totalAmount =
                                        parseFloat(val) +
                                        parseFloat(totalTransaction);

                                      if (
                                        1 * totalAmount > 1 * overAllLimit ||
                                        countTransaction > 2
                                      ) {
                                        Singleton.getInstance().showError(
                                          "Limit exceeded. Upgrade to KYC tier 2."
                                        );
                                      } else {
                                        setSellButtonEnabled(true);
                                      }
                                    } else if (tierStatus == "tier_2") {
                                      let totalAmount =
                                        parseFloat(val) +
                                        parseFloat(yearTransaction);

                                      if (1 * totalAmount > 1 * overAllLimit) {
                                        Singleton.getInstance().showError(
                                          "Limit exceeded. Upgrade to KYC tier 3."
                                        );
                                      } else {
                                        setSellButtonEnabled(true);
                                      }
                                    } else if (tierStatus == "tier_3") {
                                      let totalAmount =
                                        parseFloat(val) +
                                        parseFloat(yearTransaction);
                                      let dailyLimit =
                                        parseFloat(val) +
                                        parseFloat(dayTransaction);
                                      if (1 * dailyLimit > 1 * dailyLimitUSD) {
                                        Singleton.getInstance().showError(
                                          "Daily limit exceeded."
                                        );
                                      } else {
                                        if (
                                          1 * totalAmount <
                                          1 * overAllLimit
                                        ) {
                                          setSellButtonEnabled(true);
                                        } else {
                                          Singleton.getInstance().showError(
                                            `Your Annual limit is $${overAllLimit} exceeded.`
                                          );
                                          return;
                                        }
                                      }
                                    }
                                    console.log(
                                      "minAmount=-=-=>>>1",
                                      minAmount
                                    );
                                    debounceCalledSell(
                                      value,
                                      cryptoCurrency,
                                      fiatSelectedCurrency,
                                      paymentMethodId,
                                      minAmount,
                                      maxAmount
                                    );
                                    // } else {
                                    //   // Singleton.getInstance().showError(
                                    //   //   `${strings.trade_tab.order_for_yours_selected}${minAmount} and ${maxAmount}`,
                                    //   // );
                                    // }
                                  } else {
                                    Singleton.getInstance().showError(
                                      strings.buy_sell_market_screen
                                        .insufficient_balance
                                    );
                                  }
                                }
                              }}
                              onEndEditing={(e) => {
                                console.log(
                                  "e.onEndEditing.text here=-=-=",
                                  JSON.stringify(e.nativeEvent.text)
                                );
                              }}
                              onSubmitEditing={(e) => {
                                console.log(
                                  "e.nativeEvent.text here=-=-=",
                                  JSON.stringify(e.nativeEvent.text)
                                );
                              }}
                              keyboardType={"numeric"}
                              placeholder={"Enter Amount"}
                              placeholderTextColor={
                                ThemeManager.colors.anouncementtextColour
                              }
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                                paddingHorizontal: 14,
                              }}
                            />
                          </View>

                          <View
                            style={{
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                              // borderColor: ThemeManager.colors.textColor1,
                              // borderWidth: 0.8,
                              // borderRadius: 4,
                              alignSelf: "flex-end",

                              // marginRight: 5,
                              flex: 0.7,
                            }}
                          >
                            {banxaSupportedCurrenciesSellReducer?.banxaSupportedCurrenciesSellInfo !==
                              null &&
                              banxaSupportedCurrenciesSellReducer
                                ?.banxaSupportedCurrenciesSellInfo?.coins
                                ?.length > 0 && (
                                <SelectDropdown
                                  key={"fourth"}
                                  data={
                                    banxaSupportedCurrenciesSellReducer
                                      ?.banxaSupportedCurrenciesSellInfo?.coins
                                  }
                                  // defaultValueByIndex={3}
                                  onSelect={(selectedItem, index) => {
                                    console.log(
                                      "selectedItem=-=-=-=-sell>>>>>",
                                      selectedItem,
                                      index
                                    );
                                    // setAmountSell('');
                                    // setFiatSelectedCurrency(selectedItem.id);
                                    // setCalculateAmountSell('1');
                                    setCalculatedSell(
                                      parseFloat(amountSell) *
                                        parseFloat(selectedItem.price)
                                    );
                                    setCryptoSelected(selectedItem);
                                    setCryptoCurrency(selectedItem.id);
                                    let coinName = selectedItem.id;
                                    dispatch(getCurrencyDetails({ coinName }))
                                      .then((response) => {
                                        console.log(
                                          "getCurrencyDetails on selected response here=-=-=",
                                          JSON.stringify(response),
                                          setCoinBalance(response?.balance)
                                        );
                                      })
                                      .catch((err) => {});
                                    dispatch(
                                      banxaPaymentMethod(
                                        selectedItem.id,
                                        fiatSelectedCurrency
                                      )
                                    )
                                      .then((resp) => {
                                        console.log(
                                          "banxaPaymentMethod response here=-=-=",
                                          JSON.stringify(resp)
                                        );
                                        setPaymentMethod(resp[0].name);
                                        setPaymentMethodId(resp[0].id);
                                        setMinAmount(
                                          resp[0]?.transaction_limits[0]?.min
                                        );
                                        setMaxAmount(
                                          resp[0]?.transaction_limits[0]?.max
                                        );
                                        // setAmountSell('');
                                        setFiatAmountOne("");
                                        setCryptoAmountOne("");
                                        if (
                                          parseFloat(coinBalance) >= amountSell
                                        ) {
                                          dispatch(
                                            banxaPriceConversion(
                                              selectedItem.id,
                                              fiatSelectedCurrency,
                                              amountSell
                                            )
                                          )
                                            .then((response) => {
                                              console.log(
                                                "banxaPriceConversion response here=-=-=",
                                                JSON.stringify(response)
                                              );
                                              setPaymentMethodData(
                                                response?.data?.prices
                                              );
                                              response?.data?.prices.map(
                                                (item, index) => {
                                                  if (
                                                    resp[0].id ==
                                                    item?.payment_method_id
                                                  ) {
                                                    console.log(
                                                      "banxaPriceConversion response item=-map=sell-=",
                                                      JSON.stringify(item)
                                                    );

                                                    setTotalFee(
                                                      item?.spot_price_fee
                                                    );
                                                    setYouWillGet(
                                                      item?.fiat_amount
                                                    );
                                                    setCryptoAmount(
                                                      item?.coin_amount
                                                    );
                                                    setCryptoAmountCurrency(
                                                      item?.coin_code
                                                    );

                                                    setFiatAmount(
                                                      item?.fiat_amount
                                                    );
                                                    setFiatAmountCurrency(
                                                      item?.fiat_code
                                                    );
                                                  }
                                                }
                                              );
                                            })
                                            .catch((err) => {});
                                        } else {
                                          dispatch(
                                            banxaPriceConversion(
                                              selectedItem.id,
                                              fiatSelectedCurrency,
                                              1
                                            )
                                          )
                                            .then((response) => {
                                              console.log(
                                                "banxaPriceConversion response here=-=-=",
                                                JSON.stringify(response)
                                              );
                                              setPaymentMethodData(
                                                response?.data?.prices
                                              );
                                              response?.data?.prices.map(
                                                (item, index) => {
                                                  if (
                                                    resp[0].id ==
                                                    item?.payment_method_id
                                                  ) {
                                                    console.log(
                                                      "banxaPriceConversion response item=-map=sell-=",
                                                      JSON.stringify(item)
                                                    );

                                                    setTotalFee(
                                                      item?.spot_price_fee
                                                    );
                                                    setYouWillGet(
                                                      item?.fiat_amount
                                                    );
                                                    setCryptoAmount(
                                                      item?.coin_amount
                                                    );
                                                    setCryptoAmountCurrency(
                                                      item?.coin_code
                                                    );

                                                    setFiatAmount(
                                                      item?.fiat_amount
                                                    );
                                                    setFiatAmountCurrency(
                                                      item?.fiat_code
                                                    );
                                                  }
                                                }
                                              );
                                            })
                                            .catch((err) => {});
                                        }
                                      })
                                      .catch((err) => {});
                                    setSelectedPayment(0);
                                    //
                                  }}
                                  // buttonStyle={styles.dropdown3BtnStyle}
                                  buttonStyle={{
                                    // marginTop: 5,
                                    // marginBottom: 5,
                                    width: "100%",
                                    borderTopRightRadius: 4,
                                    borderBottomRightRadius: 4,
                                    height: 49,
                                    alignSelf: "flex-end",
                                    // backgroundColor: 'red',
                                    // marginVertical: 10,
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                  }}
                                  renderCustomizedButtonChild={(
                                    selectedItem,
                                    index
                                  ) => {
                                    console.log(
                                      "selectedItem=-=-=-",
                                      selectedItem
                                    );
                                    return (
                                      <View
                                        style={[
                                          styles.dropdown3BtnChildStyle,
                                          // {
                                          //   backgroundColor: ThemeManager.colors.Depositbtn,
                                          // },
                                        ]}
                                      >
                                        <Image
                                          source={{
                                            uri:
                                              selectedItem?.icon != null
                                                ? selectedItem?.icon
                                                : cryptoSelected?.icon,
                                          }}
                                          style={{
                                            height: 20,
                                            width: 20,
                                            resizeMode: "contain",
                                            // tintColor: ThemeManager.colors.textColor1,
                                            // tintColor: 'black',
                                          }}
                                        />
                                        <Text
                                          style={[
                                            styles.dropdown3BtnTxt,
                                            {
                                              color:
                                                ThemeManager.colors.textColor1,
                                            },
                                          ]}
                                        >
                                          {selectedItem
                                            ? selectedItem.name.toUpperCase()
                                            : cryptoSelected?.name.toUpperCase()}
                                        </Text>

                                        <Image
                                          source={{ uri: Images.icon_dropDown }}
                                          style={{
                                            height: 15,
                                            width: 15,
                                            resizeMode: "contain",
                                            tintColor:
                                              ThemeManager.colors.textColor1,
                                            // tintColor: 'black',
                                          }}
                                        />
                                      </View>
                                    );
                                  }}
                                  // dropdownStyle={styles.dropdown3DropdownStyle}
                                  dropdownStyle={[
                                    // styles.dropdown3DropdownStyle,
                                    {
                                      backgroundColor:
                                        ThemeManager.colors.tabBackground,
                                    },
                                  ]}
                                  // rowStyle={styles.dropdown3RowStyle}
                                  rowStyle={[
                                    // styles.dropdown3RowStyle,
                                    {
                                      backgroundColor:
                                        ThemeManager.colors.tabBackground,
                                    },
                                  ]}
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
                                            // flexDirection: 'row',
                                            // justifyContent: 'flex-start',
                                            // justifyContent: 'center',
                                            // alignItems: 'flex-start',
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                            alignItems: "center",

                                            paddingHorizontal: 15,
                                            paddingVertical: 10,
                                          }}
                                        >
                                          <Image
                                            source={{
                                              uri: item?.icon,
                                            }}
                                            style={{
                                              height: 20,
                                              width: 20,
                                              resizeMode: "contain",
                                              // tintColor: ThemeManager.colors.textColor1,
                                              // tintColor: 'black',
                                            }}
                                          />
                                          <Text
                                            style={[
                                              styles.dropdown3RowTxt,
                                              {
                                                color:
                                                  ThemeManager.colors
                                                    .textColor1,
                                              },
                                            ]}
                                          >
                                            {item?.name.toUpperCase()}
                                          </Text>
                                        </View>
                                      </>
                                    );
                                  }}
                                />
                              )}
                          </View>
                        </View>
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                color: ThemeManager.colors.selectedTextColor,
                                fontSize: 10,
                                fontFamily: Fonts.regular,
                                marginVertical: 5,
                              }}
                            >
                              {"$"}
                              {calculatedSell
                                ? parseFloat(calculatedSell).toFixed(4)
                                : "0"}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 12,
                              textAlign: "right",
                              marginTop: 5,
                            }}
                          >
                            {strings.trade_tab.available_balance}: {coinBalance}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.i_want_to_buy}
                        </Text>
                        <View
                          style={{
                            borderRadius: 4,
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderWidth: 0.6,
                            flex: 1,
                            height: 50,
                            width: "70%",
                          }}
                        >
                          {banxaSupportedCurrenciesSellReducer?.banxaSupportedCurrenciesSellInfo !==
                            null && (
                            <SelectDropdown
                              key={"six"}
                              data={
                                banxaSupportedCurrenciesSellReducer
                                  ?.banxaSupportedCurrenciesSellInfo?.fiats
                              }
                              // defaultValueByIndex={3}
                              onSelect={(selectedItem, index) => {
                                console.log(
                                  "selectedItem.selectedItem=-=-=-=>>>",
                                  selectedItem
                                );
                                setSelectedPayment(0);
                                // setAmountSell('');

                                setFiatSelectedCurrency(selectedItem.id);
                                setFiatSelected(selectedItem);
                                setNetworkList(selectedItem.networks);

                                dispatch(
                                  banxaSupportedNetwork("sell", cryptoCurrency)
                                )
                                  .then((res) => {
                                    console.log(
                                      "selectedItem.selectedItem=-=-=-=>>>sell",
                                      res
                                    );
                                    setNetworkList(res);
                                    setSelectedNetwork(res[0]);
                                    setAddress(res[0].address);
                                  })
                                  .catch((err) => {});
                                dispatch(
                                  banxaPaymentMethod(
                                    cryptoCurrency,
                                    selectedItem.id
                                  )
                                )
                                  .then((resp) => {
                                    console.log(
                                      "selectedItem.selectedItem=-=-=-=>>>banxaPaymentMethod",
                                      resp
                                    );
                                    setPaymentMethod(resp[0].name);
                                    setPaymentMethodId(resp[0].id);
                                    setMinAmount(
                                      resp[0]?.transaction_limits[0]?.min
                                    );
                                    setMaxAmount(
                                      resp[0]?.transaction_limits[0]?.max
                                    );
                                    // setAmount('');
                                    setFiatAmountOne("");
                                    setCryptoAmountOne("");
                                    console.log(
                                      "selectedItem.selectedItem=-=-=-=>>>banxaPriceConversion",
                                      selectedItem.id,
                                      fiatSelectedCurrency
                                    );
                                    dispatch(
                                      banxaPriceConversion(
                                        selectedItem.id,
                                        fiatSelectedCurrency,
                                        amountSell
                                      )
                                    )
                                      .then((response) => {
                                        console.log(
                                          "selectedItem.selectedItem=-=-=-=>>>response",
                                          response
                                        );
                                        setPaymentMethodData(
                                          response?.data?.prices
                                        );
                                        response?.data?.prices.map(
                                          (item, index) => {
                                            if (
                                              resp[0].id ==
                                              item?.payment_method_id
                                            ) {
                                              setTotalFee(item?.spot_price_fee);
                                              setYouWillGet(item?.fiat_amount);
                                              setCryptoAmount(
                                                item?.coin_amount
                                              );

                                              setCryptoAmountCurrency(
                                                item?.coin_code
                                              );
                                              setFiatAmount(item?.fiat_amount);
                                              setFiatAmountCurrency(
                                                item?.fiat_code
                                              );
                                            }
                                          }
                                        );
                                      })
                                      .catch((err) => {});
                                  })
                                  .catch((err) => {});
                                console.log(
                                  "selectedItem.networks=-=-=-=>>>",
                                  selectedItem.networks
                                );
                              }}
                              buttonStyle={{
                                width: "100%",

                                height: 48,
                                borderRadius: 4,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  ThemeManager.colors.tabBackground,
                              }}
                              renderCustomizedButtonChild={(
                                selectedItem,
                                index
                              ) => {
                                return (
                                  <View style={[styles.dropdown3BtnChildStyle]}>
                                    <Image
                                      source={{
                                        uri:
                                          selectedItem?.icon != null
                                            ? selectedItem?.icon
                                            : fiatSelected?.icon,
                                      }}
                                      style={{
                                        height: 20,
                                        width: 20,
                                        resizeMode: "contain",
                                      }}
                                    />
                                    <Text
                                      style={[
                                        styles.dropdown3BtnTxt,
                                        {
                                          color: ThemeManager.colors.textColor1,
                                        },
                                      ]}
                                    >
                                      {selectedItem
                                        ? selectedItem.name.toUpperCase()
                                        : fiatSelected?.name.toUpperCase()}
                                    </Text>

                                    <Image
                                      source={{ uri: Images.icon_dropDown }}
                                      style={{
                                        height: 15,
                                        width: 15,
                                        resizeMode: "contain",
                                        tintColor:
                                          ThemeManager.colors.textColor1,
                                      }}
                                    />
                                  </View>
                                );
                              }}
                              dropdownStyle={[
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
                              rowStyle={[
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
                              renderCustomizedRowChild={(item, index) => {
                                return (
                                  <>
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        paddingHorizontal: 15,
                                        paddingVertical: 10,
                                      }}
                                    >
                                      <Image
                                        source={{
                                          uri: item?.icon,
                                        }}
                                        style={{
                                          height: 20,
                                          width: 20,
                                          resizeMode: "contain",
                                        }}
                                      />
                                      <Text
                                        style={[
                                          styles.dropdown3RowTxt,
                                          {
                                            color:
                                              ThemeManager.colors.textColor1,
                                          },
                                        ]}
                                      >
                                        {item?.name.toUpperCase()}
                                      </Text>
                                    </View>
                                  </>
                                );
                              }}
                            />
                          )}
                        </View>

                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.select_network}
                        </Text>
                        <View
                          style={{
                            borderRadius: 4,
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderWidth: 0.6,
                            flex: 1,
                            height: 50,
                            width: "70%",
                          }}
                        >
                          {networkList !== null && (
                            <SelectDropdown
                              key={"seven"}
                              data={networkList}
                              onSelect={(selectedItem, index) => {
                                setSelectedPayment(0);

                                setSelectedNetwork(selectedItem.name);
                              }}
                              buttonStyle={{
                                width: "100%",
                                borderRadius: 4,
                                height: 48,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  ThemeManager.colors.tabBackground,
                              }}
                              renderCustomizedButtonChild={(
                                selectedItem,
                                index
                              ) => {
                                console.log(
                                  "selectedItem=-=-=-selectedNetwork",
                                  selectedItem
                                );
                                return (
                                  <View style={[styles.dropdown3BtnChildStyle]}>
                                    <Text
                                      style={[
                                        styles.dropdown3BtnTxt,
                                        {
                                          color: ThemeManager.colors.textColor1,
                                        },
                                      ]}
                                    >
                                      {selectedItem
                                        ? selectedItem?.name?.toUpperCase()
                                        : selectedNetwork?.name?.toUpperCase()}
                                    </Text>

                                    <Image
                                      source={{ uri: Images.icon_dropDown }}
                                      style={{
                                        height: 15,
                                        width: 15,
                                        resizeMode: "contain",
                                        tintColor:
                                          ThemeManager.colors.textColor1,
                                      }}
                                    />
                                  </View>
                                );
                              }}
                              dropdownStyle={[
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
                              rowStyle={[
                                {
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                },
                              ]}
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

                                        paddingHorizontal: 15,
                                        paddingVertical: 10,
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.dropdown3RowTxt,
                                          {
                                            color:
                                              ThemeManager.colors.textColor1,
                                          },
                                        ]}
                                      >
                                        {item?.name?.toUpperCase()}
                                      </Text>
                                    </View>
                                  </>
                                );
                              }}
                            />
                          )}
                        </View>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.address}
                        </Text>
                        <View
                          style={{
                            minHeight: 50,
                            width: "100%",
                            justifyContent: "center",
                            borderWidth: 0.6,
                            borderColor:
                              ThemeManager.colors.anouncementtextColour,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 15,
                              fontFamily: Fonts.bold,
                              paddingHorizontal: 10,
                              paddingVertical: 10,
                              textAlign: "left",
                            }}
                          >
                            {address ? address : "Loading..."}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontSize: 14,
                            fontFamily: Fonts.bold,
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                        >
                          {strings.trade_tab.select_payment_method}
                        </Text>
                        {banxaPaymentMethodReducer?.banxaPaymentMethodInfo !=
                          null && (
                          <FlatList
                            keyboardShouldPersistTaps={"handled"}
                            data={
                              banxaPaymentMethodReducer?.banxaPaymentMethodInfo
                            }
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{
                              flexGrow: 1,
                              borderTopLeftRadius: 30,
                              borderTopRightRadius: 30,
                            }}
                            renderItem={({ item, index }) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelectedPayment(index);
                                    setPaymentMethod(item?.name);
                                    setPaymentMethodId(item?.id);

                                    paymentMethodData.map((value, index) => {
                                      if (item?.id == value.payment_method_id) {
                                        setTotalFee(value.spot_price_fee);
                                        setYouWillGet(value.coin_amount);
                                        setCryptoAmount(value.coin_amount);
                                        setCryptoAmountCurrency(
                                          value.coin_code
                                        );
                                        setFiatAmount(value.fiat_amount);
                                        setFiatAmountCurrency(value.fiat_code);
                                      }
                                    });
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderColor:
                                      ThemeManager.colors.anouncementtextColour,
                                    borderWidth: 0.8,
                                    borderRadius: 4,
                                    padding: 12,
                                    marginBottom: 15,
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View
                                      style={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: 10,
                                        borderWidth: 0.6,
                                        borderColor:
                                          ThemeManager.colors
                                            .anouncementtextColour,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <View
                                        style={{
                                          backgroundColor:
                                            selectedPayment == index
                                              ? ThemeManager.colors
                                                  .selectedTextColor
                                              : null,
                                          height: 12,
                                          width: 12,
                                          borderRadius: 6,
                                        }}
                                      />
                                    </View>
                                    <Text
                                      style={{
                                        color: ThemeManager.colors.textColor1,
                                        fontSize: 14,
                                        fontFamily: Fonts.regular,
                                        marginLeft: 10,
                                      }}
                                    >
                                      {item?.name}
                                    </Text>
                                  </View>
                                  <View>
                                    <Image
                                      source={{ uri: item?.logo_url }}
                                      style={{
                                        height: 30,
                                        width: 40,
                                        resizeMode: "contain",
                                      }}
                                    />
                                  </View>
                                </TouchableOpacity>
                              );
                            }}
                          />
                        )}
                        <View style={{ marginTop: 10 }}>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.trade_tab.payment_method}
                            </Text>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color: ThemeManager.colors.textColor1,
                                  fontWeight: "700",
                                },
                              ]}
                            >
                              {paymentMethod}
                            </Text>
                          </View>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.trade_tab.total_including_fee}
                            </Text>
                            <View>
                              {cryptoAmountCurrency ? (
                                <Text
                                  style={[
                                    styles.textStyle,
                                    { color: ThemeManager.colors.textColor1 },
                                  ]}
                                >
                                  {amountSell ? calculateAmountSell : 0}{" "}
                                  {cryptoAmountCurrency}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.trade_tab.price}
                            </Text>
                            {cryptoAmountCurrency ? (
                              <Text
                                style={[
                                  styles.textStyle,
                                  { color: ThemeManager.colors.textColor1 },
                                ]}
                              >
                                {calculateAmountSell
                                  ? parseFloat(cryptoAmount) /
                                    parseFloat(calculateAmountSell)
                                  : parseFloat(cryptoAmount) / 1}{" "}
                                {cryptoAmountCurrency + " = "}{" "}
                                {calculateAmountSell
                                  ? parseFloat(fiatAmount) /
                                    parseFloat(calculateAmountSell)
                                  : parseFloat(fiatAmount) / 1}
                                {" " + fiatAmountCurrency}
                              </Text>
                            ) : null}
                          </View>
                          <View style={styles.flexRow}>
                            <Text
                              style={[
                                styles.textStyle,
                                {
                                  color:
                                    ThemeManager.colors.anouncementtextColour,
                                },
                              ]}
                            >
                              {strings.spot.you_will_get}
                            </Text>
                            <Text
                              style={[
                                styles.textStyle,
                                { color: ThemeManager.colors.textColor1 },
                              ]}
                            >
                              {youWillGet} {fiatAmountCurrency}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setSelectTerms(!selectTerms);
                          }}
                          style={{
                            height: 40,
                            width: 40,
                            justifyContent: "flex-end",
                            alignItems: "center",
                            // marginTop: 8,
                          }}
                        >
                          <View
                            style={{
                              height: 18,
                              width: 18,
                              borderColor: ThemeManager.colors.textColor1,
                              borderWidth: 0.8,
                              borderRadius: 4,

                              marginRight: 15,
                            }}
                          >
                            {selectTerms && (
                              <Image
                                source={{ uri: Images.icon_checked }}
                                style={{
                                  height: 15,
                                  width: 15,
                                  resizeMode: "contain",
                                  tintColor: ThemeManager.colors.textColor1,
                                }}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            // alignSelf: 'center',
                            marginBottom: 10,
                            marginTop: 30,
                            marginLeft: -10,
                          }}
                          onPress={() =>
                            Linking.openURL(
                              "https://banxa.com/wp-content/uploads/2022/06/Customer-Terms-and-Conditions-1-July-2022-1.pdf"
                            )
                          }
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              // textDecorationLine: 'underline',
                            }}
                          >
                            {strings.trade_tab.i_agree_with}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {sellButtonEnabled && selectTerms ? (
                        <TouchableOpacity
                          disabled={false}
                          onPress={() => {
                            console.log(
                              "amount || amount.length < 0=-=-amountSell",
                              amountSell
                            );
                            console.log(
                              "amount || amount.length < 0=-=-",
                              amountSell.length
                            );
                            console.log(
                              "amount || amount.length < 0=-=-coinBalance",
                              coinBalance
                            );
                            console.log(
                              "amount || amount.length < 0=-=-coinBalance",
                              coinBalance
                            );
                            if (
                              parseFloat(coinBalance) >= parseFloat(amountSell)
                            ) {
                              if (
                                amountSell === "" ||
                                amountSell?.length == 0
                              ) {
                                Singleton.getInstance().showError(
                                  "Please enter amount"
                                );
                              } else {
                                console.log(
                                  "=-=-=-=>>>>>selectedNetwork?.codeSell",
                                  selectedNetwork?.code
                                );
                                dispatch(
                                  banxaBuyCrypto(
                                    cryptoCurrency,
                                    fiatSelectedCurrency,
                                    address,
                                    "sell",
                                    selectedNetwork?.code,
                                    amountSell,
                                    paymentMethodId
                                  )
                                )
                                  .then((response) => {
                                    setSellOrderId(response?.data.order.id);
                                    setWebUrl(
                                      response?.data.order.checkout_url
                                    );
                                    setShowWeb(true);
                                  })
                                  .catch((err) => {
                                    console.log(
                                      "banxaBuyCrypto url err-=-=sell-=-=->>>",
                                      JSON.stringify(err)
                                    );
                                  });
                              }
                            } else {
                              Singleton.getInstance().showError(
                                strings.buy_sell_market_screen
                                  .insufficient_balance
                              );
                            }

                            // }
                          }}
                          style={[
                            styles.buyBtn,
                            {
                              backgroundColor:
                                sellButtonEnabled && selectTerms
                                  ? ThemeManager.colors.selectedTextColor
                                  : "#60B4B977",
                            },
                          ]}
                        >
                          <Text
                            style={{ color: ThemeManager.colors.textColor }}
                          >
                            {strings.trade_tab.sell_now}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          disabled={true}
                          style={[
                            styles.buyBtn,
                            {
                              backgroundColor:
                                sellButtonEnabled && selectTerms
                                  ? ThemeManager.colors.selectedTextColor
                                  : "#60B4B977",
                            },
                          ]}
                        >
                          <Text
                            style={{ color: ThemeManager.colors.textColor }}
                          >
                            {strings.trade_tab.sell_now}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </>
              </View>
            </KeyboardAwareScrollView>
          </>
        )}
        <FundLimit
          textColor={{ color: ThemeManager.colors.textColor }}
          closePress={() => {
            setshowFundLimit(!showFundLimit);
          }}
          total={totalTransaction}
          annualTransaction={overAllLimit}
          dailyLimit={dailyLimitUSD}
          isRuleShow={showFundLimit}
          noOfTransaction={noOfTransaction}
          tierStatusValue={tierStatus}
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalPopUpVisible}
          onRequestClose={() => setModalPopUpVisible(false)}
        >
          <Wrap
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: "transparent" },
            ]}
            bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
          >
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
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
                    setModalPopUpVisible(false);
                  }}
                ></TouchableOpacity>
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.modalBox,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor1,
                      fontSize: 18,
                      fontFamily: Fonts.bold,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {strings.trade_tab.confirm_order}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      height: 1,
                      opacity: 0.2,
                      marginVertical: 10,
                      backgroundColor:
                        ThemeManager.colors.anouncementtextColour,
                    }}
                  ></View>
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor1,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {strings.trade_tab.to_address}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor1,
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                      }}
                    >
                      {".........................................."}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        copyToClipboard();
                      }}
                    >
                      <Image
                        source={{ uri: Images.icon_copypaste }}
                        style={{ height: 20, width: 20, resizeMode: "contain" }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor1,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      marginTop: 15,
                    }}
                  >
                    {strings.trade_tab.from_address}
                  </Text>
                  <View
                    style={{
                      height: 50,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      borderColor: ThemeManager.colors.anouncementtextColour,
                      borderWidth: 1,
                      opacity: 0.4,
                      borderRadius: 4,
                    }}
                  >
                    <TextInput
                      value={fromAddress}
                      onChangeText={(value) => {
                        setFromAddress(value);
                      }}
                      placeholder={strings.trade_tab.enter_address}
                      style={{
                        color: ThemeManager.colors.textColor1,
                        fontSize: 15,
                        fontFamily: Fonts.regular,
                        paddingHorizontal: 10,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor1,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      marginTop: 15,
                    }}
                  >
                    {strings.trade_tab.tx_id}
                  </Text>
                  <View
                    style={{
                      height: 50,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      borderColor: ThemeManager.colors.anouncementtextColour,
                      borderWidth: 1,
                      opacity: 0.4,
                      borderRadius: 4,
                    }}
                  >
                    <TextInput
                      value={trxHash}
                      onChangeText={(value) => {
                        setTrxHash(value);
                      }}
                      placeholder={strings.trade_tab.enter_trx}
                      style={{
                        color: ThemeManager.colors.textColor1,
                        fontSize: 15,
                        fontFamily: Fonts.regular,
                        paddingHorizontal: 10,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 50,
                      width: "100%",
                      borderRadius: 4,
                      marginTop: 30,
                      // backgroundColor: 'red',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // dispatch(
                        //   banxaconfirmSell(
                        //     sellOrderId,
                        //     trxHash,
                        //     walletAddress,
                        //     fromAddress,
                        //   ),
                        // )
                        //   .then(res => {
                        //     console.log('check response==-=-=->>>', res);
                        //     setModalPopUpVisible(false);
                        //   })
                        //   .catch(err => {});
                      }}
                      style={{
                        height: 40,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        marginRight: 20,
                        borderRadius: 4,
                        backgroundColor: ThemeManager.colors.selectedTextColor,
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 16,
                          fontFamily: Fonts.regular,
                        }}
                      >
                        {strings.trade_tab.submit}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setModalPopUpVisible(false);
                      }}
                      style={{
                        height: 40,
                        width: "100%",
                        paddingHorizontal: 20,
                        borderRadius: 4,

                        marginLeft: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: ThemeManager.colors.textRedColor,
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 16,
                          fontFamily: Fonts.regular,
                        }}
                      >
                        {strings.trade_tab.cancel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    setModalPopUpVisible(false);
                  }}
                ></TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </Wrap>
        </Modal>
      </Wrap>
    </>
  );
};

export default BuyCryptoBanxa;
