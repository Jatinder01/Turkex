/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Linking,
  Platform,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
// import styles from './AboutUsStyle';
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, CustomEmptyView, Header, Loader } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, Fonts, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import { strings } from "../../../../Localization";
import Singleton from "../../../Singleton";
import { useDispatch, useSelector } from "react-redux";

import * as constants from "../../../Constants";
import BorderLine from "../../common/BorderLine";
import SimpleHeader from "../../common/SimpleHeader";
import DeviceInfo from "react-native-device-info";
import Clipboard from "@react-native-clipboard/clipboard";
import { showMessage, hideMessage } from "react-native-flash-message";
import END_POINT from "../../../EndPoints";
import { CoinCultApi } from "../../../api/CoinCultApi";
import {
  getCardPaytendBalance,
  cardTopUp,
  getCurrencyConversionDetails,
  getCurrencyDetails,
  getCardFees,
} from "../../../Redux/Actions";
var _ = require("lodash");
const { height, width } = Dimensions.get("window");
let android_app_url =
  "https://play.google.com/store/apps/details?id=com.xchangemonster";
let ios_app_url = "https://apps.apple.com/in/app/xchange-monster/id1621071750";
const percentVal = [
  { id: 1, val: "25%", per: "0.25" },
  { id: 1, val: "50%", per: "0.50" },
  { id: 1, val: "75%", per: "0.75" },
  { id: 1, val: "100%", per: "1.00" },
];

// Hook
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

const CardAddFunds = (props) => {
  const styles = useStyles(ThemeManager);
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [amount, setAmount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [balance, setBalance] = useState("");
  const {
    cardPaytendBalanceInfo,
    cardPaytendBalanceError,
    isCardPaytendBalanceLoading,
  } = useSelector((state) => state.cardPaytendBalanceReducer);
  const { currencyDetailsLoading, currencyDetails } = useSelector(
    (state) => state?.withDetails
  );
  const [balanceStatus, setBalanceStatus] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState("");
  const [percentageVal, setPercentageVal] = useState("");
  const debounceOnChange = React.useCallback(debounce(onChangeValue, 500), []);
  const debounceOnChangeUsdt = React.useCallback(
    debounce(onChangeUsdtValue, 500),
    []
  );
  const { cardFeesInfo, cardFeesError, isCardFeesLoading } = useSelector(
    (state) => state.cardFeesReducer
  );

  const [modalVisible, setModalVisible] = useState(false);
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  const [loader, setLoader] = useState(true);

  const [totalEuro, setTotalEuro] = useState("");
  const [totalUsdt, setTotalUsdt] = useState("");
  const [loadError, setLoadError] = useState("");
  const {
    currencyConversionInfo,
    currencyConversionError,
    isCurrencyConversionLoading,
  } = useSelector((state) => state.currencyConversionPaytendReducer);
  const { cardTopUpHolder, isCardTopUpLoading, cardTopUpError } = useSelector(
    (state) => state.cardTopupReducer
  );
  const [convertLoading, setConvertLoading] = useState(false);
  const [usdtLoading, setUsdtLoading] = useState(false);
  const [euroLoading, setEuroLoading] = useState(false);

  // const { cardFeesInfo, cardFeesError, isCardFeesLoading } = useSelector(
  //   (state) => state.cardFeesReducer
  // );
  function onChangeValue(value) {
    // console.log("check onChangeValue>>>", value);
    // if (value > 0) {
    setUsdtLoading(true);
    dispatch(getCurrencyConversionDetails("euro", value))
      .then((res) => {
        // console.log("getCurrencyConversionDetails res=-=>>", res);
        let resp = JSON.parse(res);
        // console.log("getCurrencyConversionDetails resp=-=>>", resp);
        setUsdtAmount(`${parseFloat(resp).toFixed(2)}`);
        setUsdtLoading(false);
      })
      .catch((err) => {
        console.log("getCurrencyConversionDetails=-err=-=>>", err);
        setUsdtLoading(false);
      });
    // } else {
    //   setAmount("");
    //   setUsdtAmount("");
    // }
  }
  function onChangeUsdtValue(value) {
    console.log("check onChangeUsdtValue>>", value);
    // if (value > 0) {
    setEuroLoading(true);
    dispatch(getCurrencyConversionDetails("usdt", value))
      .then((res) => {
        console.log("getCurrencyConversionDetails-usdt-res=-=>>", res);
        let resp = JSON.parse(res);
        console.log("getCurrencyConversionDetailsUsdt resp=-=>>", resp);

        setAmount(`${parseFloat(resp).toFixed(2)}`);
        setEuroLoading(false);
      })
      .catch((err) => {
        setAmount("");
        setEuroLoading(false);
        console.log("getCurrencyConversionDetails=usdt-err=-=>>", err);
      });
    // } else {
    //   setAmount("");
    //   setUsdtAmount("");
    // }
  }
  function onSubmitUsdtValue(value) {
    // console.log("check onSubmitUsdtValue>>", value);
    setConvertLoading(true);
    dispatch(getCurrencyConversionDetails("usdt", value))
      .then((res) => {
        // console.log("onSubmitUsdtValue-usdt-res=-=>>", res);
        let resp = JSON.parse(res);
        // console.log("onSubmitUsdtValue resp=-=>>", resp);

        setTotalEuro(`${parseFloat(resp).toFixed(2)}`);
        setTotalUsdt(`${value}`);
        setConvertLoading(false);

        // setAmount(`${resp}`);
      })
      .catch((err) => {
        console.log("onSubmitUsdtValue=usdt-err=-=>>", err);
        setConvertLoading(false);
      });
  }
  const getCardFee = () => {
    dispatch(getCardFees())
      .then((res) => {
        console.log("getCardFees=-=-=-=-res", res);
        // setModalCostVisible(true);
        // setInfoUploaded(false);
        // setButtonChange(true);
        setLoader(false);
      })
      .catch((err) => {
        console.log("getCardFees=-=-=-=-err", err);
        setLoader(false);
      });
  };
  const getCurrencyBalance = () => {
    let coinName = "usdt";
    dispatch(getCurrencyDetails({ coinName }))
      .then((res) => {
        // console.log("getCurrencyDetails balance=-ee=33res>>", res);
        setUsdtBalance(res?.balance);
      })
      .catch((err) => {
        console.log("getCurrencyDetails balance=-ee=33err>>", err);
        setUsdtBalance("");
      });
  };
  const getCardBalance = () => {
    dispatch(getCardPaytendBalance(props?.cardNumber))
      .then((res) => {
        // console.log("getCardPaytendBalance=-res=", res);
      })
      .catch((err) => {
        console.log("getCardPaytendBalance=-err=-=", err);
      });
  };
  useEffect(() => {
    // console.log("check props val=-=-=-=->>>", JSON.stringify(props));

    getCardFee();
    getCurrencyBalance();
    if (props?.cardNumber) {
      getCardBalance();
    }

    return () => { };
  }, []);
  const onAddButtonPress = () => {
    setLoadError("");
    if (parseFloat(currencyDetails?.balance) >= parseFloat(usdtAmount)) {
      setModalVisible(true);
      let usdtDeduction = parseFloat(
        usdtAmount * (parseFloat(cardFeesInfo?.topup_fee) / 100)
      ).toFixed(2);
      let afterDeduction = usdtAmount - usdtDeduction;
      onSubmitUsdtValue(afterDeduction);
    } else {
      // alert("hiii");
      Singleton.getInstance().showError("Insufficient Balance");
    }
  };
  const onClickConfirm = () => {
    setLoadError("");

    let maxBalance =
      parseFloat(amount) + parseFloat(cardPaytendBalanceInfo?.balance);
    // console.log("=maxBalance==", maxBalance);
    // console.log("=amount==", amount);
    let total_24 =
      parseFloat(cardPaytendBalanceInfo?.total_24h) + parseFloat(amount);

    if (parseFloat(amount) < 1) {
      setLoadError(`Minimum top up limit is 1 EUR.`);
    } else if (maxBalance > parseFloat(cardFeesInfo?.load_limit)) {
      setLoadError(
        `Maximum card balance limit is ${cardFeesInfo.load_limit} EUR.`
      );
    } else if (total_24 > parseFloat(cardFeesInfo.topup_limit)) {
      setLoadError(
        `Your maximum Top up limit is ${cardFeesInfo.topup_limit} EUR per day.`
      );
    } else {
      dispatch(cardTopUp(props?.cardNumber, amount, usdtAmount))
        .then((res) => {
          // console.log("onClickConfirm=-=-res---", res);
          getCardBalance();
          getCurrencyBalance();
          setAmount("");
          setUsdtAmount("");
          setModalVisible(false);
          setLoader(false);
          Actions.pop();
          Singleton.getInstance().showMsg("Top up successful.");
        })
        .catch((err) => {
          console.log("onClickConfirm=-=-err-===", err);
          Singleton.getInstance().showError(err);
          setAmount("");
          setUsdtAmount("");
          setModalVisible(false);
          setLoader(false);
        });
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          key={index}
          onPress={() => { }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Image
              source={{ uri: Images.iconTeather }}
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                fontFamily: Fonts.semiBold,
                color: ThemeManager.colors.textColor,
                marginLeft: 10,
              }}
            >
              USDT
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: Fonts.semiBold,
              color: ThemeManager.colors.headerText,
            }}
          >
            {usdtBalance} USDT
          </Text>
        </TouchableOpacity>
      </>
    );
  };
  const renderPercentItem = (item, index) => {
    return (
      <ButtonPrimary
        showGradient={selectedIndex === index ? false : true}
        style={styles.primaryBtn}
        // btnStyle={{ backgroundColor: "red" }}
        title={item.val}
        textstyle={styles.primaryBtnText}
        textSimpleStyle={styles.simpleStyle}
        onPress={() => {
          setSelectedIndex(index);
          setPercentageVal(item.per);
          console.log("item.per-=-=-=->>>>", item.per);
          console.log("usdtBalance-=-=-=->>>>", usdtBalance);
          let total = usdtBalance * item.per;
          console.log("total-=-=-=->>>>", total);
          let valData = parseFloat(total).toFixed(2);
          console.log("total-=-=-=->>>>", valData);
          setUsdtAmount(`${valData}`);
          debounceOnChangeUsdt(valData);
        }}
      />
    );
  };
  return (
    <Wrap
      style={styles.bgColor}
      screenStyle={styles.bgColor}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={styles.bgColor}
    >
      <View style={styles.headerView}>
        <SimpleHeader
          titleName={strings.cardScreen.top_up_funds}
          backImageColor={styles.headIconColor}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>
      <Loader isLoading={isCardPaytendBalanceLoading || loader} />
      <View style={styles.scrollStyle}>
        <ScrollView bounces={false} nestedScrollEnabled>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.balanceText}>
              {strings.cardScreen.balance}:{" "}
              {cardPaytendBalanceInfo?.balance != null
                ? cardPaytendBalanceInfo?.balance
                : 0.0}
              {" EUR"}
            </Text>
            {/* <Text
              style={{
                color: ThemeManager.colors.btnColor3,
                fontFamily: fonts.regular,
                fontSize: 22,
                marginTop: 15,
              }}
            >
              {"$1400 USDT"}
            </Text> */}
            <View>
              <View style={styles.mainInputView}>
                <View style={styles.inputView}>
                  <TextInput
                    value={usdtAmount}
                    style={styles.inputStyle}
                    maxLength={12}
                    placeholder={"0.0 "}
                    placeholderTextColor={
                      ThemeManager.colors.placeholderTextColor
                    }
                    onChangeText={(value) => {
                      console.log("value.length == 0-22-", value?.length == 0);
                      console.log("value.length --22", value?.length);
                      var validNumber = new RegExp(/^\d*\.?\d*$/);
                      let e = value.split(".");
                      console.log("value=e-=-", e);
                      var expression = new RegExp("^\\d*\\.?\\d{0," + 2 + "}$");
                      if (expression.test(value)) {
                        if (validNumber.test(value)) {
                          // if (e[0].length == 0) {
                          console.log("value=-=-", value);
                          // if (value.length == 0) {
                          //   // setUsdtAmount("");
                          //   // setAmount("");
                          //   debounceOnChangeUsdt(value);
                          //   // setUsdtAmount("");
                          // } else {
                          if (value == ".") {
                            setUsdtAmount("0.");
                          } else {
                            setUsdtAmount(value);
                          }
                          debounceOnChangeUsdt(value);
                          // }
                          // } else if (e[1].length <= 2) {
                          //   if (value.length == 0) {
                          //     setUsdtAmount("");
                          //     // setAmount("");
                          //     debounceOnChangeUsdt("0");
                          //     // setUsdtAmount("0.0");
                          //   } else {
                          //     if (value == ".") {
                          //       setUsdtAmount("0.");
                          //     } else {
                          //       setUsdtAmount(value);
                          //     }
                          //     debounceOnChangeUsdt(value);
                          //   }
                          // }
                        }
                        setSelectedIndex(null);
                        setCurrency("usdt");
                      }
                    }}
                    keyboardType={"numeric"}
                    returnKeyType={"done"}
                  />
                  <View style={styles.loaderRow}>
                    <View style={styles.marginFifteen}>
                      {usdtLoading && (
                        <ActivityIndicator
                          size="small"
                          color={ThemeManager.colors.textColor}
                        />
                      )}
                    </View>

                    <Text style={styles.usdtStyle}>{"USDT"}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.rowNext}>
                <TextInput
                  value={amount}
                  style={styles.nextInput}
                  placeholder={"0.0"}
                  placeholderTextColor={
                    ThemeManager.colors.placeholderTextColor
                  }
                  returnKeyType={"done"}
                  onChangeText={(value) => {
                    console.log("value.length == 0--", value?.length == 0);
                    console.log("value.length --", value?.length);
                    let e = value.split(".");
                    console.log("value=e-=-====->>", e);
                    var expression = new RegExp("^\\d*\\.?\\d{0," + 2 + "}$");
                    if (expression.test(value)) {
                      var validNumber = new RegExp(/^\d*\.?\d*$/);
                      if (validNumber.test(value)) {
                        if (value == ".") {
                          setAmount("0.");
                        } else {
                          setAmount(value);
                        }
                        setCurrency("euro");
                        debounceOnChange(value);
                      }
                      setSelectedIndex(null);
                    }
                  }}
                  maxLength={12}
                  keyboardType={"numeric"}
                />
                <View style={styles.loaderRow}>
                  <View style={styles.marginTwenty}>
                    {euroLoading && (
                      <ActivityIndicator
                        size="small"
                        color={ThemeManager.colors.headerText}
                      />
                    )}
                  </View>
                  <Text style={styles.euroStyle}>{"EUR"}</Text>
                </View>
              </View>
            </View>
            <View style={styles.rowCenter}>
              <ScrollView
                horizontal
                contentContainerStyle={styles.containerScroll}
              >
                {percentVal.map(renderPercentItem)}
              </ScrollView>
            </View>
            <View style={{ marginVertical: 10 }}>
              {/* <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: Fonts.regular,
                  marginVertical: 30,
                }}
              >
                {strings.cardScreen.min}
                {" $100"}
                {" | "}
                {strings.cardScreen.max}
                {" $250000"}
              </Text> */}
            </View>
          </View>
          <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
            <Text style={styles.noteStyle}>{strings.cardScreen.note}</Text>
            <BorderLine />
            <View style={styles.rowSpace}>
              <Text style={styles.spendingText}>
                {strings.cardScreen.todays_spending}
              </Text>
              <Text style={styles.spendingValue}>
                {cardPaytendBalanceInfo?.total_24h
                  ? parseFloat(cardPaytendBalanceInfo?.total_24h)
                  : "0"}{" "}
                EUR
              </Text>
            </View>
            <View style={styles.limitRow}>
              <Text style={styles.spendingText}>
                {strings.cardScreen.daily_top_up_limit}
              </Text>
              <Text style={styles.spendingValue}>
                {cardFeesInfo?.topup_limit
                  ? parseFloat(cardFeesInfo?.topup_limit)
                  : "0"}{" "}
                EUR
              </Text>
            </View>
            <View style={styles.limitRow}>
              <Text style={styles.spendingText}>
                {strings.cardScreen.maximum_card_balance}
              </Text>
              <Text style={styles.spendingValue}>
                {cardFeesInfo?.load_limit
                  ? parseFloat(cardFeesInfo?.load_limit)
                  : "0"}{" "}
                EUR
              </Text>
            </View>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Text style={styles.cryptoStyle}>
              {strings.cardScreen.from_crypto_wallets}
            </Text>
            <FlatList
              bounces={false}
              keyboardShouldPersistTaps={"handled"}
              data={[1]}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={renderItem}
              ListEmptyComponent={
                <View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 100,
                      // flex: 1,
                    }}
                  >
                    <CustomEmptyView />
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      No records found.
                    </Text>
                  </View>
                </View>
              }
              ListFooterComponent={<View style={{ height: 100 }} />}
            />
          </View>
        </ScrollView>
        {amount > 0 && usdtAmount > 0 ? (
          <ButtonPrimary
            style={{ marginBottom: 50 }}
            title={strings.cardScreen.top_up_funds}
            onPress={() => {
              // onButtonPress();
              onAddButtonPress();
            }}
          />
        ) : (
          <ButtonPrimary
            enable={true}
            style={{ marginBottom: 50, opacity: 0.5 }}
            title={strings.cardScreen.top_up_funds}
            onPress={() => {
              // onAddButtonPress();
            }}
          />
        )}
      </View>
      <Modal
        animationType="Slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
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
                setModalVisible(false);
              }}
            ></TouchableOpacity>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={styles.modalView}>
                <View style={styles.summaryView}>
                  <Image
                    // source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                    style={{ height: 20, width: 20, resizeMode: "contain" }}
                  />
                  <Text style={styles.summaryText}>
                    {strings.cardScreen.summary}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                      style={styles.closeIcon}
                    />
                  </TouchableOpacity>
                </View>
                <BorderLine style={styles.borderLine} />
                <View style={styles.rowCenterFifteen}>
                  <Text style={styles.modalText}>
                    {strings.cardScreen.sending_from}
                  </Text>
                  <Text style={styles.totalEurVal}>{"USDT"}</Text>
                </View>
                <View style={styles.rowCenterFifteen}>
                  <Text style={styles.modalText}>
                    {strings.cardScreen.top_up_amount}
                  </Text>
                  <Text style={styles.totalEurVal}>
                    {usdtAmount}
                    {" USDT"}
                  </Text>
                </View>
                <View style={styles.rowCenterFifteen}>
                  <Text style={styles.modalText}>
                    {strings.cardScreen.top_up_fee}
                    {`(${cardFeesInfo?.topup_fee}%)`}
                  </Text>
                  <Text style={styles.totalEurVal}>
                    {parseFloat(
                      usdtAmount * (parseFloat(cardFeesInfo?.topup_fee) / 100)
                    ).toFixed(2)}
                    {" USDT"}
                  </Text>
                </View>
                <View style={styles.totalView}>
                  <Text style={styles.titleTotal}>
                    {strings.cardScreen.total}
                  </Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.totalEurVal}>
                      {totalEuro ? parseFloat(totalEuro).toFixed(2) : "0.00"}{" "}
                      {"EUR"}
                    </Text>
                    <Text style={styles.totalUsdtValue}>
                      {totalUsdt ? parseFloat(totalUsdt).toFixed(2) : "0.00"}{" "}
                      {"USDT"}
                    </Text>
                  </View>
                </View>
                <BorderLine style={{ width: width, marginVertical: 10 }} />
                <Text style={styles.errorText}>{loadError}</Text>
                <View style={styles.btnView}>
                  <ButtonPrimary
                    title={strings.cardScreen.confirm}
                    style={styles.btnStyle}
                    textstyle={{ paddingHorizontal: 10 }}
                    onPress={() => {
                      onClickConfirm();
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Wrap>
        <Loader
          isLoading={
            currencyDetailsLoading ||
            isCurrencyConversionLoading ||
            isCardTopUpLoading ||
            isCardPaytendBalanceLoading ||
            convertLoading
          }
        />
      </Modal>
    </Wrap>
  );
};

export default CardAddFunds;
const useStyles = (theme) =>
  StyleSheet.create({
    mainViewStyle: {
      flex: 1,
      backgroundColor: theme.colors.DashboardBG,
      justifyContent: "space-between",
    },
    headerView: { marginHorizontal: 15, marginVertical: 10, height: 45 },
    headerTextStyle: { fontSize: 16, fontFamily: fonts.regular },
    bgColor: { backgroundColor: theme.colors.DashboardBG },
    headIconColor: { tintColor: theme.colors.headTxt },
    scrollStyle: { justifyContent: "space-between", flex: 1 },
    balanceText: {
      color: theme.colors.headerText,
      fontFamily: fonts.regular,
      fontSize: 14,
      alignSelf: "flex-end",
      marginRight: 15,
    },
    mainInputView: {
      backgroundColor: theme.colors.SwapInput,
      width: width - 60,
      height: 50,
      borderRadius: 8,
    },
    inputView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      borderRadius: 8,
      height: 50,
      // flex: 1,
    },
    inputStyle: {
      fontFamily: Fonts.medium,
      fontSize: 18,
      color: theme.colors.textColor,
      flex: 1,
      textAlign: "left",
    },
    loaderRow: {
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      height: 50,
    },
    marginTwenty: { marginHorizontal: 20 },
    marginFifteen: { marginHorizontal: 15 },
    euroStyle: {
      color: theme.colors.headerText,
      fontFamily: fonts.regular,
      fontSize: 16,
      marginBottom: Platform.OS == "android" ? 5 : 0,
      textAlign: "center",
      paddingTop: 4,
    },
    usdtStyle: {
      color: theme.colors.btnColor3,
      fontFamily: fonts.regular,
      fontSize: 18,
      paddingTop: 4,
      marginBottom: Platform.OS == "android" ? 5 : 0,
    },
    rowNext: {
      marginTop: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.SwapInput,
      borderRadius: 8,
      paddingHorizontal: 15,
      height: 50,
    },
    nextInput: {
      fontFamily: Fonts.regular,
      fontSize: 16,
      color: theme.colors.textColor,
      textAlign: "left",
      flex: 1,
      // backgroundColor: "yellow",
    },
    rowCenter: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    containerScroll: {
      justifyContent: "center",
      alignItems: "center",
      marginLeft: width / 2 - 130,
      marginTop: 30,
    },
    primaryBtn: {
      height: 35,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 60,
      marginHorizontal: 2,
      backgroundColor: theme.colors.SwapInput,
      borderRadius: 8,
    },
    primaryBtnText: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      // color: ThemeManager.colors.textColor,
    },
    simpleStyle: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      color: theme.colors.textColor,
    },
    noteStyle: {
      color: theme.colors.textColor,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    rowSpace: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    spendingText: {
      color: theme.colors.textColor,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    spendingValue: {
      color: theme.colors.headerText,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    limitRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cryptoStyle: {
      color: theme.colors.textColor,
      fontSize: 15,
      fontFamily: Fonts.regular,
      marginVertical: 20,
    },
    listContainer: {
      flexGrow: 1,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    modalView: {
      width: width,
      backgroundColor: theme.colors.modalBg,
      borderRadius: 8,
    },
    summaryView: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      width: width,
    },
    summaryText: {
      color: theme.colors.modalTitle,
      fontSize: 16,
      fontFamily: Fonts.regular,
      marginTop: 15,
    },
    modalBtn: {
      height: 30,
      width: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    closeIcon: {
      height: 20,
      width: 20,
      resizeMode: "contain",
      marginRight: 15,
      marginTop: 10,
    },
    borderLine: { width: width, marginVertical: 10 },
    errorText: {
      marginHorizontal: 15,
      marginVertical: 5,
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: "red",
    },
    btnView: {
      // flexDirection: "row",
      alignItems: "center",
      // justifyContent: "space-between",
      width: width,
    },
    btnStyle: {
      height: 50,
      marginVertical: 20,
      marginRight: 10,
      width: width - 30,
      backgroundColor: theme.colors.selectedTextColor,
      borderRadius: 4,
    },
    totalUsdtValue: {
      color: theme.colors.headerText,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    totalEurVal: {
      color: theme.colors.textColor,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    titleTotal: {
      color: theme.colors.modalTitle1,
      fontSize: 16,
      fontFamily: Fonts.medium,
    },
    totalView: {
      // marginHorizontal: 15,
      marginTop: 15,
      flexDirection: "row",
      // alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.SwapInput,
      padding: 15,
    },
    modalText: {
      color: ThemeManager.colors.modalTitle1,
      fontSize: 16,
      fontFamily: Fonts.medium,
    },
    rowCenterFifteen: {
      marginHorizontal: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    // feeVal: {
    //   color: theme.colors.textColor,
    //   fontSize: 15,
    //   fontFamily: Fonts.regular,
    // },
  });
