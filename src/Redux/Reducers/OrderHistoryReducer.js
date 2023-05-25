import {
  GET_ORDER_SUBMIT,
  GET_ORDER_HISTORY_FAIL,
  GET_ORDER_HISTORY_SUCCESS,
  RESET_ORDER_HISTORY,
  ORDER_CANCEL_UPADTE,
  GET_MARKET_LIST_SUCCESS,
  GET_MARKET_LIST_SUBMIT,
  GET_WITHDRAW_DEPOSIT_SUCCESS,
  GET_WITHDRAW_DEPOSIT_FAIL,
  ORDER_HISTORY_PROP_UPDATE,
  GET_ORDER_HISTORY_SUCCESS_SOCKET,
  ORDER_CANCEL,
  ORDER_CANCEL_ALL,
  GET_OPEN_ORDER_SUCCESS,
  GET_TRADE_HISTORY_SUCCESS,
  RESET_OPEN_ORDER_HISTORY,
  SUBMIT_OPEN_ORDER_HISTORY,
  SUCCESS_OPEN_ORDER_HISTORY,
  FAIL_OPEN_ORDER_HISTORY,

  //trade history
  FAIL_TRADE_HISTORY_SUCCESS,
  SUBMIT_TRADE_HISTORY_SUCCESS,
  RESET_TRADE_HISTORY_SUCCESS,

  //cancelll all orders
  ORDER_CANCEL_ALL_SUCCESS,
  ORDER_CANCEL_ALL_SUBMIT,
  ORDER_CANCEL_ALL_RESET,
  ORDER_CANCEL_ALL_FAIL,
  SUBMIT_OPEN_ORDER_SINGLE_HISTORY,
  GET_OPEN_ORDER_SINGLE_SUCCESS,
  FAIL_OPEN_ORDER_SINGLE_HISTORY,
  RESET_OPEN_ORDER_SINGLE_HISTORY,
  ORDER_HISTORY_PROP_SINGLE_UPDATE,
} from "../Actions/types";

const INITIAL_STATE = {
  openOrders: [],
  openOrdersSingle: [],
  tradeHistory: [],
  orderHistory: [],
  marketCoinInfo: null,
  depositWithdrawHistory: [],
  orderHistoryError: "",
  tradeHistoryError: "",

  totalrecords: 0,
  totalRecordsOpenOrderSingle: 0,
  totalRecordsOpenOrder: 0,
  totalRecordsTradeHistory: 0,
  openOrderHistoryError: "",
  openOrderHistorySingleError: "",
  orderHistoryLoading: false,
  openOrderHistoryLoading: false,
  tradeHistoryLoading: false,

  totalRecordsDepositHistory: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDER_HISTORY_PROP_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ORDER_HISTORY_PROP_SINGLE_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case GET_ORDER_SUBMIT:
      return {
        ...state,
        orderHistoryLoading: true,
        orderHistoryError: "",
        totalrecords: 0,
      };
    case ORDER_CANCEL_ALL_SUBMIT:
      return {
        ...state,
        openOrderHistoryLoading: true,
        openOrderHistoryError: "",
      };
    case ORDER_CANCEL_ALL_SUCCESS:
      return {
        ...state,
        openOrders: [],
        totalRecordsOpenOrder: 0,
        openOrderHistoryError: "",
        openOrderHistoryLoading: false,
      };
    case ORDER_CANCEL_ALL_FAIL:
      return {
        ...state,
        openOrderHistoryError: action.payload,
        openOrderHistoryLoading: false,
      };
    case SUBMIT_TRADE_HISTORY_SUCCESS:
      return { ...state, tradeHistoryLoading: true, tradeHistoryError: "" };
    case SUBMIT_OPEN_ORDER_HISTORY:
      return {
        ...state,
        openOrderHistoryLoading: true,
        openOrderHistoryError: "",
        totalRecordsOpenOrder: 0,
      };

    case SUBMIT_OPEN_ORDER_SINGLE_HISTORY:
      return {
        ...state,
        openOrderHistoryLoading: true,
        openOrderHistoryError: "",
        totalRecordsOpenOrderSingle: 0,
      };
    case ORDER_CANCEL_ALL_RESET:
      return {
        ...state,
        openOrders: [],
        totalRecordsOpenOrder: 0,
        openOrderHistoryLoading: false,
      };
    case GET_ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        orderHistory: state.orderHistory.concat(action.payload.data),
        totalrecords: action.payload.headers.total,
        orderHistoryError: "",
        orderHistoryLoading: false,
      };
    case GET_OPEN_ORDER_SUCCESS:
      return {
        ...state,
        openOrders: state.openOrders.concat(action.payload.data),
        totalRecordsOpenOrder: action.payload.headers.total,
        openOrderHistoryError: "",
        openOrderHistoryLoading: false,
      };
    case GET_OPEN_ORDER_SINGLE_SUCCESS:
      return {
        ...state,
        // openOrdersSingle: action.payload.data,
        openOrdersSingle: state.openOrdersSingle.concat(action.payload.data),

        totalRecordsOpenOrderSingle: action.payload.headers.total,
        openOrderHistorySingleError: "",
        openOrderHistoryLoading: false,
      };
    case GET_TRADE_HISTORY_SUCCESS:
      return {
        ...state,
        tradeHistory: state.tradeHistory.concat(action.payload.data),
        totalRecordsTradeHistory: action.payload.headers.total,
        tradeHistoryError: "",
        tradeHistoryLoading: false,
      };

    case GET_ORDER_HISTORY_SUCCESS_SOCKET:
      return {
        ...state,
        orderHistory: action.payload.data,
        totalrecords: action.payload.headers.total,
        orderHistoryError: "",
        orderHistoryLoading: false,
      };

    case GET_WITHDRAW_DEPOSIT_SUCCESS:
      return {
        ...state,
        depositWithdrawHistory: state.depositWithdrawHistory.concat(
          JSON.parse(action.payload.bodyString)
        ),
        orderHistoryError: "",
        orderHistoryLoading: false,
        totalRecordsDepositHistory: action.payload.headers.total,
      };
    case GET_MARKET_LIST_SUCCESS:
      return {
        ...state,
        marketCoinInfo: action.payload,
        orderHistoryError: "",
      };

    case GET_ORDER_HISTORY_FAIL:
      return {
        ...state,
        orderHistoryError: action.payload,
        orderHistoryLoading: false,
      };
    case FAIL_OPEN_ORDER_HISTORY:
      return {
        ...state,
        openOrderHistoryError: action.payload,
        openOrderHistoryLoading: false,
      };

    case FAIL_OPEN_ORDER_SINGLE_HISTORY:
      return {
        ...state,
        openOrderHistorySingleError: action.payload,
        openOrderHistoryLoading: false,
      };
    case FAIL_TRADE_HISTORY_SUCCESS:
      return {
        ...state,
        tradeHistoryError: action.payload,
        tradeHistoryLoading: false,
      };
    case GET_WITHDRAW_DEPOSIT_FAIL:
      return {
        ...state,
        orderHistoryError: action.payload,
        orderHistoryLoading: false,
      };
    case ORDER_CANCEL_UPADTE:
      return {
        ...state,
        openOrders: state.openOrders.filter(
          (item) => item.id != action.payload.data.id
        ),
        totalRecordsOpenOrder: state.totalrecords - 1,
        openOrderHistoryError: "",
        openOrderHistoryLoading: false,
      };
    case ORDER_CANCEL_ALL:
      return {
        ...state,
        openOrders: [],
        totalRecordsOpenOrder: 0,
        openOrderHistoryError: "",
        openOrderHistoryLoading: false,
      };
    case ORDER_CANCEL:
      return {
        ...state,
        openOrderHistoryLoading: true,
      };

    case RESET_ORDER_HISTORY:
      return {
        ...state,
        orderHistory: [],
        totalrecords: 0,
        orderHistoryError: "",
        orderHistoryLoading: false,
      };
    case RESET_TRADE_HISTORY_SUCCESS:
      return {
        ...state,
        tradeHistory: [],
        totalRecordsDepositHistory: 0,
        tradeHistoryError: "",
        tradeHistoryLoading: false,
      };
    case RESET_OPEN_ORDER_HISTORY:
      return {
        ...state,
        openOrders: [],
        totalRecordsOpenOrder: 0,
        openOrderHistoryLoading: false,
      };
    case RESET_OPEN_ORDER_SINGLE_HISTORY:
      return {
        ...state,
        openOrdersSingle: [],
        totalRecordsOpenOrderSingle: 0,
        openOrderHistoryLoading: false,
      };
    default:
      return state;
  }
};
