import {
  BANXA_ALL_ORDERS_SUBMIT,
  BANXA_ALL_ORDERS_SUCCESS,
  BANXA_ALL_ORDERS_FAIL,
  BANXA_ALL_ORDERS_UPDATE,
  RESET_ALL_ORDERS_CRYPTO,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaAllOrderList: [],
  error: '',
  isLoading: false,
  totalrecords: 0,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_ALL_ORDERS_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaAllOrderList: state.banxaAllOrderList,
        totalrecords: state.totalrecords,
      };
    case RESET_ALL_ORDERS_CRYPTO:
      return {...state, ...INITIAL_STATE};

    case BANXA_ALL_ORDERS_UPDATE:
      return {
        ...state,
        banxaAllOrderList: action.payload,
        error: '',
        isLoading: false,
      };

    case BANXA_ALL_ORDERS_SUCCESS:
      return {
        ...state,
        banxaAllOrderList: state.banxaAllOrderList.concat(
          action.payload.orders,
        ),
        totalrecords: action.payload.meta.total,
        error: '',
        isLoading: false,
      };
    case BANXA_ALL_ORDERS_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
