import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  CARD_TOP_UP_TRX_LIST_SUBMIT,
  CARD_TOP_UP_TRX_LIST_SUCCESS,
  CARD_TOP_UP_TRX_LIST_FAIL,
  CARD_TOP_UP_TRX_LIST_UPDATE,
  RESET_TOP_UP_TRX_LIST_COST,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCardTopUpTrxListUpdate = ({ prop, value }) => {
  return {
    type: CARD_TOP_UP_TRX_LIST_UPDATE,
    payload: { prop, value },
  };
};

export const resetCardTopUpTrxList = () => {
  return {
    type: RESET_TOP_UP_TRX_LIST_COST,
  };
};

/**************************************  paytend card top up trx list  ****************************************************/
export const getCardTopUpTrxList = (card_number, page, limit) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: CARD_TOP_UP_TRX_LIST_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getDataTotal(
              END_POINT.TOP_UP_TRX_LIST_URL +
                "?card_number=" +
                card_number +
                "&page=" +
                page +
                "&limit=" +
                limit,
              res
            )
            .then((response) => {
              getCardTopUpTrxListSuccess(dispatch, { ...response, page });
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "getCardTopUpTrxList=-=->>error",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCardTopUpTrxListFail(dispatch, "");
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
                getCardTopUpTrxListFail(dispatch, "");
                reject("");
              } else {
                getCardTopUpTrxListFail(
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

const getCardTopUpTrxListFail = (dispatch, errorMessage) => {
  dispatch({
    type: CARD_TOP_UP_TRX_LIST_FAIL,
    payload: errorMessage,
  });
};

const getCardTopUpTrxListSuccess = (dispatch, details) => {
  dispatch({
    type: CARD_TOP_UP_TRX_LIST_SUCCESS,
    payload: details,
  });
};
