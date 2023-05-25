import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {colors, Fonts} from '../../theme';
const EnterVerificationCode = ({
  onPress,
  children,
  defaultBtn,
  defaultBtnText,
  phoneNo,
}) => {
  return (
    <View style={styles.verifyBlock}>
      <View>
        <Text
          style={[
            styles.verifyBlockTitle,
            {color: ThemeManager.colors.textColor},
          ]}>
          Enter verification code
        </Text>
      </View>
      <View>
        <Text
          style={[
            styles.verifyBlockText,
            {color: ThemeManager.colors.textColor},
          ]}>
          We have sent a 5-digit code to
        </Text>
      </View>
      <View>
        <Text
          style={[
            styles.verifyBlockText,
            {color: ThemeManager.colors.textColor},
          ]}>
          {phoneNo}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  verifyBlock: {
    paddingTop: 20,
  },
  verifyBlockTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: Fonts.medium,
    marginBottom: 8,
  },
  verifyBlockText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.dashboardItemTextColor,
    marginVertical: 2,
  },
});

export {EnterVerificationCode};
