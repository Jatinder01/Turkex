import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_ACTIVE_COIN_SWAP_SUBMIT,
  GET_ACTIVE_COIN_SWAP_SUCCESS,
  GET_ACTIVE_COIN_SWAP_RESET_SUCCESS,
  GET_ACTIVE_COIN_SWAP_FAIL,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api/CoinCultApi";
import { getMultiLingualData } from "../../../Utils";

export const resetCoinSwap = ({ prop, value }) => {
  return {
    type: GET_ACTIVE_COIN_SWAP_RESET_SUCCESS,
    payload: { prop, value },
  };
};
/**************************************  get public active swap coin list  ****************************************************/
export const getActiveSwapCoinList = () => {
  // console.log("getActiveSwapCoinList=-=-");
  return (dispatch) => {
    dispatch({ type: GET_ACTIVE_COIN_SWAP_SUBMIT });

    CoinCultApi.get(END_POINT.GET_ACTIVE_COIN_LIST + "?swap_enabled=true", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        getDetailsSwapSuccess(dispatch, response?.data);
      })
      .catch((error) => {
        console.log("getActiveSwapCoinList=-=-error", error);

        if (error?.response?.status == "401") {
          Singleton.getInstance().isLoginSuccess = true;
          Singleton.getInstance().refreshToken(1);
          getDetailsSwapFail(dispatch, "");
        } else if (
          error?.response?.status == "403" ||
          error?.response?.status == "500" ||
          error?.response?.status == "503" ||
          error?.response?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
          getDetailsSwapFail(dispatch, "");
        } else {
          getDetailsSwapFail(dispatch, error?.response?.data.message);
        }
      });
    // });
  };
};

const getDetailsSwapFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_ACTIVE_COIN_SWAP_FAIL,
    payload: errorMessage,
  });
};
const getDetailsSwapSuccess = (dispatch, details) => {
  dispatch({
    type: GET_ACTIVE_COIN_SWAP_SUCCESS,
    payload: details,
  });
};
