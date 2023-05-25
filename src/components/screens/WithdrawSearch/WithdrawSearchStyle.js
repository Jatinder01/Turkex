import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts } from "../../../theme";
const useStyles = (theme) =>
  StyleSheet.create({
    screenStyle: {
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 20,
      marginHorizontal: 20,
    },
    searchView: {
      backgroundColor: theme.colors.tabBackground,
      // backgroundColor: ThemeManager.colors.tabBackground
      borderRadius: 20,
      height: 40,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      flex: 1,
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
      color: theme.colors.Depositbtn,
      marginLeft: 10,
    },
    viewContainer: {
      justifyContent: "space-between",
      flex: 1,
      alignItems: "flex-start",
      flexDirection: "row",
      // marginBottom: 28,
      marginVertical: 14,
      marginHorizontal: 20,
    },
    indexStyle: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: theme.colors.inactiveTextColor,
      // marginLeft: 10,
    },
    activeTextStyle: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: theme.colors.textColor,
      marginLeft: 10,
    },
    inactiveTextStyle: {
      fontFamily: Fonts.regular,
      fontSize: 12,
      marginLeft: 10,
      color: theme.colors.inactiveTextColor,
    },
    flexStart: {
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
    },
    xStyle: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: theme.colors.selectedTextColor,
      marginLeft: 10,
    },
    fluctuateText: {
      fontSize: 13,
      fontFamily: Fonts.regular,
      color: theme.colors.textGreenColor,
    },
    valueText: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: theme.colors.textColor,
    },
    bgColor: { backgroundColor: theme.colors.DashboardBG },
    searchInput: { width: "80%", color: theme.colors.textColor1 },
    topSearchView: { alignItems: "flex-start", marginLeft: 15 },
    topSearch: { marginRight: 10, marginTop: 20 },
    listView: {
      flex: 1,
      backgroundColor: theme.colors.dashboardSubViewBg,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 20,
    },
    listContainer: {
      flexGrow: 1,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    iconStyle: {
      height: 20,
      width: 20,
      resizeMode: "contain",
    },
    nameView: {
      backgroundColor: theme.colors.Depositbtn,
      height: 20,
      width: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    nameTextStyle: {
      fontSize: 16,
      fontFamily: Fonts.bold,
      textAlign: "center",
      marginTop: -2,
      color: theme.colors.textColor1,
    },
    emptyView: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 90,
    },
    noRecordText: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: theme.colors.inactiveTextColor,
    },
  });
export default useStyles;
