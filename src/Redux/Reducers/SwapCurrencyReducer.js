import {
  GET_SWAP_COIN_SUBMIT,
  GET_SWAP_COIN_FAIL,
  GET_SWAP_COIN_PAIR_SUCCESS,
  GET_SWAP_LIST_UPDATE,
  RESET_SWAP_COIN,
  GET_SWAP_COIN_ONE_SUCCESS,
} from '../Actions/types';

const INITIAL_STATE = {
  swapCoin: null,
  swapCoinPairsInfo: null,
  swapOneCoin: null,
  error: '',
  selectedCoin: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SWAP_COIN_SUBMIT:
      return {...state, isLoading: true, error: '', activeCoinPairsInfo: null};
    case RESET_SWAP_COIN:
      return {...state, ...INITIAL_STATE};

    case GET_SWAP_LIST_UPDATE:
      return {
        ...state,
        swapCoin: action.payload.value,
        coinInfoError: '',
        isLoading: false,
        // isLoading: true,
      };

    case GET_SWAP_COIN_PAIR_SUCCESS:
      return {
        ...state,
        swapCoinPairsInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case GET_SWAP_COIN_ONE_SUCCESS:
      return {
        ...state,
        swapOneCoin: action.payload,
        error: '',
        isLoading: false,
      };
    case GET_SWAP_COIN_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
