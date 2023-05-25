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
  // dropdown4RowTxt: {
  //   color: ThemeManager.colors.textColor,

  //   fontSize: 11,
  // },
  // screenStyle: {
  //   flex: 1,
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  // },
  // dropdown3BtnStyle: {
  //   width: '100%',
  //   height: 30,
  //   backgroundColor: ThemeManager.colors.tabBackground,
  //   paddingHorizontal: 0,
  //   // borderWidth: 1,
  //   // borderRadius: 8,
  //   // borderColor: '#444',
  // },
  dropdown3BtnChildStyle: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 10,
  },
  // dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  // dropdown3DropdownStyle: {backgroundColor: ThemeManager.colors.tabBackground},
  // dropdown3RowStyle: {
  //   backgroundColor: ThemeManager.colors.tabBackground,
  //   borderBottomColor: '#444',
  //   // height: 40,
  // },

  dropdown3BtnTxt: {
    textAlign: 'center',
    // fontWeight: ',
    fontSize: 12,
    marginHorizontal: 2,
  },
  // dropdown4BtnTxt: {
  //   color: ThemeManager.colors.textColor,
  //   textAlign: 'center',
  //   // fontWeight: 'bold',
  //   fontSize: 12,
  //   // marginHorizontal: 12,
  // },
  dropdown3RowChildStyle: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',

    paddingHorizontal: 15,
  },
  // dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  // dropdown3RowTxt: {
  //   color: ThemeManager.colors.textColor,
  //   textAlign: 'center',
  //   // fontWeight: 'bold',
  //   fontSize: 14,
  //   marginHorizontal: 12,
  // },
  btnBottomActive: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    textShadowColor: 'rgba(0,0,0,0)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 0,
    backgroundColor: ThemeManager.colors.selectedTextColor,
  },
});
