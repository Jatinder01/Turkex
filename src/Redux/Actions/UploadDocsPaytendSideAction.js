import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  UPLOAD_DOCUMENTS_PAYTEND_SUBMIT,
  UPLOAD_DOCUMENTS_PAYTEND_SUCCESS,
  UPLOAD_DOCUMENTS_PAYTEND_FAIL,
  UPLOAD_DOCUMENTS_PAYTEND_UPDATE,
  RESET_UPLOAD_DOCUMENTS_PAYTEND,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setUploadDocsPaytendSideUpdate = ({ prop, value }) => {
  return {
    type: UPLOAD_DOCUMENTS_PAYTEND_UPDATE,
    payload: { prop, value },
  };
};

export const resetUploadDocsPaytendSide = () => {
  return {
    type: RESET_UPLOAD_DOCUMENTS_PAYTEND,
  };
};
//Paytend Api Upload document for User side
/************************************** upload doc paytend side****************************************************/
export const getUploadDocsPaytendSide = (doc_type) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: UPLOAD_DOCUMENTS_PAYTEND_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          let body = { doc_type: doc_type.toLowerCase() };
          // APIClient.getInstance()
          //   .postData(END_POINT.UPLOAD_DOCUMENT_PAYTEND_URL, body, res)
          // fetch(END_POINT.BASE_URL + END_POINT.UPLOAD_DOCUMENT_PAYTEND_URL, {
          //   method: "POST",
          //   headers: {
          //     Accept: "application/json",
          //     "Content-Type": "application/json",
          //     Authorization: JSON.parse(res),
          //   },
          //   body: JSON.stringify({ doc_type: doc_type.toLowerCase() }),
          //   timeout: 100000,
          // })
          // .then((response) => response.json())
          CoinCultApi.post(
            END_POINT.UPLOAD_DOCUMENT_PAYTEND_URL,
            { doc_type: doc_type.toLowerCase() },
            {
              headers: {
                Authorization: JSON.parse(res),
                "Content-Type": "application/json",
              },
            },
            { timeout: 120000 }
          )
            .then((response) => {
              // console.log(
              //   'getUploadDocsPaytendSide=-=->>',
              //   JSON.stringify(response),
              // );
              getUploadDocsPaytendSideSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "getUploadDocsPaytendSide=-=->>error",
                JSON.stringify(error)
              );

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getUploadDocsPaytendSideFail(dispatch, "");
                reject("");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getUploadDocsPaytendSideFail(dispatch, "");
                reject("");
              }
              if (error?.response?.status == "504") {
                getUploadDocsPaytendSideFail(dispatch, error?.response?.data);
                reject(error);
              } else {
                getUploadDocsPaytendSideFail(
                  dispatch,
                  error?.response?.data?.errors
                );
                reject(error);
              }
            });
        });
    });
  };
};

const getUploadDocsPaytendSideFail = (dispatch, errorMessage) => {
  dispatch({
    type: UPLOAD_DOCUMENTS_PAYTEND_FAIL,
    payload: errorMessage,
  });
};

const getUploadDocsPaytendSideSuccess = (dispatch, details) => {
  dispatch({
    type: UPLOAD_DOCUMENTS_PAYTEND_SUCCESS,
    payload: details,
  });
};
