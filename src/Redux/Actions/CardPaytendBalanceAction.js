import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_CARD_BALANCE_SUBMIT,
  GET_CARD_BALANCE_SUCCESS,
  GET_CARD_BALANCE_FAIL,
  GET_CARD_BALANCE_UPDATE,
  RESET_GET_CARD_BALANCE,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardPaytendBalanceUpdate = ({ prop, value }) => {
  return {
    type: GET_CARD_BALANCE_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardPaytendBalance = () => {
  return {
    type: RESET_GET_CARD_BALANCE,
  };
};

/**************************************  paytend card balance  ****************************************************/
export const getCardPaytendBalance = (card_number) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: GET_CARD_BALANCE_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(
              END_POINT.CARD_BALANCE_URL +
                "?card_number=" +
                JSON.parse(card_number),
              res
            )
            .then((response) => {
              getCardPaytendBalanceSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "getCardPaytendBalance=-=->>error",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }
              if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getCardPaytendBalanceFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("Server down, please try after sometime");
              } else {
                console.log(
                  "getCardPaytendBalance=-=->>error222",
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
                );
                getCardPaytendBalanceFail(
                  dispatch,
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

const getCardPaytendBalanceFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_CARD_BALANCE_FAIL,
    payload: errorMessage,
  });
};

const getCardPaytendBalanceSuccess = (dispatch, details) => {
  dispatch({
    type: GET_CARD_BALANCE_SUCCESS,
    payload: details,
  });
};
