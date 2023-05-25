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
    mainContainer: {
      flex: 1,
      // backgroundColor: ThemeManager.colors.DashboardBG,
    },
    subContainer: { flex: 1, backgroundColor: theme.colors.DashboardBG },
    header: { marginHorizontal: 20, height: 40, marginBottom: 10 },
    headerTitle: {
      fontSize: 18,
      fontFamily: Fonts.medium,
      color: theme.colors.textColor1,
      // marginLeft: 10,
    },
    backImageStyle: { tintColor: theme.colors.headTxt },
    topTextStyle: {
      marginHorizontal: 16,
      fontFamily: Fonts.medium,
      fontSize: 22,
      color: theme.colors.textColor1,
      marginBottom: 20,
    },
    listStyle: { marginHorizontal: 16, marginVertical: 10 },
    rowBtn: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    titleTextStyle: {
      fontFamily: Fonts.regular,
      fontSize: 16,
      color: theme.colors.textColor1,
    },
    selectedIcon: {
      width: 20,
      height: 16,
      resizeMode: "contain",
      tintColor: theme.colors.selectedTextColor,
    },
    subStyle: {
      marginTop: 4,
      fontFamily: Fonts.light,
      fontSize: 14,
      color: colors.dashboarItemLightText,
    },
  });
export default useStyles;
