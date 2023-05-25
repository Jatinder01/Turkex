import { Actions } from "react-native-router-flux";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  GOOGLE_AUTH_VALIDATE_FORM_UPDATE,
  GOOGLE_VALIDATE_SUBMIT,
  GOOGLE_AUTH_VALIDATE_FAIL,
  GOOGLE_AUTH_VALID_DETAIL_SUCCESS,
} from "./types";
import { VALID_PASSWORD, VALID_GOOGLE_AUTH_CODE } from "../../Constants";
import { getMultiLingualData } from "../../../Utils";
import { Alert, Platform } from "react-native";
import { CoinCultApi } from "../../api";
import END_POINT from "../../EndPoints";
import { showMessage } from "react-native-flash-message";
import { ThemeManager } from "../../../ThemeManager";

export const googleValidateFormUpdate = ({ prop, value }) => {
  return {
    type: GOOGLE_AUTH_VALIDATE_FORM_UPDATE,
    payload: { prop, value },
  };
};
/************************************** validate google auth user  ****************************************************/
export const validateGoogleAuthUser = ({
  gValidateCode,
  gValidatePassword,
  secretKey,
  isEnabled,
  refProps,
  fromWithdraw,
}) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GOOGLE_VALIDATE_SUBMIT });

      if (gValidateCode?.length < 6) {
        googleValidateFail(disptach, VALID_GOOGLE_AUTH_CODE);
      } else {
        if (isEnabled) {
          Singleton.getInstance()
            .getDataSecure(constants.ACCESS_TOKEN)
            .then((res) => {
              CoinCultApi.post(
                END_POINT.GOOGLE_AUTH_ENABLE_API_POST,
                {
                  code: gValidateCode,
                },
                {
                  headers: {
                    Authorization: res,
                  },
                }
              )
                .then((response) => {
                  CoinCultApi.get(
                    END_POINT.GET_USER_ME,

                    {
                      headers: {
                        Authorization: JSON.parse(res),
                      },
                    }
                  )
                    .then((response) => {
                      Singleton.getInstance().checkAuthBack = true;
                      Singleton.getInstance()
                        .saveData(
                          constants.USER_DATA,
                          JSON.stringify(response?.data)
                        )
                        .then((res) => {
                          googleValidateSuccess(
                            disptach,
                            response?.data,
                            refProps,
                            fromWithdraw
                          );
                        });
                      resolve(response?.data);
                    })
                    .catch((error) => {
                      if (error?.response?.status == "401") {
                        Singleton.getInstance().isLoginSuccess = true;
                        Singleton.getInstance().refreshToken(1);
                        googleValidateFail(disptach, "");
                      } else if (
                        error?.response?.status == "403" ||
                        error?.response?.status == "500" ||
                        error?.response?.status == "503" ||
                        error?.response?.status == "504"
                      ) {
                        Singleton.getInstance().showError(
                          "Server down, please try after sometime"
                        );
                        googleValidateFail(disptach, "");
                      } else {
                        googleValidateFail(
                          disptach,
                          getMultiLingualData(error?.response?.data?.errors[0])
                        );
                      }
                    });
                })
                .catch((error) => {
                  if (error?.response?.status == "401") {
                    Singleton.getInstance().isLoginSuccess = true;
                    Singleton.getInstance().refreshToken(1);
                  }
                  googleValidateFail(
                    disptach,
                    getMultiLingualData(error?.response?.data?.errors[0])
                  );
                  reject(getMultiLingualData(error?.response?.data?.errors[0]));
                });
            });
        } else {
          Singleton.getInstance()
            .getDataSecure(constants.ACCESS_TOKEN)
            .then((res) => {
              CoinCultApi.post(
                END_POINT.GOOGLE_AUTH_DISABLE_API_POST,
                {
                  code: gValidateCode,
                },

                {
                  headers: {
                    Authorization: res,
                  },
                }
              )
                .then((response) => {
                  CoinCultApi.get(END_POINT.GET_USER_ME, {
                    headers: {
                      Authorization: JSON.parse(res),
                    },
                  })
                    .then((response) => {
                      Singleton.getInstance()
                        .saveData(
                          constants.USER_DATA,
                          JSON.stringify(response?.data)
                        )
                        .then((res) => {
                          googleValidateSuccess(
                            disptach,
                            response?.data,
                            refProps
                          );
                          resolve(response?.data);
                        });
                    })
                    .catch((error) => {
                      if (error?.response?.status == "401") {
                        Singleton.getInstance().isLoginSuccess = true;
                        Singleton.getInstance().refreshToken(1);
                        googleValidateFail(disptach, "");
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
                        googleValidateFail(disptach, "");
                        reject("");
                      } else {
                        googleValidateFail(
                          disptach,
                          getMultiLingualData(error?.response?.data?.errors[0])
                        );
                        reject(
                          getMultiLingualData(error?.response?.data?.errors[0])
                        );
                      }
                    });
                })
                .catch((error) => {
                  if (error?.response?.status == "401") {
                    Singleton.getInstance().isLoginSuccess = true;
                    Singleton.getInstance().refreshToken(1);
                  }
                  googleValidateFail(
                    disptach,
                    getMultiLingualData(error?.response?.data?.errors[0])
                  );
                });
            });
        }
      }
    });
  };
};
// export const disableGoogleAuthUser = ({
//   gValidateCode,
//   gValidatePassword,
//   secretKey,
//   isEnabled,
//   refProps,
//   fromWithdraw,
// }) => {
//   return disptach => {
//     debugger;
//     disptach({type: GOOGLE_VALIDATE_SUBMIT});

//     Singleton.getInstance()
//       .getData(constants.ACCESS_TOKEN)
//       .then(res => {
//         console.log('resssss5555', res);
//         if (isEnabled) {
//           CoinCultApi.post(
//             END_POINT.GOOGLE_AUTH_ENABLE_API_POST,
//             {
//               code: gValidateCode,
//             },
//             {
//               headers: {'X-CSRF-Token': res},
//             },
//             // {
//             //   withCredentials: true,
//             // },
//           )
//             .then(response => {
//               console.log('11111----', response);
//               CoinCultApi.get(
//                 END_POINT.GET_USER_ME,
//                 {
//                   withCredentials: true,
//                 },
//                 {
//                   headers: {'X-CSRF-Token': res},
//                 },
//               )
//                 .then(response => {
//                   console.log('22222--', response);
//                   Singleton.getInstance().checkAuthBack = true;
//                   console.log('Success', response?.data);
//                   Singleton.getInstance()
//                     .saveData(
//                       constants.USER_DATA,
//                       JSON.stringify(response?.data),
//                     )
//                     .then(res => {
//                       googleValidateSuccess(
//                         disptach,
//                         response?.data,
//                         refProps,
//                         fromWithdraw,
//                       );
//                     });
//                 })
//                 .catch(error => {
//                   console.log('Error', error?.response?.data?.errors[0]);
//                   if (error?.response?.status == '401') {
//                     Actions.replace('Welcome');
//                     Alert.alert(constants.APP_NAME, 'Session expired');
//                     Singleton.getInstance().saveEmptyDefault();
//                   }
//                   googleValidateFail(
//                     disptach,
//                     getMultiLingualData(error?.response?.data?.errors[0]),
//                   );
//                 });
//             })
//             .catch(error => {
//               console.log('Error-----', error);
//               if (error?.response?.status == '401') {
//                 Actions.replace('Welcome');
//                 Alert.alert(constants.APP_NAME, 'Session expired');
//                 Singleton.getInstance().saveEmptyDefault();
//               }
//               googleValidateFail(
//                 disptach,
//                 getMultiLingualData(error?.response?.data?.errors[0]),
//               );
//             });
//         } else {
//           console.log('dddd+ :' + res);
//           console.log('dddd+ :' + gValidateCode);
//           CoinCultApi.post(
//             END_POINT.GOOGLE_AUTH_DISABLE_API_POST,
//             {
//               code: gValidateCode,
//             },
//             // {
//             //   withCredentials: true,
//             // },
//             {
//               headers: {
//                 Authentication: res,
//               },
//             },
//           )
//             .then(response => {
//               CoinCultApi.get(
//                 END_POINT.GET_USER_ME,
//                 {
//                   withCredentials: true,
//                 },
//                 {
//                   headers: {'X-CSRF-Token': res},
//                 },
//               )
//                 .then(response => {
//                   console.log('Success', response?.data);
//                   Singleton.getInstance()
//                     .saveData(
//                       constants.USER_DATA,
//                       JSON.stringify(response?.data),
//                     )
//                     .then(res => {
//                       googleValidateSuccess(disptach, response?.data, refProps);
//                     });
//                 })
//                 .catch(error => {
//                   console.log('Error', error?.response?.data?.errors[0]);
//                   if (error?.response?.status == '401') {
//                     Actions.replace('Welcome');
//                     Alert.alert(constants.APP_NAME, 'Session expired');
//                     Singleton.getInstance().saveEmptyDefault();
//                   }
//                   googleValidateFail(
//                     disptach,
//                     getMultiLingualData(error?.response?.data?.errors[0]),
//                   );
//                 });
//             })
//             .catch(error => {
//               console.log('Error', error?.response?.data?.errors[0]);
//               if (error?.response?.status == '401') {
//                 Actions.replace('Welcome');
//                 Alert.alert(constants.APP_NAME, 'Session expired');
//                 Singleton.getInstance().saveEmptyDefault();
//               }
//               googleValidateFail(
//                 disptach,
//                 getMultiLingualData(error?.response?.data?.errors[0]),
//               );
//             });
//         }
//       });
//   };
// };
const googleValidateFail = (disptach, errorMessage) => {
  disptach({
    type: GOOGLE_AUTH_VALIDATE_FAIL,
    payload: errorMessage,
  });
};
const googleValidateSuccess = (disptach, details, refProps, fromWithdraw) => {
  disptach({
    type: GOOGLE_AUTH_VALID_DETAIL_SUCCESS,
    payload: details,
  });
  showMessage({
    message: "2FA enabled",
    backgroundColor: ThemeManager.colors.tabBottomBorder,
    autoHide: true,
    duration: 5000,
    type: "success",
    icon: "success",
    position: "right",
    style: {
      marginHorizontal: 10,
      borderRadius: 10,
      marginTop: Platform.OS == "android" ? 10 : 40,
    },
  });
  Actions.replace("Main");

  // if (fromWithdraw) {
  //   refProps.navigation.navigate('WithdrawCrypto', {refreshWithdrawCrypto: {}});
  // } else {
  //   refProps.navigation.navigate('Settings', {refreshSecurity: {}});
  // }

  // Actions.pop('SettingSecurity', { refreshSecurity: {} })
};
