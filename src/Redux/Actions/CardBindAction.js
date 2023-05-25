import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_CARD_ACTIVATE_SUBMIT,
  POST_CARD_ACTIVATE_SUCCESS,
  POST_CARD_ACTIVATE_FAIL,
  POST_CARD_ACTIVATE_UPDATE,
  RESET_ACTIVATE_CARD,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardBindUpdate = ({ prop, value }) => {
  return {
    type: POST_CARD_ACTIVATE_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardBind = () => {
  return {
    type: RESET_ACTIVATE_CARD,
  };
};
//Paytend Api Create Cardholder and  apply for card
/**************************************  card bind paytend ****************************************************/
export const getCardBindAction = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: POST_CARD_ACTIVATE_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          // let body = { id_type: id_type, id_no: id_no };
          CoinCultApi.post(END_POINT.CARD_BIND_URL, null, {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          })
            // APIClient.getInstance()
            //   .postData(END_POINT.CARD_APPLY_URL, body, res)
            .then((response) => {
              getCardBindSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              console.log("getCardBind=-=->>error", JSON.stringify(error));

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                getCardBindFail(dispatch, "");
              }

              if (error?.response?.data?.errors == "Card status is abnormal.") {
                getCardBindFail(dispatch, error?.response?.data?.errors);
                reject(error?.response?.data?.errors);
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                // Singleton.getInstance().showError(
                //   "Server down, please try after sometime"
                // );
                reject("Server down, please try after sometime");
                getCardBindFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
              } else if (error?.response?.status == "500") {
                console.log(
                  "getCardBind=-=500----",
                  JSON.stringify(error?.response)
                );
                reject(error?.response);
                getCardBindFail(dispatch, error?.response);
              } else {
                getCardBindFail(
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

const getCardBindFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_CARD_ACTIVATE_FAIL,
    payload: errorMessage,
  });
};

const getCardBindSuccess = (dispatch, details) => {
  dispatch({
    type: POST_CARD_ACTIVATE_SUCCESS,
    payload: details,
  });
};
