import {
  GET_WITHDRAW_COIN_SUBMIT,
  GET_WITHDRAW_COIN_SUCCESS,
  GET_WITHDRAW_COIN_FAIL,
  GET_WITHDRAW_LIST_UPDATE,
  RESET_WITHDRAW_LIST,
} from '../Actions/types';

const INITIAL_STATE = {
  withdrawListInfo: null,
  withdrawListError: '',
  isDepositDetailsLoading: false,
  withdrawListUpdate: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_WITHDRAW_COIN_SUBMIT:
      return {
        ...state,
        isLoading: true,
        withdrawListError: '',
        withdrawListInfo: null,
      };
    case GET_WITHDRAW_LIST_UPDATE:
      return {
        ...state,
        withdrawListUpdate: action.payload.value,
        withdrawListError: '',
        isLoading: false,
      };

    case GET_WITHDRAW_COIN_SUCCESS:
      return {
        ...state,
        withdrawListInfo: action.payload,
        withdrawListError: '',
        isLoading: false,
      };

    case RESET_WITHDRAW_LIST:
      return {...state, ...INITIAL_STATE};

    case GET_WITHDRAW_COIN_FAIL:
      return {
        ...state,
        withdrawListError: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
