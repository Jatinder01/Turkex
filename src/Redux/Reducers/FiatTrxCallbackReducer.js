import {
  CALLBACK_FIAT_DEPOSIT_SUBMIT,
  CALLBACK_FIAT_DEPOSIT_UPDATE,
  CALLBACK_FIAT_DEPOSIT_SUCCESS,
  CALLBACK_FIAT_DEPOSIT_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  fiatTrxCallbackError: '',
  fiatTrxCallback: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CALLBACK_FIAT_DEPOSIT_SUBMIT:
      return {...state, isLoading: true, fiatTrxCallbackError: ''};
    case CALLBACK_FIAT_DEPOSIT_SUCCESS:
      return {...state, fiatTrxCallback: action.payload, isLoading: false};
    case CALLBACK_FIAT_DEPOSIT_FAIL:
      return {...state, fiatTrxCallbackError: action.payload, isLoading: false};

    default:
      return state;
  }
};
