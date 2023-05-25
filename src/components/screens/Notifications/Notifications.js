/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import useStyles from "./NotificationsStyle";
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, CustomEmptyView, Header, Loader } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import { strings } from "../../../../Localization";
import { string } from "prop-types";
import SimpleHeader from "../../common/SimpleHeader";
import {
  getNotificationList,
  resetNotificationHistory,
  getSingleWithdrawHistoryData,
  getNotificationRead,
  getSingleDepositHistoryData,
  getSingleTradeHistoryData,
  resetTradeHistory,
  getMarketList,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import Singleton from "../../../Singleton";
import moment from "moment";

import * as constants from "../../../Constants";

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
const TabView = ({ title, value, textColor }) => {
  const styles = useStyles(ThemeManager);
  return (
    <>
      <Text style={styles.titleStyle}>{title}</Text>
      <Text
        style={[
          styles.valueStyle,
          {
            color: textColor ? textColor : ThemeManager.colors.textColor1,
          },
        ]}
      >
        {value}
      </Text>
    </>
  );
};
let itemArr = [];
const Notifications = (props) => {
  const styles = useStyles(ThemeManager);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLImit] = useState(10);

  const [showExplorer, setShowExplorer] = useState(false);
  const [showExplorerWithdraw, setShowExplorerWithdraw] = useState(false);
  const [depositPath, setDepositPath] = useState("");
  const [withdrawPath, setWithdrawPath] = useState("");
  const [haveDepositExplorer, setHaveDepositExplorer] = useState(false);
  const [haveWithdrawExplorer, setHaveWithdrawExplorer] = useState(false);
  const [haveTradeExplorer, setHaveTradeExplorer] = useState(false);

  //deposit
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
  const [withdrawLoader, setWithdrawLoader] = useState(false);

  const { notifyLoader, notifyData, totalrecords } = useSelector(
    (state) => state?.accountRed
  );
  const [showExplorerBtn, setShowExplorerBtn] = useState(false);
  const [showExplorerWithdrawBtn, setShowExplorerWithdrawBtn] = useState(false);

  const dispatch = useDispatch();
  const getNotificationData = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        global.checkNotify = null;
        var data = JSON.parse(res);
        dispatch(getNotificationList(pageNumber, pageLimit)).then((res) => {
          console.log("");
          dispatch(resetTradeHistory());
          dispatch(getMarketList());
        });
      })
      .catch((err) => {});
  };
  useEffect(() => {
    // getNotificationData();
    props.navigation.addListener("didFocus", () => {
      dispatch(resetNotificationHistory());
      getNotificationData();
    });
    return () => {
      dispatch(resetNotificationHistory());
    };
  }, []);

  const isCloseToBottom = () => {
    let page = pageNumber + 1;

    if (notifyData.length < totalrecords) {
      setPageNumber(page);
      dispatch(getNotificationList(page, pageLimit));
    } else {
      setPageNumber(pageNumber);
    }
  };

  //view explorer deposit
  const onViewButtonPress = () => {
    if (haveDepositExplorer) {
      Linking.openURL(depositPath);
      setShowExplorer(false);
    } else {
      Singleton.getInstance().showError("Don't have any explorer link");
    }
  };
  const onWithdrawButtonPress = () => {
    if (haveWithdrawExplorer) {
      Linking.openURL(withdrawPath);
      setShowExplorerWithdraw(false);
    } else {
      setShowExplorerWithdraw(false);
      Singleton.getInstance().showWarn("Transaction hash is null");
    }
  };
  const refreshNotifications = (id) => {
    dispatch(getNotificationRead(id)).then((res) => {
      console.log("getNotificationRead=-=-res===-=", res);
      setPageNumber(1);
      dispatch(resetNotificationHistory());
      dispatch(getNotificationList(1, 10))
        .then((res) => {
          console.log("getNotificationList=-=-res===-=", res);
        })
        .catch((err) => {
          console.log("getNotificationList=-=-err===-=", err);
        });
    });
  };
  return (
    <Wrap
      style={styles.bgColor}
      screenStyle={styles.bgColor}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={styles.bgColor}
    >
      <View style={styles.headerStyle}>
        <SimpleHeader
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <Text style={styles.notificationText}>
        {strings.titleName.notifications}
      </Text>
      <Loader isLoading={withdrawLoader} />
      <View style={{ marginHorizontal: 10, marginBottom: 20, flexGrow: 1 }}>
        <FlatList
          bounces={false}
          keyboardShouldPersistTaps={"handled"}
          keyExtractor={(item, index) => index.toString()}
          style={{ flexGrow: 1 }}
          data={notifyData}
          onEndReached={() => {
            isCloseToBottom();
          }}
          onEndReachedThreshold={0.9}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={[styles.viewMainContainer]}
                onPress={() => {
                  let notificationId = item?.notifiable_id;
                  console.log("notificationId--", notificationId);
                  console.log("itema--res--", item);
                  console.log("itema--status--", item.status);
                  if (item?.status == "unread") {
                    refreshNotifications(item?.id);
                  }
                  if (item?.notification?.data?.type == "Deposits") {
                    // global.fromNotification = true;
                    setWithdrawLoader(true);
                    dispatch(getSingleDepositHistoryData(notificationId))
                      .then((res) => {
                        console.log("getSingleDepositHistoryData--res--", res);
                        if (res?.explorer_transaction != null) {
                          const path = res.explorer_transaction.replace(
                            "#{txid}",
                            ""
                          );
                          setAddress(res?.address);
                          setAmount(res?.amount);
                          setBlockchainKey(res?.blockchain_key);
                          setCompleteTime(res?.completed_at);
                          setCreateTime(res?.created_at);
                          setCurrency(res?.currency);
                          setFee(res?.fee);
                          setStateStatus(res?.state);
                          setTransactionId(res?.txid);
                          setReferenceId(res?.tid);
                          setHaveDepositExplorer(true);
                          setShowExplorer(true);
                          // if (res?.status == "unread") {
                          //   refreshNotifications(item?.id);
                          // }
                          const mainPath = path + res.txid;
                          if (res?.transaction_type == "internal") {
                            setShowExplorerBtn(false);
                            // alert("hey");
                          } else {
                            setShowExplorerBtn(true);
                            // alert("hello");
                          }
                          setDepositPath(mainPath);

                          //
                          // Linking.openURL(mainPath);
                        } else {
                          setAddress(res?.address);
                          setAmount(res?.amount);
                          setBlockchainKey(res?.blockchain_key);
                          setCompleteTime(res?.completed_at);
                          setCreateTime(res?.created_at);
                          setCurrency(res?.currency);
                          setFee(res?.fee);
                          setStateStatus(res?.state);
                          setTransactionId(res?.txid);
                          setReferenceId(res?.tid);
                          setHaveDepositExplorer(false);
                          // if (item?.status == "unread") {
                          //   refreshNotifications(item?.id);
                          // }
                          setShowExplorer(true);
                        }
                        setWithdrawLoader(false);
                      })
                      .catch((err) => {
                        console.log("getSingleDepositHistoryData--err--", err);
                        setWithdrawLoader(false);
                      });
                    // Actions.currentScene != "HistoryWallet" &&
                    //   Actions.HistoryWallet();
                  } else if (item?.notification?.data?.type == "Trade") {
                    setWithdrawLoader(true);
                    dispatch(getSingleTradeHistoryData(notificationId))
                      .then((res) => {
                        console.log("getSingleTradeHistoryData--res--", res);
                        // setHaveTradeExplorer(true);
                        Actions.currentScene != "OrderDetails" &&
                          Actions.push("OrderDetails", { detail: res });
                        // if (item?.status == "unread") {
                        //   refreshNotifications(item?.id);
                        // }
                        setWithdrawLoader(false);
                      })
                      .catch((err) => {
                        setHaveTradeExplorer(false);
                        setWithdrawLoader(false);
                        console.log("getSingleTradeHistoryData--err--", err);
                      });
                  } else if (
                    item?.notification?.data?.type == "Withdraws" ||
                    item?.notification?.data?.type == "OrderAsk" ||
                    item?.notification?.data?.type == "OrderBid"
                  ) {
                    // global.fromNotification = false;
                    setWithdrawLoader(true);
                    dispatch(getSingleWithdrawHistoryData(notificationId))
                      .then((res) => {
                        console.log(
                          "getSingleWithdrawHistoryData===--res--",
                          res
                        );
                        if (res?.blockchain_txid != null) {
                          const path = res.explorer_transaction.replace(
                            "#{txid}",
                            ""
                          );
                          console.log("item+=-=-=path->>>>", path);
                          console.log(
                            "item?.transaction_type->>>>",
                            res?.transaction_type
                          );
                          if (res?.transaction_type == "internal") {
                            setShowExplorerWithdrawBtn(false);
                            // alert("hello");
                          } else {
                            setShowExplorerWithdrawBtn(true);
                            // alert("hello i am hete");
                          }
                          setAmount(res.amount);
                          setBlockchainKey(res.blockchain_key);
                          setCompleteTime(res.done_at);
                          setCreateTime(res.created_at);
                          setCurrency(res.currency);
                          setFee(res.fee);
                          setStateStatus(res.state);
                          setTransactionId(res.blockchain_txid);
                          setRid(res.rid);

                          setHaveWithdrawExplorer(true);

                          // if (item?.status == "unread") {
                          //   refreshNotifications(item?.id);
                          // }
                          console.log(
                            "item?.transaction_type---",
                            item?.transaction_type
                          );

                          const mainPath = path + res.blockchain_txid;
                          // console.log("mainPath=-=-=-=->>>>");
                          setWithdrawPath(mainPath);
                          setShowExplorerWithdraw(true);
                        } else {
                          setAmount(res.amount);
                          setBlockchainKey(res.blockchain_key);
                          setCompleteTime(res.done_at);
                          setCreateTime(res.created_at);
                          setCurrency(res.currency);
                          setFee(res.fee);
                          setStateStatus(res.state);
                          setTransactionId("");
                          setRid(res.rid);
                          setShowExplorerWithdraw(true);
                          // if (item?.status == "unread") {
                          //   refreshNotifications(item?.id);
                          // }
                          setHaveWithdrawExplorer(false);
                        }
                        setWithdrawLoader(false);
                      })
                      .catch((err) => {
                        setWithdrawLoader(false);
                        console.log("getSingleWithdrawHistoryData--err--", err);
                        Singleton.getInstance().showError(err);
                      });
                  } else if (item?.notification?.data?.type == "Kyc") {
                  }
                }}
              >
                <Image
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: "contain",
                    tintColor: ThemeManager.colors.textColor1,
                    marginTop: item.status == "unread" ? 3 : 3,
                  }}
                  source={{
                    uri:
                      item.status == "read"
                        ? Images.icon_email
                        : ThemeManager.ImageIcons.icon_notification_k,
                  }}
                />
                <View style={styles.readContainer}>
                  <View style={styles.readView}>
                    {item.status == "unread" && (
                      <View style={styles.unreadView} />
                    )}
                    <Text
                      style={[
                        styles.headStyle,
                        {
                          color:
                            item?.status == "read"
                              ? ThemeManager.colors.headerText
                              : ThemeManager.colors.textColor1,
                          textTransform: "capitalize",
                        },
                      ]}
                    >
                      {item?.notification?.notification?.title}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.textStyle,
                      {
                        color:
                          item?.status == "read"
                            ? ThemeManager.colors.headerText
                            : ThemeManager.colors.textColor1,
                      },
                    ]}
                  >
                    {typeof item?.notification?.notification?.body ===
                      "string" && item?.notification?.notification?.body}
                  </Text>
                  <Text
                    style={[
                      styles.textStyle,
                      {
                        color:
                          item?.status == "read"
                            ? ThemeManager.colors.headerText
                            : ThemeManager.colors.textColor1,
                        fontSize: 9,
                        marginTop: 10,
                        // alignSelf: 'flex-end',
                      },
                    ]}
                  >
                    {moment(item.created_at).format("DD MMM YYYY, hh:mm A")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={() => {
            return <View style={{ height: 50 }} />;
          }}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <CustomEmptyView />
              <Text style={styles.notFound}>{"No record found"}</Text>
            </View>
          }
        />
      </View>
      <Loader isLoading={notifyLoader} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showExplorer}
        onRequestClose={() => setShowExplorer(false)}
      >
        <Wrap
          style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
          screenStyle={[
            styles.screenStyle,
            { backgroundColor: ThemeManager.colors.DashboardBG },
          ]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View style={styles.withdrawSubContainer}>
            <View style={styles.withdrawViewStyle}>
              <View style={styles.viewStyle}>
                <View style={styles.withdrawView}>
                  <Text style={styles.withdrawText}>
                    {strings.spot.deposit_details}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowExplorer(false);
                    }}
                    style={styles.crossButton}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_cross }}
                      style={styles.crossIcon}
                    />
                  </TouchableOpacity>
                </View>
                <TabView
                  title={strings.spot.reference_id}
                  value={referenceId}
                />
                <TabView title={strings.spot.amount} value={amount} />
                {/* <TabView title={strings.spot.status} value={stateStatus} />
                 */}
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
                  value={moment(createTime).format("YYYY-MM-DD hh:mm:ss a")}
                />
              </View>
            </View>
          </View>
          {showExplorerBtn && (
            <ButtonPrimary
              style={styles.verticalMargin}
              title={strings.spot.view_on_explorer}
              onPress={() => {
                onViewButtonPress();
              }}
            />
          )}
        </Wrap>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={haveTradeExplorer}
        onRequestClose={() => setHaveTradeExplorer(false)}
      >
        <Wrap
          style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
          screenStyle={[
            styles.screenStyle,
            { backgroundColor: ThemeManager.colors.DashboardBG },
          ]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View style={styles.withdrawSubContainer}>
            {/* <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setHaveTradeExplorer(false);
              }}
            ></TouchableOpacity> */}
            <View style={styles.withdrawViewStyle}>
              <View style={styles.viewStyle}>
                <View style={styles.withdrawView}>
                  <Text style={styles.withdrawText}>
                    {strings.spot.trade_details}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setHaveTradeExplorer(false);
                    }}
                    style={styles.crossButton}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_cross }}
                      style={styles.crossIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showExplorerWithdraw}
        onRequestClose={() => setShowExplorerWithdraw(false)}
      >
        <Wrap
          style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
          screenStyle={[
            styles.screenStyle,
            { backgroundColor: ThemeManager.colors.DashboardBG },
          ]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View style={styles.withdrawSubContainer}>
            <View style={styles.withdrawViewStyle}>
              <View style={styles.viewStyle}>
                <View style={styles.withdrawView}>
                  <Text style={styles.withdrawText}>
                    {strings.spot.withdraw_details}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowExplorerWithdraw(false);
                    }}
                    style={styles.crossButton}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_cross }}
                      style={styles.crossIcon}
                    />
                  </TouchableOpacity>
                </View>
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
                  value={moment(createTime).format("YYYY-MM-DD hh:mm:ss a")}
                />
              </View>
            </View>
            {showExplorerWithdrawBtn && (
              <ButtonPrimary
                style={styles.verticalMargin}
                title={strings.spot.view_on_explorer}
                onPress={() => {
                  onWithdrawButtonPress();
                }}
              />
            )}
          </View>
        </Wrap>
      </Modal>
    </Wrap>
  );
};

export default Notifications;
