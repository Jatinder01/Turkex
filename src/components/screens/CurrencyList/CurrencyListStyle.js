import {StyleSheet} from 'react-native';
import fonts from '../../../theme/fonts';
import {colors} from '../../../theme';
import {ThemeManager} from '../../../../ThemeManager';
const sizes = {
  itemHeight: 40,
  headerHeight: 30,
  listHeaderHeight: 80,

  spacing: {
    small: 10,
    regular: 15,
    large: 20,
  },
};
const colorsSample = {
  background: {
    light: 'white',
    dark: '#8e8e93',
  },

  seperatorLine: '#e6ebf2',

  text: {
    dark: '#1c1b1e',
  },

  primary: '#007aff',
};
export default StyleSheet.create({
  viewPasswordImage: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: colorsSample.background.light,
  },

  listItemContainer: {
    flex: 1,
    height: sizes.itemHeight,
    paddingHorizontal: sizes.spacing.regular,
    justifyContent: 'center',
    borderTopColor: colorsSample.seperatorLine,
    borderTopWidth: 1,
  },

  listItemLabel: {
    color: colorsSample.text.dark,
    fontSize: 14,
  },

  sectionHeaderContainer: {
    height: sizes.headerHeight,
    backgroundColor: colorsSample.background.dark,
    justifyContent: 'center',
    paddingHorizontal: sizes.spacing.regular,
  },

  sectionHeaderLabel: {
    color: colorsSample.background.light,
  },

  listHeaderContainer: {
    height: sizes.listHeaderHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
