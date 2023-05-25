/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {strings} from '../../../../Localization';
import {ThemeManager} from '../../../../ThemeManager';
import {colors, Fonts, Images} from '../../../theme';
import {ButtonPrimary, ConvertInput, Wrap} from '../../common';
import ConvertHeader from '../../common/ConvertHeader';
import styles from './ConversionStyle';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../../Singleton';

const {height, width} = Dimensions.get('window');
const Conversion = props => {
  console.log('Conversion props=-=-', JSON.stringify(props));
  const [balance, setBalance] = useState('0.067576 ETH');
  return (
    <Wrap
      style={{backgroundColor: ThemeManager.colors.BackgroundDarkView}}
      screenStyle={[
        styles.screenStyle,
        {backgroundColor: ThemeManager.colors.BackgroundDarkView},
      ]}
      darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
      bottomStyle={{backgroundColor: ThemeManager.colors.BackgroundDarkView}}>
      <ConvertHeader
        titleStyle={{color: ThemeManager.colors.textColor}}
        history={false}
        onBackPress={() => {
          Actions.pop();
        }}
        title={strings.convert.conversion}
      />
      <View
        style={{
          backgroundColor: ThemeManager.colors.BackgroundDarkView,
          flex: 1,
        }}>
        <View style={{marginHorizontal: 20, flex: 1}}>
          <View
            style={{
              alignItems: 'center',
              marginTop: 50,
            }}>
            <LinearGradient
              start={{x: -1, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#F5F5F5', '#00C35D']}
              style={{
                height: 98,
                width: 98,
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 86,
                  width: 86,
                  borderRadius: 43,
                  backgroundColor:
                    props.data.state === 'rejected'
                      ? ThemeManager.colors.textRedColor
                      : ThemeManager.colors.btnGreenColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{
                    uri:
                      props.data.state === 'rejected'
                        ? Images.icon_Profile_Info
                        : Images.icon_select,
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                    tintColor:
                      props.data.state === 'rejected'
                        ? ThemeManager.colors.textRedColor
                        : null,
                  }}
                />
              </View>
            </LinearGradient>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.regular,
                fontSize: 16,
                marginTop: 20,
              }}>
              {props.data.state === 'rejected' &&
                strings.convert.conversionFailed}
              {props.data.state === 'success' &&
                strings.convert.conversionSuccessful}
              {props.data.state === 'collected' &&
                strings.convert.conversionSuccessful}
              {props.data.state === 'pending' &&
                strings.convert.conversionPending}
            </Text>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.medium,
                fontSize: 22,
                marginVertical: 15,
                textTransform: 'uppercase',
              }}>
              {props.data.total} {props?.data?.currency}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: ThemeManager.colors.SwapInput,
              //   marginHorizontal: 15,
              opacity: 0.7,
              padding: 20,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textBW3,
                  // marginHorizontal: 25,
                }}>
                {strings.convert.convert}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textColor1,
                  textTransform: 'uppercase',
                  // marginHorizontal: 25,
                }}>
                {props.data.price} {props.data.ask_currency}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textBW3,
                  // marginHorizontal: 25,
                }}>
                {strings.convert.rate}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.textColor1,
                    textTransform: 'uppercase',
                    // marginHorizontal: 25,
                  }}>
                  {'1'} {props.data.ask_currency}
                  {' ≈ '}
                  {props.rate &&
                    Singleton.getInstance().ParseFloatNumber(
                      props.rate,
                      8,
                    )}{' '}
                  {props?.data?.currency}
                  {/* {'1 ETH = 0.098798 BTC'} */}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              // marginTop: 20,
              marginHorizontal: 15,
              marginVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                Actions.currentScene != 'Home' && Actions.replace('Home');
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                width: '48%',
                borderWidth: 1,
                borderRadius: 6,
                borderColor: ThemeManager.colors.withdrawText,
                // backgroundColor: ThemeManager.colors.tabBottomBorder,
              }}>
              <Text
                style={{
                  color: ThemeManager.colors.withdrawText,
                  fontSize: 14,
                  fontFamily: Fonts.medium,
                }}>
                {strings.convert.backHome}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Actions.currentScene != 'ConversionHistory' &&
                  Actions.push('ConversionHistory');
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#64B77C', '#347899', '#1F5BA7']}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 6,
                  // backgroundColor: ThemeManager.colors.btnColor2,

                  width: width / 2 - 20,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.medium,
                    color: colors.white,
                  }}>
                  {strings.convert.viewHistory}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                // Actions.pop();
                Actions.currentScene != "Home" && Actions.replace("Home");
              }}
              style={{
                flex: 1,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 5,

                backgroundColor: ThemeManager.colors.convertBox,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textColor1,
                  // marginHorizontal: 25,
                }}
              >
                {strings.convert.backHome}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Actions.currentScene != "ConversionHistory" &&
                  Actions.push("ConversionHistory");
                // setPreviewModalVisible(false);
              }}
              style={{
                flex: 1,
                marginLeft: 5,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: ThemeManager.colors.selectedTextColor,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textColor,
                  // marginHorizontal: 25,
                }}
              >
                {strings.convert.viewHistory}
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Wrap>
  );
};
export default Conversion;
