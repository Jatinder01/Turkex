import {
  BANXA_SINGLE_ORDERS_SUBMIT,
  BANXA_SINGLE_ORDERS_SUCCESS,
  BANXA_SINGLE_ORDERS_FAIL,
  BANXA_SINGLE_ORDERS_UPDATE,
  RESET_SINGLE_ORDERS_CRYPTO,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaSingleOrder: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_SINGLE_ORDERS_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaSingleOrder: null,
      };
    case RESET_SINGLE_ORDERS_CRYPTO:
      return {...state, ...INITIAL_STATE};

    case BANXA_SINGLE_ORDERS_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
      };

    case BANXA_SINGLE_ORDERS_SUCCESS:
      return {
        ...state,
        banxaSingleOrder: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_SINGLE_ORDERS_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
