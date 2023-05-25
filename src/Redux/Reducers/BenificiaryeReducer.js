import {
  BENIFI_DETAILS_SUBMIT,
  BENIFI_DETAILS_FORM_UPDATE,
  BENIFI_DETAILS_FAIL,
  BENIFI_DETAILS_SUCCESS,
  RESET_BENIFICIARY_FORM,
  BENIFI_LIST_DETAILS_SUCCESS,
  //
  DELETE_BENIFICIARY_SUBMIT,
  FAIL_DELETE_BENIFICIARY,
  SUCCESS_DELETE_BENIFICIARY,
  RESET_DELETE_BENIFICIARY,
} from '../Actions/types';

const INITIAL_STATE = {
  beniName: '',
  beniAddress: '',
  beniOtp: '',
  beniDesc: '',
  isLoadingBeni: false,
  isLoadingDelete: false,
  beniErrorDelete: '',

  beniError: '',
  allBenificiaries: [],
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RESET_BENIFICIARY_FORM:
      return {...state, ...INITIAL_STATE};
    case RESET_DELETE_BENIFICIARY:
      return {...state, ...INITIAL_STATE};
    case BENIFI_DETAILS_FORM_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        beniError: '',
      };
    case BENIFI_DETAILS_SUBMIT:
      return {...state, isLoadingBeni: true, beniError: ''};
    case DELETE_BENIFICIARY_SUBMIT:
      return {...state, isLoadingDelete: true, beniErrorDelete: ''};

    case BENIFI_LIST_DETAILS_SUCCESS:
      return {...state, allBenificiaries: action.payload, isLoadingBeni: false};
    case SUCCESS_DELETE_BENIFICIARY:
      return {...state, allBenificiaries: action.payload, isLoadingBeni: false};

    case BENIFI_DETAILS_SUCCESS:
      return {...state, ...INITIAL_STATE};
    case BENIFI_DETAILS_FAIL:
      return {...state, beniError: action.payload, isLoadingBeni: false};
    case FAIL_DELETE_BENIFICIARY:
      return {
        ...state,
        beniErrorDelete: action.payload,
        isLoadingDelete: false,
      };

    default:
      return state;
  }
};
