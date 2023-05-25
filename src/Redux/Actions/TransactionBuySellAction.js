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
  TRANSACTION_BUY_SELL_SUBMIT,
  TRANSACTION_BUY_SELL_SUCCESS,
  TRANSACTION_BUY_SELL_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";

export const transactionBuySell = (
  fromCurrency,
  toCurrency,
  fromAmount,
  toAmount,
  transactionToken,
  countryCode,
  ipAddress
) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: TRANSACTION_BUY_SELL_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.TRANSACTION_BUY_SELL,
            {
              from_currency: fromCurrency,
              to_currency: toCurrency,
              from_amount: fromAmount,
              to_amount: toAmount,
              transaction_token: transactionToken,
              country_code: countryCode,
              phone: "",
              ip_address: ipAddress,
            },
            {
              headers: {
                contentType: "application/json",
                Authorization: res,
              },
            }
          )
            .then((response) => {
              transactionBuySellSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                transactionBuySellFail(disptach, "");
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
                transactionBuySellFail(disptach, "");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
                transactionBuySellFail(
                  disptach,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
              }
            });
        });
    });
  };
};

const transactionBuySellFail = (disptach, errorMessage) => {
  disptach({
    type: TRANSACTION_BUY_SELL_FAIL,
    payload: errorMessage,
  });
};
const transactionBuySellSuccess = (disptach, details) => {
  disptach({
    type: TRANSACTION_BUY_SELL_SUCCESS,
    payload: details,
  });
};
