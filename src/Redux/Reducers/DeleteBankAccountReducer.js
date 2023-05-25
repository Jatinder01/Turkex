import {
  DELETE_BANK_UPDATE,
  DELETE_BANK_SUBMIT,
  DELETE_BANK_SUCCESS,
  DELETE_BANK_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  deleteBankAccountError: '',
  deleteBankAccountSuccess: null,
  isLoading: false,
  account_holder_name: '',
  account_no: '',
  bic: '',
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DELETE_BANK_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case DELETE_BANK_SUBMIT:
      return {...state, isLoading: true, deleteBankAccountError: ''};
    case DELETE_BANK_SUCCESS:
      return {
        ...state,
        deleteBankAccountSuccess: action.payload,
        isLoading: false,
      };
    case DELETE_BANK_FAIL:
      return {
        ...state,
        deleteBankAccountError: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};
