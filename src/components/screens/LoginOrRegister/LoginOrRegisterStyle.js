import {StyleSheet} from 'react-native';
import fonts from '../../../theme/fonts';
import {colors} from '../../../theme';
import {ThemeManager} from '../../../../ThemeManager';

export default StyleSheet.create({
  viewPasswordImage: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  userInfoView: {
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 20,
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  rowFlex: {flexDirection: 'row'},
  emailPhonetext: {
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  viewEmailPhone: {
    left: 4,
    alignSelf: 'center',
    top: 6,
  },
  IdText: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  verifiedView: {
    flexDirection: 'row',
    backgroundColor: colors.buttonBgColor,
    alignContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    height: 30,
  },
  verifiedImage: {marginLeft: 10, marginRight: 6, height: 18, width: 15},
  verifiedText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  infoView: {
    marginHorizontal: 16,
    marginVertical: 15,
    height: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingLeft: 15,
    flexDirection: 'row',
  },
  customRightImage: {
    width: 23,
    height: 23,
    right: 32,
    tintColor: ThemeManager.colors.textColor,
    resizeMode: 'contain',
  },
});
