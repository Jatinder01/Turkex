import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_BUY_CRYPTO_SUBMIT,
  BANXA_BUY_CRYPTO_SUCCESS,
  BANXA_BUY_CRYPTO_FAIL,
  BANXA_BUY_CRYPTO_UPDATE,
  RESET_BANXA_BUY_CRYPTO,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";
export const setBanxaBuyCryptoUpdate = ({ prop, value }) => {
  return {
    type: BANXA_BUY_CRYPTO_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaBuyCrypto = () => {
  return {
    type: RESET_BANXA_BUY_CRYPTO,
  };
};

export const banxaBuyCrypto = (
  fromCurrency,
  toCurrency,
  address,
  trans_type,
  blockchain_key,
  amount,
  paymentMethodId
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_BUY_CRYPTO_SUBMIT });

      CoinCultApi.post(
        END_POINT.BUY_SELL_ORDER_BANXA,
        {
          source: fromCurrency,
          target: toCurrency,
          address: address,
          success_url: "success",
          cancel_url: "cancel",
          failure_url: "fail",
          trans_type: trans_type,
          blockchain: blockchain_key,
          amount: parseFloat(amount),
          payment_method_id: paymentMethodId,
        },
        {
          headers: {
            Authorization: Singleton.getInstance().accessToken,
            "Content-Type": "application/json",
          },
        }
      )

        .then((response) => {
          getBuySellSuccess(dispatch, response?.data);
          resolve(response?.data);
          // Actions.Conversion({
          //   data: response?.data,
          //   rate: ratePrice,
          // });
        })
        .catch((error) => {
          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
            // Actions.currentScene != 'Login' && Actions.replace('Login');

            // Singleton.getInstance().saveEmptyDefault();
            // Alert.alert(constants.APP_NAME, 'Session expired');
          }
          getBuySellFail(dispatch, error?.response?.data?.message);
          reject(error?.response?.data?.message);
        });
    });
  };
};

const getBuySellFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_BUY_CRYPTO_FAIL,
    payload: errorMessage,
  });
};
// const getDetailsSuccess = (dispatch, details) => {
//   dispatch({
//     type: GET_ACTIVE_COIN_SUCCESS,
//     payload: details,
//   });
// };

const getBuySellSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_BUY_CRYPTO_SUCCESS,
    payload: details,
  });
};
