import {
  GET_CARD_LIST_SUBMIT,
  GET_CARD_LIST_SUCCESS,
  GET_CARD_LIST_FAIL,
  GET_CARD_LIST_UPDATE,
  RESET_CARD_LIST_LOSS,
} from "../Actions/types";

const INITIAL_STATE = {
  cardListInfo: null,
  cardListError: "",
  isCardListLoading: false,
  cardListUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CARD_LIST_SUBMIT:
      return {
        ...state,
        isCardListLoading: true,
        cardListError: "",
        cardListInfo: null,
      };
    case GET_CARD_LIST_UPDATE:
      return {
        ...state,
        cardListUpdate: action.payload.value,
        cardListError: "",
        isCardListLoading: false,
      };

    case GET_CARD_LIST_SUCCESS:
      return {
        ...state,
        cardListInfo: action.payload,
        cardListError: "",
        isCardListLoading: false,
      };

    case RESET_CARD_LIST_LOSS:
      return { ...state, ...INITIAL_STATE };

    case GET_CARD_LIST_FAIL:
      return {
        ...state,
        cardListError: action.payload,
        isCardListLoading: false,
      };
    default:
      return state;
  }
};
