import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_SUPPORTED_CURRENCY_SUBMIT,
  BANXA_SUPPORTED_CURRENCY_SUCCESS,
  BANXA_SUPPORTED_CURRENCY_FAIL,
  BANXA_SUPPORTED_CURRENCY_UPDATE,
  RESET_BANXA_SUPPORTED_CURRENCY,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";

export const setBanxaSupportedCurrencyUpdate = ({ prop, value }) => {
  return {
    type: BANXA_SUPPORTED_CURRENCY_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaSupportedCurrency = () => {
  return {
    type: RESET_BANXA_SUPPORTED_CURRENCY,
  };
};

export const banxaSupportedCurrency = (type) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_SUPPORTED_CURRENCY_SUBMIT });
      //Call API

      CoinCultApi.get(END_POINT.GET_BANXA_SUPPORTED_COUNTRIES + type, {
        headers: {
          Authorization: Singleton.getInstance().accessToken,
          "Content-Type": "application/json",
        },
      })

        .then((response) => {
          getBanxaSupportedCurrencySuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getBanxaSupportedCurrencyFail(
            dispatch,
            error?.response?.data?.message
          );
          reject(error?.response?.data?.message);
        });
    });
  };
};

const getBanxaSupportedCurrencyFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_SUPPORTED_CURRENCY_FAIL,
    payload: errorMessage,
  });
};

const getBanxaSupportedCurrencySuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_SUPPORTED_CURRENCY_SUCCESS,
    payload: details,
  });
};
