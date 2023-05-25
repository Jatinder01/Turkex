import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_CARD_TOPUP_SUBMIT,
  POST_CARD_TOPUP_SUCCESS,
  POST_CARD_TOPUP_FAIL,
  POST_CARD_TOPUP_UPDATE,
  RESET_POST_CARD_TOPUP,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardTopUpUpdate = ({ prop, value }) => {
  return {
    type: POST_CARD_TOPUP_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardTopUp = () => {
  return {
    type: RESET_POST_CARD_TOPUP,
  };
};

/**************************************  paytend card top up  ****************************************************/
export const cardTopUp = (card_number, amount, usdt_amount) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: POST_CARD_TOPUP_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          let body = {
            card_number: card_number,
            amount: amount,
            usdt_amount: usdt_amount,
          };
          APIClient.getInstance()
            .postData(
              END_POINT.CARD_TOPUP_URL,
              {
                card_number: card_number,
                amount: amount,
                usdt_amount: usdt_amount,
              },
              res
            )
            .then((response) => {
              getCardTopUpSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("cardTopUp=-=->>error", JSON.stringify(error));
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardTopUpFail(dispatch, "");
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
                getCardTopUpFail(dispatch, "");
                reject("");
              } else {
                getCardTopUpFail(
                  dispatch,
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors)
                );
                reject(
                  getMultiLingualData(JSON.parse(error?.bodyString)?.errors)
                );
              }
            });
        });
    });
  };
};

const getCardTopUpFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_CARD_TOPUP_FAIL,
    payload: errorMessage,
  });
};

const getCardTopUpSuccess = (dispatch, details) => {
  dispatch({
    type: POST_CARD_TOPUP_SUCCESS,
    payload: details,
  });
};
