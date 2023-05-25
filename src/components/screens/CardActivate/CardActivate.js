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
} from "react-native";
// import styles from './AboutUsStyle';
import { Wrap } from "../../common/Wrap";
import { Header } from "../../common";
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
let android_app_url =
  "https://play.google.com/store/apps/details?id=com.xchangemonster";
let ios_app_url = "https://apps.apple.com/in/app/xchange-monster/id1621071750";
const CardActivate = () => {
  const styles = useStyles(ThemeManager);
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  return (
    <Wrap
      style={styles.bgColor}
      screenStyle={styles.bgColor}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={styles.bgColor}
    >
      <View style={styles.headerView}>
        <SimpleHeader
          titleName={strings.cardScreen.your_card}
          backImageColor={styles.headIconColor}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <ScrollView bounces={false}></ScrollView>
      </View>
    </Wrap>
  );
};

export default CardActivate;
const useStyles = (theme) =>
  StyleSheet.create({
    bgColor: { backgroundColor: ThemeManager.colors.DashboardBG },
    headIconColor: { tintColor: ThemeManager.colors.headTxt },
    viewPasswordImage: {
      height: 16,
      width: 16,
      resizeMode: "center",
    },
    userInfoView: {
      flexDirection: "row",
      alignContent: "center",
      marginVertical: 20,
      justifyContent: "space-between",
      paddingLeft: 16,
    },
    rowFlex: { flexDirection: "row" },
    emailPhonetext: {
      fontSize: 18,
      fontFamily: fonts.regular,
    },
    viewEmailPhone: {
      left: 4,
      alignSelf: "center",
      top: 6,
    },
    IdText: {
      fontSize: 14,
      fontFamily: fonts.regular,
    },
    verifiedView: {
      flexDirection: "row",
      backgroundColor: colors.buttonBgColor,
      alignContent: "center",
      alignItems: "center",
      padding: 6,
      borderBottomLeftRadius: 15,
      borderTopLeftRadius: 15,
      height: 30,
    },
    verifiedImage: { marginLeft: 10, marginRight: 6, height: 18, width: 15 },
    verifiedText: {
      fontSize: 14,
      fontFamily: fonts.regular,
      color: colors.white,
    },
    infoView: {
      marginHorizontal: 16,
      marginVertical: 15,
      height: 60,
      backgroundColor: colors.white,
      alignItems: "center",
      paddingLeft: 15,
      flexDirection: "row",
    },
    customRightImage: {
      width: 12,
      height: 12,
      right: 32,
      // tintColor: theme.colors.textColor,
      resizeMode: "contain",
    },
    modeIcon: {
      width: 23,
      height: 23,
      right: 32,
      tintColor: theme.colors.textColor,
      resizeMode: "contain",
    },
    logoImageStyle: {
      height: 140,
      width: 140,
      resizeMode: "contain",
      marginTop: 5,
      marginBottom: 15,
    },
    mainViewStyle: {
      flex: 1,
      backgroundColor: theme.colors.DashboardBG,
      justifyContent: "space-between",
    },
    headerView: { marginHorizontal: 15, marginVertical: 10, height: 45 },
    headerTextStyle: { fontSize: 16, fontFamily: fonts.regular },
  });
