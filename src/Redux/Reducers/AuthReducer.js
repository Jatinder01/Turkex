import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGIN_FORM_UPDATE,
  LOGIN_USER_ENABLE_AUTH,
  LOGOUT_USER_SUCCESS,
  EMPTY_CAPTCHA,
  UPDATE_USER_DATA,
  AUTH_FIELD_VALIDATE,
  GAUTH_RESET,
  LOGIN_USER_OTP_FAIL,
  //email
  LOGIN_EMAIL_OTP_SUCCESS,
  LOGIN_EMAIL_OTP_FAIL,
  LOGIN_EMAIL_OTP_SUBMIT,
  LOGIN_EMAIL_OTP_RESET,
  //phone
  LOGIN_PHONE_OTP_SUCCESS,
  LOGIN_PHONE_OTP_FAIL,
  LOGIN_PHONE_OTP_SUBMIT,
  LOGIN_PHONE_OTP_RESET,
  LOGOUT_USER_FAIL,
  //first
  LOGIN_USER_FIRST_FAIL,
  LOGIN_USER_FIRST_SUCCESS,
  LOGIN_USER_FIRST_SUBMIT,
} from "../Actions/types";

const INITIAL_STATE = {
  loginEmail: "",
  loginPassword: "",
  loginError: "",
  logoutError: "",
  otpCode: "",
  phoneOtpIsLoading: false,
  emailOtpIsLoading: false,
  loginPhoneNumber: "",
  loginCountryCode: "",
  loginCountryCallingFlag: "",
  loginCountryName: "",
  session_type: "email",
  verificationError: "",
  emailOtp: "",
  phoneOtp: "",
  phoneOtpError: "",
  emailOtpError: "",
  otpData: null,
  gAuthEnable: false,
  gOtpCode: "",
  loginLoading: false,
  recaptchaData: "",
  recaptchaCheck: false,
  securePassword: true,
  userData: null,
  validation: false,
  currentTheme: "0",
  currentLanguage: "",
  loginUserFirst: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAUTH_RESET:
      return { ...state, ...INITIAL_STATE };
    case LOGIN_EMAIL_OTP_RESET:
      return { ...state, ...INITIAL_STATE };
    case LOGIN_FORM_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case AUTH_FIELD_VALIDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case LOGIN_USER:
      return { ...state, loginLoading: true, loginError: "" };
    case LOGIN_USER_FIRST_SUBMIT:
      return { ...state, loginLoading: true, loginError: "" };
    case LOGIN_EMAIL_OTP_SUBMIT:
      return {
        ...state,
        phoneOtpIsLoading: true,
        emailOtpIsLoading: true,
        phoneOtpError: "",
        emailOtpError: "",
      };

    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loginUser: action.payload,
        loginLoading: false,
        // ...INITIAL_STATE,
      };
    case LOGIN_USER_FIRST_SUCCESS:
      return {
        ...state,
        loginUserFirst: action.payload,
        loginLoading: false,
        // ...INITIAL_STATE,
      };
    case LOGIN_EMAIL_OTP_SUCCESS:
      return {
        ...state,
        otpData: action.payload,
        emailOtpIsLoading: false,
        ...INITIAL_STATE,
      };
    case LOGIN_EMAIL_OTP_FAIL:
      return {
        ...state,
        loginError: action.payload,
        emailOtpIsLoading: false,
      };
    case LOGIN_PHONE_OTP_SUCCESS:
      return {
        ...state,
        otpData: action.payload,
        phoneOtpIsLoading: false,
        // ...INITIAL_STATE,
      };
    case LOGIN_PHONE_OTP_FAIL:
      return {
        ...state,
        loginError: action.payload,
        phoneOtpIsLoading: false,
      };
    case LOGOUT_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE };
    case LOGIN_USER_ENABLE_AUTH:
      return { ...state, gAuthEnable: action.payload, loginLoading: false };
    case EMPTY_CAPTCHA:
      return {
        ...state,
        recaptchaData: "",
        recaptchaCheck: false,
      };
    case LOGIN_USER_FAIL:
      return {
        ...state,
        loginError: action.payload,
        loginLoading: false,
      };
    case LOGIN_USER_OTP_FAIL:
      return {
        ...state,
        loginError: action.payload,
        loginLoading: false,
      };
    case LOGIN_USER_FIRST_FAIL:
      return {
        ...state,
        loginError: action.payload,
        loginLoading: false,
      };
    case LOGOUT_USER_FAIL:
      return {
        ...state,
        loginError: "",
        logoutError: action.payload,
        loginLoading: false,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case "CHANGE_THEME":
      return { ...state, currentTheme: action.payload };
    case "CHANGE_LANGUAGE":
      return { ...state, currentLanguage: action.payload };
    default:
      return state;
  }
};
