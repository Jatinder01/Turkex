import {
  POST_PAYMENT_GATEWAY_KET_SUBMIT,
  POST_PAYMENT_GATEWAY_KET_SUCCESS,
  POST_PAYMENT_GATEWAY_KET_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  gooneyError: '',
  gooneyKey: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_PAYMENT_GATEWAY_KET_SUBMIT:
      return {...state, isLoading: true, gooneyError: ''};
    case POST_PAYMENT_GATEWAY_KET_SUCCESS:
      return {...state, gooneyKey: action.payload, isLoading: false};
    case POST_PAYMENT_GATEWAY_KET_FAIL:
      return {...state, gooneyError: action.payload, isLoading: false};

    default:
      return state;
  }
};
