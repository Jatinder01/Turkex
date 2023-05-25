import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_SWAP_COIN_SUBMIT,
  GET_SWAP_COIN_SUCCESS,
  GET_SWAP_COIN_FAIL,
  GET_SWAP_COIN_PAIR_SUCCESS,
  GET_SWAP_LIST_UPDATE,
  RESET_SWAP_COIN,
  GET_SWAP_COIN_ONE_SUCCESS,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";

export const setSwapSelectedCoin = ({ prop, value }) => {
  return {
    type: GET_SWAP_LIST_UPDATE,
    payload: { prop, value },
  };
};

export const resetSwapDataCoin = ({ prop, value }) => {
  return {
    type: GET_SWAP_LIST_UPDATE,
    payload: { prop, value },
  };
};
export const resetSwapCoin = () => {
  return {
    type: RESET_SWAP_COIN,
  };
};
/************************************** swap coin pair ****************************************************/
export const getSwapCoinPairsForOne = (from, to, amount) => {
  return (dispatch) => {
    dispatch({ type: GET_SWAP_COIN_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.SWAP_COIN_LIST +
            "?from=" +
            from +
            "&to=" +
            to +
            "&amount=" +
            1,
          {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            // console.log("response=--getswap=-=", response?.data);
            getCoinRateOneSuccess(dispatch, response?.data);
          })
          .catch((error) => {
            console.log("response=--getswap=-=error", JSON.stringify(error));
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getDetailsFail(dispatch, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getDetailsFail(
                dispatch,
                "Server down, please try after sometime"
              );
            } else {
              getDetailsFail(dispatch, error?.response?.data.message);
            }
          });
      });
  };
};
/************************************** swap coin pair ****************************************************/
export const getSwapCoinPairs = (from, to, amount) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: GET_SWAP_COIN_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.get(
            END_POINT.SWAP_COIN_LIST +
              "?from=" +
              from +
              "&to=" +
              to +
              "&amount=" +
              amount,
            {
              headers: {
                Authorization: JSON.parse(res),
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              getPairsSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getDetailsFail(dispatch, "");
                reject("");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getDetailsFail(
                  dispatch,
                  "Server down, please try after sometime"
                );
                reject("");
              } else {
                getDetailsFail(dispatch, error?.response?.data?.message);
                reject(error?.response?.data?.message);
              }
            });
        });
    });
  };
};

const getDetailsFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_SWAP_COIN_FAIL,
    payload: errorMessage,
  });
};

const getPairsSuccess = (dispatch, details) => {
  dispatch({
    type: GET_SWAP_COIN_PAIR_SUCCESS,
    payload: details,
  });
};

const getCoinRateOneSuccess = (dispatch, details) => {
  dispatch({
    type: GET_SWAP_COIN_ONE_SUCCESS,
    payload: details,
  });
};
