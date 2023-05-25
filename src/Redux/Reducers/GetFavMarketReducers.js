import {
  GET_FAV_MARKET_SUBMIT,
  GET_FAV_MARKET_SUCCESS,
  GET_FAV_MARKET_FAIL,
  GET_FAV_MARKET_UPDATE,
  RESET_GET_FAV_MARKET,

  //update fav market
  UPDATE_FAV_MARKET_SUBMIT,
  UPDATE_FAV_MARKET_SUCCESS,
  UPDATE_FAV_MARKET_FAIL,
  UPDATE_FAV_MARKET_UPDATE,
  RESET_UPDATE_FAV_MARKET,
} from "../Actions/types";

const INITIAL_STATE = {
  favMarketData: [],
  favMarketError: "",
  isFavMarketLoading: false,
  updateFavMarketData: null,
  updateFavMarketError: "",
  isUpdateFavMarketLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_FAV_MARKET_SUBMIT:
      return {
        ...state,
        isFavMarketLoading: true,
        favMarketError: "",
        favMarketData: [],
      };

    case GET_FAV_MARKET_SUCCESS:
      return {
        ...state,
        favMarketData: action.payload,
        favMarketError: "",
        isFavMarketLoading: false,
      };

    case RESET_GET_FAV_MARKET:
      return { ...state, ...INITIAL_STATE };

    case GET_FAV_MARKET_FAIL:
      return {
        ...state,
        favMarketError: action.payload,
        isFavMarketLoading: false,
      };
    //update
    case UPDATE_FAV_MARKET_SUBMIT:
      return {
        ...state,
        isUpdateFavMarketLoading: true,
        updateFavMarketError: "",
        updateFavMarketData: null,
      };

    case UPDATE_FAV_MARKET_SUCCESS:
      return {
        ...state,
        updateFavMarketData: action.payload,
        updateFavMarketError: "",
        isUpdateFavMarketLoading: false,
      };

    case RESET_UPDATE_FAV_MARKET:
      return { ...state, ...INITIAL_STATE };

    case UPDATE_FAV_MARKET_FAIL:
      return {
        ...state,
        updateFavMarketError: action.payload,
        isUpdateFavMarketLoading: false,
      };
    default:
      return state;
  }
};
