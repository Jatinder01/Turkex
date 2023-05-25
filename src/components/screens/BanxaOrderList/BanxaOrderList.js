/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import fonts from "../../../theme/fonts";
import { ButtonPrimary, Wrap, Loader, CustomEmptyView } from "../../common";
import styles from "./BanxaOrderListStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import DatePicker from "react-native-date-picker";
import {
  banxaAllOrder,
  resetBanxaAllOrder,
  banxaconfirmSell,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import Moment from "moment";
import Clipboard from "@react-native-clipboard/clipboard";
import DropDownPicker from "react-native-dropdown-picker";
import { showMessage } from "react-native-flash-message";
import RowView from "../../common/RowView";
import Toast from "react-native-simple-toast";
let startDate;
let endDate;
let page;
let perPage;
let status;
const height = Dimensions.get("window").height;
const BanxaOrderList = (props) => {
  const intervalRef = useRef(null);
  const [pageLimit, setPageLImit] = useState(10);
  const [pageNumberTrade, setPageNumberTrade] = useState(1);

  const banxaAllOrderReducer = useSelector(
    (state) => state?.banxaAllOrderReducer
  );
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setfromDate] = useState("DD-MM-YYYY");
  const [toDate, setToDate] = useState("DD-MM-YYYY");
  const [startDateCheck, setStartDateCheck] = useState("");
  const [endDateCheck, setEndDateCheck] = useState("");
  const [statusData, setStatusData] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromDateSelected, setfromDateSelected] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [trxHash, setTrxHash] = useState("");
  const [modalPopUpVisible, setModalPopUpVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState(false);
  const [sellOrderId, setSellOrderId] = useState("");
  const [minimumToDate, setMinimumToDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [items, setItems] = useState([
    { label: "Pending", value: "pendingPayment" },
    { label: "Waiting", value: "waitingPayment" },
    { label: "Received", value: "paymentReceived" },
    { label: "In progress", value: "inProgress" },
    { label: "Coin-Transferred", value: "coinTransferred" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Declined", value: "declined" },
    { label: "Expired", value: "expired" },
    { label: "Complete", value: "complete" },
    { label: "Refunded", value: "refunded" },
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    var currentRoute = props?.navigation?.state?.routeName;
    dispatch(resetBanxaAllOrder());
    props.navigation.addListener("didFocus", async (event) => {
      startDate = Moment(new Date()).subtract(1, "months").format("DD-MM-YYYY");
      endDate = Moment(new Date()).format("DD-MM-YYYY");
      setStartDateCheck(startDateCheck);
      setEndDateCheck(endDateCheck);
      setfromDate(startDate);
      setToDate(endDate);
      page = `${pageNumberTrade}`;
      perPage = pageLimit;

      intervalRef.current = setInterval(() => {
        if (currentRoute === event.state.routeName) {
          dispatch(
            banxaAllOrder({ startDate, endDate, page, perPage, status })
          );
        }
        // alert('hello');
      }, 60000);
      if (currentRoute === event.state.routeName) {
        dispatch(banxaAllOrder({ startDate, endDate, page, perPage, status }));
      }
    });
    props.navigation.addListener("didBlur", (event) => { });
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const textFormat = (status) => {
    switch (status) {
      case "pendingPayment":
        return "Pending";
      case "waitingPayment":
        return "Waiting";
      case "paymentReceived":
        return "Received";
      case "inProgress":
        return "In progress";
      case "coinTransferred":
        return "Coin-Transferred";
      case "cancelled":
        return "Cancelled";
      case "declined":
        return "Declined";
      case "expired":
        return "Expired";
      case "complete":
        return "Complete";
      case "refunded":
        return "Refunded";
      case "CRYPTO-BUY":
        return "Buy";
      case "CRYPTO-SELL":
        return "Sell";
      default:
        return status;
    }
  };
  const filterList = [
    "Pending",
    "Waiting",
    "Received",
    "In progress",
    "Coin-Transferred",
    "Cancelled",
    "Declined",
    "Expired",
    "Complete",
    "Refunded",
    "Buy",
    "Sell",
  ];

  const renderDatePicker = () => {
    var date1 = new Date();
    return (
      <>
        {fromDateSelected ? (
          <DatePicker
            modal
            fadeToColor="white"
            open={showDatePicker}
            mode="date"
            date={date1}
            maximumDate={date1}
            theme={ThemeManager.colors.themeColor === "dark" ? "dark" : "light"}
            onConfirm={(date) => {
              let value = Moment(date).format("DD-MM-YYYY");
              setfromDate(value);
              setMinimumToDate(date);
              setShowDatePicker(false);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
            textColor={ThemeManager.colors.textColor1}
          />
        ) : (
          <DatePicker
            modal
            fadeToColor="white"
            open={showDatePicker}
            mode="date"
            date={date1}
            maximumDate={date1}
            minimumDate={minimumToDate}
            theme={ThemeManager.colors.themeColor === "dark" ? "dark" : "light"}
            textColor={ThemeManager.colors.textColor1}
            onConfirm={(date) => {
              let value = Moment(date).format("DD-MM-YYYY");
              setToDate(value);
              setShowDatePicker(false);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
          />
        )}
      </>
    );
  };
  const renderTradeHistory = () => {
    return (
      <View>
        <View>
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={banxaAllOrderReducer?.banxaAllOrderList}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 5 }}
            bounces={false}
            contentContainerStyle={{ flexGrow: 1 }}
            onEndReachedThreshold={0.5}
            extraData={banxaAllOrderReducer?.banxaAllOrderList}
            onEndReached={() => {
              isCloseToBottomTrade();
            }}
            scrollEnabled={true}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.inputColor,
                    flex: 1,
                    margin: 2,
                    padding: 10,
                  }}
                >
                  <View style={styles.orderView}>
                    <Text
                      style={[
                        styles.nameText,
                        { color: ThemeManager.colors.textColor1 },
                      ]}
                    >
                      {item.payment_type}
                    </Text>
                  </View>
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.order_type}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={textFormat(item.order_type)}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.you_buy}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={item.coin_amount + " " + item.coin_code}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.you_spend}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={item.fiat_amount + " " + item.fiat_code}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.fee}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={item.fee}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.trx_hash}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={item.tx_hash ? item.tx_hash : "- - - - -"}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.status}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={textFormat(item.status)}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.date}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={Moment(item.created_at).format("DD-MM-YY hh:mm:ss")}
                  />

                  <View style={[styles.orderView, { marginTop: 10 }]}>
                    <Text
                      style={[
                        styles.dateText,
                        {
                          fontSize: 14,
                        },
                      ]}
                    >
                      {strings.trade_tab.action}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      {/* {item.order_type === 'CRYPTO-SELL' ? (
                        <TouchableOpacity
                          disabled={
                            (item.wallet_address != null ||
                              item.wallet_address != '') &&
                            item.status === 'waitingPayment'
                              ? true
                              : false
                          }
                          onPress={() => {
                            setSellOrderId(item.id);
                            setWalletAddress(item.wallet_address);
                            // setModalPopUpVisible(true);
                            console.log('print item from list=-=-=->>>', item);
                          }}
                          style={{
                            // width: '45%',
                            backgroundColor:
                              ThemeManager.colors.selectedTextColor,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 4,
                          }}>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                            }}>
                            {strings.trade_tab.confirm_order}
                          </Text>
                        </TouchableOpacity>
                      ) : null} */}
                      <TouchableOpacity
                        onPress={() => {
                          setModalDetails(true);
                          setSelectedItemDetails(item);
                        }}
                        style={{
                          // width: '45%',
                          backgroundColor:
                            ThemeManager.colors.selectedTextColor,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 4,
                          marginLeft: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.textColor,
                            fontFamily: Fonts.regular,
                            fontSize: 12,
                          }}
                        >
                          {strings.trade_tab.view_details}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => {
              return <View style={{ height: 10 }}></View>;
            }}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  height: height,
                }}
              >
                {banxaAllOrderReducer?.isLoading == false && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: -120,
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
                      {strings.trade_tab.no_more_data}
                    </Text>
                  </View>
                )}
              </View>
            }
          />
        </View>
      </View>
    );
  };

  const isCloseToBottomTrade = () => {
    page = pageNumberTrade + 1;

    if (
      banxaAllOrderReducer.banxaAllOrderList.length !=
      banxaAllOrderReducer.totalrecords
    ) {
      perPage = pageLimit;
      setPageNumberTrade(page);
      dispatch(banxaAllOrder({ startDate, endDate, page, perPage, status }));
    }
  };
  const onOpen = () => {
    setOpen(!open);
  };
  const copyToClipboard = () => {
    Clipboard.setString(walletAddress);

    showMessage({
      message: strings.trade_tab.address_copied,
      backgroundColor: ThemeManager.colors.tabBottomBorder,
      autoHide: true,
      duration: 3000,
      type: "success",
      icon: "success",
      position: "right",
      style: { marginHorizontal: 10, borderRadius: 10, marginTop: 40 },
    });
  };
  const copyToClipboardTrx = (trx) => {
    Clipboard.setString(trx);
    Toast.showWithGravity(
      strings.trade_tab.transaction_id_copied,
      Toast.SHORT,
      Toast.CENTER
    );
    // showMessage({
    //   message: strings.trade_tab.transaction_id_copied,
    //   backgroundColor: ThemeManager.colors.tabBottomBorder,
    //   autoHide: true,
    //   duration: 3000,
    //   type: 'success',
    // });
  };
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.bgDarkwhite },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 10,
          marginHorizontal: 15,
          // flex: 1,
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
          {"Buy/Sell History"}
        </Text>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
          onPress={() => {
            setShowFilter(true);
          }}
        >
          <Image
            source={{ uri: Images.icon_filter_trade }}
            style={[
              {
                height: 22,
                width: 22,
                resizeMode: "contain",
                tintColor: ThemeManager.colors.textColor1,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: ThemeManager.colors.bgDarkwhite,
          flex: 1,
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            flex: 1,
            marginTop: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              key="3"
              style={{
                backgroundColor: ThemeManager.colors.tabBackground,
              }}
            >
              {renderTradeHistory()}
            </View>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilter}
        onRequestClose={() => {
          setShowFilter(false);

          onOpen();
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
            {renderDatePicker()}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setShowFilter(false);
                onOpen();
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.DashboardBG,
                marginHorizontal: 15,
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
                    height: 40,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontFamily: Fonts.medium,
                        fontSize: 14,
                        color: ThemeManager.colors.textColor1,
                      }}
                    >
                      Filter
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.8,
                    }}
                  >
                    <TouchableOpacity onPress={() => setShowFilter(false)}>
                      <View>
                        <Image
                          source={
                            { uri: ThemeManager.ImageIcons.icon_close_main }
                          }
                          style={{
                            alignSelf: "flex-end",
                            width: 20,
                            height: 20,
                            // tintColor: ThemeManager.colors.textColor1,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 14,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 12,
                    }}
                  >
                    From Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setfromDateSelected(true);
                      setShowDatePicker(true);
                    }}
                    style={{
                      height: 40,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          color: ThemeManager.colors.textColor1,
                          marginLeft: 15,
                        }}
                      >
                        {fromDate}
                      </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        source={{
                          uri: ThemeManager.ImageIcons.icon_forward_arrow,
                        }}
                        style={{
                          width: 12,
                          height: 12,
                          resizeMode: "contain",
                          marginRight: 8,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 14,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 12,
                    }}
                  >
                    To Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setfromDateSelected(false);
                      setShowDatePicker(true);
                    }}
                    style={{
                      height: 40,
                      backgroundColor: ThemeManager.colors.tabBackground,
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          color: ThemeManager.colors.textColor1,
                          marginLeft: 15,
                        }}
                      >
                        {toDate}
                      </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        source={{
                          uri: ThemeManager.ImageIcons.icon_forward_arrow,
                        }}
                        style={{
                          width: 12,
                          height: 12,
                          resizeMode: "contain",
                          marginRight: 8,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 14,
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 12,
                    }}
                  >
                    Status
                  </Text>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={() => {
                      onOpen();
                    }}
                    setValue={setValue}
                    setItems={setItems}
                    theme={
                      ThemeManager.colors.themeColor === "dark"
                        ? "DARK"
                        : "LIGHT"
                    }
                    multiple={true}
                    mode="BADGE"
                    badgeDotColors={[
                      "#000000",
                      // '#e76f51',
                      // '#00b4d8',
                      // '#e9c46a',
                      // '#e76f51',
                      // '#8ac926',
                      // '#00b4d8',
                      // '#e9c46a',
                    ]}
                    badgeTextStyle={{
                      color: "black",
                    }}
                    textStyle={{
                      fontSize: 15,
                      color: ThemeManager.colors.textColor1,
                    }}
                    labelStyle={{
                      fontWeight: "bold",
                      fontSize: 14,
                      color: ThemeManager.colors.textColor1,
                    }}
                    style={{
                      backgroundColor: ThemeManager.colors.tabBackground,
                      borderRadius: 0,
                      borderColor: "transparent",
                    }}
                    onSelectItem={(item) => {
                      console.log("-=-=-=-=item=-=-=", item);
                    }}
                    onChangeValue={(value) => {
                      console.log("-=-=-=-=value=-=-=", value);
                      let statusValue = value.join();
                      setStatusData(statusValue);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 20,
                  }}
                >
                  <ButtonPrimary
                    title={"Reset"}
                    style={{
                      height: 50,
                      marginTop: 20,
                      width: "40%",
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      dispatch(resetBanxaAllOrder());
                      startDate = Moment(new Date())
                        .subtract(1, "months")
                        .format("DD-MM-YYYY");
                      endDate = Moment(new Date()).format("DD-MM-YYYY");

                      setfromDate(startDate);
                      console.log("startDateCheck=-=-month>>", startDate);
                      console.log("endDateCheck=-=-month>>", endDate);
                      setToDate(endDate);

                      page = 1;
                      perPage = pageLimit;

                      dispatch(
                        banxaAllOrder({ startDate, endDate, page, perPage })
                      );
                      setPageNumberTrade(1);
                      onOpen();
                      setValue([]);
                      setShowFilter(false);
                    }}
                  />
                  <ButtonPrimary
                    title={strings.spot.confirm}
                    onPress={() => {
                      dispatch(resetBanxaAllOrder());

                      page = 1;
                      startDate = fromDate;
                      endDate = toDate;
                      status = statusData;

                      setPageNumberTrade(1);
                      dispatch(
                        banxaAllOrder({
                          startDate,
                          endDate,
                          page,
                          perPage,
                          status,
                        })
                      );
                      onOpen();
                      setShowFilter(false);
                    }}
                    style={{
                      height: 50,
                      marginTop: 20,
                      width: "40%",
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalPopUpVisible}
        onRequestClose={() => setModalPopUpVisible(false)}
      >
        <Wrap
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
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
                    backgroundColor: ThemeManager.colors.anouncementtextColour,
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
                      dispatch(
                        banxaconfirmSell(
                          sellOrderId,
                          trxHash,
                          walletAddress,
                          fromAddress
                        )
                      )
                        .then((res) => {
                          dispatch(resetBanxaAllOrder());
                          console.log("check response==-=-=->>>", res);
                          dispatch(
                            banxaAllOrder({
                              startDate,
                              endDate,
                              page,
                              perPage,
                              status,
                            })
                          );
                          setModalPopUpVisible(false);
                        })
                        .catch((err) => { });
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDetails}
        onRequestClose={() => setModalDetails(false)}
      >
        <Wrap
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
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
                  setModalDetails(false);
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <View style={{ width: 20 }} />
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor1,
                      fontSize: 18,
                      fontFamily: Fonts.bold,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {strings.trade_tab.view_details}
                  </Text>
                  <TouchableOpacity onPress={() => setModalDetails(false)}>
                    <View>
                      <Image
                        source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                        style={{
                          alignSelf: "flex-end",
                          width: 20,
                          height: 20,
                          // tintColor: ThemeManager.colors.textColor1,
                          resizeMode: "contain",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.inputColor,
                    flex: 1,
                    margin: 2,
                    padding: 10,
                  }}
                >
                  <View style={styles.orderView}>
                    <Text
                      style={[
                        styles.nameText,
                        { color: ThemeManager.colors.textColor1 },
                      ]}
                    >
                      {selectedItemDetails?.payment_type}
                      {/* {item.payment_type} */}
                    </Text>
                  </View>
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.order_type}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={textFormat(selectedItemDetails?.order_type)}
                  />

                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.you_buy}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={
                      selectedItemDetails?.coin_amount +
                      " " +
                      selectedItemDetails?.coin_code
                    }
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.you_spend}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={
                      selectedItemDetails?.fiat_amount +
                      " " +
                      selectedItemDetails?.fiat_code
                    }
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.fee}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={selectedItemDetails?.fee}
                  />

                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    onPress={() => {
                      if (selectedItemDetails?.tx_hash) {
                        copyToClipboardTrx(selectedItemDetails?.tx_hash);
                      }
                    }}
                    label={strings.trade_tab.trx_hash}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={
                      selectedItemDetails?.tx_hash
                        ? selectedItemDetails?.tx_hash
                        : "- - - - -"
                    }
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.commission}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={selectedItemDetails?.commission}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.merchant_commission}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={selectedItemDetails?.merchant_commission}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.merchant_fee}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={selectedItemDetails?.merchant_fee}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.payment_fee}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={selectedItemDetails?.payment_fee}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.payment_fee_tax}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={selectedItemDetails?.payment_fee_tax}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.status}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={textFormat(selectedItemDetails?.status)}
                  />
                  <RowView
                    labelTextStyle={{
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                    label={strings.trade_tab.date}
                    dataTextStyle={{ color: ThemeManager.colors.textColor1 }}
                    data={Moment(selectedItemDetails?.created_at).format(
                      "DD-MM-YY hh:mm:ss"
                    )}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setModalDetails(false);
                }}
              ></TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </Wrap>
      </Modal>
      <Loader isLoading={banxaAllOrderReducer?.isLoading} />
    </Wrap>
  );
};
export default BanxaOrderList;
