import {
  BANXA_PRICE_CONVERSION_SUBMIT,
  BANXA_PRICE_CONVERSION_SUCCESS,
  BANXA_PRICE_CONVERSION_FAIL,
  BANXA_PRICE_CONVERSION_UPDATE,
  RESET_BANXA_PRICE_CONVERSION,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaPriceConversionInfo: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_PRICE_CONVERSION_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaPriceConversionInfo: null,
      };
    case RESET_BANXA_PRICE_CONVERSION:
      return {...state, ...INITIAL_STATE};

    case BANXA_PRICE_CONVERSION_UPDATE:
      return {
        ...state,
        banxaPriceConversionInfo: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_PRICE_CONVERSION_SUCCESS:
      return {
        ...state,
        banxaPriceConversionInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_PRICE_CONVERSION_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
