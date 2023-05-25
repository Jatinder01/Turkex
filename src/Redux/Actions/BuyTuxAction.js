import {
  USD_VALUE_UPDATE,
  USD_VALUE_SUBMIT,
  TUX_PURCHASE_FAIL,
  GET_TUX_PRICE,
  GET_TUX_PRICE_SUCCESS,
  GET_MY_BALANCE,
  GET_MY_BALANCE_SUCCESS,
  INTIAL_FULL_HISTORY,
  GET_FULL_HISTORY,
  FAILED_FULL_HISTORY,
  GET_24HOURS_HISTORY,
  FAILED_24HOURS_HISTORY,
  INTIAL_24HOURS_HISTORY,
} from "./types.js";
import { Actions } from "react-native-router-flux";

import { Platform, Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import END_POINT from "../../EndPoints.js";
import { CoinCultApi } from "../../api/CoinCultApi.js";

export const buyTuxUpdate = ({ prop, value }) => {
  return {
    type: USD_VALUE_UPDATE,
    payload: { prop, value },
  };
};
export const buyTux =
  ({ amount_usd, currency, balance_usd }) =>
  (disptach) => {
    return new Promise((resolve, reject) => {
      if (amount_usd === "0.0") {
        Singleton.getInstance().showError("Enter valid amount");
      } else if (parseFloat(amount_usd) > parseFloat(balance_usd)) {
        Singleton.getInstance().showError("You don't have enough balance");
      } else {
        disptach({ type: USD_VALUE_SUBMIT });
        Singleton.getInstance()
          .getDataSecure(constants.ACCESS_TOKEN)
          .then((value) => {
            CoinCultApi.post(
              END_POINT.BUY_TUX_FROM_USD,
              {
                currency: currency,
                amount: amount_usd,
              },
              {
                headers: {
                  Authorization: JSON.parse(value),
                },
              }
            )
              .then((response) => {
                resolve(response);
                tuxPurchaseFail(disptach, "");
                Alert.alert(
                  constants.APP_NAME,
                  response?.data?.total + "Tuxc Successfully purchased",
                  [{ text: "OK" }],
                  { cancelable: false }
                );
              })
              .catch((error) => {
                reject(error);
                tuxPurchaseFail(disptach, "");
              });
          });
      }
    });
  };
export const get24hHistory = ({ date, page, limit }) => {
  return (disptach) => {
    disptach({ type: INTIAL_24HOURS_HISTORY });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((value) => {
        CoinCultApi.get(
          END_POINT.BUY_TUX_FROM_USD +
            "?date_to=" +
            date +
            "&date_from=" +
            date +
            "&limit=50&page=1",
          {
            headers: {
              Authorization: JSON.parse(value),
            },
          }
        )
          .then((res) => {
            history24Success(disptach, res?.data);
          })
          .catch((error) => {
            disptach({ type: FAILED_24HOURS_HISTORY });
          });
      });
  };
};
export const getCurrentTuxValue = () => {
  return (disptach) => {
    disptach({ type: GET_TUX_PRICE });
    CoinCultApi.get(END_POINT.GET_CURRENT_TUX_PRICE)
      .then((response) => {
        getTuxSuccess(disptach, response?.data.price);
      })
      .catch((error) => {
        console.log("getCurrentTuxValue", error);
      });
  };
};
export const getMyUsdBalance = () => {
  return (disptach) => {
    disptach({ type: GET_MY_BALANCE });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((value) => {
        CoinCultApi.get(END_POINT.GET_MY_USDT_BALANCE, {
          headers: {
            Authorization: JSON.parse(value),
          },
        })
          .then((response) => {
            getBalanceSuccess(disptach, response?.data.balance);
          })
          .catch((err) => {
            getBalanceSuccess(disptach, "0.0");
          });
      });
  };
};
export const getTuxHistory = () => {
  return (disptach) => {
    disptach({ type: INTIAL_FULL_HISTORY });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((value) => {
        CoinCultApi.get(END_POINT.BUY_TUX_FROM_USD, {
          headers: {
            Authorization: JSON.parse(value),
          },
        })
          .then((response) => {
            historySuccess(disptach, response);
          })
          .catch((error) => {
            disptach({ type: FAILED_FULL_HISTORY });
            Singleton.getInstance().showError(error + " in history.");
          });
      });
  };
};

const getTuxSuccess = (disptach, response) => {
  disptach({
    type: GET_TUX_PRICE_SUCCESS,
    payload: response,
  });
};
const getBalanceSuccess = (disptach, response) => {
  disptach({
    type: GET_MY_BALANCE_SUCCESS,
    payload: response,
  });
};

const tuxPurchaseFail = (disptach, response) => {
  disptach({
    type: TUX_PURCHASE_FAIL,
    payload: response,
  });
};
const historySuccess = (disptach, response) => {
  disptach({
    type: GET_FULL_HISTORY,
    payload: response,
  });
};
const history24Success = (disptach, response) => {
  disptach({
    type: GET_24HOURS_HISTORY,
    payload: response,
  });
};
