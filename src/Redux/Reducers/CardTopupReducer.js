import {
  POST_CARD_TOPUP_SUBMIT,
  POST_CARD_TOPUP_SUCCESS,
  POST_CARD_TOPUP_FAIL,
  POST_CARD_TOPUP_UPDATE,
  RESET_POST_CARD_TOPUP,
} from "../Actions/types";

const INITIAL_STATE = {
  cardTopUpHolder: null,
  cardTopUpError: "",
  isCardTopUpLoading: false,
  cardTopUpUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_CARD_TOPUP_SUBMIT:
      return {
        ...state,
        isCardTopUpLoading: true,
        cardTopUpError: "",
        cardTopUpHolder: null,
      };
    case POST_CARD_TOPUP_UPDATE:
      return {
        ...state,
        cardTopUpUpdate: action.payload.value,
        cardTopUpError: "",
        isCardTopUpLoading: false,
      };

    case POST_CARD_TOPUP_SUCCESS:
      return {
        ...state,
        cardTopUpHolder: action.payload,
        cardTopUpError: "",
        isCardTopUpLoading: false,
      };

    case RESET_POST_CARD_TOPUP:
      return { ...state, ...INITIAL_STATE };

    case POST_CARD_TOPUP_FAIL:
      return {
        ...state,
        cardTopUpError: action.payload,
        isCardTopUpLoading: false,
      };
    default:
      return state;
  }
};
