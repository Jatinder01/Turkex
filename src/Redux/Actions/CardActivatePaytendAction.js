import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  CARD_ACTIVATE_BY_USER_SUBMIT,
  CARD_ACTIVATE_BY_USER_SUCCESS,
  CARD_ACTIVATE_BY_USER_FAIL,
  CARD_ACTIVATE_BY_USER_UPDATE,
  RESET_ACTIVATE_BY_USER_CARD,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardActivatePaytendUpdate = ({ prop, value }) => {
  return {
    type: CARD_ACTIVATE_BY_USER_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardActivatePaytend = () => {
  return {
    type: RESET_ACTIVATE_BY_USER_CARD,
  };
};
//Paytend Api Create Cardholder and  apply for card

export const getCardActivatePaytend = (number) => {
  let cardNumber = number.split(" ").join("");
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: CARD_ACTIVATE_BY_USER_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          // let body = { id_type: id_type, id_no: id_no };
          CoinCultApi.post(
            END_POINT.CARD_ACTIVATE_URL,
            {
              number: cardNumber,
            },
            {
              headers: {
                Authorization: JSON.parse(res),
                "Content-Type": "application/json",
              },
            }
          )
            // APIClient.getInstance()
            //   .postData(END_POINT.CARD_APPLY_URL, body, res)
            .then((response) => {
              // console.log("getCardBindCreate=-=->>", JSON.stringify(response));
              getCardActivatePaytendSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              console.log(
                "getCardBindCreate=-=->>error",
                JSON.stringify(error)
              );

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardActivatePaytendFail(dispatch, "");
                reject("");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getCardActivatePaytendFail(dispatch, "");
                reject("Server down, please try after sometime");
              }
              if (
                error?.response?.data?.error == "card number doesn't exist!"
              ) {
                getCardActivatePaytendFail(
                  dispatch,
                  error?.response?.data?.error
                );
                reject(error?.response?.data?.error);
              } else {
                getCardActivatePaytendFail(
                  dispatch,
                  getMultiLingualData(error?.response?.data?.errors)
                );
                reject(getMultiLingualData(error?.response?.data?.errors));
              }
            });
        });
    });
  };
};

const getCardActivatePaytendFail = (dispatch, errorMessage) => {
  dispatch({
    type: CARD_ACTIVATE_BY_USER_FAIL,
    payload: errorMessage,
  });
};

const getCardActivatePaytendSuccess = (dispatch, details) => {
  dispatch({
    type: CARD_ACTIVATE_BY_USER_SUCCESS,
    payload: details,
  });
};
