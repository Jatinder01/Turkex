import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },

  dropdown3BtnChildStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdown3BtnTxt: {
    textAlign: 'center',
    fontSize: 12,
    marginHorizontal: 2,
  },

  dropdown3RowChildStyle: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'flex-start',

    paddingHorizontal: 15,
  },

  dropdown3RowTxt: {
    textAlign: 'center',
    fontSize: 14,
    marginHorizontal: 12,
  },
  mainView: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: 'red',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  buyBtn: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    borderRadius: 4,
  },
});
