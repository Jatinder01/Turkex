import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

// import {
//   SEND_EMAIL_2FA_AUTHENTICATE_API_GET,
//   TOKEN_VERIFICATION_API_POST,
//   GOOGLE_2FA_AUTHENTICATE_API_POST,
//   GOOGLE_AUTH_DETAILS_API_POST,
// } from '../EndPoints';
import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  GOOGLEAUTH_SUBMIT,
  GOOGLEAUTH_DETAIL_SUCCESS,
  GOOGLEAUTH_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";
/************************************** get google auth details ****************************************************/
export const getGoogleAuthDetails = () => {
  return (disptach) => {
    disptach({ type: GOOGLEAUTH_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(
          END_POINT.GOOGLE_AUTH_DETAILS_API_POST,
          {},
          {
            headers: {
              contentType: "application/json",
              Authorization: res,
            },
          }
        )
          .then((response) => {
            googleAuthDetailSuccess(disptach, response?.data.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              googleAuthDetailFail(disptach, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              googleAuthDetailFail(disptach, "");
            } else {
              googleAuthDetailFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            }
          });
      });
  };
};

const googleAuthDetailFail = (disptach, errorMessage) => {
  disptach({
    type: GOOGLEAUTH_FAIL,
    payload: errorMessage,
  });
};
const googleAuthDetailSuccess = (disptach, details) => {
  disptach({
    type: GOOGLEAUTH_DETAIL_SUCCESS,
    payload: details,
  });
};
