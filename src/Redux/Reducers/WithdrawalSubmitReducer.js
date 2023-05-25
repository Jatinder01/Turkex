import {
  WITHDRAWAL_REQ_SUBMIT,
  WITHDRAWAL_FORM_UPDATE,
  WITHDRAWAL_REQ_SUCCESS,
  WITHDRAWAL_REQ_FAIL,
  WITHDRAWAL_FORM_RESET,
} from '../Actions/types';

const INITIAL_STATE = {
  withdrawError: '',
  withdrawSuccessDetails: null,
  withdrawLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WITHDRAWAL_FORM_RESET:
      return {...state, ...INITIAL_STATE};
    case WITHDRAWAL_FORM_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case WITHDRAWAL_REQ_SUBMIT:
      return {...state, withdrawLoading: true, withdrawError: ''};
    case WITHDRAWAL_REQ_SUCCESS:
      return {
        ...state,
        withdrawSuccessDetails: action.payload,
        withdrawLoading: false,
      };
    case WITHDRAWAL_REQ_FAIL:
      return {...state, withdrawError: action.payload, withdrawLoading: false};

    default:
      return state;
  }
};
