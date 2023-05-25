import {Actions} from 'react-native-router-flux';
import END_POINT from '../../EndPoints';
import {
  BANXA_SUPPORTED_CURRENCY_SELL_SUBMIT,
  BANXA_SUPPORTED_CURRENCY_SELL_SUCCESS,
  BANXA_SUPPORTED_CURRENCY_SELL_FAIL,
  BANXA_SUPPORTED_CURRENCY_SELL_UPDATE,
  RESET_BANXA_SUPPORTED_SELL_CURRENCY,
} from './types';
import {Alert} from 'react-native';
import * as constants from '../../Constants';
import Singleton from '../../Singleton';
import {CoinCultApi} from '../../api/CoinCultApi';
import Axios from 'axios';
export const setBanxaSupportedCurrencySellUpdate = ({prop, value}) => {
  return {
    type: BANXA_SUPPORTED_CURRENCY_SELL_UPDATE,
    payload: {prop, value},
  };
};

export const resetBanxaSupportedCurrencySell = () => {
  return {
    type: RESET_BANXA_SUPPORTED_SELL_CURRENCY,
  };
};

export const banxaSupportedCurrencySell = type => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({type: BANXA_SUPPORTED_CURRENCY_SELL_SUBMIT});

      CoinCultApi.get(END_POINT.GET_BANXA_SUPPORTED_COUNTRIES + type, {
        headers: {
          Authorization: Singleton.getInstance().accessToken,
          'Content-Type': 'application/json',
        },
      })

        .then(response => {
          getBanxaSupportedCurrencySellSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch(error => {
          if (error?.response?.status == '401') {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getBanxaSupportedCurrencySellFail(
            dispatch,
            error?.response?.data?.message,
          );
          reject(error?.response?.data?.message);
        });
    });
  };
};

const getBanxaSupportedCurrencySellFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_SUPPORTED_CURRENCY_SELL_FAIL,
    payload: errorMessage,
  });
};

const getBanxaSupportedCurrencySellSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_SUPPORTED_CURRENCY_SELL_SUCCESS,
    payload: details,
  });
};
