import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_PRICE_CONVERSION_SELL_SUBMIT,
  BANXA_PRICE_CONVERSION_SELL_SUCCESS,
  BANXA_PRICE_CONVERSION_SELL_FAIL,
  BANXA_PRICE_CONVERSION_SELL_UPDATE,
  RESET_BANXA_PRICE_SELL_CONVERSION,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";

export const setBanxaPriceConversionSellUpdate = ({ prop, value }) => {
  return {
    type: BANXA_PRICE_CONVERSION_SELL_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaPriceSellConversion = () => {
  return {
    type: RESET_BANXA_PRICE_SELL_CONVERSION,
  };
};

export const banxaPriceConversionSell = (
  sourceCurrency,
  targetCurrency,
  sourceAmount
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_PRICE_CONVERSION_SELL_SUBMIT });

      CoinCultApi.get(
        END_POINT.GET_BANXA_PRICE_CONVERSION +
          sourceCurrency +
          "&target=" +
          targetCurrency +
          "&target_amount=" +
          sourceAmount,
        {
          headers: {
            Authorization: Singleton.getInstance().accessToken,
            "Content-Type": "application/json",
          },
        }
      )
        // Axios.get(
        //   END_POINT.LOCAL_URL +
        //     END_POINT.GET_BANXA_PRICE_CONVERSION +
        //     sourceCurrency +
        //     '&target=' +
        //     targetCurrency +
        //     '&target_amount=' +
        //     sourceAmount,
        // )
        .then((response) => {
          getBanxaPriceConversionSellSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getBanxaPriceConversionSellFail(
            dispatch,
            error?.response?.data?.message
          );
          reject(error?.response?.data?.message);
        });
    });
  };
};
const getBanxaPriceConversionSellFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_PRICE_CONVERSION_SELL_FAIL,
    payload: errorMessage,
  });
};

const getBanxaPriceConversionSellSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_PRICE_CONVERSION_SELL_SUCCESS,
    payload: details,
  });
};
