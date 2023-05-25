import {
  CARD_ACTIVATE_BY_USER_SUBMIT,
  CARD_ACTIVATE_BY_USER_SUCCESS,
  CARD_ACTIVATE_BY_USER_FAIL,
  CARD_ACTIVATE_BY_USER_UPDATE,
  RESET_ACTIVATE_BY_USER_CARD,
} from "../Actions/types";

const INITIAL_STATE = {
  cardActivateInfo: null,
  cardActivateError: "",
  isCardActivateLoading: false,
  cardActivateUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_ACTIVATE_BY_USER_SUBMIT:
      return {
        ...state,
        isCardActivateLoading: true,
        cardActivateError: "",
        cardActivateInfo: null,
      };
    case CARD_ACTIVATE_BY_USER_UPDATE:
      return {
        ...state,
        cardActivateUpdate: action.payload.value,
        cardActivateError: "",
        isCardActivateLoading: false,
      };

    case CARD_ACTIVATE_BY_USER_SUCCESS:
      return {
        ...state,
        cardActivateInfo: action.payload,
        cardActivateError: "",
        isCardActivateLoading: false,
      };

    case RESET_ACTIVATE_BY_USER_CARD:
      return { ...state, ...INITIAL_STATE };

    case CARD_ACTIVATE_BY_USER_FAIL:
      return {
        ...state,
        cardActivateError: action.payload,
        isCardActivateLoading: false,
      };
    default:
      return state;
  }
};
