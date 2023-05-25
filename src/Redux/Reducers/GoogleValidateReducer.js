import {
  GOOGLE_AUTH_VALIDATE_FORM_UPDATE,
  GOOGLE_VALIDATE_SUBMIT,
  GOOGLE_AUTH_VALIDATE_FAIL,
  GOOGLE_AUTH_VALID_DETAIL_SUCCESS,
} from '../Actions/types';

const INITIAL_STATE = {
  gValidateCode: '',
  gValidatePassword: '',
  gValidateError: '',
  gValidateDetails: null,
  gValidateLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOOGLE_AUTH_VALIDATE_FORM_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        gValidateError: '',
      };
    case GOOGLE_VALIDATE_SUBMIT:
      return {...state, gValidateLoading: true, gValidateError: ''};
    case GOOGLE_AUTH_VALID_DETAIL_SUCCESS:
      return {...state, gValidateDetails: action.payload, ...INITIAL_STATE};
    case GOOGLE_AUTH_VALIDATE_FAIL:
      return {
        ...state,
        gValidateError: action.payload,
        gValidateLoading: false,
      };

    default:
      return state;
  }
};
