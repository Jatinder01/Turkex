import {
  POST_CARD_ACTIVATE_SUBMIT,
  POST_CARD_ACTIVATE_SUCCESS,
  POST_CARD_ACTIVATE_FAIL,
  POST_CARD_ACTIVATE_UPDATE,
  RESET_ACTIVATE_CARD,
} from "../Actions/types";

const INITIAL_STATE = {
  cardBindInfo: null,
  cardBindError: "",
  isCardBindLoading: false,
  cardBindUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_CARD_ACTIVATE_SUBMIT:
      return {
        ...state,
        isCardBindLoading: true,
        cardBindError: "",
        cardBindInfo: null,
      };
    case POST_CARD_ACTIVATE_UPDATE:
      return {
        ...state,
        cardBindUpdate: action.payload.value,
        cardBindError: "",
        isCardBindLoading: false,
      };

    case POST_CARD_ACTIVATE_SUCCESS:
      return {
        ...state,
        cardBindInfo: action.payload,
        cardBindError: "",
        isCardBindLoading: false,
      };

    case RESET_ACTIVATE_CARD:
      return { ...state, ...INITIAL_STATE };

    case POST_CARD_ACTIVATE_FAIL:
      return {
        ...state,
        cardBindError: action.payload,
        isCardBindLoading: false,
      };
    default:
      return state;
  }
};
