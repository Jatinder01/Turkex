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
  CALLBACK_FIAT_DEPOSIT_SUBMIT,
  CALLBACK_FIAT_DEPOSIT_UPDATE,
  CALLBACK_FIAT_DEPOSIT_SUCCESS,
  CALLBACK_FIAT_DEPOSIT_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";

export const fiatTransactionCallback = (uuid, status, purchase_id) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: CALLBACK_FIAT_DEPOSIT_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.FIAT_TRANSACTION_CALLBACK,
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
              fiatTransactionCallbackSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              fiatTransactionCallbackFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    });
  };
};

const fiatTransactionCallbackFail = (disptach, errorMessage) => {
  disptach({
    type: CALLBACK_FIAT_DEPOSIT_FAIL,
    payload: errorMessage,
  });
};
const fiatTransactionCallbackSuccess = (disptach, details) => {
  disptach({
    type: CALLBACK_FIAT_DEPOSIT_SUCCESS,
    payload: details,
  });
};
