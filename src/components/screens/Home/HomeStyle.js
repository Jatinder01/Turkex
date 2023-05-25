import { StyleSheet, Dimensions } from "react-native";
import { Fonts, colors, Images } from "../../../theme";
import fonts from "../../../theme/fonts";
import { ThemeManager } from "../../../../ThemeManager";

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textStyle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  helperBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    // backgroundColor: '#fff',
    paddingVertical: 15,
  },
  cItem: {
    // width: Dimensions.get('window').width * 0.32,
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
  },
  cName: {
    fontSize: 13,
    color: "#8D8D8D",
    fontFamily: fonts.regular,
  },
  cValue: {
    fontSize: 13,
    color: "#3C3C3C",
    marginRight: 2,
    fontFamily: fonts.regular,
  },
  currentValue: {
    fontSize: 16,
    color: colors.main_text_color,
    alignSelf: "flex-end",
    fontFamily: fonts.regular,
  },
  navBarUnderlineBg: {
    backgroundColor: colors.white,
    width: "0%",
  },
  navBarBg: {
    backgroundColor: "transparent",
    // color: 'red',
    // borderRadius: 15
    elevation: 0,
  },
  tabsWrap: {
    borderRadius: 15,
    height: 30,
    paddingHorizontal: 15,
    elevation: 0,
    borderBottomWidth: 0,
  },
  navTextStyle: {
    color: ThemeManager.colors.textColor,
    textAlign: "center",
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  navTextActiveStyle: {
    color: colors.black,
    fontSize: 14,
    textAlign: "center",
  },
  navBarActiveBg: {
    borderRadius: 2,
    height: 30,
    paddingHorizontal: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: ThemeManager.colors.convertBox,
    justifyContent: "center",
    alignItems: "center",
  },
});
