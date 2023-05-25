import {Actions} from 'react-native-router-flux';
import END_POINT from '../../EndPoints';
import {
  BANXA_SINGLE_ORDERS_SUBMIT,
  BANXA_SINGLE_ORDERS_SUCCESS,
  BANXA_SINGLE_ORDERS_FAIL,
  BANXA_SINGLE_ORDERS_UPDATE,
  RESET_SINGLE_ORDERS_CRYPTO,
} from './types';
import {Alert} from 'react-native';
import * as constants from '../../Constants';
import Singleton from '../../Singleton';
import {CoinCultApi} from '../../api/CoinCultApi';
import Axios from 'axios';
export const setBanxaSingleOrderUpdate = ({prop, value}) => {
  return {
    type: BANXA_SINGLE_ORDERS_UPDATE,
    payload: {prop, value},
  };
};

export const resetBanxaSingleOrder = () => {
  return {
    type: RESET_SINGLE_ORDERS_CRYPTO,
  };
};

export const banxaSingleOrder = orderId => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({type: BANXA_SINGLE_ORDERS_SUBMIT});

      CoinCultApi.get(END_POINT.SINGLE_BANXA_ORDER_DETAILS + orderId, {
        headers: {
          Authorization: Singleton.getInstance().accessToken,
          'Content-Type': 'application/json',
        },
      })

        .then(response => {
          getSingleOrderSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch(error => {
          if (error?.response?.status == '401') {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getSingleOrderFail(dispatch, error?.response?.data.message);
          reject(error?.response?.data.message);
        });
    });
  };
};

const getSingleOrderFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_SINGLE_ORDERS_FAIL,
    payload: errorMessage,
  });
};

const getSingleOrderSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_SINGLE_ORDERS_SUCCESS,
    payload: details,
  });
};
