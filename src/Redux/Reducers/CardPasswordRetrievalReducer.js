import {
  CARD_PASSWORD_RETRIEVAL_SUBMIT,
  CARD_PASSWORD_RETRIEVAL_SUCCESS,
  CARD_PASSWORD_RETRIEVAL_FAIL,
  CARD_PASSWORD_RETRIEVAL_UPDATE,
  RESET_PASSWORD_RETRIEVAL_COST,
} from "../Actions/types";

const INITIAL_STATE = {
  cardPasswordRetrievalInfo: null,
  cardPasswordRetrievalError: "",
  isCardPasswordRetrievalLoading: false,
  cardPasswordRetrievalUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_PASSWORD_RETRIEVAL_SUBMIT:
      return {
        ...state,
        isCardPasswordRetrievalLoading: true,
        cardPasswordRetrievalError: "",
        cardPasswordRetrievalInfo: null,
      };
    case CARD_PASSWORD_RETRIEVAL_UPDATE:
      return {
        ...state,
        cardPasswordRetrievalUpdate: action.payload.value,
        cardPasswordRetrievalError: "",
        isCardPasswordRetrievalLoading: false,
      };

    case CARD_PASSWORD_RETRIEVAL_SUCCESS:
      return {
        ...state,
        cardPasswordRetrievalInfo: action.payload,
        cardPasswordRetrievalError: "",
        isCardPasswordRetrievalLoading: false,
      };

    case RESET_PASSWORD_RETRIEVAL_COST:
      return { ...state, ...INITIAL_STATE };

    case CARD_PASSWORD_RETRIEVAL_FAIL:
      return {
        ...state,
        cardPasswordRetrievalError: action.payload,
        isCardPasswordRetrievalLoading: false,
      };
    default:
      return state;
  }
};
