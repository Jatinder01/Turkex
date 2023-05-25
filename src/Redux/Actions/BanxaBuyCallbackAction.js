import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_BUY_CRYPTO_CALLBACK_SUBMIT,
  BANXA_BUY_CRYPTO_CALLBACK_SUCCESS,
  BANXA_BUY_CRYPTO_CALLBACK_FAIL,
  BANXA_BUY_CRYPTO_CALLBACK_UPDATE,
  RESET_BANXA_BUY_CRYPTO_CALLBACK,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
export const setBanxaBuyCryptoCallbackUpdate = ({ prop, value }) => {
  return {
    type: BANXA_BUY_CRYPTO_CALLBACK_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaBuyCryptoCallback = () => {
  return {
    type: RESET_BANXA_BUY_CRYPTO_CALLBACK,
  };
};

export const banxaBuyCryptoCallback = (buyOrderId, status) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_BUY_CRYPTO_CALLBACK_SUBMIT });

      CoinCultApi.post(
        END_POINT.POST_BANXA_CALLBACK,
        {
          order_id: buyOrderId,
          status: status,
        },
        {
          headers: {
            Authorization: Singleton.getInstance().accessToken,
            "Content-Type": "application/json",
          },
        }
      )

        .then((response) => {
          getBuySellCallbackSuccess(dispatch, response?.data);
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
          getBuySellCallbackFail(dispatch, error?.response?.data?.message);
          reject(error?.response?.data?.message);
        });
    });
  };
};

const getBuySellCallbackFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_BUY_CRYPTO_CALLBACK_FAIL,
    payload: errorMessage,
  });
};
// const getDetailsSuccess = (dispatch, details) => {
//   dispatch({
//     type: GET_ACTIVE_COIN_SUCCESS,
//     payload: details,
//   });
// };

const getBuySellCallbackSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_BUY_CRYPTO_CALLBACK_SUCCESS,
    payload: details,
  });
};
