import { Actions } from "react-native-router-flux";
import { CoinCultApi } from "../../api/CoinCultApi";
import END_POINT from "../../EndPoints";
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

  //get single trade data
  GET_SINGLE_TRADE_LIST_SUBMIT,
  GET_SINGLE_TRADE_LIST_SUCCESS,
  GET_SINGLE_TRADE_LIST_FAIL,
  GET_SINGLE_TRADE_LIST_RESET,

  //withdraw otp send
  WITHDRAW_OTP_SUBMIT,
  WITHDRAW_OTP_SUCCESS,
  WITHDRAW_OTP_FAIL,
  WITHDRAW_OTP_RESET,

  //withdraw otp send expire
  WITHDRAW_OTP_REMOVE_SUBMIT,
  WITHDRAW_OTP_REMOVE_SUCCESS,
  WITHDRAW_OTP_REMOVE_FAIL,
  WITHDRAW_OTP_REMOVE_RESET,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { APIClient } from "../../api";

// export const setSelectedCoin = ({ prop, value }) => {
//     return {
//         type: GET_COIN_LIST_UPDATE,
//         payload: { prop, value },
//     };
// };
export const resetCheckWithdrawLimit = () => {
  return {
    type: CHECK_WITHDRAWAL_LIMIT_RESET,
  };
};
export const resetWithdrawOtpSend = () => {
  return {
    type: WITHDRAW_OTP_REMOVE_RESET,
  };
};
export const resetWithdrawOtpRemove = () => {
  return {
    type: WITHDRAW_OTP_RESET,
  };
};
export const resetSingleWithdrawData = () => {
  return {
    type: GET_SINGLE_WITHDRAWAL_LIST_RESET,
  };
};
export const resetSingleDepositData = () => {
  return {
    type: GET_SINGLE_DEPOSIT_LIST_RESET,
  };
};
export const resetSingleTradeData = () => {
  return {
    type: GET_SINGLE_TRADE_LIST_RESET,
  };
};
export const resetCheckWithdrawList = () => {
  return {
    type: CHECK_WITHDRAWAL_LIST_RESET,
  };
};
export const resetGetWithdrawHistoryList = () => {
  return {
    type: GET_WITHDRAWAL_LIST_RESET,
  };
};
export const resetBalanceList = () => {
  return {
    type: GET_BALANCE_LIST_RESET,
  };
};
export const withdrawFormUpdate = ({ prop, value }) => {
  return {
    type: WITHDRAWAL_FORM_UPDATE,
    payload: { prop, value },
  };
};

export const resetWithdrawalForm = () => {
  return {
    type: RESET_WITHDRAWAL,
  };
};
export const resetBeneficiariesList = () => {
  return {
    type: GET_BENEFICIARIES_LIST_RESET,
  };
};
/************************************** get single trade history ****************************************************/
export const getSingleTradeHistoryData = (id) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GET_SINGLE_WITHDRAWAL_LIST_SUBMIT });
      //Call API
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(END_POINT.SINGLE_TRADE_API_POST + id, res)
            .then((response) => {
              getSingleTradeHistoryDataSuccess(disptach, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("getSingleTradeHistoryData=-=-error=->>", error);
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getSingleTradeHistoryDataFail(disptach, "");
                reject("");
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getSingleTradeHistoryDataFail(disptach, "");
                reject("");
              } else {
                getSingleTradeHistoryDataFail(
                  disptach,
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
              }
            });
        });
    });
  };
};
/************************************** get single withdraw history ****************************************************/
export const getSingleWithdrawHistoryData = (id) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GET_SINGLE_WITHDRAWAL_LIST_SUBMIT });
      //Call API
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(END_POINT.SINGLE_WITHDRAW_API_POST + id, res)
            .then((response) => {
              getSingleWithdrawHistoryDataSuccess(disptach, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("getSingleWithdrawHistoryData=-=-error=->>", error);
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getSingleWithdrawHistoryDataFail(disptach, "");
                reject("");
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getSingleWithdrawHistoryDataFail(disptach, "");
                reject("");
              } else {
                getSingleWithdrawHistoryDataFail(
                  disptach,
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
              }
            });
        });
    });
  };
};
/************************************** get single deposit history ****************************************************/
export const getSingleDepositHistoryData = (id) => {
  // console.log("getSingleDepositHistoryData=-=-=->>", id);
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GET_SINGLE_DEPOSIT_LIST_SUBMIT });
      //Call API
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(END_POINT.SINGLE_DEPOSIT_API_POST + id, res)
            .then((response) => {
              // console.log("getSingleDepositHistoryData=-=-=->>", response);
              getSingleDepositHistoryDataSuccess(disptach, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("getSingleDepositHistoryData=-=-error=->>", error);
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getSingleDepositHistoryDataFail(disptach, "");
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getSingleDepositHistoryDataFail(disptach, "");
              } else {
                getSingleDepositHistoryDataFail(
                  disptach,
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
              }
            });
        });
    });
  };
};
/************************************** get currency details ****************************************************/
export const getCurrencyDetails = ({ coinName }) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: WITHDRAWAL_SUBMIT });

      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getList(END_POINT.GET_USER_ACCOUNT_BAL + coinName, res)
            .then((response) => {
              getCurrencyDetailsSuccess(
                disptach,
                JSON.parse(response.bodyString)
              );
              resolve(JSON.parse(response?.bodyString));
            })
            .catch((error) => {
              console.log("getCurrencyDetails===-=-error=->>", error);

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCurrencyDetailsFail(disptach, "");
                reject("");
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getCurrencyDetailsFail(disptach, "");
                reject("");
              } else {
                getCurrencyDetailsFail(
                  disptach,
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
              }
            });
        });
    });
  };
};
/************************************** get currency details list ****************************************************/
export const getCurrencyDetailsList = () => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GET_BALANCE_LIST_SUBMIT });

      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getList(END_POINT.GET_USER_ACCOUNT_BAL, res)
            .then((response) => {
              // console.log("getCurrencyDetailsList===-=-response=->>", response);

              getBalanceListSuccess(disptach, JSON.parse(response.bodyString));
              resolve(JSON.parse(response.bodyString));
            })
            .catch((error) => {
              console.log("getCurrencyDetailsList===-=-error=->>", error);

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCheckWithdrawLimitFail(disptach, "");
                reject("");
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getCheckWithdrawLimitFail(disptach, "");
                reject("");
              } else {
                getCheckWithdrawLimitFail(
                  disptach,
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
              }
            });
        });
    });
  };
};
/************************************** check withdraw limit ****************************************************/
export const checkWithdrawLimit = (coinName) => {
  return (disptach) => {
    disptach({ type: CHECK_WITHDRAWAL_LIMIT_SUBMIT });

    APIClient.getInstance()
      .getListWithoutAuth(
        END_POINT.WITHDRAWAL_LIMIT_URL + "?currency=" + coinName
      )
      .then((response) => {
        getWithdrawalLimitSuccess(disptach, response);
      })
      .catch((error) => {
        console.log("checkWithdrawLimit===-=-error=->>", error);

        if (error?.status == "401") {
          Singleton.getInstance().isLoginSuccess = true;
          Singleton.getInstance().refreshToken(1);
          getCheckWithdrawLimitFail(disptach, "");
        } else if (
          error?.status == "403" ||
          error?.status == "500" ||
          error?.status == "503" ||
          error?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
          getCheckWithdrawLimitFail(disptach, "");
        } else {
          getCheckWithdrawLimitFail(
            disptach,
            getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
          );
        }
      });
    // });
  };
};
/************************************** check withdraw list ****************************************************/
export const checkWithdrawList = (coinName, page, limit) => {
  return (disptach) => {
    disptach({ type: CHECK_WITHDRAWAL_LIST_SUBMIT });
    //Call API

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getList(
            END_POINT.WITHDRAW_API_POST +
              "?currency=" +
              coinName +
              "&page=" +
              page +
              "&limit=" +
              limit,
            res
          )
          .then((response) => {
            getWithdrawalListSuccess(disptach, response);
          })
          .catch((error) => {
            console.log("WITHDRAW_API_POST===-error=-=->>", error);

            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getCheckWithdrawListFail(disptach, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getCheckWithdrawListFail(disptach, "");
            } else {
              getCheckWithdrawListFail(
                disptach,
                getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
              );
            }
          });
      });
  };
};
/************************************** get withdraw history ****************************************************/
export const getWithdrawHistoryList = (page, limit) => {
  return (disptach) => {
    disptach({ type: GET_WITHDRAWAL_LIST_SUBMIT });
    //Call API

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getList(
            END_POINT.WITHDRAW_API_POST + "?limit=" + limit + "&page=" + page,
            res
          )
          .then((response) => {
            getWithdrawHistoryListSuccess(disptach, response);
          })
          .catch((error) => {
            console.log("getWithdrawHistoryList=-=-error=->>", error);

            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getWithdrawHistoryListFail(disptach, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getWithdrawHistoryListFail(disptach, "");
            } else {
              getWithdrawHistoryListFail(
                disptach,
                getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
              );
            }
          });
      });
  };
};
/************************************** get balance details ****************************************************/
export const getBalanceDetails = ({ coinName }) => {
  return (disptach) => {
    disptach({ type: GET_BALANCE_SUBMIT });
    //Call API

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        console.log("getBalanceDetails==accesstoken==>>", res);
        APIClient.getInstance()
          .getData(END_POINT.GET_USER_ACCOUNT_BAL + coinName, res)
          .then((response) => {
            getBalanceSuccess(disptach, response);
          })
          .catch((error) => {
            console.log(
              "getBalanceDetails=-=-=->>error",
              JSON.stringify(error)
            );
            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getBalanceFail(disptach, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getBalanceFail(disptach, "");
            } else {
              getBalanceFail(
                disptach,
                getMultiLingualData(JSON.parse(error?.bodyString)?.message)
              );
            }
          });
      });
  };
};
/************************************** withdraw otp send expire request  ****************************************************/
export const withdrawOtpExpireRequest = () => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: WITHDRAW_OTP_REMOVE_SUBMIT });

      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .postData(END_POINT.WITHDRAW_OTP_EXPIRE_URL, {}, res)
            .then((response) => {
              console.log(
                "response=-=withdrawOtpExpireRequest-=>>>response>>",
                response
              );
              withdrawOtpRemoveReqSuccess(disptach, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "response=-=withdrawOtpExpireRequest-=>>>error>>",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                withdrawOtpRemoveFail(disptach, "");
              } else if (
                error?.status == "503" ||
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                reject("");
                withdrawOtpRemoveFail(disptach, "");
              } else {
                reject(
                  JSON.parse(error?.bodyString)?.message
                    ? JSON.parse(error?.bodyString)?.message
                    : getMultiLingualData(
                        JSON.parse(error?.bodyString)?.errors[0]
                      )
                );

                withdrawOtpRemoveFail(
                  disptach,
                  JSON.parse(error?.bodyString)?.message
                    ? JSON.parse(error?.bodyString)?.message
                    : getMultiLingualData(
                        JSON.parse(error?.bodyString)?.errors[0]
                      )
                );
              }
            });
        });
    });
  };
};
/************************************** withdraw otp send request  ****************************************************/
export const withdrawOtpSendRequest = ({
  amount,
  beneficiary_id,
  currency,
  resend_otp,
}) => {
  console.log("amount----", amount);
  console.log("beneficiary_id----", beneficiary_id);
  console.log("currency----", currency);

  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: WITHDRAW_OTP_SUBMIT });
      let body;
      if (resend_otp) {
        body = {
          beneficiary_id: beneficiary_id,
          currency: currency,
          amount: amount,
          resend_otp: resend_otp,
        };
      } else {
        body = {
          beneficiary_id: beneficiary_id,
          currency: currency,
          amount: amount,
        };
      }
      // let body = {
      //   beneficiary_id: beneficiary_id,
      //   currency: currency,
      //   amount: amount,
      // };
      console.log("body=-=withdrawOtpSendRequest-=>>>>", body);
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .postData(END_POINT.WITHDRAW_OTP_URL, body, res)
            .then((response) => {
              console.log(
                "response=-=withdrawOtpSendRequest-=>>>response>>",
                response
              );
              withdrawOtpSendReqSuccess(disptach, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "response=-=withdrawOtpSendRequest-=>>>error>>",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                withdrawOtpSendFail(disptach, "");
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                reject("");
                withdrawOtpSendFail(disptach, "");
              } else {
                reject(
                  JSON.parse(error?.bodyString)?.message
                    ? JSON.parse(error?.bodyString)?.message
                    : getMultiLingualData(
                        JSON.parse(error?.bodyString)?.errors[0]
                      )
                );

                withdrawOtpSendFail(
                  disptach,
                  JSON.parse(error?.bodyString)?.message
                    ? JSON.parse(error?.bodyString)?.message
                    : getMultiLingualData(
                        JSON.parse(error?.bodyString)?.errors[0]
                      )
                );
              }
              // else if (error?.status == "503") {
              //   Singleton.getInstance().showError(
              //     "Server down, please try after sometime"
              //   );
              // }
              // reject(
              //   JSON.parse(error?.bodyString)?.message
              //     ? JSON.parse(error?.bodyString)?.message
              //     : getMultiLingualData(
              //         JSON.parse(error?.bodyString)?.errors[0]
              //       )
              // );
              // // Singleton.getInstance().showError(
              // //   JSON.parse(error?.bodyString)?.message
              // //     ? JSON.parse(error?.bodyString)?.message
              // //     : getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
              // // );
              // withdrawOtpSendFail(
              //   disptach,
              //   JSON.parse(error?.bodyString)?.message
              //     ? JSON.parse(error?.bodyString)?.message
              //     : getMultiLingualData(
              //         JSON.parse(error?.bodyString)?.errors[0]
              //       )
              // );
            });
        });
    });
  };
};
const getCurrencyDetailsFail = (disptach, errorMessage) => {
  disptach({
    type: CURRENCY_DETAIL_FAIL,
    payload: errorMessage,
  });
};

const getCurrencyDetailsSuccess = (disptach, details) => {
  disptach({
    type: CURRENCY_DETAIL_SUCCESS,
    payload: details,
  });
};
const withdrawOtpRemoveFail = (disptach, errorMessage) => {
  disptach({
    type: WITHDRAW_OTP_REMOVE_FAIL,
    payload: errorMessage,
  });
};
const withdrawOtpSendFail = (disptach, errorMessage) => {
  disptach({
    type: WITHDRAW_OTP_FAIL,
    payload: errorMessage,
  });
};
const withdrawOtpRemoveReqSuccess = (disptach, details) => {
  disptach({
    type: WITHDRAW_OTP_REMOVE_SUCCESS,
    payload: details,
  });
};
const withdrawOtpSendReqSuccess = (disptach, details) => {
  disptach({
    type: WITHDRAW_OTP_SUCCESS,
    payload: details,
  });
};
const getBalanceFail = (disptach, errorMessage) => {
  disptach({
    type: GET_BALANCE_FAIL,
    payload: errorMessage,
  });
};

const getBalanceSuccess = (disptach, details) => {
  disptach({
    type: GET_BALANCE_SUCCESS,
    payload: details,
  });
};
//single trade
const getSingleTradeHistoryDataSuccess = (disptach, details) => {
  disptach({
    type: GET_SINGLE_TRADE_LIST_SUCCESS,
    payload: details,
  });
};
const getSingleTradeHistoryDataFail = (disptach, errorMessage) => {
  disptach({
    type: GET_SINGLE_TRADE_LIST_FAIL,
    payload: errorMessage,
  });
};
//single withdraw
const getSingleWithdrawHistoryDataSuccess = (disptach, details) => {
  disptach({
    type: GET_SINGLE_WITHDRAWAL_LIST_SUCCESS,
    payload: details,
  });
};
const getSingleWithdrawHistoryDataFail = (disptach, errorMessage) => {
  disptach({
    type: GET_SINGLE_WITHDRAWAL_LIST_FAIL,
    payload: errorMessage,
  });
};
//single deposit
const getSingleDepositHistoryDataSuccess = (disptach, details) => {
  disptach({
    type: GET_SINGLE_DEPOSIT_LIST_SUCCESS,
    payload: details,
  });
};
const getSingleDepositHistoryDataFail = (disptach, errorMessage) => {
  disptach({
    type: GET_SINGLE_DEPOSIT_LIST_FAIL,
    payload: errorMessage,
  });
};
const getWithdrawalLimitSuccess = (disptach, details) => {
  disptach({
    type: CHECK_WITHDRAWAL_LIMIT_SUCCESS,
    payload: details,
  });
};
const getCheckWithdrawLimitFail = (disptach, errorMessage) => {
  disptach({
    type: CHECK_WITHDRAWAL_LIMIT_FAIL,
    payload: errorMessage,
  });
};

const getWithdrawalListSuccess = (disptach, details) => {
  disptach({
    type: CHECK_WITHDRAWAL_LIST_SUCCESS,
    payload: details,
  });
};
const getCheckWithdrawListFail = (disptach, errorMessage) => {
  disptach({
    type: CHECK_WITHDRAWAL_LIST_FAIL,
    payload: errorMessage,
  });
};

const getBeneficiariesSuccess = (disptach, details) => {
  disptach({
    type: GET_BENEFICIARIES_LIST_SUCCESS,
    payload: details,
  });
};
const getBeneficiariesFail = (disptach, errorMessage) => {
  disptach({
    type: GET_BENEFICIARIES_LIST_FAIL,
    payload: errorMessage,
  });
};

const getWithdrawHistoryListSuccess = (disptach, details) => {
  disptach({
    type: GET_WITHDRAWAL_LIST_SUCCESS,
    payload: details,
  });
};
const getWithdrawHistoryListFail = (disptach, errorMessage) => {
  disptach({
    type: GET_WITHDRAWAL_LIST_FAIL,
    payload: errorMessage,
  });
};

const getBalanceListSuccess = (disptach, details) => {
  disptach({
    type: GET_BALANCE_LIST_SUCCESS,
    payload: details,
  });
};
const getBalanceListFail = (disptach, errorMessage) => {
  disptach({
    type: GET_BALANCE_LIST_FAIL,
    payload: errorMessage,
  });
};
