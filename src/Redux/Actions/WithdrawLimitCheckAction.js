import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_WITHDRAW_LIMIT_FIAT_SUBMIT,
  GET_WITHDRAW_LIMIT_FIAT_SUCCESS,
  GET_WITHDRAW_LIMIT_FIAT_FAIL,
  GET_WITHDRAW_LIMIT_FIAT_UPDATE,
  RESET_WITHDRAW_LIMIT_FIAT,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";

export const setWithdrawLimitFiatUpdate = ({ prop, value }) => {
  return {
    type: GET_WITHDRAW_LIMIT_FIAT_UPDATE,
    payload: { prop, value },
  };
};

export const resetWithdrawLimitFiat = () => {
  return {
    type: RESET_WITHDRAW_LIMIT_FIAT,
  };
};
/************************************** get withdraw fiat limit ****************************************************/
export const getWithdrawLimitFiat = (currency) => {
  return (dispatch) => {
    dispatch({ type: GET_WITHDRAW_LIMIT_FIAT_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.WITHDRAW_LIMIT_EXCEED + currency, {
          headers: {
            Authorization: JSON.parse(res),
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            getWithdrawLimitSuccess(dispatch, response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getWithdrawLimitFail(dispatch, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getWithdrawLimitFail(dispatch, "");
            } else {
              getWithdrawLimitFail(dispatch, error?.response?.data?.message);
            }
          });
      });
  };
};

const getWithdrawLimitFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_WITHDRAW_LIMIT_FIAT_FAIL,
    payload: errorMessage,
  });
};

const getWithdrawLimitSuccess = (dispatch, details) => {
  dispatch({
    type: GET_WITHDRAW_LIMIT_FIAT_SUCCESS,
    payload: details,
  });
};
