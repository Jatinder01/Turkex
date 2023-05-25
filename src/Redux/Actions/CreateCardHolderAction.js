import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_CARD_HOLDER_DETAILS_SUBMIT,
  POST_CARD_HOLDER_DETAILS_SUCCESS,
  POST_CARD_HOLDER_DETAILS_FAIL,
  POST_CARD_HOLDER_DETAILS_UPDATE,
  RESET_POST_CARD_HOLDER_DETAILS,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardHolderCreateUpdate = ({ prop, value }) => {
  return {
    type: POST_CARD_HOLDER_DETAILS_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardHolderCreate = () => {
  return {
    type: RESET_POST_CARD_HOLDER_DETAILS,
  };
};
//Paytend Api Create Cardholder
/**************************************  create card holder  ****************************************************/
export const cardHolderCreate = (id_type, id_no) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: POST_CARD_HOLDER_DETAILS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          let body = { id_type: id_type, id_no: id_no };
          APIClient.getInstance()
            .postData(END_POINT.CARD_HOLDER_URL, body, res)
            .then((response) => {
              getCardHolderCreateSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("cardHolderCreate=-=->>error", JSON.stringify(error));
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardHolderCreateFail(dispatch, "");
                reject("");
              }
              if (
                error?.status == "504" ||
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getCardHolderCreateFail(dispatch, "");
                reject("");
                // Singleton.getInstance().isLoginSuccess = true;
                // Singleton.getInstance().refreshToken(1);
              }
              if (
                JSON.parse(error?.bodyString)?.errors == "Cardholder has exists"
              ) {
                getCardHolderCreateFail(
                  dispatch,
                  JSON.parse(error?.bodyString)?.errors
                );
                reject(JSON.parse(error?.bodyString).errors);
              } else {
                getCardHolderCreateFail(
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

const getCardHolderCreateFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_CARD_HOLDER_DETAILS_FAIL,
    payload: errorMessage,
  });
};

const getCardHolderCreateSuccess = (dispatch, details) => {
  dispatch({
    type: POST_CARD_HOLDER_DETAILS_SUCCESS,
    payload: details,
  });
};
