import { CoinCultApi } from "../../api/CoinCultApi";
import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  DELETE_USER_ACCOUNT_UPDATE,
  DELETE_USER_ACCOUNT_SUBMIT,
  DELETE_USER_ACCOUNT_SUCCESS,
  DELETE_USER_ACCOUNT_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";

export const deleteUserAccountUpdate = ({ prop, value }) => {
  return {
    type: DELETE_USER_ACCOUNT_UPDATE,
    payload: { prop, value },
  };
};
/**************************************  delete user account ****************************************************/
export const deleteUserAccountAction = (uid, otp) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: DELETE_USER_ACCOUNT_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.delete(
            END_POINT.DELETE_USER_ACCOUNT_URL +
              "?uid=" +
              uid +
              "&otp_code=" +
              otp,

            {
              headers: {
                contentType: "application/json",
                Authorization: JSON.parse(res),
              },
            }
          )
            .then((response) => {
              console.log(
                "deleteUserAccountAction=-=-=-=-=->>>response",
                JSON.stringify(response)
              );
              deleteUserAccountSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              console.log(
                "deleteUserAccountAction=-=-=-=-=->>>error",
                error?.response
              );
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                deleteUserAccountFail(dispatch, "");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                reject("");
                deleteUserAccountFail(dispatch, "");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
                deleteUserAccountFail(
                  dispatch,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
              }
            });
        });
    });
  };
};

const deleteUserAccountFail = (dispatch, errorMessage) => {
  dispatch({
    type: DELETE_USER_ACCOUNT_FAIL,
    payload: errorMessage,
  });
};
const deleteUserAccountSuccess = (dispatch, details) => {
  dispatch({
    type: DELETE_USER_ACCOUNT_SUCCESS,
    payload: details,
  });
};
