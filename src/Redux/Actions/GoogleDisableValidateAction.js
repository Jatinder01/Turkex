import { Actions } from "react-native-router-flux";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  GOOGLE_DISABLE_VALIDATE_FORM_UPDATE,
  GOOGLE_DISABLE_SUBMIT,
  GOOGLE_DISABLE_VALIDATE_FAIL,
  GOOGLE_DISABLE_VALID_DETAIL_SUCCESS,
} from "./types";
import { VALID_GOOGLE_AUTH_CODE } from "../../Constants";
import { getMultiLingualData } from "../../../Utils";
import { Alert, Platform } from "react-native";
import { CoinCultApi } from "../../api";
import END_POINT from "../../EndPoints";
import { showMessage } from "react-native-flash-message";
import { colors } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";

export const googledisableFormUpdate = ({ prop, value }) => {
  return {
    type: GOOGLE_DISABLE_VALIDATE_FORM_UPDATE,
    payload: { prop, value },
  };
};
/************************************** disable google auth user  ****************************************************/
export const disableGoogleAuthUser = ({ code }) => {
  return (disptach) => {
    disptach({ type: GOOGLE_DISABLE_SUBMIT });

    if (code?.length < 6) {
      googleDisableFail(disptach, VALID_GOOGLE_AUTH_CODE);
    } else {
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.GOOGLE_AUTH_DISABLE_API_POST,
            {
              code: code,
            },
            {
              headers: {
                Authorization: res,
              },
            }
          )
            .then((response) => {
              CoinCultApi.get(END_POINT.GET_USER_ME, {
                headers: {
                  Authorization: JSON.parse(res),
                },
              })
                .then((response) => {
                  Singleton.getInstance()
                    .saveData(
                      constants.USER_DATA,
                      JSON.stringify(response?.data)
                    )
                    .then((res) => {
                      googleDisableSuccess(disptach, response?.data);
                    });
                })
                .catch((error) => {
                  if (error?.response?.status == "401") {
                    Singleton.getInstance().isLoginSuccess = true;
                    Singleton.getInstance().refreshToken(1);
                  }
                  googleDisableFail(
                    disptach,
                    getMultiLingualData(error?.response?.data?.errors[0])
                  );
                });
            })
            .catch((error) => {
              console.log("Error", error?.response?.data?.errors[0]);
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }
              googleDisableFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    }
  };
};

const googleDisableFail = (disptach, errorMessage) => {
  disptach({
    type: GOOGLE_DISABLE_VALIDATE_FAIL,
    payload: errorMessage,
  });
};
const googleDisableSuccess = (disptach, details) => {
  showMessage({
    message: "2FA disabled",
    backgroundColor: ThemeManager.colors.tabBottomBorder,
    autoHide: true,
    duration: 5000,
    type: "success",
    icon: "success",
    position: "right",
    style: {
      marginHorizontal: 10,
      borderRadius: 10,
      marginTop: Platform.OS == "android" ? 10 : 40,
    },
  });

  disptach({
    type: GOOGLE_DISABLE_VALID_DETAIL_SUCCESS,
    payload: details,
  });
  Actions.pop();
};
