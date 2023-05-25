import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_CHECK_DOCUMENT_SUBMIT,
  GET_CHECK_DOCUMENT_SUCCESS,
  GET_CHECK_DOCUMENT_FAIL,
  GET_CHECK_DOCUMENT_UPDATE,
  RESET_CHECK_DOCUMENT,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setCheckDocumentSumSubUpdate = ({ prop, value }) => {
  return {
    type: GET_CHECK_DOCUMENT_UPDATE,
    payload: { prop, value },
  };
};

export const resetCheckDocumentSumSub = () => {
  return {
    type: RESET_CHECK_DOCUMENT,
  };
};

//Paytend Api Check Document for SumSub
/**************************************  sumsub document details check ****************************************************/
export const getCheckDocumentSumSubDetails = (country) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: GET_CHECK_DOCUMENT_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          APIClient.getInstance()
            .getDataCard(
              END_POINT.CHECK_DOCUMENT_URL + "?country=" + country,
              res
            )
            .then((response) => {
              console.log(
                "getCheckDocumentSumSubDetails=-=->>res",
                JSON.stringify(response)
              );
              getCheckDocumentSumSubSuccess(
                dispatch,
                JSON.parse(response?.bodyString)
              );
              resolve(JSON.parse(response?.bodyString));
            })
            .catch((error) => {
              console.log(
                "getCheckDocumentSumSubDetails=-=->>error",
                JSON.stringify(error)
              );

              if (error?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCheckDocumentSumSubFail(dispatch, "");
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
                getCheckDocumentSumSubFail(dispatch, "");
                reject("");
              } else {
                getCheckDocumentSumSubFail(
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

const getCheckDocumentSumSubFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_CHECK_DOCUMENT_FAIL,
    payload: errorMessage,
  });
};

const getCheckDocumentSumSubSuccess = (dispatch, details) => {
  dispatch({
    type: GET_CHECK_DOCUMENT_SUCCESS,
    payload: details,
  });
};
