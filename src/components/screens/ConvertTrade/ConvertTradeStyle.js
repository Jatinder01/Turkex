import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  pinButtonStyle: {
    borderColor: ThemeManager.colors.textColor,
    width: '33.3334%',
    paddingVertical: '4%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinButtonTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: 20,
    color: ThemeManager.colors.textColor,
  },
  flexRow: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    height: 20,
    width: 20,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  textStyle: {fontSize: 16, fontFamily: Fonts.regular, marginHorizontal: 10},
  convertText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.textColor1,
    marginBottom: 10,
    // marginHorizontal: 10,
  },
});
