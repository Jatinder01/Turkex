import {
  POST_CARD_APPLY_SUBMIT,
  POST_CARD_APPLY_SUCCESS,
  POST_CARD_APPLY_FAIL,
  POST_CARD_APPLY_UPDATE,
  RESET_POST_CARD_APPLY,
} from "../Actions/types";

const INITIAL_STATE = {
  cardApplyInfo: null,
  cardApplyError: "",
  isCardApplyLoading: false,
  cardApplyUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_CARD_APPLY_SUBMIT:
      return {
        ...state,
        isCardApplyLoading: true,
        cardApplyError: "",
        cardApplyInfo: null,
      };
    case POST_CARD_APPLY_UPDATE:
      return {
        ...state,
        cardApplyUpdate: action.payload.value,
        cardApplyError: "",
        isCardApplyLoading: false,
      };

    case POST_CARD_APPLY_SUCCESS:
      return {
        ...state,
        cardApplyInfo: action.payload,
        cardApplyError: "",
        isCardApplyLoading: false,
      };

    case RESET_POST_CARD_APPLY:
      return { ...state, ...INITIAL_STATE };

    case POST_CARD_APPLY_FAIL:
      return {
        ...state,
        cardApplyError: action.payload,
        isCardApplyLoading: false,
      };
    default:
      return state;
  }
};
