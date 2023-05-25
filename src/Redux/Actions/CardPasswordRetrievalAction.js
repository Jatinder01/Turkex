import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  CARD_PASSWORD_RETRIEVAL_SUBMIT,
  CARD_PASSWORD_RETRIEVAL_SUCCESS,
  CARD_PASSWORD_RETRIEVAL_FAIL,
  CARD_PASSWORD_RETRIEVAL_UPDATE,
  RESET_PASSWORD_RETRIEVAL_COST,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardPasswordRetrievalUpdate = ({ prop, value }) => {
  return {
    type: CARD_PASSWORD_RETRIEVAL_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardPasswordRetrieval = () => {
  return {
    type: RESET_PASSWORD_RETRIEVAL_COST,
  };
};
//Paytend Api action Get user cardholder list Details
/**************************************  paytend card password retrieval  ****************************************************/
export const getCardPasswordRetrieval = (card_number) => {
  // console.log("getCardPasswordRetrieval=-=->>", card_number);
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: CARD_PASSWORD_RETRIEVAL_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(
              END_POINT.PASSWORD_RETRIEVAL + "?card_number=" + card_number,
              res
            )
            .then((response) => {
              getCardPasswordRetrievalSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "getCardPasswordRetrieval=-=->>error",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(0);
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getCardPasswordRetrievalFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("Server down, please try after sometime");
              } else if (
                JSON.parse(error?.bodyString)?.errors ==
                "Card status is abnormal."
              ) {
                getCardPasswordRetrievalFail(
                  dispatch,
                  JSON.parse(error?.bodyString)?.errors
                );
                reject(JSON.parse(error?.bodyString)?.errors);
              } else {
                getCardPasswordRetrievalFail(
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

const getCardPasswordRetrievalFail = (dispatch, errorMessage) => {
  dispatch({
    type: CARD_PASSWORD_RETRIEVAL_FAIL,
    payload: errorMessage,
  });
};

const getCardPasswordRetrievalSuccess = (dispatch, details) => {
  dispatch({
    type: CARD_PASSWORD_RETRIEVAL_SUCCESS,
    payload: details,
  });
};
