import {
  BENIFI_FIAT_DETAILS_SUBMIT,
  BENIFI_FIAT_DETAILS_FORM_UPDATE,
  BENIFI_FIAT_DETAILS_FAIL,
  BENIFI_FIAT_DETAILS_SUCCESS,
  RESET_FIAT_BENIFICIARY_FORM,
  BENIFI_FIAT_LIST_DETAILS_SUCCESS,
  DELETE_FIAT_BENIFICIARY_SUBMIT,
  FAIL_FIAT_DELETE_BENIFICIARY,
  SUCCESS_FIAT_DELETE_BENIFICIARY,
  RESET_FIAT_DELETE_BENIFICIARY,
  //resend otp
  RESEND_FIAT_BENIFICIARY_OTP_SUBMIT,
  RESEND_FIAT_BENIFICIARY_OTP_SUCCESS,
  RESEND_FIAT_BENIFICIARY_OTP_FAIL,
  BENIFI_FIAT_ACTIVATE_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  beniNameFiat: '',
  beniAccountNo: '',
  beniBankCode: '',
  currency: '',
  beniOtp: '',
  beniDesc: '',
  isLoadingBeni: false,
  isLoading: false,
  deleteFiatMessage: '',
  isLoadingDelete: false,
  beniErrorDelete: '',
  beniError: '',
  allBenificiariesFiat: [],
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RESET_FIAT_BENIFICIARY_FORM:
      return {...state, allBenificiariesFiat: [], ...INITIAL_STATE};
    case RESET_FIAT_DELETE_BENIFICIARY:
      return {...state, ...INITIAL_STATE};
    case BENIFI_FIAT_DETAILS_FORM_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        beniError: '',
      };
    case BENIFI_FIAT_DETAILS_SUBMIT:
      return {
        ...state,
        isLoadingBeni: true,
        beniError: '',
        allBenificiariesFiat: [],
      };
    case DELETE_FIAT_BENIFICIARY_SUBMIT:
      return {...state, isLoadingDelete: true, beniErrorDelete: ''};

    case BENIFI_FIAT_LIST_DETAILS_SUCCESS:
      return {
        ...state,
        allBenificiariesFiat: action.payload,
        // deleteFiatMessage: '',
        isLoadingBeni: false,
      };
    case SUCCESS_FIAT_DELETE_BENIFICIARY:
      return {
        ...state,
        deleteFiatMessage: action.payload,
        isLoadingBeni: false,
        isLoading: false,
        isLoadingDelete: false,
      };
    case BENIFI_FIAT_DETAILS_SUCCESS:
      return {...state, ...INITIAL_STATE};
    case BENIFI_FIAT_DETAILS_FAIL:
      return {...state, beniError: action.payload, isLoadingBeni: false};
    case RESEND_FIAT_BENIFICIARY_OTP_SUBMIT:
      return {...state, beniError: action.payload, isLoading: true};
    case RESEND_FIAT_BENIFICIARY_OTP_SUCCESS:
      return {...state, isLoading: false, ...INITIAL_STATE};
    case BENIFI_FIAT_ACTIVATE_FAIL:
      return {
        ...state,
        beniError: action.payload,
        isLoading: false,
        isLoadingBeni: false,
      };
    case RESEND_FIAT_BENIFICIARY_OTP_FAIL:
      return {...state, beniError: action.payload, isLoading: false};
    case FAIL_FIAT_DELETE_BENIFICIARY:
      return {
        ...state,
        beniErrorDelete: action.payload,
        isLoadingDelete: false,
      };

    default:
      return state;
  }
};
