/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  TextInput,
  ScrollView,
  Keyboard,
  Platform,
  Dimensions,
  ImageBackground,
} from "react-native";
import styles from "./LoginStyle";
import { Wrap } from "../../common/Wrap";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import { Tab, Tabs } from "native-base";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordFormUpdate,
  forgotPasswordUser,
} from "../../../Redux/Actions";
import {
  SubHeaderLinks,
  InputField,
  ButtonPrimary,
  PhoneNumberInput,
  HeaderCancel,
  CountryList,
  Header,
  Loader,
  MaintenanceScreen,
} from "../../common";
import PagerView from "react-native-pager-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { Actions } from "react-native-router-flux";
import {
  loginFormUpdate,
  loginUser,
  logoutUserSuccess,
  resetGAuth,
  loginUserFirst,
  resetCaptcha,
  resendEmailPHoneOtpLogin,
  loginUserFailCheck,
  resendPhoneOtpVerify,
  resendEmailOtpVerify,
} from "../../../Redux/Actions";
import ConfirmGoogleCaptcha from "react-native-google-recaptcha-v2";
import END_POINT from "../../../EndPoints";
import { strings } from "../../../../Localization";
// import { log } from "react-native-reanimated";
import moment from "moment";
import { CoinCultApi } from "../../../api";
import { countryFlags } from "../../common/CountryFlags";
import BorderLine from "../../common/BorderLine";
const { height, width } = Dimensions.get("window");
let pagera = null;
const NAVDATA = [
  {
    title: "Email",
  },
  {
    title: "Phone Number",
  },
];
let captchaForm;
let status;
// const data = {
//   countryNameEn: "United States of America",
//   countryNameLocal: "United States of America",
//   countryCode: "US",
//   currencyCode: "USD",
//   currencyNameEn: "United States dollar",
//   tinType: "EIN",
//   tinName: "Tax Identification Number",
//   officialLanguageCode: "en",
//   officialLanguageNameEn: "English",
//   officialLanguageNameLocal: "English",
//   countryCallingCode: "1",
//   region: "North America",
//   flag: "🇺🇸",
// };
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
const Login = (props) => {
  // let captchaForm = useRef(null);
  let interval = React.useRef(null);
  const [ViewPassword, setViewPassword] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const [modalCountryVisible, setModalCountryVisible] = useState(false);
  const [otp, setOtp] = useState("");
  // const AuthReducer = useSelector((state) => state?.AuthReducer);
  const {
    loginCountryCode,
    loginCountryCallingFlag,
    loginCountryName,
    recaptchaCheck,
    session_type,
    loginEmail,
    loginPassword,
    gAuthEnable,
    gOtpCode,
    recaptchaData,
    loginPhoneNumber,
    otpCode,
    loginLoading,
    loginError,
  } = useSelector((state) => state?.AuthReducer);

  const [loader, setLoader] = useState(false);
  const [showMaintaining, setShowMaintaining] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    loginCountryCode ? loginCountryCode : data.countryCallingCode
  );
  const [selectedCountryFlag, setSelectedCountryFlag] = useState(
    loginCountryCallingFlag ? loginCountryCallingFlag : data.flag
  );
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [modalVisible, setModalVisible] = useState(false);
  const [showOtpView, setShowOtpView] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    loginCountryName ? loginCountryName : data.countryNameEn
  );
  const [emailUser, setEmailUser] = useState("");
  const [phoneUser, setPhoneUser] = useState("");
  const [pwdUser, setPwdUser] = useState("");
  const [gOtpUser, setGOtpUser] = useState("");
  const [otpUser, setOtpUser] = useState("");

  const [sessionTypeUser, setSessionTypeUser] = useState("");
  const [showGAuth, setShowGAuth] = useState(false);

  const [showConvertBtn, setShowConvertBtn] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [emailId, setEmailId] = useState("");
  const dispatch = useDispatch();

  const onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (["cancel", "error", "expired"].includes(event.nativeEvent.data)) {
        captchaForm.hide();
        return;
      } else {
        const token = event.nativeEvent.data;
        setTimeout(() => {
          actionOnSuccess(token);
        }, 200);
      }
    }
  };
  const actionOnSuccess = (value) => {
    dispatch(loginFormUpdate({ prop: "recaptchaData", value }));
    dispatch(loginFormUpdate({ prop: "recaptchaCheck", value: true }));
    captchaForm.hide();
  };
  useEffect(() => {
    dispatch(loginFormUpdate({ prop: "session_type", value: "email" }));
    props.navigation.addListener("didFocus", () => {
      dispatch(loginFormUpdate({ prop: "session_type", value: "email" }));
    });
    const backAction = () => {
      const { navigation } = props;
      var currentRoute = navigation.state?.routeName;
      if (Actions.currentScene === "Login") {
        Actions.currentScene != "Main" && Actions.reset("Main");
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      resetReducer();
    };
  }, []);

  const checkLogin = (email, phoneNumber) => {
    console.log("checkLogin=-=-=-=-=>>>", email, phoneNumber);
    // resetCaptcha(dispatch);
    // dispatch(resetCaptcha());
    // Alert.alert(
    //   constants.APP_NAME,
    //   "Your email address and phone number is not verified.Please verify your phone number and email address and then try to login again.",
    //   [
    //     {
    //       text: "RESEND",
    //       onPress: () => {
    //         dispatch(resendEmailPHoneOtpLogin(email, phoneNumber));
    //       },
    //     },
    //     {
    //       text: "CANCEL",
    //       onPress: () => {
    //         dispatch(loginUserFailCheck(""));
    //       },
    //       style: "cancel",
    //     },
    //   ],
    //   { cancelable: false }
    // );
  };

  const onButtonPress = () => {
    // setEmailId('');
    let reg = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // let newRegex=/^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let passReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    console.log("recaptchaCheck=-=-sss=- aaaaaaa =>>>", recaptchaCheck);
    let errcheck = checkSessionMaintaining()
      .then((res) => {
        console.log("checkSessionMaintaining=-=-sss=- checkSessionMaintaining RESPONSE =>>>", res);
        if (res === false) {
          if (session_type === "email") {
            if (reg.test(loginEmail) == false) {
              console.log(" MAIL FAIL ");
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: constants.VALID_EMAIL,
                })
              );
            } else if (loginPassword?.length <= 0) {
              console.log(" MAIL PASS ");

              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter password.",
                })
              );
            } else if (gAuthEnable == true && gOtpCode?.length < 6) {
              console.log(" MAIL PASS  < 6");

              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter correct 2FA code.",
                })
              );
            }
            // else if (passReg.test(AuthReducer.loginPassword) == false) {
            //   dispatch(
            //     loginFormUpdate({prop: 'loginError', value: constants.VALID_PASSWORD}),
            //   );
            // }
            else if (!recaptchaCheck) {
              console.log(" MAIL PASS  !recaptchaCheck");

              dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
              captchaForm.show();
            } else {
              console.log(" MAIL PASS  ELSE ");

              Keyboard.dismiss();
              dispatch(
                loginUserFirst({
                  loginEmail: loginEmail,
                  loginPassword: loginPassword,
                  recaptchaCheck: recaptchaCheck,
                  recaptchaData: recaptchaData,
                  gOtpCode: gOtpCode,
                  gAuthEnable: gAuthEnable,
                  phone_number: selectedCountryCode + loginPhoneNumber,
                  session_type: session_type,
                })
              )
                .then((response) => {
                  console.log("loginUserFirst=-=-2em=-=>>", response);
                  if (response == 201 || response.level > 0) {
                    dispatch(
                      loginFormUpdate({ prop: "session_type", value: "email" })
                    );
                    setShowConvertBtn(true);
                    getTimer();
                    setShowOtpView(true);
                    Singleton.getInstance().showMsg(
                      "OTP code sent successfully on your email"
                    );
                  } else {
                    console.log("login response=-=-=-email>>>>", response);
                    checkLogin(response.email, response.number);
                  }
                })
                .catch((err) => {
                  setShowConvertBtn(false);
                  setShowOtpView(false);
                  // Singleton.getInstance().showError(err);
                });
            }
          } else {
            if ((loginPhoneNumber == null) | (loginPhoneNumber == "")) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: constants.VALID_PHONE_NO,
                })
              );
            } else if (loginPhoneNumber?.length < 5) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: constants.VALID_PHONE_NO,
                })
              );
            } else if (loginPassword?.length <= 0) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter password.",
                })
              );
            } else if (gAuthEnable == true && gOtpCode?.length < 6) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter correct 2FA code.",
                })
              );
            } else if (!recaptchaCheck) {
              dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
              captchaForm.show();
            } else {
              Keyboard.dismiss();

              dispatch(
                loginUserFirst({
                  loginEmail: loginEmail,
                  loginPassword: loginPassword,
                  recaptchaCheck: recaptchaCheck,
                  recaptchaData: recaptchaData,
                  gOtpCode: gOtpCode,
                  gAuthEnable: gAuthEnable,
                  phone_number: selectedCountryCode + loginPhoneNumber,
                  session_type: session_type,
                })
              )
                .then((response) => {
                  console.log("loginUserFirst=-=-1=-=>>", response);

                  if (response == 201 || response.level > 0) {
                    dispatch(
                      loginFormUpdate({ prop: "session_type", value: "phone" })
                    );
                    setShowConvertBtn(true);
                    getTimer();
                    setEmailId(response.email);
                    setShowOtpView(true);
                    Singleton.getInstance().showMsg(
                      "OTP code sent successfully on phone number"
                    );
                  } else {
                    console.log("login response=-=-=-phone>>>>", response);
                    checkLogin(response.email, response.number);
                  }
                })
                .catch((err) => {
                  setShowOtpView(false);
                  setShowConvertBtn(false);
                  // Singleton.getInstance().showError(err);
                });
            }
          }
        }
      })
      .catch((err) => {
        console.log(
          "checkSessionMaintaining=-=-=err-=->>>>",
          JSON.stringify(err)
        );
        if (
          err?.response?.status == 403 ||
          err?.response?.status == 503 ||
          err?.response?.status == "500" ||
          err?.response?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
        }
      });
  };
  const onButtonResentPress = () => {
    // setEmailId('');
    let reg = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // let newRegex=/^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let passReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    console.log("recaptchaCheck=-=-sss= RESET BUTTON-=>>>", recaptchaCheck);
    let errcheck = checkSessionMaintaining()
      .then((res) => {
        if (res === false) {
          if (session_type === "email") {
            console.log("recaptchaCheck=-=-email=-=---");
            if (reg.test(loginEmail) == false) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: constants.VALID_EMAIL,
                })
              );
            } else if (loginPassword?.length <= 0) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter password.",
                })
              );
            } else if (gAuthEnable == true && gOtpCode?.length < 6) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter correct 2FA code.",
                })
              );
            }
            // else if (passReg.test(AuthReducer.loginPassword) == false) {
            //   dispatch(
            //     loginFormUpdate({prop: 'loginError', value: constants.VALID_PASSWORD}),
            //   );
            // }
            else if (!recaptchaCheck) {
              dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
              captchaForm.show();
            } else {
              Keyboard.dismiss();
              dispatch(
                loginUserFirst({
                  loginEmail: loginEmail,
                  loginPassword: loginPassword,
                  recaptchaCheck: recaptchaCheck,
                  recaptchaData: recaptchaData,
                  gOtpCode: gOtpCode,
                  gAuthEnable: gAuthEnable,
                  phone_number: selectedCountryCode + loginPhoneNumber,
                  session_type: session_type,
                })
              )
                .then((response) => {
                  console.log("loginUserFirst=-=-2em=-=>>", response);
                  if (response == 201 || response.level > 0) {
                    dispatch(
                      loginFormUpdate({ prop: "session_type", value: "email" })
                    );
                    setShowConvertBtn(true);
                    getTimer();
                    setShowOtpView(true);
                    Singleton.getInstance().showMsg(
                      "Otp code resent successfully on your email"
                    );
                  } else {
                    console.log("login response=-=-=-email>>>>", response);
                    checkLogin(response.email, response.number);
                  }
                })
                .catch((err) => {
                  setShowConvertBtn(false);
                  setShowOtpView(false);
                  // Singleton.getInstance().showError(err);
                });
            }
          } else {
            if ((loginPhoneNumber == null) | (loginPhoneNumber == "")) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: constants.VALID_PHONE_NO,
                })
              );
            } else if (loginPhoneNumber?.length < 5) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: constants.VALID_PHONE_NO,
                })
              );
            } else if (loginPassword?.length <= 0) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter password.",
                })
              );
            } else if (gAuthEnable == true && gOtpCode?.length < 6) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter correct 2FA code.",
                })
              );
            } else if (!recaptchaCheck) {
              dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
              captchaForm.show();
            } else {
              Keyboard.dismiss();

              dispatch(
                loginUserFirst({
                  loginEmail: loginEmail,
                  loginPassword: loginPassword,
                  recaptchaCheck: recaptchaCheck,
                  recaptchaData: recaptchaData,
                  gOtpCode: gOtpCode,
                  gAuthEnable: gAuthEnable,
                  phone_number: selectedCountryCode + loginPhoneNumber,
                  session_type: session_type,
                })
              )
                .then((response) => {
                  console.log("loginUserFirst=-=-1=-=phone>>", response);

                  if (response == 201 || response.level > 0) {
                    dispatch(
                      loginFormUpdate({ prop: "session_type", value: "phone" })
                    );
                    setShowConvertBtn(true);
                    getTimer();
                    setEmailId(response.email);
                    setShowOtpView(true);
                    Singleton.getInstance().showMsg(
                      "OTP code resent successfully on your phone number"
                    );
                  } else {
                    console.log("login response=-=-=-phone>>>>", response);
                    checkLogin(response.email, response.number);
                  }
                })
                .catch((err) => {
                  setShowOtpView(false);
                  setShowConvertBtn(false);
                  // Singleton.getInstance().showError(err);
                });
            }
          }
        }
      })
      .catch((err) => {
        console.log(
          "checkSessionMaintaining=-ddd=-=-=->>>>",
          JSON.stringify(err)
        );
        if (
          err?.response?.status == 403 ||
          err?.response?.status == 503 ||
          err?.response?.status == "500" ||
          err?.response?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
        }
      });
  };
  const onSubmitButtonPress = () => {
    console.log("onSubmitButtonPress=-=-=");
    let reg = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let newRegex = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;

    console.log(" ------------------API CALL START-----------FIRST------ ",);

    let errcheck = checkSessionMaintaining()
      .then((res) => {
        console.log(" ------------------API CALL START-----------resssssss------ ", res);

        if (res === false) {
          if (session_type === "email") {
            if (otpCode?.length == 0) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter valid OTP code.",
                })
              );
            } else if (otpCode?.length < 3) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter valid OTP code.",
                })
              );
            } else if (gAuthEnable == true && gOtpCode?.length < 6) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter correct 2FA code.",
                })
              );
            } else if (!recaptchaCheck) {
              dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
              console.log("recaptchaCheck=-=-=-=>>>", recaptchaCheck);
              captchaForm.show();
            } else {
              console.log(" ------------------API CALL START----------------- otpCode ", otpCode);
              console.log(" --------------API CALL START------------- session_type", session_type);

              Keyboard.dismiss();
              dispatch(
                loginUser({
                  // loginEmail: emailUser,
                  // loginPassword: pwdUser,
                  loginEmail: loginEmail,
                  loginPassword: loginPassword,
                  recaptchaCheck: recaptchaCheck,
                  recaptchaData: recaptchaData,
                  gOtpCode: gOtpCode,
                  gAuthEnable: gAuthEnable,
                  phone_number: selectedCountryCode + phoneUser,
                  session_type: session_type,
                  code: otpCode,
                })
              )
                .then((response) => {
                  dispatch(loginFormUpdate({ prop: "otpCode", value: "" }));

                  // console.log("onSubmitButtonPress=-status-=-=2", status);
                  setShowConvertBtn(false);
                  setShowOtpView(false);
                  dispatch(
                    loginFormUpdate({ prop: "gAuthEnable", value: true })
                  );
                  if (response.access_token) {
                    Actions.currentScene != "Main" && Actions.reset("Main");
                  }
                  // if (status) {
                  //   Actions.currentScene != "Main" && Actions.reset("Main");
                  // }
                })
                .catch((err) => {
                  // dispatch(loginFormUpdate({ prop: "otpCode", value: "" }));
                  // setOtpUser("");
                  console.log("onSubmitButtonPress=-err=-=-", err);
                  if (err == "identity.session.missing_otp") {
                    setShowConvertBtn(false);
                    setShowOtpView(false);
                    setShowGAuth(true);
                    // loginUserEnterAuth(dispatch, true);
                  } else if (err == "session.code_not_match") {
                    dispatch(loginFormUpdate({ prop: "otpCode", value: true }));
                  } else if (err == "identity.session.invalid_otp") {
                    dispatch(
                      loginFormUpdate({ prop: "gOtpCode", value: true })
                    );
                  }
                });
            }
          } else {
            console.log("check 2fa code=-=-=-=-=-=-=-", gOtpCode);
            if (otpUser?.length < 5) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter valid OTP code.",
                })
              );
            } else if (gAuthEnable == true && gOtpCode?.length < 6) {
              dispatch(
                loginFormUpdate({
                  prop: "loginError",
                  value: "Please enter correct 2FA code.",
                })
              );
            } else if (!recaptchaCheck) {
              dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
              captchaForm.show();
            } else {
              Keyboard.dismiss();
              dispatch(
                loginUser({
                  // loginEmail: emailUser,
                  // loginPassword: pwdUser,
                  loginEmail: loginEmail,
                  loginPassword: loginPassword,
                  recaptchaCheck: recaptchaCheck,
                  recaptchaData: recaptchaData,
                  gOtpCode: gOtpCode,
                  gAuthEnable: gAuthEnable,
                  phone_number: selectedCountryCode + phoneUser,
                  session_type: session_type,
                  code: otpCode,
                })
              )
                .then((response) => {
                  dispatch(loginFormUpdate({ prop: "otpCode", value: "" }));
                  console.log("onSubmitButtonPress=-response-=-=", response);
                  setShowConvertBtn(false);
                  setShowOtpView(false);

                  dispatch(
                    loginFormUpdate({ prop: "gAuthEnable", value: true })
                  );
                  if (response.access_token) {
                    Actions.currentScene != "Main" && Actions.reset("Main");
                  }
                  // if (status) {
                  //   Actions.currentScene != "Main" && Actions.reset("Main");
                  // }
                })
                .catch((err) => {
                  // dispatch(loginFormUpdate({ prop: "otpCode", value: "" }));
                  // setOtpUser("");
                  console.log("onSubmitButtonPress=-err=-=-", err);
                  if (err == "identity.session.missing_otp") {
                    setShowConvertBtn(false);
                    setShowOtpView(false);
                    setShowGAuth(true);
                    // loginUserEnterAuth(dispatch, true);
                  } else if (err == "session.code_not_match") {
                    dispatch(loginFormUpdate({ prop: "otpCode", value: true }));
                  } else if (err == "identity.session.invalid_otp") {
                    dispatch(
                      loginFormUpdate({ prop: "gOtpCode", value: true })
                    );
                  }
                  // else if (
                  //   error.errors[0] == 'identity.captcha.verification_failed'
                  // ) {
                  //   loginUserFail(
                  //     dispatch,
                  //     'Captcha session expired, please verify captcha again',
                  //   );
                  // }
                  // else {
                  //   if (err == "identity.captcha.verification_failed") {
                  //     // loginUserFail(dispatch, 'Captcha_Session_failed');

                  //   }

                  // }
                  // setShowOtpView(false);
                });
            }
          }
        }
      })
      .catch((err) => {
        console.log(
          "checkSessionMaintaining=-=-=-=dds->>>>",
          JSON.stringify(err)
        );
        if (
          err?.response?.status == 403 ||
          err?.response?.status == 503 ||
          err?.response?.status == "500" ||
          err?.response?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
        }
      });
  };
  const renderError = () => {
    if (loginError) {
      if (
        loginError == "Captcha_Session_failed" ||
        loginError == "Captcha session expired, please verify captcha again"
      ) {
        dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
        captchaForm.show();
      }

      return (
        <View>
          <Text style={styles.errorMessageStyle}>{loginError}</Text>
        </View>
      );
    }
  };

  const resetReducer = () => {
    dispatch(loginFormUpdate({ prop: "loginPassword", value: "" }));
    dispatch(loginFormUpdate({ prop: "loginEmail", value: "" }));
    dispatch(loginFormUpdate({ prop: "loginPhoneNumber", value: "" }));
    dispatch(loginFormUpdate({ prop: "loginError", value: "" }));
    dispatch(loginFormUpdate({ prop: "gAuthEnable", value: false }));
    dispatch(loginFormUpdate({ prop: "gOtpCode", value: "" }));
    dispatch(loginFormUpdate({ prop: "otpCode", value: "" }));
    dispatch(loginFormUpdate({ prop: "session_type", value: "email" }));
    dispatch(loginFormUpdate({ prop: "recaptchaCheck", value: false }));
    dispatch(loginFormUpdate({ prop: "loginLoading", value: false }));
    dispatch(loginFormUpdate({ prop: "recaptchaData", value: "" }));
  };

  const checkSessionMaintaining = () => {
    setLoader(true);
    return new Promise((resolve, reject) => {
      CoinCultApi.get(END_POINT.MAINTENANCE_SCREEN_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log("checkSessionMaintaining-=-- METHOD --=>>", response);
          if (response?.status === 200) {
            setLoader(false);
            status = response?.data === "false" ? false : true;
            // this.showMaintenanceAlert(status);
            // Singleton.getInstance().showMaintenance = status;
            setShowMaintaining(status);
            resolve(status);
          }
        })
        .catch((error) => {
          console.log(
            "checkSessionMaintaining-=error in METHOD----=>>",
            JSON.stringify(error)
          );
          reject(error);
          setLoader(false);
        });
    });
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
  const removeEmojis = (string) => {
    // emoji regex from the emoji-regex library
    const regex =
      /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g;

    return string.replace(regex, "");
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
  return (
    <>
      {showMaintaining ? (
        <MaintenanceScreen
          viewColor={{ backgroundColor: ThemeManager.colors.tabBackground }}
          maintainTextColor={{ color: ThemeManager.colors.textColor1 }}
          btnColor={{ color: ThemeManager.colors.selectedTextColor }}
          txtColor={{ color: ThemeManager.colors.textColor }}
          loaderState={loader}
          onPress={() => {
            checkSessionMaintaining();
          }}
        />
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: ThemeManager.colors.DashboardBG,
          }}
        >
          {showOtpView ? (
            <View>
              <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ alignItems: "flex-end" }}>
                    <TouchableOpacity
                      style={{
                        marginRight: 15, marginTop: 15, height: 45,
                        width: 45,
                      }}
                      onPress={() => {
                        // dispatch(resetGAuth());
                        setShowConvertBtn(false);
                        setShowOtpView(false);
                        resetReducer();
                      }}
                    >
                      <Image
                        source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                        style={{
                          height: 23,
                          width: 23,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 50, marginHorizontal: 15 }}>
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.medium,
                        fontSize: 26,
                      }}
                    >
                      {strings.titleName.sign_in}
                    </Text>

                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                        marginBottom: 5,
                      }}
                    >
                      {session_type == "email"
                        ? strings.login_page.enter_pin_code_which_is
                        : strings.login_page.enter_pin_code_which_is_phone}
                    </Text>
                    <Text
                      style={{
                        marginTop: 50,
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                        marginBottom: 5,
                      }}
                    >
                      {strings.titleName.otp_code}
                    </Text>
                  </View>
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
                      value={otpCode}
                      placeholder={`EG. "30345"`}
                      onChangeText={(value) => {
                        if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                          dispatch(loginFormUpdate({ prop: "otpCode", value }));
                          setOtpUser(value);
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
                      {!showConvertBtn && (
                        <TouchableOpacity
                          style={{
                            height: 40,
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                          onPress={() => {
                            // alert("hello");
                            onButtonResentPress();
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
                      {showConvertBtn && (
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
                    </View>
                  </View>

                  {/* <InputField
                    editable={true}
                    title={"EG. 30345"}
                    value={otpCode}
                    onChangeText={(value) => {
                      if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                        dispatch(loginFormUpdate({ prop: "otpCode", value }));
                        setOtpUser(value);
                      }
                    }}
                    maxlength={5}
                    keyboardType="numeric"
                    returnKeyType={"done"}
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                    }}
                  /> */}
                  <View style={{ marginTop: 40 }} />
                  <View style={[styles.errorStyleView, { marginTop: 0 }]}>
                    {renderError()}
                  </View>
                  <ButtonPrimary
                    style={{ marginTop: 10 }}
                    title={strings.titleName.logIn}
                    onPress={() => {
                      onSubmitButtonPress();
                    }}
                  />
                  <TouchableOpacity
                    style={{ marginHorizontal: 15, marginTop: 20 }}
                    onPress={() => {
                      Actions.Location();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {strings.titleName.dont_have_account}{" "}
                      <Text
                        style={{
                          color: colors.btnTextColor,
                        }}
                      >
                        {strings.titleName.signup_here}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
                <ConfirmGoogleCaptcha
                  siteKey={constants.RECAPTCHA_KEY}
                  baseUrl={END_POINT.COMMON_URL}
                  ref={(_ref) => (captchaForm = _ref)}
                  languageCode="en"
                  onMessage={(event) => {
                    onMessage(event);
                  }}
                />
              </ScrollView>
              <Loader isLoading={loginLoading} />
            </View>
          ) : (
            <>
              {gAuthEnable ? (
                <KeyboardAwareScrollView
                  bounces={false}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "flex-end" }}>
                      <TouchableOpacity
                        style={{
                          marginRight: 15, marginTop: 15, height: 45,
                          width: 45,
                        }}
                        onPress={() => {
                          dispatch(resetGAuth());
                        }}
                      >
                        <Image
                          source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                          style={{
                            height: 23,
                            width: 23,
                            resizeMode: "contain",
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 50, marginHorizontal: 15 }}>
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontFamily: Fonts.medium,
                          fontSize: 26,
                          marginBottom: 40,
                        }}
                      >
                        {strings.titleName.sign_in}
                      </Text>
                      <Text
                        style={{
                          marginTop: 50,
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.inactiveTextColor,
                          marginBottom: 5,
                        }}
                      >
                        {strings.titleName.enter_2fa}
                      </Text>
                    </View>
                    <InputField
                      editable={true}
                      title={`EG. "303555"`}
                      value={gOtpCode}
                      onChangeText={(value) => {
                        if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                          dispatch(
                            loginFormUpdate({ prop: "gOtpCode", value })
                          );
                          setGOtpUser(value);
                        }
                      }}
                      maxlength={6}
                      keyboardType="numeric"
                      returnKeyType={"done"}
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                      }}
                    />
                    <View style={{ marginTop: 40 }} />
                    <View style={[styles.errorStyleView, { marginTop: 0 }]}>
                      {renderError()}
                    </View>
                    <ButtonPrimary
                      style={{ marginTop: 10 }}
                      title={strings.titleName.logIn}
                      onPress={() => {
                        onSubmitButtonPress();
                      }}
                    />
                    <TouchableOpacity
                      style={{ marginHorizontal: 15, marginTop: 20 }}
                      onPress={() => {
                        Actions.Location();
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}
                      >
                        {strings.titleName.dont_have_account}{" "}
                        <Text
                          style={{
                            color: colors.btnTextColor,
                          }}
                        >
                          {strings.titleName.signup_here}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ConfirmGoogleCaptcha
                    siteKey={constants.RECAPTCHA_KEY}
                    baseUrl={END_POINT.COMMON_URL}
                    ref={(_ref) => (captchaForm = _ref)}
                    languageCode="en"
                    onMessage={(event) => {
                      onMessage(event);
                    }}
                  />
                  <Loader isLoading={loginLoading} />
                </KeyboardAwareScrollView>
              ) : (
                // <ImageBackground style={[
                //   { flex: 1 }
                // ]}
                //   source={ThemeManager.ImageIcons.bgImage}
                // >
                <SafeAreaView
                  style={{
                    flex: 1,
                    backgroundColor: ThemeManager.colors.bgNewColor,
                  }}
                >
                  <KeyboardAwareScrollView
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                    debounce={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                  >
                    <View style={{ flex: 1 }}>
                      {/* Commented below code because user can not skip login */}
                      <TouchableOpacity
                        onPress={() => {
                          // Actions.currentScene != 'Main' && Actions.Main()
                          // Actions.currentScene != '_Home' && Actions.reset('Main');
                          let a = props.fromScreen;
                          console.log("login move=-=a", a);
                          if (props?.fromScreen === "Wallets") {
                            Actions.currentScene !== "_Home" &&
                              Actions.reset("Main");
                          } else if (props?.fromScreen === "CardsScreen") {
                            Actions.currentScene !== "_Home" &&
                              Actions.reset("Main");
                          } else {
                            if (a != null || a != undefined) {
                              if (a === "Home") {
                                Actions.currentScene !== "_Home" &&
                                  Actions.reset("Main");
                              } else {
                                Actions.Main({ type: "reset" });
                                Actions[a]();
                              }
                            } else {
                              Actions.currentScene !== "_Home" &&
                                Actions.reset("Main");
                            }
                          }
                        }}
                        style={{
                          height: 45,
                          width: 45,
                          justifyContent: "flex-start",
                          alignSelf: "flex-end",
                          alignItems: "flex-end",
                          marginRight: 20,
                          marginTop: 20,
                          // backgroundColor: 'red',
                        }}
                      >
                        <Image
                          source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                          style={{
                            height: 23,
                            width: 23,
                            resizeMode: "contain",
                            // tintColor: ThemeManager.colors.headTxt,
                          }}
                        />
                      </TouchableOpacity>
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
                      Actions.currentScene != 'Main' && Actions.Main();
                    }}
                  /> */}



                      <Image style={{ marginLeft: 10, tintColor: ThemeManager.colors.imageLogoTintColor }} source={Images.loginLogo} />
                      <Text
                        onPress={() => {
                          let a = "2022-06-16 10:58:51 +0000";
                          let b = a.split(" ");
                          a = b[0] + "T" + b[1];
                          console.log("-----", a);
                          // let b = moment(a).format('MM/DD/YYYY h:mm:ss');
                          // console.log('-----', new Date(b).getTime());
                        }}
                        style={{
                          marginTop: 40,
                          marginHorizontal: 16,
                          color: ThemeManager.colors.headTxt,
                          fontFamily: fonts.medium,
                          fontSize: 22,
                        }}
                      >
                        {/* {constants.APP_NAME} {strings.login_page.account_login} */}
                        {strings.login_page.account_login}
                      </Text>
                      {/* <SubHeaderLinks
                          customNavigationLoginStyle={{ marginTop: "10%" }}
                          forEmail
                          navItems={NAVDATA}
                          selectedPage={selectedPage}
                          onPress={({ item, index }) => {
                            console.log("check index value=-=-=>>>222--", index);
                            resetReducer();
                            if (index === 0) {
                              console.log("check index --", index);
                              setSessionTypeUser("email");
                              dispatch(
                                loginFormUpdate({
                                  prop: "session_type",
                                  value: "email",
                                })
                              );
                            } else {
                              console.log("check index -else-", index);
                              setSessionTypeUser("phone");

                              dispatch(
                                loginFormUpdate({
                                  prop: "session_type",
                                  value: "phone",
                                })
                              );
                            }
                            <SubHeaderLinks
                              customNavigationLoginStyle={{ marginTop: "10%" }}
                              forEmail
                              navItems={NAVDATA}
                              selectedPage={selectedPage}
                              onPress={({ item, index }) => {
                                console.log("check index value=-=-=>>>", index);
                                setSelectedPage(index);
                                pagera.setPage(index);
                              }}
                              GET_COIN_BALANCE_LIST
                            />;
                            setSelectedPage(index);
                            pagera.setPage(index);
                          }}
                          GET_COIN_BALANCE_LIST
                        /> */}
                      <PagerView
                        ref={(ref) => (pagera = ref)}
                        style={styles.pagerView}
                        initialPage={0}
                        scrollEnabled={false}
                        onPageScroll={(event) => {
                          // EventRegister.emit('clearData', '');
                        }}
                        onPageSelected={(event) => {
                          setSelectedPage(event.nativeEvent.position);
                        }}
                      >
                        <View key="1">
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                              style={[
                                styles.inputTitle,
                                { color: ThemeManager.colors.textBW },
                              ]}
                            >
                              {strings.login_page.email}
                            </Text>
                            <TouchableOpacity

                              onPress={() => {
                                setSelectedPage(1);
                                pagera.setPage(1);
                              }}
                            >
                              <Text
                                style={[
                                  styles.inputTitle,
                                  { color: ThemeManager.colors.textBW },
                                ]}
                              >
                                {strings.login_page.switchPhoneNumber}
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <InputField
                            editable={true}
                            title={strings.login_page.email}
                            value={loginEmail}
                            onChangeText={(value) => {
                              // let text = removeEmojis(value);
                              dispatch(
                                loginFormUpdate({ prop: "loginEmail", value })
                              );
                              setEmailUser(value);
                            }}
                            maxlength={100}
                            keyboardType="email-address"
                            // keyboardType={
                            //   Platform.OS === "ios"
                            //     ? "ascii-capable"
                            //     : "visible-password"
                            // }
                            customContainerStyle={{
                              backgroundColor: ThemeManager.colors.SwapInput,
                            }}
                          />
                          <Text
                            style={[
                              styles.inputTitle,
                              { color: ThemeManager.colors.textBW },
                            ]}
                          >
                            {strings.login_page.password}
                          </Text>
                          <InputField
                            editable={true}
                            title={strings.login_page.password}
                            value={loginPassword}
                            onChangeText={(value) => {
                              dispatch(
                                loginFormUpdate({
                                  prop: "loginPassword",
                                  value,
                                })
                              );
                              setPwdUser(value);
                            }}
                            maxlength={100}
                            keyboardType="default"
                            secureTextEntry={ViewPassword ? false : true}
                            image={
                              !ViewPassword
                                ? { uri: ThemeManager.ImageIcons.icon_hide_eye }
                                : { uri: ThemeManager.ImageIcons.icon_open_eye }
                            }
                            rightImageStyle={{
                              tintColor: ThemeManager.colors.textColor1,
                            }}
                            onPress={() => {
                              setViewPassword(!ViewPassword);
                            }}
                            // {tintColor: ThemeManager.colors.textColor1},
                            customContainerStyle={{
                              backgroundColor: ThemeManager.colors.SwapInput,
                            }}
                          />
                          <View style={{ marginTop: 30 }} />
                          <View
                            style={[styles.errorStyleView, { marginTop: 0 }]}
                          >
                            {renderError()}
                          </View>

                          <View style={{ marginTop: 25 }}>
                            <ButtonPrimary
                              title={strings.login_page.login}
                              onPress={() => {
                                onButtonPress();
                              }}
                            />
                          </View>

                          <TouchableOpacity
                            style={[styles.forgotPasswordView]}
                            onPress={() => {
                              resetReducer();
                              Actions.ResetPassword();
                            }}
                          >
                            <Text style={styles.text}>
                              {strings.login_page.forgot_password}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.RegisterView}
                            onPress={() => {
                              resetReducer();
                              Actions.Location();
                            }}
                          >
                            <Text style={styles.text}>
                              {strings.login_page.register_now}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View key="2">

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                              style={[
                                styles.inputTitle,
                                { color: ThemeManager.colors.textBW },
                              ]}
                            >
                              Mobile
                            </Text>
                            <TouchableOpacity

                              onPress={() => {
                                setSelectedPage(0);
                                pagera.setPage(0);
                              }}
                            >
                              <Text
                                style={[
                                  styles.inputTitle,
                                  { color: ThemeManager.colors.textBW },
                                ]}
                              >
                                {strings.login_page.switchEMail}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          {/* <PhoneNumberInput
                                  verifyLable={styles.notShow}
                                   placeHolder="Mobile Number"
                                  verifyInputStyle={styles.inputStyle}
                                    countryCodeText={props.mobilePhoneCode}
                                  placeHolderTextColor={
                                     ThemeManager.colors.inactiveTextColor
                                   }
                                  maxLength={15}
                                  countryCodeClicked={() => setModalCountryVisible(true)}
                                     onChangeText={(value) => {
                                     let extraSpaceRegex = /^\s*\s*$/;
                                    }}
                                     /> */}
                          <PhoneNumberInput
                            verifyLable={styles.notShow}
                            codeTextStyle={{
                              color: ThemeManager.colors.textColor1,
                            }}
                            placeHolder="Mobile Number"
                            countryCodeText={selectedCountryCode}
                            customStyle={{
                              backgroundColor: ThemeManager.colors.SwapInput,
                              // backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
                              // borderWidth: 1,
                              borderRadius: 25,
                            }}
                            value={loginPhoneNumber}
                            verifyInputStyle={{
                              color: ThemeManager.colors.textColor1,
                            }}
                            placeHolderTextColor={
                              ThemeManager.colors.anouncementtextColour
                            }
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
                                  loginFormUpdate({
                                    prop: "loginPhoneNumber",
                                    value: value,
                                  })
                                );
                                setPhoneUser(value);
                              }
                            }}
                          />
                          <Text
                            style={[
                              styles.inputTitle,
                              { color: ThemeManager.colors.textBW },
                            ]}
                          >
                            {strings.login_page.password}
                          </Text>
                          <InputField
                            editable={true}
                            title={strings.login_page.password}
                            value={loginPassword}
                            onChangeText={(value) => {
                              dispatch(
                                loginFormUpdate({
                                  prop: "loginPassword",
                                  value,
                                })
                              );
                              setPwdUser(value);
                            }}
                            maxlength={100}
                            keyboardType="default"
                            secureTextEntry={ViewPassword ? false : true}
                            image={
                              !ViewPassword
                                ? { uri: ThemeManager.ImageIcons.icon_hide_eye }
                                : { uri: ThemeManager.ImageIcons.icon_open_eye }
                            }
                            rightImageStyle={{
                              tintColor: ThemeManager.colors.textColor1,
                            }}
                            onPress={() => {
                              setViewPassword(!ViewPassword);
                            }}
                            // {tintColor: ThemeManager.colors.textColor1},
                            customContainerStyle={{
                              backgroundColor: ThemeManager.colors.SwapInput,
                            }}
                          />
                          {/* <InputField
                        editable={true}
                        title={strings.login_page.password}
                        onChangeText={(value) => {}}
                        maxlength={100}
                        image={{ uri: Images.viewPasswordPressed_icon }}
                        customContainerStyle={{
                          backgroundColor: ThemeManager.colors.SwapInput,
                        }}
                      /> */}
                          <View style={{ marginTop: 30 }}>
                            <View
                              style={[
                                styles.errorStyleView,
                                { marginTop: 0, marginBottom: 20 },
                              ]}
                            >
                              {renderError()}
                            </View>
                            <ButtonPrimary
                              style={{ marginTop: 5 }}
                              title={strings.titleName.logIn}
                              onPress={() => {
                                onButtonPress();
                              }}
                            />
                          </View>
                          <TouchableOpacity
                            style={[styles.forgotPasswordView]}
                            onPress={() => {
                              resetReducer();
                              Actions.ResetPassword();
                            }}
                          >
                            <Text style={styles.text}>
                              {strings.login_page.forgot_password}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.RegisterView}
                            onPress={() => {
                              resetReducer();
                              Actions.Location();
                            }}
                          >
                            <Text style={styles.text}>
                              {strings.login_page.register_now}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </PagerView>
                      <ConfirmGoogleCaptcha
                        siteKey={constants.RECAPTCHA_KEY}
                        baseUrl={END_POINT.COMMON_URL}
                        ref={(_ref) => (captchaForm = _ref)}
                        languageCode="en"
                        onMessage={(event) => {
                          onMessage(event);
                        }}
                      />
                      {loginLoading && <Loader />}
                    </View>
                  </KeyboardAwareScrollView>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalCountryVisible}
                    onRequestClose={() => setModalCountryVisible(false)}
                  >
                    <View style={styles.modelContainer}>
                      <TouchableOpacity
                        style={{ width: "100%", height: "100%" }}
                        onPress={() => setModalCountryVisible(false)}
                      />

                      <View style={styles.modelContainerChild}>
                        <HeaderCancel
                          headerBtnText={styles.btnBack}
                          titleText={strings.login_page.select_country}
                          onPressBtnBack={() => {
                            setModalCountryVisible(false);
                          }}
                        />
                        <CountryList
                          placeHolder={strings.login_page.search_country}
                          hideDialCode={false}
                          selectedListItem={(item) => {
                            setModalCountryVisible(false);
                            let value = item.dial_code;
                            alert(value);
                          }}
                        />
                      </View>
                    </View>
                  </Modal>
                  <Loader isLoading={loginLoading} />
                </SafeAreaView>
                // </ImageBackground>
              )}
            </>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCountryVisible}
            onRequestClose={() => setModalCountryVisible(false)}
          >
            <View style={styles.modelContainer}>
              <TouchableOpacity
                style={{ width: "100%", height: "100%" }}
                onPress={() => setModalCountryVisible(false)}
              />

              <View style={styles.modelContainerChild}>
                <HeaderCancel
                  headerBtnText={styles.btnBack}
                  titleText={strings.login_page.select_country}
                  onPressBtnBack={() => {
                    setModalCountryVisible(false);
                  }}
                />
                <CountryList
                  placeHolder={strings.login_page.search_country}
                  hideDialCode={false}
                  selectedListItem={(item) => {
                    setModalCountryVisible(false);
                    let value = item.dial_code;
                    alert(value);
                  }}
                />
              </View>
            </View>
          </Modal>
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
              darkMode={
                ThemeManager.colors.themeColor === "light" ? false : true
              }
              style={{ backgroundColor: ThemeManager.colors.modalBox }}
              screenStyle={[
                styles.screenStyle,
                { backgroundColor: "transparent" },
              ]}
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
                          source={{ uri: ThemeManager.ImageIcons.icon_search_text }
                          }
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
                        marginBottom: 5,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {strings.location.countryRegion}
                    </Text>
                    <BorderLine />
                    {/* <FlatList
                  style={styles.countryList}
                  data={countryData}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                      onPress={() => {
                        var phoneCode = item.countryCallingCode;
                        setSelectedCountry(item.countryNameEn);
                        setSelectedCountryFlag(item.flag);
                        setSelectedCountryCode(item.countryCallingCode);
                        setModalVisible(false);
                        setCountryData(countryFlags);
                      }}>
                      <View style={{borderRadius: 15, marginRight: 10}}>
                        <Text style={{fontSize: 16, marginTop: 10}}>
                          {item.flag}
                        </Text>
                      </View>
                      <Text
                        style={{
                          marginTop: 15,
                          fontSize: 16,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.textColor1,
                        }}>
                        {item.countryNameEn}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={() => {
                    return <View style={{marginBottom: 20}}></View>;
                  }}
                  scrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                  // extraData={this.props.selected}
                /> */}
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
      )}
    </>
  );
};

export default Login;
