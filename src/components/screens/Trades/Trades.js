/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Touchable,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
  Platform,
  Keyboard,
  StatusBar,
  Dimensions,
  RefreshControl,
} from "react-native";
import useStyles from "./TradesStyle";
import {
  Wrap,
  TabIcon,
  AskBook,
  BidsBook,
  Spinner,
  Loader,
  TradeOpenOrder,
  TradeOpenOrderLimited,
  ButtonPrimary,
} from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import PagerView from "react-native-pager-view";

import TradeHeader from "../../common/TradeHeader";
import { strings } from "../../../../Localization";
import BorderLine from "../../common/BorderLine";
import { colors, Fonts, Images } from "../../../theme";
import SelectDropdown from "react-native-select-dropdown";
import TradeInput from "../../common/TradeInput";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FlatList } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import ActionSheet from "react-native-actionsheet";
import fonts from "../../../theme/fonts";
import { useDispatch, useSelector } from "react-redux";
import Singleton from "../../../Singleton";
import { getMultiLingualData } from "../../../../Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  getMarketList,
  getOrderHistory,
  orderHistoryUpdate,
  getBalanceDetails,
  tradeValuesUpdate,
  placeTradeOrder,
  stopPreviousConnection,
  tradeSocketClose,
  callOrderSocket,
  buySellSocket,
  getUserAllBalance,
  getTreadingFeee,
  getPublicTrade,
  callTradeSocket,
  getTreadingRules,
  getDepositCoinListPairs,
  resetDepositList,
  getOpenOrders,
  getProfile1,
  updateMarketPair,
  resetOpenOrderHistory,
  resetOpenOrderSingleHistory,
  getOpenOrdersSingle,
} from "../../../Redux/Actions";

import * as constants from "../../../Constants";
import { event } from "react-native-reanimated";
import TradingRules from "./TradingRule";
import PercentageChange from "./PercentageChange";
import { getAllMarket } from "../../../App";
import { ScrollableTabView } from "../../../Libs/react-native-scrollable-tabview";
import FavMarket from "../../common/FavMarket";
import BchPage from "../../common/BchPage";
import LinearGradient from "react-native-linear-gradient";
// import { Actions } from "react-native-router-flux";
import { EventRegister } from "react-native-event-listeners";
const listLimit = [
  { title: strings.trade_tab.limit, value: 0 },
  { title: strings.trade_tab.market, value: 1 },
];
const listSellLimit = [
  { title: strings.trade_tab.limit, value: 0 },
  { title: strings.trade_tab.market, value: 1 },
  { title: strings.trade_tab.stop_limit, value: 2 },
];
// const options=[
//   strings.buy_sell_market.default,
//   strings.buy_sell_market.sell_order,
//   strings.buy_sell_market.buy_order,

//   strings.buy_sell_market.cancel,
// ]
let coinToDollar = 0;
let uuid;
const screenHeight = Dimensions.get("window").height;
const Trades = (props) => {
  const styles = useStyles(ThemeManager);
  const ref = useRef(null);
  // const pagerRef = useRef(null);
  // const pagerRef2 = useRef(null);
  const didFocusTimerRef = useRef(null);
  const dispatch = useDispatch();

  const [selectedItemBuy, setSelectedItemBuy] = useState("Limit");
  const [selectedItemSell, setSelectedItemSell] = useState("Limit");
  const [refreshing, setRefreshing] = useState(false);
  // const ActionSheetBuySell = useRef(null);
  // const ActionSheetDepositTransfer = useRef(null);
  // const [showChangePairModal, setShowChangePairModal] = useState(false);
  const [selectedLimitedIndex, setSelectedLimitedIndex] = useState(null);
  const [userPricePrecision, setuserPricePrecision] = useState(null);
  const [userPricePrecisionValue, setuserPricePrecisionValue] = useState(null);
  const [defaultPrecision, setDefaultPrecision] = useState(null);
  const [spotPageSelected, setSpotPageSelected] = useState(1);
  const [limitValue, setLimitValue] = useState("");
  const [spotLimitValue, setSpotLimitValue] = useState("");
  const [selectedPercentage, setSelectedPercentage] = useState();
  const [btnOneSelected, setBtnOneSelected] = useState(false);
  const [btnTwoSelected, setBtnTwoSelected] = useState(false);
  const [isShowRules, setShowRules] = useState(false);
  const [btnThreeSelected, setBtnThreeSelected] = useState(false);
  const [btnFourSelected, setBtnFourSelected] = useState(false);
  const [selectedButton, setSelectedButton] = useState("0%");
  //buysell btn
  const [buySellBtnSelect, setBuySellBtnSelect] = useState(false);
  const [sellButtonSelected, setSellButtonSelected] = useState(true);
  const [openOrderPageSelected, setOpenOrderPageSelected] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [openOrderList, setOpenOrderList] = useState([]);
  const [amount, setAmount] = useState(0);
  const [showBuyOrder, setShowBuyOrder] = useState(true);
  const [showSellOrder, setShowSellOrder] = useState(true);
  const [isArrowClicked, setArrowClicked] = useState(false);
  const [limitSelected, setLimitSelected] = useState(true);
  const [stopLimitSelected, setStopLimitSelected] = useState(false);
  const [amountSelected, setAmountSelected] = useState(true);
  const [priceChange, setPriceChange] = useState("");
  const [currentSelectedBalance, setCurrentSelectedBalance] = useState(null);
  const [fundsArray, setFundsArray] = useState([]);
  //reducers
  const marketSocketReducer = useSelector(
    (state) => state?.marketSocketReducer
  );
  const FundsReducer = useSelector((state) => state?.FundsReducer);
  const tradeReducer = useSelector((state) => state?.tradeReducer);
  // console.log("tradeReducer=-=-=-=-", tradeReducer);
  const orderHistoryReducer = useSelector(
    (state) => state?.orderHistoryReducer
  );
  const withDetails = useSelector((state) => state?.withDetails);
  const depositListReducer = useSelector((state) => state?.depositListReducer);
  const [pricePrecision, setPricePrecision] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [modalVisibleMarket, setModalVisibleMarket] = useState(false);
  const [showCancelVisible, setShowCancelVisible] = useState(false);
  const [showSingleCancelVisible, setShowSingleCancelVisible] = useState(false);
  const [userData, setuserData] = useState(null);
  const [showLargeData, setShowLargeData] = useState(false);
  const { selectedCoinPair, priceTrade, amountDecimalValue } = useSelector(
    (state) => state?.tradeReducer
  );
  const [loginStatus, setLoginStatus] = useState(false);
  const [selectedOrderListIndex, setSelectedOrderListIndex] = useState(0);
  const [actionModal, setActionModal] = useState(false);
  const [actionDepositModal, setActionDepositModal] = useState(false);

  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const { marketData, marketFavData, pairArray } = useSelector(
    (state) => state?.marketSocketReducer
  );
  const { coinToUsdData } = useSelector((state) => state?.FundsReducer);
  const [selectedSellIndex, setSelectedSellIndex] = useState(0);
  const [selectedBuyIndex, setSelectedBuyIndex] = useState(0);
  const [priceDefaultPrecision, setPriceDefaultPrecision] = useState(null);
  const [priceDefaultPrecisionValue, setPriceDefaultPrecisionValue] =
    useState(null);
  const [amountDefaultPrecision, setAmountDefaultPrecision] = useState(null);
  const [amountDefaultPrecisionValue, setAmountDefaultPrecisionValue] =
    useState(null);
  const [kycStatus, setKycStatus] = useState(false);
  useEffect(() => {
    setuserPricePrecision(2);
    setuserPricePrecisionValue(0.2);
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        // console.log("check isLogin=-=-1=-=>>>", isLogin);
        if (isLogin == "true" && isLogin != null) {
          setLoginStatus(true);
          dispatch(getUserAllBalance())
            .then((res) => {
              openOderDetails(res, true);
            })
            .catch((err) => {
              console.log(
                "err getUserAllBalance-=-=-=>>>2",
                JSON.stringify(err)
              );
            });
        } else {
          setLoginStatus(false);
        }
      })
      .catch((err) => { });

    // dispatch(getProfile1());
  }, [selectedCoinPair?.base_unit]);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // getProfileData();
    updateTradeOnRefresh();
  }, [refreshing]);
  const updateTradeOnRefresh = () => {
    dispatch(getProfile1())
      .then((res) => {
        // console.log("get profile 1-=-=-=>>>", res);
        dispatch(getDepositCoinListPairs("deposit"));
      })
      .catch((err) => {
        console.log("err get profile=-=-=-=>>>", JSON.stringify(err));
        setRefreshing(false);
      });

    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: "",
      })
    );
    dispatch(
      tradeValuesUpdate({
        prop: "limitValue",
        value: "",
      })
    );

    let currentAmount =
      renderLastPrice(selectedCoinPair?.name) != undefined
        ? renderLastPrice(selectedCoinPair?.name).last
        : " ";

    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: currentAmount,
      })
    );

    let currentPrice =
      renderLastPrice(selectedCoinPair?.name) != undefined
        ? renderLastPrice(selectedCoinPair?.name).last
        : " ";
    dispatch(
      tradeValuesUpdate({
        prop: "limitValue",
        value: currentPrice,
      })
    );
    setShowRules(false);

    dispatch(getMarketList());

    setTimeout(async () => {
      await updateSocket(
        selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
      );
    }, 200);
    // }

    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        console.log("check isLogin=-=-=2-=>>>", isLogin);
        if (isLogin == "true") {
          setLoginStatus(true);
          checkVerificationTrade();
          dispatch(getUserAllBalance())
            .then((res) => {
              // console.log("getUserAllBalance=>>>", res);
              openOderDetails(res, true);
              setRefreshing(false);
            })
            .catch((err) => {
              setRefreshing(false);
              console.log(
                "err getUserAllBalance-=-=-=>>>2",
                JSON.stringify(err)
              );
            });
        } else {
          setLoginStatus(false);
          setRefreshing(false);
        }
      })
      .catch((err) => {
        setRefreshing(false);
      });
  };
  useEffect(() => {
    dispatch(getProfile1())
      .then((res) => {
        // console.log("get profile 1-=-=-=>>>1", res);
        dispatch(getDepositCoinListPairs("deposit"));
      })
      .catch((err) => {
        console.log("err get profile=-=-=-=>>>2", JSON.stringify(err));
      });
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        console.log("check isLogin=-=-=2-=ioooo-->>>", isLogin);
        if (isLogin == "true") {
          setLoginStatus(true);
          checkVerificationTrade();
        } else {
          setLoginStatus(false);
        }
      })
      .catch((err) => { });
    // checkUserVerification();
    var currentRoute = props?.navigation?.state?.routeName;

    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: "",
      })
    );
    dispatch(
      tradeValuesUpdate({
        prop: "limitValue",
        value: "",
      })
    );

    dispatch(getMarketList());
    let currentAmount1 =
      renderLastPrice(selectedCoinPair?.name) != undefined
        ? renderLastPrice(selectedCoinPair?.name).last
        : " ";

    let currentPrice1 =
      renderLastPrice(selectedCoinPair?.name) != undefined
        ? renderLastPrice(selectedCoinPair?.name).last
        : " ";
    dispatch(
      tradeValuesUpdate({
        prop: "limitValue",
        value: currentPrice1,
      })
    );
    props.navigation.addListener("didFocus", async (event) => {
      dispatch(getProfile1())
        .then((res) => {
          // console.log("get profile 1-=-=-=>>>", res);
          dispatch(getDepositCoinListPairs("deposit"));
        })
        .catch((err) => {
          console.log("err get profile=-=-=-=>>>", JSON.stringify(err));
        });

      dispatch(
        tradeValuesUpdate({
          prop: "priceTrade",
          value: "",
        })
      );
      dispatch(
        tradeValuesUpdate({
          prop: "limitValue",
          value: "",
        })
      );

      let currentAmount =
        renderLastPrice(selectedCoinPair?.name) != undefined
          ? renderLastPrice(selectedCoinPair?.name).last
          : " ";

      dispatch(
        tradeValuesUpdate({
          prop: "priceTrade",
          value: currentAmount,
        })
      );

      let currentPrice =
        renderLastPrice(selectedCoinPair?.name) != undefined
          ? renderLastPrice(selectedCoinPair?.name).last
          : " ";
      dispatch(
        tradeValuesUpdate({
          prop: "limitValue",
          value: currentPrice,
        })
      );
      setShowRules(false);

      dispatch(getMarketList());

      setTimeout(async () => {
        await updateSocket(
          selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
        );
      }, 100);
      // }
      if (currentRoute === event.state.routeName) {
        resetData1();
        Actions.refresh();
      }
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          console.log("check isLogin=-=-=2-=>>>", isLogin);
          if (isLogin == "true") {
            setLoginStatus(true);
            checkVerificationTrade();
            dispatch(getUserAllBalance())
              .then((res) => {
                openOderDetails(res, true);
              })
              .catch((err) => {
                console.log(
                  "err getUserAllBalance-=-=-=>>>2",
                  JSON.stringify(err)
                );
              });
          } else {
            setLoginStatus(false);
          }
        })
        .catch((err) => { });
      // dispatch(getUserAllBalance()).then(res => {
      //   openOderDetails(res, true);
      // });
    });
    props.navigation.addListener("didBlur", (event) => {
      dispatch(
        orderHistoryUpdate({
          prop: "orderHistory",
          value: [],
        })
      );
      dispatch(
        tradeValuesUpdate({
          prop: "priceTrade",
          value: "",
        })
      );
    });

    dispatch(
      updateMarketPair(
        selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
      )
    );
    dispatch(
      buySellSocket({
        pair: selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit,
      })
    );
    themeStatus();
    return () => {
      dispatch(stopPreviousConnection());
      dispatch(tradeSocketClose());
      dispatch(resetDepositList);
      dispatch(
        tradeValuesUpdate({
          prop: "priceTrade",
          value: "",
        })
      );
    };
  }, []);
  const themeStatus = () => {
    Singleton.getInstance()
      .getData(constants.IS_THEME_ENABLE)
      .then((res) => {
        if (res === "theme2") {
          // setSelectedMode('Dark Mode');
        } else {
          // setSelectedMode('Light Mode');
        }
      })
      .catch((err) => {
        Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, "theme1");
        // setSelectedMode('Light Mode');
      });
  };
  const checkVerification = () => {
    Keyboard.dismiss();
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        setuserData(JSON.parse(res));

        try {
          // let confirmations = JSON.parse(res)?.labels.find(
          //   (item) => item.value === "verified" && item.key === "tier_1"
          // );
          if (JSON.parse(res)?.level == 3) {
            setKycStatus(true);
            requestPlaceOrder();
          } else {
            // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
            Singleton.getInstance().showError(
              "Please complete KYC for trading"
            );
            setKycStatus(false);
          }
          // if (confirmations === undefined) {
          //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
          // } else if (confirmations?.value === "verified") {
          //   requestPlaceOrder();
          // } else {
          //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
          // }
        } catch (err) { }
      })
      .catch((err) => { });
  };
  const checkVerificationTrade = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        setuserData(JSON.parse(res));

        try {
          if (JSON.parse(res)?.level == 3) {
            setKycStatus(true);
            // setKycStatus(true);
            // Actions.currentScene != "SpotTrade" && Actions.push("SpotTrade");
          } else {
            // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
            Singleton.getInstance().showError(
              "Please complete KYC for trading"
            );
            setKycStatus(false);
          }
          // let confirmations = JSON.parse(res)?.labels.find(
          //   (item) => item.value === "verified" && item.key === "tier_1"
          // );

          // if (confirmations === undefined) {
          //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
          // } else if (confirmations?.value === "verified") {
          //   Actions.currentScene != "SpotTrade" && Actions.push("SpotTrade");
          // } else {
          //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
          // }
        } catch (err) { }
      })
      .catch((err) => { });
  };
  const checkUserVerification = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        setuserData(JSON.parse(res));

        try {
          if (JSON.parse(res)?.level == 3) {
            setKycStatus(true);
            Actions.currentScene != "SpotTrade" && Actions.push("SpotTrade");
          } else {
            // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
            Singleton.getInstance().showError(
              "Please complete KYC for trading"
            );
            setKycStatus(false);
          }
          // let confirmations = JSON.parse(res)?.labels.find(
          //   (item) => item.value === "verified" && item.key === "tier_1"
          // );

          // if (confirmations === undefined) {
          //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
          // } else if (confirmations?.value === "verified") {
          //   Actions.currentScene != "SpotTrade" && Actions.push("SpotTrade");
          // } else {
          //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
          // }
        } catch (err) { }
      })
      .catch((err) => { });
  };
  useEffect(() => {
    // console.log("getProfile1-==-=-=-=-=>>>1");
    dispatch(getTreadingFeee())
      .then((res) => {
        // console.log("getProfile1-==-=-=-=-=>>>2");
        tradeFeesFun(
          selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit,
          res
        );
        Singleton.getInstance()
          .getData(constants.IS_LOGIN)
          .then((isLogin) => {
            // console.log("check isLogin=-=-3=-=>>>", isLogin);
            if (isLogin == "true") {
              setLoginStatus(true);

              dispatch(getProfile1())
                .then((response) => {
                  // console.log("getProfile1-==-=-=-=-=>>>", res);
                  dispatch(
                    getTreadingRules(
                      selectedCoinPair?.base_unit +
                      selectedCoinPair?.quote_unit,
                      response.uid
                    )
                  );
                })
                .catch((errr) => {
                  console.log("getProfile1-==-=-=-=-=>>>errr", errr);
                  // alert('edfs');
                });
            } else {
              setLoginStatus(false);
              dispatch(
                getTreadingRules(
                  selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit,
                  ""
                )
              );
            }
          })
          .catch((err) => {
            console.log("check isLogin=-=-=4-=>>> error");
          });
      })
      .catch((errr) => {
        console.log("getTreadingFeee-==-=-=-=-=>>>errr", errr);
        // alert('edfs');
      });
    let currentAmount1 =
      renderLastPrice(selectedCoinPair?.name) != undefined
        ? renderLastPrice(selectedCoinPair?.name).last
        : " ";

    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: currentAmount1,
      })
    );
    dispatch(
      tradeValuesUpdate({
        prop: "limitValue",
        value: currentAmount1,
      })
    );
    props.navigation.addListener("didFocus", async (event) => {
      let arr = [];

      for (var z = tradeReducer?.tradeFees?.price_precision; z > 0; z--) {
        let vl = "0.";
        for (let x = 1; x < z; x++) {
          vl += "0";
        }
        vl += "1";

        arr.push({
          title: Singleton.getInstance().exponentialToDecimalConvert(vl),
          value: z,
        });
      }

      setPricePrecision(arr);
      setDefaultPrecision(arr.length - 2);
      setSelectedLimitedIndex(arr.length - 2);
      // console.log("arr.length - 2=-=-=-=", arr.length - 2);
      let currentAmount =
        renderLastPrice(selectedCoinPair?.name) != undefined
          ? renderLastPrice(selectedCoinPair?.name).last
          : " ";

      dispatch(
        tradeValuesUpdate({
          prop: "priceTrade",
          value: currentAmount,
        })
      );

      dispatch(
        tradeValuesUpdate({
          prop: "limitValue",
          value: currentAmount,
        })
      );
      if (didFocusTimerRef.current) {
        clearTimeout(didFocusTimerRef.current);
      }

      didFocusTimerRef.current = setTimeout(() => {
        dispatch(stopPreviousConnection()).then((res) => {
          dispatch(
            updateMarketPair(
              selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
            )
          );
          dispatch(
            buySellSocket({
              pair: selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit,
            })
          );
        });
      }, 800);
    });

    return () => {
      dispatch(stopPreviousConnection());
      dispatch(tradeSocketClose());
      setuserPricePrecisionValue(0.2);
      dispatch(
        orderHistoryUpdate({
          prop: "orderHistory",
          value: [],
        })
      );
    };
  }, [selectedCoinPair?.name]);
  const getAmountPrecision = () => {
    let arrAmt = [];
    for (var z = tradeReducer?.tradeFees?.amount_precision; z > 0; z--) {
      let vl = "0.";
      for (let x = 1; x < z; x++) {
        vl += "0";
      }
      vl += "1";

      arrAmt.push({
        title: Singleton.getInstance().exponentialToDecimalConvert(vl),
        value: z,
      });
    }
    setAmountDefaultPrecision(arrAmt[0]?.title);
    setAmountDefaultPrecisionValue(arrAmt[0]?.value);
    // console.log("arrAmt[0]?.title - 1=-=-=->>>arr", arrAmt[0]?.title);
    // console.log("arrAmt[0]?.value-=-=->>>arr", arrAmt[0]?.value);
  };
  useEffect(() => {
    getAmountPrecision();
    let arr = [];
    for (var z = tradeReducer?.tradeFees?.price_precision; z > 0; z--) {
      let vl = "0.";
      for (let x = 1; x < z; x++) {
        vl += "0";
      }
      vl += "1";

      arr.push({
        title: Singleton.getInstance().exponentialToDecimalConvert(vl),
        value: z,
      });
    }

    setPricePrecision(arr);
    setDefaultPrecision(arr.length - 2);
    // console.log("arr.length - 2=-=-=-rrrr=", arr.length - 2);
    // console.log("arr.length - 1=-=-=->>>", arr.length - 1);
    // console.log("arr.length - 1=-=-=->>>arr", arr);
    setPriceDefaultPrecision(arr[0]?.title);
    setPriceDefaultPrecisionValue(arr[0]?.value);
    // console.log("setPriceDefaultPrecisionValue>>arr", arr[0]?.value);
    // console.log("setPriceDefaultPrecisionValue>>titile", arr[0]?.title);

    setSelectedLimitedIndex(arr.length - 2);
    dispatch(
      tradeValuesUpdate({
        prop: "userPrecision",
        value: arr,
      })
    );
    props.navigation.addListener("didFocus", async (event) => {
      arr = [];
      getAmountPrecision();
      for (var z = tradeReducer?.tradeFees?.price_precision; z > 0; z--) {
        let vl = "0.";
        for (let x = 1; x < z; x++) {
          vl += "0";
        }
        vl += "1";
        arr.push({
          title: Singleton.getInstance().exponentialToDecimalConvert(vl),
          value: z,
        });
      }
      setPricePrecision(arr);
      setDefaultPrecision(arr.length - 2);
      setSelectedLimitedIndex(arr.length - 2);
      setPriceDefaultPrecision(arr[0]?.title);
      setPriceDefaultPrecisionValue(arr[0]?.value);
      // console.log("setPriceDefaultPrecisionValue>>arreee", arr[0]?.value);
      // console.log("setPriceDefaultPrecisionValue>>titileeeee", arr[0]?.title);
      // console.log("arr.length - 1=-=-=-eee>>>", arr.length - 1);
      // console.log("arr.length - 1=-=-=-eee>>>arr", arr);
      dispatch(
        tradeValuesUpdate({
          prop: "userPrecision",
          value: arr,
        })
      );
    });
  }, [tradeReducer?.tradeFees?.price_precision]);

  const updateSocket = async (pair) => {
    dispatch(callOrderSocket({ pair: pair }));
  };
  const resetData1 = () => {
    dispatch(tradeValuesUpdate({ prop: "tradeAmount", value: "" }));
    dispatch(tradeValuesUpdate({ prop: "totalAmount", value: "" }));
    setSelectedButton("0%");
  };

  useEffect(() => {
    // console.log("props?.item=-=-=-", props?.item);
    if (props?.item === "buy") {
      setBuySellBtnSelect(true);
      setSellButtonSelected(false);
    } else if (props?.item === "sell") {
      setBuySellBtnSelect(false);
      setSellButtonSelected(true);
    } else {
      setBuySellBtnSelect(true);
      setSellButtonSelected(false);
    }
    return () => { };
  }, [props.item]);

  const tradeFeesFun = async (pair, allPairData) => {
    let data = allPairData;
    let pairData = data.find((item) => item.id == pair);
    // console.log("tradeFeesFun=-=-=-", pairData);
    dispatch(
      tradeValuesUpdate({
        prop: "tradeFees",
        value: pairData,
      })
    );
    dispatch(
      tradeValuesUpdate({
        prop: "amountDecimalValue",
        value: pairData?.amount_precision,
      })
    );
    dispatch(
      tradeValuesUpdate({
        prop: "priceDecimalValue",
        value: pairData?.price_precision,
      })
    );
    let currentAmount =
      renderLastPrice(selectedCoinPair?.name) != undefined
        ? renderLastPrice(selectedCoinPair?.name).last
        : " ";
    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: (1 * currentAmount).toFixed(pairData?.price_precision),
      })
    );
  };

  const percentageSelection = (value) => {
    let balance =
      1 *
      renderUserTotalBalance(
        sellButtonSelected
          ? selectedCoinPair?.base_unit
          : selectedCoinPair?.quote_unit
      );
    if (sellButtonSelected) {
      var text = ((value * balance) / 100).toFixed(amountDecimalValue);

      if (/^\d*\.?\d*$/.test(text) && text > 0) {
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: text,
          })
        );

        let tradePrice = 0;
        if (1 * priceTrade > 0) {
          tradePrice = 1 * priceTrade;
          //alert(tradePrice)
        } else {
          tradePrice =
            renderLastPrice(selectedCoinPair?.name) != undefined
              ? renderLastPrice(selectedCoinPair?.name).last
              : " ";
        }
        dispatch(
          tradeValuesUpdate({
            prop: "priceTrade",
            value: tradePrice.toString(),
          })
        );

        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: Singleton.getInstance().exponentialToDecimalConvert(
              (text * tradePrice).toFixed(5)
            ),
          })
        );
      }
      return text;
    } else {
      var text = (value * balance) / 100;
      if (/^\d*\.?\d*$/.test(text) && text > 0) {
        let tradePrice = 0;
        if (1 * priceTrade > 0) {
          tradePrice = 1 * priceTrade;
        } else {
          tradePrice =
            renderLastPrice(selectedCoinPair?.name) != undefined
              ? renderLastPrice(selectedCoinPair?.name).last
              : " ";
        }
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: Singleton.getInstance().exponentialToDecimalConvert(
              (1 * text).toFixed(5)
            ),
          })
        );

        dispatch(
          tradeValuesUpdate({
            prop: "priceTrade",
            value: tradePrice.toString(),
          })
        );
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: (text / tradePrice).toFixed(amountDecimalValue).toString(),
          })
        );

        return text;
      }
    }
  };

  const openOderDetails = (data, loader) => {
    let dArray = [];

    dArray = data.filter(
      (res) =>
        res?.currency == selectedCoinPair?.base_unit ||
        res?.currency == selectedCoinPair?.quote_unit
    );

    setFundsArray(dArray);
    // console.log("d array=-=-=dArray->>>", dArray);
    let params = {
      page: `1`,
      limit: "5",
    };
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        // console.log("check isLogin=-=-=5-=>>>", isLogin);
        if (isLogin == "true") {
          setLoginStatus(true);
          if (kycStatus) {
            dispatch(
              getOpenOrdersSingle(
                params,
                `&market=${selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
                }&state=wait`,
                loader
              )
            );
          }
        } else {
          setLoginStatus(false);
        }
      })
      .catch((err) => { });
  };
  const onIncDecAmount = (type) => {
    if (type === "Dec") {
      if (amount && amount > 0) {
        let newAmount = parseFloat(amount) - 1;
        setAmount(newAmount + "");
      } else return;
    } else {
      let newAmount = parseFloat(amount) + 1;
      setAmount(newAmount + "");
    }
  };

  const onIncDec = (type) => {
    if (type === "Dec") {
      if (limitValue && limitValue > 0) {
        let newAmount = parseFloat(limitValue) - parseFloat(0.00000001);
        setLimitValue(newAmount.toFixed(8));
        if (tradeReducer?.tradeAmount != "") {
          let amt = parseFloat(tradeReducer?.tradeAmount);

          if (amt > 0) {
            amt = amt - 0.0001;
          }
          if (amt > 0) {
            updateTotalAmountOnIncDec(
              amt.toFixed(amountDecimalValue).toString()
            );
          }
        } else {
          let amt = parseFloat("0.0");

          if (amt > 0) {
            amt = amt - 0.0001;
          }
          if (amt > 0) {
            updateTotalAmountOnIncDec(amt.toString());
          }
        }
      } else return;
    } else {
      let newAmount = parseFloat(limitValue) + parseFloat(0.00000001);
      setLimitValue(newAmount.toFixed(8));
    }
  };

  const renderLastPrice = (type) => {
    // console.log("type trade last price----", type);
    for (var index in marketSocketReducer?.marketData) {
      if (marketSocketReducer?.marketData[index].name == type) {
        // console.log(
        //   "marketSocketReducer?.marketData[index]-",
        //   marketSocketReducer?.marketData[index]
        // );
        return marketSocketReducer?.marketData[index];
      }
    }
  };
  const renderUsdPriceShow = () => {
    if (tradeReducer?.priceDecimalValue != undefined) {
      // console.log(
      //   "usd price-=-=>>",
      //   Singleton.getInstance().funComma(
      //     renderUsdPrice(selectedCoinPair?.quote_unit) !=
      //       undefined &&
      //       renderLastPrice(selectedCoinPair?.name) != undefined
      //       ? (
      //           renderLastPrice(selectedCoinPair?.name).last *
      //           renderUsdPrice(selectedCoinPair?.quote_unit)
      //         )?.toFixed(tradeReducer?.priceDecimalValue)
      //       : " "
      //   )
      // );
      return Singleton.getInstance().funComma(
        renderUsdPrice(selectedCoinPair?.quote_unit) != undefined &&
          renderLastPrice(selectedCoinPair?.name) != undefined
          ? (
            renderLastPrice(selectedCoinPair?.name).last *
            renderUsdPrice(selectedCoinPair?.quote_unit)
          )?.toFixed(tradeReducer?.priceDecimalValue)
          : " "
      );
    }
  };
  // const renderUsdPriceShow = () => {
  //   if (tradeReducer?.priceDecimalValue != undefined) {
  //     return Singleton.getInstance().funComma(
  //       renderUsdPrice(selectedCoinPair?.quote_unit) !=
  //         undefined &&
  //         renderLastPrice(selectedCoinPair?.name) != undefined
  //         ? (
  //             renderLastPrice(selectedCoinPair?.name).last *
  //             renderUsdPrice(selectedCoinPair?.quote_unit)
  //           )?.toFixed(tradeReducer?.priceDecimalValue)
  //         : " "
  //     );
  //   }
  // };
  const renderUsdPrice = (type) => {
    // console.log(
    //   "FundsReducer?.coinToUsdData[type?.toUpperCase()]---",
    //   FundsReducer?.coinToUsdData[type?.toUpperCase()]
    // );
    // console.log(
    //   "FundsReducer?.coinToUsdData[type?.toUpperCase()]-=-=---",
    //   selectedCoinPair?.quote_unit
    // );
    // console.log(
    //   "FundsReducer?.coinToUsdData[type?.toUpperCase()]-====--",
    //   type
    // );
    // console.log(
    //   "marketSocketReducer?.marketData-====--",
    //   marketSocketReducer?.marketData
    // );
    for (var index in marketSocketReducer?.marketData) {
      // console.log("index=====---", index);
      // console.log("marketSocketReducer?.marketData[index]=-=-=-type--", type);
      // console.log(
      //   "marketSocketReducer?.marketData[index].base_unit--",
      //   marketSocketReducer?.marketData[index].quote_unit
      // );

      // console.log(
      //   "marketSocketReducer?.marketData[index].base_unit == type--",
      //   marketSocketReducer?.marketData[index].quote_unit == type
      // );

      if (marketSocketReducer?.marketData[index].quote_unit == type) {
        // console.log(
        //   "marketSocketReducer?.=======-=-",
        //   marketSocketReducer?.marketData[index]
        // );
        // console.log(
        //   "marketSocke====[index]=-=-=-",
        //   marketSocketReducer?.marketData[index].usd
        // );
        return marketSocketReducer?.marketData[index].usd != null
          ? marketSocketReducer?.marketData[index].usd
          : 0;
        // return marketSocketReducer?.marketData[index];
      }
    }
    // if (
    //   selectedCoinPair?.quote_unit == type &&
    //   FundsReducer?.coinToUsdData[type?.toUpperCase()]
    // ) {
    //   return FundsReducer?.coinToUsdData[type?.toUpperCase()].USD;
    // } else {
    //   cons;
    //   return 1;
    // }
  };
  var volumeCheck = selectedCoinPair?.price_change_percent?.slice(0, -1);
  const getUserBalance = (coinName) => {
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        // console.log("check isLogin=-=-=-=6>>>getUserBalance", isLogin);
        if (isLogin == "true") {
          setLoginStatus(true);
          dispatch(getBalanceDetails({ coinName }));
        } else {
          setLoginStatus(false);
        }
      })
      .catch((err) => { });
  };
  const resetData = (type) => {
    dispatch(tradeValuesUpdate({ prop: "tradeAmount", value: "" }));
    dispatch(tradeValuesUpdate({ prop: "totalAmount", value: "" }));
    type != 0 && dispatch(tradeValuesUpdate({ prop: "priceTrade", value: "" }));
    setSelectedButton("0%");
    setBtnOneSelected(false);
    setBtnTwoSelected(false);
    setBtnThreeSelected(false);
    setBtnFourSelected(false);
    setSelectedButton("0%");
  };

  const renderUserTotalBalance = (type) => {
    let balArr = tradeReducer?.allBalance;
    if (balArr != undefined && balArr.length > 0) {
      const obj = balArr.find((res) => res?.currency == type);
      if (obj != undefined) {
        const balance = obj?.balance;
        if (balance != currentSelectedBalance) {
          setCurrentSelectedBalance(balance);
        }
        var totalValue = balance;
        totalValue == undefined ? 0.0 : totalValue;
        return parseFloat(
          Singleton.getInstance().ParseFloatNumberOnly(totalValue, 4)
        );
      } else {
        return parseFloat(0)?.toFixed(4);
      }
    } else {
      return parseFloat(0)?.toFixed(4);
    }
  };

  const pickPriceFromBook = (price, amount) => {
    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: price,
      })
    );
    console.log("pickPriceFromBook price =-=-=->>>", price, amount);
    var totalTrade = (parseFloat(price) * parseFloat(amount)).toFixed(5);
    console.log("totalTrade price =-=-=->>>", totalTrade);
    let userBalance =
      1 *
      renderUserTotalBalance(
        sellButtonSelected
          ? selectedCoinPair?.base_unit
          : selectedCoinPair?.quote_unit
      );

    if (sellButtonSelected) {
      console.log("sellButtonSelected--userBalance000>", userBalance);
      console.log("sellButtonSelected--limitSelected>", limitSelected);
      console.log(
        "sellButtonSelected--compare---=-->",
        amount <= userBalance || userBalance == 0 || !limitSelected
      );
      console.log(
        "sellButtonSelected--compare---=-->",
        amount <= userBalance || userBalance == 0 || !limitSelected
      );
      console.log(
        "sellButtonSelected--1=-=stopLimitSelected-=-=-=-=>",
        stopLimitSelected
      );
      console.log(
        "sellButtonSelected--amount <= userBalance>",
        amount <= userBalance
      );
      console.log("sellButtonSelected--userBalance == 0>", userBalance == 0);
      if (
        amount <= userBalance ||
        (userBalance == 0 && (!limitSelected || !stopLimitSelected))
      ) {
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: amount,
          })
        );
        console.log("sellButtonSelected--1=-=-=-=-=-=>", limitSelected);
      } else {
        amount = (99 * userBalance) / 100;
        console.log("sellButtonSelected--limitSelected-amount>", amount);
        console.log(
          "sellButtonSelected--limitSelected-amountDecimalValue>",
          amountDecimalValue
        );
        if (amountDecimalValue > 0) {
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: amount.toFixed(amountDecimalValue),
            })
          );
        } else {
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: amount.toString(),
            })
          );
        }
      }
    } else {
      console.log("else--userBalance--else>", userBalance);
      console.log("else--limitSelected--else>", limitSelected);
      console.log("parseFloat(totalTrade)-limitSelected--else>", limitSelected);

      if (
        !limitSelected ||
        userBalance == 0 ||
        userBalance >= parseFloat(totalTrade)
      ) {
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: amount,
          })
        );
        console.log("parseFloat(totalTrade)-amount", amount);
      } else {
        console.log("amountDecimalValue-amount--===", amountDecimalValue);
        if (amountDecimalValue > 0) {
          amount = (parseFloat(userBalance) / parseFloat(price)).toFixed(
            amountDecimalValue
          );
        } else {
          amount = parseFloat(userBalance) / parseFloat(price);
        }
        console.log("parseFloat(totalTrade)-amount--else", amount);
        let tempTotal = (parseFloat(price) * parseFloat(amount)).toFixed(5);
        if (tempTotal <= parseFloat(userBalance)) {
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: amount.toString(),
            })
          );
        } else {
          amount = (99 * amount) / 100;
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: amount.toFixed(2),
            })
          );
        }
      }
    }
    dispatch(
      tradeValuesUpdate({
        prop: "totalAmount",
        value: Singleton.getInstance().exponentialToDecimalConvert(
          (parseFloat(price) * parseFloat(amount)).toFixed(5)
        ),
      })
    );
  };
  function updateTotalTrade(text) {
    let balance =
      1 *
      renderUserTotalBalance(
        sellButtonSelected
          ? selectedCoinPair?.base_unit
          : selectedCoinPair?.quote_unit
      );
    if (text != "") {
      var priceTrade = 0;
      var amount = 0;

      priceTrade =
        priceTrade == ""
          ? renderLastPrice(selectedCoinPair?.name) != undefined
            ? renderLastPrice(selectedCoinPair?.name).last
            : ""
          : priceTrade;

      priceTrade = 1 * priceTrade;

      dispatch(
        tradeValuesUpdate({
          prop: "priceTrade",
          value: priceTrade.toFixed(tradeReducer?.priceDecimalValue),
        })
      );
      if (sellButtonSelected) {
        balance = parseFloat(balance) * parseFloat(priceTrade);
      }
      if (parseFloat(text) <= parseFloat(balance)) {
        amount = parseFloat(text) / priceTrade;
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: amount > 0 ? amount.toFixed(amountDecimalValue) : "0.0",
          })
        );
        if (sellButtonSelected) {
          if (amount >= balance) {
            amount = (balance * 99) / 100;
            dispatch(
              tradeValuesUpdate({
                prop: "tradeAmount",
                value: amount.toFixed(amountDecimalValue),
              })
            );
            dispatch(
              tradeValuesUpdate({
                prop: "totalAmount",
                value: Singleton.getInstance().exponentialToDecimalConvert(
                  (amount * priceTrade).toFixed(4)
                ),
              })
            );
          } else {
            dispatch(
              tradeValuesUpdate({
                prop: "totalAmount",
                value:
                  Singleton.getInstance().exponentialToDecimalConvert(text),
              })
            );
          }
        } else {
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: Singleton.getInstance().exponentialToDecimalConvert(text),
            })
          );
        }
      } else {
        amount = balance / priceTrade;
        let totalAmount = Singleton.getInstance().exponentialToDecimalConvert(
          (
            amount.toFixed(amountDecimalValue) *
            priceTrade.toFixed(tradeReducer?.priceDecimalValue)
          ).toFixed(5)
        );

        if (totalAmount > parseFloat(balance)) {
          amount = (99 * amount) / 100;
          totalAmount = Singleton.getInstance().exponentialToDecimalConvert(
            (
              amount.toFixed(amountDecimalValue) *
              priceTrade.toFixed(tradeReducer?.priceDecimalValue)
            ).toFixed(5)
          );
        }

        if (sellButtonSelected) {
          if (amount >= balance) {
            amount = (balance * 99) / 100;
          }
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: (amount * priceTrade).toFixed(4),
            })
          );
        } else {
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: amount > 0 ? totalAmount : text,
            })
          );
        }
        amount > 0 &&
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: Singleton.getInstance().exponentialToDecimalConvert(
                amount.toFixed(amountDecimalValue)
              ),
            })
          );
      }
    } else {
      dispatch(
        tradeValuesUpdate({
          prop: "totalAmount",
          value: "",
        })
      );
      dispatch(
        tradeValuesUpdate({
          prop: "tradeAmount",
          value: "",
        })
      );
    }
  }

  const updateTotalAmountOnStopLimitIncDec = (text) => {
    console.log("updateTotalAmountOnStopLimitIncDec--===->>", text);
    let balance =
      1 *
      renderUserTotalBalance(
        sellButtonSelected
          ? selectedCoinPair?.base_unit
          : selectedCoinPair?.quote_unit
      );
    console.log("balance--33===->>", balance);
    let tradeVal = 0;
    if (text != "") {
      if (sellButtonSelected) {
        var limitValue = 0;
        var textAmt = parseFloat(text);
        console.log("sellButtonSelected--=textAmt=33=->>", textAmt);
        console.log(
          "parseFloat(balance)--=balance=33=->>",
          parseFloat(balance)
        );
        console.log(
          "textAmt > parseFloat(balance) && parseFloat(balance)33 > 0>>",
          textAmt > parseFloat(balance) && parseFloat(balance) > 0
        );

        if (textAmt > parseFloat(balance) && parseFloat(balance) > 0) {
          // tradeVal = parseFloat(
          //   Singleton.getInstance().ParseFloatNumber(
          //     balance,
          //     amountDecimalValue,
          //   ),
          // );

          balance = (balance * 99.5) / 100;
          console.log("textAmtbalance 0>>", balance);
          console.log(
            "parseFloat(amountDecimalValue)33 > 0>>",
            parseFloat(amountDecimalValue) > 0
          );
          if (parseFloat(amountDecimalValue) > 0) {
            tradeVal = parseFloat(balance).toFixed(amountDecimalValue);
          } else {
            tradeVal = parseFloat(balance);
          }
        } else {
          tradeVal = text;
          console.log("sellButtonSelected--=tradeVal=33=->>", tradeVal);
        }

        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: tradeVal.toString(),
          })
        );
        console.log(
          "sellButtonSelected--=radeVal.toString()33==->>",
          tradeVal.toString()
        );
      }
    } else {
      console.log("tradeValuesUpdate--=amount==33-text>>", text);
      dispatch(
        tradeValuesUpdate({
          prop: "tradeAmount",
          value: text.toString(),
        })
      );
      tradeVal = 0;
    }

    let priceVal = 0;
    if (parseFloat(tradeReducer?.limitValue) > 0) {
      priceVal = parseFloat(tradeReducer?.limitValue);
    }
    console.log("priceVal-=radeVal.toString()==-ee>>", priceVal);
    if (sellButtonSelected) {
      if (tradeVal != "") {
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: Singleton.getInstance().exponentialToDecimalConvert(
              (tradeVal * priceVal).toFixed(5)
            ),
          })
        );
        console.log(
          "(tradeVal * priceVal).toFixed(5)==-ee>>",
          (tradeVal * priceVal).toFixed(5)
        );
      } else {
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: 0,
          })
        );
        console.log("(tradeVal * priceVal).totalAmount000>");
      }
    }
  };
  function updatePriceValueStopLimit(text) {
    console.log("updatePriceValueStopLimit--text--", text);
    console.log("updatePriceValueStopLimit--text-typeof-", typeof text);

    dispatch(
      tradeValuesUpdate({
        prop: "limitValue",
        value: text,
      })
    );
    // priceTrade
    if (text == "") {
      dispatch(
        tradeValuesUpdate({
          prop: "tradeAmount",
          value: "",
        })
      );
      dispatch(
        tradeValuesUpdate({
          prop: "totalAmount",
          value: "",
        })
      );
    } else {
      if (parseFloat(tradeReducer?.tradeAmount) > 0) {
        let balance =
          1 *
          renderUserTotalBalance(
            sellButtonSelected
              ? selectedCoinPair?.base_unit
              : selectedCoinPair?.quote_unit
          );
        console.log("balance--text--", balance);
        console.log(
          "tradeReducer?.tradeAmount)--text--",
          tradeReducer?.tradeAmount
        );
        console.log(
          "tradeReducer?.tradeAmount)--text->>>-",
          parseFloat(tradeReducer?.tradeAmount) * parseFloat(text) > balance
        );

        if (
          parseFloat(tradeReducer?.tradeAmount) * parseFloat(text) >
          balance
        ) {
          console.log("parseFloat(balance)--text--", parseFloat(balance));
          console.log("parseFloat(text)==--text--", parseFloat(text));
          console.log("amountDecimalValue(text)==--text--", amountDecimalValue);

          let trade = Singleton.getInstance().exponentialToDecimalConvert(
            (parseFloat(balance) / parseFloat(text)).toFixed(amountDecimalValue)
          );
          console.log("trade--text-++++-", trade);
          if (parseFloat(trade) <= 0) {
            trade = "0";
          }
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: trade.toString(),
            })
          );
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: (parseFloat(trade) * parseFloat(text)).toFixed(5),
            })
          );
        } else {
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: (
                parseFloat(tradeReducer?.tradeAmount) * parseFloat(text)
              ).toFixed(5),
            })
          );
        }
      } else {
        console.log("balance--text--else---");
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: "",
          })
        );
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: "",
          })
        );
      }
    }
  }
  const updateAmountOnStopLimitIncDec = (text) => {
    console.log("updateAmountOnStopLimitIncDec--===->>", text);
    let balance =
      1 *
      renderUserTotalBalance(
        sellButtonSelected
          ? selectedCoinPair?.base_unit
          : selectedCoinPair?.quote_unit
      );
    console.log("balance--33===->>", balance);
    let tradeVal = 0;
    if (text != "") {
      if (sellButtonSelected) {
        var limitValue = 0;
        var textAmt = parseFloat(text);
        console.log("sellButtonSelected--=textAmt=33=88->>", textAmt);
        console.log(
          "sellButtonSelected--=textAmt=33=88->>typeof-",
          typeof textAmt
        );

        console.log(
          "parseFloat(balance)--=balance=33=88->>",
          parseFloat(balance)
        );
        console.log(
          "parseFloat(balance)--=balance=33=88-typeof>>",
          typeof parseFloat(balance)
        );
        console.log(
          "textAmt > parseFloat(balance) && parseFloat(balance)88 > 0>>",
          textAmt > parseFloat(balance) && parseFloat(balance) > 0
        );

        if (textAmt > parseFloat(balance) && parseFloat(balance) > 0) {
          // tradeVal = parseFloat(
          //   Singleton.getInstance().ParseFloatNumber(
          //     balance,
          //     amountDecimalValue,
          //   ),
          // );

          balance = (balance * 99.5) / 100;
          console.log("textAmtbalance 880>>", balance);
          console.log(
            "parseFloat(amountDecimalValue)88 > 0>>",
            parseFloat(amountDecimalValue) > 0
          );
          if (parseFloat(amountDecimalValue) > 0) {
            tradeVal = parseFloat(balance).toFixed(amountDecimalValue);
          } else {
            tradeVal = parseFloat(balance);
          }
        } else {
          tradeVal = text;
          console.log("sellButtonSelected--=tradeVal=88=->>", tradeVal);
        }

        dispatch(
          tradeValuesUpdate({
            prop: "limitValue",
            value: tradeVal.toString(),
          })
        );
        console.log(
          "sellButtonSelected--=radeVal.toString()888==->>",
          tradeVal.toString()
        );
      }
    } else {
      console.log("tradeValuesUpdate--=amount==888-text>>", text);
      dispatch(
        tradeValuesUpdate({
          prop: "limitValue",
          value: text.toString(),
        })
      );
      tradeVal = 0;
    }

    let priceVal = 0;
    if (parseFloat(tradeReducer?.limitValue) > 0) {
      priceVal = parseFloat(tradeReducer?.limitValue);
    }
    console.log("priceVal-=radeVal.toString()==888-ee>>", priceVal);
    console.log("priceVal-=radeVal.toString()==tradeVal-ee>>", tradeVal);
    if (sellButtonSelected) {
      if (tradeVal != "") {
        // dispatch(
        //   tradeValuesUpdate({
        //     prop: "totalAmount",
        //     value: (tradeVal * priceVal).toFixed(5),
        //   })
        // );
        let a = tradeVal;
        let b = priceVal;
        console.log("(tradeVal * 1111aa>>", a);
        console.log("(tradeVal * bbbb-->>", b);
        console.log("(tradeVal * 1111aatypeof>>", typeof a);
        console.log("(tradeVal * bbbb-typeof->>", typeof b);
        // let calc = parseFloat(tradeVal) * priceVal;
        // console.log("(tradeVal---calc-calc->>", calc);
        console.log("(tradeVal---calc-calc->>", amountDefaultPrecisionValue);
        console.log("amountDecimalValue-=-=-", amountDecimalValue);

        let cal = Singleton.getInstance().exponentialToDecimalConvert(
          (parseFloat(tradeVal) * priceVal).toFixed(5)
        );
        console.log("(tradeVal---cal-->>", cal);
        console.log("(tradeVal---cal-->>typeof=-=-", typeof cal);

        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: parseFloat(cal).toString(),
          })
        );
        console.log("(tradeVal * priceVal).cccc>>", cal);
        // console.log(
        //   "(tradeVal * priceVal).toFixed(8888)=e=-ee>>",
        //   (tradeVal * priceVal).toFixed(5)
        // );
      } else {
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: 0,
          })
        );
        console.log("(tradeVal * priceVal)8888.etotalAmount000>");
      }
    }
  };
  const updateTotalAmountOnIncDec = (text) => {
    console.log("updateTotalAmountOnIncDec--===->>", text);
    let balance =
      1 *
      renderUserTotalBalance(
        sellButtonSelected
          ? selectedCoinPair?.base_unit
          : selectedCoinPair?.quote_unit
      );
    console.log("balance--===->>", balance);
    let tradeVal = 0;
    if (text != "") {
      if (sellButtonSelected) {
        var priceTrade = 0;
        var textAmt = parseFloat(text);
        console.log("sellButtonSelected--=textAmt==->>", textAmt);
        console.log("parseFloat(balance)--=balance==->>", parseFloat(balance));
        console.log(
          "textAmt > parseFloat(balance) && parseFloat(balance) > 0>>",
          textAmt > parseFloat(balance) && parseFloat(balance) > 0
        );

        if (textAmt > parseFloat(balance) && parseFloat(balance) > 0) {
          // tradeVal = parseFloat(
          //   Singleton.getInstance().ParseFloatNumber(
          //     balance,
          //     amountDecimalValue,
          //   ),
          // );

          balance = (balance * 99.5) / 100;
          console.log("textAmtbalance 0>>", balance);
          console.log(
            "parseFloat(amountDecimalValue) > 0>>",
            parseFloat(amountDecimalValue) > 0
          );
          if (parseFloat(amountDecimalValue) > 0) {
            tradeVal = parseFloat(balance).toFixed(amountDecimalValue);
          } else {
            tradeVal = parseFloat(balance);
          }
        } else {
          tradeVal = text;
          console.log("sellButtonSelected--=tradeVal==->>", tradeVal);
        }

        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: tradeVal.toString(),
          })
        );
        console.log(
          "sellButtonSelected--=radeVal.toString()==->>",
          tradeVal.toString()
        );
      } else {
        let priceTrade = parseFloat(priceTrade);
        console.log("sellButtonSelected--=false==->>", priceTrade);
        console.log("parseFloat(text)--=false==->>", parseFloat(text));
        console.log("balance--=false==->>", balance);
        console.log(
          "balance--=compare=balance---=->>",
          priceTrade * parseFloat(text)
        );

        console.log(
          "balance--=compare==->>",
          priceTrade * parseFloat(text) <= balance
        );

        if (priceTrade * parseFloat(text) <= balance) {
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: text.toString(),
            })
          );
          tradeVal = parseFloat(text);
          console.log("balance--=compare==-tradeVal-->>", tradeVal);
          console.log("balance--=compare==-text-->>", text);
        } else {
          console.log("balance--=compare==-else>>");
          console.log("amountDecimalValue==-else>>", amountDecimalValue);
          let amount;
          if (parseFloat(amountDecimalValue) > 0) {
            amount = (parseFloat(balance) / parseFloat(priceTrade))
              .toFixed(amountDecimalValue)
              .toString();
            console.log("amount==-==->>", amount);
          } else {
            console.log(
              "balance-parseFloat(balance)=-else>>",
              parseFloat(balance)
            );
            console.log(
              "balance-parseFloat(priceTrade)=-else>>",
              parseFloat(priceTrade)
            );
            console.log(
              "balance-divide-else>>",
              parseFloat(balance) / parseFloat(priceTrade)
            );

            amount = (parseFloat(balance) / parseFloat(priceTrade)).toString();
            console.log("amount==-else>>", amount);
          }
          console.log("balance--=amount==+===");
          console.log("balance--=amount==-else>>", amount);
          console.log("balance--=text==-else>>", text);

          // let amount =  parseFloat(
          //   Singleton.getInstance().ParseFloatNumber(
          //     parseFloat(balance) / parseFloat(priceTrade),
          //     amountDecimalValue,
          //   ),
          // );
          if (amount == "NaN" || amount == 0) {
            amount = text;
            console.log("balance--=amount==-text>>", text);
            console.log("balance--=amount==-amount>>", amount);
          }
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: amount.toString(),
            })
          );
          tradeVal = parseFloat(amount);
        }
      }
    } else {
      console.log("tradeValuesUpdate--=amount==-text>>", text);
      dispatch(
        tradeValuesUpdate({
          prop: "tradeAmount",
          value: text.toString(),
        })
      );
      tradeVal = 0;
    }

    let priceVal = 0;
    if (parseFloat(priceTrade) > 0) {
      priceVal = parseFloat(priceTrade);
    }
    console.log("priceVal-=radeVal.toString()==->>", priceVal);
    if (sellButtonSelected) {
      if (tradeVal != "") {
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: Singleton.getInstance().exponentialToDecimalConvert(
              (tradeVal * priceVal).toFixed(5)
            ),
          })
        );
      } else {
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: 0,
          })
        );
      }
    } else {
      if (tradeVal != "") {
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: Singleton.getInstance().exponentialToDecimalConvert(
              (tradeVal * priceVal).toFixed(5)
            ),
          })
        );
      } else {
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: "",
          })
        );
      }
    }
  };
  function updateTotalPriceOnIncDec(text) {
    console.log("updateTotalPriceOnIncDec---->>>>", text);
    let balance =
      1 *
      renderUserTotalBalance(
        sellButtonSelected
          ? selectedCoinPair?.base_unit
          : selectedCoinPair?.quote_unit
      );
    let tradeVal = 0;
    if (text != "") {
      if (sellButtonSelected) {
        var priceTrade = 0;
        var textAmt = 1 * text;
        console.log("sellButtonSelected--textAmt-->>>>", textAmt);
        if (textAmt > parseFloat(balance) && parseFloat(balance) > 0) {
          tradeVal = parseFloat(balance).toFixed(amountDecimalValue);
        } else {
          tradeVal = text;
        }
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: tradeVal,
          })
        );
      } else {
        let priceTrade = parseFloat(priceTrade);
        console.log("sellButtonSelected--priceTrade-->>>>", priceTrade);
        if (priceTrade * parseFloat(text) <= balance) {
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: text,
            })
          );
          tradeVal = parseFloat(text);
        } else {
          let amount = (parseFloat(balance) / parseFloat(priceTrade))
            .toFixed(amountDecimalValue)
            .toString();
          if (amount == "NaN" || amount == 0) {
            amount = text;
          }
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: amount,
            })
          );
          tradeVal = parseFloat(amount);
        }
      }
    } else {
      dispatch(
        tradeValuesUpdate({
          prop: "tradeAmount",
          value: text,
        })
      );
      tradeVal = 0;
    }

    let priceVal = 0;
    if (parseFloat(priceTrade) > 0) {
      priceVal = parseFloat(priceTrade);
    }

    dispatch(
      tradeValuesUpdate({
        prop: "totalAmount",
        value: Singleton.getInstance().exponentialToDecimalConvert(
          (tradeVal * priceVal).toFixed(5)
        ),
      })
    );
  }
  function setPercentageToDefault() {
    setBtnOneSelected(false);
    setBtnTwoSelected(false);
    setBtnThreeSelected(false);
    setBtnFourSelected(false);
    setSelectedButton("0%");
  }
  function requestPlaceOrder() {
    if (!stopLimitSelected) {
      // alert('hello');
      let param = {};

      let userBalance =
        1 *
        renderUserTotalBalance(
          sellButtonSelected
            ? selectedCoinPair?.base_unit
            : selectedCoinPair?.quote_unit
        ) +
        " " +
        (sellButtonSelected
          ? selectedCoinPair?.base_unit?.toUpperCase()
          : selectedCoinPair?.quote_unit?.toUpperCase());
      let floatTotalValue = parseFloat(userBalance);

      if (limitSelected) {
        if (priceTrade <= 0) {
          // Alert.alert(constants.APP_NAME, 'Please enter valid value in price');
          Singleton.getInstance().showError(
            "Please enter valid value in price"
          );

          return;
        }

        if (tradeReducer?.tradeAmount <= 0) {
          // Alert.alert(constants.APP_NAME, 'Please enter valid value in amount');
          Singleton.getInstance().showError(
            "Please enter valid value in amount"
          );
          return;
        }

        if (sellButtonSelected) {
          if (
            parseFloat(floatTotalValue) < parseFloat(tradeReducer?.tradeAmount)
          ) {
            Singleton.getInstance().showError("Insufficient balance");
            return;
          }
        } else {
          if (
            parseFloat(floatTotalValue) < parseFloat(tradeReducer?.totalAmount)
          ) {
            Singleton.getInstance().showError("Insufficient balance");
            return;
          }
        }

        if (floatTotalValue <= 0) {
          Singleton.getInstance().showError("Insufficient balance");
          return;
        }

        if (tradeReducer?.tradeAmount.includes(".")) {
          var e = tradeReducer?.tradeAmount.split(".");
          if (e[1].length > amountDecimalValue) {
            Singleton.getInstance().showError(
              `Volume decimal value can't be greater then ${amountDecimalValue}`
            );

            return;
          }
        }
        if (
          tradeReducer?.totalAmount <
          1 * tradeReducer?.tradeFees?.min_total
        ) {
          var str = `Total must be greater than ${tradeReducer?.tradeFees?.min_total +
            " " +
            tradeReducer?.tradeFees?.quote_unit.toUpperCase()
            }`;
          Singleton.getInstance().showError(str);
          return;
        }

        param = {
          market: `${selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
            }`,
          side: sellButtonSelected ? "sell" : "buy",
          volume: parseFloat(tradeReducer?.tradeAmount).toFixed(
            amountDecimalValue
          ),
          ord_type: "limit",
          price: `${priceTrade}`,
        };
      } else {
        if (tradeReducer?.tradeAmount <= 0) {
          Singleton.getInstance().showError(
            "Please enter valid value in amount"
          );
          return;
        }
        if (sellButtonSelected) {
          if (
            parseFloat(floatTotalValue) < parseFloat(tradeReducer?.tradeAmount)
          ) {
            Singleton.getInstance().showError("Insufficient balance");
            return;
          }
        } else {
          if (
            parseFloat(floatTotalValue) < parseFloat(tradeReducer?.totalAmount)
          ) {
            Singleton.getInstance().showError("Insufficient balance");
            return;
          }
        }
        if (floatTotalValue <= 0) {
          Singleton.getInstance().showError("Insufficient balance");
          return;
        }

        if (tradeReducer?.tradeAmount.includes(".")) {
          var e = tradeReducer?.tradeAmount.split(".");
          if (e[1].length > 5) {
            Singleton.getInstance().showError(
              `Volume decimal value can't be greater then ${amountDecimalValue}`
            );

            return;
          }
        }

        param = {
          market: `${selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
            }`,
          side: sellButtonSelected ? "sell" : "buy",
          volume: parseFloat(tradeReducer?.tradeAmount).toFixed(
            amountDecimalValue
          ),
          ord_type: "market",
        };
      }
      dispatch(placeTradeOrder(param))
        .then((res) => {
          Singleton.getInstance().showWarn("Order placed");

          resetData(false);
          let params = {
            page: `1`,
            limit: "5",
          };
          dispatch(getUserAllBalance(false)).then((res) => {
            openOderDetails(res, true);
          });
        })
        .catch((err) => {
          Singleton.getInstance().showError(err.replace("account.", ""));
        });
    } else {
      // alert('none=-');
      let param = {};
      let userBalance =
        1 *
        renderUserTotalBalance(
          sellButtonSelected
            ? selectedCoinPair?.base_unit
            : selectedCoinPair?.quote_unit
        ) +
        " " +
        (sellButtonSelected
          ? selectedCoinPair?.base_unit?.toUpperCase()
          : selectedCoinPair?.quote_unit?.toUpperCase());
      let floatTotalValue = parseFloat(userBalance);
      if (stopLimitSelected) {
        if (priceTrade <= 0) {
          Singleton.getInstance().showError(
            "Please enter valid value in stop price"
          );
          return;
        }
        if (tradeReducer?.limitValue <= 0) {
          Singleton.getInstance().showError(
            "Please enter valid value in limit price"
          );
          return;
        }
        if (tradeReducer?.tradeAmount <= 0) {
          Singleton.getInstance().showError(
            "Please enter valid value in amount"
          );
          return;
        }
        if (floatTotalValue <= 0) {
          Singleton.getInstance().showError("Insufficient balance");
          return;
        }
        if (tradeReducer?.tradeAmount.includes(".")) {
          var e = tradeReducer?.tradeAmount.split(".");

          if (e[1].length > amountDecimalValue) {
            Singleton.getInstance().showError(
              `Volume decimal value can't be greater then ${amountDecimalValue}`
            );
            return;
          }
        }

        if (
          tradeReducer?.totalAmount <
          1 * tradeReducer?.tradeFees?.min_total
        ) {
          var str = `Total must be greater than ${tradeReducer?.tradeFees?.min_total +
            " " +
            tradeReducer?.tradeFees?.quote_unit.toUpperCase()
            }
           \n`;
          Singleton.getInstance().showError(str);
          return;
        }

        if (priceTrade >= marketSocketReducer?.buyData[0][0]) {
          param = {
            market: `${selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
              }`,
            side: sellButtonSelected ? "sell" : "buy",
            //    volume: `${this.props.tradeAmount}`,
            volume: parseFloat(tradeReducer?.tradeAmount).toFixed(
              amountDecimalValue
            ),
            is_stop_order: "true",
            ord_type: "take_profit_limit",
            price: `${tradeReducer?.limitValue}`,
            stop_price: `${priceTrade}`,
          };
        } else {
          param = {
            market: `${selectedCoinPair?.base_unit + selectedCoinPair?.quote_unit
              }`,
            side: sellButtonSelected ? "sell" : "buy",
            //    volume: `${this.props.tradeAmount}`,
            volume: parseFloat(tradeReducer?.tradeAmount).toFixed(
              amountDecimalValue
            ),
            is_stop_order: "true",
            ord_type: "stop_loss_limit",
            price: `${tradeReducer?.limitValue}`,
            stop_price: `${priceTrade}`,
          };
        }
      }

      dispatch(placeTradeOrder(param))
        .then((res) => {
          Singleton.getInstance().showWarn("Order placed");
          resetData(false);
          let params = {
            page: `1`,
            limit: "5",
          };
          dispatch(getUserAllBalance(false)).then((res) => {
            openOderDetails(res, true);
          });
        })
        .catch((err) => {
          Singleton.getInstance().showError(err.replace("account.", ""));
        });
    }
  }

  //updatePriceValue
  function updatePriceValue(text) {
    console.log("updatePriceValue--text--", text);
    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: text,
      })
    );

    if (text == "") {
      dispatch(
        tradeValuesUpdate({
          prop: "tradeAmount",
          value: "",
        })
      );
      dispatch(
        tradeValuesUpdate({
          prop: "totalAmount",
          value: "",
        })
      );
    } else {
      if (parseFloat(tradeReducer?.tradeAmount) > 0) {
        let balance =
          1 *
          renderUserTotalBalance(
            sellButtonSelected
              ? selectedCoinPair?.base_unit
              : selectedCoinPair?.quote_unit
          );
        console.log("balance--text--", balance);
        console.log(
          "tradeReducer?.tradeAmount)--text--",
          tradeReducer?.tradeAmount
        );
        console.log(
          "tradeReducer?.tradeAmount)--text->>>-",
          parseFloat(tradeReducer?.tradeAmount) * parseFloat(text) > balance
        );

        if (
          parseFloat(tradeReducer?.tradeAmount) * parseFloat(text) >
          balance
        ) {
          console.log("parseFloat(balance)--text--", parseFloat(balance));
          console.log("parseFloat(text)==--text--", parseFloat(text));
          console.log("amountDecimalValue(text)==--text--", amountDecimalValue);

          let trade = Singleton.getInstance().exponentialToDecimalConvert(
            (parseFloat(balance) / parseFloat(text)).toFixed(amountDecimalValue)
          );
          console.log("trade--text-=======-", trade);
          if (parseFloat(trade) <= 0) {
            trade = "0";
          }
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: trade.toString(),
            })
          );
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: (parseFloat(trade) * parseFloat(text)).toFixed(5),
            })
          );
        } else {
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: (
                parseFloat(tradeReducer?.tradeAmount) * parseFloat(text)
              ).toFixed(5),
            })
          );
        }
      } else {
        console.log("balance--text--else---");
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: "",
          })
        );
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: "",
          })
        );
      }
    }
  }
  function updatePriceValueDec(text) {
    console.log("updatePriceValueDec==->>>", text);
    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: text,
      })
    );

    if (text == "") {
      dispatch(
        tradeValuesUpdate({
          prop: "tradeAmount",
          value: "",
        })
      );
      dispatch(
        tradeValuesUpdate({
          prop: "totalAmount",
          value: "",
        })
      );
    } else {
      console.log("tradeReducer?.tradeAmount==->>>", tradeReducer?.tradeAmount);
      console.log("priceTrade==->>>", priceTrade);
      console.log(
        "tradeReducer?.tradeAmount->0=->>>",
        parseFloat(tradeReducer?.tradeAmount) > 0
      );

      if (parseFloat(tradeReducer?.tradeAmount) > 0) {
        let balance =
          1 *
          renderUserTotalBalance(
            sellButtonSelected
              ? selectedCoinPair?.base_unit
              : selectedCoinPair?.quote_unit
          );
        console.log("balance==->>>", balance);
        if (
          parseFloat(tradeReducer?.tradeAmount) * parseFloat(text) >
          balance
        ) {
          let trade = (parseFloat(balance) / parseFloat(text)).toFixed(
            amountDecimalValue
          );
          if (parseFloat(trade) <= 0) {
            trade = "0";
          }
          dispatch(
            tradeValuesUpdate({
              prop: "tradeAmount",
              value: trade,
            })
          );
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: (parseFloat(trade) * parseFloat(text)).toFixed(5),
            })
          );
        } else {
          dispatch(
            tradeValuesUpdate({
              prop: "totalAmount",
              value: (
                parseFloat(tradeReducer?.tradeAmount) * parseFloat(text)
              ).toFixed(5),
            })
          );
        }
      } else {
        dispatch(
          tradeValuesUpdate({
            prop: "tradeAmount",
            value: "",
          })
        );
        dispatch(
          tradeValuesUpdate({
            prop: "totalAmount",
            value: "",
          })
        );
      }
    }
  }
  function updatePriceLimitValue(text) {
    dispatch(
      tradeValuesUpdate({
        prop: "priceTrade",
        value: text,
      })
    );
  }
  const getClickedItem = (data) => {
    if (sellButtonSelected) {
      let item = data?.find((value) => value.id == selectedCoinPair.base_unit);
      console.log("item---=item--", JSON.stringify(item));
      if (item.networks.length > 0) {
        Actions.currentScene != "DepositWallet" &&
          Actions.DepositWallet({ coin: item });
      } else {
        Singleton.getInstance().showError(
          "Deposit has been temporary disabled for this address"
        );
      }
      // Actions.DepositWallet({coin: item});
      return item;
    } else {
      let item = data?.find((value) => value.id == selectedCoinPair.quote_unit);
      console.log("item---=item-false-", JSON.stringify(item));
      console.log("selectedCoinPair.quote_unit--", selectedCoinPair.quote_unit);
      console.log("data---=--", data);
      console.log("item---=--", item);

      if (item.networks.length > 0) {
        Actions.currentScene != "DepositWallet" &&
          Actions.DepositWallet({ coin: item });
      } else {
        Singleton.getInstance().showError(
          "Deposit has been temporary disabled for this address"
        );
      }
      return item;
    }
  };
  const stylesSheet = {
    titleBox: {
      background: "pink",
    },
    titleText: {
      fontSize: 16,
      color: "#000",
    },
  };
  return (
    <>
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
        screenStyle={[
          styles.screenStyle,
          {
            backgroundColor: ThemeManager.colors.bgDarkwhite,
          },
        ]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 20,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setuserPricePrecision(2);
                setuserPricePrecisionValue(0.2);
                setDefaultPrecision(pricePrecision.length - 2);
                setSelectedLimitedIndex(pricePrecision.length - 2);
                console.log("pricePrecision=-=-=-", pricePrecision);
                console.log(
                  "pricePrecision.length - 2=-=-=-",
                  pricePrecision.length - 2
                );
                setSelectedItemSell("Limit");
                setSelectedItemBuy("Limit");

                // console.log("pricePrecision=-=-=-=", pricePrecision);
                // console.log("pricePrecision=-=22-=-=", pricePrecision);
                // console.log(
                //   "pricePrecision=-=-len-=",
                //   pricePrecision[pricePrecision.length - 2]
                // );
                // console.log(
                //   "pricePrecision=-=-len-=",
                //   pricePrecision.length - 2
                // );

                // console.log("pricePrecision=-=-=33-=", pricePrecision - 1);
                Actions.currentScene != "ConvertTrade" &&
                  Actions.push("ConvertTrade");
                setSpotPageSelected(1);
              }}
              style={{ marginRight: 30 }}
            >
              <TradeHeader
                title={"Swap"}
                underLine={spotPageSelected === 0 ? true : false}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSpotPageSelected(1);
              }}
            >
              <TradeHeader
                title={strings.trade_tab.spot}
                underLine={spotPageSelected === 1 ? true : false}
              />
            </TouchableOpacity>
          </View>
          <BorderLine />
          <KeyboardAwareScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onRefresh={() => onRefresh()}
            refreshing={refreshing}
            // bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            // bounces={false}
            key="2"
          // style={{ flex: 1, marginBottom: -34 }}
          // style={{backgroundColor: ThemeManager.colors.whiteScreen}}
          // contentContainerStyle={{flex: 1}}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                // disabled={true}
                onPress={() => {
                  setSelectedPage(0);
                  setModalVisibleMarket(true);
                }}
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  // marginVertical: 20,
                  marginTop: 20,
                  // marginBottom: 5,
                  marginLeft: 15,
                }}
              >
                <View>
                  <Image
                    source={{ uri: ThemeManager.ImageIcons.icon_swap_c }}
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                      resizeMode: "contain",
                      // tintColor: ThemeManager.colors.selectedTextColor,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    color: ThemeManager.colors.textColor5,
                  }}
                >
                  {selectedCoinPair?.base_unit.toUpperCase()}/
                  {selectedCoinPair?.quote_unit.toUpperCase()}
                </Text>
                {/* <Text
               >
                {selectedCoinPair?.price_change_percent}
              </Text> */}
                <PercentageChange
                  pair={`${selectedCoinPair?.base_unit.toUpperCase()}/${selectedCoinPair?.quote_unit.toUpperCase()}`}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Actions.currentScene != "BuySellMarket" &&
                    Actions.BuySellMarket({
                      item: selectedCoinPair,
                    });
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_spot_right }}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    marginRight: 20,
                    marginTop: 10,
                    // tintColor: ThemeManager.colors.selectedTextColor,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                // backgroundColor: ThemeManager.colors.BackgroundDarkView,
                // flex: 9,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
            >
              <View style={{ margin: 10, marginTop: 20, flex: 1 }}>
                <View
                  style={{
                    flexGrow: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    // backgroundColor: 'yellow',
                    // alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 5.0 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        backgroundColor: ThemeManager.colors.tabBackground,
                        borderRadius: 6,
                        // alignItems: 'center',
                        // flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setLimitSelected(true);
                          // setSelectedLimitedIndex(null);
                          setSelectedLimitedIndex(pricePrecision.length - 2);
                          // setuserPricePrecision(0);
                          setSelectedItemSell("Limit");
                          setSelectedItemBuy("Limit");
                          setSelectedSellIndex(0);
                          setSelectedBuyIndex(0);
                          setBuySellBtnSelect(true);
                          setSellButtonSelected(false);
                          setStopLimitSelected(false);
                          getUserBalance(selectedCoinPair?.quote_unit);
                          // dispatch(
                          //   tradeValuesUpdate({
                          //     prop: 'limitValue',
                          //     value: '',
                          //   }),
                          // );
                          resetData(0);
                        }}
                        disabled={buySellBtnSelect ? true : false}
                        style={{
                          height: 40,
                          flex: 1,
                          borderRadius: 6,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: buySellBtnSelect
                            ? ThemeManager.colors.textGreenColor
                            : ThemeManager.colors.tabBackground,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: Fonts.regular,
                            color: buySellBtnSelect
                              ? "white"
                              : ThemeManager.colors.textColor1,
                          }}
                        >
                          {strings.trade_tab.buy}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setLimitSelected(true);
                          // setSelectedLimitedIndex(null);
                          setSelectedLimitedIndex(pricePrecision.length - 2);
                          setSelectedSellIndex(0);
                          setSelectedBuyIndex(0);
                          // setuserPricePrecision(0);
                          setSelectedItemSell("Limit");
                          setSelectedItemBuy("Limit");

                          setBuySellBtnSelect(false);
                          setSellButtonSelected(true);
                          getUserBalance(selectedCoinPair?.quote_unit);
                          resetData(0);
                        }}
                        disabled={buySellBtnSelect ? false : true}
                        style={{
                          height: 40,
                          flex: 1,
                          borderRadius: 6,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: buySellBtnSelect
                            ? ThemeManager.colors.tabBackground
                            : ThemeManager.colors.textRedColor,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: Fonts.regular,
                            color: buySellBtnSelect
                              ? ThemeManager.colors.textColor1
                              : "white",
                          }}
                        >
                          {strings.trade_tab.sell}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", marginTop: 10 }}>
                      {sellButtonSelected ? (
                        <SelectDropdown
                          defaultValueByIndex={selectedSellIndex}
                          key={"first"}
                          dropdownOverlayColor={"transparent"}
                          data={listSellLimit}
                          onSelect={(selectedItem, index) => {
                            console.log("selectedItem-==index", index);
                            console.log(
                              "selectedItem-sell==selectedItem",
                              selectedItem
                            );

                            setSelectedSellIndex(index);
                            setSelectedItemSell(selectedItem.title);
                            if (index == 0) {
                              setLimitSelected(true);
                              setStopLimitSelected(false);
                            } else if (index == 1) {
                              setLimitSelected(false);
                              setStopLimitSelected(false);
                            } else {
                              dispatch(
                                tradeValuesUpdate({
                                  prop: "priceTrade",
                                  value: "",
                                })
                              );
                              dispatch(
                                tradeValuesUpdate({
                                  prop: "tradeAmount",
                                  value: "",
                                })
                              );
                              setLimitSelected(false);
                              setStopLimitSelected(true);
                            }
                            // setSelectedLimitedIndex(index);
                            // setuserPricePrecision(selectedItem.value);
                            getUserBalance(selectedCoinPair?.quote_unit);
                            resetData(0);
                          }}
                          buttonStyle={styles.dropdown3BtnStyle}
                          renderCustomizedButtonChild={(
                            selectedItem,
                            index
                          ) => {
                            return (
                              <View
                                style={[
                                  styles.dropdown3BtnChildStyle,
                                  {
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                    borderRadius: 6,
                                  },
                                ]}
                              >
                                <TouchableOpacity
                                  style={{
                                    height: 30,
                                    width: 30,
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                  }}
                                  onPress={() => {
                                    setShowRules(!isShowRules);
                                  }}
                                >
                                  <Image
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

                                <Text
                                  style={[
                                    styles.dropdown3BtnTxt,
                                    { color: ThemeManager.colors.textColor },
                                  ]}
                                >
                                  {selectedItem
                                    ? selectedItem.title
                                    : selectedItemSell}
                                </Text>

                                <Image
                                  source={{ uri: Images.icon_dropDown }}
                                  style={{
                                    height: 15,
                                    width: 15,
                                    resizeMode: "contain",
                                    tintColor:
                                      ThemeManager.colors.inactiveTextColor,
                                  }}
                                />
                              </View>
                            );
                          }}
                          // dropdownStyle={[
                          //   styles.dropdown3DropdownStyle,
                          //   {
                          //     backgroundColor: "red",
                          //     // ThemeManager.colors.tabBackground,
                          //     borderRadius: 6,
                          //   },
                          // ]}
                          // rowStyle={[
                          //   // styles.dropdown3RowStyle,
                          //   {
                          //     backgroundColor:
                          //       ThemeManager.colors.selectedTextColor,
                          //     // borderRadius: 6,
                          //   },
                          // ]}
                          // rowStyle={{
                          //   backgroundColor: ThemeManager.colors.tabBackground,
                          //   borderColor: ThemeManager.colors.tabBackground,
                          // }}
                          // dropdownStyle={{
                          //   backgroundColor: ThemeManager.colors.tabBackground,
                          //   borderColor: ThemeManager.colors.tabBackground,
                          // }}
                          // statusBarTranslucent={true}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <View
                                style={[
                                  styles.dropdown3RowChildStyle,
                                  {
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                    // borderColor: "red",
                                    // borderWidth: 1,
                                  },
                                ]}
                              >
                                {/* <Image
                                source={item.image}
                                style={styles.dropdownRowImage}
                              /> */}
                                <Text
                                  style={[
                                    styles.dropdown3RowTxt,
                                    {
                                      // color: ThemeManager.colors.headerText,
                                      color:
                                        selectedSellIndex === item.value
                                          ? ThemeManager.colors.Depositbtn
                                          : ThemeManager.colors.headerText,
                                    },
                                  ]}
                                >
                                  {item.title}
                                </Text>
                              </View>
                            );
                          }}
                          dropdownStyle={[
                            styles.dropdown3DropdownStyle,
                            {
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            },
                          ]}
                          // rowStyle={styles.dropdown3RowStyle}
                          rowStyle={[
                            styles.dropdown3RowStyle,
                            {
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            },
                          ]}
                        />
                      ) : (
                        <SelectDropdown
                          key={"second"}
                          data={listLimit}
                          defaultValueByIndex={selectedBuyIndex}
                          dropdownOverlayColor={"transparent"}
                          // defaultValueByIndex={3}
                          onSelect={(selectedItem, index) => {
                            console.log(
                              "selectedItem-=buy=selectedItem",
                              selectedItem
                            );
                            setSelectedBuyIndex(index);
                            setSelectedItemBuy(selectedItem.title);
                            if (index == 0) {
                              setStopLimitSelected(false);
                              setLimitSelected(true);
                            } else if (index == 1) {
                              setStopLimitSelected(false);
                              setLimitSelected(false);
                            }
                            getUserBalance(selectedCoinPair?.quote_unit);
                            resetData(0);
                          }}
                          buttonStyle={styles.dropdown3BtnStyle}
                          renderCustomizedButtonChild={(
                            selectedItem,
                            index
                          ) => {
                            return (
                              <View
                                style={[
                                  styles.dropdown3BtnChildStyle,
                                  {
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                  },
                                ]}
                              >
                                <TouchableOpacity
                                  style={{
                                    height: 30,
                                    width: 30,
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                  }}
                                  onPress={() => {
                                    setShowRules(!isShowRules);
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

                                <Text
                                  style={[
                                    styles.dropdown3BtnTxt,
                                    { color: ThemeManager.colors.textColor },
                                  ]}
                                >
                                  {selectedItem
                                    ? selectedItem.title
                                    : selectedItemBuy}
                                </Text>

                                <Image
                                  source={{ uri: Images.icon_dropDown }}
                                  style={{
                                    height: 15,
                                    width: 15,
                                    resizeMode: "contain",
                                    tintColor:
                                      ThemeManager.colors.inactiveTextColor,
                                    // tintColor: 'black',
                                  }}
                                />
                              </View>
                            );
                          }}
                          // dropdownStyle={styles.dropdown3DropdownStyle}
                          dropdownStyle={[
                            styles.dropdown3DropdownStyle,
                            {
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            },
                          ]}
                          // rowStyle={styles.dropdown3RowStyle}
                          rowStyle={[
                            styles.dropdown3RowStyle,
                            {
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            },
                          ]}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <View
                                style={[
                                  styles.dropdown3RowChildStyle,
                                  {
                                    backgroundColor:
                                      ThemeManager.colors.tabBackground,
                                  },
                                ]}
                              >
                                {/* <Image
                                source={item.image}
                                style={styles.dropdownRowImage}
                              /> */}
                                <Text
                                  style={[
                                    styles.dropdown3RowTxt,
                                    {
                                      // color: ThemeManager.colors.headerText,
                                      color:
                                        selectedBuyIndex === index
                                          ? ThemeManager.colors.Depositbtn
                                          : ThemeManager.colors.headerText,
                                    },
                                  ]}
                                >
                                  {item.title}
                                </Text>
                              </View>
                            );
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          marginVertical: 10,
                        }}
                      >
                        {limitSelected ? (
                          <TradeInput
                            keyboardType="decimal-pad"
                            placeholder={
                              limitValue
                                ? limitValue
                                : `Price (${selectedCoinPair?.quote_unit.toUpperCase()})`
                            }
                            placeholderTextColor={
                              ThemeManager.colors.inactiveTextColor
                            }
                            value={limitSelected ? priceTrade : ""}
                            multiline={Platform.OS === "android" ? true : false}
                            numberOfLines={1}
                            maxLength={14}
                            onChangeText={(text) => {
                              if (/^\d*\.?\d*$/.test(text)) {
                                setPercentageToDefault();

                                if (text.includes(".")) {
                                  let e = text.split(".");

                                  if (e[0].length == 0) {
                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "priceTrade",
                                        value: "0" + text,
                                      })
                                    );
                                  } else if (
                                    e[1].length <=
                                    tradeReducer?.priceDecimalValue
                                  ) {
                                    updatePriceValue(text);
                                  }
                                } else {
                                  updatePriceValue(text);
                                }
                              }
                            }}
                            // decOnPress={() => {
                            //   if (parseFloat(priceTrade) > 0.0001) {
                            //   }
                            //   onIncDec('Dec');
                            // }}
                            // onPressMinus={() => {
                            //   if (parseFloat(priceTrade) > 0.0001) {
                            //   }
                            //   onIncDec('Dec');
                            //   // check price
                            //   // if exist price - 0.0001
                            //   // if amount exist new price * amount =
                            // }}
                            // onPressPlus={() => {
                            //   onIncDec('Inc');
                            // }}
                            // incOnPress={() => {
                            //   onIncDec('Inc');
                            // }}
                            decOnPress={(sender) => {
                              setPercentageToDefault();
                              if (priceTrade != "") {
                                let amt = parseFloat(priceTrade);
                                console.log("amt=-=-=-", amt);
                                console.log(
                                  "priceDefaultPrecision-amt---",
                                  priceDefaultPrecision
                                );
                                console.log(
                                  "priceDefaultPrecisionValue--amt---",
                                  priceDefaultPrecisionValue
                                );
                                // alert("dec");
                                if (amt > 0) {
                                  amt =
                                    Number(amt) - Number(priceDefaultPrecision);
                                  amt = amt.toFixed(priceDefaultPrecisionValue);

                                  console.log("amt=-=-=-555--amt-9----", amt);

                                  dispatch(
                                    tradeValuesUpdate({
                                      prop: "priceTrade",
                                      value: amt.toString(),
                                    })
                                  );
                                  updatePriceValue(amt);
                                }

                                console.log("amt=-=-=-555--", amt);

                                // updateTotalPriceOnIncDec(
                                //   amt
                                //     .toFixed(tradeReducer?.priceDecimalValue)
                                //     .toString()
                                // );
                              } else {
                                let amt = parseFloat("0.0");
                                console.log("amt=-=-=else---", amt);
                                if (amt > 0) {
                                  amt = amt - Number(priceDefaultPrecision);
                                }

                                // updateTotalPriceOnIncDec(amt.toString());
                              }
                            }}
                            incOnPress={(sender) => {
                              // alert("dec");
                              console.log("priceTrade=-=-=-", priceTrade);

                              setPercentageToDefault();
                              if (priceTrade != "") {
                                let amt = parseFloat(priceTrade);
                                console.log("amt=-========-=-", amt);
                                console.log(
                                  "amt=-========-=typeof-",
                                  typeof amt
                                );

                                // alert("dec");
                                if (amt >= 0) {
                                  amt =
                                    parseFloat(amt) +
                                    parseFloat(priceDefaultPrecision);
                                  console.log(
                                    "amt=-=-plus=-555--amt---",
                                    amt,
                                    priceDefaultPrecision,
                                    priceDefaultPrecisionValue
                                  );
                                  amt = amt.toFixed(priceDefaultPrecisionValue);

                                  console.log(
                                    "amt=-=-plusdddd========-555--amt---",
                                    amt
                                  );
                                  dispatch(
                                    tradeValuesUpdate({
                                      prop: "priceTrade",
                                      value: amt.toString(),
                                    })
                                  );
                                  updatePriceValue(amt);
                                }

                                console.log("amt=-=-=-555--", amt);

                                // updateTotalPriceOnIncDec(
                                //   amt
                                //     .toFixed(tradeReducer?.priceDecimalValue)
                                //     .toString()
                                // );
                              } else {
                                let amt = parseFloat("0.0");

                                if (amt > 0) {
                                  amt = amt + Number(priceDefaultPrecision);
                                }

                                // updateTotalPriceOnIncDec(amt.toString());
                              }
                            }}
                            // incOnPress={sender => {
                            //   if (priceTrade != '') {
                            //     let amt = parseFloat(priceTrade);

                            //     amt = amt + 1.0;

                            //     updateTotalAmountOnIncDec(amt.toString());
                            //   } else {
                            //     let amt = parseFloat('0.0');

                            //     if (amt > 0) {
                            //       amt = amt + 0.001;
                            //     }

                            //     updateTotalAmountOnIncDec(amt.toString());
                            //   }
                            // }}
                            textInputStyle={{
                              color: ThemeManager.colors.textColor,
                              flex: 1,
                              textAlign: "center",
                            }}
                          />
                        ) : (
                          stopLimitSelected === false && (
                            <>
                              <View
                                style={{
                                  // flexDirection: 'row',
                                  //   flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 40,
                                  backgroundColor:
                                    ThemeManager.colors.tabBackground,
                                  paddingHorizontal: 10,
                                  borderRadius: 6,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontFamily: Fonts.regular,
                                    color: ThemeManager.colors.headerText,
                                  }}
                                >
                                  {strings.trade_tab.market_price}
                                </Text>
                              </View>
                              <View style={{ marginBottom: 10 }} />
                            </>
                          )
                        )}
                        <View>
                          {stopLimitSelected && limitSelected === false && (
                            <TradeInput
                              keyboardType="decimal-pad"
                              // placeholder={limitValue}
                              placeholder={
                                strings.trade_tab.stop +
                                ` (${selectedCoinPair?.quote_unit.toUpperCase()})`
                              }
                              placeholderTextColor={
                                ThemeManager.colors.inactiveTextColor
                              }
                              multiline={
                                Platform.OS === "android" ? true : false
                              }
                              maxLength={14}
                              numberOfLines={1}
                              value={
                                stopLimitSelected ? priceTrade : ""
                                // stopLimitSelected ? tradeReducer?.limitValue : ''
                              }
                              onChangeText={(text) => {
                                if (/^\d*\.?\d*$/.test(text)) {
                                  setPercentageToDefault();
                                  if (text.includes(".")) {
                                    let e = text.split(".");
                                    if (e[0].length == 0) {
                                      // dispatch(
                                      //   tradeValuesUpdate({
                                      //     prop: 'priceTrade',
                                      //     value: '0' + text,
                                      //   }),
                                      // );
                                      // stopValue
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "priceTrade",
                                          value: "0" + text,
                                        })
                                      );
                                    } else if (
                                      e[1].length <=
                                      tradeReducer?.priceDecimalValue
                                    ) {
                                      updatePriceLimitValue(text);
                                      // updatePriceValue(text);
                                    }
                                  } else {
                                    // updatePriceValue(text);
                                    updatePriceLimitValue(text);
                                  }
                                }
                              }}
                              decOnPress={(sender) => {
                                setPercentageToDefault();
                                if (priceTrade != "") {
                                  let amt = parseFloat(priceTrade);
                                  console.log("amt=-=-=-", amt);

                                  // alert("dec");
                                  if (amt > 0) {
                                    amt =
                                      Number(amt) -
                                      Number(priceDefaultPrecision);
                                    amt = amt.toFixed(
                                      priceDefaultPrecisionValue
                                    );

                                    console.log(
                                      "amt=-=-=-555--amt====---",
                                      amt
                                    );

                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "priceTrade",
                                        value: amt.toString(),
                                      })
                                    );
                                    updatePriceLimitValue(amt);
                                  }

                                  console.log("amt=-=-=-555--", amt);

                                  // updateTotalPriceOnIncDec(
                                  //   amt
                                  //     .toFixed(tradeReducer?.priceDecimalValue)
                                  //     .toString()
                                  // );
                                } else {
                                  let amt = parseFloat("0.0");

                                  if (amt > 0) {
                                    amt = amt - Number(priceDefaultPrecision);
                                  }

                                  updatePriceLimitValue(amt.toString());
                                }
                              }}
                              incOnPress={(sender) => {
                                // alert("dec");
                                console.log("priceTrade=-=-=-", priceTrade);

                                setPercentageToDefault();
                                if (priceTrade != "") {
                                  let amt = parseFloat(priceTrade);
                                  console.log("amt=-========-=-", amt);

                                  // alert("dec");
                                  if (amt >= 0) {
                                    amt =
                                      parseFloat(amt) +
                                      parseFloat(priceDefaultPrecision);
                                    console.log(
                                      "amt=-=-plus=-555--amt---",
                                      amt,
                                      priceDefaultPrecision,
                                      priceDefaultPrecisionValue
                                    );
                                    amt = amt.toFixed(
                                      priceDefaultPrecisionValue
                                    );
                                    console.log(
                                      "amt=-=-plusdddd=-555--amt---",
                                      amt
                                    );
                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "priceTrade",
                                        value: amt.toString(),
                                      })
                                    );
                                    updatePriceLimitValue(amt);
                                  }

                                  console.log("amt=-=-=-555--", amt);

                                  // updateTotalPriceOnIncDec(
                                  //   amt
                                  //     .toFixed(tradeReducer?.priceDecimalValue)
                                  //     .toString()
                                  // );
                                } else {
                                  let amt = parseFloat("0.0");

                                  if (amt > 0) {
                                    amt = amt + Number(priceDefaultPrecision);
                                  }

                                  updatePriceLimitValue(amt.toString());
                                }
                              }}
                              textInputStyle={{
                                color: ThemeManager.colors.textColor,
                                // backgroundColor: 'red',
                                flex: 1,
                                textAlign: "center",
                              }}
                            />
                          )}
                        </View>

                        <View>
                          {stopLimitSelected && limitSelected === false && (
                            <>
                              <View style={{ marginVertical: 5 }} />
                              <TradeInput
                                keyboardType="decimal-pad"
                                multiline={
                                  Platform.OS === "android" ? true : false
                                }
                                numberOfLines={1}
                                maxLength={14}
                                placeholder={
                                  // limitValue ? limitValue : strings.trade_tab.limit
                                  spotLimitValue
                                    ? spotLimitValue
                                    : strings.trade_tab.limit +
                                    ` (${selectedCoinPair?.quote_unit.toUpperCase()})`
                                }
                                placeholderTextColor={
                                  ThemeManager.colors.inactiveTextColor
                                }
                                value={
                                  // limitSelected === false
                                  //   ? priceTrade
                                  //   : ''
                                  tradeReducer?.limitValue
                                    ? tradeReducer?.limitValue
                                    : ""
                                }
                                onChangeText={(text) => {
                                  if (/^\d*\.?\d*$/.test(text)) {
                                    setPercentageToDefault();

                                    if (text.includes(".")) {
                                      let e = text.split(".");

                                      if (e[0].length == 0) {
                                        // dispatch(
                                        //   tradeValuesUpdate({
                                        //     prop: 'priceTrade',
                                        //     value: '0' + text,
                                        //   }),
                                        // );
                                        dispatch(
                                          tradeValuesUpdate({
                                            prop: "limitValue",
                                            value: "0" + text,
                                          })
                                        );
                                        // updateAmountOnStopLimitIncDec(text);
                                        updatePriceValueStopLimit(text);
                                      } else if (
                                        e[1].length <=
                                        tradeReducer?.priceDecimalValue
                                      ) {
                                        dispatch(
                                          tradeValuesUpdate({
                                            prop: "limitValue",
                                            value: text,
                                          })
                                        );
                                        // updateAmountOnStopLimitIncDec(text);
                                        updatePriceValueStopLimit(text);
                                      }
                                    } else {
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "limitValue",
                                          value: text,
                                        })
                                      );
                                      // updateAmountOnStopLimitIncDec(text);
                                      updatePriceValueStopLimit(text);
                                    }
                                  }
                                }}
                                decOnPress={(sender) => {
                                  setPercentageToDefault();
                                  if (tradeReducer?.limitValue != "") {
                                    let amt = parseFloat(
                                      tradeReducer?.limitValue
                                    );
                                    console.log("amt=-=-=-", amt);

                                    // alert("dec");
                                    if (amt > 0) {
                                      amt =
                                        Number(amt) -
                                        Number(priceDefaultPrecision);
                                      amt = amt.toFixed(
                                        priceDefaultPrecisionValue
                                      );

                                      console.log(
                                        "amt=-=-=-555--amt--=-=====-",
                                        amt
                                      );

                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "limitValue",
                                          value: amt.toString(),
                                        })
                                      );
                                      // updatePriceLimitValue(amt);
                                      // updateAmountOnStopLimitIncDec(amt);
                                      updatePriceValueStopLimit(amt);
                                    }

                                    console.log("===amt=-=-=-555--", amt);

                                    // updateTotalPriceOnIncDec(
                                    //   amt
                                    //     .toFixed(tradeReducer?.priceDecimalValue)
                                    //     .toString()
                                    // );
                                  } else {
                                    let amt = parseFloat("0.0");

                                    if (amt > 0) {
                                      amt = amt - Number(priceDefaultPrecision);
                                    }

                                    // updatePriceLimitValue(amt.toString());
                                    // updateAmountOnStopLimitIncDec(
                                    //   amt.toString()
                                    // );
                                    updatePriceValueStopLimit(amt.toString);
                                  }
                                }}
                                incOnPress={(sender) => {
                                  // alert("dec");
                                  console.log(
                                    "tradeReducer?.limitValue=-=-=-",
                                    tradeReducer?.limitValue
                                  );

                                  setPercentageToDefault();
                                  if (tradeReducer?.limitValue != "") {
                                    let amt = parseFloat(
                                      tradeReducer?.limitValue
                                    );
                                    console.log("amt=-========-=-", amt);

                                    // alert("dec");
                                    if (amt >= 0) {
                                      amt =
                                        parseFloat(amt) +
                                        parseFloat(priceDefaultPrecision);
                                      console.log(
                                        "amt=-=-plus=-555--amt---",
                                        amt,
                                        priceDefaultPrecision,
                                        priceDefaultPrecisionValue
                                      );
                                      amt = amt.toFixed(
                                        priceDefaultPrecisionValue
                                      );
                                      console.log(
                                        "amt=-=-plusdddd=-555--amt---",
                                        amt
                                      );
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "limitValue",
                                          value: amt.toString(),
                                        })
                                      );
                                      // updatePriceLimitValue(amt);
                                      // updateAmountOnStopLimitIncDec(amt);
                                      updatePriceValueStopLimit(amt);
                                    }

                                    console.log("=-=-amt=-=-=-555--", amt);

                                    // updateTotalPriceOnIncDec(
                                    //   amt
                                    //     .toFixed(tradeReducer?.priceDecimalValue)
                                    //     .toString()
                                    // );
                                  } else {
                                    let amt = parseFloat("0.0");

                                    if (amt > 0) {
                                      amt = amt + Number(priceDefaultPrecision);
                                    }
                                    updatePriceValueStopLimit(amt.toString);
                                    // updateAmountOnStopLimitIncDec(
                                    //   amt.toString()
                                    // );
                                    // updatePriceLimitValue(amt.toString());
                                  }
                                }}
                                textInputStyle={{
                                  color: ThemeManager.colors.textColor,
                                  flex: 1,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              />
                            </>
                          )}

                          {stopLimitSelected && limitSelected === false ? (
                            <>
                              <View style={{ marginVertical: 5 }} />
                              <TradeInput
                                placeholder={
                                  "Amount" +
                                  " (" +
                                  selectedCoinPair?.base_unit.toUpperCase() +
                                  ")"
                                }
                                placeholderTextColor={
                                  ThemeManager.colors.inactiveTextColor
                                }
                                multiline={
                                  Platform.OS === "android" ? true : false
                                }
                                numberOfLines={1}
                                keyboardType="decimal-pad"
                                value={
                                  tradeReducer?.tradeAmount
                                    ? tradeReducer?.tradeAmount
                                    : ""
                                }
                                onChangeText={(text) => {
                                  // alert("hhhe");
                                  if (/^\d*\.?\d*$/.test(text)) {
                                    if (stopLimitSelected) {
                                      if (text.includes(".")) {
                                        var e = text.split(".");

                                        if (e[0].length == 0) {
                                          dispatch(
                                            tradeValuesUpdate({
                                              prop: "tradeAmount",
                                              value: "0" + text,
                                            })
                                          );
                                        } else if (
                                          e[1].length <= amountDecimalValue
                                        ) {
                                          updateTotalAmountOnStopLimitIncDec(
                                            text
                                          );
                                          setPercentageToDefault();
                                        }
                                      } else {
                                        updateTotalAmountOnStopLimitIncDec(
                                          text
                                        );
                                        setPercentageToDefault();
                                      }
                                    }
                                  }
                                }}
                                decOnPress={(sender) => {
                                  setPercentageToDefault();
                                  console.log("decOnPress=-=-=-");
                                  if (tradeReducer?.tradeAmount != "") {
                                    let amt = parseFloat(
                                      tradeReducer?.tradeAmount
                                    );
                                    console.log("amt=-=-=-", amt);

                                    // alert("dec");
                                    if (amt > 0) {
                                      console.log(
                                        "amt=-=amountDefaultPrecision-----=-==-",
                                        amountDefaultPrecision
                                      );
                                      console.log(
                                        "amt=-=amountDefaultPrecisionValue-----=-==-",
                                        amountDefaultPrecisionValue
                                      );
                                      if (
                                        amountDefaultPrecision != undefined &&
                                        amountDefaultPrecisionValue != undefined
                                      ) {
                                        amt =
                                          Number(amt) -
                                          Number(amountDefaultPrecision);
                                        amt = amt.toFixed(
                                          amountDefaultPrecisionValue
                                        );
                                        console.log(
                                          "amt=-=-=-value else-===----=-==-",
                                          amt
                                        );
                                      } else {
                                        amt = Number(amt) - 1;
                                        console.log(
                                          "amt=-=-=-value else-----==------==-",
                                          amt
                                        );
                                      }
                                      console.log(
                                        "amt=-=-=-555--amt--0-----=-==-",
                                        amt
                                      );

                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value: amt.toString(),
                                        })
                                      );
                                      updateTotalAmountOnStopLimitIncDec(amt);
                                      setPercentageToDefault();
                                    }

                                    console.log("amt=-=-=-555--", amt);

                                    // updateTotalPriceOnIncDec(
                                    //   amt
                                    //     .toFixed(tradeReducer?.priceDecimalValue)
                                    //     .toString()
                                    // );
                                  } else {
                                    let amt = parseFloat("0.0");

                                    if (amt > 0) {
                                      if (amountDefaultPrecision != undefined) {
                                        amt =
                                          amt - Number(amountDefaultPrecision);
                                      } else {
                                        amt = amt - 1;
                                      }
                                    }

                                    updateTotalAmountOnStopLimitIncDec(
                                      amt.toString()
                                    );
                                    setPercentageToDefault();
                                  }
                                }}
                                incOnPress={(sender) => {
                                  console.log("incOnPress=-=-=-");
                                  console.log(
                                    "tradeReducer?.tradeAmount=-=-=-",
                                    tradeReducer?.tradeAmount
                                  );

                                  setPercentageToDefault();
                                  if (tradeReducer?.tradeAmount != "") {
                                    let amt = parseFloat(
                                      tradeReducer?.tradeAmount
                                    );
                                    console.log(
                                      "amt=-===tradeAmount=====-=-",
                                      amt
                                    );

                                    // alert("dec");
                                    if (amt >= 0) {
                                      if (
                                        amountDefaultPrecision != undefined &&
                                        amountDefaultPrecisionValue != undefined
                                      ) {
                                        amt =
                                          parseFloat(amt) +
                                          parseFloat(amountDefaultPrecision);
                                        console.log(
                                          "amt=-=-plus=-tradeAmount--amt--==-",
                                          amt,
                                          amountDefaultPrecision,
                                          amountDefaultPrecisionValue
                                        );
                                        amt = amt.toFixed(
                                          amountDefaultPrecisionValue
                                        );
                                      } else {
                                        amt = parseFloat(amt) + 1;
                                        console.log(
                                          "amt=-=-plus=-tradeAmount--amt-0000--",
                                          amt,
                                          amountDefaultPrecision,
                                          amountDefaultPrecisionValue
                                        );
                                        // amt = amt;
                                      }

                                      console.log(
                                        "amt=-=-tradeAmount=-555--amt---",
                                        amt
                                      );
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value: amt.toString(),
                                        })
                                      );
                                      updateTotalAmountOnStopLimitIncDec(amt);
                                      setPercentageToDefault();
                                    }

                                    console.log(
                                      "amt=-=tradeAmount-=-555--",
                                      amt
                                    );
                                  } else {
                                    let amt = parseFloat("0.0");

                                    if (amt > 0) {
                                      if (amountDefaultPrecision != undefined) {
                                        amt =
                                          amt + Number(amountDefaultPrecision);
                                      } else {
                                        amt + 1;
                                      }
                                    }

                                    updateTotalAmountOnStopLimitIncDec(
                                      amt.toString()
                                    );
                                    setPercentageToDefault();
                                  }
                                }}
                                // decOnPress={(sender) => {
                                //   // setPercentageToDefault();
                                //   if (tradeReducer?.tradeAmount != "") {
                                //     let amt = parseFloat(
                                //       tradeReducer?.tradeAmount
                                //     );
                                //     console.log(
                                //       "tradeReducer?.tradeAmount=-=-=-",
                                //       amt
                                //     );
                                //     console.log(
                                //       "amountDefaultPrecisionValue=-=-",
                                //       amountDefaultPrecisionValue
                                //     );
                                //     console.log(
                                //       "amountDefaultPrecisionValue=-=-",
                                //       amountDefaultPrecisionValue
                                //     );
                                //     // alert("dec");
                                //     if (amt > 0) {
                                //       amt =
                                //         Number(amt) -
                                //         Number(amountDefaultPrecision);
                                //       amt = amt.toFixed(
                                //         amountDefaultPrecisionValue
                                //       );

                                //       console.log("amt=-=-=-555--amt---", amt);

                                //       dispatch(
                                //         tradeValuesUpdate({
                                //           prop: "tradeAmount",
                                //           value: amt.toString(),
                                //         })
                                //       );
                                //       // updatePriceValueDec(amt);
                                //     }

                                //     console.log("amt=-=-=-555--", amt);
                                //     updateTotalAmountOnIncDec(
                                //       amt
                                //         .toFixed(
                                //           amountDecimalValue
                                //         )
                                //         .toString()
                                //     );
                                //     setBtnOneSelected(false);
                                //     setBtnTwoSelected(false);
                                //     setBtnThreeSelected(false);
                                //     setBtnFourSelected(false);
                                //     setSelectedButton("0%");
                                //   } else {
                                //     let amt = parseFloat("0.0");

                                //     if (amt > 0) {
                                //       amt =
                                //         amt - Number(amountDefaultPrecision);
                                //     }

                                //     updateTotalAmountOnIncDec(
                                //       amt
                                //         .toFixed(
                                //           amountDecimalValue
                                //         )
                                //         .toString()
                                //     );
                                //     setBtnOneSelected(false);
                                //     setBtnTwoSelected(false);
                                //     setBtnThreeSelected(false);
                                //     setBtnFourSelected(false);
                                //     setSelectedButton("0%");
                                //   }
                                // }}
                                // incOnPress={(sender) => {
                                //   // alert("dec");
                                //   console.log(
                                //     "tradeReducer?.tradeAmount=-=-=-",
                                //     tradeReducer?.tradeAmount
                                //   );

                                //   setPercentageToDefault();
                                //   if (tradeReducer?.tradeAmount != "") {
                                //     let amt = parseFloat(
                                //       tradeReducer?.tradeAmount
                                //     );
                                //     console.log(
                                //       "amt=-======tradeAmount==-=-",
                                //       amt
                                //     );

                                //     // alert("dec");
                                //     if (amt >= 0) {
                                //       amt =
                                //         parseFloat(amt) +
                                //         parseFloat(priceDefaultPrecision);
                                //       console.log(
                                //         "amt=-=-tradeAmount--amt---",
                                //         amt,
                                //         priceDefaultPrecision,
                                //         priceDefaultPrecisionValue
                                //       );
                                //       amt = amt.toFixed(
                                //         priceDefaultPrecisionValue
                                //       );
                                //       console.log(
                                //         "amt=-=-tradeAmount=-555--amt---",
                                //         amt
                                //       );
                                //       dispatch(
                                //         tradeValuesUpdate({
                                //           prop: "tradeAmount",
                                //           value: amt.toString(),
                                //         })
                                //       );
                                //       updatePriceValueDec(amt);
                                //       setBtnOneSelected(false);
                                //       setBtnTwoSelected(false);
                                //       setBtnThreeSelected(false);
                                //       setBtnFourSelected(false);
                                //       setSelectedButton("0%");
                                //     }

                                //     console.log("amt=-=-=-555--", amt);

                                //     // updateTotalPriceOnIncDec(
                                //     //   amt
                                //     //     .toFixed(tradeReducer?.priceDecimalValue)
                                //     //     .toString()
                                //     // );
                                //   } else {
                                //     let amt = parseFloat("0.0");

                                //     if (amt > 0) {
                                //       amt = amt + Number(priceDefaultPrecision);
                                //     }

                                //     updateTotalPriceOnIncDec(amt.toString());
                                //     setBtnOneSelected(false);
                                //     setBtnTwoSelected(false);
                                //     setBtnThreeSelected(false);
                                //     setBtnFourSelected(false);
                                //     setSelectedButton("0%");
                                //   }
                                // }}
                                // decOnPress={(sender) => {
                                //   if (tradeReducer?.tradeAmount != "") {
                                //     let amt = parseFloat(
                                //       tradeReducer?.tradeAmount
                                //     );

                                //     if (amt > 0) {
                                //       amt = amt - 0.001;
                                //     }

                                //     updateTotalAmountOnIncDec(
                                //       amt
                                //         .toFixed(
                                //           amountDecimalValue
                                //         )
                                //         .toString()
                                //     );
                                //   } else {
                                //     let amt = parseFloat("0.0");

                                //     if (amt > 0) {
                                //       amt = amt - 0.001;
                                //     }

                                //     updateTotalAmountOnIncDec(amt.toString());
                                //   }
                                // }}
                                // incOnPress={(sender) => {
                                //   if (tradeReducer?.tradeAmount != "") {
                                //     let amt = parseFloat(
                                //       tradeReducer?.tradeAmount
                                //     );

                                //     amt = amt + 1.0;

                                //     updateTotalAmountOnIncDec(amt.toString());
                                //   } else {
                                //     let amt = parseFloat("0.0");

                                //     if (amt > 0) {
                                //       amt = amt + 0.001;
                                //     }

                                //     updateTotalAmountOnIncDec(amt.toString());
                                //   }
                                // }}
                                // onPressMinus={() => {
                                //   // onIncDecAmount('Dec');
                                // }}
                                // onPressPlus={() => {
                                //   // onIncDecAmount('Inc');
                                // }}
                                // decOnPress={(sender) => {
                                //   if (tradeReducer?.tradeAmount != "") {
                                //     let amt = parseFloat(
                                //       tradeReducer?.tradeAmount
                                //     );

                                //     if (amt > 0) {
                                //       amt = amt - 0.001;
                                //     }

                                //     updateTotalAmountOnIncDec(
                                //       amt
                                //         .toFixed(
                                //           amountDecimalValue
                                //         )
                                //         .toString()
                                //     );
                                //   } else {
                                //     let amt = parseFloat("0.0");

                                //     if (amt > 0) {
                                //       amt = amt - 0.001;
                                //     }

                                //     updateTotalAmountOnIncDec(amt.toString());
                                //   }
                                // }}
                                // incOnPress={(sender) => {
                                //   if (tradeReducer?.tradeAmount != "") {
                                //     let amt = parseFloat(
                                //       tradeReducer?.tradeAmount
                                //     );

                                //     amt = amt + 1.0;

                                //     updateTotalAmountOnIncDec(amt.toString());
                                //   } else {
                                //     let amt = parseFloat("0.0");

                                //     if (amt > 0) {
                                //       amt = amt + 0.001;
                                //     }

                                //     updateTotalAmountOnIncDec(amt.toString());
                                //   }
                                // }}
                                textInputStyle={{
                                  color: ThemeManager.colors.headerText,
                                  justifyContent: "center",
                                  alignSelf: "center",
                                  alignItems: "center",
                                  textAlign: "center",
                                  flex: 1,
                                  // color: ThemeManager.colors.textColor1,
                                  // backgroundColor: 'red',
                                  // // textAlign: 'left',
                                  // textAlign: 'center',
                                  // alignSelf: 'center',
                                  // flex: 1,
                                  // justifyContent: 'center',
                                  // width: '100%',
                                }}
                                maxLength={15}
                              />
                            </>
                          ) : null}
                        </View>

                        {limitSelected ? (
                          <>
                            <View style={{ marginVertical: 5 }} />
                            <TradeInput
                              placeholder={
                                "Amount" +
                                " (" +
                                selectedCoinPair?.base_unit.toUpperCase() +
                                ")"
                              }
                              placeholderTextColor={
                                ThemeManager.colors.inactiveTextColor
                              }
                              // multiline={false}
                              multiline={
                                Platform.OS === "android" ? true : false
                              }
                              numberOfLines={1}
                              keyboardType="decimal-pad"
                              value={tradeReducer?.tradeAmount}
                              onChangeText={(text) => {
                                if (/^\d*\.?\d*$/.test(text)) {
                                  if (limitSelected) {
                                    if (text.includes(".")) {
                                      var e = text.split(".");

                                      if (e[0].length == 0) {
                                        dispatch(
                                          tradeValuesUpdate({
                                            prop: "tradeAmount",
                                            value: "0" + text,
                                          })
                                        );
                                      } else if (
                                        e[1].length <= amountDecimalValue
                                      ) {
                                        updateTotalAmountOnIncDec(text);
                                        setPercentageToDefault();
                                        // alert("hello");
                                      }
                                    } else {
                                      updateTotalAmountOnIncDec(text);
                                      setPercentageToDefault();
                                      // alert("hey");
                                    }
                                  }
                                }
                              }}
                              decOnPress={(sender) => {
                                setPercentageToDefault();
                                if (tradeReducer?.tradeAmount != "") {
                                  let amt = parseFloat(
                                    tradeReducer?.tradeAmount
                                  );

                                  // alert("dec");
                                  if (amt > 0) {
                                    console.log("amt=-=-=-", amt);
                                    console.log(
                                      "amountDefaultPrecisionValue-555--amt---",
                                      amountDefaultPrecisionValue
                                    );
                                    console.log(
                                      "amountDefaultPrecision-555--amt---",
                                      amountDefaultPrecision
                                    );

                                    if (
                                      amountDefaultPrecision != undefined &&
                                      amountDefaultPrecisionValue != undefined
                                    ) {
                                      amt =
                                        Number(amt) -
                                        Number(amountDefaultPrecision);
                                      amt = amt.toFixed(
                                        amountDefaultPrecisionValue
                                      );
                                    } else {
                                      amt = Number(amt) - 1;
                                    }

                                    console.log(
                                      "amt=-=-=-555--amt--=----",
                                      amt
                                    );
                                    console.log(
                                      "amountDefaultPrecisionValue-555--amt---",
                                      amountDefaultPrecisionValue
                                    );
                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "tradeAmount",
                                        value: amt.toString(),
                                      })
                                    );
                                    updateTotalAmountOnIncDec(amt);
                                    setPercentageToDefault();
                                  }

                                  console.log("==-=--amt=-=-=-555--", amt);

                                  // updateTotalPriceOnIncDec(
                                  //   amt
                                  //     .toFixed(tradeReducer?.priceDecimalValue)
                                  //     .toString()
                                  // );
                                } else {
                                  let amt = parseFloat("0.0");

                                  if (amt > 0) {
                                    if (amountDefaultPrecision != undefined) {
                                      amt =
                                        amt - Number(amountDefaultPrecision);
                                    } else {
                                      amt = amt - 1;
                                    }
                                  }

                                  updateTotalAmountOnIncDec(amt.toString());
                                  setPercentageToDefault();
                                }
                              }}
                              incOnPress={(sender) => {
                                // alert("dec");
                                console.log(
                                  "tradeReducer?.tradeAmount=-=-=-",
                                  tradeReducer?.tradeAmount
                                );

                                setPercentageToDefault();
                                if (tradeReducer?.tradeAmount != "") {
                                  let amt = parseFloat(
                                    tradeReducer?.tradeAmount
                                  );
                                  console.log(
                                    "amt=-===tradeAmount=====-=-",
                                    amt
                                  );

                                  // alert("dec");
                                  console.log("amt=-amt >= 0=---", amt >= 0);
                                  if (amt >= 0) {
                                    if (
                                      amountDefaultPrecision != undefined &&
                                      amountDefaultPrecisionValue != undefined
                                    ) {
                                      console.log(
                                        "amt=-=-amountDefaultPrecision=---",
                                        typeof amt
                                      );
                                      amt = (
                                        parseFloat(amt) +
                                        parseFloat(amountDefaultPrecision)
                                      ).toFixed(amountDefaultPrecisionValue);
                                      console.log(
                                        "amt=-=-amountDefaultPrecision=rrr---",
                                        amt
                                      );
                                    } else {
                                      console.log(
                                        "amt=-=-tradeAmount=-elsed99--",
                                        typeof amt
                                      );
                                      amt = amt + 1;
                                      console.log(
                                        "amt=-=-tradeAmount=-else--",
                                        amt
                                      );
                                    }
                                    console.log(
                                      "amt=-=-plus=-tradeAmount--amt-===--",
                                      amt,
                                      amountDefaultPrecision,
                                      amountDefaultPrecisionValue
                                    );
                                    // if (
                                    //   amountDefaultPrecisionValue !=
                                    //     undefined &&
                                    //   amountDefaultPrecision != undefined
                                    // ) {
                                    //   console.log(
                                    //     "amt=-=-tradeAmount=-555--amt---",
                                    //     typeof amt
                                    //   );
                                    //   amt = amt.toFixed(
                                    //     amountDefaultPrecisionValue
                                    //   );
                                    // } else {
                                    //   amt = amt;
                                    // }

                                    console.log(
                                      "amt=-=-tradeAmount=-555--amt---",
                                      amt
                                    );
                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "tradeAmount",
                                        value: amt.toString(),
                                      })
                                    );
                                    updateTotalAmountOnIncDec(amt);
                                    setPercentageToDefault();
                                  }

                                  console.log("amt=-=tradeAmount-=-555--", amt);

                                  // updateTotalPriceOnIncDec(
                                  //   amt
                                  //     .toFixed(tradeReducer?.priceDecimalValue)
                                  //     .toString()
                                  // );
                                } else {
                                  let amt = parseFloat("0.0");

                                  if (amt > 0) {
                                    if (amountDefaultPrecision != undefined) {
                                      amt =
                                        amt + Number(amountDefaultPrecision);
                                    } else {
                                      amt = amt + 1;
                                    }
                                  }

                                  updateTotalAmountOnIncDec(amt.toString());
                                  setPercentageToDefault();
                                }
                              }}
                              textInputStyle={{
                                color: ThemeManager.colors.headerText,
                                flex: 1,
                                textAlign: "center",

                                alignSelf: "center",
                                alignItems: "center",
                              }}
                              maxLength={15}
                            />
                          </>
                        ) : null}

                        {limitSelected === false &&
                          stopLimitSelected === false ? (
                          <View>
                            <TradeInput
                              keyboardType={"decimal-pad"}
                              placeholder={`Amount ${buySellBtnSelect
                                ? amountSelected
                                  ? "(" +
                                  selectedCoinPair?.base_unit.toUpperCase() +
                                  ")"
                                  : "(" +
                                  selectedCoinPair?.quote_unit.toUpperCase() +
                                  ")"
                                : amountSelected
                                  ? "(" +
                                  selectedCoinPair?.base_unit.toUpperCase() +
                                  ")"
                                  : "(" +
                                  selectedCoinPair?.quote_unit.toUpperCase() +
                                  ")"
                                }`}
                              placeholderTextColor={
                                ThemeManager.colors.inactiveTextColor
                              }
                              value={
                                amountSelected
                                  ? tradeReducer?.tradeAmount
                                  : tradeReducer?.totalAmount
                              }
                              numberOfLines={1}
                              maxLength={14}
                              multiline={
                                Platform.OS === "android" ? true : false
                              }
                              onChangeText={(e) => {
                                // setAmount(e);
                                if (/^\d*\.?\d*$/.test(e)) {
                                  setPercentageToDefault();
                                  let currentPrice =
                                    renderLastPrice(selectedCoinPair?.name) !=
                                      undefined
                                      ? renderLastPrice(selectedCoinPair?.name)
                                        .last
                                      : " ";

                                  if (amountSelected) {
                                    let amount;
                                    if (e.includes(".")) {
                                      let temp = e.split(".");
                                      if (
                                        temp[1].length <= amountDecimalValue
                                      ) {
                                        amount = e;
                                      } else {
                                        return;
                                      }
                                    } else {
                                      amount = e;
                                    }

                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "tradeAmount",
                                        value: amount.toString(),
                                      })
                                    );
                                    var total =
                                      parseFloat(amount) * currentPrice;
                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "totalAmount",
                                        value: (amount <= 0 ||
                                          amount.length == 0
                                          ? " "
                                          : total
                                        ).toString(),
                                      })
                                    );
                                  } else {
                                    dispatch(
                                      tradeValuesUpdate({
                                        prop: "totalAmount",
                                        value: e,
                                      })
                                    );
                                    let amount = (1 * e) / (1 * currentPrice);
                                    if (amountDecimalValue > 0) {
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value: amount
                                            .toFixed(amountDecimalValue)
                                            .toString(),
                                        })
                                      );
                                    } else {
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value: amount.toString(),
                                        })
                                      );
                                    }
                                  }
                                }
                              }}
                              decOnPress={(sender) => {
                                setPercentageToDefault();
                                let currentPrice =
                                  renderLastPrice(selectedCoinPair?.name) !=
                                    undefined
                                    ? renderLastPrice(selectedCoinPair?.name)
                                      .last
                                    : " ";
                                console.log(
                                  "amountDefaultPrecision=999999-=-=-",
                                  amountDefaultPrecision
                                );
                                console.log(
                                  "tradeReducer?.tradeAmount-=-=-",
                                  tradeReducer?.tradeAmount
                                );
                                if (tradeReducer?.tradeAmount != "") {
                                  let amt = parseFloat(
                                    tradeReducer?.tradeAmount
                                  );
                                  console.log(
                                    "amt=-=tradeReducer?.tradeAmount-=-",
                                    amt
                                  );
                                  console.log(
                                    "amountDefaultPrecision=-=-=-",
                                    amountDefaultPrecision
                                  );

                                  // alert("dec");
                                  if (amt > 0) {
                                    if (amountDefaultPrecision != undefined) {
                                      amt =
                                        Number(amt) -
                                        Number(amountDefaultPrecision);
                                    } else {
                                      amt = Number(amt) - 1;
                                    }
                                    if (
                                      amountDefaultPrecisionValue != undefined
                                    ) {
                                      amt = amt.toFixed(
                                        amountDefaultPrecisionValue
                                      );
                                    } else {
                                      amt = amt;
                                    }

                                    console.log(
                                      "=-=-=amt=-=-=-555--amt---",
                                      amt
                                    );

                                    if (amountSelected) {
                                      let amount;
                                      if (amt.toString().includes(".")) {
                                        let temp = amt.split(".");
                                        if (
                                          temp[1].length <= amountDecimalValue
                                        ) {
                                          amount = amt;
                                        } else {
                                          return;
                                        }
                                      } else {
                                        amount = amt;
                                      }

                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value: amount.toString(),
                                        })
                                      );
                                      var total =
                                        parseFloat(amount) * currentPrice;
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "totalAmount",
                                          value: (amount <= 0 ||
                                            amount.length == 0
                                            ? " "
                                            : total
                                          ).toString(),
                                        })
                                      );
                                    } else {
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "totalAmount",
                                          value: amt.toString(),
                                        })
                                      );
                                      let amount =
                                        (1 * amt) / (1 * currentPrice);

                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value:
                                            amount.toFixed(amountDecimalValue),
                                        })
                                      );
                                    }
                                  }

                                  console.log("=-=-----amt=-=-=-555--", amt);
                                } else {
                                  let amt;
                                  console.log(
                                    "tradeReducer?.tradeAmount-=-amt=+++-",
                                    amt,
                                    amountDefaultPrecision
                                  );
                                  if (amountDefaultPrecision != undefined) {
                                    amt = amountDefaultPrecision;
                                    if (amt > 0) {
                                      console.log(
                                        "tradeReducer?.tradeAmount-=-amt>0=-",
                                        amt
                                      );
                                      amt =
                                        parseFloat(amt) -
                                        Number(amountDefaultPrecision);
                                    } else {
                                      amt = 0;
                                    }
                                  } else {
                                    console.log(
                                      "tradeReducer?.tradeAmount-=-amt=-",
                                      amt
                                    );
                                    console.log(
                                      "tradeReducer?.tradeAmount-=-amt=typeof-",
                                      typeof amt
                                    );
                                    if (amt > 0) {
                                      amt = amt - 1;
                                    } else {
                                      amt = 0;
                                    }
                                  }
                                  dispatch(
                                    tradeValuesUpdate({
                                      prop: "tradeAmount",
                                      value: parseFloat(amt).toString(),
                                    })
                                  );
                                  // updateTotalAmountOnIncDec(amt.toString());
                                }
                              }}
                              incOnPress={(sender) => {
                                // alert("dec");
                                let amt;
                                setPercentageToDefault();
                                let currentPrice =
                                  renderLastPrice(selectedCoinPair?.name) !=
                                    undefined
                                    ? renderLastPrice(selectedCoinPair?.name)
                                      .last
                                    : " ";
                                console.log(
                                  "amountDefaultPrecision=7777777-=-=-",
                                  amountDefaultPrecision
                                );
                                console.log(
                                  "amountDefaultPrecision=7777777333-=-=-",
                                  tradeReducer?.tradeAmount
                                );
                                console.log(
                                  "tradeReducer?.tradeAmount!=-=-=-",
                                  tradeReducer?.tradeAmount != ""
                                );
                                if (tradeReducer?.tradeAmount != "") {
                                  amt = parseFloat(tradeReducer?.tradeAmount);
                                  console.log("amt=-=-=ww-", amt);
                                  console.log(
                                    "amountDefaultPrecision=-=-ww=-",
                                    amountDefaultPrecision
                                  );

                                  // alert("dec");
                                  if (amt >= 0) {
                                    if (
                                      amountDefaultPrecision != undefined &&
                                      amountDefaultPrecisionValue != undefined
                                    ) {
                                      console.log(
                                        "=-amt=-=--==amt=-=-=-555--amt-ww--",
                                        amt
                                      );

                                      console.log(
                                        "=-amt=amountDefaultPrecisionValue+====-",
                                        amountDefaultPrecisionValue
                                      );

                                      console.log(
                                        "=-amt=-=--==amt=-=-=-555--amt-ww--calculate==parse--",
                                        amt + parseFloat(amountDefaultPrecision)
                                      );

                                      console.log(
                                        "=-amt=-=--==amt=-=-=-555--amt-ww-=++====-",
                                        amt.toFixed(amountDefaultPrecisionValue)
                                      );
                                      amt = (
                                        amt + parseFloat(amountDefaultPrecision)
                                      ).toFixed(amountDefaultPrecisionValue);
                                      console.log("=-amt=-amt=++====-", amt);
                                    } else {
                                      amt = parseFloat(amt) + 1;
                                      console.log("=-amt=--amt-ww--", amt);
                                    }

                                    console.log(
                                      "=-=-=--==amt=-=-=-555--amt-ww--",
                                      amt
                                    );
                                    console.log(
                                      "amountSelected--",
                                      amountSelected
                                    );

                                    if (amountSelected) {
                                      let amount;
                                      console.log("amt========--", amt);
                                      console.log(
                                        "amt.indexOf(.)========--",
                                        amt?.toString().includes(".")
                                      );

                                      if (amt?.toString().includes(".")) {
                                        let temp = amt?.toString().split(".");
                                        console.log(
                                          "amountDecimalValue=-=-=",
                                          amountDecimalValue
                                        );
                                        console.log(
                                          "amountDecimalValue=-=-=",
                                          amountDecimalValue
                                        );
                                        if (
                                          temp[1].length <= amountDecimalValue
                                        ) {
                                          amount = amt;
                                        } else {
                                          return;
                                        }
                                      } else {
                                        amount = amt;
                                        console.log("amt-amt=======-", amt);
                                        console.log("amount--=-=-=--", amount);
                                      }

                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value: amount.toString(),
                                        })
                                      );
                                      var total =
                                        parseFloat(amount) * currentPrice;
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "totalAmount",
                                          value: (amount <= 0 ||
                                            amount.length == 0
                                            ? " "
                                            : total
                                          ).toString(),
                                        })
                                      );
                                    } else {
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "totalAmount",
                                          value: amt.toString(),
                                        })
                                      );
                                      let amount =
                                        (1 * amt) / (1 * currentPrice);

                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "tradeAmount",
                                          value: amount
                                            .toFixed(amountDecimalValue)
                                            .toString(),
                                        })
                                      );
                                    }
                                  }

                                  console.log("amt=-=-=-555eee-===-", amt);
                                } else {
                                  let amt;
                                  console.log("amt!=-=-=-", amt);
                                  console.log(
                                    "amt!=-amountDefaultPrecision=-=-",
                                    amountDefaultPrecision
                                  );

                                  if (amountDefaultPrecision != undefined) {
                                    // amt = amountDefaultPrecision;
                                    if (parseFloat(amt) > 0) {
                                      amt =
                                        amt + Number(amountDefaultPrecision);
                                      console.log("amamt=====++=-=-", amt);
                                    } else {
                                      amt = Number(amountDefaultPrecision);
                                    }
                                  } else {
                                    console.log("amt > 0n=-=-", amt > 0);
                                    console.log("amt > 0n=-=value-", amt);

                                    if (amt > 0) {
                                      amt = parseFloat(amt) + 1;
                                      console.log("amamt=-=-", amt);
                                    } else {
                                      amt = 1;
                                      console.log("amamt=else-=-", amt);
                                    }
                                  }
                                  dispatch(
                                    tradeValuesUpdate({
                                      prop: "tradeAmount",
                                      value: amt.toString(),
                                    })
                                  );
                                  // updateTotalAmountOnIncDec(amt.toString());
                                }
                              }}
                              textInputStyle={{
                                color: ThemeManager.colors.headerText,
                                flex: 1,
                                textAlign: "center",
                              }}
                            />
                          </View>
                        ) : null}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            // backgroundColor: 'red',
                            // height: 15,
                            marginTop: 10,
                          }}
                        >
                          <TouchableOpacity
                            style={{ width: "23%" }}
                            onPress={() => {
                              // setSelectedPercentage(1);

                              if (btnTwoSelected) {
                                setBtnOneSelected(true);
                                setBtnTwoSelected(false);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("25%");
                                percentageSelection(25);
                              } else if (!btnTwoSelected && !btnOneSelected) {
                                setBtnOneSelected(true);
                                setBtnTwoSelected(false);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("25%");
                                percentageSelection(25);
                              } else {
                                setBtnOneSelected(false);
                                setBtnTwoSelected(false);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("0%");
                              }
                            }}
                          >
                            <View
                              style={{
                                backgroundColor:
                                  btnOneSelected === true
                                    ? buySellBtnSelect
                                      ? ThemeManager.colors.btnGreenColor
                                      : ThemeManager.colors.textRedColor
                                    : ThemeManager.colors.tabBackground,
                                height: 12,
                                borderRadius: 4,
                                justifyContent: "center",
                                alignItems: "center", // width: '23%',
                              }}
                            ></View>
                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: "center",
                                fontFamily: Fonts.regular,
                                color:
                                  selectedButton === "25%" ||
                                    selectedButton === "50%" ||
                                    selectedButton === "75%" ||
                                    selectedButton === "100%"
                                    ? ThemeManager.colors.textColor
                                    : ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              25%
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              // setSelectedPercentage(1);
                              if (btnThreeSelected) {
                                // alert(0);
                                setBtnOneSelected(true);
                                setBtnTwoSelected(true);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("50%");
                                percentageSelection(50);
                              } else if (!btnThreeSelected && !btnTwoSelected) {
                                // alert(1);
                                setBtnOneSelected(true);
                                setBtnTwoSelected(true);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("50%");
                                percentageSelection(50);
                              } else if (!btnFourSelected && btnTwoSelected) {
                                setBtnOneSelected(true);
                                setSelectedButton("25%");
                                percentageSelection(25);

                                setBtnTwoSelected(false);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                              } else {
                                // alert(3);
                                setBtnOneSelected(false);
                                setBtnTwoSelected(false);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("0%");
                              }
                            }}
                            style={{ width: "23%" }}
                          >
                            <View
                              style={{
                                backgroundColor: btnTwoSelected
                                  ? buySellBtnSelect
                                    ? ThemeManager.colors.btnGreenColor
                                    : ThemeManager.colors.textRedColor
                                  : ThemeManager.colors.tabBackground,
                                height: 12,
                                justifyContent: "center",
                                borderRadius: 4,
                                alignItems: "center", // width: '23%',
                                // width: '%',
                              }}
                            ></View>
                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: "center",
                                fontFamily: Fonts.regular,
                                color:
                                  selectedButton === "50%" ||
                                    selectedButton === "75%" ||
                                    selectedButton === "100%"
                                    ? ThemeManager.colors.textColor
                                    : ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              50%
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ width: "23%" }}
                            onPress={() => {
                              if (btnFourSelected) {
                                setBtnOneSelected(true);
                                setBtnTwoSelected(true);
                                setBtnThreeSelected(true);
                                setBtnFourSelected(false);
                                setSelectedButton("75%");
                                percentageSelection(75);
                              } else if (
                                !btnFourSelected &&
                                !btnThreeSelected
                              ) {
                                setBtnOneSelected(true);
                                setBtnTwoSelected(true);
                                setBtnThreeSelected(true);
                                setBtnFourSelected(false);
                                setSelectedButton("75%");
                                percentageSelection(75);
                              } else if (!btnFourSelected && btnThreeSelected) {
                                setBtnOneSelected(true);
                                setBtnTwoSelected(true);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("50%");
                                percentageSelection(50);
                              } else {
                                setBtnOneSelected(false);
                                setBtnTwoSelected(false);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("0%");
                              }
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: btnThreeSelected
                                  ? buySellBtnSelect
                                    ? ThemeManager.colors.btnGreenColor
                                    : ThemeManager.colors.textRedColor
                                  : ThemeManager.colors.tabBackground,
                                height: 12,
                                borderRadius: 4,
                                justifyContent: "center",
                                alignItems: "center", // width: '23%',
                                // width: '23%',
                              }}
                            ></View>
                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: "center",
                                fontFamily: Fonts.regular,
                                color:
                                  selectedButton === "75%" ||
                                    selectedButton === "100%"
                                    ? ThemeManager.colors.textColor
                                    : ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              75%
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ width: "23%" }}
                            onPress={() => {
                              if (btnFourSelected) {
                                setBtnOneSelected(true);
                                setBtnTwoSelected(true);
                                setBtnThreeSelected(true);
                                setBtnFourSelected(false);
                                setSelectedButton("75%");
                                percentageSelection(75);
                              } else {
                                setBtnOneSelected(true);
                                setBtnTwoSelected(true);
                                setBtnThreeSelected(true);
                                setBtnFourSelected(true);
                                setSelectedButton("100%");
                                percentageSelection(99.8);
                              }
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: btnFourSelected
                                  ? buySellBtnSelect
                                    ? ThemeManager.colors.btnGreenColor
                                    : ThemeManager.colors.textRedColor
                                  : ThemeManager.colors.tabBackground,
                                height: 12,
                                justifyContent: "center",
                                borderRadius: 4,
                                alignItems: "center", // width: '23%',
                                // width: '23%',
                              }}
                            ></View>
                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: "center",
                                fontFamily: Fonts.regular,
                                color:
                                  selectedButton === "100%"
                                    ? ThemeManager.colors.textColor
                                    : ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              100%
                            </Text>
                          </TouchableOpacity>
                        </View>
                        {limitSelected ? (
                          <View
                            style={{
                              // height: 50,
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                              borderRadius: 6,
                              // justifyContent: 'center',
                              // alignItems: 'center',
                              marginTop: 10,
                              height: 40,
                            }}
                          >
                            <TextInput
                              value={tradeReducer.totalAmount}
                              keyboardType="decimal-pad"
                              placeholder={
                                strings.trade_tab.total +
                                " (" +
                                selectedCoinPair?.quote_unit.toUpperCase() +
                                ")"
                              }
                              placeholderTextColor={
                                ThemeManager.colors.inactiveTextColor
                              }
                              multiline={
                                Platform.OS === "android" ? true : false
                              }
                              returnKeyType={"done"}
                              style={{
                                // fontSize: 13,
                                // height: 40,
                                // fontFamily: Fonts.regular,
                                // borderRadius: 6,
                                paddingVertical: 5,
                                fontFamily: Fonts.regular,
                                fontSize: 12,
                                // textAlign: "center",
                                // color: ThemeManager.colors.inactiveTextColor,
                                // lineHeight: 10,
                                color: ThemeManager.colors.textColor,
                                flex: 1,
                                textAlign: "center",
                              }}
                              onChangeText={(text) => {
                                if (/^\d*\.?\d*$/.test(text)) {
                                  if (text.includes(".")) {
                                    var e = text.split(".");

                                    if (e[0].length == 0) {
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "totalAmount",
                                          value: "0" + text,
                                        })
                                      );
                                    } else if (e[1].length <= 5) {
                                      updateTotalTrade(text);
                                    }
                                  } else {
                                    updateTotalTrade(text);
                                  }
                                }
                              }}
                              maxLength={15}
                            />
                          </View>
                        ) : null}
                        {stopLimitSelected && limitSelected === false ? (
                          <View
                            style={{
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                              borderRadius: 6,
                              marginTop: 10,
                            }}
                          >
                            <TextInput
                              value={tradeReducer.totalAmount}
                              keyboardType="decimal-pad"
                              placeholder={
                                strings.trade_tab.total +
                                " (" +
                                selectedCoinPair?.quote_unit.toUpperCase() +
                                ")"
                              }
                              placeholderTextColor={
                                ThemeManager.colors.inactiveTextColor
                              }
                              multiline={
                                Platform.OS === "android" ? true : false
                              }
                              returnKeyType={"done"}
                              style={{
                                paddingVertical: 5,
                                fontFamily: Fonts.regular,
                                fontSize: 12,
                                color: ThemeManager.colors.textColor,
                                flex: 1,
                                textAlign: "center",
                              }}
                              // style={{
                              //   fontSize: 13,
                              //   height: 40,
                              //   fontFamily: Fonts.regular,
                              //   borderRadius: 6,
                              //   padding: 0,
                              //   textAlign: "center",
                              //   color: ThemeManager.colors.inactiveTextColor,
                              //   lineHeight: 10,
                              // }}
                              onChangeText={(text) => {
                                if (/^\d*\.?\d*$/.test(text)) {
                                  if (text.includes(".")) {
                                    var e = text.split(".");

                                    if (e[0].length == 0) {
                                      dispatch(
                                        tradeValuesUpdate({
                                          prop: "totalAmount",
                                          value: "0" + text,
                                        })
                                      );
                                    } else if (e[1].length <= 5) {
                                      updateTotalTrade(text);
                                    }
                                  } else {
                                    updateTotalTrade(text);
                                  }
                                }
                              }}
                              maxLength={15}
                            />
                          </View>
                        ) : null}
                        <View
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            // flex: 1,
                            // width: "100%",
                            // marginVertical: 15,
                            marginTop: 20,
                            marginBottom: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontFamily: Fonts.regular,
                              // width: "15%",
                              // backgroundColor: ThemeManager.colors.tabBackground,
                              color: ThemeManager.colors.textColor5,
                            }}
                          >
                            {strings.trade_tab.available}
                          </Text>
                          <View
                            style={{
                              justifyContent: "flex-end",
                              alignItems: "center",
                              flexDirection: "row",
                              width: "82%",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontFamily: Fonts.regular,
                                textAlign: "right",
                                // backgroundColor:
                                //   ThemeManager.colors.tabBackground,
                                color: ThemeManager.colors.textColor,
                              }}
                            >
                              {loginStatus
                                ? Singleton.getInstance().numbersToBillion(
                                  1 *
                                  renderUserTotalBalance(
                                    sellButtonSelected
                                      ? selectedCoinPair?.base_unit
                                      : selectedCoinPair?.quote_unit
                                  )
                                )
                                : "0.00"}
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontFamily: Fonts.regular,

                                  // backgroundColor:
                                  //   ThemeManager.colors.tabBackground,
                                  color: ThemeManager.colors.textColor,
                                }}
                              >
                                {" "}
                                {sellButtonSelected
                                  ? selectedCoinPair?.base_unit?.toUpperCase()
                                  : selectedCoinPair?.quote_unit?.toUpperCase()}
                              </Text>
                            </Text>
                            <TouchableOpacity
                              // disabled={loginStatus ? false : true}
                              onPress={() => {
                                // ActionSheetDepositTransfer.current.show();
                                // setActionDepositModal(true);
                                if (loginStatus) {
                                  setActionDepositModal(true);
                                } else {
                                  Actions.currentScene != "Login" &&
                                    Actions.push("Login");
                                }
                              }}
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                                // borderRadius: 10,
                                height: 20,
                                width: 20,
                                marginLeft: 2,
                                // backgroundColor:
                                //   ThemeManager.colors.tabBottomBorder,
                              }}
                            >
                              <Image
                                // source={{
                                //   uri: ThemeManager.ImageIcons.icon_add,
                                // }}
                                source={Images.addYellow}
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginTop: -3,
                                  resizeMode: "contain",
                                  // tintColor: 'black',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        {loginStatus ? (
                          <>
                            {buySellBtnSelect ? (
                              <ButtonPrimary
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 40,
                                  marginHorizontal: 0,
                                }}
                                title={
                                  strings.trade_tab.buy +
                                  " " +
                                  selectedCoinPair?.base_unit.toUpperCase()
                                }
                                onPress={() => {
                                  checkVerification();
                                }}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  checkVerification();
                                }}
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: buySellBtnSelect
                                    ? ThemeManager.colors.btnGreenColor
                                    : ThemeManager.colors.textRedColor,
                                  height: 40,
                                  borderRadius: 6,
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.regular,
                                    fontSize: 14,
                                    color: "white",
                                  }}
                                >
                                  {buySellBtnSelect
                                    ? strings.trade_tab.buy
                                    : strings.trade_tab.sell}{" "}
                                  {selectedCoinPair?.base_unit.toUpperCase()}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </>
                        ) : (
                          // <TouchableOpacity
                          //   onPress={() => {
                          //     checkVerification();
                          //   }}
                          //   style={{
                          //     justifyContent: "center",
                          //     alignItems: "center",
                          //     backgroundColor: buySellBtnSelect
                          //       ? ThemeManager.colors.btnGreenColor
                          //       : ThemeManager.colors.textRedColor,
                          //     height: 40,
                          //     borderRadius: 6,
                          //   }}
                          // >
                          //   <Text
                          //     style={{
                          //       fontFamily: Fonts.regular,
                          //       fontSize: 16,
                          //       color: "white",
                          //     }}
                          //   >
                          //     {buySellBtnSelect
                          //       ? strings.trade_tab.buy
                          //       : strings.trade_tab.sell}{" "}
                          //     {selectedCoinPair?.base_unit.toUpperCase()}
                          //   </Text>
                          // </TouchableOpacity>
                          <ButtonPrimary
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              height: 40,
                              marginHorizontal: 0,
                            }}
                            title={"Log In"}
                            onPress={() => {
                              Actions.currentScene != "Login" &&
                                Actions.Login({ fromScreen: "Trades" });
                            }}
                          />
                        )}
                      </View>
                      <View></View>
                    </View>
                  </View>
                  <View style={{ flex: 5.0 }}>
                    <View
                      style={{
                        // flex: 1,
                        flexGrow: 1,
                        // backgroundColor: 'black',
                        marginLeft: 2,
                        // height: 400,
                        // height: 400,
                        height: showLargeData
                          ? Platform.OS == "android"
                            ? 420
                            : 380
                          : Platform.OS == "android"
                            ? 420
                            : 380,
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "space-between",
                          // alignItems: 'center',
                          flexDirection: "row",
                          marginLeft: 2,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.regular,
                              fontSize: 14,
                            }}
                          >
                            {strings.trade_tab.price}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.anouncementtextColour,
                            }}
                          >
                            ({selectedCoinPair?.quote_unit.toUpperCase()})
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.regular,
                              fontSize: 14,
                              marginRight: 2,
                            }}
                          >
                            {strings.trade_tab.amount}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.anouncementtextColour,
                              marginRight: 5,
                            }}
                          >
                            ({selectedCoinPair?.base_unit.toUpperCase()})
                          </Text>
                        </View>
                      </View>
                      {showLargeData && (
                        <View
                          style={{
                            alignItems: "center",
                            // backgroundColor: "red",
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textRedColor,
                              fontFamily: Fonts.regular,
                              fontSize: 14,
                            }}
                          >
                            {renderLastPrice(selectedCoinPair?.name) !=
                              undefined
                              ? renderLastPrice(selectedCoinPair?.name).last
                              : " "}
                          </Text>
                          <Text
                            style={{
                              color: ThemeManager.colors.inactiveTextColor,
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                              // marginBottom: 5,
                            }}
                          >
                            ≈ ${renderUsdPriceShow()}
                          </Text>
                        </View>
                      )}
                      {showBuyOrder &&
                        orderHistoryReducer?.marketCoinInfo != null && (
                          <AskBook
                            largeData={showLargeData}
                            pricePrecision={
                              userPricePrecision
                                ? userPricePrecision
                                : selectedCoinPair.priceDecimalValue
                            }
                            actualPrecision={priceDefaultPrecisionValue}
                            lisView={{
                              // paddingTop: 2,
                              // marginTop: showLargeData
                              //   ? Platform.OS == "android"
                              //     ? 0
                              //     : -10
                              //   : 0,
                              marginRight: 3,
                              paddingTop: 2,
                              // flexGrow: 1,
                              // backgroundColor: "red",
                              // height: showLargeData
                              //   ? Platform.OS == "android"
                              //     ? 350
                              //     : 310
                              //   : Platform.OS == "android"
                              //   ? 160
                              //   : 140,
                              // backgroundColor: "yellow",
                            }}
                            selectedCoinPair={selectedCoinPair}
                            marketCoinInfo={orderHistoryReducer?.marketCoinInfo}
                            onPress={(price, amount) => {
                              if (!sellButtonSelected) {
                                pickPriceFromBook(price, amount);
                                setBtnOneSelected(false);
                                setBtnTwoSelected(false);
                                setBtnThreeSelected(false);
                                setBtnFourSelected(false);
                                setSelectedButton("0%");
                              }
                            }}
                          />
                        )}
                      {!showLargeData && (
                        <View style={{ alignItems: "center" }}>
                          <Text
                            style={{
                              color: ThemeManager.colors.textRedColor,
                              fontFamily: Fonts.regular,
                              fontSize: 14,
                            }}
                          >
                            {renderLastPrice(selectedCoinPair?.name) !=
                              undefined
                              ? renderLastPrice(selectedCoinPair?.name).last
                              : " "}
                          </Text>
                          <Text
                            style={{
                              color: ThemeManager.colors.inactiveTextColor,
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                              // marginBottom: 5,
                            }}
                          >
                            ≈ ${renderUsdPriceShow()}
                            {/* {Singleton.getInstance().funComma(
                              renderUsdPrice(
                                selectedCoinPair?.quote_unit
                              ) != undefined &&
                                renderLastPrice(
                                  selectedCoinPair?.name
                                ) != undefined
                                ? (
                                    renderLastPrice(
                                      selectedCoinPair?.name
                                    ).last *
                                    renderUsdPrice(
                                      selectedCoinPair?.quote_unit
                                    )
                                  )?.toFixed(4)
                                : " "
                            )} */}
                          </Text>
                        </View>
                      )}

                      {showSellOrder &&
                        orderHistoryReducer?.marketCoinInfo != null && (
                          <View>
                            <BidsBook
                              largeData={showLargeData}
                              pricePrecision={userPricePrecision}
                              actualPrecision={priceDefaultPrecisionValue}
                              // lisView={{paddingTop: 2}}
                              lisView={{
                                paddingTop: 2,
                                marginRight: 3,
                                // flexGrow: 0,
                                // height: showLargeData
                                //   ? Platform.OS == "android"
                                //     ? 350
                                //     : 300
                                //   : Platform.OS == "android"
                                //   ? 160
                                //   : 140,
                              }}
                              selectedCoinPair={selectedCoinPair}
                              marketCoinInfo={
                                orderHistoryReducer?.marketCoinInfo
                              }
                              onPress={(price, amount) => {
                                if (sellButtonSelected) {
                                  // alert('hello');
                                  pickPriceFromBook(price, amount);
                                  setBtnOneSelected(false);
                                  setBtnTwoSelected(false);
                                  setBtnThreeSelected(false);
                                  setBtnFourSelected(false);
                                  setSelectedButton("0%");
                                }
                              }}
                            />
                          </View>
                        )}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    // flex: 1,
                    width: "52%",
                    alignSelf: "flex-end",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    // backgroundColor: 'red',
                    // marginTop: 100,
                    zIndex: 1000,
                  }}
                >
                  <View
                    style={{
                      width: "68%",
                      marginTop: 10,
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <SelectDropdown
                      data={pricePrecision}
                      dropdownOverlayColor={"transparent"}
                      defaultValueByIndex={selectedLimitedIndex}
                      // defaultValue={'0.1'}
                      onSelect={(selectedItem, index) => {
                        console.log(
                          "setuserPricePrecision=-=-=->>",
                          selectedItem
                        );
                        setSelectedLimitedIndex(index);
                        // setDefaultPrecision(arr.length - 1);
                        setuserPricePrecision(selectedItem.value);
                        setuserPricePrecisionValue(selectedItem.title);
                      }}
                      buttonStyle={styles.dropdown3BtnStyle}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        // alert('hello');

                        return (
                          <View
                            style={[
                              styles.dropdown3BtnChildStyle,
                              {
                                backgroundColor:
                                  ThemeManager.colors.tabBackground,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.dropdown4BtnTxt,
                                { color: ThemeManager.colors.headerText },
                              ]}
                            >
                              {selectedItem
                                ? selectedItem.title
                                : userPricePrecisionValue}
                            </Text>
                            <Image
                              source={{ uri: Images.icon_dropDown }}
                              style={{
                                height: 15,
                                width: 15,
                                resizeMode: "contain",
                                tintColor:
                                  ThemeManager.colors.inactiveTextColor,

                                // tintColor: 'black',
                              }}
                            />
                          </View>
                        );
                      }}
                      dropdownStyle={[
                        styles.dropdown3DropdownStyle,
                        {
                          backgroundColor: ThemeManager.colors.tabBackground,
                          shadowColor: "red",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.8,
                          shadowRadius: 4,
                          elevation: 5,
                          padding: 1,
                          borderRadius: 10,
                        },
                      ]}
                      rowStyle={[
                        styles.dropdown3RowStyle,
                        {
                          backgroundColor: ThemeManager.colors.tabBackground,
                        },
                      ]}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <View
                            style={[
                              styles.dropdown3RowChildStyle,
                              {
                                backgroundColor:
                                  ThemeManager.colors.tabBackground,
                              },
                            ]}
                          >
                            {/* <Image
                                source={item.image}
                                style={styles.dropdownRowImage}
                              /> */}
                            <Text
                              style={[
                                styles.dropdown4RowTxt,
                                {
                                  color:
                                    selectedLimitedIndex === index
                                      ? ThemeManager.colors.Depositbtn
                                      : ThemeManager.colors.headerText,
                                },
                              ]}
                            >
                              {item.title}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      marginTop: 8,
                      height: 30,
                      width: 30,
                      marginLeft: 10,
                      justifyContent: "center",
                      zIndex: 1000,
                      backgroundColor: ThemeManager.colors.tabBackground,
                    }}
                    onPress={() => {
                      // ActionSheetBuySell.current.show();
                      setActionModal(true);
                    }}
                  >
                    {showBuyOrder && showLargeData && (
                      <Image
                        source={{
                          uri: Images.icon_sell_red,
                        }}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          // tintColor:
                          //   ThemeManager.colors.themeColor === 'dark'
                          //     ? ThemeManager.colors.inactiveTextColor
                          //     : null,
                        }}
                      />
                    )}
                    {!showBuyOrder && showLargeData && (
                      <Image
                        source={{
                          uri: Images.icon_buy_green,
                        }}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          // tintColor:
                          //   ThemeManager.colors.themeColor === 'dark'
                          //     ? ThemeManager.colors.inactiveTextColor
                          //     : null,
                        }}
                      />
                    )}
                    {!showLargeData && (
                      <Image
                        source={{
                          uri: ThemeManager.ImageIcons.icon_buy_sell,
                        }}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          // tintColor:
                          //   ThemeManager.colors.themeColor === 'dark'
                          //     ? ThemeManager.colors.inactiveTextColor
                          //     : null,
                        }}
                      />
                    )}
                    {/* <Image
                      source={{
                        uri:
                          selectedOrderListIndex == 2
                            ? Images.icon_buy_green
                            : selectedOrderListIndex == 1
                            ? Images.icon_sell_red
                            : ThemeManager.ImageIcons.icon_buy_sell,
                      }}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: "contain",
                        // tintColor:
                        //   ThemeManager.colors.themeColor === 'dark'
                        //     ? ThemeManager.colors.inactiveTextColor
                        //     : null,
                      }}
                    /> */}
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      marginTop: 10,
                      flex: 1,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      zIndex: 1000,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          // marginHorizontal: 10,
                          marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setOpenOrderPageSelected(false);
                            // pagerRef2.current.setPage(0);
                          }}
                          style={{ marginRight: 10 }}
                        >
                          <TradeHeader
                            title={strings.trade_tab.open_orders}
                            underLine={
                              openOrderPageSelected === false ? true : false
                            }
                            custmTabTxt={{
                              color: ThemeManager.colors.textColor,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            // if (loginStatus) {
                            //   setOpenOrderPageSelected(true);
                            // } else {
                            //   Actions.currentScene != 'Login' &&
                            //     Actions.push('Login');
                            // }
                            if (loginStatus) {
                              setOpenOrderPageSelected(true);
                            } else {
                              // Actions.currentScene != 'Login' &&
                              //   Actions.push('Login');
                              Actions.currentScene != "Login" &&
                                Actions.Login({ fromScreen: "Trades" });
                            }
                            // alert('2');

                            // pagerRef2.current.setPage(1);
                          }}
                        >
                          <TradeHeader
                            title={strings.trade_tab.funds}
                            underLine={
                              openOrderPageSelected === true ? true : false
                            }
                            custmTabTxt={{
                              color: ThemeManager.colors.textColor,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // if (loginStatus) {
                        //   checkUserVerification();
                        // } else {
                        //   Actions.currentScene != 'Login' &&
                        //     Actions.push('Login');
                        // }
                        if (loginStatus) {
                          checkUserVerification();
                        } else {
                          // Actions.currentScene != 'Login' &&
                          //   Actions.push('Login');
                          Actions.currentScene != "Login" &&
                            Actions.Login({ fromScreen: "Trades" });
                        }
                      }}
                    >
                      <Image
                        source={{ uri: ThemeManager.ImageIcons.icon_note }}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          tintColor: ThemeManager.colors.inactiveTextColor,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <BorderLine />
                  {openOrderPageSelected === false ? (
                    <TradeOpenOrderLimited
                      noOpenOrderTextStyle={{
                        color: ThemeManager.colors.textColor,
                      }}
                      moreTextColor={{ color: ThemeManager.colors.textColor }}
                      imageStyle={{ tintColor: ThemeManager.colors.textColor }}
                      kycStatus={kycStatus}
                    />
                  ) : (
                    <View style={{ paddingBottom: 200 }}>
                      {fundsArray.map((item) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: 10,
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "flex-start",
                                alignItems: "center",
                                flexDirection: "row",
                              }}
                            >
                              <Image
                                style={{
                                  height: 20,
                                  width: 20,
                                  borderRadius: 10,
                                  resizeMode: "contain",
                                  // tintColor:
                                  //   ThemeManager.colors.inactiveTextColor,
                                }}
                                source={{ uri: item.currency_icon }}
                              />
                              <View style={{ alignItems: "flex-start" }}>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: ThemeManager.colors.textColor,
                                    fontFamily: Fonts.regular,
                                    marginLeft: 10,
                                  }}
                                >
                                  {item.currency.toUpperCase()}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color:
                                      ThemeManager.colors.anouncementtextColour,
                                    fontFamily: Fonts.regular,
                                    marginLeft: 10,
                                  }}
                                >
                                  {item.currency_name}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: ThemeManager.colors.textColor,
                                  fontFamily: Fonts.regular,
                                }}
                              >
                                {item.balance}
                              </Text>
                              <View style={{ alignItems: "flex-end" }}>
                                {/* <Text
                                style={{
                                  fontSize: 13,
                                  color: ThemeManager.colors.inactiveTextColor,
                                  fontFamily: Fonts.regular,
                                }}>
                                USD Price
                              </Text> */}
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        {tradeReducer?.isLoading && (
          <Loader isLoading={tradeReducer?.isLoading} />
        )}
        {orderHistoryReducer?.openOrderHistoryLoading && (
          <Loader isLoading={orderHistoryReducer?.openOrderHistoryLoading} />
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleMarket}
          onRequestClose={() => {
            setModalVisibleMarket(false);
          }}
        >
          <Wrap
            style={styles.containerColor}
            screenStyle={[
              styles.screenStyle,
              styles.containerColor,
              // { marginRight: 100 },
            ]}
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            bottomStyle={styles.containerColor}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  // marginTop: 40,
                  // width: "90%",
                  flex: 1,
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: ThemeManager.colors.bgDarkwhite,
                }}
              >
                <Text
                  style={{
                    color: ThemeManager.colors.textColor1,
                    fontSize: 20,
                    fontFamily: Fonts.medium,
                    marginTop: 20,
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  Markets
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPage(0);
                    setModalVisibleMarket(false);
                  }}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    height: 40,
                    width: 40,
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  <Image
                    source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
                {/* <HeaderComponent
              headerViewStyle={styles.containerColor}
              searchViewStyle={styles.searchView}
              onPressRightFilter={() => {}}
              onSearchPress={() => {
                Actions.currentScene != "SearchCoinPair" &&
                  Actions.push("SearchCoinPair");
              }}
            /> */}
                <ScrollView
                  bounces={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  nestedScrollEnabled={true}
                  style={[styles.scrollStyle]}
                >
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(true);
                        setSelectedPage(0);
                      }}
                      style={styles.horizontalMargin}
                    >
                      <Text style={styles.favText}>
                        {strings.markets_tab.Favorites}
                      </Text>

                      {selectedTab && (
                        <LinearGradient
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 0 }}
                          colors={["#64B77C", "#347899", "#1F5BA7"]}
                          style={styles.gradientStyle}
                        />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(false);
                        setSelectedPage(0);
                      }}
                      style={{
                        marginHorizontal: 20,
                      }}
                    >
                      <Text style={styles.favText}>
                        {strings.markets_tab.Spot}
                      </Text>
                      {selectedTab == false && (
                        <LinearGradient
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 0 }}
                          colors={["#64B77C", "#347899", "#1F5BA7"]}
                          style={styles.gradientStyle}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.subContainer}>
                    <View style={{ marginTop: 5 }}></View>
                    {selectedTab ? (
                      <FavMarket
                        coinToUsdData={coinToUsdData}
                        tabLabel="BNB"
                        favClicked={() => {
                          Singleton.getInstance()
                            .getData(constants.IS_LOGIN)
                            .then((isLogin) => {
                              console.log("check isLogin=-=-3=-=>>>", isLogin);
                              console.log(
                                "check isLogin=-Actions.currentScene>>",
                                Actions.currentScene
                              );
                              if (isLogin == "true") {
                                setSelectedTab(false);
                              } else {
                                Actions.currentScene != "Login" &&
                                  Actions.Login({ fromScreen: "_Trades" });
                                setModalVisibleMarket(false);
                              }
                            });
                        }}
                        value={marketData}
                        favShow={true}
                        selectedMarketItem={(item) => {
                          let pairValue = item.base_unit + item.quote_unit;
                          //                       const [selectedSellIndex, setSelectedSellIndex] = useState(0);
                          // const [selectedBuyIndex, setSelectedBuyIndex] = useState(0);
                          console.log("pairValue=-=-=-=>>>", pairValue);
                          setSelectedSellIndex(0);
                          setSelectedBuyIndex(0);
                          updateSocket(pairValue);
                          dispatch(updateMarketPair(pairValue));
                          dispatch(
                            buySellSocket({
                              pair: item?.base_unit + item?.quote_unit,
                            })
                          );

                          getUserBalance(selectedCoinPair?.quote_unit);
                          dispatch(
                            tradeValuesUpdate({
                              prop: "selectedCoinPair",
                              value: item,
                            })
                          );

                          let params = {
                            page: `1`,
                            limit: "5",
                          };
                          Singleton.getInstance()
                            .getData(constants.IS_LOGIN)
                            .then((isLogin) => {
                              console.log("check isLogin=-=-8=-=>>>", isLogin);
                              if (isLogin == "true") {
                                setLoginStatus(true);
                                if (kycStatus) {
                                  dispatch(
                                    getOpenOrdersSingle(
                                      params,
                                      `&market=${selectedCoinPair?.base_unit +
                                      selectedCoinPair?.quote_unit
                                      }&state=wait`,
                                      false
                                    )
                                  );
                                }
                              } else {
                                setLoginStatus(false);
                              }
                            })
                            .catch((err) => { });

                          dispatch(
                            tradeValuesUpdate({
                              prop: "totalAmount",
                              value: "",
                            })
                          );
                          dispatch(
                            tradeValuesUpdate({
                              prop: "tradeAmount",
                              value: "",
                            })
                          );
                          setLimitSelected(true);
                          // setSelectedLimitedIndex(null);
                          setSelectedLimitedIndex(pricePrecision.length - 2);
                          setBuySellBtnSelect(true);
                          setSellButtonSelected(false);
                          setStopLimitSelected(false);
                          resetData(0);
                          setModalVisibleMarket(false);
                        }}
                      />
                    ) : (
                      <ScrollableTabView
                        tabBarPosition={"overlayTop"}
                        // style={[styles.scrollBar]}
                        style={{ height: screenHeight - 300 }}
                        // selectedPosition
                        initialPage={selectedPage}
                        // ref={o => (this.activeTab = o)}
                        ref={ref}
                        tabBarUnderlineStyle={[
                          styles.tabStyle,
                          {
                            backgroundColor:
                              ThemeManager.colors.tabActiveBackgroundColor,
                          },
                        ]}
                        tabBarBackgroundColor="transparent"
                        tabBarInactiveTextColor={
                          ThemeManager.colors.inactiveTextColor
                        }
                        tabBarActiveTextColor={ThemeManager.colors.textColor}
                        tabBarTextStyle={styles.tabTextStyle}
                        onChangeTab={(i, index) => {
                          setSelectedPage(i.i);
                        }}
                        showCustomHeader={true}
                      >
                        {pairArray.map((item, key) => {
                          return (
                            <BchPage
                              coinToUsdData={coinToUsdData}
                              tabLabel={item?.toUpperCase()}
                              value={marketData}
                              selectedMarketItem={(item) => {
                                console.log("item=-=----->>>", item);
                                let pairValue =
                                  item.base_unit + item.quote_unit;
                                console.log("pairValue=-=-=-=>>>", pairValue);
                                updateSocket(pairValue);
                                setSelectedSellIndex(0);
                                setSelectedBuyIndex(0);
                                dispatch(updateMarketPair(pairValue));
                                dispatch(
                                  buySellSocket({
                                    pair: item?.base_unit + item?.quote_unit,
                                  })
                                );

                                getUserBalance(selectedCoinPair?.quote_unit);
                                dispatch(
                                  tradeValuesUpdate({
                                    prop: "selectedCoinPair",
                                    value: item,
                                  })
                                );

                                let params = {
                                  page: `1`,
                                  limit: "5",
                                };
                                Singleton.getInstance()
                                  .getData(constants.IS_LOGIN)
                                  .then((isLogin) => {
                                    console.log(
                                      "check isLogin=-=-8=-=>>>",
                                      isLogin
                                    );
                                    if (isLogin == "true") {
                                      setLoginStatus(true);
                                      if (kycStatus) {
                                        dispatch(
                                          getOpenOrdersSingle(
                                            params,
                                            `&market=${selectedCoinPair?.base_unit +
                                            selectedCoinPair?.quote_unit
                                            }&state=wait`,
                                            false
                                          )
                                        );
                                      }
                                    } else {
                                      setLoginStatus(false);
                                    }
                                  })
                                  .catch((err) => { });

                                dispatch(
                                  tradeValuesUpdate({
                                    prop: "totalAmount",
                                    value: "",
                                  })
                                );
                                dispatch(
                                  tradeValuesUpdate({
                                    prop: "tradeAmount",
                                    value: "",
                                  })
                                );
                                setLimitSelected(true);
                                // setSelectedLimitedIndex(null);
                                setSelectedLimitedIndex(
                                  pricePrecision.length - 2
                                );
                                setBuySellBtnSelect(true);
                                setSellButtonSelected(false);
                                setStopLimitSelected(false);
                                resetData(0);
                                setModalVisibleMarket(false);
                                // dispatch(
                                //   tradeValuesUpdate({
                                //     prop: "selectedCoinPair",
                                //     value: item,
                                //   })
                                // );
                                // global.fromMarket = true;
                                // Actions.currentScene != "BuySellMarket" &&
                                //   Actions.BuySellMarket({ item: item });
                              }}
                            />
                          );
                        })}
                      </ScrollableTabView>
                    )}
                  </View>
                </ScrollView>
              </View>
              {/* <View
              style={{ backgroundColor: "rgba(0,0,0,0.5)", width: "10%" }}
            ></View> */}
            </View>
          </Wrap>
        </Modal>

        {/* <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleMarket}
          onRequestClose={() => {
            setModalVisibleMarket(false);
          }}
        >
          <Wrap
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
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
                // width: "90%",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 20,
                  fontFamily: Fonts.medium,
                  marginTop: 20,
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                Coin Pair Change
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleMarket(false);
                }}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  height: 40,
                  width: 40,
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
              <FlatList
                keyboardShouldPersistTaps={"handled"}
                data={marketSocketReducer?.marketData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        let arr = [];
                        let pairValue = item.base_unit + item.quote_unit;
                        updateSocket(pairValue);
                        dispatch(updateMarketPair(pairValue));
                        dispatch(
                          buySellSocket({
                            pair: item?.base_unit + item?.quote_unit,
                          })
                        );

                        getUserBalance(
                          selectedCoinPair?.quote_unit
                        );
                        dispatch(
                          tradeValuesUpdate({
                            prop: "selectedCoinPair",
                            value: item,
                          })
                        );
                       
                        let params = {
                          page: `1`,
                          limit: "5",
                        };
                        Singleton.getInstance()
                          .getData(constants.IS_LOGIN)
                          .then((isLogin) => {
                            console.log("check isLogin=-=-8=-=>>>", isLogin);
                            if (isLogin == "true") {
                              setLoginStatus(true);
                              dispatch(
                                getOpenOrdersSingle(
                                  params,
                                  `&market=${
                                    selectedCoinPair?.base_unit +
                                    selectedCoinPair?.quote_unit
                                  }&state=wait`,
                                  false
                                )
                              );
                            } else {
                              setLoginStatus(false);
                            }
                          })
                          .catch((err) => {});
   
                        dispatch(
                          tradeValuesUpdate({
                            prop: "totalAmount",
                            value: "",
                          })
                        );
                        dispatch(
                          tradeValuesUpdate({
                            prop: "tradeAmount",
                            value: "",
                          })
                        );
                        setLimitSelected(true);
                        setSelectedLimitedIndex(null);
                        

                        setBuySellBtnSelect(true);
                        setSellButtonSelected(false);
                        setStopLimitSelected(false);

                      
                        resetData(0);
                       

                        setModalVisibleMarket(false);
                      }}
                      style={{
                        height: 50,
                        marginTop: 5,
                        backgroundColor: ThemeManager.colors.tabBackground,
                        // alignItems: 'center',
                        justifyContent: "center",
                        marginHorizontal: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.textColor1,
                          marginLeft: 10,
                        }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                // ListFooterComponent={() => {
                //   return <View style={{marginBottom: 20}} />;
                // }}
              />
            </View>
          </Wrap>
        </Modal> */}

        <Modal
          animationType="fade"
          transparent={true}
          visible={showCancelVisible}
          onRequestClose={() => setShowCancelVisible(false)}
        >
          <Wrap
            // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
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
                      // setShowCancelVisible(false);
                      // dispatch(cancelAllOrderWithoutParams())
                      //   .then(res => {
                      //     // updateOrderList();
                      //     setPageNumber(1);
                      //     dispatch(resetOpenOrderHistory());
                      //   })
                      //   .catch(err => alert(constants.APP_NAME, err));
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
                      // dispatch(resetOpenOrderHistory());
                      // setShowSingleCancelVisible(false);
                      // dispatch(cancelOrder(cancelOrderItem))
                      //   .then(res => {
                      //     // dispatch(getUserAllBalance());
                      //     // updateOrderList();
                      //     setPageNumber(1);
                      //     paramOpenOrder = {
                      //       page: `${pageNumber}`,
                      //       limit: pageLimit,
                      //     };
                      //     dispatch(
                      //       getOpenOrders(paramOpenOrder, '&state=wait', true),
                      //     );
                      //   })
                      //   .catch(err => Alert.alert(constants.APP_NAME, err));
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
          animationType="fade"
          transparent={true}
          visible={actionModal}
          onRequestClose={() => setActionModal(false)}
        >
          <Wrap
            // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
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
                  setActionModal(false);
                }}
              ></TouchableOpacity>
              <View
                style={{
                  backgroundColor: ThemeManager.colors.whiteScreen,
                  // marginHorizontal: 15,
                  // borderRadius: 8,
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                    // backgroundColor: ThemeManager.colors.whiteScreen,
                  }}
                  onPress={() => {
                    setSelectedOrderListIndex(0);
                    setShowBuyOrder(true);
                    setShowSellOrder(true);
                    setShowLargeData(false);
                    setActionModal(false);
                  }}
                // style={{ backgroundColor: "red" }}
                >
                  <Text
                    style={{
                      color:
                        selectedOrderListIndex == 0
                          ? ThemeManager.colors.Depositbtn
                          : ThemeManager.colors.headerText,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {strings.buy_sell_market.default}
                  </Text>
                </TouchableOpacity>
                <BorderLine
                  style={{
                    opacity: 0.3,
                    backgroundColor: ThemeManager.colors.inactiveTextColor,
                  }}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                    // backgroundColor: ThemeManager.colors.whiteScreen,
                  }}
                  onPress={() => {
                    setSelectedOrderListIndex(1);
                    setShowBuyOrder(true);
                    setShowSellOrder(false);
                    setShowLargeData(true);
                    setActionModal(false);
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedOrderListIndex == 1
                          ? ThemeManager.colors.Depositbtn
                          : ThemeManager.colors.headerText,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {strings.buy_sell_market.sell_order}
                  </Text>
                </TouchableOpacity>
                <BorderLine
                  style={{
                    opacity: 0.5,
                    backgroundColor: ThemeManager.colors.inactiveTextColor,
                  }}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                    // backgroundColor: ThemeManager.colors.whiteScreen,
                  }}
                  onPress={() => {
                    setSelectedOrderListIndex(2);
                    setShowBuyOrder(false);
                    setShowSellOrder(true);
                    setShowLargeData(true);
                    setActionModal(false);
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedOrderListIndex == 2
                          ? ThemeManager.colors.Depositbtn
                          : ThemeManager.colors.headerText,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {strings.buy_sell_market.buy_order}
                  </Text>
                </TouchableOpacity>
                <BorderLine
                  style={{
                    height: 5,
                    backgroundColor: ThemeManager.colors.inactiveTextColor,
                    opacity: 0.3,
                  }}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                    // backgroundColor: ThemeManager.colors.whiteScreen,
                  }}
                  onPress={() => {
                    // setSelectedOrderListIndex(2);
                    // setShowBuyOrder(false);
                    // setShowSellOrder(true);
                    // setShowLargeData(true);
                    setActionModal(false);
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedOrderListIndex == 3
                          ? ThemeManager.colors.Depositbtn
                          : ThemeManager.colors.headerText,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {strings.buy_sell_market.cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Wrap>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={actionDepositModal}
          onRequestClose={() => setActionDepositModal(false)}
        >
          <Wrap
            // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            screenStyle={[
              styles.screenStyle,
              {
                backgroundColor: "transparent",
              },
            ]}
            bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setActionDepositModal(false);
                }}
              ></TouchableOpacity>
              <View
                style={{
                  backgroundColor: ThemeManager.colors.whiteScreen,
                  borderColor: ThemeManager.colors.tabBackground,
                  borderWidth: 1,
                  // marginHorizontal: 15,
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    height: 70,
                    marginHorizontal: 20,
                    // backgroundColor: ThemeManager.colors.whiteScreen,
                  }}
                  onPress={() => {
                    const item = getClickedItem(
                      depositListReducer?.depositCoinListInfo
                    );

                    setActionDepositModal(false);
                  }}
                // style={{ backgroundColor: "red" }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_deposit }}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />
                    <View>
                      <View
                        style={{
                          marginLeft: 15,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          // backgroundColor: "red",
                          // width: "80%",
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              selectedOrderListIndex == 0
                                ? ThemeManager.colors.Depositbtn
                                : ThemeManager.colors.headerText,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                          }}
                        >
                          {strings.buy_sell_market.deposit_crypto}
                        </Text>

                        <Image
                          source={{
                            uri: ThemeManager.ImageIcons.icon_forward_arrow,
                          }}
                          style={{
                            height: 12,
                            width: 12,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: ThemeManager.colors.headerText,
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          marginLeft: 15,
                        }}
                      >
                        {"Send crypto to your EVO EUROPE account"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <BorderLine
                  style={{
                    height: 1.5,
                    backgroundColor: ThemeManager.colors.inactiveTextColor,
                    opacity: 0.3,
                    marginHorizontal: 20,
                  }}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                    // backgroundColor: ThemeManager.colors.whiteScreen,
                  }}
                  onPress={() => {
                    // setSelectedOrderListIndex(2);
                    // setShowBuyOrder(false);
                    // setShowSellOrder(true);
                    // setShowLargeData(true);
                    setActionDepositModal(false);
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedOrderListIndex == 3
                          ? ThemeManager.colors.Depositbtn
                          : ThemeManager.colors.headerText,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {strings.buy_sell_market.cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Wrap>
        </Modal>
        {/* <Modal
        animationType="slide"
        transparent={true}
        visible={showChangePairModal}
        onRequestClose={() => {
          setShowChangePairModal(false);
        }}>
        <View
          style={[
            styles.modalBg,
            {backgroundColor: ThemeManager.colors.dashboardDarkBg},
          ]}>
          <TouchableOpacity
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: 'absolute',
              flex: 1,
            }}
            onPress={res => {
              setShowChangePairModal(false);
            }}
          />

          <View
            style={[
              styles.modalCard,
              {
                marginHorizontal: 0,
                marginBottom: 0,
                minHeight: '25%',
                backgroundColor: ThemeManager.colors.dashboardDarkBg,
              },
            ]}>
            <View style={{padding: 20}}>
              {Platform.OS == 'ios' && <View style={{height: 30}} />}

              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'center',
                  fontFamily: Fonts.PoppinsMedium,
                  color: ThemeManager.colors.textColor,
                }}>
                {'Select Pair'}
              </Text>
              <FlatList
                data={this.props.marketData}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({tempLoader: true}, () => {
                          this.setPairModalVisible(false);
                        });

                        this.props.stopPreviousConnection().then(res => {
                          this.props.tradeSocketClose().then(res => {
                            setTimeout(() => {
                              let pairValue = item.base_unit + item.quote_unit;
                              console.log('COIN_PAIR===>', pairValue);

                              this.tradeFeesFun(pairValue);
                              this.updateSocket(pairValue);
                              this.props.tradeValuesUpdate({
                                prop: 'selectedCoinPair',
                                value: item,
                              });
                              this.getUserBalance(
                                this.props.selectedCoinPair.quote_unit,
                              );

                              this.setState({tempLoader: false});

                              Singleton.getInstance()
                                .getData(constants.SAVED_COOKIES)
                                .then(res => {
                                  this.props.callTradeSocket({
                                    pair: pairValue,
                                    auth: res?.split('; ')[0],
                                  });
                                });
                            }, 1500);
                          });
                        });
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: 40,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            textAlign: 'center',
                            fontFamily: Fonts.PoppinsSemiBold,
                            color: ThemeManager.colors.textColor,
                          }}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
     */}
        <TradingRules
          textColor={{ color: ThemeManager.colors.textColor }}
          closePress={() => {
            setShowRules(!isShowRules);
          }}
          isRuleShow={isShowRules}
          tradeRule={tradeReducer?.tradeFees}
          tradingFees={tradeReducer?.tradeRule}
          showStopLimitRule={
            stopLimitSelected == true && limitSelected == false ? true : false
          }
        />
      </Wrap>
    </>
  );
};

// Trades.navigationOptions = ({navigation}) => {
//   return {
//     header: null,
//     tabBarLabel: ' ',
//     tabBarIcon: ({focused}) => (
//       <TabIcon
//         focused={focused}
//         title={strings.bottom_tab.Trades}
//         ImgSize={{width: 19.8, height: 20}}
//         activeImg={{uri: Images.Trades_Active}}
//         defaultImg={{uri: Images.Trades_InActive}}
//       />
//     ),
//     tabBarOptions: {
//       style: {
//         backgroundColor: ThemeManager.colors.tabBackground,
//         // bottom: 5,
//       },
//     },
//   };
// };
export default Trades;
