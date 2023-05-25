import {
  POST_BUY_SELL_SUBMIT,
  POST_BUY_SELL_SUCCESS,
  POST_BUY_SELL_DATA_SUCCESS,
  POST_BUY_SELL_FAIL,
  POST_BUY_SELL_UPDATE,
  RESET_BUY_SELL,
} from '../Actions/types';

const INITIAL_STATE = {
  buySellInfo: null,
  buySellCoinInfo: null,
  error: '',
  selectedCoin: null,

  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_BUY_SELL_SUBMIT:
      return {...state, isLoading: true, error: '', buySellInfo: null};
    case RESET_BUY_SELL:
      return {...state, ...INITIAL_STATE};

    case POST_BUY_SELL_UPDATE:
      return {
        ...state,
        buySellInfo: action.payload.value,
        error: '',
        isLoading: false,
      };

    case POST_BUY_SELL_SUCCESS:
      return {
        ...state,
        buySellInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case POST_BUY_SELL_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
