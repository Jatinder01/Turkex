import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  CARD_FEE_SUBMIT,
  CARD_FEE_SUCCESS,
  CARD_FEE_FAIL,
  CARD_FEE_UPDATE,
  RESET_CARD_FEE,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardFeesUpdate = ({ prop, value }) => {
  return {
    type: CARD_FEE_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardFees = () => {
  return {
    type: RESET_CARD_FEE,
  };
};
//Paytend Api action Get user cardholder list Details
/**************************************  paytend card cost fees ****************************************************/
export const getCardFees = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: CARD_FEE_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getData(END_POINT.CARD_FEE_URL, res)
            .then((response) => {
              getCardFeesSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("getCardFees=-=->>error", JSON.stringify(error));

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardFeesFail(dispatch, "");
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
                getCardFeesFail(dispatch, "");
                reject("");
              } else {
                getCardFeesFail(
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

const getCardFeesFail = (dispatch, errorMessage) => {
  dispatch({
    type: CARD_FEE_FAIL,
    payload: errorMessage,
  });
};

const getCardFeesSuccess = (dispatch, details) => {
  dispatch({
    type: CARD_FEE_SUCCESS,
    payload: details,
  });
};
