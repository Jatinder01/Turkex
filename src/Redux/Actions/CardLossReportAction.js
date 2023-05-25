import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_REPORT_CARD_LOSS_SUBMIT,
  POST_REPORT_CARD_LOSS_SUCCESS,
  POST_REPORT_CARD_LOSS_FAIL,
  POST_REPORT_CARD_LOSS_UPDATE,
  RESET_POST_REPORT_CARD_LOSS,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardLossUpdate = ({ prop, value }) => {
  return {
    type: POST_REPORT_CARD_LOSS_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardLoss = () => {
  return {
    type: RESET_POST_REPORT_CARD_LOSS,
  };
};
//Paytend Api Create Cardholder
/**************************************  paytend card loss report  ****************************************************/
export const cardLossReport = (card_number) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: POST_REPORT_CARD_LOSS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          let body = {
            card_number: card_number,
          };
          APIClient.getInstance()
            .postData(
              END_POINT.REPORT_CARD_URL,
              {
                card_number: card_number,
              },
              res
            )
            .then((response) => {
              getCardLossSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("cardLoss=-=->>error", JSON.stringify(error));
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getCardLossFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("Server down, please try after sometime");
              } else if (
                JSON.parse(error?.bodyString)?.errors ==
                "Card status is abnormal."
              ) {
                getCardLossFail(
                  dispatch,
                  JSON.parse(error?.bodyString)?.errors
                );
                reject(JSON.parse(error?.bodyString)?.errors);
              } else {
                getCardLossFail(
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

const getCardLossFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_REPORT_CARD_LOSS_FAIL,
    payload: errorMessage,
  });
};

const getCardLossSuccess = (dispatch, details) => {
  dispatch({
    type: POST_REPORT_CARD_LOSS_SUCCESS,
    payload: details,
  });
};
