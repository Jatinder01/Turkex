import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";
import {
  GET_ORDER_HISTORY_FAIL,
  GET_ORDER_HISTORY_SUCCESS,
  GET_ORDER_SUBMIT,
  ORDER_CANCEL,
  ORDER_CANCEL_UPADTE,
  RESET_ORDER_HISTORY,
  GET_MARKET_LIST_SUCCESS,
  GET_MARKET_LIST_SUBMIT,
  GET_WITHDRAW_DEPOSIT_SUCCESS,
  GET_WITHDRAW_DEPOSIT_FAIL,
  ORDER_HISTORY_PROP_UPDATE,
  ORDER_CANCEL_ALL,
  GET_OPEN_ORDER_SUCCESS,
  RESET_OPEN_ORDER_HISTORY,
  SUBMIT_OPEN_ORDER_HISTORY,
  SUCCESS_OPEN_ORDER_HISTORY,
  FAIL_OPEN_ORDER_HISTORY,
  //trade history
  GET_TRADE_HISTORY_SUCCESS,
  FAIL_TRADE_HISTORY_SUCCESS,
  SUBMIT_TRADE_HISTORY_SUCCESS,
  RESET_TRADE_HISTORY_SUCCESS,
  //cancelll all orders
  ORDER_CANCEL_ALL_SUCCESS,
  ORDER_CANCEL_ALL_SUBMIT,
  ORDER_CANCEL_ALL_RESET,
  ORDER_CANCEL_ALL_FAIL,
  SUBMIT_OPEN_ORDER_SINGLE_HISTORY,
  GET_OPEN_ORDER_SINGLE_SUCCESS,
  FAIL_OPEN_ORDER_SINGLE_HISTORY,
  RESET_OPEN_ORDER_SINGLE_HISTORY,
  ORDER_HISTORY_PROP_SINGLE_UPDATE,
} from "./types";
import * as constants from "../../Constants";

import { getMultiLingualData } from "../../../Utils";
import { Alert, Platform } from "react-native";
// import END_POINT from '../../EndPoints';
import Singleton from "../../Singleton";
import END_POINT from "../../EndPoints";
import { showMessage, hideMessage } from "react-native-flash-message";
import { ThemeManager } from "../../../ThemeManager";
import { APIClient } from "../../api";
/************************************** get market list ****************************************************/
export const getMarketList = () => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GET_MARKET_LIST_SUBMIT });
      //Call API

      CoinCultApi.get(END_POINT.GET_MARKET_LIST, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          getCoinListSuccess(disptach, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          console.log("error=-=getMarketList=-=>>", JSON.stringify(error));

          if (error?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
            withdrawDepositFail(disptach, "");
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
            withdrawDepositFail(disptach, "");
            reject("");
          } else {
            withdrawDepositFail(disptach, error?.response?.data.message);
            reject(error?.response?.data.message);
          }
        });
    });
  };
};
/************************************** get order details ****************************************************/
export const getOrderDetails = (orderId) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.get(
            END_POINT.GET_TRADE_ORDER_API + `/${orderId}`,

            {
              headers: {
                Authorization: JSON.parse(res),
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              resolve(response?.data);
            })
            .catch((error) => {
              console.log(
                "error=-=getOrderDetails=-=>>",
                JSON.stringify(error)
              );

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                // Singleton.getInstance().showError(
                //   "Server down, please try after sometime"
                // );
                reject("Server down, please try after sometime");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
              }
            });
        });
    });
};

export const orderHistoryUpdate = ({ prop, value }) => {
  return {
    type: ORDER_HISTORY_PROP_UPDATE,
    payload: { prop, value },
  };
};
export const orderHistorySingleUpdate = ({ prop, value }) => {
  return {
    type: ORDER_HISTORY_PROP_SINGLE_UPDATE,
    payload: { prop, value },
  };
};

export const resetOrderHistory = () => {
  return {
    type: RESET_ORDER_HISTORY,
  };
};
export const resetOpenOrderAllHistory = () => {
  return {
    type: ORDER_CANCEL_ALL_RESET,
  };
};
export const resetOpenOrderHistory = () => {
  return {
    type: RESET_OPEN_ORDER_HISTORY,
  };
};
export const resetOpenOrderSingleHistory = () => {
  return {
    type: RESET_OPEN_ORDER_SINGLE_HISTORY,
  };
};
export const resetTradeHistory = () => {
  return {
    type: RESET_TRADE_HISTORY_SUCCESS,
  };
};
/************************************** get deposit crypto history details ****************************************************/
export const getDepositCryptoHistory = (param) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: GET_ORDER_SUBMIT });

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getList(
            END_POINT.GET_DEPOSIT_LIST_API +
              `?page=${param.page}&limit=${param.limit}`,
            res
          )
          .then((response) => {
            console.log(
              "getDepositCryptoHistory=-=-=-response",
              JSON.parse(response.bodyString)
            );
            withdrawDepositSuccess(disptach, response);
            resolve(response);
          })
          .catch((error) => {
            console.log("getDepositCryptoHistory=-=-=-error", error);

            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            withdrawDepositFail(
              disptach,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
            reject(
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
          });
      });
  });
};
/************************************** cancel order details ****************************************************/
export const cancelOrder = (id) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: ORDER_CANCEL });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(END_POINT.CANCEL_ORDER_API + `${id}/cancel`, "", {
          headers: {
            Authorization: res,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.status === 201) {
              showMessage({
                message: "Open order cancelled successfully!",
                backgroundColor: ThemeManager.colors.tabBottomBorder,
                autoHide: true,
                duration: 3000,
                type: "success",
                icon: "success",
                position: "right",
                style: {
                  marginHorizontal: 10,
                  borderRadius: 10,
                  marginTop: Platform.OS == "android" ? 10 : 40,
                },
              });
            }
            getOrderCancelSuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            getOrdersFail(
              disptach,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};
/************************************** cancel all order ****************************************************/
export const cancelAllOrder = (pair) => (disptach) => {
  return new Promise((resolve, reject) => {
    var params = {};
    params = {
      market: pair,
    };
    disptach({ type: ORDER_CANCEL });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(END_POINT.CANCEL_ALL_ORDER, params, {
          headers: {
            Authorization: res,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.status === 201) {
              showMessage({
                message: "All open orders cancelled successfully!",
                backgroundColor: ThemeManager.colors.tabBottomBorder,
                autoHide: true,
                duration: 3000,
                type: "success",
                icon: "success",
                position: "right",
                style: {
                  marginHorizontal: 10,
                  borderRadius: 10,
                  marginTop: Platform.OS == "android" ? 10 : 40,
                },
              });
            }
            getOrderAllCancelSuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            getOrdersFail(
              disptach,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};
/************************************** cancel all order without params ****************************************************/
export const cancelAllOrderWithoutParams = () => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: ORDER_CANCEL_ALL_SUBMIT });
    //Call API
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(END_POINT.CANCEL_ALL_ORDER, null, {
          headers: {
            Authorization: res,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.status === 201) {
              showMessage({
                message: "All open orders cancelled successfully!",
                backgroundColor: ThemeManager.colors.tabBottomBorder,
                autoHide: true,
                duration: 3000,
                type: "success",
                icon: "success",
                position: "right",
                style: {
                  marginHorizontal: 10,
                  borderRadius: 10,
                  marginTop: Platform.OS == "android" ? 10 : 40,
                },
              });
            }
            cancelAllOrderCancelSuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            cancelAllOrdersFail(
              disptach,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};
/************************************** get trade history ****************************************************/
export const getTreadHistory = (param, concatLink) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: SUBMIT_TRADE_HISTORY_SUCCESS });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_TRADE_HISTORY +
            `?page=${param.page}&limit=${param.limit}${concatLink}`,
          {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            console.log(
              "getTreadHistory response=-=->>",
              JSON.stringify(response)
            );
            getTradeHistorySuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log("getTreadHistory error=-=->>", JSON.stringify(error));
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            getTradeHistoryFail(
              disptach,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};
/************************************** get order history ****************************************************/
export const getOrderHistory = (param, concatLink, loader) => (disptach) => {
  return new Promise((resolve, reject) => {
    loader && disptach({ type: GET_ORDER_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_TRADE_ORDER_API +
            `?page=${param.page}&limit=${param.limit}${concatLink}`,
          {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            getOrderSuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log(
              "getOrderHistory list=-=error-=>>",
              JSON.stringify(error)
            );
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getOrdersFail(disptach, "");
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
              getOrdersFail(disptach, "");
              reject("");
            } else {
              getOrdersFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            }
          });
      });
  });
};
/************************************** get open order single history ****************************************************/
export const getOpenOrdersSingle = (param, concatLink) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: SUBMIT_OPEN_ORDER_SINGLE_HISTORY });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_TRADE_ORDER_API +
            `?page=${param.page}&limit=${param.limit}${concatLink}`,
          {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            // console.log("getOpenOrderSingleSuccess----->>", response);
            getOpenOrderSingleSuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log(
              "getOpenOrderSingleSuccess--error--->>",
              JSON.stringify(error)
            );
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getOrdersSingleFail(disptach, "");
              reject("");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              if (
                error?.response?.status == "403" &&
                error?.response?.data?.errors[0] == "market.trade.not_permitted"
              ) {
                // alert("helloooo");
                console.log(
                  "error?.response?.data?.errors[0]=--",
                  error?.response?.data?.errors[0]
                );
                // Singleton.getInstance().showError(
                //   getMultiLingualData(error?.response?.data?.errors[0])
                // );
                getOrdersSingleFail(
                  disptach,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
              } else {
                console.log("error?.response?.data?.errors[0]=-090909");

                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                getOrdersSingleFail(disptach, "");
                reject("");
              }
            } else {
              getOrdersSingleFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
              Singleton.getInstance().showError(
                getMultiLingualData(error?.response?.data?.errors[0])
              );
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            }
          });
      });
  });
};
/************************************** get open orders history ****************************************************/
export const getOpenOrders = (param, concatLink, loader) => (disptach) => {
  return new Promise((resolve, reject) => {
    loader && disptach({ type: SUBMIT_OPEN_ORDER_HISTORY });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_TRADE_ORDER_API +
            `?page=${param.page}&limit=${param.limit}${concatLink}`,
          {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            getOpenOrderSuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            getOrdersFail(
              disptach,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};
/************************************** get withdraw deposit history ****************************************************/
export const getWithdrawDepositHistory = (param) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: GET_ORDER_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_ALL_TRANS_API +
            `?page=${param.page}&limit=${param.limit}`,
          {
            headers: {
              Authorization: JSON.parse(res),
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            console.log("getWithdrawDepositHistory=-=-=-response", response);

            withdrawDepositSuccess(disptach, response);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log(
              "getWithdrawDepositHistory=-=-=-error",
              JSON.stringify(error)
            );

            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            withdrawDepositFail(
              disptach,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};

const cancelAllOrdersFail = (disptach, errorMessage) => {
  disptach({
    type: ORDER_CANCEL_ALL_FAIL,
    payload: errorMessage,
  });
};
const cancelAllOrderCancelSuccess = (disptach, details) => {
  disptach({
    type: ORDER_CANCEL_ALL_SUCCESS,
    payload: details,
  });
};
const getOrdersSingleFail = (disptach, errorMessage) => {
  disptach({
    type: FAIL_OPEN_ORDER_SINGLE_HISTORY,
    payload: errorMessage,
  });
};
const getOrdersFail = (disptach, errorMessage) => {
  disptach({
    type: FAIL_OPEN_ORDER_HISTORY,
    payload: errorMessage,
  });
};
const getTradeHistoryFail = (disptach, errorMessage) => {
  disptach({
    type: FAIL_TRADE_HISTORY_SUCCESS,
    payload: errorMessage,
  });
};
const getOrderCancelSuccess = (disptach, details) => {
  disptach({
    type: ORDER_CANCEL_UPADTE,
    payload: details,
  });
};
const getOrderAllCancelSuccess = (disptach, details) => {
  disptach({
    type: ORDER_CANCEL_ALL,
    payload: details,
  });
};

const getOrderSuccess = (disptach, details) => {
  disptach({
    type: GET_ORDER_HISTORY_SUCCESS,
    payload: details,
  });
};
const getOpenOrderSingleSuccess = (disptach, details) => {
  disptach({
    type: GET_OPEN_ORDER_SINGLE_SUCCESS,
    payload: details,
  });
};
const getOpenOrderSuccess = (disptach, details) => {
  disptach({
    type: GET_OPEN_ORDER_SUCCESS,
    payload: details,
  });
};
const getTradeHistorySuccess = (disptach, details) => {
  disptach({
    type: GET_TRADE_HISTORY_SUCCESS,
    payload: details,
  });
};
const withdrawDepositFail = (disptach, errorMessage) => {
  disptach({
    type: GET_WITHDRAW_DEPOSIT_FAIL,
    payload: errorMessage,
  });
};

const withdrawDepositSuccess = (disptach, details) => {
  disptach({
    type: GET_WITHDRAW_DEPOSIT_SUCCESS,
    payload: details,
  });
};

const getCoinListSuccess = (disptach, details) => {
  disptach({
    type: GET_MARKET_LIST_SUCCESS,
    payload: details,
  });
};
