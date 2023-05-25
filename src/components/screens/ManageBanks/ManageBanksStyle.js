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
});
