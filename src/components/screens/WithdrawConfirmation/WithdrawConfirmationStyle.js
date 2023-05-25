import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts } from "../../../theme";

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  viewMainContainer: {
    flex: 1,
    backgroundColor: ThemeManager.colors.tabBackground,
    alignItems: "center",
  },
  middleBlock: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  header: {
    // borderBottomWidth: 1,
    // borderBottomColor: ThemeManager.colors.inactiveTextColor,
    paddingBottom: 15,
  },
  titleDepositLimt: {
    fontSize: 30,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.selectedTextColor,
  },
  btnBottom: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: ThemeManager.colors.selectedTextColor,
  },
  payWithBlock: {
    marginTop: 20,
  },
  payWithTitle: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.selectedTextColor,
    marginBottom: 5,
    textAlign: "left",
  },
  addOthePayment: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: ThemeManager.colors.selectedTextColor,
    textAlign: "center",
  },
  isSelected: {
    borderColor: colors.btnTextColor1,
  },
  depositeOrderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ThemeManager.colors.tabBackground,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    // borderBottomWidth: 1,
    // borderBottomColor: ThemeManager.colors.inactiveTextColor,
    alignItems: "center",
    minHeight: 52,
  },
  depositeOrderText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.selectedTextColor,
    textAlign: "left",
  },
  orderBtn: {
    backgroundColor: ThemeManager.colors.selectedTextColor,
    borderRadius: 35,
  },
  depositeOrderBtn: {
    fontFamily: Fonts.medium,
    paddingHorizontal: 15,
    lineHeight: 35,
    // color: "#fff",
  },
  checkboxStyleCustom: {
    borderWidth: 0,
  },
  checkboxPosition: {
    left: 0,
  },
  errorMessageStyle: {
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },
});
