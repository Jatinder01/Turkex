/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {strings} from '../../../../Localization';
import {ThemeManager} from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import {colors, Fonts, Images} from '../../../theme';
const FundLimit = ({
  isRuleShow,
  closePress,
  total,
  annualTransaction,
  textColor,
  dailyLimit,
  noOfTransaction,
  tierStatusValue,
}) => {
  // console.log('tierStatusValue=-=-=-=>>>', tierStatusValue);
  // console.log(
  //   'tierStatusValue=-=-=-=>>>annualTransaction',
  //   typeof annualTransaction,
  //   typeof annualTransaction,
  // );
  // console.log(
  //   'tierStatusValue=-=-=-=>>>annualTransaction1',
  //   Singleton.getInstance().ParseFloatNumber(annualTransaction, 2),
  // );
  // console.log(
  //   'tierStatusValue=-=-=-=>>>annualTransaction2',
  //   Singleton.getInstance().ParseFloatNumberOnly(1234.67866, 2),
  // );
  // console.log(
  //   'tierStatusValue=-=-=-=>>>annualTransaction1',
  //   Singleton.getInstance().ParseFloatNumberOnly(1234566, 2),
  // );

  if (isRuleShow == true) {
    return (
      <View style={styles.mainView}>
        <View
          style={[
            styles.modalView,
            {backgroundColor: ThemeManager.colors.dashboardSubViewBg},
          ]}>
          <View style={styles.textView}>
            <View />
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -10,
              }}
              onPress={closePress}>
              <Image
                style={{height: 20, width: 20, tintColor: 'white'}}
                source={{uri: Images.icon_cancel_light}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textView}>
            <Text style={textColor}>Total Transactions:</Text>
            <Text style={[styles.textValue, textColor]}>
              ${Singleton.getInstance().ParseFloatNumberOnly(total, 2)}
            </Text>
          </View>
          {tierStatusValue == 'tier_1' ? (
            <View style={styles.textView}>
              <Text style={textColor}>Overall Limits:</Text>
              <Text style={textColor}>${dailyLimit}</Text>
            </View>
          ) : (
            <>
              <View style={styles.textView}>
                <Text style={textColor}>Total Annual Limits:</Text>
                <Text style={textColor}>${annualTransaction}</Text>
              </View>
              <View style={styles.textView}>
                <Text style={textColor}>Total Daily Limits:</Text>
                <Text style={textColor}>${dailyLimit}</Text>
              </View>
            </>
          )}

          <View style={styles.textView}>
            <Text style={textColor}>No. of Transaction:</Text>
            <Text style={textColor}>{noOfTransaction}</Text>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
// Minimum Trade Amount:0.0002 ETHMaker Trading Fee:0.2000 %Taker Trading Fee:0.2000 %Minimum Order Size :0.0001BTC

const styles = StyleSheet.create({
  mainView: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    // backgroundColor: Colors.screenBgLight,
    borderRadius: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginHorizontal: 10,
    marginBottom: 19,
    paddingVertical: 15,
    shadowColor: colors.lightGray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: '80%',
    shadowRadius: 1,
    shadowOpacity: 0.8,
  },
  textView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
  },
  textValue: {textTransform: 'uppercase'},
});

export default FundLimit;
// let FundLimit;
// export default FundLimit = React.memo(FundLimitValue);
