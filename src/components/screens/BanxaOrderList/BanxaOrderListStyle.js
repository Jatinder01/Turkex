import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  orderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: ThemeManager.colors.textColor,
  },
  dateText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.inactiveTextColor,
  },
  forwardIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  flexEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  limitText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.textGreenColor,
  },
  statusView: {
    backgroundColor: ThemeManager.colors.tabBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  hideText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.textColor,
    marginLeft: 15,
    marginVertical: 15,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 50,
    // height: 50
  },
  loadMoreBtn: {
    padding: 10,
    // backgroundColor: '#800000',
    borderRadius: 4,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextLoad: {
    color: '#000000',
    fontSize: 17,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 40,
    borderRadius: 4,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {
    color: colors.black,
    textAlign: 'left',
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
});
