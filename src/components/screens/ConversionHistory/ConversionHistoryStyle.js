import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  currencyText: {
    color: ThemeManager.colors.textColor,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  dateTime: {
    color: ThemeManager.colors.inactiveTextColor,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});
