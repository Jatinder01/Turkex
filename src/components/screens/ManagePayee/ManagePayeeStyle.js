import {StyleSheet, Dimensions} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {colors, Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // backgroundColor: 'red',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  root: {
    backgroundColor: ThemeManager.colors.tabBackground,
  },
  body: {
    justifyContent: 'center',
    flexGrow: 1,
    marginTop: 10,
  },
  ViewMainContainer: {
    height: '100%',
    // paddingHorizontal: 16,
    // paddingVertical: 16,
    backgroundColor: ThemeManager.colors.tabBackground,
  },
  greyText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: ThemeManager.colors.selectedTextColor,
    fontFamily: Fonts.regular,
  },
  btnStyleView: {
    marginTop: 30,
    width: '100%',
    justifyContent: 'center',
  },
  errorMessageStyle: {
    fontSize: 15,
    color: colors.appRed,
    alignSelf: 'center',
  },
  viewMainContainer: {
    flex: 1,
    backgroundColor: ThemeManager.colors.whiteScreen,
    alignItems: 'center',
  },
  btnBottom: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    // backgroundColor: ThemeManager.colors.selectedTextColor,
    backgroundColor: ThemeManager.colors.walletDPbtn,
  },
  // errorMessageStyle: {
  //   fontSize: 15,
  //   color: 'red',
  //   alignSelf: 'center',
  //   marginBottom: 10,
  // },
  // screenStyle: {
  //   flex: 1,
  // },
});
