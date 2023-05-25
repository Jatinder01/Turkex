import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_CARD_LIST_SUBMIT,
  GET_CARD_LIST_SUCCESS,
  GET_CARD_LIST_FAIL,
  GET_CARD_LIST_UPDATE,
  RESET_CARD_LIST_LOSS,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardListUpdate = ({ prop, value }) => {
  return {
    type: GET_CARD_LIST_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardList = () => {
  return {
    type: RESET_CARD_LIST_LOSS,
  };
};
//Paytend Api action Get user cardholder list Details
/**************************************  paytend card list details  ****************************************************/
export const getCardList = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: GET_CARD_LIST_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(END_POINT.LIST_CARD_URL, res)
            .then((response) => {
              getCardListSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("getCardList=-=->>error", JSON.stringify(error));

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardListFail(dispatch, "");
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
                getCardListFail(dispatch, "");
                reject("");
              } else {
                getCardListFail(
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

const getCardListFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_CARD_LIST_FAIL,
    payload: errorMessage,
  });
};

const getCardListSuccess = (dispatch, details) => {
  dispatch({
    type: GET_CARD_LIST_SUCCESS,
    payload: details,
  });
};
