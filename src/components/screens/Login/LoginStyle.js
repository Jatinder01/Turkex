import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, colors } from "../../../theme";
import fonts from "../../../theme/fonts";

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

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
    color: ThemeManager.colors.textBW,
    marginHorizontal: 16,
    marginTop: 20,
  },
  viewPasswordImage: {
    height: 12,
    width: 17.5,
    alignSelf: "center",
  },
  viewPasswordStyle: {
    height: 40,
    width: 35,
    position: "absolute",
    right: 0,
    bottom: -10,
  },
  forgotPasswordView: {
    marginHorizontal: 16,
    top: 20,
  },
  RegisterView: {
    marginHorizontal: 16,
    marginTop: 30,
  },
  text: {
    color: colors.btnTextColor,
    fontSize: 14,
    marginTop: 10,
    fontFamily: fonts.regular,
  },
  errorStyleView: {
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
  },
  errorMessageStyle: {
    fontSize: 15,
    color: colors.appRed,
    alignSelf: "center",
    marginHorizontal: 15,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 20,
  },
  searchView: {
    backgroundColor: ThemeManager.colors.inputColor,
    borderRadius: 6,
    height: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 10,
  },
  cancelText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: ThemeManager.colors.selectedTextColor,
    marginLeft: 10,
  },

  modelContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000050",
  },
  modelContainerChildOTP: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    bottom: "25%",
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 5,
    padding: 5,
    textAlign: "center",
    marginBottom: 5,
    margin: 5,
    color: colors.searchPlaceHolder,
    fontFamily: Fonts.regular,
    width: 50,
  },
});
