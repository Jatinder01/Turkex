import {
  TRADE_VALUES_UPDATE,
  GET_ALL_BAL_USER_SUCCESS,
  GET_ALL_BAL_USER_FAIL,
  GET_ALL_BAL_USER_SUBMIT,
  GET_PUBLIC_TRADE_SUCCESS,
  TRADE_OREDR_FAIL,
  TRADE_OREDR_SUBMIT,
  TRADE_OREDR_SUCCESS,
  GET_TRADE_FEE_DATA,
  INITIAL_TRADE_RULE,
  GET_TRADE_RULE,
  FAIL_TRADE_RULE,
  FAIL_TRADE_FEE,
  UPDATE_FEES_VALUE,
  GET_BINANCE_PAIRS,
  STOP_OLD_CONNECTION,
  DELETE_ALL_TRADE,
  TRADE_OREDR_RESET,
} from "../Actions/types";

const INITIAL_STATE = {
  selectedCoinPair: JSON.parse(
    JSON.stringify({
      amount: "0.0",
      at: "1638522895",
      avg_price: "0.0",
      // base_unit: 'bnb',
      base_unit: "eth",

      high: "0.0",
      last: "0.0",
      low: "0.0",
      // name: 'BNB/USDT',
      name: "ETH/USDT",

      open: "0.0",
      price_change_percent: "+0.00%",
      quote_unit: "usdt",
      volume: "0.0",
    })
  ),
  totalAmount: "",
  // tradeAmount: '0.0',
  tradeAmount: "",
  timerStart: false,
  allBalance: [],
  error: "",
  publicTrade: [],
  // priceTrade: '0.0',
  priceTrade: "",
  stopValue: "",
  limitValue: "",
  tradeFeeData: [],
  tradeSuccess: null,
  tradeRule: null,
  isLoading: false,
  tradeFees: "0.0",
  amountDecimalValue: 0,
  selectedButton: "BUY",
  binanceEnginePairs: [],
  priceDecimalValue: 0,
  userPrecision: [],
};
const INITIAL_STATE_ONE = {
  selectedCoinPair: null,
  totalAmount: "",
  // tradeAmount: '0.0',
  tradeAmount: "",
  timerStart: false,
  allBalance: [],
  error: "",
  publicTrade: [],
  // priceTrade: '0.0',
  priceTrade: "",
  stopValue: "",
  limitValue: "",
  tradeFeeData: [],
  tradeSuccess: null,
  tradeRule: null,
  isLoading: false,
  tradeFees: "0.0",
  amountDecimalValue: 0,
  selectedButton: "BUY",
  binanceEnginePairs: [],
  priceDecimalValue: 0,
  userPrecision: [],
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRADE_OREDR_RESET:
      return { ...state, ...INITIAL_STATE_ONE };
    case INITIAL_TRADE_RULE:
      return { ...state, isLoading: true };
    case UPDATE_FEES_VALUE:
      console.log("tradeFees=-=-=-=-action", JSON.stringify(action.payload));
      return { ...state, tradeFees: action.payload };

    case GET_TRADE_RULE:
      return { ...state, tradeRule: action.payload, isLoading: false };

    case GET_TRADE_FEE_DATA:
      return { ...state, tradeFeeData: action.payload, isLoading: false };
    case FAIL_TRADE_FEE:
      return { ...state, tradeFeeData: [], isLoading: false };

    case FAIL_TRADE_RULE:
      return {
        ...state,
        tradeRule: null,
        isLoading: false,
      };

    case TRADE_OREDR_SUBMIT:
      return { ...state, isLoading: true, error: "" };

    case TRADE_VALUES_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };

    case GET_ALL_BAL_USER_SUCCESS:
      return { ...state, allBalance: action.payload, isLoading: false };

    case TRADE_OREDR_SUCCESS:
      return { ...state, tradeSuccess: action.payload, isLoading: false };
    // case GET_PUBLIC_TRADE_SUCCESS:
    //   console.log('TRADE-----GET_PUBLIC_TRADE_SUCCESS----->', action.payload);

    //   let oldData = state.publicTrade;
    //   oldData = oldData.length > 10 ? oldData.splice(0, 10) : oldData;
    //   return {
    //     ...state,
    //     publicTrade: [action.payload, ...oldData],
    //     //  publicTrade: state.publicTrade.concat(action.payload),
    //     //publicTrade: newlist.reverse(),
    //     isLoading: false,
    //   };
    case GET_ALL_BAL_USER_FAIL:
      return { ...state, error: action.payload, isLoading: false };
    case TRADE_OREDR_FAIL:
      return { ...state, error: action.payload, isLoading: false };
    case GET_BINANCE_PAIRS:
      return { ...state, binanceEnginePairs: action.payload };
    case STOP_OLD_CONNECTION:
      return { ...state, publicTrade: [] };
    case DELETE_ALL_TRADE:
      return { ...state, publicTrade: [] };

    default:
      return state;
  }
};
