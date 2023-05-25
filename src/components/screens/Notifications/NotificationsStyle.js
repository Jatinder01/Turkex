import { StyleSheet } from "react-native";
import fonts from "../../../theme/fonts";
import { colors, Fonts } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";

const useStyles = (theme) =>
  StyleSheet.create({
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
      tintColor: theme.colors.textColor,
      resizeMode: "contain",
    },
    modeIcon: {
      width: 23,
      height: 23,
      right: 32,
      tintColor: theme.colors.textColor,
      resizeMode: "contain",
    },
    viewMainContainer: {
      paddingHorizontal: 10,
      // borderRadius: 10,
      // borderWidth: 1,
      margin: 8,
      paddingVertical: 10,
      // borderColor: colors.greyTxt,
      flexDirection: "row",
    },
    headStyle: {
      fontFamily: Fonts.bold,
      fontSize: 16,
      fontWeight: "700",
      // fontWeight: '100',
    },
    textStyle: {
      fontFamily: Fonts.medium,
      fontSize: 13,
      fontWeight: "500",
    },
    titleStyle: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: theme.colors.inactiveTextColor,
      marginTop: 20,
    },
    valueStyle: {
      fontSize: 16,
      fontFamily: Fonts.regular,

      textTransform: "uppercase",
      marginTop: 5,
    },
    verticalMargin: { marginTop: 10, marginBottom: 40 },
    crossIcon: { height: 20, width: 20, resizeMode: "contain" },
    crossButton: {
      height: 30,
      width: 30,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    withdrawText: {
      fontSize: 18,
      color: theme.colors.textColor,
      fontFamily: Fonts.medium,
    },
    withdrawView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    viewStyle: {
      marginTop: 20,
      width: "100%",
    },
    withdrawViewStyle: {
      backgroundColor: theme.colors.DashboardBG,
      paddingHorizontal: 20,
      flex: 1,
    },
    withdrawSubContainer: {
      // backgroundColor: "rgba(255,255,255,0.1)",
      flex: 1,
      justifyContent: "center",
    },
    notFound: {
      color: theme.colors.textColor1,
      fontFamily: Fonts.regular,
      fontSize: 16,
    },
    emptyView: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 200,
      flexGrow: 1,
    },
    unreadView: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.selectedTextColor,
      marginRight: 10,
    },
    readView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    readContainer: { width: "90%", paddingHorizontal: 10 },
    notificationText: {
      marginHorizontal: 16,
      fontFamily: Fonts.medium,
      fontSize: 22,
      color: theme.colors.textColor1,
    },
    headerStyle: { marginHorizontal: 16, marginBottom: 15, marginVertical: 10 },
    bgColor: { backgroundColor: ThemeManager.colors.bgDarkwhite },
  });
export default useStyles;
