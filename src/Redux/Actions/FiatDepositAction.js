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
  FIAT_BANK_UPDATE,
  FIAT_BANK_SUBMIT,
  FIAT_BANK_SUCCESS,
  FIAT_BANK_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";
import { showMessage, hideMessage } from "react-native-flash-message";
import { ThemeManager } from "../../../ThemeManager";
/**************************************  fiat deposit card ****************************************************/
export const fiatDepositCardAction = (
  currency,
  amount,
  transaction_type,
  first_name,
  last_name,
  address,
  city,
  postal_code,
  country_code,
  phone,
  transaction_token
) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: FIAT_BANK_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.DEPOSIT_BY_BANK_CARD,
            {
              currency: currency,
              amount: amount,
              transaction_type: transaction_type,
              first_name: first_name,
              last_name: last_name,
              address: address,
              city: city,
              postal_code: postal_code,
              country_code: country_code,
              phone: phone,
              transaction_token: transaction_token,
              success_url: "/gooney/payment-success",
              error_url: "/gooney/payment-error",
            },

            {
              headers: {
                contentType: "application/json",
                Authorization: res,
              },
            }
          )
            .then((response) => {
              fiatDepositSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              fiatDepositFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    });
  };
};
/**************************************  fiat deposit bank ****************************************************/
export const fiatDepositBankAction = (
  currency,
  amount,
  transaction_type,
  first_name,
  last_name,
  address,
  city,
  postal_code,
  country_code,
  phone,
  iban_id
) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: FIAT_BANK_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.DEPOSIT_BY_BANK_CARD,

            {
              currency: currency,
              amount: amount,
              transaction_type: transaction_type,
              first_name: first_name,
              last_name: last_name,
              address: address,
              city: city,
              postal_code: postal_code,
              country_code: country_code,
              phone: phone,
              beneficiary_id: iban_id,
            },
            {
              headers: {
                contentType: "application/json",
                Authorization: res,
              },
            }
          )
            .then((response) => {
              fiatDepositSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              Singleton.getInstance().showError(
                getMultiLingualData(error?.response?.data?.errors[0])
              );

              fiatDepositFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    });
  };
};
const fiatDepositFail = (disptach, errorMessage) => {
  disptach({
    type: FIAT_BANK_FAIL,
    payload: errorMessage,
  });
};
const fiatDepositSuccess = (disptach, details) => {
  disptach({
    type: FIAT_BANK_SUCCESS,
    payload: details,
  });
};
