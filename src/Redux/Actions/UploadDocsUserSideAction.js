import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  POST_UPLOAD_DOCUMENTS_USER_SUBMIT,
  POST_UPLOAD_DOCUMENTS_USER_SUCCESS,
  POST_UPLOAD_DOCUMENTS_USER_FAIL,
  POST_UPLOAD_DOCUMENTS_USER_UPDATE,
  RESET_POST_UPLOAD_DOCUMENTS_USER,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { APIClient } from "../../api";
import { getMultiLingualData } from "../../../Utils";
export const setUploadDocsUserSideUpdate = ({ prop, value }) => {
  return {
    type: POST_UPLOAD_DOCUMENTS_USER_UPDATE,
    payload: { prop, value },
  };
};

export const resetUploadDocsUserSide = () => {
  return {
    type: RESET_POST_UPLOAD_DOCUMENTS_USER,
  };
};
//Paytend Api Upload document for User side
/************************************** upload doc user side paytend ****************************************************/
export const getUploadDocsUserSide = (doc_type, document_data) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      dispatch({ type: POST_UPLOAD_DOCUMENTS_USER_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          let fileName = document_data.substring(
            document_data.lastIndexOf("/") + 1
          );
          // console.log("image upload---fileName", fileName);
          formData.append("doc_type", doc_type.toLowerCase());
          formData.append("document_data", {
            name: fileName,
            uri: document_data,
            type: "image/jpg",
          });
          // let body = {
          //   doc_type: doc_type.toLowerCase(),
          //   document_data: document_data,
          // };
          // APIClient.getInstance()
          //   .postData(END_POINT.UPLOAD_DOCUMENT_USER_URL, formData, res)
          // APIClient.getInstance()
          //   .postFile(END_POINT.UPLOAD_DOCUMENT_USER_URL, body, res)
          console.log(
            "getUploadDocsUserSide=-=->>formData",
            JSON.stringify(formData)
          );
          CoinCultApi.post(
            END_POINT.UPLOAD_DOCUMENT_USER_URL,
            formData,
            {
              headers: {
                Authorization: JSON.parse(res),
                "Content-Type": "application/json",
              },
            },
            { timeout: 120000 }
          )
            .then((response) => {
              console.log(
                "getUploadDocsUserSide=-=->>response",
                JSON.stringify(response)
              );
              getUploadDocsUserSideSuccess(dispatch, response);
              resolve(response);
            })
            .catch((error) => {
              console.log(
                "getUploadDocsUserSide=-=->>error",
                JSON.stringify(error)
              );

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getUploadDocsUserSideFail(dispatch, "");
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
                getUploadDocsUserSideFail(dispatch, "");
                reject("");
              } else {
                getUploadDocsUserSideFail(
                  dispatch,
                  error?.response?.data?.errors[0]
                );
                reject(error?.response?.data?.errors[0]);
              }
            });
        });
    });
  };
};

const getUploadDocsUserSideFail = (dispatch, errorMessage) => {
  dispatch({
    type: POST_UPLOAD_DOCUMENTS_USER_FAIL,
    payload: errorMessage,
  });
};

const getUploadDocsUserSideSuccess = (dispatch, details) => {
  dispatch({
    type: POST_UPLOAD_DOCUMENTS_USER_SUCCESS,
    payload: details,
  });
};
