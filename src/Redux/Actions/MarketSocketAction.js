import { Actions } from "react-native-router-flux";
import { CoinCultApi } from "../../api/CoinCultApi";
import END_POINT from "../../EndPoints";
import {
  MARKET_TICKER_FAIL,
  MARKET_TICKER_SUCCESS,
  MARKET_USER,
  BUY_SELL_SOCKET_SUCCESS,
  TRADE_SOCKET_SUCCESS,
  GET_ORDER_HISTORY_SUCCESS_SOCKET,
  GET_ALL_BAL_USER_SUCCESS,
  SNAP_ALL_ORDERS,
  STOP_OLD_CONNECTION,
  GET_ALL_BAL_USER_FAIL,
  //fav socket
  MARKET_FAV_SUCCESS,
  MARKET_FAV_FAIL,
  MARKET_FAV_SUBMIT,
  RESET_MARKET_FAV_SUBMIT,
  MARKET_TICKER_RESET,
} from "./types";
import { Platform, Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
// import io from "socket.io-client";
import UserAgent from "react-native-user-agent";
import { getMultiLingualData } from "../../../Utils";
// let ws = null;
let ws1 = null;
let baseUrl;
var marketTicketSocket = null;
var favMarketTicketSocket = null;
export const updateMarketPair = (pair) => {
  return {
    type: "update_market_trade",
    payload: pair,
  };
};
export const resetFavMarketList = () => {
  return {
    type: RESET_MARKET_FAV_SUBMIT,
  };
};
export const resetMarketTicker = () => {
  return {
    type: MARKET_TICKER_RESET,
  };
};

export const favMarketTicker = () => {
  return (dispatch) => {
    dispatch({ type: MARKET_FAV_SUBMIT });
    baseUrl = END_POINT.FAV_PAIR_DATA_URL + `favmarket`;
    // console.log("fav base url=-=-=", baseUrl);
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        var headers = {
          Authorization: JSON.parse(res),
        };
        // var headers = {};
        if (Platform.OS == "ios") {
          headers["User-Agent"] = iosSocketHeader();
        }
        favMarketTicketSocket = new WebSocket(baseUrl, null, { headers });
        // marketTicketSocket.conne
        favMarketTicketSocket.onmessage = (event) => {
          let socketFavData = JSON.parse(event.data);
          // console.log("socketFavData=-=-=-", socketFavData);
          let globalFavTicker = socketFavData["favmarket"];
          // console.log("globalFavTicker=-=-=-", globalFavTicker);
          var arrayFavData = [];
          if (globalFavTicker != undefined) {
            Object.keys(globalFavTicker).map((key) => {
              arrayFavData.push(globalFavTicker[key]);
            });
          }

          let coinArray = [];
          arrayFavData.map((value, key) => {
            coinArray.push(value.quote_unit);
          });

          // console.log("arrayFavData=-ee=-=-", arrayFavData);

          // if (arrayFavData.length > 0) {
          favMarketTickerSuccess(dispatch, arrayFavData);
          // }
          // console.log("unique=-=-=-", unique);
          // console.log("arrayData=-=-=-", arrayData);
          // console.log("coinArray=-=-=-", coinArray);
        };
        favMarketTicketSocket.onerror = (error) => {
          console.log("ERRORR+====favMarketTicketSocket====", error);
        };
      });
  };
};
export const stopFavMarketTickerConnection = () => {
  console.log("favMarketTicketSocket::::::::::::::::", favMarketTicketSocket);
  if (favMarketTicketSocket != null) {
    favMarketTicketSocket.close();
    favMarketTicketSocket = null;
  }
};
export const callMarketTicker = () => {
  return (dispatch) => {
    dispatch({ type: MARKET_USER });
    baseUrl = END_POINT.MARKET_DATA_URL_PRIVATE + `global.tickers`;
    var headers = {};
    if (Platform.OS == "ios") {
      headers["User-Agent"] = iosSocketHeader();
    }
    marketTicketSocket = new WebSocket(baseUrl, null, { headers });
    // marketTicketSocket.conne
    marketTicketSocket.onmessage = (event) => {
      let socketData = JSON.parse(event.data);
      let globalTicker = socketData["global.tickers"];

      var arrayData = [];
      if (globalTicker != undefined) {
        Object.keys(globalTicker).map((key) => {
          arrayData.push(globalTicker[key]);
        });
      }

      let coinArray = [];
      arrayData.map((value, key) => {
        coinArray.push(value.quote_unit);
      });

      let unique = coinArray.filter((v, i, a) => a.indexOf(v) === i);
      var first = "usdt";
      unique.sort(function (x, y) {
        return x == first ? -1 : y == first ? 1 : 0;
      });
      // let unique1 = coinArray.filter((v, i, a) => {
      //   console.log("unique=-=-=v-", v);
      //   console.log("unique=-=-=i-", i);

      //   console.log("unique=-=-=a-", a);

      //   a.indexOf(v) === i;
      // });

      if (arrayData.length > 0) {
        marketTickerSuccess(dispatch, arrayData, unique);
      }
      // console.log("unique=-=-=-", unique);
      // console.log("arrayData=-=-=-", arrayData);
      // console.log("coinArray=-=-=-", coinArray);
    };
    marketTicketSocket.onerror = (error) => {
      console.log("ERRORR+======================", error);
    };
  };
};
export const stopMarketTickerConnection = () => {
  // console.log("code::::::::::::::::", marketTicketSocket);
  if (marketTicketSocket != null) {
    marketTicketSocket.close();
    marketTicketSocket = null;
  }
};
export const buySellSocket = ({ pair, auth }) => {
  return async (dispatch) => {
    if ((await Singleton.getInstance().buySellTicketSocket) != null) {
      await Singleton.getInstance().buySellTicketSocket.close();
      Singleton.getInstance().buySellTicketSocket = null;
      setTimeout(() => {
        connectBuySellSocket(dispatch, pair);
      }, 180);
    } else {
      connectBuySellSocket(dispatch, pair);
    }
  };
};

function connectBuySellSocket(dispatch, pair) {
  baseUrl = END_POINT.MARKET_DATA_URL_PRIVATE + `${pair}.update`;
  var headers = {};
  if (Platform.OS == "ios") {
    headers["User-Agent"] = iosSocketHeader();
  }

  Singleton.getInstance().buySellTicketSocket = new WebSocket(baseUrl, null, {
    headers,
  });
  Singleton.getInstance().buySellTicketSocket.onmessage = (event) => {
    let socketData = JSON.parse(event.data);
    let buySellData = socketData[`${pair}.update`];

    if (buySellData != undefined) {
      let ask = buySellData.asks;
      let bid = buySellData.bids;
      let newAsks = ask.length > 10 ? ask.splice(0, 10) : ask;
      let newBids = bid.length > 10 ? bid.splice(0, 10) : bid;
      let newAsksLarge = ask.length > 20 ? ask.splice(0, 20) : ask;
      let newBidsLarge = bid.length > 20 ? bid.splice(0, 20) : bid;
      let allData = {
        asks: newAsks,
        bids: newBids,
        asksLarge: newAsksLarge,
        bidsLarge: newBidsLarge,
        pair: pair,
      };

      buySellSuccess(dispatch, allData);
    }
  };

  Singleton.getInstance().buySellTicketSocket.onerror = (error) => {
    marketTickerFail(dispatch, error);
    if (Actions.currentScene == "BuySellMarket") {
      // connectBuySellSocket(dispatch, pair);
      dispatch(buySellSocket({ pair: pair }));
    }
  };

  Singleton.getInstance().buySellTicketSocket.onclose = (error) => {
    // console.log("==================== close", error, baseUrl);
    if (Actions.currentScene == "BuySellMarket") {
      // connectBuySellSocket(dispatch, pair);
      dispatch(buySellSocket({ pair: pair }));
    }
  };
}

function iosSocketHeader() {
  return `${UserAgent.applicationName}/${UserAgent.buildNumber} CFNetwork/${UserAgent.cfnetworkVersion} Darwin/${UserAgent.darwinVersion}`;
}
// function androidSocketHeader() {
//   return `${UserAgent.}/${UserAgent.buildNumber} CFNetwork/${UserAgent.cfnetworkVersion} Darwin/${UserAgent.darwinVersion}`;
// }
export const callOrderSocket =
  ({ pair, auth }) =>
  (disptach) => {
    return new Promise((resolve, reject) => {
      ws1 && ws1.close();

      var baseUrl = "";
      baseUrl = END_POINT.MARKET_DATA_URL_PRIVATE + `order`;

      var headers = {};
      if (Platform.OS == "ios") {
        headers["User-Agent"] = iosSocketHeader();
      }

      // console.log('----------------user-agent----------------', headers);
      // ws && ws.close()
      // ws=null;
      if (ws1 != null) {
        ws1.close();
      }
      ws1 = new WebSocket(baseUrl, null, { headers });

      ws1.onmessage = (event) => {
        CoinCultApi.get(
          END_POINT.GET_TRADE_ORDER_API +
            `?page=1&limit=5&market=${pair}&state=wait`
          // {
          //   headers: {
          //     Authorization: Singleton.getInstance().accessToken,
          //   },
          // },
        )
          .then((response) => {
            getOrderSuccess(disptach, response);

            CoinCultApi.get({
              headers: {
                // Authorization: Singleton.getInstance().accessToken,
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                // console.log();
                getAllBalSuccess(disptach, response?.data);
              })
              .catch((error) => {
                if (error?.response?.status == "401") {
                  Singleton.getInstance().isLoginSuccess = true;
                  Singleton.getInstance().refreshToken(1);
                }
                getAllBalFail(
                  disptach,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
              });
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
          });
      };
      ws1.onerror = (error) => {};

      ws1.onclose = (error) => {};
    });
  };

export const stopPreviousConnection = () => (disptach) => {
  return new Promise(async (resolve, reject) => {
    if (Singleton.getInstance().buySellTicketSocket != null) {
      await Singleton.getInstance().buySellTicketSocket.close();
      Singleton.getInstance().buySellTicketSocket = null;
      resolve("done");
      disptach({ type: STOP_OLD_CONNECTION });
    } else {
      resolve("done");
    }
  });
};
export const stopAllConnection = async () => {
  if (Singleton.getInstance().buySellTicketSocket != null) {
    await Singleton.getInstance().buySellTicketSocket.close();
    Singleton.getInstance().buySellTicketSocket = null;
  }
};

const getAllBalSuccess = (disptach, response) => {
  disptach({
    type: GET_ALL_BAL_USER_SUCCESS,
    payload: response,
  });
};
const marketTickerFail = (disptach, errorMessage) => {
  disptach({
    type: MARKET_TICKER_FAIL,
    payload: errorMessage,
  });
};
const marketTickerSuccess = (disptach, socketData, pairData, buySellData) => {
  disptach({
    type: MARKET_TICKER_SUCCESS,
    payload: socketData,
    payloadSecond: pairData,
  });
};
const favMarketTickerSuccess = (disptach, socketData) => {
  disptach({
    type: MARKET_FAV_SUCCESS,
    payload: socketData,
  });
};
const buySellSuccess = (disptach, buySellData) => {
  disptach({
    type: BUY_SELL_SOCKET_SUCCESS,
    payload: buySellData,
  });
};
const getAllOrders = (snapAllOrders, disptach) => {
  disptach({
    type: SNAP_ALL_ORDERS,
    payload: snapAllOrders,
  });
};

const tradesDataSuccess = (disptach, buySellData) => {
  disptach({
    type: TRADE_SOCKET_SUCCESS,
    payload: buySellData,
  });
};
const getOrderSuccess = (disptach, details) => {
  disptach({
    type: GET_ORDER_HISTORY_SUCCESS_SOCKET,
    payload: details,
  });
};

const getAllBalFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_ALL_BAL_USER_FAIL,
    payload: errorMessage,
  });
};
