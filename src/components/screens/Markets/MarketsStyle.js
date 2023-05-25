import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";

const useStyles = (theme) =>
  StyleSheet.create({
    screenStyle: {
      flex: 1,
    },
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
      fontFamily: fonts.regular,
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
