import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_SELL_ORDER_CONFIRM_SUBMIT,
  BANXA_SELL_ORDER_CONFIRM_SUCCESS,
  BANXA_SELL_ORDER_CONFIRM_FAIL,
  BANXA_SELL_ORDER_CONFIRM_UPDATE,
  RESET_SELL_ORDER_CONFIRM_CRYPTO,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";
export const setBanxaconfirmSellUpdate = ({ prop, value }) => {
  return {
    type: BANXA_SELL_ORDER_CONFIRM_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaconfirmSell = () => {
  return {
    type: RESET_SELL_ORDER_CONFIRM_CRYPTO,
  };
};

export const banxaconfirmSell = (
  orderId,
  tx_hash,
  destinationAddress,
  sourceAddress
) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_SELL_ORDER_CONFIRM_SUBMIT });

      CoinCultApi.post(
        END_POINT.SELL_ORDER_CONFIRM,
        {
          order_id: orderId,
          tx_hash: tx_hash,
          source_address: sourceAddress,
          destination_address: destinationAddress,
        },
        {
          headers: {
            Authorization: Singleton.getInstance().accessToken,
            "Content-Type": "application/json",
          },
        }
      )

        .then((response) => {
          getConfirmSellSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getConfirmSellFail(dispatch, error?.response?.data.message);
          reject(error?.response?.data.message);
        });
    });
  };
};

const getConfirmSellFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_SELL_ORDER_CONFIRM_FAIL,
    payload: errorMessage,
  });
};

const getConfirmSellSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_SELL_ORDER_CONFIRM_SUCCESS,
    payload: details,
  });
};
