// import { Actions } from "react-native-router-flux";
// import END_POINT from "../../EndPoints";
// import { CoinCultApi } from "../../api/CoinCultApi";

// import {
//   FUNDS_FORM_UPDATE,
//   FUNDS_USER_SUCCESS,
//   FUNDS_USER_FAIL,
//   FUNDS_USER,
//   COIN_TO_USD_SUCCESS,
//   COIN_TO_USD_FAIL,
//   FUNDS_FORM_RESET,
// } from "./types";
// import { Alert } from "react-native";
// import * as constants from "../../Constants";
// import Singleton from "../../Singleton";

// export const fundsFormUpdate = ({ prop, value }) => {
//   return {
//     type: FUNDS_FORM_UPDATE,
//     payload: { prop, value },
//   };
// };
// export const resetFunds = () => {
//   return {
//     type: FUNDS_FORM_RESET,
//   };
// };
// export const fundConversion = () => {
//   return (dispatch) => {
//     Singleton.getInstance()
//       .getDataSecure(constants.ACCESS_TOKEN)
//       .then((res) => {
//         CoinCultApi.post(
//           END_POINT.SINGLE_CRYPTO_CONVERSION,
//           {
//             currency_from: "ETH",
//             currency_to: "USD",
//           },
//           {
//             headers: {
//               Authorization: res,
//               "Content-Type": "application/json",
//             },
//           }
//         )
//           .then((response) => {
//             // console.log('RESPONSE_CONS---', response);
//           })
//           .catch((err) => {
//             console.log(
//               "ERROR_NEW-------",
//               END_POINT.SINGLE_CRYPTO_CONVERSION,
//               err
//             );
//           });
//       });
//   };
// };

// export const fundsUser = (loader) => {
//   // alert('heelo');
//   return (dispatch) => {
//     loader && dispatch({ type: FUNDS_USER });

//     const finalList = [];

//     CoinCultApi.get(
//       END_POINT.GET_ACTIVE_COIN_LIST,

//       {
//         headers: {
//           // Authorization: Singleton.getInstance().accessToken,
//           "Content-Type": "application/json",
//         },
//       }
//     )
//       .then((responseCurrency) => {
//         const currencyList = responseCurrency.data;
//         let coinId = currencyList && currencyList.map((item, index) => item.id);

//         let coinIdJoin = coinId.join();
//         CoinCultApi.post(
//           END_POINT.MULTI_COIN_CONVERSION,
//           {
//             currency_from: coinIdJoin,
//             currency_to: "USD",
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               // Authorization: Singleton.getInstance().accessToken,
//             },
//           }
//         )
//           .then((response) => {
//             coinToUsdSuccess(dispatch, response?.data);

//             CoinCultApi.get(END_POINT.GET_COIN_BALANCE_LIST, {
//               headers: {
//                 Authorization: Singleton.getInstance().accessToken,
//                 "Content-Type": "application/json",
//               },
//             })
//               .then((responseBalance) => {
//                 const balanceList = responseBalance.data;
//                 currencyList.filter((value) => {
//                   balanceList.filter((balanceValue) => {
//                     if (value.id == balanceValue.currency) {
//                       value.balance = balanceValue;
//                       finalList.push(value);
//                     }
//                   });
//                 });

//                 fundsUserSuccess(dispatch, finalList);
//               })
//               .catch((error) => {
//                 if (error?.response?.status == "401") {
//                   Singleton.getInstance().isLoginSuccess = true;
//                   Singleton.getInstance().refreshToken(1);
//                 }
//                 fundsUserFail(dispatch, error?.response?.data.message);
//               });
//           })
//           .catch((err) => {
//             coinToUsdFail(dispatch, err.response?.data.message);
//           });
//       })
//       .catch((error) => {
//         if (error?.response?.status == "401") {
//           Singleton.getInstance().isLoginSuccess = true;
//           Singleton.getInstance().refreshToken(1);
//         }
//         fundsUserFail(dispatch, error?.response?.data.message);
//       });
//   };
// };

// const fundsUserFail = (dispatch, errorMessage) => {
//   dispatch({
//     type: FUNDS_USER_FAIL,
//     payload: errorMessage,
//   });
// };
// const fundsUserSuccess = (dispatch, user) => {
//   dispatch({
//     type: FUNDS_USER_SUCCESS,
//     payload: user,
//   });
// };
// const coinToUsdSuccess = (dispatch, cointToUsd) => {
//   dispatch({
//     type: COIN_TO_USD_SUCCESS,
//     payload: cointToUsd,
//   });
// };

// const coinToUsdFail = (dispatch, errorMessage) => {
//   dispatch({
//     type: COIN_TO_USD_FAIL,
//     payload: errorMessage,
//   });
// };

import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import { CoinCultApi } from "../../api/CoinCultApi";

import {
  FUNDS_FORM_UPDATE,
  FUNDS_USER_SUCCESS,
  FUNDS_USER_FAIL,
  FUNDS_USER,
  COIN_TO_USD_SUCCESS,
  COIN_TO_USD_FAIL,
  FUNDS_FORM_RESET,
  //wallet balance
  FUNDS_USER_WALLET_SUCCESS,
  FUNDS_USER_WALLET_FAIL,
  FUNDS_WALLET_USER,
  FUNDS_WALLET_USER_RESET,
  FUNDS_WALLET_USER_UPDATE,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { APIClient } from "../../api";

export const fundsFormUpdate = ({ prop, value }) => {
  return {
    type: FUNDS_FORM_UPDATE,
    payload: { prop, value },
  };
};
export const resetFunds = () => {
  return {
    type: FUNDS_FORM_RESET,
  };
};
export const fundsFormWalletUpdate = ({ prop, value }) => {
  return {
    type: FUNDS_WALLET_USER_UPDATE,
    payload: { prop, value },
  };
};
export const resetWalletFunds = () => {
  return {
    type: FUNDS_WALLET_USER_RESET,
  };
};
/**************************************  fund user wallet ****************************************************/
export const fundsUserWallet = (loader) => {
  // console.log("==== fundsUser resp--->>");
  // alert("heelo");
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      loader && dispatch({ type: FUNDS_WALLET_USER });

      const finalList = [];

      APIClient.getInstance()
        .getWithoutAuthLogin(END_POINT.GET_ACTIVE_COIN_LIST)
        .then((responseCurrency) => {
          const currencyList = responseCurrency;
          let coinId =
            currencyList && currencyList.map((item, index) => item.id);
          let coinIdJoin = coinId.join();
          const data = {
            currency_from: coinIdJoin,
            currency_to: "USD",
          };

          /**************************************  coin conversion  ****************************************************/

          Singleton.getInstance()
            .getDataSecure(constants.ACCESS_TOKEN)
            .then((res) => {
              let token;
              if (res != null) {
                token = res;
              } else {
                token = Singleton.getInstance().accessToken;
              }

              APIClient.getInstance()
                .getData(END_POINT.GET_COIN_BALANCE_LIST, token)
                .then((responseBalance) => {
                  // console.log(
                  //   "fundsUserWallet-==-=->>",
                  //   JSON.stringify(responseBalance)
                  // );
                  const balanceList = responseBalance;
                  currencyList?.filter((value) => {
                    balanceList?.filter((balanceValue) => {
                      if (value.id == balanceValue.currency) {
                        value.balance = balanceValue;
                        finalList.push(value);
                      }
                      // console.log(
                      //   "fundsUserWallet finalList resp--->>",
                      //   finalList
                      // );
                    });
                  });

                  fundsUserWalletSuccess(dispatch, finalList);
                  resolve(finalList);
                })
                .catch((error) => {
                  console.log(
                    "responseBalance fundsUserWallet error--->>",
                    JSON.stringify(error)
                  );
                  let erMsg = JSON.parse(error?.bodyString);
                  // console.log(
                  //   "responseBalance fundsUser error--->>",
                  //   erMsg[0]?.message
                  // );

                  if (error?.status == "401") {
                    Singleton.getInstance().isLoginSuccess = true;
                    Singleton.getInstance().refreshToken(1);
                  }
                  fundsUserWalletFail(dispatch, erMsg[0]?.message);
                  resolve(erMsg[0]?.message);
                });
            });
        })
        .catch((error) => {
          console.log("fundsUserWallet=-=error=-=->>", error);
          if (error?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
            fundsUserWalletFail(dispatch, "");
          } else if (
            error?.status == "403" ||
            error?.status == "500" ||
            error?.status == "503" ||
            error?.status == "504"
          ) {
            Singleton.getInstance().showError(
              "Server down, please try after sometime"
            );
            fundsUserWalletFail(dispatch, "");
          } else {
            fundsUserWalletFail(
              dispatch,
              JSON.parse(error?.bodyString)?.message
            );
          }
        });
    });
  };
};
/**************************************  fund conversion  ****************************************************/
export const fundConversion = () => {
  return (dispatch) => {
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .post(END_POINT.SINGLE_CRYPTO_CONVERSION, body, res)
          .then((response) => {
            // console.log('RESPONSE_CONS---', response);
          })
          .catch((err) => {
            console.log(
              "ERROR_NEW----fundConversion---",
              END_POINT.SINGLE_CRYPTO_CONVERSION,
              err
            );
          });
      });
  };
};
/**************************************  fund user  ****************************************************/
export const fundsUser = (loader) => {
  // console.log("==== fundsUser resp--->>");
  // alert("heelo");
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      loader && dispatch({ type: FUNDS_USER });

      const finalList = [];

      APIClient.getInstance()
        .getWithoutAuthLogin(END_POINT.GET_ACTIVE_COIN_LIST)
        .then((responseCurrency) => {
          const currencyList = responseCurrency;
          let coinId =
            currencyList && currencyList.map((item, index) => item.id);
          let coinIdJoin = coinId.join();
          const data = {
            currency_from: coinIdJoin,
            currency_to: "USD",
          };

          /**************************************  coin conversion  ****************************************************/
          APIClient.getInstance()
            .postWithoutTokenRegister(END_POINT.MULTI_COIN_CONVERSION, data)
            .then((response) => {
              // console.log("fundsUser===usd=-=-=-,", JSON.stringify(response));
              // console.log(
              //   "fundsUser===usd=>>>-=-=-,",
              //   JSON.parse(response.bodyString)
              // );

              coinToUsdSuccess(dispatch, JSON.parse(response.bodyString));

              Singleton.getInstance()
                .getDataSecure(constants.ACCESS_TOKEN)
                .then((res) => {
                  let token;
                  if (res != null) {
                    token = res;
                  } else {
                    token = Singleton.getInstance().accessToken;
                  }

                  APIClient.getInstance()
                    .getData(END_POINT.GET_COIN_BALANCE_LIST, token)
                    .then((responseBalance) => {
                      // console.log(
                      //   "responseBalance-==-=->>",
                      //   JSON.stringify(responseBalance)
                      // );
                      const balanceList = responseBalance;
                      currencyList?.filter((value) => {
                        balanceList?.filter((balanceValue) => {
                          if (value.id == balanceValue.currency) {
                            value.balance = balanceValue;
                            finalList.push(value);
                          }
                          // console.log(
                          //   "funduser finalList resp--->>",
                          //   finalList
                          // );
                        });
                      });

                      fundsUserSuccess(dispatch, finalList);
                      resolve(finalList);
                    })
                    .catch((error) => {
                      console.log(
                        "responseBalance fundsUser error--->>",
                        JSON.stringify(error)
                      );
                      let erMsg = JSON.parse(error?.bodyString);
                      // console.log(
                      //   "responseBalance fundsUser error--->>",
                      //   erMsg[0]?.message
                      // );

                      if (error?.status == "401") {
                        Singleton.getInstance().isLoginSuccess = true;
                        Singleton.getInstance().refreshToken(1);
                      }
                      fundsUserFail(dispatch, erMsg[0]?.message);
                      resolve(erMsg[0]?.message);
                    });
                });
            })
            .catch((err) => {
              console.log("fundsUser=-=err=-=->>", err);
              if (err == "timeout") {
                coinToUsdFail(dispatch, "Server timeout");
              } else if (
                err.status == "403" ||
                err.status == "500" ||
                err.status == "503" ||
                err.status == "504"
              ) {
                coinToUsdFail(dispatch, "");
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                coinToUsdFail(dispatch, "");
              } else {
                coinToUsdFail(dispatch, JSON.parse(error?.bodyString)?.message);
              }
            });
        })
        .catch((error) => {
          console.log("fundsUser=-=error=-=->>", error);
          if (error?.status == "401") {
            Singleton.getInstance().isLoginSuccess = true;
            Singleton.getInstance().refreshToken(1);
          }
          fundsUserFail(dispatch, JSON.parse(error?.bodyString)?.message);
        });
    });
  };
};

const fundsUserWalletFail = (dispatch, errorMessage) => {
  dispatch({
    type: FUNDS_USER_WALLET_FAIL,
    payload: errorMessage,
  });
};
const fundsUserWalletSuccess = (dispatch, user) => {
  dispatch({
    type: FUNDS_USER_WALLET_SUCCESS,
    payload: user,
  });
};
const fundsUserFail = (dispatch, errorMessage) => {
  dispatch({
    type: FUNDS_USER_FAIL,
    payload: errorMessage,
  });
};
const fundsUserSuccess = (dispatch, user) => {
  dispatch({
    type: FUNDS_USER_SUCCESS,
    payload: user,
  });
};
const coinToUsdSuccess = (dispatch, cointToUsd) => {
  dispatch({
    type: COIN_TO_USD_SUCCESS,
    payload: cointToUsd,
  });
};

const coinToUsdFail = (dispatch, errorMessage) => {
  dispatch({
    type: COIN_TO_USD_FAIL,
    payload: errorMessage,
  });
};
