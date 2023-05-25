/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import styles from "./RegisterVerificationStyle";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as constants from "../../../Constants";
import { InputField, ButtonPrimary, Header, Loader } from "../../common";
import {
  registerFormUpdate,
  resendPhoneOtpVerify,
  resendEmailOtpVerify,
  registerEmailOtpUpdate,
  registerPhoneOtpUpdate,
  registerEmailPhoneVerify,
  loginFormUpdate,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import PagerView from "react-native-pager-view";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { strings } from "../../../../Localization";
import { Actions } from "react-native-router-flux";

const RegisterVerification = (props) => {
  let interval = React.useRef(null);
  let intervalEmail = React.useRef(null);
  let intervalPhone = React.useRef(null);
  const dispatch = useDispatch();
  const [showConvertBtn, setShowConvertBtn] = useState(true);
  const [countDown, setCountDown] = useState(60);
  const [countDownEmail, setCountDownEmail] = useState(60);
  const [countDownPhone, setCountDownPhone] = useState(60);
  const [showConvertBtnEmail, setShowConvertBtnEmail] = useState(false);
  const [showConvertBtnPhone, setShowConvertBtnPhone] = useState(false);
  // const accountDetails = useSelector((state) => state?.RegisterReducer);
  const {
    registerEmailOtp,
    registerPhoneNumberOtp,
    registerEmail,
    registerPhoneNumberWithCode,
    registerError,
    regOtpLoading,
    regVerifyLoading,
    regLoading,
  } = useSelector((state) => state?.RegisterReducer);

  const { isThemeUpdate } = useSelector((state) => state?.tradeReducer);

  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);

  const onButtonPress = () => {
    getTimer();
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
    } else if (registerEmailOtp < 5) {
      dispatch(
        registerFormUpdate({
          prop: "registerError",
          value: "Please enter valid otp",
        })
      );
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
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      {/* <Header
        customCenterTitle={{}}
        rightImage={{ uri: Images.cross }}
        btnTextRight=" "
        customRightImage={{
          width: 23,
          height: 23,
          right: 16,
          tintColor: ThemeManager.colors.headTxt,
          resizeMode: "contain",
        }}
        rightButtonClicked={() => {
          dispatch(registerFormUpdate({ prop: "registerError", value: "" }));
          dispatch(
            registerFormUpdate({ prop: "registerFirstName", value: "" })
          );
          dispatch(registerFormUpdate({ prop: "registerLastName", value: "" }));
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
          dispatch(registerFormUpdate({ prop: "registerPassword", value: "" }));
          dispatch(registerFormUpdate({ prop: "regTermsCheck", value: false }));
          dispatch(
            registerFormUpdate({ prop: "registerReferralId", value: "" })
          );
          dispatch(registerFormUpdate({ prop: "registerRefID", value: "" }));
          dispatch(
            registerFormUpdate({ prop: "recaptchaCheck", value: false })
          );
          dispatch(registerFormUpdate({ prop: "regLoading", value: false }));
          dispatch(registerFormUpdate({ prop: "recaptchaData", value: "" }));
          Actions.pop();
        }}
      /> */}
      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity
          style={{ marginRight: 15, marginTop: 15 }}
          onPress={() => {
            dispatch(registerFormUpdate({ prop: "registerError", value: "" }));
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
            dispatch(registerFormUpdate({ prop: "registerRefID", value: "" }));
            dispatch(
              registerFormUpdate({ prop: "recaptchaCheck", value: false })
            );
            dispatch(registerFormUpdate({ prop: "regLoading", value: false }));
            dispatch(registerFormUpdate({ prop: "recaptchaData", value: "" }));
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
            {strings.enterAccountDetails.verifyAccount}
          </Text>
          <View>
            <View style={styles.inputTitle} />

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
                placeholderTextColor={ThemeManager.colors.anouncementtextColour}
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
            </View>

            <View style={styles.inputTitle} />
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
                placeholderTextColor={ThemeManager.colors.anouncementtextColour}
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
                <View style={styles.inputTitle} />
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
                      height: 50,
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
                        // backgroundColor: "red",
                        marginBottom: 15,
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
                        color: ThemeManager.colors.selectedTextColor,
                        // textDecorationLine: "underline",
                        fontFamily: fonts.medium,
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
    </SafeAreaView>
  );
};

export default RegisterVerification;
