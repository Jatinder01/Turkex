import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts } from "../../../theme";

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

    // paddingTop: 15,
    // backgroundColor:"red"
  },
  titleDepositLimt: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: ThemeManager.colors.textColor,
    textDecorationLine: "underline",
  },
  labelStyle: {
    color: ThemeManager.colors.textColor,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: ThemeManager.colors.inactiveTextColor,
    backgroundColor: "rgba(6,19,38,0.04)",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  btnDepositeBlock: {
    padding: 15,
    borderWidth: 1,
    borderColor: ThemeManager.colors.modalBox,
    marginTop: 25,
    borderRadius: 6,
  },
  btnMore: {
    borderWidth: 1,
    borderColor: ThemeManager.colors.inactiveTextColor,
    backgroundColor: "#fff",
    height: 48,
    marginTop: 25,
  },
  btnText: {
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.regular,
  },
  helpTextBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  helpText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    // color: `${textLight}`,
    color: ThemeManager.colors.inactiveTextColor,
    fontWeight: "500",
  },
  btnBottomActive: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    textShadowColor: "rgba(0,0,0,0)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    backgroundColor: ThemeManager.colors.selectedTextColor,
  },
  btnBottomDeactive: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    textShadowColor: "rgba(0,0,0,0)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    backgroundColor: ThemeManager.colors.tabBackground,
  },
  copyBtns: {
    borderWidth: 1,
    borderColor: ThemeManager.colors.inactiveTextColor,
    flexDirection: "row",
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 10,
  },
  ShowQr: {
    flex: 1,
  },
  ShowQrText: {
    textAlign: "center",
    fontFamily: Fonts.regular,
    fontSize: 13,
    paddingVertical: 6,
  },
  isQrSelected: {
    backgroundColor: ThemeManager.colors.inactiveTextColor,
    color: ThemeManager.colors.textRedColor,
  },
  copyUrl: {
    flex: 1,
  },
  copyUrlText: {
    textAlign: "center",
    fontFamily: Fonts.regular,
    fontSize: 13,
    paddingVertical: 6,
  },
  slideContainer: {
    flex: 1,
  },
  titleCurrency: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    textAlign: "center",
    color: "#3E3D3D",
    marginVertical: 15,
  },
  subTitleCurrency: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: "#878787",
    marginBottom: 15,
  },
  errorMessageStyle: {
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },

  titleAvailStatus: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.inactiveTextColor,
    marginTop: 5,
    fontWeight: "500",
    letterSpacing: -0.35,
    maxWidth: "50%",
  },
  availStatusView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    flex: 1,
  },

  modelContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000050",
  },
  modelContainerChild: {
    height: "65%",

    width: "100%",
    position: "absolute",
    alignItems: "center",
    bottom: "0%",
    justifyContent: "center",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
});

// import { StyleSheet } from "react-native";
// import { ThemeManager } from "../../../../ThemeManager";
// import { Fonts } from "../../../theme";
// const useStyles = (theme) =>
//   StyleSheet.create({
//     screenStyle: {
//       flex: 1,
//       // justifyContent: 'center',
//       // alignItems: 'center',
//     },
//     viewMainContainer: {
//       flex: 1,
//       backgroundColor: theme.colors.tabBackground,
//       alignItems: "center",
//     },
//     middleBlock: {
//       flex: 1,
//       width: "100%",
//       paddingHorizontal: 15,

//       // paddingTop: 15,
//       // backgroundColor:"red"
//     },
//     titleDepositLimt: {
//       fontSize: 15,
//       fontFamily: Fonts.bold,
//       color: theme.colors.textColor,
//       textDecorationLine: "underline",
//     },
//     labelStyle: {
//       color: theme.colors.textColor,
//     },
//     inputStyle: {
//       borderWidth: 1,
//       borderColor: theme.colors.inactiveTextColor,
//       backgroundColor: "rgba(6,19,38,0.04)",
//       fontSize: 13,
//       lineHeight: 18,
//       textAlign: "center",
//     },
//     btnDepositeBlock: {
//       padding: 15,
//       borderWidth: 1,
//       borderColor: theme.colors.modalBox,
//       marginTop: 25,
//       borderRadius: 6,
//     },
//     btnMore: {
//       borderWidth: 1,
//       borderColor: theme.colors.inactiveTextColor,
//       backgroundColor: "#fff",
//       height: 48,
//       marginTop: 25,
//     },
//     btnText: {
//       color: theme.colors.textColor,
//       fontFamily: Fonts.regular,
//     },
//     helpTextBlock: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginTop: 15,
//     },
//     helpText: {
//       fontSize: 12,
//       fontFamily: Fonts.medium,
//       // color: `${textLight}`,
//       color: theme.colors.inactiveTextColor,
//       fontWeight: "500",
//     },
//     btnBottomActive: {
//       marginBottom: 30,
//       marginLeft: 15,
//       marginRight: 15,
//       textShadowColor: "rgba(0,0,0,0)",
//       textShadowOffset: { width: 0, height: 0 },
//       textShadowRadius: 0,
//       backgroundColor: theme.colors.selectedTextColor,
//     },
//     btnBottomDeactive: {
//       marginBottom: 30,
//       marginLeft: 15,
//       marginRight: 15,
//       textShadowColor: "rgba(0,0,0,0)",
//       textShadowOffset: { width: 0, height: 0 },
//       textShadowRadius: 0,
//       backgroundColor: theme.colors.tabBackground,
//     },
//     copyBtns: {
//       borderWidth: 1,
//       borderColor: theme.colors.inactiveTextColor,
//       flexDirection: "row",
//       borderRadius: 6,
//       marginTop: 5,
//       marginBottom: 10,
//     },
//     ShowQr: {
//       flex: 1,
//     },
//     ShowQrText: {
//       textAlign: "center",
//       fontFamily: Fonts.regular,
//       fontSize: 13,
//       paddingVertical: 6,
//     },
//     isQrSelected: {
//       backgroundColor: theme.colors.inactiveTextColor,
//       color: theme.colors.textRedColor,
//     },
//     copyUrl: {
//       flex: 1,
//     },
//     copyUrlText: {
//       textAlign: "center",
//       fontFamily: Fonts.regular,
//       fontSize: 13,
//       paddingVertical: 6,
//     },
//     slideContainer: {
//       flex: 1,
//     },
//     titleCurrency: {
//       fontSize: 17,
//       fontFamily: Fonts.medium,
//       textAlign: "center",
//       color: "#3E3D3D",
//       marginVertical: 15,
//     },
//     subTitleCurrency: {
//       textAlign: "center",
//       fontSize: 13,
//       fontFamily: Fonts.medium,
//       color: "#878787",
//       marginBottom: 15,
//     },
//     errorMessageStyle: {
//       fontSize: 15,
//       color: "red",
//       alignSelf: "center",
//     },

//     titleAvailStatus: {
//       fontSize: 14,
//       fontFamily: Fonts.medium,
//       color: theme.colors.inactiveTextColor,
//       marginTop: 5,
//       fontWeight: "500",
//       letterSpacing: -0.35,
//       maxWidth: "50%",
//     },
//     availStatusView: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       paddingVertical: 2,
//       flex: 1,
//     },

//     modelContainer: {
//       flex: 1,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#00000050",
//     },
//     modelContainerChild: {
//       height: "65%",

//       width: "100%",
//       position: "absolute",
//       alignItems: "center",
//       bottom: "0%",
//       justifyContent: "center",
//       borderTopRightRadius: 15,
//       borderTopLeftRadius: 15,
//     },
//     mainView: { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
//   });
// export default useStyles;
