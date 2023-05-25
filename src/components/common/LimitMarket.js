import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

const LimitMarket = ({
  onPress,
  buySellStyle,
  btnActive,
  btnActiveText,
  limitButtonClicked,
  textUppercase,
  marketButtonClicked,
  limitSelected,
}) => {
  if (limitSelected == true) {
    return (
      <View style={[styles.buySellTabBlock, buySellStyle]}>
        <TouchableOpacity
          style={[styles.btnBlock, btnActive]}
          onPress={limitButtonClicked}>
          <Text style={[styles.btnText, styles.textUppercase, btnActiveText]}>
            Limit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnBlock]}
          onPress={marketButtonClicked}>
          <Text style={[styles.btnText, styles.textUppercase]}>Market</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={[styles.buySellTabBlock, buySellStyle]}>
        <TouchableOpacity
          style={[styles.btnBlock]}
          onPress={limitButtonClicked}>
          <Text style={[styles.btnText, styles.textUppercase]}>Limit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnBlock, btnActive]}
          onPress={marketButtonClicked}>
          <Text style={[styles.btnText, styles.textUppercase, btnActiveText]}>
            Market
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  buySellTabBlock: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  btnBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    borderBottomWidth: 0,
  },
  btnText: {
    fontSize: 13,
    lineHeight: 44,
    color: '#333',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  btnActive: {
    backgroundColor: '#900',
  },
});

export {LimitMarket};
