import {
  TRANSACTION_BUY_SELL_SUBMIT,
  TRANSACTION_BUY_SELL_SUCCESS,
  TRANSACTION_BUY_SELL_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  gooneyTrxError: '',
  gooneyTrxBuySell: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSACTION_BUY_SELL_SUBMIT:
      return {...state, isLoading: true, gooneyTrxError: ''};
    case TRANSACTION_BUY_SELL_SUCCESS:
      return {...state, gooneyTrxBuySell: action.payload, isLoading: false};
    case TRANSACTION_BUY_SELL_FAIL:
      return {...state, gooneyTrxError: action.payload, isLoading: false};

    default:
      return state;
  }
};
