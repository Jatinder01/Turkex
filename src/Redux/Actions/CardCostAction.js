import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  CARD_COST_SUBMIT,
  CARD_COST_SUCCESS,
  CARD_COST_FAIL,
  CARD_COST_UPDATE,
  RESET_CARD_COST,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardCostUpdate = ({ prop, value }) => {
  return {
    type: CARD_COST_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardCost = () => {
  return {
    type: RESET_CARD_COST,
  };
};
//Paytend Api card cost
/**************************************  paytend card cost ****************************************************/
export const cardCostCheckAction = (
  card_number,
  post_code,
  city,
  address,
  country
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: CARD_COST_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .postData(
              END_POINT.CARD_COST_URL,
              {
                card_number: card_number,
                shipping_address: {
                  post_code: post_code,
                  city: city,
                  address: address,
                  country: country,
                },
              },
              res
            )
            .then((response) => {
              getCardCostSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("cardCost=-=->>error", JSON.stringify(error));
              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardCostFail(dispatch, "");
                reject("");
              } else if (
                error?.status == "403" ||
                error?.status == "500" ||
                error?.status == "503" ||
                error?.status == "504"
              ) {
                // Singleton.getInstance().showError(
                //   "Server down, please try after sometime"
                // );
                getCardCostFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("Server down, please try after sometime");
              } else {
                getCardCostFail(
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

const getCardCostFail = (dispatch, errorMessage) => {
  dispatch({
    type: CARD_COST_FAIL,
    payload: errorMessage,
  });
};

const getCardCostSuccess = (dispatch, details) => {
  dispatch({
    type: CARD_COST_SUCCESS,
    payload: details,
  });
};
