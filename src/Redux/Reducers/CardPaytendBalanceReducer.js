import {
  GET_CARD_BALANCE_SUBMIT,
  GET_CARD_BALANCE_SUCCESS,
  GET_CARD_BALANCE_FAIL,
  GET_CARD_BALANCE_UPDATE,
  RESET_GET_CARD_BALANCE,
} from "../Actions/types";

const INITIAL_STATE = {
  cardPaytendBalanceInfo: null,
  cardPaytendBalanceError: "",
  isCardPaytendBalanceLoading: false,
  cardPaytendBalanceUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CARD_BALANCE_SUBMIT:
      return {
        ...state,
        isCardPaytendBalanceLoading: true,
        cardPaytendBalancerror: "",
        cardHolderInfo: null,
      };
    case GET_CARD_BALANCE_UPDATE:
      return {
        ...state,
        cardPaytendBalancepdate: action.payload.value,
        cardPaytendBalanceError: "",
        isCardPaytendBalanceLoading: false,
      };

    case GET_CARD_BALANCE_SUCCESS:
      return {
        ...state,
        cardPaytendBalanceInfo: action.payload,
        cardPaytendBalanceError: "",
        isCardPaytendBalanceLoading: false,
      };

    case RESET_GET_CARD_BALANCE:
      return { ...state, ...INITIAL_STATE };

    case GET_CARD_BALANCE_FAIL:
      return {
        ...state,
        cardPaytendBalanceError: action.payload,
        isCardPaytendBalanceLoading: false,
      };
    default:
      return state;
  }
};
