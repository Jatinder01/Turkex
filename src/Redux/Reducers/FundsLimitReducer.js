import {
  GET_FUNDS_LIMIT_SUBMIT,
  GET_FUNDS_LIMIT_SUCCESS,
  GET_FUNDS_LIMIT_FAIL,
  GET_FUNDS_LIMIT_UPDATE,
  RESET_FUNDS_LIMIT,
} from '../Actions/types';

const INITIAL_STATE = {
  fundsLimitInfo: null,
  fundsLimitError: '',
  isLoading: false,
  fundsLimitUpdate: '',
  //   isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_FUNDS_LIMIT_SUBMIT:
      return {
        ...state,
        isLoading: true,
        fundsLimitError: '',
        fundsLimitInfo: null,
      };
    case GET_FUNDS_LIMIT_UPDATE:
      return {
        ...state,
        fundsLimitUpdate: action.payload.value,
        fundsLimitError: '',
        isLoading: false,
      };

    case GET_FUNDS_LIMIT_SUCCESS:
      return {
        ...state,
        fundsLimitInfo: action.payload,
        fundsLimitError: '',
        isLoading: false,
      };

    case RESET_FUNDS_LIMIT:
      return {...state, ...INITIAL_STATE};

    case GET_FUNDS_LIMIT_FAIL:
      return {
        ...state,
        fundsLimitError: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
