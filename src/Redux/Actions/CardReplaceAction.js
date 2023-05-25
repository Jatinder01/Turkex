import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_CARD_REPLACE_SUBMIT,
  POST_CARD_REPLACE_SUCCESS,
  POST_CARD_REPLACE_FAIL,
  POST_CARD_REPLACE_UPDATE,
  RESET_POST_CARD_REPLACE,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardReplaceUpdate = ({ prop, value }) => {
  return {
    type: POST_CARD_REPLACE_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardReplace = () => {
  return {
    type: RESET_POST_CARD_REPLACE,
  };
};
//Paytend Api Create Cardholder
/**************************************  paytend card replace  ****************************************************/
export const cardReplace = (card_number) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: POST_CARD_REPLACE_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .postData(
              END_POINT.REPLACE_CARD_URL,
              {
                card_number: card_number,
              },
              res
            )
            .then((response) => {
              // console.log('cardReplace=-=->>', JSON.stringify(response));
              getCardTopUpSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("cardReplace=-=->>error", JSON.stringify(error));
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(0);
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                // Singleton.getInstance().showError(
                //   "Server down, please try after sometime"
                // );
                getCardTopUpFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("Server down, please try after sometime");
              } else if (
                JSON.parse(error?.bodyString)?.errors ==
                "Card status is abnormal."
              ) {
                getCardTopUpFail(
                  dispatch,
                  JSON.parse(error?.bodyString)?.errors
                );
                reject(JSON.parse(error?.bodyString)?.errors);
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
    type: POST_CARD_REPLACE_FAIL,
    payload: errorMessage,
  });
};

const getCardTopUpSuccess = (dispatch, details) => {
  dispatch({
    type: POST_CARD_REPLACE_SUCCESS,
    payload: details,
  });
};
