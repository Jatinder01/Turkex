import {
  GET_CURRENCY_CONVERSION_SUBMIT,
  GET_CURRENCY_CONVERSION_SUCCESS,
  GET_CURRENCY_CONVERSION_FAIL,
  GET_CURRENCY_CONVERSION_UPDATE,
  RESET_CURRENCY_CONVERSION,
} from "../Actions/types";

const INITIAL_STATE = {
  currencyConversionInfo: null,
  currencyConversionError: "",
  isCurrencyConversionLoading: false,
  currencyConversionUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CURRENCY_CONVERSION_SUBMIT:
      return {
        ...state,
        isCurrencyConversionLoading: true,
        currencyConversionError: "",
        currencyConversionInfo: null,
      };
    case GET_CURRENCY_CONVERSION_UPDATE:
      return {
        ...state,
        currencyConversionUpdate: action.payload.value,
        currencyConversionError: "",
        isCurrencyConversionLoading: false,
      };

    case GET_CURRENCY_CONVERSION_SUCCESS:
      return {
        ...state,
        currencyConversionInfo: action.payload,
        currencyConversionError: "",
        isCurrencyConversionLoading: false,
      };

    case RESET_CURRENCY_CONVERSION:
      return { ...state, ...INITIAL_STATE };

    case GET_CURRENCY_CONVERSION_FAIL:
      return {
        ...state,
        currencyConversionError: action.payload,
        isCurrencyConversionLoading: false,
      };
    default:
      return state;
  }
};
