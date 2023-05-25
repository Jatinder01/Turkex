import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_CARD_APPLY_SUBMIT,
  POST_CARD_APPLY_SUCCESS,
  POST_CARD_APPLY_FAIL,
  POST_CARD_APPLY_UPDATE,
  RESET_POST_CARD_APPLY,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardApplyUpdate = ({ prop, value }) => {
  return {
    type: POST_CARD_APPLY_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardApply = () => {
  return {
    type: RESET_POST_CARD_APPLY,
  };
};
//Paytend Api After apply card need to activate that card
/************************************** create card paytend ****************************************************/
export const getCardApplyCreate = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: POST_CARD_APPLY_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          // let body = { id_type: id_type, id_no: id_no };
          CoinCultApi.post(END_POINT.CARD_APPLY_URL, {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          })
            // APIClient.getInstance()
            //   .postData(END_POINT.CARD_APPLY_URL, body, res)
            .then((response) => {
              getCardApplySuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              console.log(
                "getCardApplyCreate=-=->>error",
                JSON.stringify(error)
              );

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardApplyFail(dispatch, "");
                reject("");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                // Singleton.getInstance().showError(
                //   "Server down, please try after sometime"
                // );
                getCardApplyFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("Server down, please try after sometime");
              } else {
                getCardApplyFail(
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

const getCardApplyFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_CARD_APPLY_FAIL,
    payload: errorMessage,
  });
};

const getCardApplySuccess = (dispatch, details) => {
  dispatch({
    type: POST_CARD_APPLY_SUCCESS,
    payload: details,
  });
};
