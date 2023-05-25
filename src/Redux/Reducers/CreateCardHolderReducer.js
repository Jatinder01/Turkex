import {
  POST_CARD_HOLDER_DETAILS_SUBMIT,
  POST_CARD_HOLDER_DETAILS_SUCCESS,
  POST_CARD_HOLDER_DETAILS_FAIL,
  POST_CARD_HOLDER_DETAILS_UPDATE,
  RESET_POST_CARD_HOLDER_DETAILS,
} from "../Actions/types";

const INITIAL_STATE = {
  cardHolder: null,
  error: "",
  isLoading: false,
  cardUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_CARD_HOLDER_DETAILS_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: "",
        cardHolder: null,
      };
    case POST_CARD_HOLDER_DETAILS_UPDATE:
      return {
        ...state,
        cardUpdate: action.payload.value,
        error: "",
        isLoading: false,
      };

    case POST_CARD_HOLDER_DETAILS_SUCCESS:
      return {
        ...state,
        cardHolder: action.payload,
        error: "",
        isLoading: false,
      };

    case RESET_POST_CARD_HOLDER_DETAILS:
      return { ...state, ...INITIAL_STATE };

    case POST_CARD_HOLDER_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
