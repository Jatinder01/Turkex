import {
  GET_WITHDRAW_LIMIT_FIAT_SUBMIT,
  GET_WITHDRAW_LIMIT_FIAT_SUCCESS,
  GET_WITHDRAW_LIMIT_FIAT_FAIL,
  GET_WITHDRAW_LIMIT_FIAT_UPDATE,
  RESET_WITHDRAW_LIMIT_FIAT,
} from '../Actions/types';

const INITIAL_STATE = {
  withdrawLimitInfo: null,
  withdrawLimitError: '',
  isLoading: false,
  withdrawLimitUpdate: '',
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_WITHDRAW_LIMIT_FIAT_SUBMIT:
      return {
        ...state,
        isLoading: true,
        withdrawLimitError: '',
        withdrawLimitInfo: null,
      };
    case GET_WITHDRAW_LIMIT_FIAT_UPDATE:
      return {
        ...state,
        withdrawLimitUpdate: action.payload.value,
        withdrawLimitError: '',
        isLoading: false,
      };

    case GET_WITHDRAW_LIMIT_FIAT_SUCCESS:
      return {
        ...state,
        withdrawLimitInfo: action.payload,
        withdrawLimitError: '',
        isLoading: false,
      };

    case RESET_WITHDRAW_LIMIT_FIAT:
      return {...state, ...INITIAL_STATE};

    case GET_WITHDRAW_LIMIT_FIAT_FAIL:
      return {
        ...state,
        withdrawLimitError: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
