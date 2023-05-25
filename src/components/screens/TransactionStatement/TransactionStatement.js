/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
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
  StyleSheet,
  Modal,
  Dimensions,
  ImageBackground,
  Appearance,
} from "react-native";

import { Wrap } from "../../common/Wrap";
import { ThemeManager } from "../../../../ThemeManager";
import TradeHeader from "../../common/TradeHeader";
import { strings } from "../../../../Localization";
import { colors, Fonts, Images } from "../../../theme";
import BorderLine from "../../common/BorderLine";
import { Actions } from "react-native-router-flux";
import Singleton from "../../../Singleton";
import { ButtonPrimary, TabIcon, Loader, CustomEmptyView } from "../../common";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  getCardTopUpTrxList,
  getCardList,
  cardTransaction,
  resetCardTransaction,
} from "../../../Redux/Actions";
import * as constants from "../../../Constants";
import { EventRegister } from "react-native-event-listeners";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import SimpleHeader from "../../common/SimpleHeader";
import SelectDropdown from "react-native-select-dropdown";
import DatePicker from "react-native-date-picker";
import Moment from "moment";
import { RESET_CARD_TRX_DETAILS } from "../../../Redux/Actions/types";
const { height, width } = Dimensions.get("window");
let maxDateTime;
let paramTrx;
var date1 = new Date();
// console.log("value=-date1=www", date1);
let frmDat = Moment(date1).subtract(7, "days");
let previousState = "";
var d1 = new Date();
var d2 = new Date();
var diff = 0;
var daydiff = 0;
let actualFromDate;
let actualToDate;
const TransactionStatement = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles(ThemeManager);
  const [cardInfos, setCardInfos] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [fromDate, setfromDate] = useState("YYYY-MM-DD");
  const [toDate, setToDate] = useState("YYYY-MM-DD");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromDateSelected, setfromDateSelected] = useState(null);
  const [minimumToDate, setMinimumToDate] = useState(new Date());
  const [maxToDate, setMaxToDate] = useState(new Date());
  const [trxList, setTrxList] = useState([]);
  const [pageLimit, setPageLImit] = useState(5);
  const [pageNumberTrx, setPageNumberTrx] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const {
    cardTopUpTrxListInfo,
    cardTopUpTrxListError,
    isCardTopUpTrxListLoading,
    totalRecords,
  } = useSelector((state) => state.cardTopUpTrxListReducer);
  const {
    cardTransactionHolder,
    isCardTransactionLoading,
    cardTransactionError,
    totalRecordsTrx,
  } = useSelector((state) => state.cardTransactionReducer);
  const [moreDate, setMoreDate] = useState("value");
  const [moreDateT, setMoreDateT] = useState("value");
  const [moreDateG, setMoreDateG] = useState("false");
  const [moreDateZ, setMoreDateZ] = useState("false");

  const [theme, setTheme] = useState(Appearance.getColorScheme());
  console.log("cardTransactionHolder=-->>>", cardTransactionHolder);
  console.log("colorScheme=-=-", theme);
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log("colorScheme=-=-", colorScheme);
      setTheme(colorScheme);
    });
    const subscriptionAppState = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    dispatch(getCardList())
      .then((res) => {
        // console.log("getCardList=-====2==-->>>", res);
        // console.log("getCardList=-====2length-->>>", res.length);
        // console.log("getCardList=-====2length-->>>", res.length > 0);
        // console.log("getCardList=-====2length-->>>", res.length < 0);
        var date1 = new Date();
        let maxDate23 = Moment(date1).subtract(30, "days");
        // console.log("value=-maxDate23=www", maxDate23);

        let maxDate24 = Moment(date1).subtract(30, "days").format("YYYY-MM-DD");
        // console.log("value=-maxDate24=www", maxDate24);
        let chkMax = new Date();
        // console.log("value=-maxDate24=chkMax", chkMax);
        setMaxToDate(chkMax);
        // maxDateTime = maxDate23;
        if (res.length > 0) {
          let fromDateValue = Moment(date1)
            .subtract(7, "days")
            .format("YYYY-MM-DD");
          let toDateValue = Moment(date1).format("YYYY-MM-DD");
          setfromDate(fromDateValue);
          actualFromDate = fromDateValue;
          actualToDate = toDateValue;
          setToDate(toDateValue);

          // console.log("getCardLis=-=-+++trx details=-=-=-=-=-=");
          setCardInfos(res);
          setSelectedCard(res[0]);
          setCardNumber(res[0].card_number);
          getTransactionList(
            res[0].card_number,
            fromDateValue,
            toDateValue,
            pageLimit,
            pageNumberTrx
          );
        }
      })
      .catch((err) => {
        console.log("getCardList ++trx details err=++-=->>", err);
      });
    return () => {
      subscription.remove();
      subscriptionAppState.remove();
      dispatch(resetCardTransaction());
    };
  }, []);
  const handleAppStateChange = (nextAppState) => {
    console.log("nextAppState------++++---", nextAppState);
    if (previousState == "background" && nextAppState == "active") {
      console.log("nextAppState------++++---", nextAppState);
      setTheme(Appearance.getColorScheme());
    }
    previousState = nextAppState;
    // console.log("fgd0------++---", previousState);
  };

  const matchValue = (val) => {
    constants.statusTypoObj;
  };
  const getTransactionList = (
    card_number,
    fromDate,
    toDate,
    pageLimit,
    pageNumberTrx
  ) => {
    console.log("fromDate=-=res=-", fromDate);
    console.log("toDate=-=res=-", toDate);
    console.log("pageLimit=-=res=-", pageLimit);
    console.log("card_number=-=res=-", card_number);

    dispatch(
      cardTransaction(card_number, fromDate, toDate, pageLimit, pageNumberTrx)
    )
      .then((res) => {
        console.log("getCardTopUpTrxList=-=res=-", JSON.stringify(res));
        // let resp = JSON.parse(res.bodyString);
        // setTrxList([...res]);
      })
      .catch((err) => {
        console.log("getCardTopUpTrxList=-=-err=-", JSON.stringify(err));
      });
  };
  // const isCloseToBottomTrx = () => {
  //   let page = pageNumberTrx + 1;
  //   console.log(
  //     "cardTopUpTrxListInfo.length=-=-err=-",
  //     cardTopUpTrxListInfo.length
  //   );
  //   console.log("totalRecords.length=-=-err=-", totalRecords);

  //   // if (cardTopUpTrxListInfo.length != totalRecords) {
  //   //   paramTrx = {
  //   //     page: `${page}`,
  //   //     limit: pageLimit,
  //   //   };
  //   //   setPageNumberTrx(page);
  //   //   dispatch(
  //   //     cardTransaction(
  //   //       cardNumber,
  //   //       paramTrx.page,
  //   //       paramTrx.limit,
  //   //       pageLimit,
  //   //       pageNumberTrx
  //   //     )
  //   //   );
  //   // }
  // };
  const isCloseToBottomTrx = () => {
    console.log("cardTransactionHolder=-=-++++", cardTransactionHolder);

    let total = cardTransactionHolder.total;
    let size = total / 5;
    let page = pageNumberTrx + 5;
    // console.log("cardTransactionHolder=-=-size=-", size);
    // console.log("cardTransactionHolder=-=-page=-", page);

    // console.log(
    //   "cardTopUpTrxListInfo.length=-+++=-err=-",
    //   cardTransactionHolder.length
    // );
    // console.log(
    //   "cardTransactionHolder=-=-err=-",
    //   cardTransactionHolder?.length
    // );
    // console.log("cardTransactionHolder=-total=-", cardTransactionHolder.total);
    // console.log(
    //   "cardTransactionHolder?.tradeList.length < cardTransactionHolder.total--",
    //   cardTransactionHolder.length < totalRecordsTrx
    // );

    // console.log("totalRecords.length=-=-err=-", totalRecordsTrx);

    if (cardTransactionHolder.length < totalRecordsTrx) {
      paramTrx = {
        page: `${page}`,
        limit: pageLimit,
      };
      console.log("cardTransactionHolder=-=-page=-", page);
      console.log("cardTransactionHolder pageLimit=-", page);
      dispatch(
        cardTransaction(
          selectedCard.card_number,
          fromDate,
          toDate,
          pageLimit,
          page
        )
      );
      setPageNumberTrx(page);
    }
  };
  const getDifference = (fromDate, toDate) => {
    // console.log("fromDate=-=-=-=>>", fromDate);
    // console.log("toDate=-=-=-=>>", toDate);
    // console.log("fromDate=-=-=-=>>typeof", typeof fromDate);
    // alert(fromDate);
    // console.log("toDate=-=-=-=>typeof>", typeof toDate);
    d1 = new Date(fromDate);
    d2 = new Date(toDate);
    // console.log("d1=-=-=-=>>", d1);
    // console.log("d2=-=-=-=>>", d2);
    // console.log("d1=-=-=-typeof=>>", typeof d1);
    // console.log("d2=-=-=-typeof=>>", typeof d2);
    // console.log("d2.getTime()=-=-=-=>>", d2.getTime());
    // console.log("d1.getTime()=-=-=-=>>", d1.getTime());
    diff = d2.getTime() - d1.getTime();
    setMoreDate(diff);
    // console.log("diff=-=-=-=>>", diff);
    // console.log("diff=-=-=-=typeof>>", typeof diff);

    daydiff = diff / (1000 * 60 * 60 * 24);
    setMoreDateT(daydiff);
    // console.log("daydiff=-=-=-=>>", daydiff);
    // console.log("daydiff=-=-=typeof-=>>", typeof daydiff);
    // console.log("daydiff < 0=>>", daydiff < 0);
    // console.log("daydiff > 30=>>", daydiff > 30);
    setMoreDateZ(daydiff < 0 ? "true" : "false");
    setMoreDateG(daydiff > 30 ? "true" : "false");
    if (daydiff < 0) {
      Singleton.getInstance().showError(
        "To date must be greater than the From date "
      );
    } else if (daydiff > 30) {
      Singleton.getInstance().showError(
        "The difference between From and To date should not be more than 30 days"
      );
    } else {
      setPageNumberTrx(0);
      dispatch({ type: RESET_CARD_TRX_DETAILS });
      setTimeout(() => {
        getTransactionList(cardNumber, fromDate, toDate, 5, 0);
      }, 100);
    }
  };
  const onButtonPress = () => {
    // console.log(constants.statusTypoObj["1"]);
    //constants.statusTypoObj
    // console.log("fromDate=-=-=-=>>>", fromDate);
    // console.log("toDate=-=-=-=>>>", toDate);
    // getDifference(fromDate, toDate);
    getDifference(actualFromDate, actualToDate);
  };
  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: ThemeManager.colors.SwapInput,
          padding: 15,
          marginBottom: 8,
          borderRadius: 8,
        }}
      >
        <View
          style={[
            styles.rowStyle,
            {
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // marginBottom: 5,
            }}
          >
            <Image
              style={{
                height: 18,
                width: 18,
                resizeMode: "contain",
                tintColor: ThemeManager.colors.headerText,
              }}
              source={{ uri: Images.topUpIcon }}
            />
            <Text
              style={[
                styles.recentText,
                {
                  color: ThemeManager.colors.headerText,
                  textAlign: "right",
                  marginLeft: 10,
                  fontSize: 14,
                  fontFamily: Fonts.medium,
                },
              ]}
            >
              {item.businessDate}
              {/* {Moment(item.created_at).format("DD-MM-YY hh:mm:ss")} */}
            </Text>
          </View>
          <Text
            style={[
              styles.recentText,
              {
                color: ThemeManager.colors.textColor,
                fontSize: 16,
                fontFamily: Fonts.medium,
                textAlign: "right",
                marginLeft: 10,
              },
            ]}
          >
            {parseFloat(item.amount).toFixed(2)} {item.currency}
          </Text>
        </View>
        <View
          style={[
            styles.rowStyle,
            {
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            },
          ]}
        >
          <Text
            style={[
              styles.recentText,
              {
                fontSize: 14,
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.headerText,
                // lineHeight: 20,
              },
            ]}
          >
            {strings.cardScreen.tradeId}:{" "}
            <Text
              style={[
                {
                  color: ThemeManager.colors.textColor,
                },
              ]}
            >
              {item.tradeId}
            </Text>
          </Text>
          <Text
            style={[
              styles.recentText,
              {
                color: item.tradeStatus
                  ? ThemeManager.colors.btnGreenColor
                  : ThemeManager.colors.headerText,
                textAlign: "right",
                textTransform: "capitalize",
              },
            ]}
          >
            {item.tradeStatus ? "Success" : "Failed"}
          </Text>
        </View>
        <View
          style={[
            styles.rowStyle,
            {
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            },
          ]}
        >
          <Text
            style={[
              styles.recentText,
              {
                fontSize: 14,
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.headerText,
                lineHeight: 20,
              },
            ]}
          >
            {strings.cardScreen.tradeType}:{" "}
            <Text
              style={[
                {
                  color: ThemeManager.colors.textColor,
                },
              ]}
            >
              {constants.statusTypoObj[item.tradeType]}
            </Text>
          </Text>
        </View>
      </View>
    );
  };
  const renderDatePicker = () => {
    var date1 = new Date();

    return (
      <>
        {fromDateSelected ? (
          <DatePicker
            modal
            fadeToColor="white"
            textColor={theme == "dark" ? "white" : "black"}
            open={showDatePicker}
            mode="date"
            date={date1}
            maximumDate={date1}
            // theme={ThemeManager.colors.themeColor === "dark" ? "dark" : "light"}
            theme={theme}
            // textColor={ThemeManager.colors.textColor1}

            onConfirm={(date) => {
              date1 = date;
              let value = Moment(date).format("YYYY-MM-DD");
              console.log("value=-=", value);
              // let newMaxDate = new Date(
              //   Date.parse(
              //     Moment().add(30, "days").format("ddd MMM DD YYYY HH:mm:ss ZZ")
              //   )
              // );
              let maxDate = Moment(date).add(30, "days");
              let maxDate1 = Moment(date).add(30, "days").format("YYYY-MM-DD");
              console.log();
              console.log("value=-maxDate=www", maxDate1);
              console.log("value=-minimumDate=date", date);
              console.log("value=-maxDate=", maxDate);
              let chkMax1 = new Date(maxDate1);
              console.log("value=-maxDate24=chkMax", chkMax1);
              setfromDate(value);
              actualFromDate = value;
              setMinimumToDate(date);
              setMaxToDate(chkMax1);
              // maxDateTime = maxDate;
              setShowDatePicker(false);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
          />
        ) : (
          <DatePicker
            modal
            fadeToColor="white"
            textColor={theme == "dark" ? "white" : "black"}
            open={showDatePicker}
            mode="date"
            date={minimumToDate}
            maximumDate={maxToDate}
            minimumDate={minimumToDate}
            // theme={ThemeManager.colors.themeColor === "dark" ? "dark" : "light"}
            theme={theme}
            // theme={"dark"}
            // textColor={ThemeManager.colors.textColor1}
            // textColor={colors.black}
            onConfirm={(date) => {
              console.log("fromDtae=-=-=-", fromDate);
              let value = Moment(date).format("YYYY-MM-DD");
              setToDate(value);

              actualToDate = value;
              console.log("value=-wwww=", value);
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
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.DashboardBG },
      ]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
    >
      <View
        style={{ marginHorizontal: 16, marginBottom: 15, marginVertical: 10 }}
      >
        <SimpleHeader
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>
      <Loader isLoading={isCardTransactionLoading} />
      {/* <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        contentContainerStyle={{ flex: 1 }}
      > */}
      <ScrollView bounces={false}>
        <View style={{ marginHorizontal: 10, marginVertical: 15 }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor,
            }}
          >
            {strings.cardScreen.transaction_statement}
          </Text>
          <View
            style={{
              justifyContent: "center",
              // marginHorizontal: 15,
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: Fonts.regular,
                marginTop: 10,
              }}
            >
              {strings.cardScreen.select_card}
            </Text>
            <View>
              <SelectDropdown
                key={"first"}
                data={cardInfos}
                dropdownOverlayColor={"transparent"}
                defaultValueByIndex={selectedCardIndex}
                onSelect={(selectedItem, index) => {
                  console.log("selectedItem=-=www-=", selectedItem);
                  console.log("selectedItem=-=indexwwww-=", index);
                  setSelectedCard(selectedItem);
                  setSelectedCardIndex(index);
                  // onSelect(selectedItem, index);
                }}
                // selectedIndex={genderIndex}
                // buttonStyle={styles.dropdown3BtnStyle}
                buttonStyle={{
                  // width: "100%",
                  width: "100%",
                  borderRadius: 6,
                  height: 50,
                  marginBottom: 10,
                  backgroundColor: ThemeManager.colors.tabBackground,
                  // backgroundColor: "red",
                }}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  console.log("selectedItem=-=www+++-=-", selectedItem);
                  console.log("selectedItem=-++www+-index", index);
                  console.log("selectedItem=-=-++=-111", selectedCard);

                  return (
                    <View style={[styles.dropdown3BtnChildStyle]}>
                      <Text
                        style={[
                          styles.dropdown3BtnTxt,
                          {
                            color: ThemeManager.colors.textColor1,
                            textTransform: "capitalize",
                            fontFamily: Fonts.regular,
                            marginLeft: 5,
                          },
                        ]}
                      >
                        {selectedItem
                          ? selectedItem.card_number
                          : selectedCard.card_number}
                      </Text>

                      <Image
                        source={{ uri: Images.icon_dropDown }}
                        style={{
                          height: 15,
                          width: 15,
                          resizeMode: "contain",
                          tintColor: ThemeManager.colors.textColor1,
                          marginRight: 8,
                        }}
                      />
                    </View>
                  );
                }}
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
                                selectedCardIndex === index
                                  ? ThemeManager.colors.selectedTextColor
                                  : ThemeManager.colors.textColor1,
                              fontFamily: Fonts.regular,
                              textTransform: "capitalize",
                            },
                          ]}
                        >
                          {item?.card_number}
                        </Text>
                      </View>
                    </>
                  );
                }}
              />
            </View>

            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <View style={{ width: "48%" }}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {strings.cardScreen.transaction_from_date}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setfromDateSelected(true);
                    setShowDatePicker(true);
                  }}
                  style={{
                    marginTop: 5,
                    height: 50,
                    backgroundColor: ThemeManager.colors.SwapInput,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    borderRadius: 6,
                  }}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
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
                        uri: Images.icon_calender,
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                        marginRight: 8,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ width: "48%" }}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {strings.cardScreen.to_date}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setfromDateSelected(false);
                    setShowDatePicker(true);
                  }}
                  style={{
                    marginTop: 5,
                    height: 50,
                    backgroundColor: ThemeManager.colors.SwapInput,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    borderRadius: 6,
                  }}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
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
                        uri: Images.icon_calender,
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                        marginRight: 8,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <ButtonPrimary
              style={{ marginVertical: 15, width: "100%", marginLeft: 0 }}
              title={strings.cardScreen.view_detailed_statement}
              onPress={() => {
                onButtonPress();
              }}
            />
            <View style={{ height: height }}>
              <FlatList
                nestedScrollEnabled
                keyboardShouldPersistTaps={"handled"}
                data={cardTransactionHolder}
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 5, height: height }}
                bounces={false}
                // contentContainerStyle={{height: height - 80}}
                // contentContainerStyle={{ flexGrow: 1 }}
                onEndReachedThreshold={0.1}
                // extraData={cardTransactionHolder}
                onEndReached={isCloseToBottomTrx}
                ListEmptyComponent={() => {
                  return (
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
                  );
                }}
                // onEndReached={isCloseToBottomTrade}
                scrollEnabled={true}
                renderItem={renderItem}
                ListFooterComponent={() => {
                  return <View style={{ height: 15 }}></View>;
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* </KeyboardAwareScrollView> */}
      {renderDatePicker()}
    </Wrap>
  );
};

export default TransactionStatement;

const useStyles = (theme) =>
  StyleSheet.create({
    mainContainer: { flex: 1, marginTop: 20, marginHorizontal: 15 },
    dropdown3BtnChildStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    dropdown3BtnTxt: {
      textAlign: "center",
      fontSize: 14,
      marginHorizontal: 2,
    },

    dropdown3RowChildStyle: {
      flex: 1,

      justifyContent: "center",
      alignItems: "flex-start",

      paddingHorizontal: 15,
    },

    dropdown3RowTxt: {
      textAlign: "center",
      fontSize: 14,
      marginHorizontal: 12,
    },
    recentView: {
      backgroundColor: theme.colors.tabBackground,
      padding: 15,
      marginTop: 10,
      // borderRadius: 6,
    },
    rowStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    recentText: {
      color: theme.colors.textColor,
      fontSize: 14,
      fontFamily: Fonts.regular,
    },
  });
