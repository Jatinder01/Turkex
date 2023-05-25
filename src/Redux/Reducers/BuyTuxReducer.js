import {
  USD_VALUE_UPDATE,
  USD_VALUE_SUBMIT,
  TUX_PURCHASE_SUCCESS,
  TUX_PURCHASE_FAIL,
  GET_TUX_PRICE,
  GET_TUX_PRICE_SUCCESS,
  GET_MY_BALANCE,
  GET_MY_BALANCE_SUCCESS,
  GET_FULL_HISTORY,
  GET_24HOURS_HISTORY,
  FAILED_24HOURS_HISTORY,
  INTIAL_24HOURS_HISTORY,
  INTIAL_FULL_HISTORY,
  FAILED_FULL_HISTORY,
} from '../Actions/types';
const INITIAL_STATE = {
  amount_usd: '',
  total_tux: '0.0',
  tux_price: '0.0',
  loading: false,
  errorMsg: '',
  balance_usd: '0.0',
  successMsg: '',
  currency: 'usdt',
  historyLoader: false,
  history24Loader: false,
  currentDate: '',
  historyData: [],
  history24Data: [],
  totalConversionHistory: 0,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USD_VALUE_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case USD_VALUE_SUBMIT:
      return {...state, loading: true, errorMsg: ''};
    case TUX_PURCHASE_FAIL:
      return {...state, errorMsg: action.payload, loading: false};
    case TUX_PURCHASE_SUCCESS:
      return {...state, successMsg: action.payload, ...INITIAL_STATE};
    case GET_TUX_PRICE:
      return {
        ...state,
        loading: true,
        tux_price: '0.0',
      };
    case GET_TUX_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        tux_price: action.payload,
      };
    case GET_MY_BALANCE:
      return {
        ...state,
        loading: true,
        balance_usd: '0.0',
      };
    case GET_MY_BALANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        balance_usd: action.payload,
      };
    case INTIAL_FULL_HISTORY:
      return {...state, historyLoader: true, historyData: []};
    case GET_FULL_HISTORY:
      return {
        ...state,
        historyLoader: false,
        historyData: action.payload.data,
        // historyData: state.historyData.concat(action.payload.data),
        // totalConversionHistory: action.payload.headers.total,
      };
    case FAILED_FULL_HISTORY:
      return {...state, historyLoader: false};
    case INTIAL_24HOURS_HISTORY:
      return {...state, history24Loader: true, history24Data: []};
    case GET_24HOURS_HISTORY:
      return {...state, history24Loader: false, history24Data: action.payload};
    case FAILED_24HOURS_HISTORY:
      return {...state, history24Loader: false};

    default:
      return state;
  }
};
