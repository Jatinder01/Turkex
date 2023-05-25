import {
  BANXA_PRICE_CONVERSION_SELL_SUBMIT,
  BANXA_PRICE_CONVERSION_SELL_SUCCESS,
  BANXA_PRICE_CONVERSION_SELL_FAIL,
  BANXA_PRICE_CONVERSION_SELL_UPDATE,
  RESET_BANXA_PRICE_SELL_CONVERSION,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaPriceConversionSell: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_PRICE_CONVERSION_SELL_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaPriceConversionSell: null,
      };
    case RESET_BANXA_PRICE_SELL_CONVERSION:
      return {...state, ...INITIAL_STATE};

    case BANXA_PRICE_CONVERSION_SELL_UPDATE:
      return {
        ...state,
        banxaPriceConversionSell: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_PRICE_CONVERSION_SELL_SUCCESS:
      return {
        ...state,
        banxaPriceConversionSell: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_PRICE_CONVERSION_SELL_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
