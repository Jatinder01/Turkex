import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_BUY_SELL_SUBMIT,
  POST_BUY_SELL_SUCCESS,
  POST_BUY_SELL_DATA_SUCCESS,
  POST_BUY_SELL_FAIL,
  POST_BUY_SELL_UPDATE,
  RESET_BUY_SELL,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";

export const setBuySellUpdate = ({ prop, value }) => {
  return {
    type: POST_BUY_SELL_UPDATE,
    payload: { prop, value },
  };
};

export const resetBuySell = () => {
  return {
    type: RESET_BUY_SELL,
  };
};

export const postBuySell = (fromCurrency, toCurrency) => {
  return (dispatch) => {
    dispatch({ type: POST_BUY_SELL_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(
          END_POINT.CONVERSION_RATE_POST,
          {
            from_currency: fromCurrency,
            to_currency: toCurrency,
          },
          {
            headers: {
              Authorization: res,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            getBuySellSuccess(dispatch, response?.data);
          })
          .catch((error) => {
            console.log("postBuySell=-=-err=-=", JSON.stringify(error));
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getBuySellFail(dispatch, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              // Singleton.getInstance().showError(
              //   "Server down, please try after sometime"
              // );
              getBuySellFail(
                dispatch,
                "Server down, please try after sometime"
              );
            } else {
              getBuySellFail(dispatch, error?.response?.data.message);
            }
          });
      });
  };
};

const getBuySellFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_BUY_SELL_FAIL,
    payload: errorMessage,
  });
};

const getBuySellSuccess = (dispatch, details) => {
  dispatch({
    type: POST_BUY_SELL_SUCCESS,
    payload: details,
  });
};
