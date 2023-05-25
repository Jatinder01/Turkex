import {
  MARKET_TICKER_FAIL,
  MARKET_TICKER_SUCCESS,
  BUY_SELL_SOCKET_SUCCESS,
  TRADE_SOCKET_SUCCESS,
  SNAP_ALL_ORDERS,
  STOP_OLD_CONNECTION,
  GET_PUBLIC_TRADE_SUCCESS,
  //fav socket
  MARKET_FAV_SUCCESS,
  MARKET_FAV_FAIL,
  MARKET_FAV_SUBMIT,
  RESET_MARKET_FAV_SUBMIT,
  CLEAR_TRADE_ARRAY,
} from "../Actions/types";

const INITIAL_STATE = {
  marketSocketError: "",
  marketData: [],
  pairArray: [],
  buyData: [],
  sellData: [],
  buyDataLarge: [],
  sellDataLarge: [],
  marketFavData: [],
  tradedata: undefined,
  publicTrade: [],
  pair: "",
};
// const RESET_INITIAL_STATE = {
//   marketSocketError: "",
//   marketData: [],
//   pairArray: [],
//   buyData: [],
//   sellData: [],
//   buyDataLarge: [],
//   sellDataLarge: [],
//   marketFavData: [],
//   tradedata: undefined,
//   publicTrade: [],
//   pair: "",
// };
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARKET_TICKER_SUCCESS:
      return {
        ...state,
        marketData: action.payload,
        pairArray: action.payloadSecond,
      };
    case MARKET_FAV_SUCCESS:
      return {
        ...state,
        marketFavData: action.payload,
      };
    case RESET_MARKET_FAV_SUBMIT:
      return { ...state, marketFavData: [] };
    case "update_market_trade":
      return {
        ...state,
        selectedMarketPair: action.payload,
      };

    case SNAP_ALL_ORDERS:
      return {
        ...state,
        sellData: action.payload.asks,
        buyData: action.payload.bids,
        buyDataLarge: action.payload.bidsLarge,
        sellDataLarge: action.payload.asksLarge,
      };
    case BUY_SELL_SOCKET_SUCCESS:
      if (action.payload.pair == state.selectedMarketPair) {
        return {
          ...state,
          sellData: action.payload.asks,
          buyData: action.payload.bids,
          buyDataLarge: action.payload.bidsLarge,
          sellDataLarge: action.payload.asksLarge,
        };
      } else {
        return {
          ...state,
        };
      }
    case STOP_OLD_CONNECTION:
      return {
        ...state,
        sellData: [],
        buyData: [],
        buyDataLarge: [],
        sellDataLarge: [],
        publicTrade: [],
      };
    case CLEAR_TRADE_ARRAY:
      return {
        ...state,
        publicTrade: [],
      };
    case TRADE_SOCKET_SUCCESS:
      return { ...state, tradedata: action.payload };
    case MARKET_TICKER_FAIL:
      return { ...state, marketError: action.payload };

    case GET_PUBLIC_TRADE_SUCCESS:
      let oldData = [];
      oldData = state.publicTrade;
      oldData = oldData.length > 10 ? oldData.splice(0, 10) : oldData;
      // console.log('=-=-action.payload=-=-=,,,', action.payload);
      return {
        ...state,
        publicTrade: [action.payload, ...oldData],
        //  publicTrade: state.publicTrade.concat(action.payload),
        //publicTrade: newlist.reverse(),
        // isLoading: false,
      };

    default:
      return state;
  }
};
