import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  root: {
    backgroundColor: Colors.PrimaryDark,
  },
  body: {
    justifyContent: 'center',
    flexGrow: 1,
    marginTop: 10,
  },
  ViewMainContainer: {
    height: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.PrimaryDark,
  },
  greyText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.GrayLight,
    fontFamily: Fonts.PoppinsRegular,
  },
});
