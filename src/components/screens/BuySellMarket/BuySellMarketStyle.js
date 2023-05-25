import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts, colors} from '../../../theme';
import fonts from '../../../theme/fonts';

export default StyleSheet.create({
  viewMainContainer: {
    flex: 1,
  },
  screenStyle: {
    flex: 1,
  },
  tabTextStyle: {
    textAlign: 'center',
    color: ThemeManager.colors.inactiveTextColor,
    fontSize: 11,
    paddingTop: 8,
    marginTop: 20,
    height: 30,
    width: 60,
    borderRadius: 13,
    overflow: 'hidden',
  },
  tabStyle: {
    backgroundColor: colors.white,
    height: 30,
    bottom: 0,
    zIndex: -1,
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.11,
    shadowRadius: 8,
  },
  tabsWrap: {
    height: 30,
    elevation: 0,
    backgroundColor: ThemeManager.colors.tabBackground,
  },
  navBarUnderlineBg: {
    backgroundColor: ThemeManager.colors.tabBottomBorder,
    width: 10,
    // overflow: 'hidden',
    marginHorizontal: '14%',
    // width: '18%',
    // marginHorizontal: 30,
  },
  navBarBg: {
    backgroundColor: ThemeManager.colors.tabBackground,
    elevation: 0,
  },

  navTextStyle: {
    color: ThemeManager.colors.textColor1,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  navTextActiveStyle: {
    color: colors.black,
    fontSize: 14,
    textAlign: 'center',
  },
  navBarActiveBg: {
    borderRadius: 2,
    backgroundColor: ThemeManager.colors.tabBackground,
    alignItems: 'center',
  },
  tabbar: {
    backgroundColor: '#263238',
    overflow: 'hidden',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: ThemeManager.colors.BackgroundDarkView,
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 6,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
