/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from './AddNewCardStyle';
import {View} from 'native-base';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts, Images, colors} from '../../../theme';
import fonts from '../../../theme/fonts';
import * as constants from '../../../Constants';
import {
  InputField,
  ButtonPrimary,
  HeaderCancel,
  CountryList,
  Header,
  Loader,
} from '../../common';
import {
  registerFormUpdate,
  registerUser,
  resetRegisterForm,
} from '../../../Redux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import PagerView from 'react-native-pager-view';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {strings} from '../../../../Localization';
import {Actions} from 'react-native-router-flux';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import END_POINT from '../../../EndPoints';
import SimpleHeader from '../../common/SimpleHeader';
import BorderLine from '../../common/BorderLine';

const AddNewCard = props => {
  const [ViewPassword, setViewPassword] = useState(true);
  const [ReferralClicked, setReferralClicked] = useState(false);
  const [agreeEmail, setagreeEmail] = useState(false);
  const [agreeMarketing, setagreeMarketing] = useState(true);
  const accountDetails = useSelector(state => state?.RegisterReducer);
  const dispatch = useDispatch();
  const [expiration, setExpiration] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');

  const {isThemeUpdate} = useSelector(state => state?.tradeReducer);

  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);

  useEffect(() => {}, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}>
      <View style={{marginLeft: 20, marginVertical: 20}}>
        <SimpleHeader titleName={'Add New card'} />
      </View>

      <View style={{flex: 1}}>
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          {/* <View
            style={{
              borderWidth: 1,
              width: '95%',
              alignSelf: 'center',
              height: 95,
              marginTop: 25,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.textBW,
                }}>
                Card info
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.textBW,
                }}>
                Billing Address
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <View
                style={{
                  borderRadius: 50,
                  backgroundColor: ThemeManager.colors.textGreenColor,
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{color: ThemeManager.colors.Purewhite, fontSize: 10}}>
                  1
                </Text>
              </View>

              <View style={{borderBottomWidth: 1, width: 200}}></View>

              <View
                style={{
                  borderRadius: 50,
                  backgroundColor: 'grey',
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{color: ThemeManager.colors.Purewhite, fontSize: 10}}>
                  2
                </Text>
              </View>
            </View>
          </View> */}
          <View>
            <Text
              style={{
                color: ThemeManager.colors.textColor1,
                fontSize: 20,
                fontFamily: Fonts.bold,
                marginLeft: 16,
                marginVertical: 15,
              }}>
              Enter Card Information
            </Text>
          </View>
          <View>
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            {/* <Text
              style={{
                color: ThemeManager.colors.textColor1,
                fontSize: 18,
                fontFamily: Fonts.medium,
                marginLeft: 16,
                // marginVertical: 15,
              }}>
              Card Holder Name
            </Text> */}
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '100%'}}>
                <Text style={styles.inputTitle}>Card Holder Name</Text>
                <InputField
                  editable={true}
                  title="Full Name"
                  value={firstName}
                  // value={accountDetails?.registerEmail}
                  onChangeText={value => {
                    setFirstName(value);
                  }}
                  maxlength={100}
                  keyboardType="email-address"
                />
              </View>

              {/* <View style={{width: '50%'}}>
                <Text style={styles.inputTitle}></Text>
                <InputField
                  editable={true}
                  title="Last Name"
                  value={lastName}
                  onChangeText={value => {
                    setLastName(value);
                  }}
                  // value={accountDetails?.registerPassword}
                  maxlength={100}
                />
              </View> */}
            </View>
            {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}

            <View>
              <Text style={styles.inputTitle}>Card Number</Text>
              <InputField
                editable={true}
                title="Card Number"
                // value={accountDetails?.registerPassword}
                value={cardNumber}
                onChangeText={value => {
                  setCardNumber(value);
                }}
                maxlength={24}
                keyboardType={'numeric'}
                image={Images.Visaa}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={{width: '50%'}}>
                <Text style={styles.inputTitle}>Expiration Month</Text>
                <InputField
                  editable={true}
                  title="MM"
                  keyboardType={'numeric'}
                  value={month}
                  onChangeText={text => {
                    setMonth(text);
                    // setExpiration(
                    //   text.length === 2 && !text.includes('/')
                    //     ? `${text.substring(0, 2)}/${text.substring(4)}`
                    //     : text,
                    // );
                  }}
                  // value={accountDetails?.registerEmail}
                  maxlength={2}
                />
              </View>

              <View style={{width: '50%'}}>
                <Text style={styles.inputTitle}>Expiration Year</Text>
                <InputField
                  editable={true}
                  title="YYYY"
                  keyboardType={'numeric'}
                  value={year}
                  onChangeText={text => {
                    setYear(text);
                    // setExpiration(
                    //   text.length === 2 && !text.includes('/')
                    //     ? `${text.substring(0, 2)}/${text.substring(4)}`
                    //     : text,
                    // );
                  }}
                  // value={accountDetails?.registerEmail}
                  maxlength={4}
                />
              </View>
            </View>
            <View style={{width: '50%'}}>
              <Text style={styles.inputTitle}>CVV</Text>
              <InputField
                editable={true}
                keyboardType={'numeric'}
                title="Please input CVV"
                secureTextEntry={true}
                value={cvv}
                onChangeText={text => setCvv(text)}
                // caretHidden={true}
                // value={accountDetails?.registerPassword}
                maxlength={3}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View style={{marginBottom: 40, marginTop: 10}}>
          <ButtonPrimary
            title={'Add'}
            onPress={() => {
              alert('Added ');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddNewCard;
