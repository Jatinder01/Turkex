import { Actions } from "react-native-router-flux";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  GOOGLE_AUTH_FORM_UPDATE,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
  GOOGLE_AUTH_USER,
} from "./types";
import END_POINT from "../../EndPoints";
import { CoinCultApi } from "../../api";

export const googleAuthFormUpdate = ({ prop, value }) => {
  return {
    type: GOOGLE_AUTH_FORM_UPDATE,
    payload: { prop, value },
  };
};
/************************************** google auth user  ****************************************************/
export const googleAuthUser = ({ googleAuthCode, withdraw, refProps }) => {
  return (disptach) => {
    disptach({ type: GOOGLE_AUTH_USER });
    debugger;
    if (googleAuthCode == "") {
      googleAuthFail(disptach, "Google Auth can't be empty");
    } else {
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.GOOGLE_2FA_AUTHENTICATE_API_POST,
            {
              token: googleAuthCode,
            },
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              if (withdraw == true) {
                googleAuthWithdrawSuccess(disptach, response?.data, refProps);
              } else {
                googleAuthSuccess(disptach, response?.data);
              }
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                googleAuthFail(disptach, "");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                googleAuthFail(disptach, "");
              } else {
                googleAuthFail(disptach, error?.response?.data.message);
              }
            })
            .catch((err) => {
              debugger;
            });
        });
    }
  };
};
const googleAuthFail = (disptach, errorMessage) => {
  disptach({
    type: GOOGLE_AUTH_FAIL,
    payload: errorMessage,
  });
};
const googleAuthSuccess = (disptach, user) => {
  disptach({
    type: GOOGLE_AUTH_SUCCESS,
    payload: user,
  });
  Singleton.getInstance().saveData(constants.IS_LOGIN, "true");
  Actions.tab();
};

const googleAuthWithdrawSuccess = (disptach, user, refProps) => {
  disptach({
    type: GOOGLE_AUTH_SUCCESS,
    payload: user,
  });

  refProps.navigation.navigate("DepositConfirmatiOnAndBankTransfer", {
    withdrawValidate: {},
  });
  // Actions.pop({ withdrawValidate: {} })
};
