import {
  BANXA_PAYMENT_METHOD_SUBMIT,
  BANXA_PAYMENT_METHOD_SUCCESS,
  BANXA_PAYMENT_METHOD_FAIL,
  BANXA_PAYMENT_METHOD_UPDATE,
  RESET_BANXA_PAYMENT_METHOD,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaPaymentMethodInfo: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_PAYMENT_METHOD_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaPaymentMethodInfo: null,
      };
    case RESET_BANXA_PAYMENT_METHOD:
      return {...state, ...INITIAL_STATE};

    case BANXA_PAYMENT_METHOD_UPDATE:
      return {
        ...state,
        banxaPaymentMethodInfo: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        banxaPaymentMethodInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_PAYMENT_METHOD_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
