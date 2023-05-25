import {
  GOOGLE_DISABLE_VALIDATE_FORM_UPDATE,
  GOOGLE_DISABLE_SUBMIT,
  GOOGLE_DISABLE_VALIDATE_FAIL,
  GOOGLE_DISABLE_VALID_DETAIL_SUCCESS,
} from '../Actions/types';

const INITIAL_STATE = {
  code: '',
  gdisableError: '',
  gdisableDetails: null,
  gdisableLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOOGLE_DISABLE_VALIDATE_FORM_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        gdisableError: '',
      };
    case GOOGLE_DISABLE_SUBMIT:
      return {...state, gdisableLoading: true, gdisableError: ''};
    case GOOGLE_DISABLE_VALID_DETAIL_SUCCESS:
      return {...state, gdisableDetails: action.payload, ...INITIAL_STATE};
    case GOOGLE_DISABLE_VALIDATE_FAIL:
      return {
        ...state,
        gdisableError: action.payload,
        gdisableLoading: false,
      };

    default:
      return state;
  }
};
