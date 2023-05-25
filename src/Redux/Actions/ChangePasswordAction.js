import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  CHANGE_PASS_SUBMIT,
  CHANGE_PASS_FORM_UPDATE,
  CHANGE_PASS_FAIL,
  CHANGE_PASS_SUCCESS,
} from "./types";
import { Alert, Platform } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { colors } from "../../theme";
import { showMessage, hideMessage } from "react-native-flash-message";
import { CoinCultApi } from "../../api/CoinCultApi";
import { ThemeManager } from "../../../ThemeManager";

export const changePasswordFormUpdate = ({ prop, value }) => {
  return {
    type: CHANGE_PASS_FORM_UPDATE,
    payload: { prop, value },
  };
};
/**************************************  change password  ****************************************************/
export const changePasswordRequest = ({
  oldPassword,
  newPassword,
  conPassword,
}) => {
  return (disptach) => {
    disptach({ type: CHANGE_PASS_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.put(
          END_POINT.CHANGE_PASSWORD_API_POST,
          {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: conPassword,
          },
          {
            headers: {
              Authorization: JSON.parse(res),
            },
          }
        )
          .then((response) => {
            changePasswordSuccess(disptach, response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              changePasswordFail(disptach, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              changePasswordFail(disptach, "");
            } else {
              changePasswordFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            }
          });
      });
  };
};

const changePasswordFail = (disptach, errorMessage) => {
  disptach({
    type: CHANGE_PASS_FAIL,
    payload: errorMessage,
  });
};
const changePasswordSuccess = (disptach, details) => {
  Singleton.getInstance().showMsg("Password Changed Successfully.");
  // showMessage({
  //   message: "Password Changed Successfully.",
  //   backgroundColor: ThemeManager.colors.tabBottomBorder,
  //   autoHide: true,
  //   duration: 5000,
  //   type: "success",
  //   icon: "success",
  //   position: "right",
  //   style: {
  //     marginHorizontal: 10,
  //     borderRadius: 10,
  //     marginTop: Platform.OS == "android" ? 10 : 40,
  //   },
  // });
  Actions.pop();
  disptach({
    type: CHANGE_PASS_SUCCESS,
    payload: details,
  });
};
