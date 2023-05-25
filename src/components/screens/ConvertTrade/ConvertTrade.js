/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
// import {ISO_8601} from 'moment';
import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import {
  ButtonPrimary,
  ConvertInput,
  CustomEmptyView,
  Loader,
  Wrap,
} from "../../common";
import ConvertHeader from "../../common/ConvertHeader";
import styles from "./ConvertTradeStyle";
import {
  getActiveCoinList,
  getBalanceDetails,
  getSwapCoinPairs,
  resetSwapCoin,
  getSwapCoinPairsForOne,
  postSwap,
  resetSwap,
  getActiveSwapCoinList,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-gesture-handler";
import * as constants from "../../../Constants";
import Singleton from "../../../Singleton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { log } from "util";
import LinearGradient from "react-native-linear-gradient";
import { parse } from "@babel/core";

const { height, width } = Dimensions.get("window");
var _ = require("lodash");

const ConvertTrade = () => {
  let interval = React.useRef(null);
  const [loginStatus, setLoginStatus] = useState(false);

  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showConvertBtn, setShowConvertBtn] = useState(true);
  const [fromSelected, setFromSelected] = useState(true);
  const [fromVal, setFromVal] = useState("");
  const [toVal, setToVal] = useState("");
  const [isInputSelected, setInputSelected] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [countDown, setCountDown] = useState(7);
  const dispatch = useDispatch();
  // const activeCoin = useSelector((state) => state?.activeCoin);
  const { activeCoinInfo } = useSelector((state) => state?.activeCoin);

  const [data, setData] = useState(null);
  const [fromSelectedCoin, setFromSelectedCoin] = useState(null);
  const [toSelectedCoin, setToSelectedCoin] = useState(null);
  const [selectedIndexFrom, setSelectedIndexFrom] = useState(0);
  const [selectedIndexTo, setSelectedIndexTo] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [ratePrice, setRatePrice] = useState("");
  // const withDetails = useSelector((state) => state?.withDetails);
  const { balanceDetails } = useSelector((state) => state?.withDetails);

  // const swapCurrencyReducer = useSelector(
  //   (state) => state?.swapCurrencyReducer
  // );
  const { swapCoinPairsInfo, swapOneCoin, isLoading } = useSelector(
    (state) => state?.swapCurrencyReducer
  );

  const swapReducer = useSelector((state) => state?.swapReducer);
  const [fromCoinType, setFromCoinType] = useState("");
  const [toCoinType, setToCoinType] = useState("");
  const [selectedFromCoin, setSelectedFromCoin] = useState(""); // please add from api
  const [selectedToCoin, setSelectedToCoin] = useState("");
  const [buttonStatus, setButtonStatus] = useState(true);
  const { marketData, pairArray } = useSelector(
    (state) => state.marketSocketReducer
  );
  // console.log("marketData=-=-=-=-=->>>>0", marketData);
  // console.log("pairArray=-=-=-=-=->>>>0", pairArray);

  const { activeCoinSwapInfo, errorSwap, isSwapLoading } = useSelector(
    (state) => state.getActiveSwapReducer
  );
  const [errorShow, setErrorShow] = useState("");
  const [youGet, setYouGet] = useState("");
  // console.log("activeCoin=-=-=-=-=->>>>0", activeCoinInfo);
  // console.log("activeCoinSwapInfo=-=-=-=-=->>>>0", activeCoinSwapInfo);
  const onSearch = (value) => {
    setData(
      searchData.filter((i) => i.id.toLowerCase().includes(value.toLowerCase()))
    );
  };
  const didSelect = (item) => {
    if (isInputSelected) {
      if (item == "d") {
      } else if (item == "Del") {
        let val1 = toVal;
        let tempVal1 = val1.slice(0, -1);
        setToVal(tempVal1);
        onChangeText(tempVal1);
      } else {
        let val1 = toVal;
        val1 = val1 + item;
        if (val1?.length < 9) {
          if (/^\d*\.?\d*$/.test(val1)) {
            setToVal(val1);
            onChangeText(val1);
          }
        }
      }
    } else {
      if (item == "d") {
      } else if (item == "Del") {
        let val = fromVal;
        let tempVal = val.slice(0, -1);
        setFromVal(tempVal);
        onChangeText(tempVal);
      } else {
        let val = fromVal;
        val = val + item;
        if (val?.length < 9) {
          if (/^\d*\.?\d*$/.test(val)) {
            // let valC = minWithdrawAmount(fromSelectedCoin?.id);
            // console.log("minWithdrawAmount=--=-", valC);

            setFromVal(val);
            onChangeText(val);
            if (val === ".") {
              setFromVal(`${"0" + val}`);
            } else {
              setFromVal(val);
            }
          }
        }
      }
    }
  };

  const onChangeText = (text) => {
    var validNumber = new RegExp(/^\d*\.?\d*$/);

    if (validNumber.test(text)) {
      if (text == "" || text == "0" || text == "0.") {
        setToVal("");
      }
      setFromVal(text);
    } else {
      Singleton.getInstance().showError(
        strings.convert.please_select_convert_to
      );
    }
  };

  useEffect(() => {
    setFromVal("");
    setToVal("");
    dispatch(getActiveCoinList());
    dispatch(getActiveSwapCoinList());
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        console.log("check isLogin=-=-123=-=>>>", isLogin);
        if (isLogin == "true") {
          setLoginStatus(true);
        } else {
          setLoginStatus(false);
        }
      })
      .catch((err) => { });
    return () => {
      dispatch(resetSwapCoin());
      dispatch(resetSwap());
      setToVal("");
      interval && clearInterval(interval.current);
    };
  }, []);
  useEffect(() => {
    setToVal(
      Singleton.getInstance().ParseFloatNumberOnly(swapCoinPairsInfo, 8)
    );
    console.log(
      "swapCurrencyReducer?.swapCoinPairsInfo=-=-=->>",
      swapCoinPairsInfo
    );
    return () => { };
  }, [swapCoinPairsInfo]);

  useEffect(() => {
    setRatePrice(swapOneCoin);

    return () => { };
  }, [swapOneCoin]);

  useEffect(() => {
    getCoinInfo();

    return () => { };
  }, [activeCoinSwapInfo]);

  const getCoinInfo = () => {
    if (activeCoinSwapInfo) {
      setData(activeCoinSwapInfo);
      setSearchData(activeCoinSwapInfo);
      setFromSelectedCoin(
        activeCoinSwapInfo?.length > 0 && activeCoinSwapInfo[0]
      );

      setSelectedFromCoin(
        activeCoinSwapInfo?.length > 0 && activeCoinSwapInfo[0]?.id
      );
      setFromCoinType(
        activeCoinSwapInfo?.length > 0 && activeCoinSwapInfo[0]?.type
      );

      setSelectedToCoin(
        activeCoinSwapInfo?.length > 0 && activeCoinSwapInfo[1]?.id
      );
      setToSelectedCoin(
        activeCoinSwapInfo?.length > 0 && activeCoinSwapInfo[1]
      );
      setToCoinType(
        activeCoinSwapInfo?.length > 0 && activeCoinSwapInfo[1]?.type
      );
      const coinName = activeCoinSwapInfo[0]?.id;
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          if (isLogin == "true") {
            dispatch(getBalanceDetails({ coinName }));
            setLoginStatus(true);
          } else {
            setLoginStatus(false);
          }
        })
        .catch((err) => { });
    }
  };
  const findFees = (id) => {
    let feeCal = activeCoinSwapInfo?.find((a) => a.id == id);
    if (feeCal != undefined) {
      // console.log("feeCa=----->>>", feeCal);
      // console.log("feeCal.swap_fees=----->>>", feeCal.swap_fees);
      // console.log("fromVal=----->>>", fromVal);
      // console.log("fromVal=----->>>cal=-=-", fromVal * feeCal.swap_fees);
      let cal = Singleton.getInstance().exponentialToDecimalConvert(
        fromVal * feeCal.swap_fees
      );
      return parseFloat(cal).toFixed(8);
    }
  };
  const getReceiveValue = (tovalue) => {
    // console.log("activeCoinSwapInfo-id--->>>", activeCoinSwapInfo);
    let fee = findFees(fromSelectedCoin?.id);
    let pre = getPrecision(fromSelectedCoin?.id);
    // console.log("fee-result--xc>>>", pre);
    let xc =
      (parseFloat(tovalue) / parseFloat(fromVal)) *
      (parseFloat(fromVal) - parseFloat(fee));
    // console.log("fee-result--xc>>>", xc);
    xc = Singleton.getInstance().exponentialToDecimalConvert(xc);
    let precisionVal;
    if (parseFloat(pre) > 8) {
      precisionVal = parseFloat(xc).toFixed(8);
    } else {
      precisionVal = parseFloat(xc).toFixed(pre);
    }
    setYouGet(precisionVal);
    // setYouGet(parseFloat(xc).toFixed(pre));
    // let res = parseFloat(xc)?.toFixed(pre) ? parseFloat(xc)?.toFixed(pre) : "";
    // console.log("fee-result--res>>>", res);
    // if (cx == NaN) {
    //   return 0;
    // } else {
    //   return res;
    // }
  };
  const getReceiveValueWithout = (tovalue) => {
    let fee = findFees(fromSelectedCoin?.id);
    let pre = getPrecision(fromSelectedCoin?.id);
    console.log("fee-result--xc>>>", pre);
    let xc =
      (parseFloat(tovalue) / parseFloat(fromVal)) *
      (parseFloat(fromVal) - parseFloat(fee));
    console.log("fee-result--xc>>>", xc);
    let precisionVal;
    if (parseFloat(pre) > 8) {
      precisionVal = parseFloat(xc).toFixed(8);
    } else {
      precisionVal = parseFloat(xc).toFixed(pre);
    }
    setYouGet(precisionVal);
    // setYouGet(parseFloat(xc).toFixed(pre));
    // let res = parseFloat(xc)?.toFixed(pre) ? parseFloat(xc)?.toFixed(pre) : "";
    // console.log("fee-result--res>>>", res);
    // if (cx == NaN) {
    //   return 0;
    // } else {
    //   return res;
    // }
  };
  const getPrecision = (id) => {
    let feeCal = activeCoinSwapInfo?.find((a) => a.id == id);
    console.log("getPrecision-id--->>>", feeCal);
    if (feeCal != undefined) {
      let pre = feeCal.precision;

      return pre;
    }
  };
  const minWithdrawAmount = (id) => {
    console.log("feeCal.min_withdraw_amount=--id--->>>", id);
    let feeCal = activeCoinSwapInfo?.find((a) => a.id == id);
    if (feeCal != undefined) {
      console.log("min_withdraw_amount=----->>>", feeCal);
      console.log(
        "feeCal.min_withdraw_amount=----->>>",
        feeCal.min_deposit_amount
      );
      let min = feeCal.min_deposit_amount;
      return min;
    }
  };
  const debounceLoadData = _.debounce((text) => {
    if (text?.length > 0 && text != 0.0 && text != 0) {
      if (!toSelectedCoin) {
        Singleton.getInstance().showError(
          strings.convert.please_select_convert_to
        );
        setFromVal("");
      } else {
        dispatch(
          getSwapCoinPairs(fromSelectedCoin?.id, toSelectedCoin?.id, text)
        );
        dispatch(
          getSwapCoinPairsForOne(fromSelectedCoin?.id, toSelectedCoin?.id, text)
        );
      }
    } else {
      setToVal("");
    }
  }, 800);
  const getTimer = () => {
    let count = 8;
    if (interval) {
      setCountDown("");
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      count = count - 1;

      setCountDown(count + "");
      if (count == 1) {
        count = 0;
        setCountDown("");
        setShowConvertBtn(false);
        interval && clearInterval(interval.current);
      }
    }, 1000);
  };
  const getName = (name) => {
    const textName = name.charAt(0);

    return (
      <Text
        style={{
          fontSize: 16,
          fontFamily: Fonts.bold,
          textAlign: "center",
          marginTop: -2,
          color: ThemeManager.colors.textColor1,
        }}
      >
        {textName}
      </Text>
    );
  };

  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.modalBox }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.modalBox },
      ]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.modalBox }}
    >
      <ConvertHeader
        history
        onBackPress={() => {
          Actions.pop();
        }}
        onHistoryPress={() => {
          if (loginStatus) {
            Actions.currentScene != "ConversionHistory" &&
              Actions.push("ConversionHistory");
          } else {
            Actions.currentScene != "Login" && Actions.push("Login");
          }
        }}
        title={strings.convert.swap}
      />
      <ScrollView bounces={false}>
        <View
          style={{
            backgroundColor: ThemeManager.colors.modalBox,
            flex: 1,
          }}
        >
          <View
            style={{
              marginHorizontal: 20,
              // backgroundColor: ThemeManager.colors.inputBackground,
            }}
          >
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginBottom: 5,
                }}
              >
                {strings.convert.from}
              </Text>
              <ConvertInput
                backgroundColor={ThemeManager.colors.inputBackground}
                coinViewColor={ThemeManager.colors.Depositbtn}
                inActiveColor={ThemeManager.colors.inactiveTextColor}
                textColor={ThemeManager.colors.textColor1}
                selectedTextColor={ThemeManager.colors.selectedTextColor}
                disabled={loginStatus ? false : true}
                flag={fromSelectedCoin?.icon_url}
                onLeftTextPress={() => {
                  setShowConvertModal(true);
                  setFromSelected(true);
                }}
                placeholder={"0.0003"}
                placeholderTextColor={ThemeManager.colors.inactiveTextColor}
                coinName={fromSelectedCoin?.id?.toUpperCase()}
                max
                onMaxPress={() => {
                  setFromVal(balanceDetails?.balance);
                  setButtonStatus(false);
                }}
                value={fromVal}
                onChangeText={(text) => {
                  var validNumber = new RegExp(/^\d*\.?\d*$/);
                  console.log("minWithdrawAmount=--=-", text);
                  if (validNumber.test(text)) {
                    if (text === ".") {
                      setFromVal(`${"0" + text}`);
                      if (text > 0) {
                        // let val = minWithdrawAmount(text);
                        // console.log("minWithdrawAmount=--=-", val);
                        setButtonStatus(false);
                      }
                    } else {
                      setFromVal(text);
                      if (text > 0) {
                        // console.log("minWithdrawAmount=--=222-", val);
                        setButtonStatus(false);
                      }
                    }

                    // }
                  } else {
                    alert("Please enter valid amount.");
                  }
                }}
                onFocus={() => {
                  setInputSelected(false);
                }}
                onBlur={() => {
                  setInputSelected(false);
                }}
              />
              <Text
                style={{
                  color: ThemeManager.colors.textRedColor,
                  fontFamily: Fonts.regular,
                  fontSize: 13,
                  marginTop: 5,
                }}
              >
                {errorShow}
              </Text>
              {loginStatus ? (
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.convert.balance}
                  {": "}
                  {balanceDetails?.balance}{" "}
                  {balanceDetails?.currency?.toUpperCase()}
                </Text>
              ) : (
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.convert.available}
                  {": "}
                  {"0.00"} {selectedFromCoin.toUpperCase()}
                </Text>
              )}
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  // if (fromSelected) {
                  //   setSelectedFromCoin(coinName);
                  //   setSearchText('');
                  //   setData(activeCoin?.activeCoinInfo);
                  //   setSelectedIndexFrom(index);
                  //   setSelectedIndexTo(null);
                  //   setFromSelectedCoin(item);
                  //   setFromCoinType(item.type);
                  //   setFromSelected(false);
                  //   dispatch(getBalanceDetails({coinName}));
                  // } else {
                  //   setSelectedToCoin(coinName);
                  //   setSelectedIndexTo(index);
                  //   setSelectedIndexFrom(null);
                  //   setToSelectedCoin(item);
                  //   setToCoinType(item.type);
                  //   setFromSelected(true);
                  //   setShowConvertModal(false);
                  //   setSearchText('');
                  //   setData(activeCoin?.activeCoinInfo);
                  // }

                  let tempToVar = {
                    selectedToCoin,
                    toSelectedCoin,
                    toCoinType,
                  };
                  let tempForVar = {
                    selectedFromCoin,
                    fromSelectedCoin,
                    fromCoinType,
                  };
                  console.log("tempToVar========", tempToVar);
                  console.log("tempForVar========", tempForVar);

                  setSelectedFromCoin(tempToVar?.selectedToCoin);
                  setFromSelectedCoin(tempToVar?.toSelectedCoin);
                  setFromCoinType(tempToVar?.toCoinType);
                  //*****************   To var   *************************** */
                  setSelectedToCoin(tempForVar?.selectedFromCoin);
                  setToSelectedCoin(tempForVar?.fromSelectedCoin);
                  setToCoinType(tempForVar?.fromCoinType);
                  Singleton.getInstance()
                    .getData(constants.IS_LOGIN)
                    .then((isLogin) => {
                      if (isLogin == "true") {
                        dispatch(
                          getBalanceDetails({
                            coinName: tempToVar.selectedToCoin,
                          })
                        );
                        setLoginStatus(true);
                      } else {
                        setLoginStatus(false);
                      }
                    })
                    .catch((err) => { });
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_swap_c }}
                  style={[
                    {
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginBottom: 5,
                }}
              >
                {strings.convert.to}
              </Text>
              <ConvertInput
                textColor={ThemeManager.colors.textColor1}
                backgroundColor={ThemeManager.colors.inputBackground}
                coinViewColor={ThemeManager.colors.Depositbtn}
                inActiveColor={ThemeManager.colors.inactiveTextColor}
                selectedTextColor={ThemeManager.colors.selectedTextColor}
                placeholderTextColor={ThemeManager.colors.inactiveTextColor}
                multiline={false}
                placeholder={"--"}
                onLeftTextPress={() => {
                  setShowConvertModal(true);
                  setFromSelected(false);
                }}
                editable={false}
                flag={toSelectedCoin?.icon_url}
                coinName={toSelectedCoin?.id?.toUpperCase()}
                value={toVal}
                onChangeText={(text) => {
                  setToVal(text);
                }}
                onFocus={() => {
                  setInputSelected(true);
                }}
                onBlur={() => {
                  setInputSelected(true);
                }}
              />
            </View>
            <Text
              style={{
                color: "red",
                textAlign: "center",
                fontSize: 14,
                fontFamily: Fonts.regular,
                marginTop: 20,
              }}
            >
              {swapReducer?.error}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View>
        <FlatList
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "Del"]}
          numColumns={3}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={styles.pinButtonStyle}
                onPress={() => didSelect(item)}
              >
                {item === "Del" ? (
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                      tintColor: ThemeManager.colors.textColor1,
                    }}
                    source={{
                      uri: Images.icon_cross_del,
                    }}
                  ></Image>
                ) : (
                  <Text
                    style={[
                      styles.pinButtonTextStyle,
                      { color: ThemeManager.colors.textColor1 },
                    ]}
                  >
                    {item}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        />
      </View>
      {loginStatus ? (
        <ButtonPrimary
          style={{ marginBottom: 20 }}
          title={strings.convert.previewConversion}
          onPress={() => {
            dispatch(resetSwapCoin());
            setShowConvertBtn(true);
            if (fromVal > 0) {
              if (fromVal?.length > 0 && fromVal != 0.0 && fromVal != 0) {
                if (!toSelectedCoin) {
                  Singleton.getInstance().showError(
                    strings.convert.please_select_convert_to
                  );
                  setFromVal("");
                } else {
                  setButtonStatus(false);
                  let valC = minWithdrawAmount(fromSelectedCoin?.id);
                  console.log("minWithdrawAmount=--=-", valC);
                  console.log("minWithdrawAmount=--=-1", fromVal);
                  console.log("minWithdrawAmount=--=-2", fromVal > valC);
                  console.log("minWithdrawAmount=--=-3", fromVal < valC);
                  console.log("minWithdrawAmount=--=-4", valC <= fromVal);
                  console.log("minWithdrawAmount=--=-4", valC <= fromVal);

                  console.log("minWithdrawAmount=--=-5", valC > fromVal);

                  if (valC != undefined) {
                    if (parseFloat(valC) <= parseFloat(fromVal)) {
                      setErrorShow("");
                      dispatch(
                        getSwapCoinPairs(
                          fromSelectedCoin?.id,
                          toSelectedCoin?.id,
                          fromVal
                        )
                      )
                        .then((res) => {
                          console.log("getSwapCoinPairs=-=---->>>", res);
                          getReceiveValue(res);
                        })
                        .catch((err) => {
                          console.log("getSwapCoinPairs=-=---->>err>", err);
                        });
                      dispatch(
                        getSwapCoinPairsForOne(
                          fromSelectedCoin?.id,
                          toSelectedCoin?.id,
                          fromVal
                        )
                      );
                      setPreviewModalVisible(true);
                      getTimer();
                    } else {
                      let err = `Should not be less than ${valC}`;
                      setErrorShow(err);
                    }
                  } else {
                    console.log("getSwapCoinPairs ele=-=-");
                    dispatch(
                      getSwapCoinPairs(
                        fromSelectedCoin.id,
                        toSelectedCoin.id,
                        fromVal
                      )
                    )
                      .then((res) => {
                        console.log("getSwapCoinPairs=-=---->>>", res);
                        getReceiveValue(res);
                      })
                      .catch((err) => {
                        console.log("getSwapCoinPairs=-=---->>err>", err);
                      });
                    dispatch(
                      getSwapCoinPairsForOne(
                        fromSelectedCoin?.id,
                        toSelectedCoin?.id,
                        fromVal
                      )
                    );
                    setPreviewModalVisible(true);
                    getTimer();
                  }
                }
              } else {
                setToVal("");
              }
            } else {
              Singleton.getInstance().showError(
                strings.convert.please_enter_amount
              );
            }
          }}
        />
      ) : (
        <ButtonPrimary
          style={{ marginBottom: 20 }}
          title={strings.login_page.login}
          onPress={() => {
            Actions.currentScene != "Login" && Actions.push("Login");
          }}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={previewModalVisible}
        onRequestClose={() => {
          setPreviewModalVisible(false);
          setShowConvertBtn(true);
          setCountDown(7);
        }}
      >
        <Loader isLoading={swapReducer.isLoading} />
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setPreviewModalVisible(false);
                setShowConvertBtn(true);
                setCountDown(7);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.whiteScreen,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 15,
                  marginVertical: 15,
                }}
              >
                <View style={{ width: 20 }} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.textColor1,
                  }}
                >
                  {strings.convert.swap_confirmation}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setPreviewModalVisible(false);
                    setShowConvertBtn(true);
                    setCountDown(7);
                  }}
                >
                  <Image
                    source={{ uri: Images.icon_cancel_light }}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.convert.you_will_receive}
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: Fonts.medium,
                    color: ThemeManager.colors.textColor1,
                  }}
                >
                  {/* {toVal} {toSelectedCoin?.id?.toUpperCase()}
                   */}
                  {/* {getReceiveValue() ? getReceiveValue() : ""} */}
                  {youGet ? youGet : " "}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: ThemeManager.colors.tabBackground,
                  marginHorizontal: 15,
                  padding: 20,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.convert.convert}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {fromVal} {fromSelectedCoin?.id?.toUpperCase()}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.convert.fee}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {findFees(fromSelectedCoin?.id)}{" "}
                    {fromSelectedCoin?.id?.toUpperCase()}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    // marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.convert.rate}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                      }}
                    >
                      {"1 "}
                      {fromSelectedCoin?.id?.toUpperCase()}
                      {" ≈ "}
                      {ratePrice &&
                        Singleton.getInstance().ParseFloatNumber(
                          ratePrice,
                          8
                        )}{" "}
                      {toSelectedCoin?.id?.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                {!showConvertBtn && (
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textRedColor,
                      marginHorizontal: 15,
                      alignSelf: "center",
                      textAlign: "center",
                      marginVertical: 10,
                    }}
                  >
                    {strings.convert.quote_expired}
                  </Text>
                )}
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  marginHorizontal: 15,
                  marginVertical: 20,
                }}
              >
                {/* <TouchableOpacity
                  style={{
                    flex: 1,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 5,
                    borderWidth: 2,
                    borderColor: ThemeManager.colors.Depositbtn,
                    backgroundColor: ThemeManager.colors.tabBackground,
                  }}
                  onPress={() => {
                    setPreviewModalVisible(false);
                    setShowConvertBtn(true);
                    setCountDown(7);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {strings.convert.back}
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    setPreviewModalVisible(false);
                    setShowConvertBtn(true);
                    setCountDown(7);
                  }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    width: "48%",
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: ThemeManager.colors.withdrawText,
                    // backgroundColor: ThemeManager.colors.tabBottomBorder,
                  }}
                >
                  <Text
                    style={{
                      color: ThemeManager.colors.withdrawText,
                      fontSize: 14,
                      fontFamily: Fonts.medium,
                    }}
                  >
                    {strings.convert.back}
                  </Text>
                </TouchableOpacity>

                {showConvertBtn ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        parseFloat(balanceDetails?.balance) >=
                        parseFloat(fromVal)
                      ) {
                        setPreviewModalVisible(false);
                        dispatch(
                          postSwap(
                            fromVal,
                            toVal,
                            fromSelectedCoin?.id,
                            toSelectedCoin?.id,
                            0,
                            ratePrice
                          )
                        );
                        setFromVal("");
                        setToVal("");
                      } else {
                        Singleton.getInstance().showError(
                          strings.convert.insufficient_balance_alert
                        );
                      }
                    }}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#64B77C", "#347899", "#1F5BA7"]}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: 40,
                        borderRadius: 6,
                        // backgroundColor: ThemeManager.colors.btnColor2,

                        width: width / 2 - 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.medium,
                          color: colors.white,
                        }}
                      >
                        {strings.convert.convert}
                        {" ("}
                        {countDown}
                        {"s)"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(
                        getSwapCoinPairs(
                          fromSelectedCoin.id,
                          toSelectedCoin.id,
                          fromVal
                        )
                      );
                      dispatch(
                        getSwapCoinPairsForOne(
                          fromSelectedCoin.id,
                          toSelectedCoin.id,
                          fromVal
                        )
                      );
                      setShowConvertBtn(true);
                      getTimer();
                      setPreviewModalVisible(true);
                    }}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      colors={["#64B77C", "#347899", "#1F5BA7"]}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: 40,
                        borderRadius: 6,
                        // backgroundColor: ThemeManager.colors.btnColor2,

                        width: width / 2 - 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.medium,
                          color: colors.white,
                        }}
                      >
                        {strings.convert.refresh}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Wrap>
        <Loader isLoading={isLoading} />
        <Loader isLoading={swapReducer.isLoading} />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConvertModal}
        onRequestClose={() => {
          setShowConvertModal(false);
          setShowConvertModal(false);
        }}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              key="2"
              // style={{backgroundColor: ThemeManager.colors.whiteScreen}}
              contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setShowConvertModal(false);
                  setSearchText("");
                  setData(activeCoinSwapInfo);
                }}
              ></TouchableOpacity>
              <View
                style={{
                  flex: 5,
                  backgroundColor: ThemeManager.colors.whiteScreen,

                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                }}
              >
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.whiteScreen,
                    padding: 2,
                  }}
                >
                  <View
                    style={{
                      height: 60,
                      width: "90%",
                      alignSelf: "center",
                      borderRadius: 30,
                      marginTop: 10,
                      backgroundColor: ThemeManager.colors.tabBackground,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexDirection: "row",
                        height: 50,
                        marginVertical: 5,
                        alignSelf: "center",
                        flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setFromSelected(true);
                          setSearchText("");
                          setData(activeCoinSwapInfo);
                        }}
                        style={[
                          styles.flexRow,
                          {
                            backgroundColor: fromSelected
                              ? ThemeManager.colors.btnColor2
                              : ThemeManager.colors.tabBackground,
                            height: 50,
                            marginHorizontal: 5,
                            borderRadius: 25,
                            flex: 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.textStyle,
                            { color: ThemeManager.colors.textColor1 },
                          ]}
                        >
                          {strings.convert.from}
                        </Text>
                        {fromSelectedCoin ? (
                          <View>
                            {fromSelectedCoin?.icon_url ? (
                              <Image
                                source={{ uri: fromSelectedCoin?.icon_url }}
                                style={styles.iconStyle}
                              />
                            ) : (
                              <View
                                style={{
                                  backgroundColor:
                                    ThemeManager.colors.Depositbtn,
                                  height: 20,
                                  width: 20,
                                  borderRadius: 10,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: 10,
                                }}
                              >
                                {getName(fromSelectedCoin?.id)}
                              </View>
                            )}
                          </View>
                        ) : (
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              backgroundColor: ThemeManager.colors.borderColor,
                            }}
                          />
                        )}

                        <Text
                          style={[
                            styles.textStyle,
                            { color: ThemeManager.colors.textColor1 },
                          ]}
                        >
                          {fromSelectedCoin
                            ? fromSelectedCoin?.id?.toUpperCase()
                            : "---"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setFromSelected(false);
                          setSearchText("");
                          setData(activeCoinSwapInfo);
                        }}
                        style={[
                          styles.flexRow,
                          {
                            backgroundColor: fromSelected
                              ? ThemeManager.colors.tabBackground
                              : ThemeManager.colors.btnColor2,
                            height: 50,
                            flex: 1,
                            borderRadius: 25,
                            marginHorizontal: 5,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.textStyle,
                            { color: ThemeManager.colors.textColor1 },
                          ]}
                        >
                          {strings.convert.to}
                        </Text>
                        {toSelectedCoin ? (
                          <View>
                            {toSelectedCoin?.icon_url ? (
                              <Image
                                source={{ uri: toSelectedCoin?.icon_url }}
                                style={styles.iconStyle}
                              />
                            ) : (
                              <View
                                style={{
                                  backgroundColor:
                                    ThemeManager.colors.Depositbtn,
                                  height: 20,
                                  width: 20,
                                  borderRadius: 10,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: 10,
                                }}
                              >
                                {getName(toSelectedCoin?.id)}
                              </View>
                            )}
                          </View>
                        ) : (
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              backgroundColor: ThemeManager.colors.borderColor,
                            }}
                          />
                        )}

                        <Text
                          style={[
                            styles.textStyle,
                            { color: ThemeManager.colors.textColor1 },
                          ]}
                        >
                          {toSelectedCoin
                            ? toSelectedCoin?.id?.toUpperCase()
                            : "---"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      marginHorizontal: 10,
                      marginTop: 15,
                    }}
                  >
                    <Text
                      style={[
                        styles.convertText,
                        { color: ThemeManager.colors.textColor1 },
                      ]}
                    >
                      {strings.convert.convert}{" "}
                      {fromSelected
                        ? strings.convert.from.toLowerCase()
                        : strings.convert.to.toLowerCase()}
                    </Text>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        height: 50,
                        alignItems: "center",
                        flexDirection: "row",
                        backgroundColor: ThemeManager.colors.tabBackground,
                        borderRadius: 20,
                        paddingHorizontal: 15,
                        // padding: 15,
                      }}
                    >
                      <Image
                        source={{ uri: ThemeManager.ImageIcons.icon_search_text }
                        }
                        style={{ height: 20, width: 20, resizeMode: "contain" }}
                      />

                      <TextInput
                        value={searchText}
                        onChangeText={(e) => {
                          setSearchText(e);
                          onSearch(e);
                        }}
                        placeholderTextColor={ThemeManager.colors.textColor1}
                        // placeholder={'Search'}
                        style={{
                          width: "90%",
                          marginLeft: 10,
                          fontSize: 12,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.textColor1,
                        }}
                        placeholder={strings.home_tab.search}
                      />
                    </View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 50 }}
                      style={{ height: "75%" }}
                      bounces={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      {data !== null &&
                        data.map((item, index) => {
                          return (
                            <>
                              <View>
                                {(!fromSelected &&
                                  item.id === fromSelectedCoin?.id) ||
                                  (fromSelected &&
                                    item.id === toSelectedCoin?.id) ||
                                  (fromCoinType == "fiat" &&
                                    item.type == "fiat" &&
                                    !fromSelected) ||
                                  (toCoinType == "fiat" &&
                                    item.type == "fiat" &&
                                    fromSelected) ? null : (
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginVertical: 12,
                                    }}
                                    onPress={() => {
                                      const coinName = item.id;
                                      if (fromSelected) {
                                        console.log(
                                          "selected item from=-=->>",
                                          item
                                        );
                                        setToVal("");
                                        setFromVal("");
                                        setErrorShow("");
                                        setSelectedFromCoin(coinName);
                                        setSearchText("");
                                        setData(activeCoinSwapInfo);
                                        setSelectedIndexFrom(index);
                                        setSelectedIndexTo(null);
                                        setFromSelectedCoin(item);
                                        setFromCoinType(item?.type);
                                        setFromSelected(false);
                                        // dispatch(getBalanceDetails({coinName}));
                                        Singleton.getInstance()
                                          .getData(constants.IS_LOGIN)
                                          .then((isLogin) => {
                                            if (isLogin == "true") {
                                              dispatch(
                                                getBalanceDetails({ coinName })
                                              );
                                              setLoginStatus(true);
                                            } else {
                                              setLoginStatus(false);
                                            }
                                          })
                                          .catch((err) => { });
                                      } else {
                                        console.log(
                                          "selected item to=-=->>",
                                          item
                                        );
                                        setToVal("");
                                        setFromVal("");
                                        setErrorShow("");
                                        setSelectedToCoin(coinName);
                                        setSelectedIndexTo(index);
                                        setSelectedIndexFrom(null);
                                        setToSelectedCoin(item);
                                        setToCoinType(item?.type);
                                        setFromSelected(true);
                                        setShowConvertModal(false);
                                        setSearchText("");
                                        setData(activeCoinSwapInfo);
                                      }
                                    }}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                      }}
                                    >
                                      {item.icon_url ? (
                                        <Image
                                          source={{ uri: item.icon_url }}
                                          style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                            resizeMode: "contain",
                                            marginRight: 10,
                                          }}
                                        />
                                      ) : (
                                        <View
                                          style={{
                                            backgroundColor:
                                              ThemeManager.colors.Depositbtn,
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 10,
                                          }}
                                        >
                                          {getName(item?.name)}
                                        </View>
                                      )}
                                      <Text
                                        style={{
                                          color: ThemeManager.colors.textColor1,
                                        }}
                                      >
                                        {item?.id?.toUpperCase()}
                                      </Text>
                                    </View>
                                    <View>
                                      {fromSelected ? (
                                        <Image
                                          source={{
                                            uri: ThemeManager.ImageIcons
                                              .icon_select,
                                          }}
                                          style={{
                                            height: 20,
                                            width: 20,
                                            resizeMode: "contain",
                                            tintColor:
                                              fromSelectedCoin?.id === item.id
                                                ? ThemeManager.colors
                                                  .selectedTextColor
                                                : null,
                                          }}
                                        />
                                      ) : (
                                        <Image
                                          source={{
                                            uri: ThemeManager.ImageIcons
                                              .icon_select,
                                          }}
                                          style={{
                                            height: 20,
                                            width: 20,
                                            resizeMode: "contain",
                                            tintColor:
                                              toSelectedCoin.id === item.id
                                                ? ThemeManager.colors
                                                  .selectedTextColor
                                                : null,
                                          }}
                                        />
                                      )}
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </>
                          );
                        })}
                      {data == null ||
                        (data?.length == 0 && (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 90,
                            }}
                          >
                            <CustomEmptyView />
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              {strings.cardScreen.no_record_found}
                            </Text>
                          </View>
                        ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </Wrap>
      </Modal>
    </Wrap>
  );
};
export default ConvertTrade;
