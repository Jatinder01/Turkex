import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_PRICE_CONVERSION_SUBMIT,
  BANXA_PRICE_CONVERSION_SUCCESS,
  BANXA_PRICE_CONVERSION_FAIL,
  BANXA_PRICE_CONVERSION_UPDATE,
  RESET_BANXA_PRICE_CONVERSION,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";

export const setBanxaPriceConversionUpdate = ({ prop, value }) => {
  return {
    type: BANXA_PRICE_CONVERSION_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaPriceConversion = () => {
  return {
    type: RESET_BANXA_PRICE_CONVERSION,
  };
};

export const banxaPriceConversion = (
  sourceCurrency,
  targetCurrency,
  sourceAmount
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_PRICE_CONVERSION_SUBMIT });

      CoinCultApi.get(
        END_POINT.GET_BANXA_PRICE_CONVERSION +
          sourceCurrency +
          "&target=" +
          targetCurrency +
          "&source_amount=" +
          sourceAmount,
        {
          headers: {
            Authorization: Singleton.getInstance().accessToken,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          getBanxaPriceConversionSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getBanxaPriceConversionFail(dispatch, error?.response?.data?.message);
          reject(error?.response?.data?.message);
        });
    });
  };
};

const getBanxaPriceConversionFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_PRICE_CONVERSION_FAIL,
    payload: errorMessage,
  });
};

const getBanxaPriceConversionSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_PRICE_CONVERSION_SUCCESS,
    payload: details,
  });
};
