import {StyleSheet} from 'react-native';
import fonts from '../../../theme/fonts';
import {colors} from '../../../theme';
import {ThemeManager} from '../../../../ThemeManager';

export default StyleSheet.create({
  errorMessageStyle: {
    fontSize: 15,
    color: colors.appRed,
    alignSelf: 'center',
    marginTop: 20,
  },
  heading: {
    fontSize: 15,
    color: ThemeManager.colors.textColor1,
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 20,
  },
});
