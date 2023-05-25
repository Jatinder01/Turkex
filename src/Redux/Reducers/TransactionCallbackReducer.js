import {
  TRANSACTION_CALLBACK_SUBMIT,
  TRANSACTION_CALLBACK_SUCCESS,
  TRANSACTION_CALLBACK_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  trxCallbackError: '',
  trxCallback: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSACTION_CALLBACK_SUBMIT:
      return {...state, isLoading: true, trxCallbackError: ''};
    case TRANSACTION_CALLBACK_SUCCESS:
      return {...state, trxCallback: action.payload, isLoading: false};
    case TRANSACTION_CALLBACK_FAIL:
      return {...state, trxCallbackError: action.payload, isLoading: false};

    default:
      return state;
  }
};
