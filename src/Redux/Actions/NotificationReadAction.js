import {
  NOTIFY_READ_INIT,
  NOTIFY_READ_SUCCESS,
  NOTIFY_READ_FAIL,
  NOTIFY_READ_RESET,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api";
import END_POINT from "../../EndPoints";

export const resetNotificationRead = () => {
  return {
    type: NOTIFY_READ_RESET,
  };
};
/************************************** get notification read history ****************************************************/
export const getNotificationRead = (id) => (disptach) => {
  console.log("getNotificationRead=-=-id===-=", id);
  return new Promise((resolve, reject) => {
    disptach({ type: NOTIFY_READ_INIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.put(
          END_POINT.NOTIFICATION_READ_URL,
          { id: id, action: "read" },
          {
            headers: {
              contentType: "application/json",
              Authorization: res,
            },
          }
        )
          .then((response) => {
            console.log("getNotificationRead=-=-response===-=", response);
            getNotificationReadSuccess(disptach, response);

            resolve(response);
          })
          .catch((err) => {
            console.log(
              "getNotificationRead list=-=-=err>>>",
              JSON.stringify(err)
            );
            // disptach({ type: NOTIFY_FAIL, payload: "No record found" });
            if (err?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getNotificationReadFail(disptach, "");
              reject("");
            } else if (
              err?.response?.status == "403" ||
              err?.response?.status == "500" ||
              err?.response?.status == "503" ||
              err?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getNotificationReadFail(disptach, "");
              reject("");
            } else {
              getNotificationReadFail(disptach, err);
              reject(err);
            }
          });
      });
  });
};

const getNotificationReadFail = (disptach, errorMessage) => {
  disptach({
    type: NOTIFY_READ_FAIL,
    payload: errorMessage,
  });
};

const getNotificationReadSuccess = (disptach, details) => {
  disptach({
    type: NOTIFY_READ_SUCCESS,
    payload: details,
  });
};
