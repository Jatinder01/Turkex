/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Platform,
  // ScrollView,
} from "react-native";
import styles from "./RegisterVerificationStyle";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as constants from "../../../Constants";
import { InputField, ButtonPrimary, Header, Loader, Wrap } from "../../common";
import {
  registerFormUpdate,
  resendPhoneOtpVerify,
  resendEmailOtpVerify,
  registerEmailOtpUpdate,
  registerPhoneOtpUpdate,
  registerEmailPhoneVerify,
  loginFormUpdate,
  ChangePhoneNumber,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import PagerView from "react-native-pager-view";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { strings } from "../../../../Localization";
import { Actions } from "react-native-router-flux";
import { countryFlags } from "../../common/CountryFlags";
import Singleton from "../../../Singleton";
import BorderLine from "../../common/BorderLine";
import LinearGradient from "react-native-linear-gradient";
const data = {
  countryNameEn: "United Kingdom",
  countryNameLocal: "Great Britain",
  countryCode: "GB",
  currencyCode: "GBP",
  currencyNameEn: "Pound sterling",
  tinType: "VAT Reg No",
  tinName: "Value added tax registration number",
  officialLanguageCode: "en",
  officialLanguageNameEn: "English",
  officialLanguageNameLocal: "English",
  countryCallingCode: "44",
  region: "Europe",
  flag: "🇬🇧",
};
const RegisterVerification = (props) => {
  let interval = React.useRef(null);
  let intervalEmail = React.useRef(null);
  let intervalPhone = React.useRef(null);
  const dispatch = useDispatch();
  const [showConvertBtn, setShowConvertBtn] = useState(true);
  const {
    registerEmailOtp,
    registerPhoneNumberOtp,
    registerEmail,
    registerPhoneNumberWithCode,
    registerError,
    regOtpLoading,
    regVerifyLoading,
    regLoading,
    registerPhoneNumber,
    registerCountryCallingFlag,
    registerCountryCallingCode,
    registerCountryName,
    registerCountryNameCode,
  } = useSelector((state) => state?.RegisterReducer);
  const [countDown, setCountDown] = useState(60);
  const [countDownEmail, setCountDownEmail] = useState(60);
  const [countDownPhone, setCountDownPhone] = useState(60);
  const [showConvertBtnEmail, setShowConvertBtnEmail] = useState(false);
  const [showConvertBtnPhone, setShowConvertBtnPhone] = useState(false);
  // const accountDetails = useSelector((state) => state?.RegisterReducer);
  const [phone, setPhone] = useState("");
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(registerCountryName);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState(
    registerCountryCallingFlag
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    registerCountryCallingCode
  );
  const [selectedCountryNameCode, setSelectedCountryNameCode] = useState(
    registerCountryNameCode
  );
  const [changePhoneNumberModal, setChangePhoneNumberModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isThemeUpdate } = useSelector((state) => state?.tradeReducer);
  // console.log("registerPhoneNumber=-=-=-=->>>>", registerPhoneNumber);
  // console.log(
  //   "registerCountryCallingFlag=-=-=-=->>>>",
  //   registerCountryCallingFlag
  // );
  // console.log(
  //   "registerPhoneNumberWithCode=-=-=-=->>>>",
  //   registerPhoneNumberWithCode
  // );

  useEffect(() => {
    // alert("vj");

    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);

  const onButtonPress = () => {
    // if (registerEmailOtp === "") {
    //   dispatch(
    //     registerFormUpdate({
    //       prop: "registerError",
    //       value: "Please enter email otp",
    //     })
    //   );
    // } else 
    if (registerPhoneNumberOtp === "") {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter phone otp",
        })
      );
      // } else if (registerEmailOtp < 5) {
      //   dispatch(
      //     registerFormUpdate({
      //       prop: "registerError",
      //       value: "Please enter valid otp",
      //     })
      //   );
    } else if (registerPhoneNumberOtp < 5) {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter valid otp",
        })
      );
    } else {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "",
        })
      );
      Actions.currentScene != "Login" && Actions.Login();
      return //TODO:- API HIDE AND DIRECTLY MOVE ON LOGIN SCREEN
      dispatch(
        registerEmailPhoneVerify({
          registerEmail: registerEmail,
          registerPhoneNumber: registerPhoneNumberWithCode,
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
    getTimer();
    dispatch(registerFormUpdate({ prop: "registerPhoneNumberOtp", value: "" }));
    dispatch(registerFormUpdate({ prop: "registerEmailOtp", value: "" }));
    dispatch(loginFormUpdate({ prop: "gAuthEnable", value: false }));
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
      <Loader isLoading={isLoading} />
      {changePhoneNumberModal ? (
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{ flex: 1 }}
            onPress={() => {
              // setChangePhoneNumberModal(false);
            }}
          ></View>
          <View
            style={{
              // backgroundColor: "blue",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: ThemeManager.colors.DashboardBG,
                height: 395,
                width: "96%",
                alignSelf: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  marginTop: 35,
                  alignSelf: "center",
                  fontFamily: Fonts.medium,
                  fontSize: 16,
                  color: ThemeManager.colors.headTxt,
                }}
              >
                {strings.enterAccountDetails.changePhoneNumber}
              </Text>
              <Text
                style={{
                  marginHorizontal: 10,
                  marginTop: 20,
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.headTxt,
                }}
              >
                {strings.enterAccountDetails.countryCode}

              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <View
                  style={{
                    height: 55,
                    backgroundColor: ThemeManager.colors.inputBackgroundChange,
                    marginHorizontal: 10,
                    borderRadius: 30,
                    alignContent: "center",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    marginTop: 2,
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
                          color: ThemeManager.colors.lightText83//headTxt,
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
                          color: ThemeManager.colors.lightText83,//headTxt,
                          marginHorizontal: 8,
                        },
                      ]}
                    >
                      {selectedCountry}
                    </Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Image
                      style={{ height: 9, width: 15, resizeMode: "contain" }}
                      source={{ uri: ThemeManager.ImageIcons.icon_dropdown }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <Text
                style={{
                  marginHorizontal: 10,
                  marginTop: 20,
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.headTxt,
                }}
              >
                {strings.enterAccountDetails.phoneNumber}

              </Text>

              <View
                style={{
                  height: 55,
                  backgroundColor: ThemeManager.colors.inputBackgroundChange,
                  marginHorizontal: 10,
                  borderRadius: 30,
                  alignContent: "center",
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  marginTop: 2,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {/* <Text
                    style={[
                      {
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        color: ThemeManager.colors.headTxt,
                        // marginTop: 3,
                        marginTop: Platform.OS == "android" ? 3 : 0,
                      },
                    ]}
                  >
                    +{selectedCountryCode}{" "}
                  </Text> */}
                  <TextInput
                    keyboardType="numeric"
                    placeholder={strings.enterAccountDetails.phoneNumber}

                    value={newPhoneNumber}
                    onChangeText={(value) => {
                      if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                        setNewPhoneNumber(value);
                      }
                    }}
                    style={{
                      color: ThemeManager.colors.lightText83,
                      fontSize: 14,
                      fontFamily: fonts.regular,
                      // width: "80%",
                      // flex: 1,
                      marginTop: Platform.OS == "android" ? 0 : 0,
                      width: "100%",
                    }}
                    autoCorrect={false}
                    placeholderTextColor={ThemeManager.colors.lightText83}//inactiveTextColor}
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
                  marginHorizontal: 10,
                }}
              >
                {/* <ButtonPrimary
                  showGradient={true}
                  title={"Cancel"}
                  touchableStyle={{ flex: 1 }}
                  style={{
                    // height: 50,
                    // marginTop: 8,
                    width: "80%",
                    borderWidth: 1,
                    borderColor: ThemeManager.colors.btnColor3,
                    borderRadius: 4,
                  }}
                  textSimpleStyle={{ color: ThemeManager.colors.btnColor3 }}
                  onPress={() => {
                    alert("hey");
                    setChangePhoneNumberModal(false);
                  }}
                /> */}
                {/* <ButtonPrimary
                  // touchableStyle={{ flex: 1 }}
                  style={{ marginTop: 10 }}
                  title={strings.titleName.logIn}
                  onPress={() => {
                    alert("hellodd");
                  }}
                />
                <ButtonPrimary
                  // touchableStyle={{ flex: 1 }}
                  style={{ marginTop: 10 }}
                  title={strings.titleName.logIn}
                  onPress={() => {
                    alert("helloddd");
                  }}
                /> */}
                <TouchableOpacity
                  style={{
                    // color: ThemeManager.colors.btnColor3,
                    // borderWidth: 1,
                    // borderColor: ThemeManager.colors.btnColor3,
                    backgroundColor: ThemeManager.colors.inputBackgroundChange,
                    borderRadius: 25,
                    height: 50,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 30,
                  }}
                  onPress={() => {
                    // alert("hello");
                    setChangePhoneNumberModal(false);
                  }}
                >
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 16,
                      fontFamily: Fonts.medium,
                    }}
                  >
                    {strings.enterAccountDetails.cancel}

                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    // alert("hello");
                    let num = selectedCountryCode + newPhoneNumber;
                    console.log("update=-=-=number---", num);
                    console.log(
                      "registerPhoneNumberWithCoder---",
                      registerPhoneNumberWithCode
                    );

                    // let email = props.loginEmail;
                    console.log("-------nummmm", num);
                    if (newPhoneNumber.length == 0) {
                      Singleton.getInstance().showError(
                        "Phone number required"
                      );
                    } else if (newPhoneNumber.length < 5) {
                      Singleton.getInstance().showError(
                        "Phone number is invalid"
                      );
                    } else {
                      setChangePhoneNumberModal(false);
                      // registerPhoneNumberWithCode
                      // dispatch(registerPhoneNumberWithCode({}))

                      console.log(
                        "registerPhoneNumberWithCoder--5555-",
                        registerPhoneNumberWithCode
                      );
                      setIsLoading(true);
                      dispatch(
                        ChangePhoneNumber(
                          registerEmail,
                          num,
                          selectedCountryNameCode
                        )
                      )
                        .then((response) => {
                          if (response) {
                            dispatch(
                              registerFormUpdate({
                                prop: "registerPhoneNumberWithCode",
                                value: `${selectedCountryCode + newPhoneNumber
                                  }`,
                              })
                            );
                            setPhone(selectedCountryCode + newPhoneNumber);
                            setIsLoading(false);
                            dispatch(
                              registerPhoneOtpUpdate({
                                prop: "regOtpLoading",
                                value: false,
                              })
                            );
                            dispatch(
                              registerPhoneOtpUpdate({
                                prop: "regOtpLoading",
                                value: false,
                              })
                            );
                          }
                        })
                        .catch((error) => {
                          setIsLoading(false);
                          dispatch(
                            registerPhoneOtpUpdate({
                              prop: "regOtpLoading",
                              value: false,
                            })
                          );
                          dispatch(
                            registerPhoneOtpUpdate({
                              prop: "regOtpLoading",
                              value: false,
                            })
                          );
                        });
                    }
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    // colors={["#64B77C", "#347899", "#1F5BA7"]}
                    colors={["#287FFF", "#7662FD"]}
                    // style={{
                    //   justifyContent: 'center',
                    //   alignItems: 'center',
                    // }}
                    style={{
                      height: 50,
                      // width: 140,
                      backgroundColor: ThemeManager.colors.walletDPbtn,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 25,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                      }}
                    >
                      {strings.enterAccountDetails.update}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* <ButtonPrimary
                  touchableStyle={{ flex: 1 }}
                  style={{
                    // height: 50,
                    // marginTop: 8,
                    width: "80%",
                    borderRadius: 4,
                  }}
                  title={"Update"}
                  onPress={() => {
                    alert("hello");
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
                        .catch((error) => {});
                    }
                  }}
                /> */}
              </View>
            </View>
          </View>
          <View
            style={{ flex: 1 }}
            onPress={() => {
              // setChangePhoneNumberModal(false);
            }}
          ></View>
        </Wrap>
      ) : (
        <>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              style={{ marginRight: 15, marginTop: 15 }}
              onPress={() => {
                dispatch(
                  registerFormUpdate({ prop: "registerError", value: "" })
                );
                dispatch(
                  registerFormUpdate({ prop: "registerFirstName", value: "" })
                );
                dispatch(
                  registerFormUpdate({ prop: "registerLastName", value: "" })
                );
                dispatch(
                  registerFormUpdate({ prop: "registerMiddleName", value: "" })
                );

                dispatch(
                  registerFormUpdate({ prop: "registerPhoneNumber", value: "" })
                );
                // dispatch(
                //   registerFormUpdate({
                //     prop: 'registerPhoneNumberWithCode',
                //     value: '',
                //   }),
                // );
                dispatch(
                  registerFormUpdate({ prop: "registerPassword", value: "" })
                );
                dispatch(
                  registerFormUpdate({ prop: "regTermsCheck", value: false })
                );
                dispatch(
                  registerFormUpdate({ prop: "registerReferralId", value: "" })
                );
                dispatch(
                  registerFormUpdate({ prop: "registerRefID", value: "" })
                );
                dispatch(
                  registerFormUpdate({ prop: "recaptchaCheck", value: false })
                );
                dispatch(
                  registerFormUpdate({ prop: "regLoading", value: false })
                );
                dispatch(
                  registerFormUpdate({ prop: "recaptchaData", value: "" })
                );
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
                  marginTop: 40,
                  marginHorizontal: 16,
                  color: ThemeManager.colors.headTxt,
                  fontFamily: fonts.medium,
                  fontSize: 26,
                }}
              >
                {/* {strings.enterAccountDetails.verifyAccount} */}
                {strings.enterAccountDetails.authentication}
              </Text>

              <Text
                style={{
                  marginTop: 0,
                  marginHorizontal: 16,
                  color: ThemeManager.colors.headTxt,
                  fontFamily: fonts.light,
                  fontSize: 13,
                }}
              >
                {strings.enterAccountDetails.enterOneTimePassword}
              </Text>

              <View>
                <View style={styles.inputTitle} />

                {/* <View
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
                          dispatch(resendEmailOtpVerify(registerEmail))
                            .then((res) => {
                              console.log("resendEmailOtpVerify=-err=-=", res);
                              getTimerEmail();
                              setShowConvertBtn(false);
                              setShowConvertBtnEmail(true);
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              setIsLoading(false);
                            })
                            .catch((err) => {
                              console.log("resendEmailOtpVerify=-err=-=", err);
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              setIsLoading(false);
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
                      // onPress={() => {
                      //   dispatch(resendEmailOtpVerify(props.loginEmail));
                      // }}
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
                </View> */}
                {/* <Text
                  style={{
                    marginHorizontal: 15,
                    marginVertical: 6,
                    color: ThemeManager.colors.anouncementtextColour,
                  }}
                >
                  {`Enter code send to ${registerEmail?.slice(
                    0,
                    3
                  )}*********${registerEmail?.slice(-1)}`}
                </Text> */}
                {/* <View style={styles.inputTitle} /> */}

                <Text style={[styles.inputTitle, { color: ThemeManager.colors.black_white }]}>{strings.enterAccountDetails.enterOtp}</Text>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    height: 50,
                    backgroundColor: ThemeManager.colors.SwapInput,
                    // backgroundColor: "red",
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
                        height: 50,
                        backgroundColor: colors.transparent,
                        width: "60%",
                      },
                    ]}
                    maxLength={5}
                    keyboardType="numeric"
                    returnKeyType={"done"}
                    placeholderTextColor={
                      ThemeManager.colors.lightText83 // anouncementtextColour
                    }
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      // alignItems: "flex-end",
                      // marginRight: 16,
                      // marginTop: 5,
                      width: "35%",
                    }}
                  >
                    {!showConvertBtn && !showConvertBtnPhone && (
                      <TouchableOpacity
                        style={{
                          height: 50,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                        onPress={() => {
                          dispatch(
                            resendPhoneOtpVerify(
                              registerPhoneNumberWithCode,
                              registerEmail
                            )
                          )
                            .then((res) => {
                              console.log("resendPhoneOtpVerify=-=res=-", res);
                              setShowConvertBtn(false);
                              getTimerPhone();
                              setShowConvertBtnPhone(true);
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              setIsLoading(false);
                            })
                            .catch((err) => {
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              dispatch(
                                registerPhoneOtpUpdate({
                                  prop: "regOtpLoading",
                                  value: false,
                                })
                              );
                              setIsLoading(false);
                              console.log("resendPhoneOtpVerify=-=err=-", err);
                            });
                        }}
                      >
                        <Text
                          style={{
                            color: colors.btnTextColor, //ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.regular,
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
                          height: 50,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: colors.btnTextColor, //ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.regular,
                            fontSize: 14,
                            // backgroundColor: "red",
                            // marginBottom: 15,
                          }}
                        >
                          {`${countDown}${countDown ? "s" : ""}`}
                        </Text>
                      </View>
                    )}
                    {!showConvertBtn && showConvertBtnPhone && (
                      <View
                        style={{
                          height: 50,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: colors.btnTextColor, //ThemeManager.colors.selectedTextColor,
                            // textDecorationLine: "underline",
                            fontFamily: fonts.regular,
                            fontSize: 14,
                            // marginBottom: 10,
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
                      color: ThemeManager.colors.lightText83,//anouncementtextColour,
                      fontFamily: fonts.regular,
                      fontSize: 12,
                    }}
                  >
                    {`Enter code send to +${registerPhoneNumberWithCode
                      .replace("+", "")
                      .slice(0, 2)}*****${registerPhoneNumberWithCode.slice(
                        -3
                      )}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setChangePhoneNumberModal(true);
                    }}
                  >
                    <Text style={{
                      color: colors.btnTextColor,//</TouchableOpacity>ThemeManager.colors.walletDPbtn 
                      fontFamily: fonts.regular,
                      fontSize: 12,
                    }}>
                      {strings.enterAccountDetails?.changeNumber}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputTitle} />

                {/* <View style={styles.inputTitle} />

            <InputField
              editable={true}
              title={strings.enterAccountDetails.emailOtp}
              value={registerEmailOtp}
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
              maxlength={5}
              keyboardType="numeric"
              returnKeyType={"done"}
              customContainerStyle={{
                backgroundColor: ThemeManager.colors.SwapInput,
              }}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                marginRight: 16,
                marginTop: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  dispatch(resendEmailOtpVerify(registerEmail));
                }}
              >
                <Text
                  style={{
                    color: ThemeManager.colors.textColor1,
                    textDecorationLine: "underline",
                  }}
                >
                  {strings.enterAccountDetails.resendOtp}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputTitle} />

            <InputField
              editable={true}
              title={strings.enterAccountDetails.phoneOtp}
              value={registerPhoneNumberOtp}
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
              maxlength={5}
              keyboardType="numeric"
              returnKeyType={"done"}
              customContainerStyle={{
                backgroundColor: ThemeManager.colors.SwapInput,
              }}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                marginRight: 16,
                marginTop: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  dispatch(
                    resendPhoneOtpVerify(
                      registerPhoneNumberWithCode,
                      registerEmail
                    )
                  );
                }}
              >
                <Text
                  style={{
                    color: ThemeManager.colors.textColor1,
                    textDecorationLine: "underline",
                  }}
                >
                  {strings.enterAccountDetails.resendOtp}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputTitle} /> */}

                <View style={styles.btnStyleView}>{renderError()}</View>
                {regLoading && <Loader />}
                <ButtonPrimary
                  style={{ marginTop: 8 }}
                  title={strings.enterAccountDetails.confirm}
                  onPress={() => {
                    onButtonPress();
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
                    marginBottom: 5,
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
                    color: ThemeManager.colors.inactiveTextColor,
                    marginBottom: 5,
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
                          setSelectedCountryFlag(item.flag);
                          setSelectedCountryNameCode(item.countryCode);
                          setSelectedCountryCode(item.countryCallingCode);
                          //
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryNameCode",
                              value: item.countryCode,
                            })
                          );
                          setModalVisible(false);
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
                              prop: "registerCountryCallingCode",
                              value: item.countryCallingCode,
                            })
                          );
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
    </SafeAreaView>
  );
};

export default RegisterVerification;
