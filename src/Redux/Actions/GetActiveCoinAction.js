import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_ACTIVE_COIN_SUBMIT,
  GET_ACTIVE_COIN_SUCCESS,
  GET_ACTIVE_COIN_FAIL,
  GET_ACTIVE_COIN_PAIR_SUCCESS,
  GET_COIN_LIST_UPDATE,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_SUBMIT,
  GET_ADDRESS_FAIL,
  GET_ADDRESS_RESET,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { getMultiLingualData } from "../../../Utils";
export const setSelectedCoin = ({ prop, value }) => {
  return {
    type: GET_COIN_LIST_UPDATE,
    payload: { prop, value },
  };
};

export const resetCoin = ({ prop, value }) => {
  return {
    type: GET_COIN_LIST_UPDATE,
    payload: { prop, value },
  };
};
export const resetCoinAddress = () => {
  return {
    type: GET_ADDRESS_RESET,
  };
};
/**************************************  get public active coin list  ****************************************************/
export const getActiveCoinList = () => {
  return (dispatch) => {
    dispatch({ type: GET_ACTIVE_COIN_SUBMIT });

    CoinCultApi.get(END_POINT.GET_ACTIVE_COIN_LIST, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("getActiveCoinList=-=-=succ", JSON.stringify(response));
        getDetailsSuccess(dispatch, response?.data);
      })
      .catch((error) => {
        console.log("getActiveCoinList=-=-=error", JSON.stringify(error));
        if (error?.response?.status == "401") {
          Singleton.getInstance().isLoginSuccess = true;
          Singleton.getInstance().refreshToken(1);
        }
        getDetailsFail(dispatch, error?.response?.data.message);
      });
    // });
  };
};
/**************************************  get  coin address  ****************************************************/
export const getCoinAddress = (coinName, blockchain_key) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch({ type: GET_ADDRESS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.get(
            END_POINT.GET_COIN_ADDRESS +
              coinName +
              "?blockchain_key=" +
              blockchain_key,
            {
              headers: {
                Authorization: JSON.parse(res),
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              getCoinAddressSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getCoinAddressFail(dispatch, "");
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
                getCoinAddressFail(dispatch, "");
                reject("");
              } else {
                getCoinAddressFail(
                  dispatch,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
                reject(error?.response?.data?.message);
              }
            });
        });
    });
  };
};
/**************************************  get active coin pair  ****************************************************/
export const getActiveCoinPairs = ({ currId }) => {
  return (dispatch) => {
    dispatch({ type: GET_ACTIVE_COIN_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.GET_ACTIVE_COIN_PAIRS_LIST + currId, {
          headers: {
            Authorization: JSON.parse(res),
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            getPairsSuccess(dispatch, response?.data);
          })
          .catch((error) => {
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
              getDetailsFail(dispatch, "");
            } else {
              getDetailsFail(dispatch, error?.response?.data.message);
            }
          });
      });
  };
};

const getDetailsFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_ACTIVE_COIN_FAIL,
    payload: errorMessage,
  });
};
const getDetailsSuccess = (dispatch, details) => {
  dispatch({
    type: GET_ACTIVE_COIN_SUCCESS,
    payload: details,
  });
};
const getCoinAddressFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_ADDRESS_FAIL,
    payload: errorMessage,
  });
};
const getCoinAddressSuccess = (dispatch, details) => {
  dispatch({
    type: GET_ADDRESS_SUCCESS,
    payload: details,
  });
};
const getPairsSuccess = (dispatch, details) => {
  dispatch({
    type: GET_ACTIVE_COIN_PAIR_SUCCESS,
    payload: details,
  });
};
