import {
  CARD_FEE_SUBMIT,
  CARD_FEE_SUCCESS,
  CARD_FEE_FAIL,
  CARD_FEE_UPDATE,
  RESET_CARD_FEE,
} from "../Actions/types";

const INITIAL_STATE = {
  cardFeesInfo: null,
  cardFeesError: "",
  isCardFeesLoading: false,
  cardFeesUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_FEE_SUBMIT:
      return {
        ...state,
        isCardFeesLoading: true,
        cardFeesError: "",
        cardFeesInfo: null,
      };
    case CARD_FEE_UPDATE:
      return {
        ...state,
        cardFeesUpdate: action.payload.value,
        cardFeesError: "",
        isCardFeesLoading: false,
      };

    case CARD_FEE_SUCCESS:
      return {
        ...state,
        cardFeesInfo: action.payload,
        cardFeesError: "",
        isCardFeesLoading: false,
      };

    case RESET_CARD_FEE:
      return { ...state, ...INITIAL_STATE };

    case CARD_FEE_FAIL:
      return {
        ...state,
        cardFeesError: action.payload,
        isCardFeesLoading: false,
      };
    default:
      return state;
  }
};
