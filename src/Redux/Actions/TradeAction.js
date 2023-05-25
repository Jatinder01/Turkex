import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import * as constants from "../../Constants";
import {
  GET_ALL_BAL_USER_SUCCESS,
  GET_ALL_BAL_USER_FAIL,
  GET_ALL_BAL_USER_SUBMIT,
  TRADE_VALUES_UPDATE,
  GET_PUBLIC_TRADE_SUCCESS,
  TRADE_OREDR_FAIL,
  TRADE_OREDR_SUBMIT,
  TRADE_OREDR_SUCCESS,
  INITIAL_TRADE_RULE,
  GET_TRADE_RULE,
  GET_TRADE_FEE_DATA,
  FAIL_TRADE_RULE,
  UPDATE_FEES_VALUE,
  GET_BINANCE_PAIRS,
  FAIL_TRADE_FEE,
  DELETE_ALL_TRADE,
  TRADE_OREDR_RESET,
  CLEAR_TRADE_ARRAY,
} from "./types";
import { Platform, Alert } from "react-native";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { strings } from "../../../Localization";
import UserAgent from "react-native-user-agent";
import { CoinCultApi } from "../../api/CoinCultApi";

export const tradeValuesUpdate = ({ prop, value }) => {
  return {
    type: TRADE_VALUES_UPDATE,
    payload: { prop, value },
  };
};
export const resetTradeValuesUpdate = () => {
  return {
    type: TRADE_OREDR_RESET,
  };
};
export const getTradeHsitory = ({}) => {};

export const getTreadingRules = (pair, uuid) => {
  let urlString = "";
  // console.log("trading rules =-=-=-=->>>>pair", pair);
  // console.log("trading rules =-=-=-=->>>>uuid", uuid);

  return (disptach) => {
    disptach({ type: INITIAL_TRADE_RULE });
    let urlString = uuid
      ? END_POINT.TRADING_RULE + "?market_id=" + pair + "&uuid=" + uuid
      : END_POINT.TRADING_RULE + "?market_id=" + pair;
    CoinCultApi.get(urlString, {
      headers: {
        // Authorization: Singleton.getInstance().accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // var rules = res?.data.find((a) => a.id == pair);
        // console.log("trading rules =-=-=-=->>>>res", res);
        // console.log("trading rules =-=-=-=->>>>rules", rules);

        disptach({
          type: GET_TRADE_RULE,
          // payload: rules ? rules : res?.data[0],
          payload: res?.data[0],
        });
      })
      .catch((err) => {
        console.log("getTreadingRules--err--->>", JSON.stringify(err));
        if (err?.response?.status == "401") {
          Singleton.getInstance().isLoginSuccess = true;
          Singleton.getInstance().refreshToken(1);
        } else if (
          err?.response?.status == "403" ||
          err?.response?.status == "500" ||
          err?.response?.status == "503" ||
          err?.response?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
        }
        disptach({ type: FAIL_TRADE_RULE });
      });
    // });
  };
};
// export const getBnbNonce = ({walletadd, tokenAdd}) => {
//   return dispatch => {
//     return new Promise((resolve, reject) => {
//       let data = {
//         wallet_address: walletadd,
//       };
//       console.log(data);
//       Singleton.getInstance()
//         .getData(Constants.ACCESS_TOKEN)
//         .then(access_token => {
//           APIClient.getInstance()
//             .post(`api/v1/binance/${tokenAdd}/nonce`, data, access_token)
//             .then(response => {
//               // console.log("response API_NONCE--",response)
//               let result = response;
//               resolve(result);
//             })
//             .catch(error => {
//               console.log('error API_NONCE -- ', error);
//               reject(error);
//               bnbFail(dispatch, error);
//             });
//         });
//     });
//   };
// };

export const getTreadingFeee = () => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: INITIAL_TRADE_RULE });
      // CoinCultApi.get(END_POINT.GET_MARKET_LIST, {withCredentials: true})
      CoinCultApi.get(END_POINT.GET_MARKET_LIST)

        .then((res) => {
          // console.log("getTreadingFeee=-=-=-", res);
          disptach({ type: GET_TRADE_FEE_DATA, payload: res?.data });
          resolve(res?.data);
        })
        .catch((err) => {
          console.log("getTreadingFeee=-=-=-err", err);

          if (err?.response?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
            disptach({ type: FAIL_TRADE_FEE });
            reject("");
          } else if (
            err?.response?.status == "403" ||
            err?.response?.status == "500" ||
            err?.response?.status == "503" ||
            err?.response?.status == "504"
          ) {
            Singleton.getInstance().showError(
              "Server down, please try after sometime"
            );
            disptach({ type: FAIL_TRADE_FEE });
            reject("");
          } else {
            disptach({ type: FAIL_TRADE_FEE });
            reject(err);
          }
        });
    });
  };
};

export const getUserAllBalance = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: GET_ALL_BAL_USER_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.GET_USER_ALL_BALANCE, {
          headers: {
            Authorization: JSON.parse(res),
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            getAllBalSuccess(dispatch, response?.data);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log(
              "error=-=getUserAllBalance=-=>>",
              JSON.stringify(error)
            );

            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getAllBalFail(dispatch, "");
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
              getAllBalFail(dispatch, "");
              reject("");
            } else {
              getAllBalFail(
                dispatch,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
              reject("");
            }
          });
      });
  });
};

export const callTradeSocket = ({ pair, auth }) => {
  return (dispatch) => {
    // ws && ws.close();

    dispatch({ type: GET_ALL_BAL_USER_SUBMIT });
    var baseUrl = "";
    baseUrl = END_POINT.MARKET_DATA_URL + `${pair}.trades`;
    var headers = {};
    // headers['cookie'] = auth;
    if (Platform.OS == "ios") {
      headers[
        "User-Agent"
      ] = `${UserAgent.applicationName}/${UserAgent.buildNumber} CFNetwork/${UserAgent.cfnetworkVersion} Darwin/${UserAgent.darwinVersion}`;
    }
    dispatch({ type: CLEAR_TRADE_ARRAY });

    Singleton.getInstance().marketTradeSocket &&
      Singleton.getInstance().marketTradeSocket.close();
    Singleton.getInstance().marketTradeSocket = null;
    console.log(
      "Singleton.getInstance().marketTradeSocket=-=-",
      Singleton.getInstance().marketTradeSocket
    );
    Singleton.getInstance().marketTradeSocket = new WebSocket(baseUrl, null, {
      headers,
    });

    Singleton.getInstance().marketTradeSocket.onopen = () => {
      // dispatch({type: DELETE_ALL_TRADE});
    };

    Singleton.getInstance().marketTradeSocket.onmessage = (event) => {
      console.log("pair=-=---->>>>", pair);
      let socketData = JSON.parse(event.data);
      let tradeData = socketData[`${pair}.trades`];

      console.log("tradeData--allTradeSocket" + JSON.stringify(tradeData));
      if (tradeData != undefined) {
        getPublicTradeSuccess(dispatch, tradeData);
        // setTimeout(sendNumber, 1000);
      }
    };
    Singleton.getInstance().marketTradeSocket.onerror = (error) => {
      console.log("errrr=============callTradeSocket" + JSON.stringify(error));

      getAllBalFail(dispatch, error);
    };
  };
};

export const placeTradeOrder = (param) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: TRADE_OREDR_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(END_POINT.PLACE_TRADE_ORDER_API_POST, param, {
          headers: {
            Authorization: res,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            tradeOrderSuccess(dispatch, response?.data);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log("placeTradeOrder--error--->>", JSON.stringify(error));
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              tradeOrderFail(dispatch, "");
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
              tradeOrderFail(dispatch, "");
              reject("");
            } else {
              tradeOrderFail(
                dispatch,
                getMultiLingualData(
                  "account." + error?.response?.data?.errors[0]
                )
              );
              reject(
                getMultiLingualData(
                  "account." + error?.response?.data?.errors[0]
                )
              );
            }
          });
      });
  });
};

export const tradeSocketClose = () => (disptach) => {
  return new Promise((resolve, reject) => {
    if (Singleton.getInstance().marketTradeSocket != null) {
      Singleton.getInstance().marketTradeSocket.close();
      resolve("done");
    } else {
      resolve("done");
    }
  });
};

export const getAllMarket = () => {
  return async (dispatch) => {
    CoinCultApi.get("/peatio/public/markets", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // console.log("response==-=-getallmarket-=-", response);
        dispatch({
          type: GET_BINANCE_PAIRS,
          payload: response?.data,
        });
      })
      .catch((err) => {
        if (err.response.status == "401") {
          Singleton.getInstance().isLoginSuccess = true;
          Singleton.getInstance().refreshToken(1);
        } else if (
          err?.response?.status == "403" ||
          err?.response?.status == "500" ||
          err?.response?.status == "503" ||
          err?.response?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
        }
      });
  };
};

export const getPublicTrade = (coinPair) => {
  return (dispatch) => {
    dispatch({ type: GET_ALL_BAL_USER_SUBMIT });

    CoinCultApi.get(`/peatio/public/markets/${coinPair}/trades`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        //  getPublicTradeSuccess(dispatch, response?.data);
      })
      .catch((error) => {
        if (error?.response?.status == "401") {
          Singleton.getInstance().isLoginSuccess = true;
          Singleton.getInstance().refreshToken(1);
          getAllBalFail(dispatch, "");
        } else if (
          error?.response?.status == "403" ||
          error?.response?.status == "500" ||
          error?.response?.status == "503" ||
          error?.response?.status == "504"
        ) {
          Singleton.getInstance().showError(
            "Server down, please try after sometime"
          );
          getAllBalFail(dispatch, "");
        } else {
          getAllBalFail(
            dispatch,
            getMultiLingualData(error?.response?.data?.errors[0])
          );
        }
      });
    // });
  };
};

const tradeOrderFail = (dispatch, errorMessage) => {
  dispatch({
    type: TRADE_OREDR_FAIL,
    payload: errorMessage,
  });
};

const tradeOrderSuccess = (dispatch, response) => {
  dispatch({
    type: TRADE_OREDR_SUCCESS,
    payload: response,
  });
};

const getAllBalFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_ALL_BAL_USER_FAIL,
    payload: errorMessage,
  });
};

const getAllBalSuccess = (dispatch, response) => {
  dispatch({
    type: GET_ALL_BAL_USER_SUCCESS,
    payload: response,
  });
};

const getPublicTradeSuccess = (dispatch, response) => {
  dispatch({
    type: GET_PUBLIC_TRADE_SUCCESS,
    payload: response,
  });
};
