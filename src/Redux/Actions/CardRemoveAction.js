import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_REMOVE_CARD_LOSS_SUBMIT,
  POST_REMOVE_CARD_LOSS_SUCCESS,
  POST_REMOVE_CARD_LOSS_FAIL,
  POST_REMOVE_CARD_LOSS_UPDATE,
  RESET_POST_REMOVE_CARD_LOSS,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardRemoveUpdate = ({ prop, value }) => {
  return {
    type: POST_REMOVE_CARD_LOSS_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardRemove = () => {
  return {
    type: RESET_POST_REMOVE_CARD_LOSS,
  };
};

/**************************************  paytend card remove  ****************************************************/
export const cardRemoveUnblock = (card_number) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: POST_REMOVE_CARD_LOSS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .postData(
              END_POINT.REMOVE_CARD_URL,
              {
                card_number: card_number,
              },
              res
            )
            .then((response) => {
              getCardRemoveSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log("cardRemove=-=->>error", JSON.stringify(error));
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
              }
              getCardRemoveFail(
                dispatch,
                getMultiLingualData(JSON.parse(error?.bodyString)?.errors)
              );
              reject(
                getMultiLingualData(JSON.parse(error?.bodyString)?.errors)
              );
            });
        });
    });
  };
};

const getCardRemoveFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_REMOVE_CARD_LOSS_FAIL,
    payload: errorMessage,
  });
};

const getCardRemoveSuccess = (dispatch, details) => {
  dispatch({
    type: POST_REMOVE_CARD_LOSS_SUCCESS,
    payload: details,
  });
};
