import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  WITHDRAW_FIAT_COIN_SUBMIT,
  WITHDRAW_FIAT_COIN_SUCCESS,
  WITHDRAW_FIAT_COIN_FAIL,
  WITHDRAW_FIAT_COIN_UPDATE,
  RESET_WITHDRAW_FIAT_COIN,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { getMultiLingualData } from "../../../Utils";
export const withdrawFiatUpdate = ({ prop, value }) => {
  return {
    type: WITHDRAW_FIAT_COIN_UPDATE,
    payload: { prop, value },
  };
};

export const resetWithdrawFiatCoin = () => {
  return {
    type: RESET_WITHDRAW_FIAT_COIN,
  };
};
/************************************** get withdraw fiat bank ****************************************************/
export const withdrawFiatBankAction = (
  address,
  withdrawAmount,
  city,
  countryCode,
  selectedWithdrawCurrency,
  firstName,
  lastName,
  twoFA,
  phoneNumber,
  postalCode,
  cardType,
  bankId
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: WITHDRAW_FIAT_COIN_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.WITHDRAW_FIAT_CURRENCY,
            {
              amount: withdrawAmount,
              otp: twoFA,
              currency: selectedWithdrawCurrency,
              transaction_type: cardType,
              first_name: firstName,
              last_name: lastName,
              address: address,
              city: city,
              postal_code: postalCode,
              country_code: countryCode,
              phone: phoneNumber,
              beneficiary_id: bankId,
              selectedBankId: bankId,
            },
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              withdrawFiatCoinSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                withdrawFiatCoinFail(dispatch, "");
                reject("");
              }
              if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                withdrawFiatCoinFail(dispatch, "");
                reject("");
              }
              if (error?.response?.data?.errors[0] === undefined) {
                withdrawFiatCoinFail(dispatch, error?.response?.data?.errors);
                reject(error?.response?.data?.errors);
              } else {
                withdrawFiatCoinFail(
                  dispatch,
                  error?.response?.data?.errors[0]
                );
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
              }
            });
        });
    });
  };
};
export const withdrawFiatCardAction = (
  address,
  withdrawAmount,
  city,
  countryCode,
  selectedWithdrawCurrency,
  firstName,
  lastName,
  twoFA,
  phoneNumber,
  postalCode,
  transaction_token,
  cardType
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: WITHDRAW_FIAT_COIN_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.WITHDRAW_FIAT_CURRENCY,
            {
              amount: withdrawAmount,
              otp: twoFA,
              currency: selectedWithdrawCurrency,
              transaction_type: cardType,
              first_name: firstName,
              last_name: lastName,
              address: address,
              city: city,
              postal_code: postalCode,
              country_code: countryCode,
              phone: phoneNumber,
              transaction_token: transaction_token,
              success_url: "/gooney/payment-success",
              error_url: "/gooney/payment-error",
            },
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              withdrawFiatCoinSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }
              withdrawFiatCoinFail(dispatch, error?.response?.data?.errors[0]);
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            });
        });
    });
  };
};
const withdrawFiatCoinFail = (dispatch, errorMessage) => {
  dispatch({
    type: WITHDRAW_FIAT_COIN_FAIL,
    payload: errorMessage,
  });
};

const withdrawFiatCoinSuccess = (dispatch, details) => {
  dispatch({
    type: WITHDRAW_FIAT_COIN_SUCCESS,
    payload: details,
  });
};
