import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts, colors} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // paddingHorizontal: 16,
    // alignItems:"center",
  },

  // titleStyle: {
  //   fontSize: 26,
  //   fontFamily: Fonts.light,
  //   textAlign: 'center',
  //   color: colors.title,
  // },
  // textStyle: {
  //   fontSize: 15,
  //   fontFamily: Fonts.regular,
  //   textAlign: 'center',
  //   color: colors.text,
  //   lineHeight: 21,
  // },
  titleStyle: {
    fontSize: 26,
    fontFamily: Fonts.light,
    textAlign: 'center',
    color: colors.title,
  },
  txtStyle: {
    fontSize: 30,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.dashboardSubViewBg,
  },
});
