import {
  BANXA_SELL_ORDER_CONFIRM_SUBMIT,
  BANXA_SELL_ORDER_CONFIRM_SUCCESS,
  BANXA_SELL_ORDER_CONFIRM_FAIL,
  BANXA_SELL_ORDER_CONFIRM_UPDATE,
  RESET_SELL_ORDER_CONFIRM_CRYPTO,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaConfirmSell: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_SELL_ORDER_CONFIRM_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaConfirmSell: null,
      };
    case RESET_SELL_ORDER_CONFIRM_CRYPTO:
      return {...state, ...INITIAL_STATE};

    case BANXA_SELL_ORDER_CONFIRM_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
      };

    case BANXA_SELL_ORDER_CONFIRM_SUCCESS:
      return {
        ...state,
        banxaConfirmSell: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_SELL_ORDER_CONFIRM_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
