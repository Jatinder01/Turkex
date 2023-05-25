import { StyleSheet } from "react-native";
import { Fonts, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import { ThemeManager } from "../../../../ThemeManager";

const useStyles = (theme) =>
  StyleSheet.create({
    navBarUnderlineBg: {
      backgroundColor: colors.white,
      width: "0%",
    },
    tabsWrap: {
      borderRadius: 15,
      height: 30,
      paddingHorizontal: 15,
      elevation: 0,
      borderBottomWidth: 0,
    },
    navBarBg: {
      backgroundColor: colors.white,
      borderRadius: 15,
      elevation: 0,
    },
    navBarActiveBg: {
      borderRadius: 2,
    },
    pagerView: {
      flex: 1,
    },
    inputRow: {
      marginHorizontal: 16,
      marginTop: 20,
    },
    inputTitle: {
      marginBottom: 6,
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.colors.dashboardItemTextColor,
      marginHorizontal: 16,
      marginTop: 20,
    },
    viewPasswordImage: {
      height: 12,
      width: 17.5,
      alignSelf: "center",
    },
    title: {
      marginTop: 20,
      marginHorizontal: 16,
      color: theme.colors.textColor,
      fontFamily: fonts.medium,
      fontSize: 22,
    },
    subTitle: {
      marginTop: 8,
      marginHorizontal: 16,
      color: theme.colors.dashboardItemTextColor,
      fontFamily: fonts.regular,
      fontSize: 14,
    },
    note: {
      marginBottom: 6,
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.appRed,
      marginHorizontal: 16,
      marginTop: 20,
    },
    modelContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#00000050",
    },
    errorMessageStyle: {
      fontSize: 15,
      color: "red",
      alignSelf: "center",
    },
    msgContainer: {
      backgroundColor: theme.colors.modalBox,
      marginHorizontal: 15,
      borderRadius: 8,
      paddingHorizontal: 15,
    },
    cautionIcon: {
      height: 50,
      width: 50,
      resizeMode: "contain",
      alignSelf: "center",
      marginVertical: 15,
      tintColor: theme.colors.selectedTextColor,
    },
    impText: {
      alignSelf: "center",
      textAlign: "center",
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: theme.colors.textColor1,
    },
    alertText: {
      alignSelf: "center",
      textAlign: "center",
      fontSize: 14,
      marginTop: 10,
      fontFamily: Fonts.light,
      color: theme.colors.textColor1,
    },
    rowStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 15,
    },
    cancelBtn: {
      backgroundColor: theme.colors.tabBackground,
      justifyContent: "center",
      alignItems: "center",
      height: 40,
      flex: 1,
      marginRight: 5,
      borderRadius: 5,
    },
    cancelText: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: theme.colors.textColor1,
    },
    continueBtn: {
      backgroundColor: theme.colors.selectedTextColor,
      justifyContent: "center",
      alignItems: "center",
      height: 40,
      marginLeft: 5,
      borderRadius: 5,
      flex: 1,
    },
    continueText: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: theme.colors.textColor,
    },
  });
export default useStyles;
