import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  CALLBACK_FIAT_WITHDRAW_SUBMIT,
  CALLBACK_FIAT_WITHDRAW_UPDATE,
  CALLBACK_FIAT_WITHDRAW_SUCCESS,
  CALLBACK_FIAT_WITHDRAW_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";

export const fiatTransactionWithdrawCallback = (uuid, status, purchase_id) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: CALLBACK_FIAT_WITHDRAW_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.WITHDRAW_FIAT_CALLBACK,
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
              fiatTransactionWithdrawCallbackSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              fiatTransactionWithdrawCallbackFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    });
  };
};

const fiatTransactionWithdrawCallbackFail = (disptach, errorMessage) => {
  disptach({
    type: CALLBACK_FIAT_WITHDRAW_FAIL,
    payload: errorMessage,
  });
};
const fiatTransactionWithdrawCallbackSuccess = (disptach, details) => {
  disptach({
    type: CALLBACK_FIAT_WITHDRAW_SUCCESS,
    payload: details,
  });
};
