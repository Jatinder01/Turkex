import {
  CHANGE_PASS_SUBMIT,
  CHANGE_PASS_FORM_UPDATE,
  CHANGE_PASS_FAIL,
  CHANGE_PASS_SUCCESS,
} from '../Actions/types';

const INITIAL_STATE = {
  oldPassword: '',
  newPassword: '',
  conPassword: '',
  passError: '',
  passwordLoading: false,
  oldSecurePassword: true,
  securePassword: true,
  confSecurePassword: true,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_PASS_FORM_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case CHANGE_PASS_SUBMIT:
      return {...state, passwordLoading: true, loginError: ''};
    case CHANGE_PASS_SUCCESS:
      return {...state, ...INITIAL_STATE};
    case CHANGE_PASS_FAIL:
      return {...state, passError: action.payload, passwordLoading: false};

    default:
      return state;
  }
};
