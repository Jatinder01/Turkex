import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts } from "../../../theme";

export default StyleSheet.create({
  viewMainContainer: {
    flex: 1,
    backgroundColor: ThemeManager.colors.whiteScreen,
    alignItems: "center",
  },
  btnBottom: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    // backgroundColor: ThemeManager.colors.selectedTextColor,
    backgroundColor: ThemeManager.colors.walletDPbtn,
  },
  errorMessageStyle: {
    fontSize: 15,
    color: "red",
    alignSelf: "center",
    marginBottom: 10,
  },
  screenStyle: {
    flex: 1,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
});
