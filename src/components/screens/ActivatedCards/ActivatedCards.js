/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
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
  ImageBackground,
} from "react-native";
// import styles from './AboutUsStyle';
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, Header, Loader } from "../../common";
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
  getCardHolderDetails,
  getProfile1,
  getCardList,
} from "../../../Redux/Actions";

let android_app_url =
  "https://play.google.com/store/apps/details?id=com.xchangemonster";
let ios_app_url = "https://apps.apple.com/in/app/xchange-monster/id1621071750";

const ManageView = ({ icon, text, viewStyle }) => {
  const styles = useStyles(ThemeManager);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: ThemeManager.colors.tabBackground,
        flex: 1,
      }}
    >
      <View
        style={[
          styles.recentView,
          {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 0,
          },
          viewStyle,
        ]}
      >
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: "contain",
            tintColor: ThemeManager.colors.textColor,
            marginRight: 10,
          }}
          source={{ uri: icon }}
        />
        <Text
          style={[styles.recentText, { color: ThemeManager.colors.headerText }]}
        >
          {text}
        </Text>
      </View>
      <Image
        source={{ uri: ThemeManager.ImageIcons.icon_forward }}
        style={{
          height: 20,
          width: 20,
          resizeMode: "contain",
          marginRight: 15,
        }}
      />
    </View>
  );
};
const ActivatedCards = (props) => {
  const dispatch = useDispatch();

  const styles = useStyles(ThemeManager);
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  // const { cardActivateInfo, cardActivateError, isCardActivateLoading } =
  //   useSelector((state) => state.cardActivatePaytendReducer);
  // const { isCardBindLoading, cardBindError, cardBindInfo } = useSelector(
  //   (state) => state.cardBindReducer
  // );
  const { cardListInfo, cardListError, isCardListLoading } = useSelector(
    (state) => state.cardListReducer
  );
  const [cardInfos, setCardInfos] = useState([]);
  // console.log("cardActivateInfo=-=-=>>>", cardActivateInfo);
  // console.log("cardListInfo=-=-=>>>", cardListInfo);

  // const [modalVisible, setModalVisible] = useState(true);
  const [myCardsToggle, setMyCardsToggle] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loader, setLoader] = useState(true);
  const onButtonPress = () => {
    Actions.currentScene != "CardAddFunds" && Actions.push("CardAddFunds");
  };
  useEffect(() => {
    dispatch(getProfile1())
      .then((res) => {
        console.log("getProfile1=-=-=-=>>>2277>", res);
        getUserData();
        getCardListDetails();
      })
      .catch((err) => {
        console.log("error=-=-=-=>>>>", err);
      });
    props.navigation.addListener("didFocus", () => {
      dispatch(getProfile1())
        .then((res) => {
          console.log("getProfile1=-=-=-=>>>22000>", res);
          getUserData();
          getCardListDetails();
        })
        .catch((err) => {
          console.log("error=-=-=-=>>>>", err);
        });
    });
    // dispatch(getCardHolderDetails())
    //   .then((res) => {
    //     console.log("getCardHolderDetails-==---->>", res);
    //   })
    //   .catch((err) => {
    //     console.log("getCardHolderDetails=-=err=-=>>", err);
    //   });
    return () => {
      // cleanup
    };
  }, []);
  const getCardListDetails = () => {
    dispatch(getCardList())
      .then((res) => {
        console.log("getCardList=-=++--->>>", res);
        console.log("getCardList=-=++-length-->>>", res?.length);
        if (res?.length > 0) {
          setCardInfos(res);
        }
      })
      .catch((err) => {
        console.log("getCardList err=++-=->>", err);
      });
  };
  const getUserData = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        console.log("USER_DATA=-=-=-=-=---->>", res);
        if (res != null && JSON.parse(res)?.profiles != null) {
          let uData = JSON.parse(res);

          if (JSON.parse(res)?.profiles[0]?.gender != null) {
            setUserInfo(JSON.parse(res)?.profiles[0]);

            setLoader(false);
          } else {
            setProfileCompleted(false);
            setLoader(false);
          }

          setLoader(false);
        } else {
          setLoader(false);
        }
      });
  };
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[{ backgroundColor: ThemeManager.colors.DashboardBG }]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
    >
      <Loader isLoading={isCardListLoading} />
      <View style={styles.headerView}>
        <SimpleHeader
          titleName={strings.cardScreen.your_card}
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <View style={styles.topContainer}>
        <ScrollView bounces={false}>
          <View style={styles.subViewStyle}>
            <View
              style={[
                styles.cardImgStyle,
                { borderRadius: 6, overflow: "hidden" },
              ]}
            >
              <ImageBackground
                source={{ uri: Images.cardBackground }}
                style={styles.cardImgStyle}
              >
                <View
                  style={{
                    marginHorizontal: 20,
                    // justifyContent: "space-between",
                    // alignItems: "flex-start",
                    // flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      // justifyContent: "space-between",
                      justifyContent: "flex-start",
                      // flexDirection: "row",
                      alignItems: "flex-start",
                      marginTop: 13,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Image
                        source={{ uri: Images.icon_card_logo }}
                        style={{ height: 30, width: 30, resizeMode: "contain" }}
                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: Fonts.regular,
                            color: colors.white,
                          }}
                        >
                          {strings.cardScreen.balance}
                        </Text>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: Fonts.medium,
                            color: colors.white,
                            lineHeight: 26,
                          }}
                        >
                          {cardInfos?.length > 0 && cardInfos[0]?.balance}
                          {"EUR"}
                        </Text>
                      </View>
                    </View>

                    {/* <Image
                      source={{ uri: Images.icon_card_setting }}
                      style={{ height: 30, width: 30, resizeMode: "contain" }}
                    /> */}
                  </View>
                  <View style={{ marginTop: 6 }}>
                    <Text
                      style={{
                        fontFamily: Fonts.bold,
                        fontSize: 17,
                        color: "white",
                        letterSpacing: 1.8,
                      }}
                    >
                      {cardInfos?.length > 0 &&
                        cardInfos[0]?.card_number?.match(/(\d{4})/g).join("  ")}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: 5,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          {strings.cardScreen.valid_upto}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.medium,
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          XX/XX
                        </Text>
                      </View>
                      {/* <View style={{ marginLeft: 50 }}>
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          {strings.cardScreen.cvv}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.medium,
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          XXX
                        </Text>
                      </View>
                     */}
                    </View>
                  </View>
                  {/* <Image
                    source={{ uri: Images.icon_masterCard }}
                    style={{ height: 40, width: 40, resizeMode: "contain" }}
                  /> */}
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    flexDirection: "row",
                    marginHorizontal: 20,
                    position: "absolute",
                    bottom: 10,
                    width: "90%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 16,
                      color: "white",
                    }}
                  >
                    {userInfo?.first_name} {userInfo?.last_name}
                  </Text>
                  <Image
                    source={{ uri: Images.icon_masterCard }}
                    style={{ height: 30, width: 40, resizeMode: "contain" }}
                  />
                </View>
              </ImageBackground>
            </View>
            <TouchableOpacity
              onPress={() => {
                setMyCardsToggle(!myCardsToggle);
              }}
              style={[
                styles.recentView,
                {
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  borderBottomLeftRadius: myCardsToggle ? 0 : 6,
                  borderBottomRightRadius: myCardsToggle ? 0 : 6,
                },
              ]}
            >
              <View style={styles.rowStyle}>
                <Text style={styles.recentText}>
                  {strings.cardScreen.manage_my_card}
                </Text>
                <Image
                  style={{ height: 18, width: 18, resizeMode: "contain" }}
                  source={{ uri: ThemeManager.ImageIcons.icon_down }}
                />
              </View>
            </TouchableOpacity>
            {myCardsToggle && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setMyCardsToggle(true);
                  }}
                >
                  <ManageView
                    icon={ThemeManager.ImageIcons.view_pin}
                    viewStyle={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                    }}
                    text={strings.cardScreen.replace_card}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setMyCardsToggle(true);
                  }}
                >
                  <ManageView
                    icon={ThemeManager.ImageIcons.view_pin}
                    viewStyle={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                    }}
                    text={strings.cardScreen.password_retrieval}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMyCardsToggle(true);
                  }}
                >
                  <ManageView
                    icon={ThemeManager.ImageIcons.view_pin}
                    viewStyle={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                    }}
                    text={strings.cardScreen.block_report_lost_card}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMyCardsToggle(true);
                  }}
                >
                  <ManageView
                    icon={ThemeManager.ImageIcons.view_pin}
                    viewStyle={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                    }}
                    text={strings.cardScreen.unblock_card}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMyCardsToggle(true);
                  }}
                >
                  <ManageView
                    icon={ThemeManager.ImageIcons.view_pin}
                    viewStyle={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                    }}
                    text={strings.cardScreen.view_card_limit}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMyCardsToggle(true);
                  }}
                >
                  <ManageView
                    icon={ThemeManager.ImageIcons.view_pin}
                    viewStyle={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                      borderBottomLeftRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                    text={strings.cardScreen.view_atm_limit}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => {
                    setMyCardsToggle(true);
                  }}
                  style={[
                    styles.recentView,
                    {
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                    },
                  ]}
                >
                  <Image
                    style={{
                      height: 18,
                      width: 18,
                      resizeMode: "contain",
                      tintColor: ThemeManager.colors.textColor,
                      marginRight: 10,
                    }}
                    source={{ uri: ThemeManager.ImageIcons.view_pin }}
                  />
                  <Text
                    style={[
                      styles.recentText,
                      { color: ThemeManager.colors.headerText },
                    ]}
                  >
                    {strings.cardScreen.view_pin}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => {
                  //   setMyCardsToggle(!myCardsToggle);
                  // }}
                  style={[
                    styles.recentView,
                    {
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 0,
                    },
                  ]}
                >
                  <Image
                    style={{
                      height: 18,
                      width: 18,
                      resizeMode: "contain",
                      tintColor: ThemeManager.colors.textColor,
                      marginRight: 10,
                    }}
                    source={{ uri: ThemeManager.ImageIcons.freeze_card }}
                  />
                  <Text
                    style={[
                      styles.recentText,
                      { color: ThemeManager.colors.headerText },
                    ]}
                  >
                    {strings.cardScreen.freeze_card}
                  </Text>
                </TouchableOpacity> */}
              </>
            )}
            <View style={styles.recentView}>
              <View style={styles.rowStyle}>
                <Text style={styles.recentText}>
                  {strings.cardScreen.recent_activity}
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 14,
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.medium,
                    }}
                  >
                    {strings.cardScreen.view_all}
                  </Text>
                </TouchableOpacity>
                {/* <Image
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                  source={{ uri: Images.icon_refresh_dark }}
                /> */}
              </View>
              <View style={[styles.rowStyle, { alignItems: "flex-start" }]}>
                <View
                  style={[
                    styles.rowStyle,
                    { justifyContent: "flex-start", marginTop: 30 },
                  ]}
                >
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                      marginRight: 10,
                    }}
                    source={{ uri: Images.icon_plus_color }}
                  />
                  <Text style={styles.recentText}>
                    {strings.cardScreen.recent_activity}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.recentText,
                      { marginTop: 30, color: ThemeManager.colors.btnColor3 },
                    ]}
                  >
                    {strings.cardScreen.recent_activity}
                  </Text>
                  <Text
                    style={[
                      styles.recentText,
                      {
                        color: ThemeManager.colors.headerText,
                        textAlign: "right",
                      },
                    ]}
                  >
                    2 Mins {strings.cardScreen.ago}
                  </Text>
                </View>
              </View>
            </View>
            {/* <Text
              style={[
                styles.recentText,
                { marginTop: 30, color: ThemeManager.colors.headerText },
              ]}
            >
              {strings.cardScreen.you_accept_the_terms}
            </Text> */}
          </View>
        </ScrollView>
      </View>
      <ButtonPrimary
        style={{ marginBottom: 50 }}
        title={strings.cardScreen.add_funds}
        onPress={() => {
          onButtonPress();
        }}
      />
    </Wrap>
  );
};

export default ActivatedCards;
const useStyles = (theme) =>
  StyleSheet.create({
    headerView: { marginHorizontal: 15, marginVertical: 10, height: 45 },
    headerTextStyle: { fontSize: 16, fontFamily: fonts.regular },
    topContainer: { justifyContent: "space-between", flex: 1 },
    subViewStyle: { marginHorizontal: 15, marginBottom: 10 },
    cautionViewStyle: {
      backgroundColor: theme.colors.tabBackground,
      padding: 10,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 6,
    },
    cautionImgStyle: { height: 15, width: 15, resizeMode: "contain" },
    cautionText: {
      fontFamily: Fonts.regular,
      color: theme.colors.headerText,
      fontSize: 12,
      marginLeft: 10,
    },
    cardImgStyle: {
      height: 180,
      width: "100%",
      resizeMode: "cover",
      borderRadius: 6,
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
