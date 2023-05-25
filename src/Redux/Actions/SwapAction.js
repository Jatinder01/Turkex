import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_SWAP_SUBMIT,
  GET_SWAP_SUCCESS,
  GET_SWAP_FAIL,
  //   GET_SWAP_DATA_SUCCESS,
  GET_SWAP_UPDATE,
  RESET_SWAP,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { getMultiLingualData } from "../../../Utils";
export const setSwapUpdate = ({ prop, value }) => {
  return {
    type: GET_SWAP_UPDATE,
    payload: { prop, value },
  };
};

export const resetSwap = () => {
  return {
    type: RESET_SWAP,
  };
};
/************************************** post swap adjustments ****************************************************/
export const postSwap = (
  amount,
  bid_amount,
  currency,
  bid_currency,
  fees,
  ratePrice
) => {
  return (dispatch) => {
    dispatch({ type: GET_SWAP_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(
          END_POINT.POST_SWAP_URL,
          {
            amount: amount,
            bid_amount: bid_amount,
            currency: currency,
            bid_currency: bid_currency,
            fees: 0,
          },
          {
            headers: {
              Authorization: res,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            // console.log("response=-=-==convert swap=-", response);
            getSwapSuccess(dispatch, response?.data);
            Actions.currentScene != "Conversion" &&
              Actions.Conversion({
                data: response?.data,
                rate: ratePrice,
              });
          })
          .catch((error) => {
            console.log("response=-=-==convert error=-", JSON.stringify(error));
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getSwapFail(dispatch, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getSwapFail(dispatch, "Server down, please try after sometime");
            } else {
              getSwapFail(
                dispatch,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            }
          });
      });
  };
};

const getSwapFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_SWAP_FAIL,
    payload: errorMessage,
  });
};

const getSwapSuccess = (dispatch, details) => {
  dispatch({
    type: GET_SWAP_SUCCESS,
    payload: details,
  });
};
