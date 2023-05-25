import {
  BANXA_BUY_CRYPTO_CALLBACK_SUBMIT,
  BANXA_BUY_CRYPTO_CALLBACK_SUCCESS,
  BANXA_BUY_CRYPTO_CALLBACK_FAIL,
  BANXA_BUY_CRYPTO_CALLBACK_UPDATE,
  RESET_BANXA_BUY_CRYPTO_CALLBACK,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaBuyCryptoCallback: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_BUY_CRYPTO_CALLBACK_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaBuyCryptoCallback: null,
      };
    case RESET_BANXA_BUY_CRYPTO_CALLBACK:
      return {...state, ...INITIAL_STATE};

    case BANXA_BUY_CRYPTO_CALLBACK_UPDATE:
      return {
        ...state,
        banxaBuyCryptoCallback: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_BUY_CRYPTO_CALLBACK_SUCCESS:
      return {
        ...state,
        banxaBuyCryptoCallback: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_BUY_CRYPTO_CALLBACK_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
