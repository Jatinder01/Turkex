import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import {ThemeManager} from '../../../ThemeManager';

const AuthenticationFooterText = ({authTextFooter}) => {
  return (
    <View style={styles.authFooterBlock}>
      <Text
        style={[styles.authFooterText, {color: ThemeManager.colors.textColor}]}>
        {authTextFooter}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  authFooterBlock: {
    paddingLeft: 70,
    paddingRight: 70,
    height: 50,
    justifyContent: 'center',
    marginBottom: 20,
  },
  authFooterText: {
    fontSize: 13,
    color: ThemeManager.colors.textColor,
    textAlign: 'center',
  },
});

export {AuthenticationFooterText};
