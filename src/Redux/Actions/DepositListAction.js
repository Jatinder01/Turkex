import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_DEPOSIT_COIN_SUBMIT,
  GET_DEPOSIT_COIN_FAIL,
  GET_DEPOSIT_COIN_SUCCESS,
  GET_DEPOSIT_LIST_UPDATE,
  RESET_DEPOSIT_LIST,
  DEPOSIT_COIN_SUBMIT,
  DEPOSIT_COIN_SUCCESS,
  DEPOSIT_COIN_FAIL,
  DEPOSIT_UPDATE,
  RESET_DEPOSIT,

  //withdraw
  GET_WITHDRAW_COIN_LIST_SUBMIT,
  GET_WITHDRAW_COIN_LIST_SUCCESS,
  GET_WITHDRAW_COIN_LIST_FAIL,
  GET_WITHDRAW_LIST_LIST_UPDATE,
  RESET_WITHDRAW_LIST_LIST,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";

export const setDepositListCoin = ({ prop, value }) => {
  return {
    type: GET_DEPOSIT_LIST_UPDATE,
    payload: { prop, value },
  };
};

export const resetDepositCoin = ({ prop, value }) => {
  return {
    type: GET_DEPOSIT_LIST_UPDATE,
    payload: { prop, value },
  };
};
export const resetDepositList = () => {
  return {
    type: RESET_DEPOSIT_LIST,
  };
};
export const resetWithdrawCoinPairList = () => {
  return {
    type: RESET_WITHDRAW_LIST_LIST,
  };
};
export const resetDepositDetails = () => {
  return {
    type: RESET_DEPOSIT,
  };
};
/**************************************  get withdraw coin list ****************************************************/
export const getWithdrawCoinList = (filter) => {
  return (dispatch) => {
    dispatch({ type: GET_WITHDRAW_COIN_LIST_SUBMIT });

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getData(END_POINT.GET_ACTIVE_COIN_LIST + "?filter=" + filter, res)
          .then((response) => {
            getWithdrawCoinListSuccess(dispatch, response);
          })
          .catch((error) => {
            console.log(
              "getWithdrawCoinList=-=-=->>>error",
              JSON.stringify(error)
            );

            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getWithdrawCoinListFail(dispatch, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getWithdrawCoinListFail(dispatch, "");
            } else {
              getWithdrawCoinListFail(
                dispatch,
                JSON.parse(error?.bodyString)?.errors[0]
              );
            }
          });
      });
  };
};
/**************************************  get deposit coin list ****************************************************/
export const getDepositCoinListPairs = (filter) => {
  return (dispatch) => {
    dispatch({ type: GET_DEPOSIT_COIN_SUBMIT });

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getData(END_POINT.GET_ACTIVE_COIN_LIST + "?filter=" + filter, res)
          .then((response) => {
            getPairsSuccess(dispatch, response);
          })
          .catch((error) => {
            console.log(
              "error=-=getDepositCoinListPair=-=>>",
              JSON.stringify(error)
            );
            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getDetailsFail(dispatch, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getDetailsFail(dispatch, "");
            } else {
              getDetailsFail(
                dispatch,
                JSON.parse(error?.bodyString)?.errors[0]
              );
            }
          });
      });
  };
};
/**************************************  get deposit details ****************************************************/
export const getDepositDetails = (currency) => {
  return (dispatch) => {
    dispatch({ type: DEPOSIT_COIN_SUBMIT });

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getData(
            END_POINT.GET_DEPOSIT_LIST_API + `?currency=${currency}`,
            res
          )
          .then((response) => {
            depositSuccess(dispatch, response);
          })
          .catch((error) => {
            console.log(
              "error=-=getDepositDetails=-=>>",
              JSON.stringify(error)
            );
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;

              Singleton.getInstance().refreshToken(1);
            }
            depositDetailsFail(
              dispatch,
              JSON.parse(error?.bodyString)?.errors[0]
            );
          });
      });
  };
};

const getDetailsFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_DEPOSIT_COIN_FAIL,
    payload: errorMessage,
  });
};

const getPairsSuccess = (dispatch, details) => {
  dispatch({
    type: GET_DEPOSIT_COIN_SUCCESS,
    payload: details,
  });
};

const depositSuccess = (dispatch, details) => {
  dispatch({
    type: DEPOSIT_COIN_SUCCESS,
    payload: details,
  });
};
const depositDetailsFail = (dispatch, errorMessage) => {
  dispatch({
    type: DEPOSIT_COIN_FAIL,
    payload: errorMessage,
  });
};

const getWithdrawCoinListSuccess = (dispatch, details) => {
  dispatch({
    type: GET_WITHDRAW_COIN_LIST_SUCCESS,
    payload: details,
  });
};
const getWithdrawCoinListFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_WITHDRAW_COIN_LIST_FAIL,
    payload: errorMessage,
  });
};
