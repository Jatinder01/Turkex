import {
  ADD_BANK_SUBMIT,
  ADD_BANK_SUCCESS,
  ADD_BANK_FAIL,
  ADD_BANK_UPDATE,
} from '../Actions/types';

const INITIAL_STATE = {
  addBankCardError: '',
  addBankCardSuccess: null,
  isLoading: false,
  account_holder_name: '',
  error: '',
  account_no: '',
  bic: '',
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_BANK_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case ADD_BANK_SUBMIT:
      return {...state, isLoading: true, addBankCardError: ''};
    case ADD_BANK_SUCCESS:
      return {...state, addBankCardSuccess: action.payload, isLoading: false};
    case ADD_BANK_FAIL:
      return {...state, addBankCardError: action.payload, isLoading: false};

    default:
      return state;
  }
};
