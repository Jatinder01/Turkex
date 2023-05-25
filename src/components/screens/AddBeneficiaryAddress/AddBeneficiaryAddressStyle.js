import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
  },
  viewMainContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  btnBottom: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  errorMessageStyle: {
    fontSize: 15,
    color: 'red',
    alignSelf: 'center',
  },
});
