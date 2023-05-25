/* eslint-disable react/self-closing-comp */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import {
  BankListDropDown,
  BankListDropDownWithdraw,
  Button,
  ButtonPrimary,
  CryptoInput,
  FiatDropDown,
  Header,
  InputField,
  Loader,
  Wrap,
} from "../../common";
import { Fonts, Images } from "../../../theme";
import { Actions } from "react-native-router-flux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemeManager } from "../../../../ThemeManager";
import ConvertHeader from "../../common/ConvertHeader";
import { strings } from "../../../../Localization";
import WebView from "react-native-webview";
// import CookieManager from 'react-native-cookies';
// import CookieManager from '@react-native-cookies/cookies';
import SelectDropdown from "react-native-select-dropdown";
import {
  getActiveCoinList,
  postBuySell,
  getUserAllBalance,
  getBalanceDetails,
  getCurrencyDetails,
  // bankListAction,
  addBankCardAction,
  addBankCardUpdate,
  gooneyDetailsAction,
  getProfile1,
  getDepositCoinListPairs,
  fiatDepositCardAction,
  fiatDepositBankAction,
  getPaymentGatewayKetDetails,
  fiatTransactionCallback,
  getWithdrawFiatList,
  getWithdrawLimitFiat,
  getAllBeneficiaryFiat,
  withdrawFiatCardAction,
  withdrawFiatBankAction,
  fiatTransactionWithdrawCallback,
  getFundsLimit,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import * as constants from "../../../Constants";
import styles from "./ChooseCryptoStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { showMessage } from "react-native-flash-message";
import { parse } from "@babel/core";
import Singleton from "../../../Singleton";

let fiatArr = [];
let coinArr = [];
let withdrawCoinList = [];
const ChooseCrypto = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { isThemeUpdate } = useSelector((state) => state?.tradeReducer);
  const [buyBtnSelected, setBuyBtnSelected] = useState(true);
  const [currencyValue, setCurrencyValue] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [currencyValueSell, setCurrencyValueSell] = useState("");
  const [coinValueSell, setCoinValueSell] = useState("");
  const activeCoin = useSelector((state) => state?.activeCoin);
  const buySellReducer = useSelector((state) => state?.buySellReducer);
  const tradeReducer = useSelector((state) => state?.tradeReducer);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [receiveDeposit, setReceiveDeposit] = useState("");
  const [receiveWithdraw, setReceiveWithdraw] = useState("");
  const [usdRate, setUsdRate] = useState("");
  // allBalance
  const [tierStatus, setTierStatus] = useState("");
  const [fiatCurrency, setFiatCurrency] = useState([]);
  const [coinList, setCoinList] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("btc");
  const [toCurrency, setToCurrency] = useState("USD");
  const [availableBalance, setAvailableBalance] = useState("");
  const [itemSelectedIndex, setItemSelectedIndex] = useState(0);
  const [itemSelectedWithdrawIndex, setItemSelectedWithdrawIndex] = useState(0);
  const [itemSelectedBankIndex, setItemSelectedBankIndex] = useState(0);
  const [itemSelectedBankWithdrawIndex, setItemSelectedBankWithdrawIndex] =
    useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [transactionFees, setTransactionFees] = useState("");
  const [toggleBankCard, setToggleBankCard] = useState(true);
  const [leastDepositAmount, setLeastDepositAmount] = useState("");
  const [minDepositAmount, setMinDepositAmount] = useState("");
  const [depositFees, setDepositFees] = useState("");
  //
  const [leastWithdrawAmount, setLeastWithdrawAmount] = useState("");

  const [minWithdrawAmount, setMinWithdrawAmount] = useState("");
  const [withdrawTrxFees, setWithdrawTrxFees] = useState("");
  const [selectedWithdrawCurrency, setSelectedWithdrawCurrency] = useState("");
  //
  const [countryCode, setCountryCode] = useState("");
  const [showCardToggle, setShowCardToggle] = useState(false);
  const [supportedCurrency, setSupportedCurrency] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAvailableAmount, setWithdrawAvailableAmount] = useState("");
  const [receiverGetWithdraw, setReceiverGetWithdraw] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFaStatus, setTwoFaStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  //
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [trxToken, setTrxToken] = useState("");
  const [ibanId, setIbanId] = useState("");
  const [benId, setBenId] = useState("");
  //
  const [showWeb, setShowWeb] = useState(false);
  const [showPaymentWeb, setShowPaymentWeb] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [webUrl, setWebUrl] = useState("");
  const [twoFA, setTwoFA] = useState("");
  const [withdrawCurrencyList, setWithdrawCurrencyList] = useState([]);
  const [checkVerification, setCheckVerification] = useState(false);
  const [calculatedDeposits, setCalculatedDeposits] = useState("0");
  const [calculatedWithdraw, setCalculatedWithdraw] = useState("0");
  // const [twoFaStatus, setTwoFaStatus] = useState(false);

  //
  const withDetails = useSelector((state) => state?.withDetails);
  // const bankListReducer = useSelector(state => state?.bankListReducer);
  const addBankCardReducer = useSelector((state) => state?.addBankCardReducer);
  const fiatDepositReducer = useSelector((state) => state?.fiatDepositReducer);
  const withdrawListReducer = useSelector(
    (state) => state?.withdrawListReducer
  );
  const fiatTrxWithdrawCallbackReducer = useSelector(
    (state) => state?.fiatTrxWithdrawCallbackReducer
  );
  const withdrawFiatCurrencyReducer = useSelector(
    (state) => state?.withdrawFiatCurrencyReducer
  );

  const gooneyDetailsReducer = useSelector(
    (state) => state?.gooneyDetailsReducer
  );
  const paymentGatewayReducer = useSelector(
    (state) => state?.paymentGatewayReducer
  );
  const depositListReducer = useSelector((state) => state?.depositListReducer);
  const withdrawFiatBeneficiaryReducer = useSelector(
    (state) => state?.withdrawFiatBeneficiaryReducer
  );
  const fundsLimitReducer = useSelector((state) => state?.fundsLimitReducer);

  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  useEffect(() => {
    props.navigation.addListener("didFocus", async (event) => {
      dispatch(getActiveCoinList());
      dispatch(getFundsLimit());
      dispatch(getPaymentGatewayKetDetails());
      dispatch(gooneyDetailsAction());
      dispatch(getDepositCoinListPairs("deposit"));
      dispatch(getWithdrawFiatList("withdrawal"));
      setCurrencyValue("");
      setCoinValue("");
      setCurrencyValueSell("");
      setCoinValueSell("");
      dispatch(getUserAllBalance());
      dispatch(getProfile1())
        .then(async (res) => {
          let statusTier = await checkUserVerificationStatusDeposit();
          checkTwoFaStatusDeposit();
        })
        .catch((err) => {});

      getUserProfile();
    });
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [gooneyDetailsReducer?.gooneyDetailsSuccess]);
  //
  const checkUserVerificationStatusDeposit = () => {
    return new Promise(async (resolve, rej) => {
      let tierStatusValue = "";
      var res = await Singleton.getInstance().getData(constants.USER_DATA);
      let parsedRes = JSON.parse(res);

      setUserData(parsedRes);

      try {
        let confirmations = parsedRes?.labels.find(
          (item) => item.value === "verified" && item.key === "tier_1"
        );
        // return confirmations;
        if (confirmations === undefined) {
          setCheckVerification(false);

          Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
          tierStatusValue = "unverified";
        } else if (confirmations?.value === "verified") {
          tierStatusValue = "tier_1";
          setTierStatus(tierStatusValue);

          let confirmations_tier2 = parsedRes?.labels.find(
            (item) => item.value === "verified" && item.key === "tier_2"
          );

          let confirmations_tier3 = parsedRes?.labels.find(
            (item) => item.value === "verified" && item.key === "tier_3"
          );
          let confirmations_tier4 = parsedRes?.labels.find(
            (item) => item.value === "verified" && item.key === "tier_4"
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
          Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
          setCheckVerification(false);
        }
      } catch (err) {}

      return resolve(tierStatus);
    });
  };
  const checkTwoFaStatusDeposit = () => {
    return new Promise(async (resolve, rej) => {
      var res = await Singleton.getInstance().getData(constants.USER_DATA);
      let parsedRes = JSON.parse(res);

      setUserData(parsedRes);
      if (parsedRes.otp === false) {
        setTwoFaStatus(true);
      } else {
        setTwoFaStatus(false);
      }
    });
  };
  const checkUserVerificationStatus = () => {
    return new Promise(async (resolve, rej) => {
      let tierStatusValue = "";
      var res = await Singleton.getInstance().getData(constants.USER_DATA);
      let parsedRes = JSON.parse(res);

      setUserData(parsedRes);
      if (parsedRes.otp === false) {
        // Alert.alert(constants.APP_NAME, 'Please enable 2FA.');
        setTwoFaStatus(true);
      } else {
        try {
          let confirmations = parsedRes?.labels.find(
            (item) => item.value === "verified" && item.key === "tier_1"
          );
          let confirmations_tier2 = parsedRes?.labels.find(
            (item) => item.value === "verified" && item.key === "tier_2"
          );
          let confirmations_tier3 = parsedRes?.labels.find(
            (item) => item.value === "verified" && item.key === "tier_3"
          );
          let confirmations_tier4 = parsedRes?.labels.find(
            (item) => item.value === "verified" && item.key === "tier_4"
          );
          if (confirmations === undefined) {
            setCheckVerification(false);
            Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
            tierStatusValue = "unverified";
          } else if (confirmations?.value === "verified") {
            tierStatusValue = "tier_1";
            setTierStatus(tierStatusValue);
            setCheckVerification(true);
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
          } else {
            // alert('hello');
            Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
            setCheckVerification(false);
          }
        } catch (err) {}
      }
      setTierStatus(tierStatusValue);
      return resolve(tierStatus);
    });
  };

  const checkUserVerificationOnWithdraw = () => {
    setBuyBtnSelected(false);
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        setUserData(JSON.parse(res));
        if (JSON.parse(res).otp === false) {
          // Alert.alert(constants.APP_NAME, 'Please enable 2FA.');
          setTwoFaStatus(true);
        } else {
          try {
            let confirmations = JSON.parse(res)?.labels.find(
              (item) => item.value === "verified" && item.key === "tier_1"
            );
            if (confirmations === undefined) {
              setCheckVerification(false);
              Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
            } else if (confirmations?.value === "verified") {
              dispatch(getPaymentGatewayKetDetails());
              setCoinValue("");
              setCurrencyValue("");
              setBuyBtnSelected(false);
              let supportCountry =
                gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_countries.find(
                  (item) => item.toUpperCase() == countryCode?.toUpperCase()
                );

              setShowCardToggle(supportCountry ? true : false);
              let supportCurrency =
                gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_currencies.find(
                  (item) =>
                    item.toUpperCase() ==
                    withdrawCurrencyList[0].id.toUpperCase()
                );
              let coinName = withdrawCurrencyList[0].id;
              let usdPrice = getUsdPrice(coinName);
              setUsdRate(usdPrice?.price);
              dispatch(getCurrencyDetails({ coinName }));
              setSupportedCurrency(supportCurrency ? true : false);
              setItemSelectedWithdrawIndex(0);
              setItemSelectedBankWithdrawIndex(0);
            } else {
              // alert('hello');
              Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
              setCheckVerification(false);
            }
          } catch (err) {}
        }
      })
      .catch((err) => {});
  };
  const checkUserVerification = async (statusTier) => {
    if (!withdrawAmount) {
      await Singleton.getInstance().showError(
        strings.trade_tab.please_enter_amount
      );
    } else if (!twoFA) {
      await Singleton.getInstance().showError(
        strings.titleName.please_enter_2fa
      );
    } else if (twoFA?.length != 6) {
      await Singleton.getInstance().showError(
        strings.trade_tab.please_enter_valid_2fa
      );
    } else {
      if (statusTier == "tier_3") {
        onContinueWithdrawPress();
      } else if (statusTier == "tier_2") {
        onContinueWithdrawPress();
      } else if (statusTier == "tier_1") {
      }
    }
  };
  const getUserProfile = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        let profileData = JSON.parse(res)?.profiles[0];
        let phonesData = JSON.parse(res)?.phones[0];

        let phonesCountryData = JSON.parse(res)?.phones;
        let validatedCountry = phonesCountryData?.find(
          (item) => item.country != null
        );
        let validatedCountryData = phonesCountryData?.find(
          (item) => item.validated_at != null
        );
        setFirstName(profileData?.first_name);
        setLastName(profileData?.last_name);
        setAddress(profileData?.address);
        setCity(profileData?.city);
        setPostalCode(profileData?.postcode);
        setCountryCode(
          validatedCountryData != undefined
            ? validatedCountryData?.country
            : profileData?.country
        );
        setPhoneNumber(phonesData?.number);
        let supportCountry =
          gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_countries?.find(
            (item) =>
              item.toUpperCase() == validatedCountryData?.country?.toUpperCase()
          );
        setShowCardToggle(supportCountry ? true : false);
        let supportCurrency =
          gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_currencies?.find(
            (item) => item.toUpperCase() == fiatCurrency[0]?.id.toUpperCase()
          );
        let usdPrice = getUsdPrice(fiatCurrency[0].id);
        dispatch(getAllBeneficiaryFiat(fiatCurrency[0].id));
        setUsdRate(usdPrice?.price);
        setSupportedCurrency(supportCurrency ? true : false);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (activeCoin?.activeCoinInfo != null) {
      fiatArr = [];
      coinArr = [];
      const arr = activeCoin?.activeCoinInfo;
      arr.map((item, index) => {
        if (item.type === "fiat") {
          fiatArr.push(item);
        } else {
          coinArr.push(item);
        }
      });
      let minDeposit = fiatArr.find(
        (item) => item.id.toUpperCase() == fiatArr[0].id.toUpperCase()
      );
      setMinDepositAmount(minDeposit.min_deposit_amount);
      setLeastDepositAmount(
        parseFloat(minDeposit.min_deposit_amount) +
          parseFloat(minDeposit.deposit_fee)
      );
      setSelectedCurrency(minDeposit.id);
      setTransactionFees(minDeposit.deposit_fee);
      setFiatCurrency(fiatArr);
      let coinName = fiatArr[0].id;
      dispatch(getCurrencyDetails({ coinName }));
      setCoinList(coinArr);
    }
  }, [activeCoin?.activeCoinInfo]);
  useEffect(() => {
    if (withdrawListReducer?.withdrawListInfo != null) {
      withdrawCoinList = [];
      const array = withdrawListReducer?.withdrawListInfo;
      array.map((item, index) => {
        if (item.type === "fiat") {
          withdrawCoinList.push(item);
        }
      });
      let minWithdraw = withdrawCoinList.find(
        (item) => item.id.toUpperCase() == withdrawCoinList[0].id.toUpperCase()
      );
      setMinWithdrawAmount(minWithdraw.min_withdraw_amount);
      setLeastWithdrawAmount(
        parseFloat(minWithdraw.min_withdraw_amount) +
          parseFloat(minWithdraw.withdraw_fee)
      );
      dispatch(getAllBeneficiaryFiat(minWithdraw.id));
      setSelectedWithdrawCurrency(minWithdraw.id);
      setWithdrawTrxFees(minWithdraw.withdraw_fee);
      setWithdrawCurrencyList(withdrawCoinList);
    }
    //
  }, [withdrawListReducer?.withdrawListInfo]);
  const onContinuePress = () => {
    if (!buyAmount) {
      Singleton.getInstance().showError(strings.trade_tab.please_enter_amount);
    } else if (parseFloat(buyAmount) < parseFloat(leastDepositAmount)) {
      Singleton.getInstance().showError(
        strings.trade_tab.amount_will_greater + leastDepositAmount
      );
    } else if (toggleBankCard) {
      dispatch(
        fiatDepositCardAction(
          selectedCurrency,
          buyAmount,
          "card",
          firstName,
          lastName,
          address,
          city,
          postalCode,
          countryCode,
          phoneNumber,
          paymentGatewayReducer?.gooneyKey?.data
        )
      )
        .then((res) => {
          if (res?.returnType === "REDIRECT") {
            setWebUrl(res?.redirectUrl);
            setShowWeb(true);
            setBuyAmount("");
            setReceiveDeposit("");
          }
        })
        .catch((err) => {
          setBuyAmount("");
          setReceiveDeposit("");
          setCalculatedDeposits(0);
          Singleton.getInstance().showError(err);
        });
    } else {
      let isVerifiedValue =
        withdrawFiatBeneficiaryReducer?.allBenificiariesFiat.filter(
          (item) => item.state === "verified"
        );
      console.log("isVerifiedValue=-=-=->>", isVerifiedValue);
      console.log("ibanId=-=-=->>", ibanId);

      const bankId = ibanId ? ibanId : isVerifiedValue[0]?.id;
      console.log("bankId=-=-", bankId);
      console.log(
        " withdrawFiatBeneficiaryReducer?.allBenificiariesFiat[0].id=-=-",
        isVerifiedValue[0]?.id
      );
      console.log(
        " withdrawFiatBeneficiaryReducer?=-=-",
        withdrawFiatBeneficiaryReducer
      );
      Alert.alert(
        constants.APP_NAME_CAPS,
        strings.trade_tab.are_you_really_want_to_make_this_transaction,
        [
          {
            text: strings.spot.yes,
            onPress: () => {
              dispatch(
                fiatDepositBankAction(
                  selectedCurrency.toUpperCase(),
                  buyAmount,
                  "sepa",
                  firstName,
                  lastName,
                  address,
                  city,
                  postalCode,
                  countryCode,
                  phoneNumber,
                  bankId
                )
              )
                .then((res) => {
                  if (res?.returnType === "FINISHED") {
                    setBuyAmount("");
                    setReceiveDeposit("");

                    let coinName = selectedCurrency.toLowerCase();

                    dispatch(getCurrencyDetails({ coinName }));
                    Singleton.getInstance().showWarn(
                      receiveDeposit +
                        selectedCurrency.toUpperCase() +
                        " " +
                        strings.trade_tab.fiat_deposit_successfully
                    );
                    dispatch(getActiveCoinList());
                    dispatch(getFundsLimit());
                  }
                })
                .catch((err) => {
                  setBuyAmount("");
                  setReceiveDeposit("");
                  setCalculatedDeposits(0);
                  Singleton.getInstance().showError(err);
                });
            },
          },
          {
            text: strings.spot.no,
            onPress: () => {},
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const onContinueWithdrawPress = () => {
    if (!withdrawAmount) {
      Singleton.getInstance().showWshowErrorarn(
        strings.trade_tab.please_enter_amount
      );
    } else if (parseFloat(withdrawAmount) < parseFloat(leastWithdrawAmount)) {
      Singleton.getInstance().showError(
        strings.trade_tab.amount_will_greater + leastWithdrawAmount
      );
    } else if (
      parseFloat(withdrawAmount) >
      parseFloat(withDetails?.currencyDetails?.balance)
    ) {
      Singleton.getInstance().showError("Balance is insufficient");
    } else if (toggleBankCard) {
      let cardType = "card";
      dispatch(
        withdrawFiatCardAction(
          address,
          withdrawAmount,
          city,
          countryCode,
          selectedWithdrawCurrency,
          firstName,
          lastName,
          twoFA,
          phoneNumber,
          postalCode,
          paymentGatewayReducer?.gooneyKey?.data,
          cardType
        )
      )
        .then((res) => {
          if (res?.returnType === "REDIRECT") {
            setWebUrl(res?.redirectUrl);
            setShowWeb(true);
            setWithdrawAmount("");
            setCalculatedWithdraw(0);
            setTwoFA("");
          }
        })
        .catch((err) => {
          setWithdrawAmount("");
          setCalculatedWithdraw(0);
          setReceiveWithdraw("");
          Singleton.getInstance().showError(err);
        });
    } else {
      let isVerifiedValue =
        withdrawFiatBeneficiaryReducer?.allBenificiariesFiat.filter(
          (item) => item.state === "verified"
        );
      console.log("isVerifiedValue=-=-=->>", isVerifiedValue);
      console.log("ibanId=-=-=->>", ibanId);

      const bankId = ibanId ? ibanId : isVerifiedValue[0]?.id;
      console.log("bankId=-=-", bankId);
      console.log(
        " withdrawFiatBeneficiaryReducer?.allBenificiariesFiat[0].id=-=-",
        isVerifiedValue[0]?.id
      );

      Alert.alert(
        constants.APP_NAME_CAPS,
        strings.trade_tab.are_you_really_want_to_make_this_transaction,
        [
          {
            text: strings.spot.yes,
            onPress: () => {
              let cardType = "sepa";
              dispatch(
                withdrawFiatBankAction(
                  address,
                  withdrawAmount,
                  city,
                  countryCode,
                  selectedWithdrawCurrency,
                  firstName,
                  lastName,
                  twoFA,
                  phoneNumber,
                  postalCode,
                  cardType,
                  bankId
                )
              )
                .then((res) => {
                  if (res?.returnType === "FINISHED") {
                    setWithdrawAmount("");
                    setReceiveWithdraw("");
                    setCalculatedWithdraw(0);
                    dispatch(getActiveCoinList());
                    dispatch(getFundsLimit());
                    setTwoFA("");
                    let coinName = selectedWithdrawCurrency.toLowerCase();

                    dispatch(getCurrencyDetails({ coinName }));
                    dispatch(getActiveCoinList());
                    dispatch(getFundsLimit());
                    Singleton.getInstance().showWarn(
                      strings.trade_tab.fiat_withdraw_successfully
                    );
                  }
                })
                .catch((err) => {
                  setWithdrawAmount("");
                  setReceiveWithdraw("");
                  setCalculatedWithdraw(0);
                  Singleton.getInstance().showError(err);
                });
            },
          },
          {
            text: strings.spot.no,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };
  const getUsdPrice = (name) => {
    let data = activeCoin?.activeCoinInfo?.find((value) => value.id == name);
    return data;
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
            gooneyDetailsReducer?.isLoading ||
            withDetails?.currencyDetailsLoading ||
            activeCoin?.isLoading ||
            addBankCardReducer?.isLoading ||
            fiatDepositReducer?.isLoading
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
                  setShowWeb(false);
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
                if (buyBtnSelected) {
                  if (data?.url?.includes("success")) {
                    dispatch(
                      fiatTransactionCallback(
                        fiatDepositReducer?.fiatDepositSuccess?.uuid,
                        "success",
                        fiatDepositReducer?.fiatDepositSuccess?.purchaseId
                      )
                    )
                      .then((res) => {
                        let coinName = selectedCurrency.toLowerCase();

                        dispatch(getActiveCoinList());
                        dispatch(getFundsLimit());
                        dispatch(getCurrencyDetails({ coinName }))
                          .then((res) => {
                            setShowWeb(false);
                            Actions.currentScene != "ChooseCrypto" &&
                              Actions.pop();
                            setCalculatedDeposits("0");
                            Alert.alert(
                              constants.APP_NAME_CAPS,
                              strings.trade_tab.payment_success
                            );
                          })
                          .catch((err) => {
                            alert(err);
                          });
                      })
                      .catch((err) => {});
                  }
                  if (data?.url.includes("fail")) {
                    dispatch(
                      fiatTransactionCallback(
                        fiatDepositReducer?.fiatDepositSuccess?.uuid,
                        "fail",
                        fiatDepositReducer?.fiatDepositSuccess?.purchaseId
                      )
                    )
                      .then((res) => {
                        let coinName = selectedCurrency.toLowerCase();

                        dispatch(getActiveCoinList());
                        dispatch(getFundsLimit());
                        dispatch(getCurrencyDetails({ coinName }));
                        setCalculatedDeposits("0");

                        setShowWeb(false);
                        Alert.alert(
                          constants.APP_NAME_CAPS,
                          strings.trade_tab.payment_failed
                        );
                        Actions.pop();
                      })
                      .catch((err) => {
                        console.log(
                          "errr response trx buy sell= fail-=-=->>>",
                          err
                        );
                      });
                  }
                } else {
                  if (data?.url?.includes("success")) {
                    dispatch(
                      fiatTransactionWithdrawCallback(
                        withdrawFiatCurrencyReducer?.withdrawFiatInfo?.uuid,
                        "success",
                        withdrawFiatCurrencyReducer?.withdrawFiatInfo
                          ?.purchaseId
                      )
                    )
                      .then((res) => {
                        let coinName = selectedWithdrawCurrency.toLowerCase();

                        dispatch(getActiveCoinList());
                        dispatch(getFundsLimit());
                        dispatch(getCurrencyDetails({ coinName }));
                        setReceiveWithdraw("");
                        setCalculatedWithdraw("0");
                        Actions.currentScene != "ChooseCrypto" && Actions.pop();
                        setShowWeb(false);
                        Alert.alert(
                          constants.APP_NAME_CAPS,
                          strings.trade_tab.payment_success
                        );
                      })
                      .catch((err) => {
                        console.log("errr response trx buy sell=-=-=->>>", err);
                      });
                  }
                  if (data?.url.includes("fail")) {
                    dispatch(
                      fiatTransactionWithdrawCallback(
                        withdrawFiatCurrencyReducer?.withdrawFiatInfo?.uuid,
                        "fail",
                        withdrawFiatCurrencyReducer?.withdrawFiatInfo
                          ?.purchaseId
                      )
                    )
                      .then((res) => {
                        let coinName = selectedWithdrawCurrency.toLowerCase();

                        dispatch(getActiveCoinList());
                        dispatch(getFundsLimit());
                        dispatch(getCurrencyDetails({ coinName }));
                        setCalculatedWithdraw("0");
                        setReceiveWithdraw("");
                        Actions.currentScene != "ChooseCrypto" && Actions.pop();

                        setShowWeb(false);
                        Alert.alert(
                          constants.APP_NAME_CAPS,
                          strings.trade_tab.payment_failed
                        );
                      })
                      .catch((err) => {
                        console.log(
                          "errr response trx buy sell= fail-=-=->>>",
                          err
                        );
                      });
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
                {strings.trade_tab.deposit_withdraw_fiat}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  Actions.currentScene != "HistoryWallet" &&
                    Actions.push("HistoryWallet");
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
            <Loader isLoading={buySellReducer?.isLoading} />
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
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(getPaymentGatewayKetDetails());
                      setCoinValueSell("");
                      setCurrencyValueSell("");
                      setBuyBtnSelected(true);
                      let supportCountry =
                        gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_countries.find(
                          (item) =>
                            item.toUpperCase() == countryCode?.toUpperCase()
                        );

                      setShowCardToggle(supportCountry ? true : false);
                      let supportCurrency =
                        gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_currencies.find(
                          (item) =>
                            item.toUpperCase() ==
                            fiatCurrency[0].id.toUpperCase()
                        );
                      let coinName = fiatCurrency[0].id;
                      let usdPrice = getUsdPrice(coinName);
                      setUsdRate(usdPrice?.price);

                      setItemSelectedIndex(0);
                      setCalculatedDeposits("0");
                      setCalculatedWithdraw("0");
                      setBuyAmount("");
                      setWithdrawAmount("");
                      setReceiveDeposit("");
                      setReceiveWithdraw("");
                      setItemSelectedBankIndex(0);
                      dispatch(getCurrencyDetails({ coinName }));
                      setSupportedCurrency(supportCurrency ? true : false);
                    }}
                    style={{
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
                      {strings.trade_tab.deposit}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setBuyAmount("");
                      setWithdrawAmount("");
                      setCalculatedDeposits("0");
                      setCalculatedWithdraw("0");
                      setReceiveDeposit("");
                      setReceiveWithdraw("");
                      checkUserVerificationOnWithdraw();
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
                      {strings.trade_tab.withdraw}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {buyBtnSelected ? (
                    <View>
                      <View>
                        <View>
                          <FiatDropDown
                            labelText={strings.trade_tab.select_currency}
                            // placeholder={'0.00'}
                            placeholderTextColor={
                              ThemeManager.colors.inactiveTextColor
                            }
                            dropdownBtnStyle={{
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            }}
                            key={"first"}
                            data={fiatCurrency}
                            onSelect={(selectedItem, index) => {
                              let data =
                                gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_currencies.find(
                                  (item) =>
                                    item.toUpperCase() ==
                                    selectedItem.id.toUpperCase()
                                );
                              setSupportedCurrency(data ? true : false);
                              setSelectedCurrency(selectedItem.id);
                              let usdPrice = getUsdPrice(selectedItem?.id);
                              setUsdRate(usdPrice?.price);

                              setMinDepositAmount(
                                selectedItem.networks[0].deposit_fee
                              );
                              setDepositFees(
                                selectedItem.networks[0].min_deposit_amount
                              );
                              setTransactionFees(
                                selectedItem.networks[0].deposit_fee
                              );
                              setBuyAmount("");

                              setLeastDepositAmount(
                                parseFloat(
                                  selectedItem.networks[0].deposit_fee
                                ) +
                                  parseFloat(
                                    selectedItem.networks[0].min_deposit_amount
                                  )
                              );
                              const coinName = selectedItem.id;
                              dispatch(getCurrencyDetails({ coinName }));
                              setCalculatedDeposits("0");
                              setReceiveWithdraw("");
                              setReceiveDeposit("");
                              setItemSelectedIndex(index);
                              setCoinValue("");
                              setCurrencyValue("");
                            }}
                            selectedIndex={itemSelectedIndex}
                            value={!coinValue ? "" : currencyValue}
                            keyboardType={"numeric"}
                            itemSelected={
                              fiatCurrency && fiatCurrency[0]?.id?.toUpperCase()
                            }
                            onChangeText={(text) => {
                              var validNumber = new RegExp(/^\d*\.?\d*$/);
                              let obj = buySellReducer?.buySellInfo;
                              let value = Object.keys(obj).map(
                                (key) => obj[key]
                              );

                              if (validNumber.test(text)) {
                                setCurrencyValue(text);
                                if (parseFloat(text) > 0) {
                                  let calculateValue = +text / +value[0]["USD"];

                                  setCoinValue(
                                    Singleton.getInstance().exponentialToDecimalConvert(
                                      calculateValue.toString()
                                    )
                                  );
                                } else {
                                  setCoinValue("0");
                                }
                              }
                            }}
                          />
                        </View>
                        <View style={{ marginTop: 20 }}>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontFamily: Fonts.regular,
                              fontSize: 16,
                              marginLeft: 16,
                            }}
                          >
                            {strings.trade_tab.important}
                          </Text>
                          <View
                            style={{
                              justifyContent: "flex-start",
                              alignItems: "center",
                              flexDirection: "row",
                              marginVertical: 5,
                            }}
                          >
                            <Image
                              source={{ uri: Images.checked_icon1 }}
                              style={{
                                height: 15,
                                width: 15,
                                resizeMode: "contain",
                                marginLeft: 16,
                                opacity: 0.5,
                              }}
                            />
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontFamily: Fonts.regular,
                                fontSize: 12,
                                marginLeft: 8,
                              }}
                            >
                              {strings.trade_tab.deposit_at_least}{" "}
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.bold,
                                  fontWeight: "bold",
                                  fontSize: 12,
                                  marginLeft: 8,
                                }}
                              >
                                {leastDepositAmount}
                                {selectedCurrency.toUpperCase()}
                              </Text>
                            </Text>
                          </View>
                          <View
                            style={{
                              justifyContent: "flex-start",
                              alignItems: "center",
                              flexDirection: "row",
                              marginVertical: 5,
                            }}
                          >
                            <Image
                              source={{ uri: Images.checked_icon1 }}
                              style={{
                                height: 15,
                                width: 15,
                                resizeMode: "contain",
                                marginLeft: 16,
                                opacity: 0.5,
                              }}
                            />
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontFamily: Fonts.regular,
                                fontSize: 12,
                                marginLeft: 8,
                              }}
                            >
                              {strings.trade_tab.total_transactions}
                              {": "}
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.bold,
                                  fontWeight: "bold",
                                  fontSize: 12,
                                  marginLeft: 8,
                                }}
                              >
                                {"$"}
                                {fundsLimitReducer?.fundsLimitInfo != null
                                  ? Singleton.getInstance().ParseFloatNumberOnly(
                                      fundsLimitReducer?.fundsLimitInfo
                                        ?.transactions?.total,
                                      4
                                    )
                                  : 0}
                              </Text>
                            </Text>
                          </View>
                          <View
                            style={{
                              justifyContent: "flex-start",
                              alignItems: "center",
                              flexDirection: "row",
                              marginVertical: 5,
                            }}
                          >
                            <Image
                              source={{ uri: Images.checked_icon1 }}
                              style={{
                                height: 15,
                                width: 15,
                                resizeMode: "contain",
                                marginLeft: 16,
                                opacity: 0.5,
                              }}
                            />
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontFamily: Fonts.regular,
                                fontSize: 12,
                                marginLeft: 8,
                              }}
                            >
                              {strings.trade_tab.total_limits}
                              {": "}
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontFamily: Fonts.bold,
                                  fontWeight: "bold",
                                  fontSize: 12,
                                  marginLeft: 8,
                                }}
                              >
                                {"$"}
                                {fundsLimitReducer?.fundsLimitInfo != null
                                  ? parseFloat(
                                      fundsLimitReducer?.fundsLimitInfo?.limits
                                        ?.over_all_limit_in_usd
                                    )
                                  : 0}
                              </Text>
                            </Text>
                          </View>
                        </View>

                        <View style={{ marginHorizontal: 16, marginTop: 20 }}>
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexDirection: "row",
                              flex: 1,
                            }}
                          >
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                              }}
                            >
                              {strings.trade_tab.amount}
                            </Text>
                          </View>
                          <TextInput
                            value={buyAmount}
                            onChangeText={(text) => {
                              if (!text) {
                                console.log(
                                  "setCalculatedDeposits==--=-=text",
                                  text
                                );

                                setBuyAmount(text);
                                setCalculatedDeposits("0");
                                return;
                              }

                              var validNumber = new RegExp(/^\d*\.?\d*$/);
                              let val = parseFloat(usdRate) * parseFloat(text);
                              console.log("setCalculatedDeposits==--=-=", val);
                              setCalculatedDeposits(val);

                              let overAllLimit = parseFloat(
                                fundsLimitReducer?.fundsLimitInfo?.limits
                                  ?.over_all_limit_in_usd
                              );
                              const countTransaction =
                                fundsLimitReducer?.fundsLimitInfo?.transactions
                                  ?.count;
                              let totalTransaction = parseFloat(
                                fundsLimitReducer?.fundsLimitInfo?.transactions
                                  ?.total
                              );
                              let yearTransaction = parseFloat(
                                fundsLimitReducer?.fundsLimitInfo?.transactions
                                  ?.year
                              );
                              let dailyLimitUSD = parseFloat(
                                fundsLimitReducer?.fundsLimitInfo?.limits
                                  ?.daily_limit_in_usd
                              );
                              let dayTransaction = parseFloat(
                                fundsLimitReducer?.fundsLimitInfo?.transactions
                                  ?.h24
                              );

                              if (validNumber.test(text)) {
                                setBuyAmount(text);

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
                                    if (text >= leastDepositAmount) {
                                      setReceiveDeposit(
                                        parseFloat(text) -
                                          parseFloat(transactionFees)
                                      );
                                    } else {
                                      setReceiveDeposit("");
                                    }
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
                                    if (
                                      parseFloat(leastDepositAmount) <=
                                      parseFloat(text)
                                    ) {
                                      setReceiveDeposit(
                                        parseFloat(text) -
                                          parseFloat(transactionFees)
                                      );
                                    } else {
                                      setReceiveDeposit("");
                                    }
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
                                    if (1 * totalAmount > 1 * overAllLimit) {
                                      Singleton.getInstance().showError(
                                        "Limit exceeded."
                                      );
                                    } else {
                                      if (
                                        parseFloat(text) >=
                                        parseFloat(leastWithdrawAmount)
                                      ) {
                                        setReceiveWithdraw(
                                          parseFloat(text) -
                                            parseFloat(withdrawTrxFees)
                                        );
                                      } else {
                                        setReceiveWithdraw("");
                                      }
                                    }
                                  }
                                }
                                // if (tierStatus == 'tier_3') {
                                //   let totalAmount =
                                //     parseFloat(val) +
                                //     parseFloat(yearTransaction);

                                //   if (1 * totalAmount < 1 * overAllLimit) {
                                //     if (
                                //       parseFloat(leastDepositAmount) <=
                                //       parseFloat(text)
                                //     ) {
                                //       setReceiveDeposit(
                                //         parseFloat(text) -
                                //           parseFloat(transactionFees),
                                //       );
                                //     } else {
                                //       setReceiveDeposit('');
                                //     }
                                //   } else {
                                //     Singleton.getInstance().showError(
                                //       'Limit exceeded.',
                                //     );
                                //     return;
                                //   }
                                // }
                              }
                            }}
                            maxLength={10}
                            placeholder={"0"}
                            placeholderTextColor={
                              ThemeManager.colors.inactiveTextColor
                            }
                            onEndEditing={(e) => {
                              if (
                                parseFloat(e.nativeEvent.text) <
                                parseFloat(leastDepositAmount)
                              ) {
                                Singleton.getInstance().showError(
                                  strings.trade_tab.deposit_at_least +
                                    " " +
                                    leastDepositAmount +
                                    selectedCurrency.toUpperCase()
                                );
                              }
                            }}
                            onSubmitEditing={() => {
                              if (
                                parseFloat(buyAmount) <
                                parseFloat(leastDepositAmount)
                              ) {
                                Singleton.getInstance().showError(
                                  strings.trade_tab.deposit_at_least +
                                    " " +
                                    leastDepositAmount +
                                    selectedCurrency.toUpperCase()
                                );
                              }
                            }}
                            keyboardType="numeric"
                            returnKeyType="done"
                            style={[
                              {
                                backgroundColor:
                                  ThemeManager.colors.crypto_input,
                                height: 50,
                                textAlign: "left",
                                padding: 10,
                                color: ThemeManager.colors.textColor1,
                                fontSize: 15,
                                fontFamily: Fonts.regular,
                                marginTop: 5,
                              },
                            ]}
                          />
                          <View style={{ alignItems: "flex-end" }}>
                            <Text
                              style={{
                                color: ThemeManager.colors.selectedTextColor,
                                fontSize: 10,
                                fontFamily: Fonts.regular,
                                marginVertical: 5,
                              }}
                            >
                              {/* {strings.trade_tab.equals} */}
                              {"$"}
                              {calculatedDeposits
                                ? parseFloat(calculatedDeposits).toFixed(2)
                                : 0}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              marginVertical: 5,
                            }}
                          >
                            {strings.trade_tab.available_balance}:{" "}
                            {withDetails?.currencyDetails?.balance}
                          </Text>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              marginTop: 10,
                            }}
                          >
                            {strings.trade_tab.transaction_fees}:{" "}
                            {transactionFees}
                          </Text>
                          {receiveDeposit ? (
                            <View style={{ height: 30, width: "100%" }}>
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontSize: 16,
                                  fontFamily: Fonts.regular,
                                  marginTop: 8,
                                }}
                              >
                                {strings.convert.you_will_receive}:{" "}
                                {receiveDeposit}
                              </Text>
                            </View>
                          ) : (
                            <View style={{ height: 30, width: "100%" }} />
                          )}
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              marginTop: 10,
                            }}
                          >
                            {strings.trade_tab.transaction_by}:
                          </Text>
                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                setToggleBankCard(true);
                              }}
                              style={{
                                justifyContent: "flex-start",
                                alignItems: "center",
                                flexDirection: "row",
                              }}
                            >
                              <View
                                style={{
                                  height: 15,
                                  width: 15,
                                  borderWidth: 0.8,
                                  borderColor: ThemeManager.colors.textColor1,
                                  marginTop: 4,
                                  backgroundColor: toggleBankCard
                                    ? ThemeManager.colors.selectedTextColor
                                    : null,
                                }}
                              />
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontSize: 16,
                                  fontFamily: Fonts.regular,
                                  marginTop: 15,
                                  marginBottom: 10,
                                  marginLeft: 8,
                                }}
                              >
                                {strings.trade_tab.bank_card}
                              </Text>
                            </TouchableOpacity>
                            {showCardToggle && supportedCurrency && (
                              <TouchableOpacity
                                onPress={() => {
                                  setToggleBankCard(false);
                                }}
                                style={{
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    height: 15,
                                    width: 15,
                                    borderWidth: 0.8,
                                    borderColor: ThemeManager.colors.textColor1,
                                    marginTop: 4,
                                    backgroundColor: toggleBankCard
                                      ? null
                                      : ThemeManager.colors.selectedTextColor,
                                  }}
                                />
                                <Text
                                  style={{
                                    color: ThemeManager.colors.textColor1,
                                    fontSize: 16,
                                    fontFamily: Fonts.regular,
                                    marginTop: 15,
                                    marginBottom: 10,
                                    marginLeft: 8,
                                  }}
                                >
                                  {strings.trade_tab.bank_transfer_sepa}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View>
                          {toggleBankCard === false ? (
                            <View>
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontSize: 16,
                                  fontFamily: Fonts.regular,
                                  marginTop: 15,
                                  marginBottom: -50,
                                  marginHorizontal: 16,
                                }}
                              >
                                {strings.trade_tab.banks}
                              </Text>
                              <View>
                                <BankListDropDownWithdraw
                                  placeholder={"Select your bank account"}
                                  placeholderTextColor={
                                    ThemeManager.colors.inactiveTextColor
                                  }
                                  dropdownBtnStyle={{
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                  }}
                                  key={"second"}
                                  onAddBank={() => {
                                    if (twoFaStatus) {
                                      Singleton.getInstance().showError(
                                        strings.trade_tab
                                          .please_enable_2fa_first
                                      );
                                    } else {
                                      Actions.currentScene !== "ManagePayee" &&
                                        Actions.ManagePayee({
                                          currency: selectedCurrency,
                                        });
                                    }
                                  }}
                                  data={
                                    withdrawFiatBeneficiaryReducer?.allBenificiariesFiat
                                  }
                                  onSelect={(selectedItem, index) => {
                                    setIbanId(selectedItem.id);
                                    console.log(
                                      "selectedItem bank id=-=->>>",
                                      selectedItem.id
                                    );
                                    setItemSelectedBankIndex(index);
                                  }}
                                  selectedIndex={itemSelectedBankIndex}
                                  value={!coinValue ? "" : currencyValue}
                                  keyboardType={"numeric"}
                                  itemSelected={"Select your bank account"}
                                  onChangeText={(text) => {}}
                                  emptyText={"Please add bank account"}
                                />
                                <View>
                                  {twoFaStatus ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        Actions.currentScene !=
                                          " GoogleAuthenticatorStep01" &&
                                          Actions.GoogleAuthenticatorStep01();
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color:
                                            ThemeManager.colors.walletDPbtn,
                                          fontSize: 16,
                                          fontFamily: Fonts.regular,
                                          textAlign: "right",
                                          marginVertical: 15,
                                          marginRight: 16,
                                        }}
                                      >
                                        {strings.trade_tab.enable_2fa}
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        Actions.currentScene !==
                                          "ManagePayee" &&
                                          Actions.ManagePayee({
                                            currency: selectedCurrency,
                                          });
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color:
                                            ThemeManager.colors.walletDPbtn,
                                          fontSize: 16,
                                          fontFamily: Fonts.regular,
                                          textAlign: "right",
                                          marginVertical: 15,
                                          marginRight: 16,
                                        }}
                                      >
                                        {strings.trade_tab.manage_bank}
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          onContinuePress();
                        }}
                        style={{
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          marginHorizontal: 15,
                          marginVertical: 20,
                          backgroundColor: ThemeManager.colors.Depositbtn,
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor,
                            fontFamily: Fonts.regular,
                            fontSize: 16,
                          }}
                        >
                          {strings.trade_tab.continue}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <View>
                        <View>
                          <FiatDropDown
                            labelText={strings.trade_tab.select_currency}
                            placeholderTextColor={
                              ThemeManager.colors.inactiveTextColor
                            }
                            dropdownBtnStyle={{
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            }}
                            key={"five"}
                            data={withdrawCurrencyList}
                            onSelect={(selectedItem, index) => {
                              setSelectedWithdrawCurrency(selectedItem?.id);
                              let usdPrice = getUsdPrice(selectedItem?.id);
                              setUsdRate(usdPrice?.price);
                              setMinWithdrawAmount(
                                selectedItem?.min_withdraw_amount
                              );
                              setWithdrawTrxFees(
                                selectedItem?.networks[0].withdraw_fee
                              );
                              let data =
                                gooneyDetailsReducer?.gooneyDetailsSuccess?.supported_currencies.find(
                                  (item) =>
                                    item.toUpperCase() ==
                                    selectedItem.id.toUpperCase()
                                );
                              setSupportedCurrency(data ? true : false);
                              setSelectedCurrency(selectedItem.id);
                              setLeastWithdrawAmount(
                                parseFloat(
                                  selectedItem.networks[0].withdraw_fee
                                ) +
                                  parseFloat(selectedItem?.min_withdraw_amount)
                              );
                              const coinName = selectedItem.id;
                              setCalculatedWithdraw(0);
                              setWithdrawAmount("");
                              setReceiveWithdraw("");
                              dispatch(getCurrencyDetails({ coinName }));
                              setItemSelectedWithdrawIndex(index);
                              dispatch(getAllBeneficiaryFiat(selectedItem.id));
                            }}
                            selectedIndex={itemSelectedWithdrawIndex}
                            keyboardType={"numeric"}
                            itemSelected={
                              withdrawCurrencyList &&
                              withdrawCurrencyList[0]?.id?.toUpperCase()
                            }
                            onChangeText={(text) => {
                              var validNumber = new RegExp(/^\d*\.?\d*$/);
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor1,
                            fontFamily: Fonts.regular,
                            fontSize: 16,
                            marginLeft: 16,
                            marginTop: 20,
                          }}
                        >
                          {strings.trade_tab.important}
                        </Text>
                        <View
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                          }}
                        >
                          <Image
                            source={{ uri: Images.checked_icon1 }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              marginLeft: 16,
                              opacity: 0.5,
                            }}
                          />
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                              marginLeft: 8,
                            }}
                          >
                            {strings.trade_tab.min_value}{" "}
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontFamily: Fonts.bold,
                                fontWeight: "bold",
                                fontSize: 12,
                                marginLeft: 8,
                              }}
                            >
                              {leastWithdrawAmount}
                              {selectedWithdrawCurrency.toUpperCase()}
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                          }}
                        >
                          <Image
                            source={{ uri: Images.checked_icon1 }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              marginLeft: 16,
                              opacity: 0.5,
                            }}
                          />
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontFamily: Fonts.bold,
                              fontWeight: "800",
                              fontSize: 12,
                              marginLeft: 8,
                            }}
                          >
                            {strings.trade_tab.kyc}
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontFamily: Fonts.regular,
                                fontSize: 12,
                                marginLeft: 8,
                              }}
                            >
                              {strings.trade_tab.kyc_must_be}
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            flexDirection: "row",
                            marginVertical: 5,
                          }}
                        >
                          <Image
                            source={{ uri: Images.checked_icon1 }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              marginLeft: 16,
                              marginTop: 5,
                              opacity: 0.5,
                            }}
                          />
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                              marginLeft: 8,
                              flex: 1,
                              marginRight: 15,
                            }}
                          >
                            {strings.trade_tab.do_not_withdraw_directly}
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                          }}
                        >
                          <Image
                            source={{ uri: Images.checked_icon1 }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              marginLeft: 16,
                              opacity: 0.5,
                            }}
                          />
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                              marginLeft: 8,
                            }}
                          >
                            {strings.trade_tab.total_transactions}
                            {": "}
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontFamily: Fonts.bold,
                                fontWeight: "bold",
                                fontSize: 12,
                                marginLeft: 8,
                              }}
                            >
                              {"$"}
                              {fundsLimitReducer?.fundsLimitInfo != null
                                ? Singleton.getInstance().ParseFloatNumberOnly(
                                    fundsLimitReducer?.fundsLimitInfo
                                      ?.transactions?.total,
                                    4
                                  )
                                : 0}
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                          }}
                        >
                          <Image
                            source={{ uri: Images.checked_icon1 }}
                            style={{
                              height: 15,
                              width: 15,
                              resizeMode: "contain",
                              marginLeft: 16,
                              opacity: 0.5,
                            }}
                          />
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                              marginLeft: 8,
                            }}
                          >
                            {strings.trade_tab.total_limits}
                            {": "}
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontFamily: Fonts.bold,
                                fontWeight: "bold",
                                fontSize: 12,
                                marginLeft: 8,
                              }}
                            >
                              {"$"}
                              {fundsLimitReducer?.fundsLimitInfo != null
                                ? parseFloat(
                                    fundsLimitReducer?.fundsLimitInfo?.limits
                                      ?.over_all_limit_in_usd
                                  )
                                : 0}
                            </Text>
                          </Text>
                        </View>
                        <View style={{ marginHorizontal: 16, marginTop: 20 }}>
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexDirection: "row",
                              flex: 1,
                              // backgroundColor: 'red',
                            }}
                          >
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                              }}
                            >
                              {strings.trade_tab.amount}
                            </Text>
                          </View>
                          <TextInput
                            value={withdrawAmount}
                            onChangeText={(text) => {
                              var validNumber = new RegExp(/^\d*\.?\d*$/);
                              if (
                                parseFloat(text) >
                                parseFloat(
                                  withDetails?.currencyDetails?.balance
                                )
                              ) {
                                Singleton.getInstance().showError(
                                  "Insufficient Balance."
                                );
                                return;
                              } else {
                                if (validNumber.test(text)) {
                                  setWithdrawAmount(text);
                                  let overAllLimit = parseFloat(
                                    fundsLimitReducer?.fundsLimitInfo?.limits
                                      ?.over_all_limit_in_usd
                                  );
                                  const countTransaction =
                                    fundsLimitReducer?.fundsLimitInfo
                                      ?.transactions?.count;
                                  let totalTransaction = parseFloat(
                                    fundsLimitReducer?.fundsLimitInfo
                                      ?.transactions?.total
                                  );
                                  let yearTransaction = parseFloat(
                                    fundsLimitReducer?.fundsLimitInfo
                                      ?.transactions?.year
                                  );
                                  let dailyLimitUSD = parseFloat(
                                    fundsLimitReducer?.fundsLimitInfo?.limits
                                      ?.daily_limit_in_usd
                                  );
                                  let dayTransaction = parseFloat(
                                    fundsLimitReducer?.fundsLimitInfo
                                      ?.transactions?.h24
                                  );
                                  let val =
                                    parseFloat(usdRate) * parseFloat(text);
                                  setCalculatedWithdraw(val);
                                  if (tierStatus == "tier_1") {
                                    let totalAmount =
                                      parseFloat(val) +
                                      parseFloat(totalTransaction);

                                    if (
                                      1 * totalAmount > 1 * overAllLimit ||
                                      countTransaction > 2
                                    ) {
                                      setCalculatedWithdraw("");
                                      Singleton.getInstance().showError(
                                        "Limit exceeded. Upgrade to KYC tier 2."
                                      );
                                    } else {
                                      if (
                                        parseFloat(text) >=
                                        parseFloat(leastWithdrawAmount)
                                      ) {
                                        setReceiveWithdraw(
                                          parseFloat(text) -
                                            parseFloat(withdrawTrxFees)
                                        );
                                      } else {
                                        setReceiveWithdraw("");
                                      }
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
                                      if (
                                        parseFloat(text) >=
                                        parseFloat(leastWithdrawAmount)
                                      ) {
                                        setReceiveWithdraw(
                                          parseFloat(text) -
                                            parseFloat(withdrawTrxFees)
                                        );
                                      } else {
                                        setReceiveWithdraw("");
                                      }
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
                                      if (1 * totalAmount > 1 * overAllLimit) {
                                        Singleton.getInstance().showError(
                                          "Limit exceeded."
                                        );
                                      } else {
                                        if (
                                          parseFloat(text) >=
                                          parseFloat(leastWithdrawAmount)
                                        ) {
                                          setReceiveWithdraw(
                                            parseFloat(text) -
                                              parseFloat(withdrawTrxFees)
                                          );
                                        } else {
                                          setReceiveWithdraw("");
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                            onEndEditing={(e) => {
                              if (
                                parseFloat(e.nativeEvent.text) <
                                parseFloat(leastWithdrawAmount)
                              ) {
                                Singleton.getInstance().showError(
                                  strings.trade_tab.withdraw_at_least +
                                    " " +
                                    leastWithdrawAmount +
                                    selectedWithdrawCurrency.toUpperCase()
                                );
                              }
                            }}
                            onSubmitEditing={() => {
                              if (
                                parseFloat(withdrawAmount) <
                                parseFloat(leastWithdrawAmount)
                              ) {
                                Singleton.getInstance().showError(
                                  strings.trade_tab.withdraw_at_least +
                                    " " +
                                    leastWithdrawAmount +
                                    selectedWithdrawCurrency.toUpperCase()
                                );
                              }
                            }}
                            maxLength={10}
                            placeholder={"0"}
                            placeholderTextColor={
                              ThemeManager.colors.inactiveTextColor
                            }
                            keyboardType="numeric"
                            returnKeyType="done"
                            style={[
                              {
                                backgroundColor:
                                  ThemeManager.colors.crypto_input,
                                height: 50,
                                textAlign: "left",
                                padding: 10,
                                color: ThemeManager.colors.textColor1,
                                fontSize: 15,
                                fontFamily: Fonts.regular,
                                marginTop: 5,
                              },
                            ]}
                          />
                          <View style={{ alignItems: "flex-end" }}>
                            <Text
                              style={{
                                color: ThemeManager.colors.selectedTextColor,
                                fontSize: 10,
                                fontFamily: Fonts.regular,
                                marginVertical: 5,
                                // textAlign: 'right',
                              }}
                            >
                              {strings.trade_tab.equals}
                              {": $"}
                              {calculatedWithdraw
                                ? parseFloat(calculatedWithdraw).toFixed(2)
                                : 0}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              marginVertical: 5,
                            }}
                          >
                            {strings.trade_tab.available_balance}:{" "}
                            {withDetails?.currencyDetails?.balance}
                          </Text>

                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              marginTop: 5,
                            }}
                          >
                            {strings.trade_tab.transaction_fees}:{" "}
                            {withdrawTrxFees}
                          </Text>
                          {receiveWithdraw ? (
                            <View style={{ height: 30, width: "100%" }}>
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontSize: 16,
                                  fontFamily: Fonts.regular,
                                  marginTop: 8,
                                }}
                              >
                                {strings.trade_tab.receiver_will_get}:{" "}
                                {receiveWithdraw}
                              </Text>
                            </View>
                          ) : (
                            <View style={{ height: 30, width: "100%" }} />
                          )}
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexDirection: "row",
                              flex: 1,
                              marginTop: 20,
                            }}
                          >
                            <Text
                              style={{
                                color: ThemeManager.colors.textColor1,
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                              }}
                            >
                              {strings.trade_tab.two_fa_code}
                            </Text>
                          </View>
                          <TextInput
                            value={twoFA}
                            onChangeText={(text) => {
                              if (constants.ACCOUNT_NUMBER_REGEX.test(text)) {
                                setTwoFA(text);
                              }
                            }}
                            placeholder={"0"}
                            placeholderTextColor={
                              ThemeManager.colors.inactiveTextColor
                            }
                            keyboardType="numeric"
                            returnKeyType="done"
                            maxLength={6}
                            style={[
                              {
                                backgroundColor:
                                  ThemeManager.colors.crypto_input,
                                height: 50,
                                textAlign: "left",
                                padding: 10,
                                color: ThemeManager.colors.textColor1,
                                fontSize: 15,
                                fontFamily: Fonts.regular,
                                marginTop: 5,
                              },
                            ]}
                          />

                          <Text
                            style={{
                              color: ThemeManager.colors.textColor1,
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              marginTop: 15,
                            }}
                          >
                            {strings.trade_tab.transaction_by}:
                          </Text>
                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                setToggleBankCard(true);
                              }}
                              style={{
                                justifyContent: "flex-start",
                                alignItems: "center",
                                flexDirection: "row",
                              }}
                            >
                              <View
                                style={{
                                  height: 15,
                                  width: 15,
                                  borderWidth: 0.8,
                                  borderColor: ThemeManager.colors.textColor1,
                                  marginTop: 4,
                                  backgroundColor: toggleBankCard
                                    ? ThemeManager.colors.selectedTextColor
                                    : null,
                                }}
                              />
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontSize: 16,
                                  fontFamily: Fonts.regular,
                                  marginTop: 15,
                                  marginBottom: 10,
                                  marginLeft: 8,
                                }}
                              >
                                {strings.trade_tab.bank_card}
                              </Text>
                            </TouchableOpacity>
                            {showCardToggle && supportedCurrency && (
                              <TouchableOpacity
                                onPress={() => {
                                  setToggleBankCard(false);
                                }}
                                style={{
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    height: 15,
                                    width: 15,
                                    borderWidth: 0.8,
                                    borderColor: ThemeManager.colors.textColor1,
                                    marginTop: 4,
                                    backgroundColor: toggleBankCard
                                      ? null
                                      : ThemeManager.colors.selectedTextColor,
                                  }}
                                />
                                <Text
                                  style={{
                                    color: ThemeManager.colors.textColor1,
                                    fontSize: 16,
                                    fontFamily: Fonts.regular,
                                    marginTop: 15,
                                    marginBottom: 10,
                                    marginLeft: 8,
                                  }}
                                >
                                  {strings.trade_tab.bank_transfer_sepa}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View>
                          {toggleBankCard === false ? (
                            <View>
                              <Text
                                style={{
                                  color: ThemeManager.colors.textColor1,
                                  fontSize: 16,
                                  fontFamily: Fonts.regular,
                                  marginTop: 15,
                                  marginBottom: -50,
                                  marginHorizontal: 16,
                                  // marginLeft: 8,
                                }}
                              >
                                {strings.trade_tab.banks}
                              </Text>
                              <View>
                                <BankListDropDownWithdraw
                                  placeholder={"Select your beneficiary"}
                                  placeholderTextColor={
                                    ThemeManager.colors.inactiveTextColor
                                  }
                                  dropdownBtnStyle={{
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                  }}
                                  key={"third"}
                                  onAddBank={() => {
                                    Actions.currentScene !== "ManagePayee" &&
                                      Actions.ManagePayee({
                                        currency: selectedWithdrawCurrency,
                                      });
                                  }}
                                  data={
                                    withdrawFiatBeneficiaryReducer?.allBenificiariesFiat
                                  }
                                  onSelect={(selectedItem, index) => {
                                    setBenId(selectedItem.id);
                                    setItemSelectedBankWithdrawIndex(index);
                                  }}
                                  selectedIndex={itemSelectedBankWithdrawIndex}
                                  value={!coinValue ? "" : currencyValue}
                                  keyboardType={"numeric"}
                                  itemSelected={
                                    "Select your beneficiary address"
                                  }
                                  onChangeText={(text) => {}}
                                  emptyText={
                                    "Please add your beneficiary address"
                                  }
                                />
                                <View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      // setIsModalVisible(true)
                                      Actions.currentScene !== "ManagePayee" &&
                                        Actions.ManagePayee({
                                          currency: selectedWithdrawCurrency,
                                        });
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: ThemeManager.colors.walletDPbtn,
                                        fontSize: 16,
                                        fontFamily: Fonts.regular,
                                        textAlign: "right",
                                        marginVertical: 15,
                                        marginRight: 16,
                                      }}
                                    >
                                      {strings.trade_tab.manage_bank}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </View>
                      {twoFaStatus ? (
                        <Button
                          defaultBtn={[
                            styles.btnBottomActive,
                            { marginVertical: 30 },
                          ]}
                          defaultBtnText={{
                            color: ThemeManager.colors.textColor,
                          }}
                          children="Enable 2FA"
                          onPress={() => {
                            // this.submitButtonClicked();
                            Actions.currentScene !=
                              " GoogleAuthenticatorStep01" &&
                              Actions.GoogleAuthenticatorStep01();
                          }}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={async () => {
                            let statusTier =
                              await checkUserVerificationStatus();
                            setTimeout(() => {
                              checkUserVerification(statusTier);
                            }, 0);
                          }}
                          style={{
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            marginHorizontal: 15,
                            marginVertical: 20,
                            backgroundColor: ThemeManager.colors.Depositbtn,
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.regular,
                              fontSize: 16,
                            }}
                          >
                            {strings.trade_tab.continue}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </KeyboardAwareScrollView>
          </>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <Wrap
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: "transparent" },
            ]}
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
                  setIsModalVisible(false);
                }}
              ></TouchableOpacity>
              <KeyboardAwareScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.whiteScreen,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    paddingHorizontal: 15,
                    marginVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      marginVertical: 10,
                      fontSize: 22,
                      fontFamily: Fonts.bold,
                    }}
                  >
                    {strings.trade_tab.manage_bank}
                  </Text>
                  <InputField
                    editable={true}
                    title={strings.trade_tab.account_holder_name}
                    value={addBankCardReducer?.account_holder_name}
                    onChangeText={(value) => {
                      dispatch(
                        addBankCardUpdate({
                          prop: "account_holder_name",
                          value: value,
                        })
                      );
                    }}
                    maxlength={40}
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                      marginVertical: 15,
                    }}
                  />
                  <InputField
                    editable={true}
                    title={strings.trade_tab.account_no}
                    value={addBankCardReducer?.account_no}
                    onChangeText={(value) => {
                      dispatch(
                        addBankCardUpdate({
                          prop: "account_no",
                          value: value,
                        })
                      );
                    }}
                    maxlength={40}
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                    }}
                  />
                  <InputField
                    editable={true}
                    title={strings.trade_tab.bic}
                    value={addBankCardReducer?.bic}
                    onChangeText={(value) => {
                      dispatch(
                        addBankCardUpdate({
                          prop: "bic",
                          value: value,
                        })
                      );
                    }}
                    maxlength={6}
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                      marginVertical: 15,
                    }}
                  />
                </View>
              </KeyboardAwareScrollView>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setIsModalVisible(false);
                }}
              ></TouchableOpacity>
            </View>
          </Wrap>
        </Modal>
      </Wrap>
    </>
  );
};

export default ChooseCrypto;
