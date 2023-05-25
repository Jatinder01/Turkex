import {
  GET_SWAP_SUBMIT,
  GET_SWAP_SUCCESS,
  GET_SWAP_FAIL,
  //   GET_SWAP_DATA_SUCCESS,
  GET_SWAP_UPDATE,
  RESET_SWAP,
} from '../Actions/types';

const INITIAL_STATE = {
  swapInfo: null,
  swapCoinInfo: null,
  error: '',
  selectedCoin: null,

  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SWAP_SUBMIT:
      return {...state, isLoading: true, error: '', swapInfo: null};
    case RESET_SWAP:
      return {...state, ...INITIAL_STATE};

    case GET_SWAP_UPDATE:
      return {
        ...state,
        swapInfo: action.payload.value,
        error: '',
        isLoading: false,
      };

    case GET_SWAP_SUCCESS:
      return {
        ...state,
        swapInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case GET_SWAP_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
