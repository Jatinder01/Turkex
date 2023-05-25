import {
  GET_BANK_LIST_SUBMIT,
  GET_BANK_LIST_SUCCESS,
  GET_BANK_LIST_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  bankListError: '',
  bankList: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BANK_LIST_SUBMIT:
      return {...state, isLoading: true, bankListError: ''};
    case GET_BANK_LIST_SUCCESS:
      return {...state, bankList: action.payload, isLoading: false};
    case GET_BANK_LIST_FAIL:
      return {...state, bankListError: action.payload, isLoading: false};

    default:
      return state;
  }
};
