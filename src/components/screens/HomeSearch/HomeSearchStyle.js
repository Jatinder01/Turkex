import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts } from "../../../theme";

export default StyleSheet.create({
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
    backgroundColor: ThemeManager.colors.tabBackground,
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
    color: ThemeManager.colors.selectedTextColor,
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
    color: ThemeManager.colors.inactiveTextColor,
    // marginLeft: 10,
  },
  activeTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: ThemeManager.colors.textColor,
    // marginLeft: 10,
  },
  inactiveTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: ThemeManager.colors.inactiveTextColor,
  },
  flexStart: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  xStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: ThemeManager.colors.selectedTextColor,
    marginLeft: 10,
  },
  fluctuateText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.textGreenColor,
  },
  valueText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.textColor,
  },
});
