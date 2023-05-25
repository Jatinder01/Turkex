import {StyleSheet} from 'react-native';
import {Fonts, colors} from '../../../theme';
import fonts from '../../../theme/fonts';
import {ThemeManager} from '../../../../ThemeManager';

export default StyleSheet.create({
  navBarUnderlineBg: {
    backgroundColor: colors.white,
    width: '0%',
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
    color: ThemeManager.colors.textColor,
    marginHorizontal: 16,
    marginTop: 20,
  },
  viewPasswordImage: {
    height: 12,
    width: 17.5,
    alignSelf: 'center',
  },
  title: {
    marginTop: 20,
    marginHorizontal: 16,
    color: ThemeManager.colors.textColor,
    fontFamily: fonts.medium,
    fontSize: 22,
  },
  subTitle: {
    marginTop: 8,
    marginHorizontal: 16,
    color: ThemeManager.colors.dashboardItemTextColor,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});
