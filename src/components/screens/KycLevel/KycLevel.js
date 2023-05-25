/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Loader, Wrap} from '../../common';
import {Actions} from 'react-native-router-flux';
import {ThemeManager} from '../../../../ThemeManager';
import WebView from 'react-native-webview';
import styles from './KycLevelStyle';
import {useDispatch, useSelector} from 'react-redux';
import * as constants from '../../../Constants';
import Singleton from '../../../Singleton';
import DeviceCountry, {
  TYPE_ANY,
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
} from 'react-native-device-country';
import {colors, Fonts, Images} from '../../../theme';
import END_POINT from '../../../EndPoints';
import {CoinCultApi} from '../../../api';
import {getProfile1} from '../../../Redux/Actions';
import {strings} from '../../../../Localization';
import {xor} from 'lodash';
let fiatArr = [];
let coinArr = [];
const KycLevel = props => {
  const dispatch = useDispatch();
  const {isThemeUpdate} = useSelector(state => state?.tradeReducer);
  const [showLoader, setShowLoader] = useState(true);
  const [kycTier2, setKycTier2] = useState('');
  const [kycTier3, setKycTier3] = useState('');
  const [kycTier4, setKycTier4] = useState('');

  const [kycTier2Reject, setKycTier2Reject] = useState('');
  const [kycTier3Reject, setKycTier3Reject] = useState('');
  const [kycTier4Reject, setKycTier4Reject] = useState('');

  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  const splitText = arr => {
    let a = [];
    let split = arr.replace('"]', ' ').replace('["', ' ');

    a = split.split('_');
    let resultingString = a.join(' ');
    return resultingString;
  };
  useEffect(() => {
    props.navigation.addListener('didFocus', async event => {
      dispatch(getProfile1())
        .then(res => {
          console.log('getProfile1=-=-=-=-=-=>>>', res);
          let confirmations2 = res?.labels.find(item => item.key === 'tier_2');
          if (confirmations2 === undefined) {
            setKycTier2('');
          } else if (confirmations2?.value === 'initiated') {
            setKycTier2('initiated');
          } else if (confirmations2?.value === 'verified') {
            setKycTier2('verified');
          } else if (confirmations2?.value === 'onhold') {
            setKycTier2('on hold');
          } else if (confirmations2?.value === 'in_review') {
            setKycTier2('In Review');
          } else if (confirmations2?.value === 'retry') {
            if (confirmations2?.description != null) {
              let des = splitText(confirmations2?.description);
              setKycTier2Reject(des);
            } else {
              setKycTier2Reject('');
            }
            setKycTier2('retry');
          } else if (confirmations2?.value === 'rejected') {
            setKycTier2('rejected');
            if (confirmations2?.description != null) {
              let des = splitText(confirmations2?.description);
              setKycTier2Reject(des);
            } else {
              setKycTier2Reject('');
            }
          }

          let confirmations3 = res?.labels.find(item => item.key === 'tier_3');
          if (confirmations3 === undefined) {
            setKycTier3('');
          } else if (confirmations3?.value === 'initiated') {
            setKycTier3('initiated');
          } else if (confirmations3?.value === 'verified') {
            setKycTier3('verified');
            setKycTier2('verified');
          } else if (confirmations3?.value === 'onhold') {
            setKycTier3('on hold');
          } else if (confirmations3?.value === 'in_review') {
            setKycTier3('In Review');
          } else if (confirmations3?.value === 'retry') {
            if (confirmations3?.description != null) {
              let des = splitText(confirmations3?.description);
              setKycTier3Reject(des);
            } else {
              setKycTier3Reject('');
            }
            setKycTier3('retry');
          } else if (confirmations3?.value === 'rejected') {
            setKycTier3('rejected');
            if (confirmations3?.description != null) {
              let des = splitText(confirmations2?.description);
              setKycTier3Reject(des);
            } else {
              setKycTier3Reject('');
            }
          }
          let confirmations4 = res?.labels.find(item => item.key === 'tier_4');
          if (confirmations4 === undefined) {
            setKycTier4('');
          } else if (confirmations4?.value === 'initiated') {
            setKycTier4('initiated');
          } else if (confirmations4?.value === 'verified') {
            setKycTier4('verified');
            setKycTier2('verified');
          } else if (confirmations4?.value === 'onhold') {
            setKycTier4('on hold');
          } else if (confirmations4?.value === 'in_review') {
            setKycTier4('In Review');
          } else if (confirmations4?.value == 'retry') {
            if (confirmations4?.description != null) {
              let des = splitText(confirmations4?.description);
              setKycTier4Reject(des);
            } else {
              setKycTier4Reject('');
            }

            setKycTier4('retry');
          } else if (confirmations4?.value === 'rejected') {
            setKycTier4('rejected');
            if (confirmations4?.description != null) {
              let des = splitText(confirmations4?.description);
              setKycTier4Reject(des);
            } else {
              setKycTier4Reject('');
            }
          }
          setShowLoader(false);
        })
        .catch(err => {
          console.log('getProfile1=-=-=-=-=-=>>>err', err);
          setShowLoader(false);
        });
    });
  }, []);

  return (
    <>
      <Wrap
        style={{backgroundColor: ThemeManager.colors.tabBackground}}
        screenStyle={[
          {backgroundColor: ThemeManager.colors.tabBackground, flex: 1},
        ]}
        darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
        bottomStyle={{backgroundColor: ThemeManager.colors.tabBackground}}>
        <View style={{flex: 1}}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
              marginHorizontal: 15,
              height: 50,
            }}>
            <TouchableOpacity
              onPress={() => {
                Actions.pop();
              }}>
              <Image
                source={{uri: ThemeManager.ImageIcons.icon_back}}
                style={{height: 20, width: 20, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: ThemeManager.colors.textColor1,
                fontFamily: Fonts.medium,
                fontSize: 18,
              }}>
              {strings.kycScreen.kyc}
            </Text>
            <View style={{width: 30}} />
          </View>
          <View style={{margin: 15}}>
            <View
              style={[
                styles.viewStyle,
                {
                  backgroundColor: ThemeManager.colors.inputColor,
                  marginTop: 60,
                  marginBottom: 50,
                  shadowColor: '#000',
                },
              ]}>
              <View>
                <Text
                  style={{color: ThemeManager.colors.textColor1, fontSize: 16}}>
                  {strings.kycScreen.kycFree}
                </Text>
                <Text
                  style={{color: ThemeManager.colors.textColor1, fontSize: 12}}>
                  {strings.kycScreen.emailKyc}
                </Text>
              </View>

              <View
                style={[
                  styles.flexView,
                  {
                    backgroundColor: colors.buttonBgColor,
                  },
                ]}>
                <Image
                  source={{uri: Images.checkMark}}
                  style={styles.imageStyle}
                />

                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 12,
                    fontFamily: Fonts.regular,
                  }}>
                  {strings.kycScreen.verified}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.viewStyle,
                {
                  backgroundColor: ThemeManager.colors.inputColor,
                  marginBottom: 10,
                  shadowColor: '#000',
                },
              ]}>
              <Text
                style={{color: ThemeManager.colors.textColor1, fontSize: 16}}>
                {strings.kycScreen.kycStandard}
              </Text>
              <TouchableOpacity
                disabled={
                  kycTier2 == 'verified' ||
                  kycTier3 === 'verified' ||
                  kycTier4 === 'verified' ||
                  kycTier3 == 'retry' ||
                  kycTier4 == 'retry'
                    ? true
                    : false
                }
                onPress={() => {
                  if (kycTier3 == 'initiated' || kycTier4 == 'initiated') {
                    Singleton.getInstance().showError(
                      'Since you are already initiated for the KYC Comprehensive, you are not eligible for this KYC now.',
                    );
                  } else if (
                    kycTier2 == 'rejected' ||
                    kycTier3 == 'rejected' ||
                    kycTier4 == 'rejected'
                  ) {
                    Singleton.getInstance().showError('KYC is rejected');
                  } else if (kycTier2 == 'on hold') {
                    Singleton.getInstance().showError('KYC is on hold');
                  } else if (kycTier2 == 'In Review') {
                    Singleton.getInstance().showError('KYC is in review');
                  } else if (
                    kycTier3 == 'In Review' ||
                    kycTier4 == 'In Review'
                  ) {
                    Singleton.getInstance().showError(
                      'Since you are already initiated for the KYC Comprehensive, you are not eligible for this KYC now.',
                    );
                  } else if (kycTier3 == 'on hold' || kycTier4 == 'on hold') {
                    Singleton.getInstance().showError(
                      'Since you are already initiated for the KYC Comprehensive, you are not eligible for this KYC now.',
                    );
                  } else if (kycTier3 == 'verified' || kycTier4 == 'verified') {
                    Singleton.getInstance().showError(
                      'KYC Comprehensive is verified',
                    );
                  } else {
                    Actions.currentScene != 'KycScreen' &&
                      Actions.KycScreen({keyLevel: 'tier_2'});
                  }
                }}
                style={[
                  styles.flexView,
                  {
                    backgroundColor:
                      kycTier2 == '' ||
                      kycTier2 == 'initiated' ||
                      kycTier2 == 'pending' ||
                      kycTier2 == 'retry'
                        ? ThemeManager.colors.selectedTextColor
                        : colors.buttonBgColor,
                  },
                ]}>
                {kycTier2 == 'verified' ||
                kycTier3 == 'verified' ||
                kycTier4 == 'verified' ? (
                  <Image
                    source={{uri: Images.checkMark}}
                    style={styles.imageStyle}
                  />
                ) : null}
                {kycTier3 == 'verified' || kycTier4 == 'verified' ? (
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 12,
                      fontFamily: Fonts.regular,
                      textTransform: 'uppercase',
                    }}>
                    {strings.kycScreen.verified}
                    {/* BAD_PROOF_OF_IDENTITY */}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 12,
                      fontFamily: Fonts.regular,
                      textTransform: 'uppercase',
                    }}>
                    {kycTier2 == ''
                      ? strings.kycScreen.pending
                      : kycTier2?.toUpperCase()}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                marginBottom: 40,
              }}>
              {kycTier2 == 'rejected' && kycTier2Reject != null && (
                <Text style={{color: ThemeManager.colors.textRedColor}}>
                  {kycTier2Reject}
                </Text>
              )}
              {kycTier2 == 'retry' && kycTier2Reject != null && (
                <Text style={{color: ThemeManager.colors.textRedColor}}>
                  {kycTier2Reject}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.viewStyle,
                {
                  backgroundColor: ThemeManager.colors.inputColor,
                  shadowColor: '#000',
                },
              ]}>
              <Text
                style={{color: ThemeManager.colors.textColor1, fontSize: 16}}>
                {strings.kycScreen.kycComprehensive}
              </Text>
              <TouchableOpacity
                disabled={
                  kycTier3 == 'verified' ||
                  kycTier4 == 'verified' ||
                  kycTier2 == 'retry'
                    ? true
                    : false
                }
                onPress={() => {
                  if (kycTier2 == 'initiated') {
                    Singleton.getInstance().showError(
                      strings.kycScreen.your_previous_kyc_standard_pending,
                    );
                  } else if (
                    kycTier3 == 'rejected' ||
                    kycTier2 == 'rejected' ||
                    kycTier4 == 'rejected'
                  ) {
                    Singleton.getInstance().showError('KYC is rejected');
                  } else if (
                    kycTier4 == 'on hold' ||
                    kycTier3 == 'on hold' ||
                    kycTier2 == 'on hold'
                  ) {
                    Singleton.getInstance().showError('KYC is on hold');
                  } else if (
                    kycTier4 == 'In Review' ||
                    kycTier3 == 'In Review' ||
                    kycTier2 == 'In Review'
                  ) {
                    Singleton.getInstance().showError('KYC is in review');
                  } else {
                    Actions.currentScene != 'KycScreen' &&
                      Actions.KycScreen({keyLevel: 'tier_3'});
                  }
                }}
                style={[
                  styles.flexView,
                  {
                    backgroundColor:
                      kycTier3 == '' ||
                      kycTier3 == 'initiated' ||
                      kycTier3 == 'pending' ||
                      kycTier3 == 'retry'
                        ? ThemeManager.colors.selectedTextColor
                        : colors.buttonBgColor,
                  },
                ]}>
                {kycTier3 == 'verified' || kycTier4 == 'verified' ? (
                  <Image
                    source={{uri: Images.checkMark}}
                    style={styles.imageStyle}
                  />
                ) : null}
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 12,
                    fontFamily: Fonts.regular,
                    textTransform: 'uppercase',
                  }}>
                  {kycTier3 == '' && kycTier4 == ''
                    ? strings.kycScreen.pending
                    : kycTier3
                    ? kycTier3
                    : kycTier4}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                marginTop: 10,
              }}>
              {kycTier3 == 'rejected' && kycTier3Reject != null && (
                <Text style={{color: ThemeManager.colors.textRedColor}}>
                  {kycTier3Reject}
                </Text>
              )}
              {kycTier3 == 'retry' && kycTier3Reject != null && (
                <Text style={{color: ThemeManager.colors.textRedColor}}>
                  {kycTier3Reject}
                </Text>
              )}
              {kycTier4 == 'rejected' && kycTier4Reject != null && (
                <Text style={{color: ThemeManager.colors.textRedColor}}>
                  {kycTier4Reject}
                </Text>
              )}
              {kycTier4 == 'retry' && kycTier4Reject != null && (
                <Text style={{color: ThemeManager.colors.textRedColor}}>
                  {kycTier4Reject}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Wrap>
      <Loader isLoading={showLoader} />
    </>
  );
};

export default KycLevel;
