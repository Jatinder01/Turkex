import {StyleSheet, Dimensions} from 'react-native';
import {Fonts, colors, Images} from '../../../theme';
import fonts from '../../../theme/fonts';
import {ThemeManager} from '../../../../ThemeManager';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,

    borderRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  flexView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 100,
    borderRadius: 4,
  },
  imageStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    opacity: 0.8,
    marginRight: 8,
    tintColor: colors.white,
  },
});
