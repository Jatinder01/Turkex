import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  BANXA_SUPPORTED_NETWORKS_SUBMIT,
  BANXA_SUPPORTED_NETWORKS_SUCCESS,
  BANXA_SUPPORTED_NETWORKS_FAIL,
  BANXA_SUPPORTED_NETWORKS_UPDATE,
  RESET_SUPPORTED_NETWORKS_CRYPTO,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import Axios from "axios";
export const setBanxaSupportedNetworkUpdate = ({ prop, value }) => {
  return {
    type: BANXA_SUPPORTED_NETWORKS_UPDATE,
    payload: { prop, value },
  };
};

export const resetBanxaSupportedNetwork = () => {
  return {
    type: RESET_SUPPORTED_NETWORKS_CRYPTO,
  };
};

export const banxaSupportedNetwork = (orderType, currency) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BANXA_SUPPORTED_NETWORKS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.get(
            END_POINT.SUPPORTED_BLOCKCHAIN_NETWORK + orderType + "/" + currency,
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )

            .then((response) => {
              getSupportedNetworkSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }
              getSupportedNetworkFail(dispatch, error?.response?.data.message);
              reject(error?.response?.data.message);
            });
        });
    });
  };
};

const getSupportedNetworkFail = (dispatch, errorMessage) => {
  dispatch({
    type: BANXA_SUPPORTED_NETWORKS_FAIL,
    payload: errorMessage,
  });
};

const getSupportedNetworkSuccess = (dispatch, details) => {
  dispatch({
    type: BANXA_SUPPORTED_NETWORKS_SUCCESS,
    payload: details,
  });
};
