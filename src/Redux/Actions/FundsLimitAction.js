import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_FUNDS_LIMIT_SUBMIT,
  GET_FUNDS_LIMIT_SUCCESS,
  GET_FUNDS_LIMIT_FAIL,
  GET_FUNDS_LIMIT_UPDATE,
  RESET_FUNDS_LIMIT,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";

export const setFundsLimitUpdate = ({ prop, value }) => {
  return {
    type: GET_FUNDS_LIMIT_UPDATE,
    payload: { prop, value },
  };
};

export const resetFundsLimit = () => {
  return {
    type: RESET_FUNDS_LIMIT,
  };
};
/**************************************  funds limit  ****************************************************/
export const getFundsLimit = () => {
  return (dispatch) => {
    dispatch({ type: GET_FUNDS_LIMIT_SUBMIT });

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getData(END_POINT.FUNDS_LIMIT, res)
          .then((response) => {
            console.log(
              "check respons fundslimit=-=-=-=>>>response--",
              JSON.stringify(response)
            );
            getFundsLimitSuccess(dispatch, response);
          })
          .catch((error) => {
            console.log(
              "check respons fundslimit=-=-=-=>>>err",
              JSON.stringify(error)
            );

            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getFundsLimitFail(dispatch, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getFundsLimitFail(dispatch, "");
            } else {
              getFundsLimitFail(
                dispatch,
                JSON.parse(error?.bodyString)?.message
              );
            }
          });
      });
  };
};

const getFundsLimitFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_FUNDS_LIMIT_FAIL,
    payload: errorMessage,
  });
};

const getFundsLimitSuccess = (dispatch, details) => {
  dispatch({
    type: GET_FUNDS_LIMIT_SUCCESS,
    payload: details,
  });
};
