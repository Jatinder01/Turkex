import {StyleSheet} from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';

import Fonts from '../../../theme/fonts';
import fonts from '../../../theme/fonts';

export default StyleSheet.create({
  screenStyle: {
 
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color:ThemeManager.colors.textBW
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    alignSelf: 'flex-end',
    height: "100%", width: '100%',

    backgroundColor: ThemeManager.colors.dashboardSubViewBg,
    borderRadius: 20,
    marginTop: 370,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },

  textStyle: {
    color:ThemeManager.colors.textBW,fontFamily:fonts.regular,
    textAlign: "center"
  },
  modalText: {
    marginBottom: 16,
    textAlign: "center",
    color: ThemeManager.colors.Purewhite,
    fontFamily: Fonts.medium
  }
});
