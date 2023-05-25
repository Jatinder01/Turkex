/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Linking,
  Alert,
  Modal,
} from "react-native";
import styles from "./HistoryWalletStyle";
import { Wrap } from "../../common/Wrap";
import { HeaderComponent } from "../../common/HeaderComponent";
import { ThemeManager } from "../../../../ThemeManager";
// import {Tab, Tabs} from 'native-base';
import {
  getWithdrawDepositHistory,
  resetOrderHistory,
  getDepositCryptoHistory,
  orderHistoryUpdate,
  checkWithdrawList,
  getWithdrawHistoryList,
  resetGetWithdrawHistoryList,
} from "../../../Redux/Actions";

import { Actions } from "react-native-router-flux";
import WalletHeader from "../../common/WalletHeader";
import { strings } from "../../../../Localization";
import TradeHeader from "../../common/TradeHeader";
import BorderLine from "../../common/BorderLine";
import { Fonts, Images } from "../../../theme";
import PagerView from "react-native-pager-view";
import Moment from "moment";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { ButtonPrimary, CustomEmptyView, Loader } from "../../common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import fonts from "../../../theme/fonts";
const depData = {
  collected: "collected",
  collecting: "collected",
  canceled: "cancelled",
  submitted: "submitted",
  accepted: "collected",
  skipped: "collected",
  fee_processing: "collected",
  fee_processed: "collected",
  fee_collecting: "collected",
  fee_collected: "collected",
  rejected: "rejected",
  prepared: "pending",
  processing: "collected",
  succeed: "succeed",
  failed: "failed",
  errored: "collected",
  confirming: "confirming",
};
const withdrawDataState = {
  collecting: "collected",
  prepared: "pending",
  submitted: "submitted",
  canceled: "cancelled",
  accepted: "accepted",
  skipped: "processing",
  rejected: "rejected",
  processing: "processing",
  succeed: "succeed",
  failed: "failed",
  errored: "failed",
  confirming: "confirming",
};
const screenWidth = Dimensions.get("window").width;
const listing = [
  { name: "BNB/ BUSD", value: "+2.32%", price: "481.0" },
  { name: "BTC/BUSD", value: "+1.84%", price: "43,748.00" },
  { name: "ETH/BUSD", value: "+2.14%", price: "3,351.32" },
  { name: "ETH/BUSD", value: "+2.14%", price: "3,351.32" },
  { name: "ETH/BUSD", value: "+2.14%", price: "3,351.32" },
  { name: "ETH/BUSD", value: "+2.14%", price: "3,351.32" },
];
const currencyList = [
  { name: "BNB", coinId: 0 },
  { name: "BTC", coinId: 1 },
  { name: "ALTS", coinId: 2 },
  { name: "USDT", coinId: 3 },
  { name: "BUSD", coinId: 4 },
  { name: "FIAT", coinId: 5 },
];

const pairArray = ["BTC", "ALTS", "USDT", "BUSD", "FIAT"];
const listItems = ["Favorites", "spot"];

const tabData = [
  {
    tabName: strings.spot.deposit,
    selected: true,
  },
  {
    tabName: strings.spot.withdrawal,
    selected: false,
  },
  // {
  //   tabName: strings.spot.buy,
  //   selected: false,
  // },
  // {
  //   tabName: strings.spot.sell,
  //   selected: false,
  // },
];
const HistoryWallet = (props) => {
  const ref = useRef(null);
  const tabRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumberWithdraw, setPageNumberWithdraw] = useState(1);
  const [pageNumberDeposit, setPageNumberDeposit] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleWithdraw, setIsModalVisibleWithdraw] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);
  const [showExplorerWithdraw, setShowExplorerWithdraw] = useState(false);

  const [haveDepositExplorer, setHaveDepositExplorer] = useState(false);
  const [haveWithdrawExplorer, setHaveWithdrawExplorer] = useState(false);

  const [pageLimit, setPageLimit] = useState(15);
  const [selectedTab, setSelectedTab] = useState(true);
  const [cryptoSelect, setCryptoSelect] = useState(true);

  const [depositData, setDepositData] = useState(null);
  const [withdrawData, setWithdrawData] = useState(null);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [blockchainKey, setBlockchainKey] = useState("");
  const [createTime, setCreateTime] = useState("");
  const [completeTime, setCompleteTime] = useState("");
  const [currency, setCurrency] = useState("");
  const [fee, setFee] = useState("");
  const [stateStatus, setStateStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [rid, setRid] = useState("");
  const [withdrawType, setWithdrawType] = useState("");
  const [depositPath, setDepositPath] = useState("");
  const [withdrawPath, setWithdrawPath] = useState("");
  const [transactionTypeStatus, setTransactionTypeStatus] = useState(null);
  const [transactionTypeDepositStatus, setTransactionTypeDepositStatus] =
    useState(null);
  const [showExplorerBtn, setShowExplorerBtn] = useState(false);
  const dispatch = useDispatch();
  // const orderHistoryReducer = useSelector(
  //   (state) => state?.orderHistoryReducer
  // );

  const {
    depositWithdrawHistory,
    totalRecordsDepositHistory,
    orderHistory,
    orderHistoryLoading,
  } = useSelector((state) => state?.orderHistoryReducer);
  // const withDetails = useSelector((state) => state?.withDetails);
  const {
    withdrawHistoryList,
    withdrawListHistoryIsLoading,
    totalRecordsWithdrawalHistory,
  } = useSelector((state) => state?.withDetails);

  // console.log("orderHistoryReducer-=-=-=-=->>>", orderHistoryReducer);
  // console.log("depositWithdrawHistory-=-=-=-=->>>", depositWithdrawHistory);

  const onScrollEnd = (e) => {
    let pageNumber = Math.min(
      Math.max(
        Math.floor(e.nativeEvent.contentOffset.x / screenWidth + 0.5) + 1,
        0
      ),
      listItems.length
    );
  };

  useEffect(() => {
    dispatch(getWithdrawHistoryList(pageNumberWithdraw, pageLimit));
    getDepositWithdrawData();
    getSelectedTab();
    return () => {
      dispatch(resetGetWithdrawHistoryList());
      dispatch(resetOrderHistory());
      global.fromNotification = true;
    };
  }, []);
  const getSelectedTab = () => {
    if (global.fromNotification || global.fromNotification == undefined) {
      setTabIndex(0);
      tabRef.current.setPage(0);
    } else {
      setTabIndex(1);
      tabRef.current.setPage(1);
    }
    global.fromNotification = true;
  };
  const isCloseToBottom = () => {
    let page = pageNumberWithdraw + 1;
    if (withdrawHistoryList?.length < totalRecordsWithdrawalHistory) {
      setPageNumberWithdraw(page);
      dispatch(getWithdrawHistoryList(page, pageLimit));
    }
  };
  const isCloseToBottomDeposit = () => {
    let page = pageNumberDeposit + 1;
    // console.log(
    //   "depositWithdrawHistory.length-=-=",
    //   depositWithdrawHistory.length
    // );
    // console.log(
    //   "depositWithdrawHistory.totalRecordsDepositHistory-=-=",
    //   totalRecordsDepositHistory
    // );

    if (depositWithdrawHistory?.length < totalRecordsDepositHistory) {
      // console.log("depositWithdrawHistory.totalRecordsDepositHistory-=-=");
      setPageNumberDeposit(page);
      let params = {
        page: page,
        limit: pageLimit,
        currency: `${"eth"}`,
      };
      // dispatch(getWithdrawDepositHistory(params));
      dispatch(getDepositCryptoHistory(params))
        .then((res) => {
          // console.log(
          //   "depositWithdrawHistory.res-=-=",
          //   JSON.parse(res.bodyString)
          // );
          // console.log("depositWithdrawHistory.res-=-=", res);
        })
        .catch((err) => {
          console.log("depositWithdrawHistory.err-=-=", err);
        });
    }
  };
  const getDepositWithdrawData = () => {
    var pageNumber = 1;
    dispatch(orderHistoryUpdate({ prop: "depositWithdrawHistory", value: [] }));
    let param = {
      page: "1",
      limit: "10",
    };

    try {
      Singleton.getInstance()
        .getData(constants.USER_DATA)
        .then((res) => {
          let userData = JSON.parse(res);
          dispatch(getDepositCryptoHistory(param))
            .then((res) => {
              // console.log(
              //   "depositWithdrawHistory.res-=-333=",
              //   JSON.parse(res.bodyString)
              // );
              // console.log("depositWithdrawHistory.res-=33-=", res);
            })
            .catch((err) => {
              console.log("depositWithdrawHistory.err-=33-=", err);
            });
        })
        .catch((err) => { });
    } catch (err) {
      dispatch(getDepositCryptoHistory(param))
        .then((res) => {
          // console.log(
          //   "depositWithdrawHistory.res-=44-=",
          //   JSON.parse(res.bodyString)
          // );
          // console.log("depositWithdrawHistory.res-=44-=", res);
        })
        .catch((err) => {
          console.log("depositWithdrawHistory.err-444=-=", err);
        });
    }
  };
  const onViewButtonPress = () => {
    if (haveDepositExplorer) {
      Linking.openURL(depositPath);
      setShowExplorer(false);
    } else {
      Singleton.getInstance().showError("Don't have any explorer link");
    }
  };
  const onWithdrawButtonPress = () => {
    // console.log("withdrawPath=-=-=->>>", withdrawPath);
    if (haveWithdrawExplorer) {
      Linking.openURL(withdrawPath);
      setShowExplorerWithdraw(false);
    } else {
      setShowExplorerWithdraw(false);
      Singleton.getInstance().showWarn("Transaction hash is null");
    }
  };
  const TabView = ({ title, value, textColor }) => {
    return (
      <>
        <Text
          style={{
            fontSize: 14,
            fontFamily: Fonts.regular,
            color: ThemeManager.colors.inactiveTextColor,
            marginTop: 10,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.regular,
            color: textColor ? textColor : ThemeManager.colors.textColor1,
            textTransform: "uppercase",
          }}
        >
          {value}
        </Text>
      </>
    );
  };
  return (
    <Wrap
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      style={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
      screenStyle={[
        styles.screenStyle,
        {
          backgroundColor: ThemeManager.colors.bgDarkwhite,
        },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
    >
      <WalletHeader
        onBackPress={() => Actions.pop()}
        titleText={strings.spot.history}
        noRightIcons={true}
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: ThemeManager.colors.bgDarkwhite,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            marginTop: 15,
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "flex-start",

            alignItems: "center",
          }}
        >
          {tabData.map((tab, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (index === 0) {
                    setTabIndex(index);
                    tabRef.current.setPage(0);
                  } else if (index === 1) {
                    setTabIndex(index);
                    tabRef.current.setPage(1);
                  }
                  // else if (index === 2) {
                  //   setTabIndex(index);
                  //   tabRef.current.setPage(2);
                  // } else {
                  //   setTabIndex(index);
                  //   tabRef.current.setPage(3);
                  // }
                  // setSpotPageSelected(0);
                  // setShowConvertModal(true);
                  //   Actions.push('ConvertTrade');
                  //   setSpotPageSelected(1);
                  // pagerRef.current.setPage(1);
                }}
                style={{ marginRight: 20 }}
              >
                <TradeHeader
                  title={tab.tabName}
                  underLine={tabIndex == index ? true : false}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <BorderLine />
        <PagerView
          ref={tabRef}
          style={{ flex: 1 }}
          initialPage={tabIndex}
          onPageScroll={(event) => { }}
          onPageSelected={(event) => {
            if (event.nativeEvent.position === 0) {
              setTabIndex(0);
            } else if (event.nativeEvent.position === 1) {
              setTabIndex(1);
            }
          }}
        >
          <View
            key="1"
            style={{
              backgroundColor: ThemeManager.colors.bgDarkwhite,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                // marginTop: 5,
              }}
            >
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 15,
                }}
              >
                {/* <TouchableOpacity
                  onPress={() => {
                    setCryptoSelect(true);
                    //   ActionSheetOrders.current.show();
                  }}
                  style={{
                    // height: 30,
                    backgroundColor: cryptoSelect
                      ? ThemeManager.colors.btnColor2
                      : null,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: cryptoSelect
                        ? ThemeManager.colors.textColor1
                        : ThemeManager.colors.inactiveTextColor,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                    }}>
                    {strings.spot.crypto}
                  </Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  onPress={() => {
                    setCryptoSelect(false);
                    //   ActionSheetOrders.current.show();
                  }}
                  style={{
                    // height: 30,
                    marginLeft: 5,
                    backgroundColor: cryptoSelect
                      ? null
                      : ThemeManager.colors.btnColor2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: cryptoSelect
                        ? ThemeManager.colors.inactiveTextColor
                        : ThemeManager.colors.textColor,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                    }}>
                    {strings.spot.cash}
                  </Text>
                </TouchableOpacity> */}
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  //   setShowCancelVisible(true);
                }}>
                <Image
                  source={Images.icon_filter}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity> */}
            </View>
            <View>
              {/* <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                  marginVertical: 15,
                }}>
                <Image
                  source={{uri: ThemeManager.ImageIcons.icon_info}}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.deposit_not_arrived}
                  <Text
                    onPress={() => {}}
                    style={{color: ThemeManager.colors.selectedTextColor}}>
                    {' '}
                    {strings.spot.check_solutions}
                  </Text>
                </Text>
              </View> */}
              {depositWithdrawHistory?.length > 0 ? (
                <FlatList
                  keyboardShouldPersistTaps={"handled"}
                  nestedScrollEnabled={true}
                  data={depositWithdrawHistory}
                  // data={withDetails?.withdrawHistoryList}
                  style={{ flexGrow: 1 }}
                  bounces={false}
                  onEndReachedThreshold={0.4}
                  onEndReached={() => {
                    isCloseToBottomDeposit();
                  }}
                  extraData={depositWithdrawHistory}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          console.log("item+=-deposit=-=->>>>", item);
                          if (item?.blockchain_key == "gooney-gateway") {
                            setAddress(item.address);
                            setAmount(item.amount);
                            setBlockchainKey(item.blockchain_key);
                            setCompleteTime(item.completed_at);
                            setCreateTime(item.created_at);
                            setCurrency(item.currency);
                            setFee(item.fee);
                            setStateStatus(item.state);
                            setTransactionId(item.txid);
                            setIsModalVisible(true);
                          } else if (
                            item?.explorer_transaction != null &&
                            item?.blockchain_key != "gooney-gateway"
                          ) {
                            const path = item.explorer_transaction.replace(
                              "#{txid}",
                              ""
                            );
                            setAddress(item?.address);
                            setAmount(item?.amount);
                            setBlockchainKey(item?.blockchain_key);
                            setCompleteTime(item?.completed_at);
                            setCreateTime(item?.created_at);
                            setCurrency(item?.currency);
                            setFee(item?.fee);
                            setStateStatus(item?.state);
                            setTransactionId(item?.txid);
                            setReferenceId(item?.tid);
                            setHaveDepositExplorer(true);
                            setShowExplorer(true);
                            const mainPath = path + item.txid;
                            setDepositPath(mainPath);
                            if (item?.transaction_type == "internal") {
                              setShowExplorerBtn(false);
                            } else {
                              setShowExplorerBtn(true);
                            }
                            //
                            // Linking.openURL(mainPath);
                          } else {
                            setAddress(item?.address);
                            setAmount(item?.amount);
                            setBlockchainKey(item?.blockchain_key);
                            setCompleteTime(item?.completed_at);
                            setCreateTime(item?.created_at);
                            setCurrency(item?.currency);
                            setFee(item?.fee);
                            setStateStatus(item?.state);
                            setTransactionId(item?.txid);
                            setReferenceId(item?.tid);
                            setHaveDepositExplorer(false);
                            setShowExplorer(true);
                            setTransactionTypeDepositStatus(false);

                            // Singleton.getInstance().showError(
                            //   "Don't have any explorer link"
                            // );
                          }
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginHorizontal: 15,
                            marginVertical: 8,
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.textColor1,
                              }}
                            >
                              {item.currency.toUpperCase()}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              {strings.spot.network}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              {Moment(item.created_at).format(
                                "YYYY-MM-DD hh:mm:ss a"
                              )}
                            </Text>
                          </View>

                          <View
                            style={{
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.textColor1,
                              }}
                            >
                              {item.amount}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.textColor1,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.blockchain_key.replace("-testnet", "")}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <View
                                style={{
                                  height: 4,
                                  width: 4,
                                  borderRadius: 2,
                                  backgroundColor:
                                    depData &&
                                      depData[item.state] == "collected"
                                      ? ThemeManager.colors.textGreenColor
                                      : ThemeManager.colors.textRedColor,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontFamily: Fonts.regular,
                                  marginLeft: 5,
                                  color: ThemeManager.colors.inactiveTextColor,
                                  textTransform: "capitalize",
                                }}
                              >
                                {depData && depData[item.state]}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  ListFooterComponent={() => {
                    return (
                      <>
                        {/* {orderHistory.length > 0 ? (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              height: 100,
                              // flex: 1,
                            }}
                          >
                            <Text
                              style={{
                                marginVertical: 30,
                                fontSize: 14,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.inactiveTextColor,
                              }}
                            >
                              {strings.spot.no_more_data}
                            </Text>
                          </View>
                        ) : ( */}
                        <View style={{ height: 50 }} />
                        {/* )} */}
                      </>
                    );
                  }}
                />
              ) : (
                <>
                  {orderHistoryLoading ? null : (
                    <View>
                      <View
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: 20,
                        }}
                      ></View>
                      <View>
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
                              height: 80,
                              width: 80,
                              resizeMode: "contain",
                             
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
                            {strings.spot.no_deposit_history}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </>
              )}

              {/* <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flex: 1,
                }}>
                <Text
                  style={{
                    marginTop: 50,
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.no_more_data}
                </Text>
              </View> */}
            </View>
          </View>
          <View
            key="2"
            style={{
              backgroundColor: ThemeManager.colors.bgDarkwhite,
            }}
          >
            <>
              {withdrawHistoryList?.length < 0 && (
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      marginLeft: 15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setCryptoSelect(true);
                        //   ActionSheetOrders.current.show();
                      }}
                      style={{
                        // height: 30,
                        // backgroundColor: cryptoSelect
                        //   ? ThemeManager.colors.btnColor2
                        //   : null,

                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                        backgroundColor: ThemeManager.colors.tabBackground,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          color: cryptoSelect
                            ? ThemeManager.colors.textColor1
                            : ThemeManager.colors.inactiveTextColor,
                          paddingHorizontal: 14,
                          paddingVertical: 4,
                        }}
                      >
                        {strings.spot.crypto}
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                  onPress={() => {
                    setCryptoSelect(false);
                    //   ActionSheetOrders.current.show();
                  }}
                  style={{
                    // height: 30,
                    marginLeft: 5,
                    backgroundColor: cryptoSelect
                      ? null
                      : ThemeManager.colors.btnColor2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: cryptoSelect
                        ? ThemeManager.colors.inactiveTextColor
                        : ThemeManager.colors.textColor,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                    }}>
                    {strings.spot.cash}
                  </Text>
                </TouchableOpacity> */}
                  </View>

                  {/* <TouchableOpacity
                onPress={() => {
                  //   setShowCancelVisible(true);
                }}>
                <Image
                  source={Images.icon_filter}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity> */}
                </View>
              )}
            </>
            {withdrawHistoryList?.length > 0 ? (
              <FlatList
                keyboardShouldPersistTaps={"handled"}
                nestedScrollEnabled={true}
                data={withdrawHistoryList}
                extraData={withdrawHistoryList}
                onEndReached={() => {
                  isCloseToBottom();
                }}
                bounces={false}
                onEndReachedThreshold={0.4}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        console.log("item+=-=-=->>>>", item);
                        if (item.blockchain_key == "gooney-gateway") {
                          setAmount(item.amount);
                          setBlockchainKey(item.blockchain_key);
                          setCompleteTime(item.done_at);
                          setCreateTime(item.created_at);
                          setCurrency(item.currency);
                          setFee(item.fee);
                          setStateStatus(item.state);
                          setTransactionId(item.blockchain_txid);
                          setRid(item.rid);
                          setIsModalVisibleWithdraw(true);
                        } else {
                          if (item?.blockchain_txid != null) {
                            const path = item.explorer_transaction.replace(
                              "#{txid}",
                              ""
                            );
                            console.log("item+=-=-=path->>>>", path);
                            setWithdrawData(item);
                            setAmount(item.amount);
                            setBlockchainKey(item.blockchain_key);
                            setCompleteTime(item.done_at);
                            setCreateTime(item.created_at);
                            setCurrency(item.currency);
                            setFee(item.fee);
                            setStateStatus(item.state);
                            setTransactionId(item.blockchain_txid);
                            setRid(item.rid);
                            // setIsModalVisibleWithdraw(true);
                            // const mainPath = path + item.blockchain_txid;
                            // Linking.openURL(mainPath);
                            setHaveWithdrawExplorer(true);
                            setShowExplorerWithdraw(true);
                            const mainPath = path + item.blockchain_txid;
                            console.log("mainPath=-=-=-=->>>>");
                            if (item?.transaction_type == "internal") {
                              setShowExplorerBtn(false);
                            } else {
                              setShowExplorerBtn(true);
                            }
                            setWithdrawPath(mainPath);
                          } else {
                            setWithdrawData(item);
                            setAmount(item.amount);
                            setBlockchainKey(item.blockchain_key);
                            setCompleteTime(item.done_at);
                            setCreateTime(item.created_at);
                            setCurrency(item.currency);
                            setFee(item.fee);
                            setStateStatus(item.state);
                            setTransactionId("");
                            setRid(item.rid);
                            // setIsModalVisibleWithdraw(true);
                            // const mainPath = path + item.blockchain_txid;
                            // Linking.openURL(mainPath);

                            setShowExplorerWithdraw(true);
                            setHaveWithdrawExplorer(false);
                            // Singleton.getInstance().showWarn(
                            //   "Transaction hash is null"
                            // );
                          }
                        }
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginHorizontal: 15,
                          marginVertical: 8,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.textColor1,
                            }}
                          >
                            {item.currency.toUpperCase()}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.inactiveTextColor,
                            }}
                          >
                            {strings.spot.network}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.inactiveTextColor,
                            }}
                          >
                            {Moment(item.created_at).format(
                              "YYYY-MM-DD hh:mm:ss a"
                            )}
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.textColor1,
                            }}
                          >
                            {item.amount}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.textColor1,
                              textTransform: "uppercase",
                            }}
                          >
                            {item.blockchain_key.replace("-testnet", "")}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <View
                              style={{
                                height: 4,
                                width: 4,
                                borderRadius: 2,
                                backgroundColor:
                                  (withdrawDataState &&
                                    withdrawDataState[item.state] ==
                                    "collected") ||
                                    withdrawDataState[item.state] == "succeed"
                                    ? ThemeManager.colors.textGreenColor
                                    : ThemeManager.colors.textRedColor,
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: Fonts.regular,
                                marginLeft: 5,
                                color: ThemeManager.colors.inactiveTextColor,
                                textTransform: "capitalize",
                              }}
                            >
                              {withdrawDataState &&
                                withdrawDataState[item.state]}
                              {/* {item.state} */}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => {
                  return (
                    <>
                      {/* {withdrawHistoryList.length > 0 ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            // flex: 1,
                          }}
                        >
                          <Text
                            style={{
                              marginVertical: 30,
                              fontSize: 14,
                              fontFamily: Fonts.regular,
                              color: ThemeManager.colors.inactiveTextColor,
                            }}
                          >
                            {strings.spot.no_more_data}
                          </Text>
                        </View>
                      ) : ( */}
                      <View style={{ height: 50 }} />
                      {/* )} */}
                    </>
                  );
                }}
              />
            ) : (
              <View>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 20,
                  }}
                ></View>
                <View>
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
                        height: 80,
                        width: 80,
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
                      {strings.spot.no_withdraw_history}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* <View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                  marginVertical: 15,
                }}>
                <Image
                  source={{uri: ThemeManager.ImageIcons.icon_info}}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.deposit_not_arrived}
                  <Text
                    onPress={() => {}}
                    style={{color: ThemeManager.colors.selectedTextColor}}>
                    {' '}
                    {strings.spot.check_solutions}
                  </Text>
                </Text>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}>
                      {'TRX'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}>
                      {'2021-12-29 12:00:00'}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}>
                      {'10'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <View
                        style={{
                          height: 4,
                          width: 4,
                          borderRadius: 2,
                          backgroundColor: ThemeManager.colors.textGreenColor,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          marginLeft: 5,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}>
                        {'Completed'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flex: 1,
                }}>
                <Text
                  style={{
                    marginTop: 50,
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.no_more_data}
                </Text>
              </View>
            </View> */}
          </View>

          {/* <View
            key="3"
            style={{
              backgroundColor: ThemeManager.colors.tabBackground,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setCryptoSelect(true);
                    //   ActionSheetOrders.current.show();
                  }}
                  style={{
                    // height: 30,
                    backgroundColor: cryptoSelect
                      ? ThemeManager.colors.btnColor2
                      : null,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: cryptoSelect
                        ? ThemeManager.colors.textColor
                        : ThemeManager.colors.inactiveTextColor,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                    }}>
                    {strings.spot.crypto}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                  marginVertical: 15,
                }}>
                <Image
                  source={{uri: ThemeManager.ImageIcons.icon_info}}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.deposit_not_arrived}
                  <Text
                    onPress={() => {}}
                    style={{color: ThemeManager.colors.selectedTextColor}}>
                    {' '}
                    {strings.spot.check_solutions}
                  </Text>
                </Text>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}>
                      {'TRX'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}>
                      {'2021-12-29 12:00:00'}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}>
                      {'10'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <View
                        style={{
                          height: 4,
                          width: 4,
                          borderRadius: 2,
                          backgroundColor: ThemeManager.colors.textGreenColor,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          marginLeft: 5,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}>
                        {'Completed'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flex: 1,
                }}>
                <Text
                  style={{
                    marginTop: 50,
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.no_more_data}
                </Text>
              </View>
            </View>
          </View>
          <View
            key="4"
            style={{
              backgroundColor: ThemeManager.colors.tabBackground,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setCryptoSelect(true);
                    //   ActionSheetOrders.current.show();
                  }}
                  style={{
                    // height: 30,
                    backgroundColor: cryptoSelect
                      ? ThemeManager.colors.btnColor2
                      : null,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: cryptoSelect
                        ? ThemeManager.colors.textColor
                        : ThemeManager.colors.inactiveTextColor,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                    }}>
                    {strings.spot.crypto}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                  marginVertical: 15,
                }}>
                <Image
                  source={{uri: ThemeManager.ImageIcons.icon_info}}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.deposit_not_arrived}
                  <Text
                    onPress={() => {}}
                    style={{color: ThemeManager.colors.selectedTextColor}}>
                    {' '}
                    {strings.spot.check_solutions}
                  </Text>
                </Text>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}>
                      {'TRX'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}>
                      {'2021-12-29 12:00:00'}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}>
                      {'10'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <View
                        style={{
                          height: 4,
                          width: 4,
                          borderRadius: 2,
                          backgroundColor: ThemeManager.colors.textGreenColor,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          marginLeft: 5,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}>
                        {'Completed'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flex: 1,
                }}>
                <Text
                  style={{
                    marginTop: 50,
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}>
                  {strings.spot.no_more_data}
                </Text>
              </View>
            </View>
          </View>
         */}
        </PagerView>
      </ScrollView>
      <Loader
        isLoading={
          orderHistoryLoading || withdrawListHistoryIsLoading ? true : false
        }
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <Wrap
          // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
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
                  marginHorizontal: 10,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  marginVertical: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                  style={{
                    // position: 'absolute',
                    // top: 20,
                    // right: 20,
                    alignSelf: "flex-end",
                    height: 40,
                    width: 40,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    //   backgroundColor: 'red',
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
                <Text
                  style={{
                    color: "black",
                    marginVertical: 10,
                    fontSize: 22,
                    fontFamily: Fonts.bold,
                  }}
                >
                  {strings.trade_tab.transaction_details}
                </Text>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Address
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {address}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Amount
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {amount}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Fee
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {fee}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Blockchain Key
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      {blockchainKey}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      State
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      {stateStatus == "accepted" ? "Collected" : stateStatus}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Transaction Id
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {transactionId}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Create Time
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {Moment(createTime).format("YYYY-MM-DD hh:mm:ss a")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Complete Time
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                        marginBottom: 40,
                      }}
                    >
                      {Moment(completeTime).format("YYYY-MM-DD hh:mm:ss a")}
                    </Text>
                  </View>
                </View>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisibleWithdraw}
        onRequestClose={() => {
          setIsModalVisibleWithdraw(false);
        }}
      >
        <Wrap
          // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
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
                setIsModalVisibleWithdraw(false);
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
                  marginHorizontal: 10,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  marginVertical: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisibleWithdraw(false);
                  }}
                  style={{
                    // position: 'absolute',
                    // top: 20,
                    // right: 20,
                    alignSelf: "flex-end",
                    height: 40,
                    width: 40,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    //   backgroundColor: 'red',
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
                <Text
                  style={{
                    color: "black",
                    marginVertical: 10,
                    fontSize: 22,
                    fontFamily: Fonts.bold,
                  }}
                >
                  {strings.trade_tab.transaction_details}
                </Text>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Amount
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {amount}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Fee
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {fee}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Blockchain Key
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      {blockchainKey}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      State
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      {stateStatus == "accepted" ? "Collected" : stateStatus}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Transaction Id
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {transactionId}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Transaction Method
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {rid}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Create Time
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                      }}
                    >
                      {Moment(createTime).format("YYYY-MM-DD hh:mm:ss a")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.anouncementtextColour,
                        flexShrink: 1,
                      }}
                    >
                      Complete Time
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor1,
                        flex: 1,
                        textAlign: "right",
                        marginLeft: 10,
                        marginBottom: 40,
                      }}
                    >
                      {Moment(completeTime).format("YYYY-MM-DD hh:mm:ss a")}
                    </Text>
                  </View>
                </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showExplorer}
        onRequestClose={() => setShowExplorer(false)}
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
                setShowExplorer(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.DashboardBG,
                // marginHorizontal: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
            >
              <View
                style={{
                  marginTop: 15,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: ThemeManager.colors.textColor,
                      fontFamily: fonts.medium,
                    }}
                  >
                    {strings.spot.deposit_details}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowExplorer(false);
                    }}
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_cross }}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                </View>
                <TabView
                  title={strings.spot.reference_id}
                  value={referenceId}
                />
                <TabView title={strings.spot.amount} value={amount} />
                <TabView
                  title={strings.spot.status}
                  textColor={
                    depData && depData[stateStatus] == "collected"
                      ? ThemeManager.colors.textGreenColor
                      : ThemeManager.colors.textRedColor
                  }
                  value={depData && depData[stateStatus]}
                />
                <TabView title={strings.spot.network_c} value={blockchainKey} />
                <TabView
                  title={strings.spot.transaction_id}
                  value={transactionId}
                />
                <TabView
                  title={strings.spot.date_c}
                  value={Moment(createTime).format("YYYY-MM-DD hh:mm:ss a")}
                />
                {showExplorerBtn ? (
                  <ButtonPrimary
                    style={{ marginVertical: 20 }}
                    title={strings.spot.view_on_explorer}
                    onPress={() => {
                      onViewButtonPress();
                    }}
                  />
                ) : (
                  <View style={{ marginBottom: 20 }} />
                )}
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showExplorerWithdraw}
        onRequestClose={() => setShowExplorerWithdraw(false)}
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
                setShowExplorerWithdraw(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.DashboardBG,
                // marginHorizontal: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
            >
              <View
                style={{
                  marginTop: 15,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: ThemeManager.colors.textColor,
                      fontFamily: fonts.medium,
                    }}
                  >
                    {strings.spot.withdraw_details}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowExplorerWithdraw(false);
                    }}
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_cross }}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                </View>
                {/* <TabView
                  title={strings.spot.reference_id}
                  value={referenceId}
                /> */}
                <TabView title={strings.spot.amount} value={amount} />
                <TabView
                  title={strings.spot.status}
                  textColor={
                    (withdrawDataState &&
                      withdrawDataState[stateStatus] == "collected") ||
                      withdrawDataState[stateStatus] == "succeed"
                      ? ThemeManager.colors.textGreenColor
                      : ThemeManager.colors.textRedColor
                  }
                  value={withdrawDataState && withdrawDataState[stateStatus]}
                />
                <TabView title={strings.spot.network_c} value={blockchainKey} />
                <TabView
                  title={strings.spot.transaction_id}
                  value={transactionId}
                />
                <TabView
                  title={strings.spot.date_c}
                  value={Moment(createTime).format("YYYY-MM-DD hh:mm:ss a")}
                />
                {showExplorerBtn ? (
                  <ButtonPrimary
                    style={{ marginVertical: 20 }}
                    title={strings.spot.view_on_explorer}
                    onPress={() => {
                      onWithdrawButtonPress();
                    }}
                  />
                ) : (
                  <View style={{ marginBottom: 20 }} />
                )}
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
    </Wrap>
  );
};

export default HistoryWallet;
