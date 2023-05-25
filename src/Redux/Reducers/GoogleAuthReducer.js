import {
  GOOGLE_AUTH_FORM_UPDATE,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
  GOOGLE_AUTH_USER,
} from '../actions/types';

const INITIAL_STATE = {
  googleAuthCode: '',
  googleAuthError: '',
  googleAuthLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOOGLE_AUTH_FORM_UPDATE:
      return {...state, [action.payload.prop]: action.payload.value};
    case GOOGLE_AUTH_USER:
      return {...state, googleAuthLoading: true, googleAuthError: ''};
    case GOOGLE_AUTH_SUCCESS:
      return {...state, googleAuthUser: action.payload, ...INITIAL_STATE};
    case GOOGLE_AUTH_FAIL:
      return {
        ...state,
        googleAuthError: action.payload,
        googleAuthLoading: false,
      };

    default:
      return state;
  }
};
