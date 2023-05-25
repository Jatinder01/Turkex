import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Fonts} from '../../theme';

const GoogleAuthKey = ({keyText, onPress}) => {
  return (
    <View style={styles.keyBlock}>
      <Text style={styles.keyBlockText}>{keyText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  keyBlock: {
    backgroundColor: '#000',
    borderRadius: 4,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  keyBlockText: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    color: '#EDF7FF',
    textAlign: 'center',
  },
});
export {GoogleAuthKey};
