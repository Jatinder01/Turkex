import {
  REGISTER_FORM_UPDATE,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER,
  RESET_REGISTER,
  REGISTER_FIELD_VALIDATE,
  //otp verify
  REGISTER_EMAIL_VERIFY_SUCCESS,
  REGISTER_EMAIL_VERIFY_FAIL,
  REGISTER_EMAIL_VERIFY_RESET,
  REGISTER_EMAIL_VERIFY_UPDATE,
  REGISTER_EMAIL_VERIFY_SUBMIT,

  //resend otp
  RESEND_EMAIL_OTP_SUCCESS,
  RESEND_EMAIL_OTP_SUBMIT,
  RESEND_EMAIL_OTP_FAIL,
  RESEND_EMAIL_OTP_RESET,
  RESEND_EMAIL_OTP_UPDATE,

  //resend phone otp
  RESEND_PHONE_OTP_SUCCESS,
  RESEND_PHONE_OTP_SUBMIT,
  RESEND_PHONE_OTP_FAIL,
  RESEND_PHONE_OTP_RESET,
  RESEND_PHONE_OTP_UPDATE,

  //edit phone number
  EDIT_PHONE_NUMBER_SUCCESS,
  EDIT_PHONE_NUMBER_SUBMIT,
  EDIT_PHONE_NUMBER_FAIL,
  EDIT_PHONE_NUMBER_RESET,
  UPDATE_EDIT_PHONE_NUMBER,
} from "../Actions/types";

const INITIAL_STATE = {
  registerEmail: "",
  registerEmailOtp: "",

  registerPassword: "",
  registerCountry: "",
  registerCountryName: "",
  registerCountryNameCode: "",
  registerCountryCode: "",
  registerFirstName: "",
  registerLastName: "",
  registerMiddleName: "",

  registerPhoneNumber: "",
  registerPhoneNumberWithCode: "",
  registerPhoneNumberOtp: "",
  registerCountryCallingCode: "",
  registerCountryCallingFlag: "",
  registerReferralId: "",
  registerUser: null,
  registerVerify: null,
  registerRefID: "",
  registerError: "",
  registerOtpError: "",
  regOtpLoading: false,
  regVerifyLoading: false,

  regLoading: false,
  recaptchaCheck: false,
  recaptchaData: "",
  securePassword: true,
  confSecurePassword: true,
  validation: false,

  editPhoneData: null,
  isLoadingEditPhone: false,
  errorEditPhone: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //Edit phone number
    case EDIT_PHONE_NUMBER_RESET:
      return { ...state, ...INITIAL_STATE };
    case UPDATE_EDIT_PHONE_NUMBER:
      return { ...state, [action.payload.prop]: action.payload.value };
    case EDIT_PHONE_NUMBER_SUBMIT:
      return { ...state, isLoadingEditPhone: true, errorEditPhone: "" };
    case EDIT_PHONE_NUMBER_SUCCESS:
      return {
        ...state,
        editPhoneData: action.payload,
        isLoadingEditPhone: false,
        errorEditPhone: false,
      };
    case EDIT_PHONE_NUMBER_FAIL:
      return {
        ...state,
        errorEditPhone: action.payload,
        isLoadingEditPhone: false,
      };
    //
    case REGISTER_FORM_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case REGISTER_USER:
      return { ...state, regLoading: true, registerError: "" };
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        registerUser: action.payload,
        regOtpLoading: false,
        regLoading: false,
      };
    case REGISTER_USER_FAIL:
      return {
        ...state,
        registerError: action.payload,
        recaptchaData: "",
        recaptchaCheck: false,
        regLoading: false,
      };
    case RESET_REGISTER:
      return { ...state, ...INITIAL_STATE };

    //otp verify
    case REGISTER_EMAIL_VERIFY_RESET:
      return { ...state, ...INITIAL_STATE };
    case REGISTER_EMAIL_VERIFY_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case REGISTER_EMAIL_VERIFY_SUBMIT:
      return { ...state, regVerifyLoading: true, registerOtpError: "" };
    case REGISTER_EMAIL_VERIFY_SUCCESS:
      return {
        ...state,
        registerVerify: action.payload,
        regOtpLoading: false,
        regLoading: false,
        regVerifyLoading: false,
      };
    case REGISTER_EMAIL_VERIFY_FAIL:
      return {
        ...state,
        registerOtpError: action.payload,
        regOtpLoading: false,
        regVerifyLoading: false,
      };

    //email resend otp

    //otp verify
    case RESEND_EMAIL_OTP_RESET:
      return { ...state, ...INITIAL_STATE };
    case RESEND_EMAIL_OTP_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case RESEND_EMAIL_OTP_SUBMIT:
      return { ...state, regOtpLoading: true, registerOtpError: "" };
    case RESEND_EMAIL_OTP_SUCCESS:
      return {
        ...state,
        registerVerify: action.payload,
        regOtpLoading: false,
        regLoading: false,
      };
    case RESEND_EMAIL_OTP_FAIL:
      return {
        ...state,
        registerOtpError: action.payload,
        regOtpLoading: false,
      };
    //phone otp resend
    case RESEND_PHONE_OTP_RESET:
      return { ...state, ...INITIAL_STATE };
    case RESEND_PHONE_OTP_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case RESEND_PHONE_OTP_SUBMIT:
      return { ...state, regOtpLoading: true, registerOtpError: "" };
    case RESEND_PHONE_OTP_SUCCESS:
      return {
        ...state,
        registerVerify: action.payload,
        regOtpLoading: false,
        regLoading: false,
      };
    case RESEND_PHONE_OTP_FAIL:
      return {
        ...state,
        registerOtpError: action.payload,
        regOtpLoading: false,
      };
    default:
      return state;
  }
};
