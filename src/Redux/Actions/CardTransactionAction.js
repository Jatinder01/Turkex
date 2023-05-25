import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  CARD_TRX_DETAILS_SUBMIT,
  CARD_TRX_DETAILS_SUCCESS,
  CARD_TRX_DETAILS_FAIL,
  CARD_TRX_DETAILS_UPDATE,
  RESET_CARD_TRX_DETAILS,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardTransactionUpdate = ({ prop, value }) => {
  return {
    type: CARD_TRX_DETAILS_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardTransaction = () => {
  return {
    type: RESET_CARD_TRX_DETAILS,
  };
};

/**************************************  paytend card  trx  ****************************************************/
export const cardTransaction = (
  card_number,
  date_from,
  date_to,
  size,
  start
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: CARD_TRX_DETAILS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .postData(
              END_POINT.CARD_TRANSACTION_URL,
              {
                card_number: card_number,
                date_from: date_from,
                date_to: date_to,
                size: size,
                start: start,
              },
              res
            )
            .then((response) => {
              getCardTransactionSuccess(dispatch, response);
              resolve(response?.tradeList);
            })
            .catch((error) => {
              console.log("cardTransaction=-=->>error", JSON.stringify(error));
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardTransactionFail(dispatch, "");
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
                getCardTransactionFail(dispatch, "");
                reject("");
              } else {
                getCardTransactionFail(
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

const getCardTransactionFail = (dispatch, errorMessage) => {
  dispatch({
    type: CARD_TRX_DETAILS_FAIL,
    payload: errorMessage,
  });
};

const getCardTransactionSuccess = (dispatch, details) => {
  dispatch({
    type: CARD_TRX_DETAILS_SUCCESS,
    payload: details,
  });
};
