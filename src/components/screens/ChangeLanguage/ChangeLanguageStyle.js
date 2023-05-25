import { StyleSheet } from "react-native";
// import fonts from "../../../theme/fonts";
import { colors, Fonts } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";

const useStyles = (theme) =>
  StyleSheet.create({
    viewPasswordImage: {
      height: 16,
      width: 16,
      resizeMode: "center",
    },
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.DashboardBG,
    },
    subContainer: {
      marginHorizontal: 16,
      marginBottom: 15,
      marginVertical: 10,
    },
    langText: {
      marginHorizontal: 16,
      marginVertical: 10,
      fontFamily: Fonts.medium,
      fontSize: 22,
      color: theme.colors.headTxt,
    },
    marginView: { marginHorizontal: 16, marginVertical: 20 },
    viewHeight: { height: 50 },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    titleStyle: {
      fontFamily: Fonts.regular,
      fontSize: 16,
      color: theme.colors.textColor1,
    },
    iconStyle: {
      width: 20,
      height: 16,
      resizeMode: "contain",
      tintColor: theme.colors.selectedTextColor,
    },
  });
export default useStyles;
