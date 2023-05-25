import React from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {colors, Fonts, Images} from '../../theme';
import {ThemeManager} from '../../../ThemeManager';
const NavList = props => {
  return (
    <TouchableOpacity
      style={styles.buttonStyle}
      onPress={props.onPress}
      disabled={props.disabled}>
      <View style={styles.buttonStyle1}>
        {props.hideNavIcon.display == 'none_them' ? null : (
          <Image
            source={props.navIcon}
            style={[styles.navIconStyle, props.hideNavIcon]}
          />
        )}

        <Text
          style={
            ([styles.textStyle],
            {
              fontFamily: Fonts.regular,
              alignSelf: 'center',
              // color: colors.darkBlack,
              fontSize: 14,
              letterSpacing: -0.35,
              color: ThemeManager.colors.textColor1,
            })
          }>
          {props.menuText}
        </Text>
      </View>
      {props.resubmit && (
        <View style={styles.textStyle1}>
          <Text
            style={[styles.textStyle, {color: ThemeManager.colors.textColor}]}>
            Resubmit
          </Text>
        </View>
      )}
      {props.hideNavIcon.display == 'none_them' ? null : (
        <Image
          style={[
            styles.rightArrowStyle,
            props.hideRightArrow,
            {tintColor: ThemeManager.colors.textColor1},
          ]}
          source={Images.arrow_black}
        />
      )}
      {/* <Image style={[styles.rightArrowStyle, props.hideRightArrow]} source={Images.arrow_black} /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    color: colors.black,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.35,
  },
  textStyle1: {
    marginEnd: 15,
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    // marginLeft: 15,
  },
  buttonStyle1: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  navIconStyle: {
    width: 35,
    height: 35,
  },
  rightArrowStyle: {
    height: 15,
    width: 12,
  },
});

export {NavList};
