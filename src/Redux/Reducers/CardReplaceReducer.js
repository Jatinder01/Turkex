import {
  POST_CARD_REPLACE_SUBMIT,
  POST_CARD_REPLACE_SUCCESS,
  POST_CARD_REPLACE_FAIL,
  POST_CARD_REPLACE_UPDATE,
  RESET_POST_CARD_REPLACE,
} from "../Actions/types";

const INITIAL_STATE = {
  cardReplaceHolder: null,
  cardReplaceError: "",
  isCardReplaceLoading: false,
  cardReplaceUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_CARD_REPLACE_SUBMIT:
      return {
        ...state,
        isCardReplaceLoading: true,
        cardReplaceError: "",
        cardReplaceHolder: null,
      };
    case POST_CARD_REPLACE_UPDATE:
      return {
        ...state,
        cardReplaceUpdate: action.payload.value,
        cardReplaceError: "",
        isCardReplaceLoading: false,
      };

    case POST_CARD_REPLACE_SUCCESS:
      return {
        ...state,
        cardReplaceHolder: action.payload,
        cardReplaceError: "",
        isCardReplaceLoading: false,
      };

    case RESET_POST_CARD_REPLACE:
      return { ...state, ...INITIAL_STATE };

    case POST_CARD_REPLACE_FAIL:
      return {
        ...state,
        cardReplaceError: action.payload,
        isCardReplaceLoading: false,
      };
    default:
      return state;
  }
};
