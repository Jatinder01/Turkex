import {
  BANXA_SUPPORTED_CURRENCY_SELL_SUBMIT,
  BANXA_SUPPORTED_CURRENCY_SELL_SUCCESS,
  BANXA_SUPPORTED_CURRENCY_SELL_FAIL,
  BANXA_SUPPORTED_CURRENCY_SELL_UPDATE,
  RESET_BANXA_SUPPORTED_SELL_CURRENCY,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaSupportedCurrenciesSellInfo: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_SUPPORTED_CURRENCY_SELL_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaSupportedCurrenciesSellInfo: null,
      };
    case RESET_BANXA_SUPPORTED_SELL_CURRENCY:
      return {...state, ...INITIAL_STATE};

    case BANXA_SUPPORTED_CURRENCY_SELL_UPDATE:
      return {
        ...state,
        banxaSupportedCurrenciesSellInfo: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_SUPPORTED_CURRENCY_SELL_SUCCESS:
      return {
        ...state,
        banxaSupportedCurrenciesSellInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_SUPPORTED_CURRENCY_SELL_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
