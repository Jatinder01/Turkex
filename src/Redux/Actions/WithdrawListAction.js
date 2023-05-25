import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_WITHDRAW_COIN_SUBMIT,
  GET_WITHDRAW_COIN_SUCCESS,
  GET_WITHDRAW_COIN_FAIL,
  GET_WITHDRAW_LIST_UPDATE,
  RESET_WITHDRAW_LIST,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";

export const setWithdrawListFiatUpdate = ({ prop, value }) => {
  return {
    type: GET_WITHDRAW_LIST_UPDATE,
    payload: { prop, value },
  };
};

export const resetWithdrawFiatList = () => {
  return {
    type: RESET_WITHDRAW_LIST,
  };
};
/************************************** get withdraw list ****************************************************/
export const getWithdrawFiatList = (filter) => {
  return (dispatch) => {
    dispatch({ type: GET_WITHDRAW_COIN_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.GET_ACTIVE_COIN_LIST + "?filter=" + filter, {
          headers: {
            // Authorization: Singleton.getInstance().accessToken,
            Authorization: JSON.parse(res),
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            getWithdrawListSuccess(dispatch, response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getWithdrawListFail(dispatch, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getWithdrawListFail(dispatch, "");
            } else {
              getWithdrawListFail(dispatch, error?.response?.data?.message);
            }
          });
      });
  };
};

const getWithdrawListFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_WITHDRAW_COIN_FAIL,
    payload: errorMessage,
  });
};

const getWithdrawListSuccess = (dispatch, details) => {
  dispatch({
    type: GET_WITHDRAW_COIN_SUCCESS,
    payload: details,
  });
};
