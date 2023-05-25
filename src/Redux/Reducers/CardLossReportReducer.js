import {
  POST_REPORT_CARD_LOSS_SUBMIT,
  POST_REPORT_CARD_LOSS_SUCCESS,
  POST_REPORT_CARD_LOSS_FAIL,
  POST_REPORT_CARD_LOSS_UPDATE,
  RESET_POST_REPORT_CARD_LOSS,
} from "../Actions/types";

const INITIAL_STATE = {
  cardLossHolder: null,
  cardLossError: "",
  isCardLossLoading: false,
  cardLossUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_REPORT_CARD_LOSS_SUBMIT:
      return {
        ...state,
        isCardLossLoading: true,
        cardLossError: "",
        cardLossHolder: null,
      };
    case POST_REPORT_CARD_LOSS_UPDATE:
      return {
        ...state,
        cardLossUpdate: action.payload.value,
        cardLossError: "",
        isCardLossLoading: false,
      };

    case POST_REPORT_CARD_LOSS_SUCCESS:
      return {
        ...state,
        cardLossHolder: action.payload,
        cardLossError: "",
        isCardLossLoading: false,
      };

    case RESET_POST_REPORT_CARD_LOSS:
      return { ...state, ...INITIAL_STATE };

    case POST_REPORT_CARD_LOSS_FAIL:
      return {
        ...state,
        cardLossError: action.payload,
        isCardLossLoading: false,
      };
    default:
      return state;
  }
};
