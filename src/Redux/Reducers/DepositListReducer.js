import {
  GET_DEPOSIT_COIN_SUBMIT,
  GET_DEPOSIT_COIN_FAIL,
  GET_DEPOSIT_COIN_SUCCESS,
  GET_DEPOSIT_LIST_UPDATE,
  RESET_DEPOSIT_LIST,
  DEPOSIT_COIN_SUBMIT,
  DEPOSIT_COIN_SUCCESS,
  DEPOSIT_COIN_FAIL,
  DEPOSIT_UPDATE,
  RESET_DEPOSIT,
  //withdraw
  GET_WITHDRAW_COIN_LIST_SUBMIT,
  GET_WITHDRAW_COIN_LIST_SUCCESS,
  GET_WITHDRAW_COIN_LIST_FAIL,
  GET_WITHDRAW_LIST_LIST_UPDATE,
  RESET_WITHDRAW_LIST_LIST,
} from '../Actions/types';

const INITIAL_STATE = {
  depositCoinUpdate: null,
  depositCoinListInfo: null,
  depositCoinDetailsInfo: null,
  error: '',
  depositError: '',
  isDepositDetailsLoading: false,

  selectedCoin: null,
  isLoading: false,

  isWithdrawListLoading: false,
  withdrawListError: '',
  withdrawListCoinInfo: null,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DEPOSIT_COIN_SUBMIT:
      return {...state, isLoading: true, error: '', activeCoinPairsInfo: null};
    case GET_DEPOSIT_LIST_UPDATE:
      return {
        ...state,
        depositCoinUpdate: action.payload.value,
        error: '',
        isLoading: false,
      };

    case RESET_DEPOSIT_LIST:
      return {...state, ...INITIAL_STATE};
    case GET_DEPOSIT_COIN_SUCCESS:
      return {
        ...state,
        depositCoinListInfo: action.payload,
        error: '',
        isLoading: false,
      };
    case GET_DEPOSIT_COIN_FAIL:
      return {...state, error: action.payload, isLoading: false};

    //--deposit details----

    case DEPOSIT_COIN_SUBMIT:
      return {
        ...state,
        isDepositDetailsLoading: true,
        depositError: '',
        activeCoinPairsInfo: null,
      };
    case RESET_DEPOSIT:
      return {...state, ...INITIAL_STATE};
    case DEPOSIT_COIN_SUCCESS:
      return {
        ...state,
        depositCoinDetailsInfo: action.payload,
        depositError: '',
        isDepositDetailsLoading: false,
      };
    case DEPOSIT_COIN_FAIL:
      return {
        ...state,
        depositError: action.payload,
        isDepositDetailsLoading: false,
      };
    //withdraw
    case GET_WITHDRAW_COIN_LIST_SUBMIT:
      return {
        ...state,
        isWithdrawListLoading: true,
        withdrawListError: '',
        withdrawListCoinInfo: null,
      };
    case RESET_WITHDRAW_LIST_LIST:
      return {...state, ...INITIAL_STATE};
    case GET_WITHDRAW_COIN_LIST_SUCCESS:
      return {
        ...state,
        isWithdrawListLoading: false,
        withdrawListError: '',
        withdrawListCoinInfo: action.payload,
      };
    case GET_WITHDRAW_COIN_LIST_FAIL:
      return {
        ...state,
        withdrawListError: action.payload,
        isWithdrawListLoading: false,
      };

    default:
      return state;
  }
};
