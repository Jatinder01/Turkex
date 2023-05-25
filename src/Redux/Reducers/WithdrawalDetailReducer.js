import {
  WITHDRAWAL_SUBMIT,
  CURRENCY_DETAIL_SUCCESS,
  CURRENCY_DETAIL_FAIL,
  GET_BALANCE_FAIL,
  GET_BALANCE_SUCCESS,
  GET_BALANCE_SUBMIT,
  WITHDRAWAL_FORM_UPDATE,
  RESET_WITHDRAWAL,
  CHECK_WITHDRAWAL_LIMIT_SUCCESS,
  CHECK_WITHDRAWAL_LIMIT_FAIL,
  CHECK_WITHDRAWAL_LIMIT_SUBMIT,
  CHECK_WITHDRAWAL_LIMIT_RESET,
  //list
  CHECK_WITHDRAWAL_LIST_SUCCESS,
  CHECK_WITHDRAWAL_LIST_FAIL,
  CHECK_WITHDRAWAL_LIST_SUBMIT,
  CHECK_WITHDRAWAL_LIST_RESET,
  //beneficiary list
  GET_BENEFICIARIES_LIST_SUCCESS,
  GET_BENEFICIARIES_LIST_FAIL,
  GET_BENEFICIARIES_LIST_SUBMIT,
  GET_BENEFICIARIES_LIST_RESET,

  //Withdrawal history list
  //list
  GET_WITHDRAWAL_LIST_SUCCESS,
  GET_WITHDRAWAL_LIST_FAIL,
  GET_WITHDRAWAL_LIST_SUBMIT,
  GET_WITHDRAWAL_LIST_RESET,
  //
  //balance list
  GET_BALANCE_LIST_SUBMIT,
  GET_BALANCE_LIST_SUCCESS,
  GET_BALANCE_LIST_FAIL,
  GET_BALANCE_LIST_RESET,

  //get single withdrawal history
  GET_SINGLE_WITHDRAWAL_LIST_SUBMIT,
  GET_SINGLE_WITHDRAWAL_LIST_SUCCESS,
  GET_SINGLE_WITHDRAWAL_LIST_FAIL,
  GET_SINGLE_WITHDRAWAL_LIST_RESET,

  //get single withdraw
  GET_SINGLE_DEPOSIT_LIST_SUBMIT,
  GET_SINGLE_DEPOSIT_LIST_SUCCESS,
  GET_SINGLE_DEPOSIT_LIST_FAIL,
  GET_SINGLE_DEPOSIT_LIST_RESET,

  //withdraw otp send
  WITHDRAW_OTP_SUBMIT,
  WITHDRAW_OTP_SUCCESS,
  WITHDRAW_OTP_FAIL,
  WITHDRAW_OTP_RESET,

  //withdraw otp send remove
  WITHDRAW_OTP_REMOVE_SUBMIT,
  WITHDRAW_OTP_REMOVE_SUCCESS,
  WITHDRAW_OTP_REMOVE_FAIL,
  WITHDRAW_OTP_REMOVE_RESET,
} from "../Actions/types";

const INITIAL_STATE = {
  withdrawAddress: "",
  amount: "",
  gOTP: "",
  mailOTP: "",

  withBeniId: "",
  withdrawError: "",
  currencyDetails: null,
  withdrawLimit: null,
  withdrawList: null,
  withDrawListError: "",
  withdrawListIsLoading: false,
  error: "",
  isLoading: false,
  balanceDetails: null,
  currencyError: "",
  currencyDetailsLoading: false,

  beneficiariesListIsLoading: false,
  beneficiariesListError: "",
  beneficiariesList: null,

  withdrawHistoryList: [],
  withDrawListHistoryError: "",
  withdrawListHistoryIsLoading: false,
  totalRecordsWithdrawalHistory: 0,

  currencyBalanceList: null,
  currencyBalanceError: "",
  currencyBalanceIsLoading: false,
  totalRecordsCurrencyBalance: 0,

  //WITHDRAW OTP SEND
  isWithdrawOtpError: null,
  isWithdrawOtpLoading: false,
  withdrawOtpSent: null,

  //WITHDRAW OTP SEND remove
  isWithdrawOtpRemoveError: null,
  isWithdrawOtpRemoveLoading: false,
  withdrawOtpRemove: null,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //WITHDRAW OTP SEND
    case WITHDRAW_OTP_RESET:
      return { ...state, ...INITIAL_STATE };
    //WITHDRAW_OTP_REMOVE_RESET
    case WITHDRAW_OTP_REMOVE_RESET:
      return { ...state, ...INITIAL_STATE };
    // WITHDRAW_OTP_REMOVE_SUCCESS
    case WITHDRAW_OTP_REMOVE_SUCCESS:
      return {
        ...state,
        withdrawOtpRemove: action.payload,
        isWithdrawOtpRemoveLoading: false,
      };
    // WITHDRAW_OTP_REMOVE_SUCCESS
    case WITHDRAW_OTP_REMOVE_SUCCESS:
      return {
        ...state,
        withdrawOtpRemove: action.payload,
        isWithdrawOtpRemoveLoading: false,
      };
    //WITHDRAW_OTP_REMOVE_FAIL
    case WITHDRAW_OTP_REMOVE_FAIL:
      return {
        ...state,
        isWithdrawOtpRemoveError: action.payload,
        isWithdrawOtpRemoveLoading: false,
      };
    case WITHDRAW_OTP_SUBMIT:
      return { ...state, isWithdrawOtpLoading: true, isWithdrawOtpError: "" };
    case WITHDRAW_OTP_REMOVE_SUBMIT:
      return {
        ...state,
        isWithdrawOtpRemoveLoading: true,
        isWithdrawOtpRemoveError: "",
      };

    case WITHDRAW_OTP_SUCCESS:
      return {
        ...state,
        withdrawOtpSent: action.payload,
        isWithdrawOtpLoading: false,
      };

    case WITHDRAW_OTP_FAIL:
      return {
        ...state,
        isWithdrawOtpError: action.payload,
        isWithdrawOtpLoading: false,
      };

    //
    case CHECK_WITHDRAWAL_LIMIT_RESET:
      return { ...state, ...INITIAL_STATE };
    case CHECK_WITHDRAWAL_LIMIT_SUBMIT:
      return { ...state, isLoading: true, error: "" };
    case CHECK_WITHDRAWAL_LIMIT_SUCCESS:
      return {
        ...state,
        withdrawLimit: action.payload,
        error: "",
      };
    case CHECK_WITHDRAWAL_LIMIT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    //list

    case CHECK_WITHDRAWAL_LIST_RESET:
      return { ...state, ...INITIAL_STATE };
    case GET_WITHDRAWAL_LIST_SUBMIT:
      return { ...state, withdrawListIsLoading: true, withDrawListError: "" };
    case CHECK_WITHDRAWAL_LIST_SUCCESS:
      return {
        ...state,
        withdrawList: action.payload,
        withdrawListIsLoading: false,
        withDrawListError: "",
      };
    case GET_WITHDRAWAL_LIST_FAIL:
      return {
        ...state,
        withdrawListIsLoading: false,
        withDrawListError: action.payload,
      };

    //withdrawal history list

    case GET_WITHDRAWAL_LIST_RESET:
      return { ...state, ...INITIAL_STATE };
    case CHECK_WITHDRAWAL_LIST_SUBMIT:
      return {
        ...state,
        withdrawListHistoryIsLoading: true,
        withDrawListHistoryError: "",
      };
    case GET_WITHDRAWAL_LIST_SUCCESS:
      // console.log("action=-=-state", action);
      // console.log("action=-=-state----", state);

      return {
        ...state,
        withdrawHistoryList: state.withdrawHistoryList.concat(
          JSON.parse(action.payload.bodyString)
        ),
        withdrawListHistoryIsLoading: false,
        withDrawListHistoryError: "",
        totalRecordsWithdrawalHistory: action.payload.headers.total,
      };
    case CHECK_WITHDRAWAL_LIST_FAIL:
      return {
        ...state,
        withdrawListHistoryIsLoading: false,
        withDrawListHistoryError: action.payload,
      };

    //---currency balance list=-=-=-=-=

    case GET_BALANCE_LIST_RESET:
      return { ...state, ...INITIAL_STATE };
    case GET_BALANCE_LIST_SUBMIT:
      return {
        ...state,
        currencyBalanceIsLoading: true,
        currencyBalanceError: "",
      };
    case GET_BALANCE_LIST_SUCCESS:
      // console.log("GET_BALANCE_LIST_SUCCESS=-=action-", action);
      return {
        ...state,
        currencyBalanceList: action.payload,

        currencyBalanceIsLoading: false,
        currencyBalanceError: "",
      };
    case GET_BALANCE_LIST_FAIL:
      return {
        ...state,
        currencyBalanceIsLoading: false,
        currencyBalanceError: action.payload,
      };

    //other
    case RESET_WITHDRAWAL:
      return { ...state, ...INITIAL_STATE };
    case WITHDRAWAL_FORM_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case WITHDRAWAL_SUBMIT:
      return { ...state, currencyDetailsLoading: true, currencyError: "" };
    case GET_BALANCE_SUBMIT:
      return { ...state, currencyDetailsLoading: true, currencyError: "" };
    case CURRENCY_DETAIL_SUCCESS:
      return {
        ...state,
        currencyDetails: action.payload,
        currencyDetailsLoading: false,
      };
    case CURRENCY_DETAIL_FAIL:
      return {
        ...state,
        currencyError: action.payload,
        currencyDetailsLoading: false,
      };
    case GET_BALANCE_SUCCESS:
      return {
        ...state,
        balanceDetails: action.payload,
        currencyDetailsLoading: false,
      };
    case GET_BALANCE_FAIL:
      return {
        ...state,
        currencyError: action.payload,
        currencyDetailsLoading: false,
      };

    default:
      return state;
  }
};
