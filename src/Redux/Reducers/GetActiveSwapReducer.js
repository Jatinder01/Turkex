import {
  GET_ACTIVE_COIN_SWAP_SUBMIT,
  GET_ACTIVE_COIN_SWAP_SUCCESS,
  GET_ACTIVE_COIN_SWAP_RESET_SUCCESS,
  GET_ACTIVE_COIN_SWAP_FAIL,
} from "../Actions/types";

const INITIAL_STATE = {
  activeCoinSwapInfo: null,
  errorSwap: "",
  isSwapLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVE_COIN_SWAP_SUBMIT:
      return {
        ...state,
        isSwapLoading: true,
        errorSwap: "",
        activeCoinSwapInfo: null,
      };

    case GET_ACTIVE_COIN_SWAP_SUCCESS:
      return {
        ...state,
        activeCoinSwapInfo: action.payload,
        errorSwap: "",
        isSwapLoading: false,
      };

    case GET_ACTIVE_COIN_SWAP_RESET_SUCCESS:
      return { ...state, ...INITIAL_STATE };

    case GET_ACTIVE_COIN_SWAP_FAIL:
      return { ...state, errorSwap: action.payload, isSwapLoading: false };
    default:
      return state;
  }
};
