import {
  NOTIFY_TOTAL_INIT,
  NOTIFY_TOTAL_SUCCESS,
  NOTIFY_TOTAL_FAIL,
  NOTIFY_TOTAL_RESET,
  NOTIFY_INIT,
  NOTIFY_SUCCESS,
  NOTIFY_FAIL,
  NOTIFY_RESET,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { CoinCultApi } from "../../api";
import END_POINT from "../../EndPoints";

export const resetNotificationHistory = () => {
  return {
    type: NOTIFY_RESET,
  };
};
export const getNotificationList = (page, limit) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: NOTIFY_INIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_USER_NOTIFICATION + `?page=${page}&limit=${limit}`,
          {
            headers: {
              contentType: "application/json",
              Authorization: JSON.parse(res),
            },
          }
        )
          .then((cResponse) => {
            console.log(
              "notification list=-=-=>cResponse>>",
              JSON.stringify(cResponse)
            );
            getNotificationListSuccess(disptach, cResponse);

            resolve(cResponse);
            // resolve(cresponse?.data);
            // cresponse?.data.length > 0
            //   ? disptach({type: NOTIFY_SUCCESS, payload: cresponse?.data})
            //   : disptach({type: NOTIFY_FAIL, payload: 'No record found'});
          })
          .catch((err) => {
            console.log("notification list=-=-=>err>>", JSON.stringify(err));
            disptach({ type: NOTIFY_FAIL, payload: "No record found" });
            if (err.response.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
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
              reject("");
            } else {
              reject(err);
            }
          });
      });
  });
};
export const getNotificationDataOnly = (page, limit) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: NOTIFY_TOTAL_INIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_USER_NOTIFICATION + `?page=${page}&limit=${limit}`,
          {
            headers: {
              contentType: "application/json",
              Authorization: JSON.parse(res),
            },
          }
        )
          .then((cResponse) => {
            getNotificationTotalSuccess(disptach, cResponse);

            resolve(cResponse);
          })
          .catch((err) => {
            console.log(
              "getNotificationDataOnly-=-=err>>>",
              JSON.stringify(err)
            );
            if (err?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
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
              reject("");
            } else {
              reject(err);
            }
          });
      });
  });
};
// export const accountUser = () => {
//   return disptach => {
//     disptach({type: ACCOUNT_USER});
//     const finalList = [];
//     Singleton.getInstance()
//       .getData(constants.ACCESS_TOKEN)
//       .then(res => {
//         RubyexApi.post(GET_ACTIVE_COIN_CONVERSION_LIST, null, {
//           headers: {
//             'X-CSRF-Token': res,
//             'Content-Type': 'application/json',
//           },
//         })
//           .then(cResponse => {
//             const convResponse = cresponse?.data.data;
//             RubyexApi.get(GET_ACTIVE_COIN_LIST, {
//               headers: {
//                 'X-CSRF-Token': res,
//                 'Content-Type': 'application/json',
//               },
//             })
//               .then(response => {
//                 const activeResponse = response?.data.data;
//                 activeResponse.filter(value => {
//                   convResponse.filter(covValue => {
//                     if (
//                       value.currency_symbol.toLowerCase() ==
//                       covValue.coin.toLowerCase()
//                     ) {
//                       value.coin = covValue.perprice;
//                       RubyexApi.get(
//                         GET_COIN_BALANCE_LIST +
//                           value.currency_symbol.toLowerCase() +
//                           '/get_balance',
//                         {
//                           headers: {
//                             'X-CSRF-Token': res,
//                             'Content-Type': 'application/json',
//                           },
//                         },
//                       )
//                         .then(balanceResponse => {
//                           value.balance = balanceresponse?.data.data[0].balance;
//                           finalList.push(value);
//                           if (activeResponse.length == finalList.length) {
//                             console.log('succ2', finalList);
//                             accountUserSuccess(disptach, finalList);
//                           }
//                         })
//                         .catch(error => {
//                           console.log('Error bank details', error?.response);
//                           if (error?.response?.status == '401') {
//                             Actions.replace('Welcome');
//                             Alert.alert(constants.APP_NAME, 'Session expired');
//                             Singleton.getInstance().saveEmptyDefault();
//                           }
//                           getCoinAddressFail(
//                             disptach,
//                             error?.response?.data.message,
//                           );
//                         });
//                     }
//                   });
//                 });
//               })
//               .catch(error => {
//                 console.log('Error bank details', error?.response);
//                 accountUserFail(disptach, error?.response?.data.message);
//                 if (error?.response?.status == '401') {
//                   Actions.replace('Welcome');
//                   Singleton.getInstance().saveEmptyDefault();
//                   Alert.alert(constants.APP_NAME, 'Session expired');
//                 }
//               });
//           })
//           .catch(error => {
//             console.log('Error bank details', error?.response);
//             accountUserFail(disptach, error?.response?.data.message);
//             if (error?.response?.status == '401') {
//               Actions.replace('Welcome');
//               Singleton.getInstance().saveEmptyDefault();
//               Alert.alert(constants.APP_NAME, 'Session expired');
//             }
//           });
//       });
//   };
// };

// const accountUserFail = (disptach, errorMessage) => {
//   disptach({
//     type: ACCOUNT_USER_FAIL,
//     payload: errorMessage,
//   });
// };
// const accountUserSuccess = (disptach, user) => {
//   disptach({
//     type: ACCOUNT_USER_SUCCESS,
//     payload: user,
//   });
// };
const getNotificationListSuccess = (disptach, details) => {
  disptach({
    type: NOTIFY_SUCCESS,
    payload: details,
  });
};
const getNotificationTotalSuccess = (disptach, details) => {
  disptach({
    type: NOTIFY_TOTAL_SUCCESS,
    payload: details,
  });
};
