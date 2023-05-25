import {
  GET_ACTIVE_COIN_SUBMIT,
  GET_ACTIVE_COIN_SUCCESS,
  GET_ACTIVE_COIN_FAIL,
  GET_ACTIVE_COIN_PAIR_SUCCESS,
  GET_COIN_LIST_UPDATE,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_SUBMIT,
  GET_ADDRESS_FAIL,
  GET_ADDRESS_RESET,
  GET_ACTIVE_COIN_SWAP_SUBMIT,
  GET_ACTIVE_COIN_SWAP_SUCCESS,
  GET_ACTIVE_COIN_SWAP_PAIR_SUCCESS,
  GET_ACTIVE_COIN_SWAP_FAIL,
} from "../Actions/types";

const INITIAL_STATE = {
  activeCoinInfo: null,
  activeCoinPairsInfo: null,
  getCoinAddress: null,
  error: "",
  selectedCoin: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ADDRESS_SUBMIT:
      return { ...state, isLoading: true, error: "", getCoinAddress: null };
    case GET_ADDRESS_SUCCESS:
      return {
        ...state,
        getCoinAddress: action.payload,
        error: "",
        isLoading: false,
      };

    case GET_ADDRESS_FAIL:
      return { ...state, error: action.payload, isLoading: false };

    case GET_ADDRESS_RESET:
      return { ...state, ...INITIAL_STATE };

    case GET_ACTIVE_COIN_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: "",
        activeCoinPairsInfo: null,
      };

    case GET_COIN_LIST_UPDATE:
      return {
        ...state,
        selectedCoin: action.payload.value,
        coinInfoError: "",
        isLoading: false,
      };

    case GET_ACTIVE_COIN_SUCCESS:
      console.log("GET_ACTIVE_COIN_SUCCESS=-action.payload=-", action.payload);
      return {
        ...state,
        activeCoinInfo: action.payload,
        error: "",
        isLoading: false,
      };

    case GET_ACTIVE_COIN_PAIR_SUCCESS:
      return {
        ...state,
        activeCoinPairsInfo: action.payload,
        error: "",
        isLoading: false,
      };

    case GET_ACTIVE_COIN_FAIL:
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};
