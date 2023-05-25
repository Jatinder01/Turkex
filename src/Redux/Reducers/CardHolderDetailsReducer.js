import {
  GET_CARD_HOLDER_DETAILS_SUBMIT,
  GET_CARD_HOLDER_DETAILS_SUCCESS,
  GET_CARD_HOLDER_DETAILS_FAIL,
  GET_CARD_HOLDER_DETAILS_UPDATE,
  RESET_CARD_HOLDER_DETAILS,
} from "../Actions/types";

const INITIAL_STATE = {
  cardHolderInfo: null,
  cardHolderError: "",
  isCardHolderLoading: false,
  cardHolderUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CARD_HOLDER_DETAILS_SUBMIT:
      return {
        ...state,
        isCardHolderLoading: true,
        cardHolderError: "",
        cardHolderInfo: null,
      };
    case GET_CARD_HOLDER_DETAILS_UPDATE:
      return {
        ...state,
        cardHolderUpdate: action.payload.value,
        cardHolderError: "",
        isCardHolderLoading: false,
      };

    case GET_CARD_HOLDER_DETAILS_SUCCESS:
      return {
        ...state,
        cardHolderInfo: action.payload,
        cardHolderError: "",
        isCardHolderLoading: false,
      };

    case RESET_CARD_HOLDER_DETAILS:
      return { ...state, ...INITIAL_STATE };

    case GET_CARD_HOLDER_DETAILS_FAIL:
      return {
        ...state,
        cardHolderError: action.payload,
        isCardHolderLoading: false,
      };
    default:
      return state;
  }
};
