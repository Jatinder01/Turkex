import {
  MOBILE_VERIFY_FORM_UPDATE,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAIL,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  MOBILE_VERIFY_SUBMIT,
  MOBILE_VERIFY_RESET,
} from '../Actions/types';
import * as constants from '../../Constants';
import {Alert} from 'react-native';
const INITIAL_STATE = {
  mobilePhoneCode: '1',
  mobilePhoneNO: '',
  mobileVerifyError: '',
  mobileOtp: '',
  mobileVerifyLoading: false,
  mobileVerifyDetails: null,
  sendOtpDetails: null,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MOBILE_VERIFY_RESET:
      return {...state, ...INITIAL_STATE};
    case MOBILE_VERIFY_FORM_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        mobileVerifyError: '',
      };
    case MOBILE_VERIFY_SUBMIT:
      return {...state, mobileVerifyLoading: true, mobileVerifyError: ''};
    case SEND_OTP_SUCCESS:
      return {
        ...state,
        sendOtpDetails: action.payload,
        mobileVerifyLoading: false,
      };
    case SEND_OTP_FAIL:
      return {
        ...state,
        mobileVerifyError: action.payload,
        mobileVerifyLoading: false,
      };
    case VERIFY_OTP_SUCCESS:
      return {...state, mobileVerifyDetails: action.payload, ...INITIAL_STATE};
    case VERIFY_OTP_FAIL:
      return {
        ...state,
        mobileVerifyError: action.payload,
        mobileVerifyLoading: false,
        mobileOtp: '',
      };

    default:
      return state;
  }
};
