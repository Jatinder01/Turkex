/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import styles from "./LoginVerificationStyle";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as constants from "../../../Constants";
import {
  InputField,
  ButtonPrimary,
  Header,
  Loader,
  InputFieldOtp,
  Wrap,
  PhoneNumberInput,
  LocationInput,
} from "../../common";
import {
  registerFormUpdate,
  resendPhoneOtpVerify,
  resendEmailOtpVerify,
  registerEmailOtpUpdate,
  registerPhoneOtpUpdate,
  registerEmailPhoneVerify,
  editPhoneNumber,
  ChangePhoneNumber,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { strings } from "../../../../Localization";
import { Actions } from "react-native-router-flux";
import { countryFlags } from "../../common/CountryFlags";
import { log } from "react-native-reanimated";
const LoginVerification = (props) => {
  const data = {
    countryNameEn: "United States of America",
    countryNameLocal: "United States of America",
    countryCode: "US",
    currencyCode: "USD",
    currencyNameEn: "United States dollar",
    tinType: "EIN",
    tinName: "Tax Identification Number",
    officialLanguageCode: "en",
    officialLanguageNameEn: "English",
    officialLanguageNameLocal: "English",
    countryCallingCode: "1",
    region: "North America",
    flag: "🇺🇸",
  };

  let interval = React.useRef(null);
  let intervalEmail = React.useRef(null);
  let intervalPhone = React.useRef(null);

  const dispatch = useDispatch();

  const {
    registerCountryCallingFlag,
    registerCountryCallingCode,
    registerEmailOtp,
    registerPhoneNumberOtp,
    registerError,
    regOtpLoading,
    regVerifyLoading,
    registerPhoneNumber,
    regLoading,
  } = useSelector((state) => state.RegisterReducer);
  const [emailAddress, setEmailAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [showConvertBtn, setShowConvertBtn] = useState(true);
  const { isThemeUpdate } = useSelector((state) => state.tradeReducer);
  const [countDown, setCountDown] = useState(60);
  const [countDownEmail, setCountDownEmail] = useState(60);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("🇺🇸");

  const [countDownPhone, setCountDownPhone] = useState(60);
  const [showConvertBtnEmail, setShowConvertBtnEmail] = useState(false);
  const [showConvertBtnPhone, setShowConvertBtnPhone] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    "United States of America"
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState(1);
  const [changePhoneNumberModal, setChangePhoneNumberModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  useEffect(() => {
    setPhone(props.phoneNumber);
    console.log("-----Phone number", props.phoneNumber);
    return () => {
      // alert('vj');
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  useEffect(() => {
    getTimer();
    dispatch(
      registerFormUpdate({
        prop: "registerEmail",
        value: props.loginEmail,
      })
    );
    dispatch(
      registerFormUpdate({
        prop: "registerPhoneNumberWithCode",
        value: phone,
      })
    );
  }, []);
  const onButtonPress = () => {
    if (registerEmailOtp === "") {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter email otp",
        })
      );
    } else if (registerPhoneNumberOtp === "") {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter phone otp",
        })
      );
    } else if (registerEmailOtp.length != 5) {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter valid email otp",
        })
      );
    } else if (registerPhoneNumberOtp.length != 5) {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter valid phone otp",
        })
      );
    } else {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "",
        })
      );
      dispatch(
        registerFormUpdate({
          prop: "registerOtpError",
          value: "",
        })
      );
      dispatch(
        registerEmailPhoneVerify({
          registerEmail: props.loginEmail,
          registerPhoneNumber: phone,
          registerEmailOtp: registerEmailOtp,
          registerPhoneNumberOtp: registerPhoneNumberOtp,
        })
      )
        .then((res) => {
          dispatch(
            registerFormUpdate({ prop: "registerPhoneNumber", value: "" })
          );
          dispatch(registerFormUpdate({ prop: "registerEmail", value: "" }));
          dispatch(
            registerFormUpdate({ prop: "registerPhoneNumberOtp", value: "" })
          );
          dispatch(registerFormUpdate({ prop: "registerEmailOtp", value: "" }));
        })
        .catch((err) => { });
    }
  };
  useEffect(() => {
    dispatch(registerFormUpdate({ prop: "registerPhoneNumberOtp", value: "" }));
    dispatch(registerFormUpdate({ prop: "registerEmailOtp", value: "" }));

    return () => {
      dispatch(registerFormUpdate({ prop: "registerPhoneNumber", value: "" }));
      dispatch(registerFormUpdate({ prop: "registerEmail", value: "" }));
      dispatch(
        registerFormUpdate({ prop: "registerPhoneNumberOtp", value: "" })
      );
      dispatch(registerFormUpdate({ prop: "registerEmailOtp", value: "" }));
    };
  }, []);

  const renderError = () => {
    if (registerError) {
      return (
        <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
          <Text style={styles.errorMessageStyle}>{registerError}</Text>
        </View>
      );
    }
    // }
  };
  const getTimer = () => {
    let count = 60;
    if (interval) {
      setCountDown("");
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      count = count - 1;

      setCountDown(count + "");
      if (count == 1) {
        count = 0;
        setCountDown("");
        setShowConvertBtn(false);
        interval && clearInterval(interval.current);
      }
    }, 1000);
  };
  const getTimerEmail = () => {
    let countEmail = 60;
    if (intervalEmail) {
      setCountDownEmail("");
      clearInterval(intervalEmail.current);
    }

    intervalEmail.current = setInterval(() => {
      countEmail = countEmail - 1;

      setCountDownEmail(countEmail + "");
      if (countEmail == 1) {
        countEmail = 0;
        setCountDownEmail("");
        setCountDown(false);
        setShowConvertBtnEmail(false);
        intervalEmail && clearInterval(intervalEmail.current);
      }
    }, 1000);
  };
  const getTimerPhone = () => {
    let countPhone = 60;
    if (intervalPhone) {
      setCountDownPhone("");
      clearInterval(intervalPhone.current);
    }

    intervalPhone.current = setInterval(() => {
      countPhone = countPhone - 1;

      setCountDownPhone(countPhone + "");
      if (countPhone == 1) {
        countPhone = 0;
        setCountDownPhone("");
        setShowConvertBtnPhone(false);
        intervalPhone && clearInterval(intervalPhone.current);
      }
    }, 1000);
  };
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
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      {showEditPhone ? (
        <View style={{ justifyContent: "center" }}>
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
        </View>
      ) : (
        <>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              style={{ marginRight: 15, marginTop: 15 }}
              onPress={() => {
                Actions.pop();
              }}
            >
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                style={{ height: 25, width: 25, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          </View>
          <Loader isLoading={regOtpLoading} />
          <Loader isLoading={regVerifyLoading} />

          <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text
                style={{
                  marginTop: 20,
                  marginHorizontal: 16,
                  color: ThemeManager.colors.headTxt,
                  fontFamily: fonts.medium,
                  fontSize: 22,
                }}
              >
                {strings.enterAccountDetails?.verifyAccount}
              </Text>
              <View>
                <View style={styles.inputTitle} />
                <Text
                  style={{
                    color: ThemeManager.colors.headTxt,
                    marginHorizontal: 15,
                    marginBottom: 6,
                  }}
                >
                  Email OTP
                </Text>

                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    height: 50,
                    backgroundColor: ThemeManager.colors.SwapInput,
                    marginHorizontal: 15,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}
                >
                  <TextInput
                    value={registerEmailOtp}
                    placeholder={strings.enterAccountDetails?.emailOtp}
                    onChangeText={(value) => {
                      if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                        dispatch(
                          registerEmailOtpUpdate({
                            prop: "registerEmailOtp",
                            value: value,
                          })
                        );
                      }
                    }}
                    style={[
                      {
                        fontFamily: fonts.regular,
                        color: ThemeManager.colors.textColor1,

                        fontSize: 14,
                        // lineHeight: 20,
                        // paddingLeft: 15,
                        height: 50,
                        backgroundColor: colors.transparent,
                        width: "60%",
                      },
                    ]}
                    maxLength={5}
                    keyboardType="numeric"
                    returnKeyType={"done"}
                    placeholderTextColor={
                      ThemeManager.colors.anouncementtextColour
                    }
                  />
                  <View
                    style={{
                      // justifyContent: "center",
                      // alignItems: "flex-end",
                      // marginRight: 16,
                      // marginTop: 5,
                      width: "35%",
                    }}
                  >
                    {!showConvertBtn && !showConvertBtnEmail && (
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(resendEmailOtpVerify(props.loginEmail))
                            .then((res) => {
                              console.log("resendEmailOtpVerify=-err=-=", res);
                              getTimerEmail();
                              setShowConvertBtn(false);
                              setShowConvertBtnEmail(true);
                            })
                            .catch((err) => {
                              console.log("resendEmailOtpVerify=-err=-=", err);
                            });
                        }}
                        style={{
                          height: 40,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.medium,
                            fontSize: 14,
                          }}
                        >
                          {strings.enterAccountDetails?.resendOtp}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {showConvertBtn && !showConvertBtnEmail && (
                      <View
                        style={{
                          height: 40,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.medium,
                            fontSize: 14,
                          }}
                        >
                          {`${countDown}${countDown ? "s" : ""}`}
                        </Text>
                      </View>
                    )}
                    {!showConvertBtn && showConvertBtnEmail && (
                      <View
                        style={{
                          height: 40,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.medium,
                            fontSize: 14,
                          }}
                        >
                          {`${countDownEmail}${countDownEmail ? "s" : ""}`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    marginHorizontal: 15,
                    marginVertical: 6,
                    color: ThemeManager.colors.anouncementtextColour,
                  }}
                >
                  {`Enter code send to ${props?.loginEmail?.slice(
                    0,
                    3
                  )}*********${props?.loginEmail?.slice(-1)}`}
                </Text>
                <View style={styles.inputTitle} />
                <Text
                  style={{
                    color: ThemeManager.colors.headTxt,
                    marginHorizontal: 15,
                    marginBottom: 6,
                    marginTop: 20,
                  }}
                >
                  Phone OTP
                </Text>

                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    height: 50,
                    backgroundColor: ThemeManager.colors.SwapInput,
                    marginHorizontal: 15,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}
                >
                  <TextInput
                    value={registerPhoneNumberOtp}
                    placeholder={strings.enterAccountDetails?.phoneOtp}
                    onChangeText={(value) => {
                      if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                        dispatch(
                          registerPhoneOtpUpdate({
                            prop: "registerPhoneNumberOtp",
                            value: value,
                          })
                        );
                      }
                    }}
                    style={[
                      {
                        fontFamily: fonts.regular,
                        color: ThemeManager.colors.textColor1,

                        fontSize: 14,
                        // lineHeight: 20,
                        // paddingLeft: 15,
                        height: 50,
                        backgroundColor: colors.transparent,
                        width: "60%",
                      },
                    ]}
                    maxLength={5}
                    keyboardType="numeric"
                    returnKeyType={"done"}
                    placeholderTextColor={
                      ThemeManager.colors.anouncementtextColour
                    }
                  />
                  <View
                    style={{
                      // justifyContent: "center",
                      // alignItems: "flex-end",
                      // marginRight: 16,
                      // marginTop: 5,
                      width: "35%",
                    }}
                  >
                    {!showConvertBtn && !showConvertBtnPhone && (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                        onPress={() => {
                          dispatch(
                            resendPhoneOtpVerify(phone, props.loginEmail)
                          )
                            .then((res) => {
                              console.log("resendPhoneOtpVerify=-=res=-", res);

                              getTimerPhone();
                              setShowConvertBtnPhone(true);
                            })
                            .catch((err) => {
                              console.log("resendPhoneOtpVerify=-=err=-", err);
                            });
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.medium,
                            fontSize: 14,
                          }}
                        >
                          {strings.enterAccountDetails?.resendOtp}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {showConvertBtn && !showConvertBtnPhone && (
                      <View
                        style={{
                          height: 40,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.medium,
                            fontSize: 14,
                          }}
                        >
                          {`${countDown}${countDown ? "s" : ""}`}
                        </Text>
                      </View>
                    )}
                    {!showConvertBtn && showConvertBtnPhone && (
                      <View
                        style={{
                          height: 40,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.medium,
                            fontSize: 14,
                          }}
                        >
                          {`${countDownPhone}${countDownPhone ? "s" : ""}`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 15,
                    marginVertical: 6,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: ThemeManager.colors.anouncementtextColour,
                    }}
                  >
                    {`Enter code send to +${phone.slice(
                      0,
                      2
                    )}*****${phone.slice(-3)}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setChangePhoneNumberModal(true);
                    }}
                  >
                    <Text style={{ color: ThemeManager.colors.walletDPbtn }}>
                      Change Number
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <View
                  style={{
                    alignSelf: "flex-end",
                    justifyContent: "flex-end",
                    marginHorizontal: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowEditPhone(true);
                    }}
                  >
                    <Text
                      style={{
                        color: ThemeManager.colors.selectedTextColor,
                        // textDecorationLine: "underline",
                        fontFamily: fonts.medium,
                        fontSize: 14,
                        marginTop: 5,
                      }}
                    >
                      Change Number
                    </Text>
                  </TouchableOpacity>
                </View> */}
                <View style={styles.inputTitle} />

                <View style={styles.btnStyleView}>{renderError()}</View>
                {regLoading && <Loader />}
                <ButtonPrimary
                  style={{ marginTop: 8 }}
                  title={strings.enterAccountDetails?.confirm}
                  onPress={() => {
                    onButtonPress();
                    //  Actions.currentScene != "Home" && Actions.Home()
                  }}
                />
              </View>
              {regLoading && <Loader />}
            </KeyboardAwareScrollView>
          </View>
        </>
      )}
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
                        width: "80%",
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
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.location.location}
                </Text>
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
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.location.countryRegion}
                </Text>

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
                    {countryData.length == 0 && (
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={changePhoneNumberModal}
        onRequestClose={() => { }}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              // setChangePhoneNumberModal(false);
            }}
          ></TouchableOpacity>
          <View
            style={{
              // backgroundColor: "blue",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                height: 400,
                width: "80%",
                alignSelf: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  marginTop: 30,
                  alignSelf: "center",
                  fontFamily: Fonts.medium,
                  fontSize: 18,
                  color: ThemeManager.colors.headTxt,
                }}
              >
                Change Phone Number
              </Text>
              <Text
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.headTxt,
                }}
              >
                Country Code
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <View
                  style={{
                    height: 50,
                    backgroundColor: ThemeManager.colors.inputBackground,
                    marginHorizontal: 20,
                    borderRadius: 6,
                    alignContent: "center",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    marginTop: 6,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontSize: 18,
                          fontFamily: fonts.regular,
                          color: ThemeManager.colors.headTxt,
                        },
                      ]}
                    >
                      {selectedCountryFlag}
                    </Text>
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          fontFamily: fonts.regular,
                          color: ThemeManager.colors.headTxt,
                          marginHorizontal: 15,
                        },
                      ]}
                    >
                      {selectedCountry}
                    </Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Image
                      style={{ height: 10, width: 16, resizeMode: "contain" }}
                      source={{ uri: ThemeManager.ImageIcons.icon_dropdown }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <Text
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.headTxt,
                }}
              >
                Phone Number
              </Text>

              <View
                style={{
                  height: 50,
                  backgroundColor: ThemeManager.colors.inputBackground,
                  marginHorizontal: 20,
                  borderRadius: 6,
                  alignContent: "center",
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  marginTop: 6,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={[
                      {
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        color: ThemeManager.colors.headTxt,
                        marginTop: 3,
                      },
                    ]}
                  >
                    +{selectedCountryCode}
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder={"Phone Number"}
                    value={newPhoneNumber}
                    onChangeText={(value) => {
                      if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                        setNewPhoneNumber(value);
                      }
                    }}
                    style={{
                      color: ThemeManager.colors.textColor1,
                      fontSize: 14,
                    }}
                    autoCorrect={false}
                    placeholderTextColor={ThemeManager.colors.inactiveTextColor}
                    maxLength={15}
                    returnKeyType={"done"}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 40,
                  justifyContent: "space-between",
                }}
              >
                <ButtonPrimary
                  showGradient={true}
                  title={"Cancel"}
                  touchableStyle={{ width: "50%" }}
                  style={{
                    height: 50,
                    marginTop: 8,
                    width: "80%",
                    borderWidth: 1,
                    borderColor: ThemeManager.colors.btnColor3,
                    borderRadius: 4,
                  }}
                  textSimpleStyle={{ color: ThemeManager.colors.btnColor3 }}
                  onPress={() => {
                    setChangePhoneNumberModal(false);
                  }}
                />

                <ButtonPrimary
                  touchableStyle={{ width: "50%" }}
                  style={{
                    height: 50,
                    marginTop: 8,
                    width: "80%",
                    borderRadius: 4,
                  }}
                  title={"Update"}
                  onPress={() => {
                    let num = selectedCountryCode + newPhoneNumber;
                    let email = props.loginEmail;
                    console.log("-------nummmm", num, email);

                    if (newPhoneNumber.length < 5) {
                    } else {
                      setChangePhoneNumberModal(false);

                      dispatch(ChangePhoneNumber(email, num))
                        .then((response) => {
                          if (response) {
                            setPhone(selectedCountryCode + newPhoneNumber);
                          }
                        })
                        .catch((error) => { });
                    }
                  }}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              // setChangePhoneNumberModal(false);
            }}
          ></TouchableOpacity>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginVerification;
