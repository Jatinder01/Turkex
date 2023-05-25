/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Alert,
  AppState,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import styles from "./WalletsStyle";
import { Wrap, Loader } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import TradeHeader from "../../common/TradeHeader";
import { strings } from "../../../../Localization";
import { Fonts, Images } from "../../../theme";
import BorderLine from "../../common/BorderLine";
import { Actions } from "react-native-router-flux";
import Singleton from "../../../Singleton";
import { CustomEmptyView, TabIcon } from "../../common";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  // fundsUser,
  getProfile1,
  resetFunds,
  fundsUserWallet,
  resetWalletFunds,
} from "../../../Redux/Actions";
import * as constants from "../../../Constants";
import { EventRegister } from "react-native-event-listeners";
import LinearGradient from "react-native-linear-gradient";
const { height } = Dimensions.get("window");
let coinToDollar;
let dArray = [];
const Wallets = (props) => {
  // const { fundsUserDetails, coinToUsdData } = useSelector(
  //   (state) => state.FundsReducer
  // );
  const dispatch = useDispatch();
  const [spotPageSelected, setSpotPageSelected] = useState(1);
  const [userData, setuserData] = useState(null);
  const [coinData, setcoinData] = useState(null);
  const [totalFait, settotalFait] = useState("0.00");
  const [data, setData] = useState([]);
  const [listToShow, setlistToShow] = useState([]);
  const [listToShowSearch, setlistToShowSearch] = useState([]);

  const [hideZeroBalance, sethideZeroBalance] = useState(false);
  const [searchDataSearch, setSearchDataSearch] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isDocumentVerified, setisDocumentVerified] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [listLoading, setIsListLoading] = useState(true);
  const getUserFunds = () => {
    console.log("check start-=-=-=-=-");

    dArray = [];
    coinToDollar = 0;
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        if (isLogin == "true") {
          setLoginStatus(true);
          dispatch(fundsUserWallet(true)).then((res) => {
            // console.log("check fundsUser=-=fundsUser--=-=-=res>>>", res);

            // console.log(
            //   "check fundsUser=-=coinToUsdData-=-=res>>>",
            //   coinToUsdData
            // );
            // dispatch(getProfile1());
            // fundsUserDetails &&
            // let addBalance;
            // res?.map((item, index) => {
            // let addBalance;
            // let price = coinToUsdData[item.id.toUpperCase()];
            // item.usdPrice = price ? price.USD : 1;
            // if (item.balance.currency_usdt != null) {
            //   addBalance =
            //     parseFloat(item.balance.balance) +
            //     parseFloat(item.balance.locked);
            //   coinToDollar =
            //     parseFloat(coinToDollar) +
            //     addBalance * parseFloat(item.balance.currency_usdt);
            // } else {
            //   addBalance =
            //     parseFloat(item.balance.balance) +
            //     parseFloat(item.balance.locked);
            //   coinToDollar = parseFloat(coinToDollar) + addBalance * 1;
            // }
            // dArray.push(item);
            let addBalance = 0;
            coinToDollar = 0;
            res?.map((item, index) => {
              // coinToDollar +=
              //   parseFloat(item.balance.balance) * item.usdPrice;
              if (item?.balance?.currency_usdt != null) {
                let price = parseFloat(item?.balance?.currency_usdt);
                item.usdPrice = price ? price : 1;
                addBalance =
                  parseFloat(item?.balance?.balance) +
                  parseFloat(item?.balance?.locked);

                if (typeof coinToDollar == "number") {
                  coinToDollar =
                    coinToDollar +
                    addBalance * parseFloat(item?.balance?.currency_usdt);
                } else {
                  coinToDollar =
                    parseFloat(coinToDollar) +
                    addBalance * parseFloat(item?.balance?.currency_usdt);
                }
              } else {
                item.usdPrice = 1;
                addBalance =
                  parseFloat(item?.balance?.balance) +
                  parseFloat(item?.balance?.locked);

                if (typeof coinToDollar == "number") {
                  coinToDollar = coinToDollar + addBalance * 1;
                } else {
                  coinToDollar = parseFloat(coinToDollar) + addBalance * 1;
                }
              }
              dArray.push(item);
            });
            settotalFait(
              // coinToDollar.toFixed(constants.CRYPTO_DECIMAL_ROUNDOFF)
              toFixedWithoutZeros(
                coinToDollar,
                constants.CRYPTO_DECIMAL_ROUNDOFF
              )
            );
            checkHideZeroStatus(dArray);
            setData(dArray);
            // console.log("dArray=-=-=-=-=-=-=>>", dArray);
            setRefreshing(false);
            setIsListLoading(false);
          });
        } else {
          setLoginStatus(false);
          setIsListLoading(false);
          setRefreshing(false);
          // Actions.currentScene != 'Login' && Actions.push('Login');
        }
      })
      .catch((err) => { });
    // console.log("total balance=-=-=-=>>>", coinToDollar);
  };
  useEffect(() => {
    dArray = [];
    coinToDollar = 0;
    // updateState();
    settotalFait("0.00");
    setIsListLoading(true);
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        // console.log("check isLogin=-=-=-=12>>>", isLogin);
        if (isLogin == "true") {
          setLoginStatus(true);
          // console.log("check=-=-=-22222");
          dispatch(fundsUserWallet(true))
            .then((res) => {
              // console.log("dArray=-=-=-=>>>res-=00-", res);
              let addBalance = 0;
              // dArray.push(res);
              // alert("hey");
              coinToDollar = 0;
              res?.map((item, index) => {
                // let price = coinToUsdData[item.id.toUpperCase()];
                // item.usdPrice = price ? price.USD : 1;
                // coinToDollar +=
                //   parseFloat(item.balance.balance) * item.usdPrice;
                if (item?.balance?.currency_usdt != null) {
                  let price = parseFloat(item?.balance?.currency_usdt);
                  item.usdPrice = price;

                  addBalance =
                    parseFloat(item?.balance?.balance) +
                    parseFloat(item?.balance?.locked);

                  if (typeof coinToDollar == "number") {
                    coinToDollar =
                      coinToDollar +
                      addBalance * parseFloat(item?.balance?.currency_usdt);
                  } else {
                    coinToDollar =
                      parseFloat(coinToDollar) +
                      addBalance * parseFloat(item?.balance?.currency_usdt);
                  }
                } else {
                  item.usdPrice = 1;

                  addBalance =
                    parseFloat(item?.balance?.balance) +
                    parseFloat(item?.balance?.locked);

                  if (typeof coinToDollar == "number") {
                    coinToDollar = coinToDollar + addBalance * 1;
                  } else {
                    coinToDollar = parseFloat(coinToDollar) + addBalance * 1;
                  }
                }
                dArray.push(item);
              });
              settotalFait(
                toFixedWithoutZeros(
                  coinToDollar,
                  constants.CRYPTO_DECIMAL_ROUNDOFF
                )
              );
              checkHideZeroStatus(dArray);
              setData(dArray);

              setRefreshing(false);
              setIsListLoading(false);
            })
            .catch((err) => {
              console.log("dArray-=-=-err", err);
              setIsListLoading(false);
            });
          // dispatch(getProfile1());
        } else {
          setLoginStatus(false);
          setRefreshing(false);
          setIsListLoading(false);
          // Actions.currentScene != 'Login' && Actions.push('Login');
        }
      })
      .catch((err) => { });
    props.navigation.addListener("didFocus", () => {
      settotalFait("0.00");
      coinToDollar = 0;
      dArray = [];
      setIsListLoading(true);
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          if (isLogin == "true") {
            setLoginStatus(true);

            dispatch(fundsUserWallet(true))
              .then((res) => {
                // dArray.push(res);
                let addBalance = 0;

                coinToDollar = 0;
                res?.map((item, index) => {
                  // let price = coinToUsdData[item.id.toUpperCase()];
                  // item.usdPrice = price ? price.USD : 1;
                  // coinToDollar +=
                  //   parseFloat(item.balance.balance) * item.usdPrice;

                  if (item?.balance?.currency_usdt != null) {
                    let price = parseFloat(item?.balance?.currency_usdt);
                    item.usdPrice = price;
                    addBalance =
                      parseFloat(item?.balance?.balance) +
                      parseFloat(item?.balance?.locked);

                    if (typeof coinToDollar == "number") {
                      coinToDollar =
                        coinToDollar +
                        addBalance * parseFloat(item?.balance?.currency_usdt);
                    } else {
                      coinToDollar =
                        parseFloat(coinToDollar) +
                        addBalance * parseFloat(item?.balance?.currency_usdt);
                    }
                  } else {
                    item.usdPrice = 1;
                    addBalance =
                      parseFloat(item.balance.balance) +
                      parseFloat(item.balance.locked);

                    if (typeof coinToDollar == "number") {
                      coinToDollar = coinToDollar + addBalance * 1;
                    } else {
                      coinToDollar = parseFloat(coinToDollar) + addBalance * 1;
                    }
                  }
                  dArray.push(item);
                });
                settotalFait(
                  toFixedWithoutZeros(
                    coinToDollar,
                    constants.CRYPTO_DECIMAL_ROUNDOFF
                  )
                );
                checkHideZeroStatus(dArray);
                setData(dArray);
                setIsListLoading(false);
              })
              .catch((err) => {
                // console.log("dArray-=-=-err", err);
                setIsListLoading(false);
              });
          } else {
            setLoginStatus(false);
            setIsListLoading(false);
            // Actions.currentScene != 'Login' && Actions.push('Login');
          }
        })
        .catch((err) => { });
      // console.log("total balance=-=-=-=>>>333", coinToDollar);
      // dispatch(getProfile1());
    });

    try {
      userData.labels.filter((item) => {
        if (item.value == "verified" && item.key == "document") {
          setisDocumentVerified(true);
        }
      });
    } catch (err) { }
    return () => {
      // dispatch(resetFunds());
      // EventRegister.removeEventListener(this.listener);
    };
  }, []);

  useEffect(() => {
    setShowSearch(false);
    setSearchText("");
    props.navigation.addListener("didFocus", () => {
      setShowSearch(false);
      setSearchText("");
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          // console.log("check isLogin=-=-=-14=>>>", isLogin);
          if (isLogin == "true") {
            setLoginStatus(true);
            dispatch(getProfile1());
          } else {
            setLoginStatus(false);
            // Actions.currentScene != 'Login' && Actions.push('Login');
          }
        })
        .catch((err) => { });
    });

    return () => {
      dispatch(resetFunds());
      dispatch(resetWalletFunds());
      // EventRegister.removeEventListener(this.listener);
    };
  }, []);

  const saveHideZeroStatus = (status) => {
    sethideZeroBalance(status);
    Singleton.getInstance().SaveHideZeroBalance(status);
    checkHideZeroStatus(data);
  };

  const onSearch = (value) => {
    if (value === false) {
      setlistToShowSearch(searchDataSearch);
    } else {
      setlistToShowSearch(
        searchData.filter(
          (i) =>
            i.name.toLowerCase().includes(value.toLowerCase()) ||
            i.id.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const checkHideZeroStatus = (arrData) => {
    var arrDataToShow = [];
    if (Singleton.getInstance().hideZeroBalance) {
      setlistToShow([]);
      setSearchData([]);
      arrData.filter((value) => {
        var price = parseFloat(value.balance.balance).toFixed(
          constants.CRYPTO_DECIMAL_ROUNDOFF
        );
        if (price > 0) {
          arrDataToShow.push(value);
        } else {
        }
        setlistToShow([]);
        setlistToShow(arrDataToShow);
        // console.log("arrDataToShow=-=-=-=>>>", arrDataToShow);
        setSearchData(arrDataToShow);
      });
    } else {
      setlistToShow([]);
      setSearchData([]);
      setlistToShow(arrData);
      setSearchData(arrData);
      // }
    }
  };
  const updateState = () => {
    dispatch(getProfile1());
    checkUserVerification();
  };
  const checkUserVerification = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        setuserData(JSON.parse(res));
        if (JSON.parse(res).otp === false) {
          // Alert.alert(constants.APP_NAME_CAPS, "Please enable 2FA.");
          Singleton.getInstance().showError("Please enable 2FA.");
        } else {
          try {
            let confirmations = JSON.parse(res)?.labels.find(
              (item) => item?.value === "verified" && item?.key === "tier_1"
            );
            if (confirmations === undefined) {
              // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
              Singleton.getInstance().showError("KYC is not verified.");
            } else if (confirmations?.value === "verified") {
              Actions.currentScene != "WithdrawSearch" &&
                Actions.WithdrawSearch();
            } else {
              // alert('hello');
              // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
              Singleton.getInstance().showError("KYC is not verified.");
            }
          } catch (err) { }
        }
      })
      .catch((err) => { });
  };
  const onSearchList = () => {
    setlistToShowSearch(searchData);
    setSearchDataSearch(searchData);
  };
  const getName = (name) => {
    const textName = name?.charAt(0);

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
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getUserFunds();
    // alert("hello");
  }, [refreshing]);
  const toFixedWithoutZeros = (num, precision) =>
    `${Number.parseFloat(num.toFixed(precision))}`;
  const renderListItem = ({ item, index }) => {
    // console.log("renderListItem--item-->>", item);
    // let coinToDollar = (
    //   parseFloat(item?.balance?.balance) * item?.usdPrice
    // )?.toFixed(constants.CRYPTO_DECIMAL_ROUNDOFF);
    // console.log("renderListItem--item-->>", item);
    coinToDollar = 0;
    let addBalance;
    if (item?.balance?.currency_usdt != null) {
      addBalance =
        parseFloat(item?.balance?.balance) + parseFloat(item?.balance?.locked);
      // console.log("renderListItem--addBalance-->>", addBalance);
      // console.log("renderListItem--addBalance-typeof->>", typeof addBalance);
      let val = toFixedWithoutZeros(
        addBalance * item?.balance?.currency_usdt,
        5
      );
      // coinToDollar = parseFloat(
      //   addBalance * item.balance.currency_usdt
      // ).toFixed(4);
      coinToDollar = val;
      // console.log("renderListItem--coinToDollar-->>", coinToDollar);
    } else {
      addBalance =
        parseFloat(item?.balance?.balance) + parseFloat(item?.balance?.locked);
      // console.log("renderListItem--addBalance--else>>", addBalance);
      // console.log(
      //   "renderListItem--addBalance-else--typeof->>",
      //   typeof addBalance
      // );
      // coinToDollar = parseFloat(addBalance * 1).toFixed(4);
      let val = toFixedWithoutZeros(addBalance * 1, 5);
      // coinToDollar = parseFloat(
      //   addBalance * item.balance.currency_usdt
      // ).toFixed(4);
      coinToDollar = val;
      // console.log("renderListItem--coinToDollar-else->>", coinToDollar);
    }
    return (
      <>
        <TouchableOpacity
          disabled={
            item?.type !== "fiat" && item?.networks?.length > 0 ? false : true
          }
          key={index}
          onPress={() => {
            Actions.currentScene != "CurrencyDetails" &&
              Actions.push("CurrencyDetails", { coin: item });
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 8,
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {item?.icon_url ? (
              <Image
                source={{ uri: item.icon_url }}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: ThemeManager.colors.Depositbtn,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {getName(item?.name)}
              </View>
            )}
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                }}
              >
                {item?.id.toUpperCase()}
              </Text>
              <Text
                style={{
                  color: ThemeManager.colors.inactiveTextColor,
                  fontSize: 12,
                  fontFamily: Fonts.regular,
                }}
              >
                {item?.name}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontSize: 16,
                fontFamily: Fonts.regular,
              }}
            >
              {parseFloat(
                parseFloat(item.balance.balance) +
                parseFloat(item.balance.locked)
              )}
            </Text>
            <Text
              style={{
                color: ThemeManager.colors.inactiveTextColor,
                fontSize: 12,
                fontFamily: Fonts.regular,
              }}
            >
              {/* {coinToDollar} USDT */}
              {Singleton.getInstance().funComma(coinToDollar.toString())} USDT
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.DashboardBG },
      ]}
      // darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
    >
      <Loader isLoading={listLoading} />
      {/* <KeyboardAwareScrollView
        // bounces={true}
        keyboardShouldPersistTaps="handled"
        // nestedScrollEnabled={true}
        // style={{flex: 1}}
        contentContainerStyle={{ flex: 1 }}
      > */}
      <View style={{ flex: 1, marginTop: 20 }}>
        <View
          style={{
            alignItems: "flex-start",
            marginLeft: 15,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSpotPageSelected(1);
            }}
            style={{ marginLeft: 10 }}
          >
            <TradeHeader title={strings.trade_tab.spot} underLine={true} />
          </TouchableOpacity>
          {/* <TouchableOpacity
              onPress={() => {
                // setSpotPageSelected(0);
                // setShowConvertModal(true);
                Actions.currentScene != "CardInitial" &&
                  Actions.push("CardInitial");
                // alert('hello');
                setSpotPageSelected(1);
                // pagerRef.current.setPage(1);
              }}
              style={{ marginLeft: 30 }}
            >
              <TradeHeader
                title={"Cards"}
                underLine={spotPageSelected === 0 ? true : false}
              />
            </TouchableOpacity> */}
          {/* <TouchableOpacity
              onPress={() => {
                // setSpotPageSelected(0);
                // setShowConvertModal(true);
                Actions.currentScene != 'ChooseCrypto' &&
                  Actions.push('ChooseCrypto');
                // alert('hello');
                setSpotPageSelected(1);
                // pagerRef.current.setPage(1);
              }}
              style={{marginLeft: 30}}>
              <TradeHeader
                title={'Fiat'}
                underLine={spotPageSelected === 0 ? true : false}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // setSpotPageSelected(0);
                // setShowConvertModal(true);
                Actions.currentScene != 'BuyCryptoBanxa' &&
                  Actions.push('BuyCryptoBanxa');
                // alert('hello');
                setSpotPageSelected(1);
                // pagerRef.current.setPage(1);
              }}
              style={{marginLeft: 30}}>
              <TradeHeader
                title={'Buy/Sell Crypto'}
                underLine={spotPageSelected === 0 ? true : false}
              />
            </TouchableOpacity> */}
        </View>
        <BorderLine style={{ opacity: 0.4 }} />

        <View
          style={{
            // flex: 1,
            // flexGrow: 1,
            // marginHorizontal: 15,
            // backgroundColor: ThemeManager.colors.SwapInput,
            paddingHorizontal: 10,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <FlatList
            // bounces={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onRefresh={() => onRefresh()}
            refreshing={refreshing}
            keyboardShouldPersistTaps={"handled"}
            data={showSearch ? listToShowSearch : listToShow}
            extraData={showSearch ? listToShowSearch : listToShow}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              flexGrow: 1,

              // borderTopLeftRadius: 30,
              // borderTopRightRadius: 30,
            }}
            // style={{ height: height }}
            renderItem={renderListItem}
            ListEmptyComponent={
              <View>
                {!listLoading && (
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
                          height: 50,
                          width: 50,
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
                      No records found.
                    </Text>
                  </View>
                )}
              </View>
            }
            ListFooterComponent={
              <View style={{ height: 20, marginBottom: 20 }} />
            }
            ListHeaderComponent={
              <View>
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.SwapInput,
                    // marginHorizontal: 10,
                    marginTop: 15,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      marginTop: 20,
                      // backgroundColor: 'red',
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}
                      >
                        {strings.spot.available} {strings.spot.balance}
                      </Text>
                      {/* <Image
            source={{uri: ThemeManager.ImageIcons.icon_eye}}
            style={{
              height: 15,
              width: 15,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
          /> */}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // Actions.push('HistoryWallet');
                        Actions.currentScene != "HistoryWallet" &&
                          Actions.push("HistoryWallet");
                      }}
                    >
                      <Image
                        source={{
                          uri: ThemeManager.ImageIcons.icon_note_time,
                        }}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          marginRight: 15,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginLeft: 15,
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}
                    >
                      {Singleton.getInstance().funComma(totalFait)}
                      {" USDT"}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginLeft: 15,
                      marginVertical: 15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // Actions.push('DepositWallet');
                        // Actions.push('DepositSearch');
                        Actions.currentScene != "DepositSearch" &&
                          Actions.push("DepositSearch");
                      }}
                    >
                      <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        colors={["#64B77C", "#347899", "#1F5BA7"]}
                        // style={{
                        //   justifyContent: 'center',
                        //   alignItems: 'center',
                        // }}
                        style={{
                          height: 40,
                          width: 140,
                          backgroundColor: ThemeManager.colors.walletDPbtn,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 14,
                            fontFamily: Fonts.regular,
                          }}
                        >
                          {strings.spot.deposit}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        // updateState();
                        Actions.currentScene != "WithdrawSearch" &&
                          Actions.WithdrawSearch();
                      }}
                      style={{
                        height: 40,
                        width: 140,
                        // backgroundColor: ThemeManager.colors.Purewhite,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                        marginLeft: 10,
                        borderWidth: 1.2,
                        borderColor: ThemeManager.colors.withdrawText,
                      }}
                    >
                      <Text
                        style={{
                          color: ThemeManager.colors.withdrawText,
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                        }}
                      >
                        {strings.spot.withdraw}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 5,

                    marginHorizontal: 15,
                    height: 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        saveHideZeroStatus(!hideZeroBalance);
                        setShowSearch(false);
                        setSearchText("");
                        // checkStatus();
                      }}
                    >
                      <Image
                        source={{ uri: ThemeManager.ImageIcons.icon_select }}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          tintColor: hideZeroBalance
                            ? ThemeManager.colors.selectedTextColor
                            : null,
                        }}
                      />
                      <Text
                        style={{
                          color: ThemeManager.colors.inactiveTextColor,
                          fontFamily: Fonts.regular,
                          fontSize: 14,
                          marginHorizontal: 5,
                        }}
                      >
                        {strings.spot.hide}
                        <Text style={{ marginHorizontal: 5 }}> {0}</Text>
                        <Text style={{ marginLeft: 5 }}>
                          {" "}
                          {strings.spot.balances}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {showSearch ? (
                    <View
                      style={[
                        styles.searchView,
                        {
                          backgroundColor: ThemeManager.colors.tabBackground,
                        },
                      ]}
                    >
                      <TextInput
                        value={searchText}
                        onChangeText={(e) => {
                          onSearch(e);
                          setSearchText(e);
                        }}
                        style={{
                          width: "70%",
                          height: 40,
                          color: ThemeManager.colors.textColor1,
                          fontSize: 12,
                          alignSelf: "center",
                        }}
                        placeholder={strings.currencyDetails.search}
                        placeholderTextColor={
                          ThemeManager.colors.inactiveTextColor
                        }
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setShowSearch(false);
                          // saveHideZeroStatus(false);
                          onSearch(false);
                          setSearchText("");
                        }}
                      >
                        <Image
                          source={{ uri: Images.icon_close }}
                          style={styles.searchIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        onSearchList();
                        setShowSearch(true);
                      }}
                    >
                      <Image
                        source={{ uri: ThemeManager.ImageIcons.icon_search_text }
                        }
                        style={{
                          height: 15,
                          width: 15,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            }
          />
        </View>
      </View>
      {/* </KeyboardAwareScrollView> */}
    </Wrap>
  );
};
// Wallets.navigationOptions = ({navigation}) => {
//   return {
//     header: null,
//     tabBarLabel: ' ',
//     tabBarIcon: ({focused}) => (
//       <TabIcon
//         focused={focused}
//         title={strings.bottom_tab.Wallets}
//         ImgSize={{width: 22, height: 20}}
//         activeImg={{uri: Images.Wallets_Active}}
//         defaultImg={{uri: Images.Wallets_InActive}}
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
export default Wallets;
