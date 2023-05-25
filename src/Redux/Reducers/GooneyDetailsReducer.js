import {
  GOONEY_DETAILS_UPDATE,
  GOONEY_DETAILS_SUBMIT,
  GOONEY_DETAILS_SUCCESS,
  GOONEY_DETAILS_FAIL,
} from '../Actions/types';

const INITIAL_STATE = {
  gooneyDetailsError: '',
  gooneyDetailsSuccess: null,
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOONEY_DETAILS_SUBMIT:
      return {...state, isLoading: true, gooneyDetailsError: ''};
    case GOONEY_DETAILS_SUCCESS:
      return {...state, gooneyDetailsSuccess: action.payload, isLoading: false};
    case GOONEY_DETAILS_FAIL:
      return {...state, gooneyDetailsError: action.payload, isLoading: false};

    default:
      return state;
  }
};
