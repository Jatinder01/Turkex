import {
  CARD_TRX_DETAILS_SUBMIT,
  CARD_TRX_DETAILS_SUCCESS,
  CARD_TRX_DETAILS_FAIL,
  CARD_TRX_DETAILS_UPDATE,
  RESET_CARD_TRX_DETAILS,
} from "../Actions/types";

const INITIAL_STATE = {
  cardTransactionHolder: [],
  cardTransactionError: "",
  isCardTransactionLoading: false,
  cardTransactionUpdate: "",
  totalRecordsTrx: 0,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_TRX_DETAILS_SUBMIT:
      return {
        ...state,
        isCardTransactionLoading: true,
        cardTransactionError: "",
        // cardTransactionHolder: null,
        totalRecordsTrx: 0,
      };
    case CARD_TRX_DETAILS_UPDATE:
      return {
        ...state,
        cardTransactionUpdate: action.payload.value,
        cardTransactionError: "",
        isCardTransactionLoading: false,
      };

    case CARD_TRX_DETAILS_SUCCESS:
      // console.log("CARD_TRX_DETAILS_SUCCESS-=action-", action.payload);
      // console.log("CARD_TRX_DETAILS_SUCCESS-state=-", state);
      return {
        ...state,
        // cardTransactionHolder: action.payload,
        cardTransactionHolder: state.cardTransactionHolder.concat(
          action.payload.tradeList
        ),
        cardTransactionError: "",
        isCardTransactionLoading: false,
        totalRecordsTrx: action.payload.total,
      };

    case RESET_CARD_TRX_DETAILS:
      return { ...state, ...INITIAL_STATE };

    case CARD_TRX_DETAILS_FAIL:
      return {
        ...state,
        cardTransactionError: action.payload,
        isCardTransactionLoading: false,
        totalRecordsTrx: 0,
      };
    default:
      return state;
  }
};
