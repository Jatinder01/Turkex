import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../theme';

const BuySellTabs = ({
  onPress,
  buySellStyle,
  btnActive,
  btnActiveText,
  buyButtonClicked,
  textUppercase,
  sellButtonClicked,
  sellSelected,
}) => {
  if (sellSelected == true) {
    return (
      <View style={[styles.buySellTabBlock, buySellStyle]}>
        <TouchableOpacity
          style={[styles.btnDeActiveBg, btnActive]}
          onPress={buyButtonClicked}>
          <Text style={[styles.btnDeActiveText, btnActiveText]}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sellBtnBlock]}
          onPress={sellButtonClicked}>
          <Text style={[styles.btnText]}>Sell</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={[styles.buySellTabBlock, buySellStyle]}>
        <TouchableOpacity style={[styles.btnBlock]} onPress={buyButtonClicked}>
          <Text style={[styles.btnText]}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnDeActiveBg, btnActive]}
          onPress={sellButtonClicked}>
          <Text style={[styles.btnDeActiveText, btnActiveText]}>Sell</Text>
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
    marginTop: 15,
    overflow: 'hidden',
  },
  btnBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: colors.greenTxt,
  },
  sellBtnBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: colors.redTxt,
  },
  btnDeActiveBg: {
    // backgroundColor: colors.greenTxt,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderBottomWidth: 0,
    borderRadius: 15,
    backgroundColor: colors.textInputBg,
  },
  btnText: {
    fontSize: 12,
    color: colors.white,
    // fontFamily: `${Avenir_Medium}`,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  btnDeActiveText: {
    // color: '#868686',
    fontSize: 12,
    color: colors.lightTxtColor,
    // fontFamily: `${Avenir_Medium}`,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  btnActive: {
    backgroundColor: '#ff7b3a',
  },
});

export {BuySellTabs};
