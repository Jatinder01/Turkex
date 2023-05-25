import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_ALL_ORDERS_SUBMIT,
  BANXA_ALL_ORDERS_SUCCESS,
  BANXA_ALL_ORDERS_FAIL,
  BANXA_ALL_ORDERS_UPDATE,
  RESET_ALL_ORDERS_CRYPTO,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";
export const setBanxaAllOrderUpdate = ({ prop, value }) => {
  return {
    type: BANXA_ALL_ORDERS_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaAllOrder = () => {
  return {
    type: RESET_ALL_ORDERS_CRYPTO,
  };
};

export const banxaAllOrder = ({
  startDate,
  endDate,
  status,
  perPage,
  page,
}) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_ALL_ORDERS_SUBMIT });

      let UrlBanxaOrderList =
        status == undefined || status == ""
          ? END_POINT.BANXA_ALL_ORDERS +
            startDate +
            "&end_date=" +
            endDate +
            "&per_page=" +
            perPage +
            "&page=" +
            page
          : END_POINT.BANXA_ALL_ORDERS +
            startDate +
            "&end_date=" +
            endDate +
            "&per_page=" +
            perPage +
            "&page=" +
            page +
            "&status=" +
            status;

      CoinCultApi.get(UrlBanxaOrderList, {
        headers: {
          Authorization: Singleton.getInstance().accessToken,
          "Content-Type": "application/json",
        },
      })

        .then((response) => {
          getAllOrderSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          getAllOrderFail(dispatch, error?.response?.data?.message);
          reject(error?.response?.data?.message);
        });
    });
  };
};

const getAllOrderFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_ALL_ORDERS_FAIL,
    payload: errorMessage,
  });
};

const getAllOrderSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_ALL_ORDERS_SUCCESS,
    payload: details,
  });
};
