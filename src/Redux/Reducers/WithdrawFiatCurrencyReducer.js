import {
  WITHDRAW_FIAT_COIN_SUBMIT,
  WITHDRAW_FIAT_COIN_SUCCESS,
  WITHDRAW_FIAT_COIN_FAIL,
  WITHDRAW_FIAT_COIN_UPDATE,
  RESET_WITHDRAW_FIAT_COIN,
  BENIFI_FIAT_ACTIVATE_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  withdrawFiatInfo: null,
  withdrawFiatError: '',
  isLoading: false,
  withdrawFiatUpdate: '',
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WITHDRAW_FIAT_COIN_SUBMIT:
      return {
        ...state,
        isLoading: true,
        withdrawFiatError: '',
        withdrawFiatInfo: null,
      };
    case WITHDRAW_FIAT_COIN_UPDATE:
      return {
        ...state,
        withdrawFiatUpdate: action.payload.value,
        withdrawFiatError: '',
        isLoading: false,
      };

    case WITHDRAW_FIAT_COIN_SUCCESS:
      return {
        ...state,
        withdrawFiatInfo: action.payload,
        withdrawFiatError: '',
        isLoading: false,
      };

    case RESET_WITHDRAW_FIAT_COIN:
      return {...state, ...INITIAL_STATE};

    case WITHDRAW_FIAT_COIN_FAIL:
      return {
        ...state,
        withdrawFiatError: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
