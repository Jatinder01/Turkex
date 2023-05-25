import {
  GOOGLEAUTH_SUBMIT,
  GOOGLEAUTH_DETAIL_SUCCESS,
  GOOGLEAUTH_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  qrCodeError: '',
  qrCodeDetails: null,
  qrCodeLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOOGLEAUTH_SUBMIT:
      return {...state, qrCodeLoading: true, qrCodeError: ''};
    case GOOGLEAUTH_DETAIL_SUCCESS:
      return {...state, qrCodeDetails: action.payload, qrCodeLoading: false};
    case GOOGLEAUTH_FAIL:
      return {...state, qrCodeError: action.payload, qrCodeLoading: false};

    default:
      return state;
  }
};
