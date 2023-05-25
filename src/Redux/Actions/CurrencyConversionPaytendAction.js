import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_CURRENCY_CONVERSION_SUBMIT,
  GET_CURRENCY_CONVERSION_SUCCESS,
  GET_CURRENCY_CONVERSION_FAIL,
  GET_CURRENCY_CONVERSION_UPDATE,
  RESET_CURRENCY_CONVERSION,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCurrencyConversionUpdate = ({ prop, value }) => {
  return {
    type: GET_CURRENCY_CONVERSION_UPDATE,
    payload: { prop, value },
  };
};

export const resetCurrencyConversion = () => {
  return {
    type: RESET_CURRENCY_CONVERSION,
  };
};
//Paytend Api action Get user cardholder list Details
/**************************************  currency conversion details  ****************************************************/
export const getCurrencyConversionDetails = (currency, amount) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: GET_CURRENCY_CONVERSION_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          let amountData = amount == "" ? 0 : amount;
          let dataB = amountData * 1;
          APIClient.getInstance()
            .getData(
              END_POINT.CURRENCY_CONVERSION_URL +
                "?currency=" +
                currency +
                "&amount=" +
                dataB,
              res
            )
            .then((response) => {
              getCurrencyConversionSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "getCurrencyConversionDetails=-=->>error",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCurrencyConversionFail(dispatch, "");
                reject("");
              } else if (
                error?.status == "403" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                // Singleton.getInstance().showError(
                //   "Server down, please try after sometime"
                // );
                getCurrencyConversionFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("Server down, please try after sometime");
              } else if (error?.status == "500") {
                getCurrencyConversionFail(
                  dispatch,
                  getMultiLingualData(JSON.parse(error?.bodyString).errors[0])
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString).errors[0])
                );
              } else {
                getCurrencyConversionFail(
                  dispatch,
                  getMultiLingualData(JSON.parse(error?.bodyString).errors)
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString).errors)
                );
              }
            });
        });
    });
  };
};

const getCurrencyConversionFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_CURRENCY_CONVERSION_FAIL,
    payload: errorMessage,
  });
};

const getCurrencyConversionSuccess = (dispatch, details) => {
  dispatch({
    type: GET_CURRENCY_CONVERSION_SUCCESS,
    payload: details,
  });
};
