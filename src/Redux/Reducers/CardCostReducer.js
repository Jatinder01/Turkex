import {
  CARD_COST_SUBMIT,
  CARD_COST_SUCCESS,
  CARD_COST_FAIL,
  CARD_COST_UPDATE,
  RESET_CARD_COST,
} from "../Actions/types";

const INITIAL_STATE = {
  cardCostHolder: null,
  cardCostError: "",
  isCardCostLoading: false,
  cardCostUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_COST_SUBMIT:
      return {
        ...state,
        isCardCostLoading: true,
        cardCostError: "",
        cardCostHolder: null,
      };
    case CARD_COST_UPDATE:
      return {
        ...state,
        cardCostUpdate: action.payload.value,
        cardCostError: "",
        isCardCostLoading: false,
      };

    case CARD_COST_SUCCESS:
      return {
        ...state,
        cardCostHolder: action.payload,
        cardCostError: "",
        isCardCostLoading: false,
      };

    case RESET_CARD_COST:
      return { ...state, ...INITIAL_STATE };

    case CARD_COST_FAIL:
      return {
        ...state,
        cardCostError: action.payload,
        isCardCostLoading: false,
      };
    default:
      return state;
  }
};
