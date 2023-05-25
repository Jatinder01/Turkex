import {
  CARD_TOP_UP_TRX_LIST_SUBMIT,
  CARD_TOP_UP_TRX_LIST_SUCCESS,
  CARD_TOP_UP_TRX_LIST_FAIL,
  CARD_TOP_UP_TRX_LIST_UPDATE,
  RESET_TOP_UP_TRX_LIST_COST,
} from "../Actions/types";

const INITIAL_STATE = {
  cardTopUpTrxListInfo: [],
  cardTopUpTrxListError: "",
  isCardTopUpTrxListLoading: false,
  cardTopUpTrxListUpdate: "",
  totalRecords: 0,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_TOP_UP_TRX_LIST_SUBMIT:
      return {
        ...state,
        isCardTopUpTrxListLoading: true,
        cardTopUpTrxListError: "",
        // cardTopUpTrxListInfo: null,
        totalRecords: 0,
      };
    case CARD_TOP_UP_TRX_LIST_UPDATE:
      return {
        ...state,
        cardTopUpTrxListUpdate: action.payload.value,
        cardTopUpTrxListError: "",
        isCardTopUpTrxListLoading: false,
      };

    case CARD_TOP_UP_TRX_LIST_SUCCESS:
      // console.log("action.payload=-=action-", action.payload);
      // console.log("action.payload=-state=-", state);
      if (action.payload.page == 1) {
        return {
          ...state,
          // cardTopUpTrxListInfo: JSON.parse(action.payload.bodyString),
          cardTopUpTrxListInfo: JSON.parse(action.payload.bodyString),
          totalRecords: action.payload.headers.total,
          cardTopUpTrxListError: "",
          isCardTopUpTrxListLoading: false,
        };
      } else {
        return {
          ...state,
          // cardTopUpTrxListInfo: JSON.parse(action.payload.bodyString),
          cardTopUpTrxListInfo: state.cardTopUpTrxListInfo.concat(
            JSON.parse(action.payload.bodyString)
          ),
          totalRecords: action.payload.headers.total,
          cardTopUpTrxListError: "",
          isCardTopUpTrxListLoading: false,
        };
      }

    case RESET_TOP_UP_TRX_LIST_COST:
      return { ...state, ...INITIAL_STATE };

    case CARD_TOP_UP_TRX_LIST_FAIL:
      return {
        ...state,
        cardTopUpTrxListError: action.payload,
        isCardTopUpTrxListLoading: false,
        totalRecords: 0,
      };
    default:
      return state;
  }
};
