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
    textStyle: {
      fontSize: 16,
      fontFamily: Fonts.regular,
    },
    pagerView: {
      flex: 1,
      backgroundColor: "red",
    },
    dropdown3BtnStyle: {
      width: "100%",
      height: 30,
      backgroundColor: theme.colors.tabBackground,
      paddingHorizontal: 0,
      // borderWidth: 1,
      borderRadius: 6,
      // borderColor: '#444',
    },
    dropdown3BtnChildStyle: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    dropdown3BtnImage: { width: 45, height: 45, resizeMode: "cover" },
    dropdown3DropdownStyle: {
      backgroundColor: theme.colors.tabBackground,
    },
    dropdown3RowStyle: {
      backgroundColor: theme.colors.tabBackground,
      // borderBottomColor: "#444",
      borderBottomColor: "red",

      // height: 40,
    },

    dropdown3BtnTxt: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 15,
      marginHorizontal: 12,
    },
    dropdown4BtnTxt: {
      color: theme.colors.headerText,
      textAlign: "center",
      // fontWeight: 'bold',
      fontSize: 12,
      // marginHorizontal: 12,
    },
    dropdown3RowChildStyle: {
      flex: 1,
      // flexDirection: 'row',
      // justifyContent: 'flex-start',
      justifyContent: "center",
      alignItems: "center",
      // paddingHorizontal: 18,
    },
    dropdownRowImage: { width: 45, height: 45, resizeMode: "cover" },
    dropdown3RowTxt: {
      color: theme.colors.textColor,
      textAlign: "center",
      // fontWeight: 'bold',
      fontSize: 15,
      fontFamily: Fonts.medium,
      marginHorizontal: 12,
    },
    dropdown4RowTxt: {
      color: theme.colors.textColor,
      // textAlign: 'center',
      // fontWeight: 'bold',
      fontSize: 12,
      fontFamily: Fonts.medium,
      // marginHorizontal: 12,
    },
    // screenStyle: {
    //   flex: 1,
    // },
    scrollBar: {
      flexGrow: 1,
    },
    textStyle: {
      fontSize: 16,
      fontFamily: Fonts.regular,
    },
    tabTextStyle: {
      textAlign: "center",
      color: theme.colors.textColor,
      fontSize: 11,
      paddingTop: 8,
      marginTop: 20,
      height: 30,
      width: 60,
      overflow: "hidden",
    },
    tabStyle: {
      backgroundColor: theme.colors.inactiveTextColor,
      height: 30,
      bottom: 0,
      zIndex: -1,
      borderRadius: 4,
    },
    containerColor: { backgroundColor: theme.colors.bgDarkwhite },
    searchView: {
      backgroundColor: theme.colors.dashboardSearchBarBg,
    },
    favText: {
      color: theme.colors.textBW,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    subContainer: {
      flexGrow: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    scrollStyle: {
      backgroundColor: theme.colors.bgDarkwhite,
      flexGrow: 1,
    },
    horizontalMargin: {
      marginHorizontal: 20,
    },
    gradientStyle: {
      height: 3,
      backgroundColor: theme.colors.tabBottomBorder,
      // width: size,
    },
  });
export default useStyles;
