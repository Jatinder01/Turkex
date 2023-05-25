import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  TRANSACTION_CALLBACK_SUBMIT,
  TRANSACTION_CALLBACK_SUCCESS,
  TRANSACTION_CALLBACK_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";

export const transactionCallback = (uuid, status, purchase_id) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: TRANSACTION_CALLBACK_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.TRANSACTION_CALLBACK,
            {
              uuid: uuid,
              status: status,
              purchase_id: purchase_id,
            },
            {
              headers: {
                contentType: "application/json",
                Authorization: res,
              },
            }
          )
            .then((response) => {
              transactionCallbackSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                transactionCallbackFail(disptach, "");
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
                transactionCallbackFail(disptach, "");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
                transactionCallbackFail(
                  disptach,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
              }
            });
        });
    });
  };
};

const transactionCallbackFail = (disptach, errorMessage) => {
  disptach({
    type: TRANSACTION_CALLBACK_FAIL,
    payload: errorMessage,
  });
};
const transactionCallbackSuccess = (disptach, details) => {
  disptach({
    type: TRANSACTION_CALLBACK_SUCCESS,
    payload: details,
  });
};
