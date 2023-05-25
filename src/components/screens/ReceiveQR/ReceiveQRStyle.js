import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    color: ThemeManager.colors.inactiveTextColor,
    fontFamily: Fonts.regular,
  },
  viewStyle: {
    backgroundColor: ThemeManager.colors.tabBackground,
    marginHorizontal: 15,
    marginTop: 20,
    flex: 1,
  },
  horizontalFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  totalBalanceText: {
    fontSize: 26,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.medium,
    marginRight: 10,
  },
  availableText: {
    fontSize: 13,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.regular,
    // marginRight: 10,
  },
  goToView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 5,
  },
  nameText: {
    fontSize: 16,
    color: ThemeManager.colors.inactiveTextColor,
    fontFamily: Fonts.regular,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  depositText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.textColor,
    // marginHorizontal: 25,
  },
  withdrawalText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    // color: ThemeManager.colors.textColor,
    // marginHorizontal: 25,
  },
  withdrawalView: {
    flex: 1,
    marginLeft: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeManager.colors.selectedTextColor,
  },
  depositView: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    backgroundColor: ThemeManager.colors.convertBox,
  },
  btnView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    // marginTop: 20,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  receiveText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 15,
    color: ThemeManager.colors.inactiveTextColor,
  },
  qrView: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 15,
    marginBottom: 15,
    color: ThemeManager.colors.inactiveTextColor,
  },
});
