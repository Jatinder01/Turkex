import {
  BANXA_BUY_CRYPTO_SUBMIT,
  BANXA_BUY_CRYPTO_SUCCESS,
  BANXA_BUY_CRYPTO_FAIL,
  BANXA_BUY_CRYPTO_UPDATE,
  RESET_BANXA_BUY_CRYPTO,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaBuyCrypto: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_BUY_CRYPTO_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaBuyCrypto: null,
      };
    case RESET_BANXA_BUY_CRYPTO:
      return {...state, ...INITIAL_STATE};

    case BANXA_BUY_CRYPTO_UPDATE:
      return {
        ...state,
        banxaBuyCrypto: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_BUY_CRYPTO_SUCCESS:
      return {
        ...state,
        banxaBuyCrypto: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_BUY_CRYPTO_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
