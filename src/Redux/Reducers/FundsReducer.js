import {
  FUNDS_FORM_UPDATE,
  FUNDS_USER_SUCCESS,
  FUNDS_USER_FAIL,
  FUNDS_USER,
  COIN_TO_USD_SUCCESS,
  COIN_TO_USD_FAIL,
  FUNDS_FORM_RESET,
  //wallet balance
  FUNDS_USER_WALLET_SUCCESS,
  FUNDS_USER_WALLET_FAIL,
  FUNDS_WALLET_USER,
  FUNDS_WALLET_USER_RESET,
  FUNDS_WALLET_USER_UPDATE,
} from "../Actions/types";

const INITIAL_STATE = {
  fundsError: "",
  fundsUserDetails: null,
  selectedPosition: 0,
  fundsLoading: false,
  coinToUsdData: "",
  //wallet
  fundsWalletError: "",
  fundsUserWalletDetails: null,
  selectedWalletPosition: 0,
  fundsWalletLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FUNDS_FORM_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case FUNDS_WALLET_USER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case FUNDS_USER:
      return { ...state, fundsLoading: true, fundsError: "" };
    case FUNDS_WALLET_USER:
      return { ...state, fundsWalletLoading: true, fundsWalletError: "" };
    case FUNDS_USER_WALLET_SUCCESS:
      return {
        ...state,
        fundsUserWalletDetails: action.payload,
        fundsWalletLoading: false,
      };
    case FUNDS_USER_WALLET_FAIL:
      return {
        ...state,
        fundsWalletError: action.payload,
        fundsWalletLoading: false,
      };
    case FUNDS_WALLET_USER_RESET:
      return { ...state, ...INITIAL_STATE };

    case FUNDS_USER_SUCCESS:
      return {
        ...state,
        fundsUserDetails: action.payload,
        fundsLoading: false,
      };
    case FUNDS_USER_FAIL:
      return { ...state, fundsError: action.payload, fundsLoading: false };
    case COIN_TO_USD_SUCCESS:
      return { ...state, coinToUsdData: action.payload, fundsLoading: false };
    case COIN_TO_USD_FAIL:
      return { ...state, fundsError: action.payload, fundsLoading: false };
    case FUNDS_FORM_RESET:
      return { ...state, ...INITIAL_STATE };

    default:
      return state;
  }
};
