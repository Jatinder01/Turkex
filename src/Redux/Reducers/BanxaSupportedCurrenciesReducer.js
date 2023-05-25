import {
  BANXA_SUPPORTED_CURRENCY_SUBMIT,
  BANXA_SUPPORTED_CURRENCY_SUCCESS,
  BANXA_SUPPORTED_CURRENCY_FAIL,
  BANXA_SUPPORTED_CURRENCY_UPDATE,
  RESET_BANXA_SUPPORTED_CURRENCY,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaSupportedCurrenciesInfo: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_SUPPORTED_CURRENCY_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaSupportedCurrenciesInfo: null,
      };
    case RESET_BANXA_SUPPORTED_CURRENCY:
      return {...state, ...INITIAL_STATE};

    case BANXA_SUPPORTED_CURRENCY_UPDATE:
      return {
        ...state,
        banxaSupportedCurrenciesInfo: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_SUPPORTED_CURRENCY_SUCCESS:
      return {
        ...state,
        banxaSupportedCurrenciesInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_SUPPORTED_CURRENCY_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
