import {
  POST_REMOVE_CARD_LOSS_SUBMIT,
  POST_REMOVE_CARD_LOSS_SUCCESS,
  POST_REMOVE_CARD_LOSS_FAIL,
  POST_REMOVE_CARD_LOSS_UPDATE,
  RESET_POST_REMOVE_CARD_LOSS,
} from "../Actions/types";

const INITIAL_STATE = {
  cardRemoveHolder: null,
  cardRemoveError: "",
  isCardRemoveLoading: false,
  cardRemoveUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_REMOVE_CARD_LOSS_SUBMIT:
      return {
        ...state,
        isCardRemoveLoading: true,
        cardRemoveError: "",
        cardRemoveHolder: null,
      };
    case POST_REMOVE_CARD_LOSS_UPDATE:
      return {
        ...state,
        cardRemoveUpdate: action.payload.value,
        cardRemoveError: "",
        isCardRemoveLoading: false,
      };

    case POST_REMOVE_CARD_LOSS_SUCCESS:
      return {
        ...state,
        cardRemoveHolder: action.payload,
        cardRemoveError: "",
        isCardRemoveLoading: false,
      };

    case RESET_POST_REMOVE_CARD_LOSS:
      return { ...state, ...INITIAL_STATE };

    case POST_REMOVE_CARD_LOSS_FAIL:
      return {
        ...state,
        cardRemoveError: action.payload,
        isCardRemoveLoading: false,
      };
    default:
      return state;
  }
};
