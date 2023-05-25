import {
  FORGOT_PASSWORD_FORM_UPDATE,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_USER,
} from '../Actions/types';

const INITIAL_STATE = {
  forgotPasswordEmail: '',
  forgotPasswordError: '',
  forgotPasswordUser: '',
  forgotPasswordLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_FORM_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case FORGOT_PASSWORD_USER:
      return {...state, forgotPasswordLoading: true, forgotPasswordError: ''};
    case FORGOT_PASSWORD_SUCCESS:
      return {...state, forgotPasswordUser: action.payload, ...INITIAL_STATE};
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        forgotPasswordError: action.payload,
        forgotPasswordLoading: false,
      };

    default:
      return state;
  }
};
