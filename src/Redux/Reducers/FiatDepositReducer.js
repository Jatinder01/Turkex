import {
  FIAT_BANK_UPDATE,
  FIAT_BANK_SUBMIT,
  FIAT_BANK_SUCCESS,
  FIAT_BANK_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  fiatDepositError: '',
  fiatDepositSuccess: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FIAT_BANK_SUBMIT:
      return {...state, isLoading: true, fiatDepositError: ''};
    case FIAT_BANK_SUCCESS:
      return {...state, fiatDepositSuccess: action.payload, isLoading: false};
    case FIAT_BANK_FAIL:
      return {...state, fiatDepositError: action.payload, isLoading: false};
    default:
      return state;
  }
};
