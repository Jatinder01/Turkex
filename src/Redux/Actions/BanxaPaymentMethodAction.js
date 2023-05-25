import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_PAYMENT_METHOD_SUBMIT,
  BANXA_PAYMENT_METHOD_SUCCESS,
  BANXA_PAYMENT_METHOD_FAIL,
  BANXA_PAYMENT_METHOD_UPDATE,
  RESET_BANXA_PAYMENT_METHOD,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";

export const setBanxaPaymentMethodUpdate = ({ prop, value }) => {
  return {
    type: BANXA_PAYMENT_METHOD_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaPaymentMethod = () => {
  return {
    type: RESET_BANXA_PAYMENT_METHOD,
  };
};

export const banxaPaymentMethod = (sourceCurrency, targetCurrency) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_PAYMENT_METHOD_SUBMIT });

      CoinCultApi.get(
        END_POINT.GET_BANXA_PAYMENT_METHODS +
          sourceCurrency +
          "&target=" +
          targetCurrency,
        {
          headers: {
            Authorization: Singleton.getInstance().accessToken,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          getBanxaPaymentMethodSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getBanxaPaymentMethodFail(dispatch, error?.response?.data?.message);
          reject(error?.response?.data?.message);
        });
    });
  };
};

const getBanxaPaymentMethodFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_PAYMENT_METHOD_FAIL,
    payload: errorMessage,
  });
};

const getBanxaPaymentMethodSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_PAYMENT_METHOD_SUCCESS,
    payload: details,
  });
};
