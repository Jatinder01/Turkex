import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
  },
  textStyle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  modelContainer: {
    top: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000050',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  searchView: {
    backgroundColor: ThemeManager.colors.inputColor,
    borderRadius: 20,
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    // flex: 1,
    width: '45%',
  },
  searchIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    padding: 5,
    marginHorizontal: 10,
  },
  cancelText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: ThemeManager.colors.selectedTextColor,
    marginLeft: 10,
  },
});
