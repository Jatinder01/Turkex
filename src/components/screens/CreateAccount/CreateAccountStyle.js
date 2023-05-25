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
    color: colors.searchPlaceHolder,
    marginHorizontal: 16,
    marginTop: 20,
  },
  viewPasswordImage: {
    height: 12,
    width: 17.5,
    alignSelf: 'center',
  },
  viewPasswordStyle: {
    height: 40,
    width: 35,
    position: 'absolute',
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
    color: colors.buttonBgColor,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  title: {
    marginTop: 20,
    marginHorizontal: 16,
    color: ThemeManager.colors.textColor,
    fontFamily: fonts.medium,
    fontSize: 22,
  },
  SubTitle: {
    marginHorizontal: 16,
    color: ThemeManager.colors.dashboardItemTextColor,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  customRightImage: {
    width: 23,
    height: 23,
    right: 16,
    tintColor: ThemeManager.colors.textColor,
    resizeMode: 'contain',
  },
});
