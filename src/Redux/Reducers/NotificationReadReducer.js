import {
  NOTIFY_READ_INIT,
  NOTIFY_READ_SUCCESS,
  NOTIFY_READ_FAIL,
  NOTIFY_READ_RESET,
} from "../Actions/types";

const INITIAL_STATE = {
  //Notification
  notifyReadLoader: false,
  notifyReadErr: "",
  notifyReadData: "",
  //   totalrecords: 0,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFY_READ_INIT:
      return {
        ...state,
        notifyReadLoader: true,
        notifyReadErr: "",
      };
    case NOTIFY_READ_SUCCESS:
      return {
        ...state,
        notifyReadData: action.payload.data,
        notifyReadLoader: false,
        notifyReadErr: "",
      };
    case NOTIFY_READ_FAIL:
      return {
        ...state,
        notifyReadLoader: false,
        notifyReadErr: action.payload,
      };
    case NOTIFY_READ_RESET:
      return {
        ...state,
        notifyReadLoader: false,
        notifyReadErr: "",
        notifyReadData: "",
      };
    default:
      return state;
  }
};
