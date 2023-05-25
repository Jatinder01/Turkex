import {
  // ACCOUNT_FORM_UPDATE,
  // ACCOUNT_USER_SUCCESS,
  // ACCOUNT_USER_FAIL,
  // ACCOUNT_USER,
  NOTIFY_INIT,
  NOTIFY_SUCCESS,
  NOTIFY_FAIL,
  NOTIFY_RESET,
} from "../Actions/types";

const INITIAL_STATE = {
  accountError: "",
  accountLoading: false,
  //Notification
  notifyLoader: false,
  notifyErr: "",
  notifyData: [],
  totalrecords: 0,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFY_INIT:
      return {
        ...state,
        notifyLoader: true,
        notifyErr: "",
      };
    case NOTIFY_SUCCESS:
      return {
        ...state,
        notifyData: state.notifyData.concat(action.payload.data),
        totalrecords: action.payload.headers.total,
        notifyLoader: false,
        notifyErr: "",
      };
    case NOTIFY_FAIL:
      return {
        ...state,
        notifyLoader: false,
        notifyErr: action.payload,
      };
    case NOTIFY_RESET:
      return {
        ...state,
        notifyLoader: false,
        notifyErr: "",
        totalrecords: 0,
        notifyData: [],
      };
    default:
      return state;
  }
};
