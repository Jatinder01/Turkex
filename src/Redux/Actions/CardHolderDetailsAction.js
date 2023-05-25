import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_CARD_HOLDER_DETAILS_SUBMIT,
  GET_CARD_HOLDER_DETAILS_SUCCESS,
  GET_CARD_HOLDER_DETAILS_FAIL,
  GET_CARD_HOLDER_DETAILS_UPDATE,
  RESET_CARD_HOLDER_DETAILS,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardHolderDetailsUpdate = ({ prop, value }) => {
  return {
    type: GET_CARD_HOLDER_DETAILS_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardHolderDetails = () => {
  return {
    type: RESET_CARD_HOLDER_DETAILS,
  };
};
//Paytend Api action Get user cardholder list Details
/**************************************  paytend card holder details ****************************************************/
export const getCardHolderDetails = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: GET_CARD_HOLDER_DETAILS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(END_POINT.CARD_HOLDER_DETAILS_URL, res)
            .then((response) => {
              getCardHolderDetailsSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "getCardHolderDetails=-=->>error",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardHolderDetailsFail(dispatch, "");
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
                getCardHolderDetailsFail(dispatch, "");
                reject("");
              } else {
                getCardHolderDetailsFail(
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

const getCardHolderDetailsFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_CARD_HOLDER_DETAILS_FAIL,
    payload: errorMessage,
  });
};

const getCardHolderDetailsSuccess = (dispatch, details) => {
  dispatch({
    type: GET_CARD_HOLDER_DETAILS_SUCCESS,
    payload: details,
  });
};
