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
      color: ThemeManager.colors.textColor,
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
    screenStyle: {
      flex: 1,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 20,
      marginHorizontal: 20,
    },
    searchView: {
      backgroundColor: theme.colors.inputColor,
      borderRadius: 20,
      height: 40,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      flex: 1,
    },
    errorMessageStyle: {
      fontSize: 15,
      color: "red",
      alignSelf: "center",
      margin: 10,
    },

    searchIcon: {
      height: 20,
      width: 20,
      resizeMode: "contain",
      padding: 5,
      marginHorizontal: 10,
    },
    cancelText: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: theme.colors.selectedTextColor,
      marginLeft: 10,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#2c3e50",
    },

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
    viewStyle: { marginHorizontal: 20, height: 40, marginBottom: 15 },
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.DashboardBG,
    },
    titleStyles: {
      fontSize: 18,
      fontFamily: Fonts.medium,
      color: theme.colors.textColor,
      // marginLeft: 10,
    },
    subContainer: { justifyContent: "space-between", flex: 1 },
  });
export default useStyles;
