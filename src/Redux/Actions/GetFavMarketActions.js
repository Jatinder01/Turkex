import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  GET_FAV_MARKET_SUBMIT,
  GET_FAV_MARKET_SUCCESS,
  GET_FAV_MARKET_FAIL,
  GET_FAV_MARKET_UPDATE,
  RESET_GET_FAV_MARKET,
  UPDATE_FAV_MARKET_SUBMIT,
  UPDATE_FAV_MARKET_SUCCESS,
  UPDATE_FAV_MARKET_FAIL,
  UPDATE_FAV_MARKET_UPDATE,
  RESET_UPDATE_FAV_MARKET,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { colors } from "../../theme";
import { showMessage, hideMessage } from "react-native-flash-message";
import { CoinCultApi } from "../../api/CoinCultApi";
import { ThemeManager } from "../../../ThemeManager";

export const resetFavMarket = ({ prop, value }) => {
  return {
    type: RESET_GET_FAV_MARKET,
    payload: { prop, value },
  };
};
export const resetUpdateFavMarket = ({ prop, value }) => {
  return {
    type: RESET_UPDATE_FAV_MARKET,
    payload: { prop, value },
  };
};
/************************************** update fav market list  ****************************************************/
export const updateFavMarketData = (fav_market_id) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: UPDATE_FAV_MARKET_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.patch(
            END_POINT.UPDATE_FAV_MARKETS_URL,
            {
              fav_market_id: fav_market_id,
            },
            {
              headers: {
                Authorization: JSON.parse(res),
              },
            }
          )
            .then((response) => {
              updateFavMarketDataSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              console.log(
                "updateFavMarketDataSuccess=-=-error=",
                JSON.stringify(error)
              );

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                updateFavMarketDataFail(disptach, "");
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
                updateFavMarketDataFail(disptach, "");
                reject("");
              } else {
                updateFavMarketDataFail(
                  disptach,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
                reject(error);
              }
            });
        });
    });
  };
};
export const getFavMarketData = () => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GET_FAV_MARKET_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.get(END_POINT.GET_FAV_MARKETS_URL, {
            headers: {
              Authorization: JSON.parse(res),
            },
          })
            .then((response) => {
              getFavMarketDataSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              console.log("getFavMarketData=-=-error=", error);

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                getFavMarketDataFail(disptach, "");
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
                getFavMarketDataFail(disptach, "");
                reject("");
              } else {
                getFavMarketDataFail(
                  disptach,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
                reject(error);
              }
            });
        });
    });
  };
};

const getFavMarketDataFail = (disptach, errorMessage) => {
  disptach({
    type: GET_FAV_MARKET_FAIL,
    payload: errorMessage,
  });
};
const getFavMarketDataSuccess = (disptach, details) => {
  disptach({
    type: GET_FAV_MARKET_SUCCESS,
    payload: details,
  });
};
const updateFavMarketDataFail = (disptach, errorMessage) => {
  disptach({
    type: UPDATE_FAV_MARKET_FAIL,
    payload: errorMessage,
  });
};
const updateFavMarketDataSuccess = (disptach, details) => {
  disptach({
    type: UPDATE_FAV_MARKET_SUCCESS,
    payload: details,
  });
};
