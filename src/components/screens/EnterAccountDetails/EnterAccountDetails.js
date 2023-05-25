/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import styles from "./EnterAccountDetailsStyle";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as constants from "../../../Constants";
import {
  InputField,
  ButtonPrimary,
  HeaderCancel,
  CountryList,
  Header,
  Loader,
  LocationInput,
  Wrap,
  PhoneNumberInput,
} from "../../common";
import {
  registerFormUpdate,
  registerUser,
  resetRegisterForm,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import PagerView from "react-native-pager-view";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { strings } from "../../../../Localization";
import { Actions } from "react-native-router-flux";
import ConfirmGoogleCaptcha from "react-native-google-recaptcha-v2";
import END_POINT from "../../../EndPoints";
import { countryFlags } from "../../common/CountryFlags";
import BorderLine from "../../common/BorderLine";
let captchaForm;
const EnterAccountDetails = (props) => {
  const NAME_REX = /^[a-zA-Z ]*$/;
  const dispatch = useDispatch();
  // let captchaForm = useRef(null);
  const [ViewPassword, setViewPassword] = useState(false);
  const [ReferralClicked, setReferralClicked] = useState(false);
  const [agreeEmail, setagreeEmail] = useState(false);
  const [agreeMarketing, setagreeMarketing] = useState(false);

  const {
    registerCountryCallingFlag,
    registerCountryCallingCode,
    registerFirstName,
    registerLastName,
    registerEmail,
    // registerPhoneNumber,
    registerPassword,
    recaptchaCheck,
    registerMiddleName,
    registerCountry,
    registerCountryName,
    regEmailUpdates,
    registerReferralId,
    recaptchaData,
    regMarketing,
    registerRefID,
    registerError,
    regLoading,
  } = useSelector((state) => state?.RegisterReducer);

  const [sendCodeText, setsendCodeText] = useState("Send OTP");
  const [modalOTPVisible, setmodalOTPVisible] = useState(false);
  const [optEntered, setotpEntered] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState(
    registerCountryCallingFlag
  );
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(registerCountryName);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    registerCountryCallingCode
  );
  // console.log("accountDetails=-=-=-=-=->>>>", accountDetails);
  // const onSearch = value => {
  //   setCountryData(
  //     searchData.filter(
  //       i =>
  //         i.countryNameEn.toLowerCase().includes(value.toLowerCase()) ||
  //         i.countryCallingCode.toLowerCase().includes(value.toLowerCase()),
  //     ),
  //   );
  // };
  const onSearch = (value) => {
    setCountryData(
      searchData.filter(
        (i) =>
          i.countryNameEn.toLowerCase().includes(value.toLowerCase()) ||
          i.countryCallingCode.toLowerCase().includes(value.toLowerCase()) ||
          i?.countryCallingCode
            ?.toLowerCase()
            .includes(value.replace("+", "").toLowerCase())
      )
    );
  };

  const { isThemeUpdate } = useSelector((state) => state.tradeReducer);

  useEffect(() => {
    return () => {
      // alert('vj');
      isThemeUpdate;
    };
  }, [isThemeUpdate]);

  const onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (["cancel", "error", "expired"].includes(event.nativeEvent.data)) {
        captchaForm.hide();
        return;
      } else {
        console.log("Verified code from Google", event.nativeEvent.data);
        const token = event.nativeEvent.data;
        setTimeout(() => {
          actionOnSuccess(token);
        }, 200);
      }
    }
  };
  const actionOnSuccess = (value) => {
    dispatch(registerFormUpdate({ prop: "recaptchaData", value }));
    dispatch(registerFormUpdate({ prop: "recaptchaCheck", value: true }));
    captchaForm.hide();
  };

  const onButtonPress = () => {
    Actions.currentScene != "VerifyEmail" &&
      Actions.VerifyEmail()
    return
    // console.log("sign Up details", accountDetails);

    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let reg = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let passReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    if (!registerFirstName?.length) {
      // Alert.alert(constants.APP_NAME, 'Please enter first name');
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter first name",
        })
      );
    } else if (!registerLastName) {
      // Alert.alert(constants.APP_NAME, 'Please enter last name');
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter last name",
        })
      );
    } else if (reg.test(registerEmail) == false) {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: constants.VALID_EMAIL,
        })
      );
      // } else if (registerPhoneNumber?.length < 5) {
      //   // Alert.alert(constants.APP_NAME, 'Please enter a valid phone number');
      //   dispatch(
      //     registerFormUpdate({
      //       prop: "registerError",
      //       value: "Please enter a valid phone number",
      //     })
      //   );
    } else if (registerPassword?.length <= 0) {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter password.",
        })
      );
    } else if (passReg.test(registerPassword) == false) {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: constants.VALID_PASSWORD,
        })
      );
    } else if (!recaptchaCheck) {
      captchaForm.show();
    } else {
      // const mobileNo = "+" + selectedCountryCode + registerPhoneNumber;
      console.log("mobileNo=-=-=-=-=-=>>>", mobileNo);

      dispatch(
        registerFormUpdate({
          prop: "registerPhoneNumberWithCode",
          value: mobileNo,
        })
      );
      dispatch(
        registerUser({ //TODO:- Hide this functionality and move on screen directly
          registerFirstName: registerFirstName,
          registerLastName: registerLastName,
          registerMiddleName: registerMiddleName,
          registerEmail: registerEmail,
          // registerPhoneNumber: mobileNo,
          registerCountry: registerCountry,
          registerCountryCode: selectedCountryCode,
          registerPassword: registerPassword,
          regEmailUpdates: regEmailUpdates,
          recaptchaCheck: recaptchaCheck,
          registerReferralId: registerReferralId,
          recaptchaData: recaptchaData,
          regMarketing: regMarketing,
          registerRefID: registerRefID,
        })
      );
    }
  };
  useEffect(() => {
    dispatch(registerFormUpdate({ prop: "registerError", value: "" }));
    dispatch(registerFormUpdate({ prop: "registerFirstName", value: "" }));
    dispatch(registerFormUpdate({ prop: "registerLastName", value: "" }));
    dispatch(registerFormUpdate({ prop: "registerMiddleName", value: "" }));

    // dispatch(registerFormUpdate({ prop: "registerPhoneNumber", value: "" }));
    dispatch(registerFormUpdate({ prop: "registerEmail", value: "" }));
    // dispatch(
    //   registerFormUpdate({
    //     prop: 'registerPhoneNumberWithCode',
    //     value: '',
    //   }),
    // );
    dispatch(registerFormUpdate({ prop: "registerPassword", value: "" }));
    dispatch(registerFormUpdate({ prop: "regTermsCheck", value: false }));
    dispatch(registerFormUpdate({ prop: "registerReferralId", value: "" }));
    dispatch(registerFormUpdate({ prop: "registerRefID", value: "" }));

    dispatch(registerFormUpdate({ prop: "recaptchaCheck", value: false }));
    dispatch(registerFormUpdate({ prop: "regLoading", value: false }));
    dispatch(registerFormUpdate({ prop: "recaptchaData", value: "" }));
    return () => {
      dispatch(registerFormUpdate({ prop: "registerError", value: "" }));
      dispatch(registerFormUpdate({ prop: "registerFirstName", value: "" }));
      dispatch(registerFormUpdate({ prop: "registerLastName", value: "" }));
      dispatch(registerFormUpdate({ prop: "registerMiddleName", value: "" }));

      // dispatch(registerFormUpdate({ prop: "registerPhoneNumber", value: "" }));
      // dispatch(
      //   registerFormUpdate({
      //     prop: 'registerPhoneNumberWithCode',
      //     value: '',
      //   }),
      // );
      dispatch(registerFormUpdate({ prop: "registerPassword", value: "" }));
      dispatch(registerFormUpdate({ prop: "regTermsCheck", value: false }));
      dispatch(registerFormUpdate({ prop: "registerReferralId", value: "" }));
      dispatch(registerFormUpdate({ prop: "registerRefID", value: "" }));

      dispatch(registerFormUpdate({ prop: "recaptchaCheck", value: false }));
      dispatch(registerFormUpdate({ prop: "regLoading", value: false }));
      dispatch(registerFormUpdate({ prop: "recaptchaData", value: "" }));
    };
  }, []);

  const renderError = () => {
    if (registerError) {
      // if (accountDetails.registerError == 'Captcha_Session_failed') {
      // dispatch(registerFormUpdate({prop: 'recaptchaCheck', value: false}));
      // dispatch(registerFormUpdate({prop: 'recaptchaData', value: ''}));
      // }
      // if (accountDetails.registerError === 'password.weak') {
      //   return (
      //     <View style={{marginHorizontal: 16, marginBottom: 10}}>
      //       <Text style={styles.errorMessageStyle}>
      //         {accountDetails.registerError}
      //       </Text>
      //     </View>
      //   );
      // } else {
      return (
        <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
          <Text style={styles.errorMessageStyle}>{registerError}</Text>
        </View>
      );
    }
    // }
  };

  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      {/* <Header
        customCenterTitle={{}}
        rightImage={{uri: Images.cross}}
        btnTextRight=" "
        customRightImage={{
          width: 23,
          height: 23,
          right: 16,
          tintColor: ThemeManager.colors.headTxt,
          resizeMode: 'contain',
        }}
        rightButtonClicked={() => {
          dispatch(registerFormUpdate({prop: 'registerEmail', value: ''}));
          Actions.pop();
        }}
      /> */}

      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(
                registerFormUpdate({ prop: "registerEmail", value: "" })
              );
              Actions.pop();
            }}
            style={{
              height: 40,
              width: 40,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              alignSelf: "flex-end",
              marginRight: 20,
              marginTop: 20,
            }}
          >
            <Image
              source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
              style={{
                height: 25,
                width: 25,
                // tintColor: ThemeManager.colors.textBW,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 20,
              marginHorizontal: 16,
              color: ThemeManager.colors.headTxt,
              fontFamily: fonts.medium,
              fontSize: 26,
            }}
          >
            {strings.enterAccountDetails.enterAccountDetails}
          </Text>
          <Text
            style={{
              // marginTop: 10,
              marginHorizontal: 16,
              color: ThemeManager.colors.black_white,
              fontFamily: fonts.light,
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            {strings.enterAccountDetails.enterTheDetails}
          </Text>
          <View>
            <Text style={[styles.inputTitle, { color: ThemeManager.colors.black_white }]}>{strings.enterAccountDetails.firstName}</Text>
            {/* <View style={styles.inputTitle} /> */}

            <InputField
              editable={true}
              title={`${strings.enterAccountDetails.firstName}*`}
              value={registerFirstName}
              onChangeText={(value) => {
                if (NAME_REX.test(value)) {
                  dispatch(
                    registerFormUpdate({
                      prop: "registerFirstName",
                      value: value,
                    })
                  );
                }
              }}
              maxlength={100}
              // keyboardType="email-address"
              customContainerStyle={{
                backgroundColor: ThemeManager.colors.SwapInput,
              }}
            />
            {/* <Text style={styles.inputTitle}>Last Name</Text> */}
            {/* <View style={styles.inputTitle} />
            <InputField
              editable={true}
              title={strings.enterAccountDetails.middleName}
              value={registerMiddleName}
              onChangeText={(value) => {
                if (NAME_REX.test(value)) {
                  dispatch(
                    registerFormUpdate({
                      prop: "registerMiddleName",
                      value: value,
                    })
                  );
                }
              }}
              maxlength={100}
              // keyboardType="email-address"
              customContainerStyle={{
                backgroundColor: ThemeManager.colors.SwapInput,
              }}
            /> */}
            <Text style={[styles.inputTitle, { color: ThemeManager.colors.black_white }]}>{strings.enterAccountDetails.lastName}</Text>
            {/* <View style={styles.inputTitle} /> */}
            <InputField
              editable={true}
              title={`${strings.enterAccountDetails.lastName}*`}
              value={registerLastName}
              onChangeText={(value) => {
                if (NAME_REX.test(value)) {
                  dispatch(
                    registerFormUpdate({
                      prop: "registerLastName",
                      value: value,
                    })
                  );
                }
              }}
              maxlength={100}
              // keyboardType="email-address"
              customContainerStyle={{
                backgroundColor: ThemeManager.colors.SwapInput,
              }}
            />
            <Text style={[styles.inputTitle, { color: ThemeManager.colors.black_white }]}>{strings.enterAccountDetails.email}</Text>
            {/* <View style={styles.inputTitle} /> */}

            <InputField
              editable={true}
              title={`${strings.enterAccountDetails.email}*`}
              value={registerEmail}
              onChangeText={(value) => {
                dispatch(
                  registerFormUpdate({ prop: "registerEmail", value: value })
                );
              }}
              maxlength={100}
              keyboardType="email-address"
              customContainerStyle={{
                backgroundColor: ThemeManager.colors.SwapInput,
              }}
            />
            {/* <Text style={styles.inputTitle}>Phone munber</Text> */}
            {/* <View style={styles.inputTitle} />
            <View
              style={[
                styles.veriFormMiddle,
                {
                  // backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
                  // marginHorizontal: 15,
                },
              ]}
            >
              <PhoneNumberInput
                verifyLable={styles.notShow}
                codeTextStyle={{ color: ThemeManager.colors.textColor1 }}
                placeHolder={`${strings.enterAccountDetails.mobileNumber}*`}
                countryCodeText={selectedCountryCode}
                customStyle={{
                  backgroundColor: ThemeManager.colors.SwapInput,
                  // backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
                  // borderWidth: 1,
                  borderRadius: 6,
                }}
                value={registerPhoneNumber}
                verifyInputStyle={{
                  color: ThemeManager.colors.textColor1,
                }}
                placeHolderTextColor={ThemeManager.colors.anouncementtextColour}
                maxLength={15}
                flag={selectedCountryFlag}
                countryCodeClicked={() => {
                  setModalVisible(true);
                }}
                onChangeText={(value) => {
                  console.log("value phone number=-=->>", value);
                  let extraSpaceRegex = /^\s*\s*$/;
                  if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                    dispatch(
                      registerFormUpdate({
                        prop: "registerPhoneNumber",
                        value: value,
                      })
                    );
                  }
                  // setsendCodeText('Send');

                  // dispatch(
                  //   mobileVerifyFormUpdate({
                  //     prop: 'mobilePhoneNO',
                  //     value,
                  //   }),
                  // );
                }}
              />
            </View>

            <View style={styles.inputTitle} /> */}

            <Text style={[styles.inputTitle, { color: ThemeManager.colors.black_white }]}>{strings.enterAccountDetails.password}</Text>

            <InputField
              editable={true}
              title={`${strings.enterAccountDetails.password}*`}
              secureTextEntry={ViewPassword ? false : true}
              value={registerPassword}
              onChangeText={(value) => {
                dispatch(
                  registerFormUpdate({ prop: "registerPassword", value })
                );
              }}
              maxlength={100}
              keyboardType="default"
              image={
                !ViewPassword
                  ? { uri: ThemeManager.ImageIcons.icon_hide_eye }
                  : { uri: ThemeManager.ImageIcons.icon_open_eye }
              }
              onPress={() => {
                setViewPassword(!ViewPassword);
              }}
              rightImageStyle={{ tintColor: ThemeManager.colors.textColor1 }}
              customContainerStyle={{
                backgroundColor: ThemeManager.colors.SwapInput,
              }}
            />
            {/* <TouchableOpacity
              onPress={() => setReferralClicked(!ReferralClicked)}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.inputTitle}>Referral ID (Optional)</Text>
                <Image
                  style={{
                    width: 13,
                    height: 7,
                    top: 5,
                    marginLeft: -8,
                  }}
                  source={{ uri: Images.Icon_arrow_dropdown }}
                />
              </View>
            </TouchableOpacity>
            {ReferralClicked && (
              <InputField
                editable={true}
                title="Referral ID"
                value={accountDetails.registerRefID}
                onChangeText={(value) => {
                  dispatch(
                    registerFormUpdate({ prop: "registerRefID", value: value })
                  );
                }}
                maxlength={25}
                // keyboardType="email-address"
                customContainerStyle={{
                  backgroundColor: ThemeManager.colors.SwapInput,
                }}
              />
            )} */}

            <View
              style={{
                marginHorizontal: 16,
                marginTop: 25,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  console.log("Agree===", agreeEmail);
                  setagreeEmail(!agreeEmail);
                  dispatch(
                    registerFormUpdate({ props: "regEmailUpdates", agreeEmail })
                  );
                }}
              >
                <Image
                  style={{
                    marginTop: 2,
                    width: 18,
                    height: 18,
                  }}
                  source={agreeEmail
                    ? { uri: Images.icon_Agree_check }
                    : { uri: ThemeManager.ImageIcons.icon_select_k }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  left: 10,
                  color: ThemeManager.colors.headTxt,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  marginRight: 20,
                  flex: 1,
                }}
              >
                {strings.enterAccountDetails.agreeEmailUpdate}
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 16,
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setagreeMarketing(!agreeMarketing);
                  dispatch(
                    registerFormUpdate({ props: "regEmailUpdates", agreeEmail })
                  );
                }}
              >
                <Image
                  style={{
                    marginTop: 2,
                    width: 18,
                    height: 18,
                  }}
                  source={agreeMarketing
                    ? { uri: Images.icon_Agree_check }
                    : { uri: ThemeManager.ImageIcons.icon_select_k }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  left: 10,
                  color: ThemeManager.colors.headTxt,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  marginRight: 20,
                  flex: 1,
                }}
              >
                {strings.enterAccountDetails.agreeMarketingPurpose}
              </Text>
              <ConfirmGoogleCaptcha
                siteKey={constants.RECAPTCHA_KEY}
                baseUrl={END_POINT.COMMON_URL}
                ref={(_ref) => (captchaForm = _ref)}
                languageCode="en"
                onMessage={onMessage}
              />
            </View>
            <View style={styles.btnStyleView}>{renderError()}</View>
            {/* {<Loader isLoading={accountDetails.regLoading} />} */}
            <ButtonPrimary
              style={{ marginTop: 0, marginBottom: 40 }}
              title={strings.enterAccountDetails.next}
              onPress={() => {
                onButtonPress();
                //  Actions.currentScene != "Home" && Actions.Home()
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        {<Loader isLoading={regLoading} />}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setCountryData(countryFlags);
          setModalVisible(false);
        }}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: ThemeManager.colors.modalBox }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: ThemeManager.colors.modalBox,
              flex: 1,
              // justifyContent: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <View>
                <View style={styles.searchContainer}>
                  <View
                    style={[
                      styles.searchView,
                      { backgroundColor: ThemeManager.colors.SwapInput },
                    ]}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_search_text }}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      value={searchData}
                      onChangeText={onSearch}
                      style={{
                        width: "100%",
                        color: ThemeManager.colors.textColor,
                      }}
                      placeholder={strings.currencyDetails.search}
                      placeholderTextColor={
                        ThemeManager.colors.inactiveTextColor
                      }
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      // style={{flex: 0.3}}
                      onPress={() => {
                        setModalVisible(false);
                        setCountryData(countryFlags);
                      }}
                    >
                      <Text style={styles.cancelText}>
                        {strings.currencyDetails.cancel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ marginHorizontal: 15, flex: 1 }}>
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    marginBottom: 5,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.location.location}
                </Text>
                <BorderLine />
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.selectedTextColor,
                  }}
                >
                  {selectedCountry}
                </Text>
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    marginBottom: 5,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.location.countryRegion}
                </Text>
                <BorderLine />
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {countryData.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                          flexDirection: "row",
                          marginBottom: 3,
                        }}
                        onPress={() => {
                          var phoneCode = item.countryCallingCode;
                          setSelectedCountry(item.countryNameEn);
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryName",
                              value: item.countryNameEn,
                            })
                          );
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryCallingFlag",
                              value: item.flag,
                            })
                          );
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryNameCode",
                              value: item.countryCode,
                            })
                          );

                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryCallingCode",
                              value: item.countryCallingCode,
                            })
                          );
                          setSelectedCountryFlag(item.flag);
                          setSelectedCountryCode(item.countryCallingCode);
                          setModalVisible(false);
                          setCountryData(countryFlags);
                        }}
                      >
                        <View style={{ borderRadius: 15, marginRight: 10 }}>
                          <Text style={{ fontSize: 16, marginTop: 10 }}>
                            {item.flag}
                          </Text>
                        </View>
                        <Text
                          style={{
                            marginTop: 15,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                            color: ThemeManager.colors.textColor1,
                          }}
                        >
                          {item.countryNameEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <View>
                    {countryData?.length == 0 && (
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 16,
                          fontFamily: Fonts.medium,
                          marginTop: 60,
                          textAlign: "center",
                        }}
                      >
                        Country not found
                      </Text>
                    )}
                  </View>
                  <View style={{ height: 40 }}></View>
                </ScrollView>
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default EnterAccountDetails;
