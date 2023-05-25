import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // backgroundColor: 'red',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  pairView: {
    alignItems: 'center',
    marginTop: 15,
  },
  pairText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.inactiveTextColor,
  },
  pairCurrencyText: {
    marginTop: 5,
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textColor,
  },
  viewRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  selectIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: ThemeManager.colors.textGreenColor,
  },
  filledText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textGreenColor,
  },
  inactiveText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.inactiveTextColor,
  },
  activeText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.textColor,
    textTransform: 'capitalize',
  },
  greenText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textGreenColor,
  },
  mainView: {
    marginTop: 10,
    // backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  rowStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  orderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: ThemeManager.colors.inactiveTextColor,
    marginLeft: 5,
  },
  tradeText: {
    marginVertical: 10,
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textColor,
  },
  subView: {
    marginHorizontal: 15,
  },
  subViewStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

    marginHorizontal: 15,
    marginVertical: 2,
  },
});
