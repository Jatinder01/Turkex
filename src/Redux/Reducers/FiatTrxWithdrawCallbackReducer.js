import {
  CALLBACK_FIAT_WITHDRAW_SUBMIT,
  CALLBACK_FIAT_WITHDRAW_UPDATE,
  CALLBACK_FIAT_WITHDRAW_SUCCESS,
  CALLBACK_FIAT_WITHDRAW_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  fiatTrxWithdrawCallbackError: '',
  fiatTrxWithdrawCallback: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CALLBACK_FIAT_WITHDRAW_SUBMIT:
      return {...state, isLoading: true, fiatTrxWithdrawCallbackError: ''};
    case CALLBACK_FIAT_WITHDRAW_SUCCESS:
      return {
        ...state,
        fiatTrxWithdrawCallback: action.payload,
        isLoading: false,
      };
    case CALLBACK_FIAT_WITHDRAW_FAIL:
      return {
        ...state,
        fiatTrxWithdrawCallbackError: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};
