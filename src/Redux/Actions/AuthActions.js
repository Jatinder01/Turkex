import { Actions } from "react-native-router-flux";
import { CoinCultApi } from "../../api";
import { APIClient } from "../../api/APIClient";
import END_POINT from "../../EndPoints";
import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_OTP_FAIL,
  LOGIN_USER,
  LOGIN_FORM_UPDATE,
  LOGIN_USER_ENABLE_AUTH,
  LOGOUT_USER_SUCCESS,
  EMPTY_CAPTCHA,
  UPDATE_USER_DATA,
  GET_PROFILE_1,
  AUTH_FIELD_VALIDATE,
  GAUTH_RESET,
  LOGOUT_USER_FAIL,
  //email
  LOGIN_EMAIL_OTP_SUCCESS,
  LOGIN_EMAIL_OTP_FAIL,
  LOGIN_EMAIL_OTP_SUBMIT,
  LOGIN_EMAIL_OTP_RESET,
  //phone
  LOGIN_PHONE_OTP_SUCCESS,
  LOGIN_PHONE_OTP_FAIL,
  LOGIN_PHONE_OTP_SUBMIT,
  LOGIN_PHONE_OTP_RESET,
  //first
  LOGIN_USER_FIRST_FAIL,
  LOGIN_USER_FIRST_SUCCESS,
  LOGIN_USER_FIRST_SUBMIT,
} from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Alert, NativeModules } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { showMessage, hideMessage } from "react-native-flash-message";
import { ThemeManager } from "../../../ThemeManager";
import { reject } from "lodash";
const RNFS = require("react-native-fs");
export const loginFormUpdate = ({ prop, value }) => {
  return {
    type: LOGIN_FORM_UPDATE,
    payload: { prop, value },
  };
};
/**************************************Update changeThemeAction ****************************************************/
export const changeThemeAction = (value) => {
  return {
    type: "CHANGE_THEME",
    payload: value,
  };
};
/**************************************Update changeLanguageAction ****************************************************/
export const changeLanguageAction = (value) => {
  return {
    type: "CHANGE_LANGUAGE",
    payload: value,
  };
};
/**************************************Logout and reset ****************************************************/
export const logoutAndReset = () => {
  return {
    type: "LOGOUT",
  };
};
/************************EMPTY Captcha---- */
export const resetCaptcha = () => {
  return {
    type: EMPTY_CAPTCHA,
  };
};
/**************************************Reset GAuth****************************************************/
export const resetGAuth = () => {
  return {
    type: GAUTH_RESET,
  };
};
export const resetResendEmailotp = () => {
  return {
    type: LOGIN_EMAIL_OTP_RESET,
  };
};
/********** */
export const loginUserFailCheck = (errorMessage) => {
  return {
    type: LOGIN_USER_FAIL,
    payload: errorMessage,
  };
};
const clearAsyncStorage = async () => {
  AsyncStorage.clear();
};
/**************************************Logout user****************************************************/
export const logoutUser = () => (dispatch) => {
  console.log(
    "Singleton.getInstance().deviceToken=-=-",
    Singleton.getInstance().deviceToken
  );
  return new Promise((resolve, reject) => {
    Singleton.getInstance()
      .getDataSecure(constants.REFRESH_TOKEN)
      .then((res) => {
        console.log("REFRESH_TOKEN=-=-==>>>", res);
        let deviceKey =
          Singleton.getInstance().deviceToken === ""
            ? "abc"
            : Singleton.getInstance().deviceToken;
        CoinCultApi.delete(
          END_POINT.REFRESH_SESSION +
            "?device_id=" +
            deviceKey +
            "&device_type=" +
            Platform.OS,
          // {
          //   // login_device: {
          //   device_id:
          //     Singleton.getInstance().deviceToken === ""
          //       ? "abc"
          //       : Singleton.getInstance().deviceToken,
          //   device_type: Platform.OS,
          //   // },
          // },
          {
            headers: {
              contentType: "application/json",
              // 'X-CSRF-Token': res,
              "refresh-token": JSON.parse(res),
            },
          }
        )
          // APIClient.getInstance()
          //   .delete(END_POINT.REFRESH_SESSION, res)
          .then((response) => {
            console.log("REFRESH_SESSION---=--=>>", response);
            const path = RNFS.CachesDirectoryPath;
            // console.log("REFRESH_SESSION---=path--=>>", path);

            Singleton.getInstance().saveEmptyDefault();
            Singleton.getInstance()
              .deleteOfflineStepsData()
              .then((res) => {
                dispatch(logoutAndReset());
              });
            Singleton.getInstance().clearStorage();
            if (Platform.OS == "android") {
              // console.log("cache deleted0----", path);
              var ClrStorageModule = NativeModules.ClrStorageModule;

              ClrStorageModule.clearApplicationData();
            }
            // console.log("cache deleted=======", path);
            Actions.currentScene != "Login" && Actions.reset("Login");
            logoutUserSuccess(dispatch, response?.data);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log(
              "REFRESH_SESSION error=-=-=-=->>>",
              JSON.stringify(error)
            );
            Singleton.getInstance().saveEmptyDefault();
            Singleton.getInstance()
              .deleteOfflineStepsData()
              .then((res) => {
                dispatch(logoutAndReset());
              });

            Singleton.getInstance().clearStorage();
            Actions.currentScene != "Login" && Actions.reset("Login");
            logoutUserFail(
              dispatch,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};
export const deleteUserDeviceToken = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    let deviceKey =
      Singleton.getInstance().deviceToken === ""
        ? "abc"
        : Singleton.getInstance().deviceToken;
    CoinCultApi.delete(
      END_POINT.DELETE_USER_DEVICE_TOKEN +
        "?device_id=" +
        deviceKey +
        "&device_type=" +
        Platform.OS,

      {
        headers: {
          contentType: "application/json",
          // 'X-CSRF-Token': res,
          // "refresh-token": JSON.parse(res),
        },
      }
    )

      .then((response) => {
        const path = RNFS.CachesDirectoryPath;
        // console.log("deleteUserDeviceToken---=path--=>>", path);

        Singleton.getInstance().saveEmptyDefault();
        Singleton.getInstance()
          .deleteOfflineStepsData()
          .then((res) => {
            dispatch(logoutAndReset());
          });
        Singleton.getInstance().clearStorage();
        if (Platform.OS == "android") {
          // console.log("cache deleted0----", path);
          var ClrStorageModule = NativeModules.ClrStorageModule;

          ClrStorageModule.clearApplicationData();
        }
        // console.log("cache deleted=======", path);
        Actions.currentScene != "Login" && Actions.reset("Login");
        logoutUserSuccess(dispatch, response?.data);
        resolve(response?.data);
      })
      .catch((error) => {
        console.log("REFRESH_SESSION error=-=-=-=->>>", JSON.stringify(error));
        Singleton.getInstance().saveEmptyDefault();
        Singleton.getInstance()
          .deleteOfflineStepsData()
          .then((res) => {
            dispatch(logoutAndReset());
          });

        Singleton.getInstance().clearStorage();
        Actions.currentScene != "Login" && Actions.reset("Login");
        logoutUserFail(
          dispatch,
          getMultiLingualData(error?.response?.data?.errors[0])
        );
        reject(getMultiLingualData(error?.response?.data?.errors[0]));
      });
    // });
  });
};
export const deleteUserDevice = () => {
  return new Promise((resolve, reject) => {
    let deviceKey =
      Singleton.getInstance().deviceToken === ""
        ? "abc"
        : Singleton.getInstance().deviceToken;
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        console.log("deleteUserDevice=-+++=-->>", JSON.parse(res));

        let userData = JSON.parse(res);
        console.log("userData=-=-=-=++++-=-==---->>", userData.email);

        CoinCultApi.delete(
          END_POINT.DELETE_USER_DEVICE_TOKEN +
            "?device_id=" +
            deviceKey +
            "&device_type=" +
            Platform.OS +
            "&email=" +
            userData?.email,

          {
            headers: {
              contentType: "application/json",
              // 'X-CSRF-Token': res,
              // "refresh-token": JSON.parse(res),
            },
          }
        )

          .then((response) => {
            const path = RNFS.CachesDirectoryPath;
            console.log("deleteUserDeviceToken---=path-ee-=>>", path);

            Singleton.getInstance().saveEmptyDefault();
            Singleton.getInstance()
              .deleteOfflineStepsData()
              .then((res) => {
                // console.log("cache deleted0--ee--", path);
                // dispatch(logoutAndReset());
              });
            Singleton.getInstance().clearStorage();
            if (Platform.OS == "android") {
              // console.log("cache deleted0--ee--", path);
              var ClrStorageModule = NativeModules.ClrStorageModule;

              ClrStorageModule.clearApplicationData();
            }
            // console.log("cache deleted====ee===", path);
            Actions.currentScene != "Login" && Actions.reset("Login");
            // logoutUserSuccess(dispatch, response?.data);
            resolve(response?.data);
          })
          .catch((error) => {
            console.log(
              "REFRESH_SESSION error=-=-eee=-=->>>",
              JSON.stringify(error)
            );
            Singleton.getInstance().saveEmptyDefault();
            Singleton.getInstance()
              .deleteOfflineStepsData()
              .then((res) => {
                // dispatch(logoutAndReset());
              });

            Singleton.getInstance().clearStorage();
            Actions.currentScene != "Login" && Actions.reset("Login");

            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          });
      });
  });
};
/**************************************Get Profile info****************************************************/
export const getProfile1 = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch({ type: GET_PROFILE_1 });

      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          if (isLogin == "true") {
            Singleton.getInstance()
              .getDataSecure(constants.ACCESS_TOKEN)
              .then((res) => {
                APIClient.getInstance()
                  .getData(END_POINT.GET_USER_ME, res)
                  .then((userData) => {
                    geProfileSuccess(dispatch, userData);
                    Singleton.getInstance().saveData(
                      constants.USER_DATA,
                      JSON.stringify(userData)
                    );
                    resolve(userData);
                  })
                  .catch((error) => {
                    console.log(
                      "getProfile1=-=-=->>>>>error",
                      JSON.stringify(error)
                    );

                    if (error?.status == "401") {
                      Singleton.getInstance().isLoginSuccess = true;
                      // Singleton.getInstance().refreshToken(1);
                      Singleton.getInstance().refreshToken(0);
                      reject("");
                    } else if (
                      error?.status == "403" ||
                      error?.status == "500" ||
                      error?.status == "503" ||
                      error?.status == "504"
                    ) {
                      reject("Server down, please try after sometime");
                    } else {
                      let errMsg = JSON.parse(error?.bodyString);
                      console.log("getProfile1=-=-=->>>>>error122", errMsg[0]);
                      reject(errMsg[0].message);
                    }
                  });
              });
          }
        });
    });
  };
};
/**************************************Get Profile info****************************************************/
export const getProfile = (dispatch) => {
  Singleton.getInstance()
    .getData(constants.IS_LOGIN)
    .then((isLogin) => {
      if (isLogin == "true") {
        Singleton.getInstance()
          .getDataSecure(constants.ACCESS_TOKEN)
          .then((res) => {
            APIClient.getInstance()
              .getData(END_POINT.GET_USER_ME, res)
              .then((userData) => {
                // console.log("getProfile=-=-=->>>>>", userData);
                geProfileSuccess(dispatch, userData);
                Singleton.getInstance().saveData(
                  constants.USER_DATA,
                  JSON.stringify(userData)
                );
              })
              .catch((error) => {
                console.log("getProfile=-=-=error->>>>>", error);
                let errMsg = JSON.parse(error?.bodyString);
                if (error?.status == "401") {
                  Singleton.getInstance().isLoginSuccess = true;
                  Singleton.getInstance().refreshToken(1);
                }
              });
          });
      }
    });
};
/************************************** Refresh token****************************************************/
export const refreshTestSession = () => {
  return new Promise((resolve, reject) =>
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        if (isLogin == "true") {
          Singleton.getInstance()
            .getDataSecure(constants.ACCESS_TOKEN)
            .then((res) => {
              APIClient.getInstance()
                .getData(END_POINT.GET_USER_ME, res)
                .then((userData) => {
                  resolve(userData);
                })
                .catch((error) => {
                  console.log(
                    "refreshTestSession=-=-=error->>>>>",
                    JSON.stringify(error)
                  );

                  if (error?.status == "401") {
                    Singleton.getInstance()
                      .refreshToken(0)
                      .then((res) => {
                        console.log(
                          "refreshToken=-=-=res->>>>>",
                          JSON.stringify(res)
                        );
                        resolve(res);
                      })
                      .catch((err) => {
                        console.log("refreshTestSession=-=-=err->>>>>", err);
                        deleteUserDevice();
                        reject("failed to create session" + err);
                      });
                  }
                });
            });
        } else {
          reject("Not Login");
        }
      })
  );
};
/************************************** Session check****************************************************/
export const testSession = () => {
  return (dispatch) =>
    new Promise((resolve, reject) =>
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          if (isLogin == "true") {
            Singleton.getInstance()
              .getDataSecure(constants.ACCESS_TOKEN)
              .then((res) => {
                APIClient.getInstance()
                  .get(END_POINT.GET_USER_ME, res)
                  .then((userData) => {
                    geProfileSuccess(dispatch, userData);
                    Singleton.getInstance().saveData(
                      constants.USER_DATA,
                      JSON.stringify(userData)
                    );
                    resolve(userData);
                  })
                  .catch((error) => {
                    console.log(
                      "getProfile1=-=-=error->>>>>",
                      JSON.stringify(error)
                    );
                    // let err = JSON.stringify(error);
                    // console.log("refreshToken=-=-=->err>333>>>", err.errors[0]);
                    // console.log(
                    //   "refreshToken=-=-=->err>444>>>",
                    //   err.errors[0] === "authz.user_not_active"
                    // );
                    if (error[0]?.code == "401") {
                      Singleton.getInstance()
                        .refreshToken(0)
                        .then((res) => {
                          console.log(
                            "refreshToken=-=-=->res>>>>",
                            JSON.stringify(res)
                          );
                          resolve(res);
                        })
                        .catch((err) => {
                          console.log(
                            "refreshToken=-=-=->err>>>>",
                            JSON.stringify(err)
                          );
                          Singleton.getInstance().saveData(
                            constants.IS_LOGIN,
                            "false"
                          );
                          // deleteUserDevice();
                          reject("failed to create session" + err);
                        });
                    } else if (error[0] === "authz.user_not_active") {
                      console.log(
                        "refreshToken=-=error[0]-=->err>333>>>",
                        error[0]
                      );
                      reject("failed to create session" + error[0]);
                    }
                  });
              });
          } else {
            reject("Not Login");
          }
        })
    );
};
/************************************** Resend email phone otp****************************************************/
const resendEmailPHoneOtp = (dispatch, loginEmail, phoneNumber) => {
  dispatch({ type: LOGIN_EMAIL_OTP_SUBMIT });

  let body = { email: loginEmail };
  let bodyPhone = { phone_number: phoneNumber, email: loginEmail };

  APIClient.getInstance()
    .postWithoutToken(END_POINT.RESEND_REGISTER_EMAIL_OTP, body)
    .then((response) => {
      otpSentFail(dispatch, "");
      loginUserFail(dispatch, "");
      if (response.status == 201) {
        otpSentSuccess(dispatch, response);
        showMessage({
          message: "OTP sent on email successfully.",
          backgroundColor: ThemeManager.colors.tabBottomBorder,
          autoHide: true,
          duration: 1000,
          type: "success",
          icon: "success",
          position: "right",
          style: {
            marginHorizontal: 10,
            borderRadius: 10,
            marginTop: Platform.OS == "android" ? 10 : 40,
          },
        });
        Actions.currentScene != "LoginVerification" &&
          Actions.push("LoginVerification", {
            loginEmail: loginEmail,
            phoneNumber: phoneNumber,
          });
      }
    })
    .catch((error) => {
      console.log(
        "error=-=-=RESEND_REGISTER_EMAIL_OTP-11=-=-=-=--->>",
        JSON.stringify(error)
      );
      otpSentFail(dispatch, getMultiLingualData(error?.errors[0]));
      loginUserFail(dispatch, getMultiLingualData(error?.errors[0]));
    });

  APIClient.getInstance()
    .postWithoutToken(END_POINT.RESEND_REGISTER_PHONE_OTP, bodyPhone)
    .then((response) => {
      otpSentPhoneFail(dispatch, "");
      loginUserFail(dispatch, "");
      if (response.status == 201) {
        otpSentPhoneSuccess(dispatch, response);
        showMessage({
          message: "OTP sent on phone successfully.",
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
    })
    .catch((error) => {
      console.log(
        "error=-=-=RESEND_REGISTER_PHONE_OTP-11=-=-=-=--->>",
        JSON.stringify(error)
      );
      otpSentPhoneFail(dispatch, getMultiLingualData(error?.errors[0]));
      loginUserFail(dispatch, getMultiLingualData(error?.errors[0]));
    });
};
/************************************** Resend email phone otp while login ****************************************************/
export const resendEmailPHoneOtpLogin = (loginEmail, phoneNumber) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_EMAIL_OTP_SUBMIT });

    let body = { email: loginEmail };
    let bodyPhone = { phone_number: phoneNumber, email: loginEmail };
    APIClient.getInstance()
      .postWithoutToken(END_POINT.RESEND_REGISTER_EMAIL_OTP, body)
      .then((response) => {
        otpSentFail(dispatch, "");
        loginUserFail(dispatch, "");
        if (response.status == 201) {
          otpSentSuccess(dispatch, response);
          showMessage({
            message: "OTP resent on email successfully.",
            backgroundColor: ThemeManager.colors.tabBottomBorder,
            autoHide: true,
            duration: 1000,
            type: "success",
            icon: "success",
            position: "right",
            style: {
              marginHorizontal: 10,
              borderRadius: 10,
              marginTop: Platform.OS == "android" ? 10 : 40,
            },
          });
          Actions.currentScene != "LoginVerification" &&
            Actions.push("LoginVerification", {
              loginEmail: loginEmail,
              phoneNumber: phoneNumber,
            });
        }
      })
      .catch((error) => {
        console.log("response=-==-error=-=--->>", JSON.stringify(error));
        otpSentFail(dispatch, getMultiLingualData(error?.errors[0]));
        loginUserFail(dispatch, getMultiLingualData(error?.errors[0]));
      });

    APIClient.getInstance()
      .postWithoutToken(END_POINT.RESEND_REGISTER_PHONE_OTP, bodyPhone)
      .then((response) => {
        otpSentPhoneFail(dispatch, "");
        loginUserFail(dispatch, "");
        if (response.status == 201) {
          otpSentPhoneSuccess(dispatch, response);
          showMessage({
            message: "OTP resent on phone successfully.",
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
      })
      .catch((error) => {
        console.log(
          "error=-=-=RESEND_REGISTER_PHONE_OTP-=-=-=-=--->>",
          JSON.stringify(error)
        );
        otpSentPhoneFail(dispatch, getMultiLingualData(error?.errors[0]));
        loginUserFail(dispatch, getMultiLingualData(error?.errors[0]));
      });
  };
};
/************************************** Login user with otp ****************************************************/
export const loginUser = ({
  loginEmail,
  loginPassword,
  gOtpCode,
  gAuthEnable,
  recaptchaCheck,
  recaptchaData,
  phone_number,
  session_type,
  code,
}) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch({ type: LOGIN_USER });

      var params = {};
      if (recaptchaCheck) {
        if (gAuthEnable) {
          if (session_type === "email") {
            params = {
              email: loginEmail,
              password: loginPassword,
              otp_code: gOtpCode,
              authentication_state: "jwt",
              captcha_response: recaptchaData,
              session_type: session_type,
              code: code,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
              },
            };
          } else {
            params = {
              phone_number: phone_number,
              password: loginPassword,
              otp_code: gOtpCode,
              authentication_state: "jwt",
              captcha_response: recaptchaData,
              code: code,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
              },
              session_type: session_type,
            };
          }

          // console.log('print login pararms=-=-=>>>>', params);
        } else {
          if (session_type === "email") {
            params = {
              email: loginEmail,
              password: loginPassword,
              otp_code: gOtpCode,
              captcha_response: recaptchaData,
              authentication_state: "jwt",
              code: code,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
              },
              session_type: session_type,
            };
          } else {
            params = {
              phone_number: phone_number,
              password: loginPassword,
              captcha_response: recaptchaData,
              authentication_state: "jwt",
              otp_code: gOtpCode,
              code: code,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
              },
              session_type: session_type,
            };
          }
        }
        console.log(
          "Singleton.getInstance().deviceToken---->>",
          Singleton.getInstance().deviceToken
        );
        console.log("login params---->>", params);
        APIClient.getInstance()
          .postNoHeader(END_POINT.LOGIN_USER_API_POST, params)

          .then((response) => {
            console.log("response.access_token=-=-=-", response);
            Singleton.getInstance().saveToken(
              "Bearer " + response.access_token
            );
            Singleton.getInstance().accessToken =
              "Bearer " + response.access_token;
            // csrf_token
            if (response.state == "active") {
              Singleton.getInstance()
                .deleteOfflineStepsData()
                .then((re) => {
                  Singleton.getInstance()
                    .saveData(constants.USER_DATA, JSON.stringify(response))
                    .then((res) => {
                      Singleton.getInstance()
                        .saveData(constants.IS_LOGIN, "true")
                        .then((res) => {
                          // Actions.Home();

                          loginUserSuccess(dispatch, response);
                          resolve(response);
                          // Actions.currentScene != "Main" &&
                          //   Actions.reset("Main");
                        });
                    });
                });
            } else {
              if (response?.state == "pending") {
                resolve(response, false);
                emptyCaptcha(dispatch);
                showMessage({
                  message: "OTP sent on email successfully.",
                  backgroundColor: ThemeManager.colors.tabBottomBorder,
                  autoHide: true,
                  duration: 1000,
                  type: "success",
                  icon: "success",
                  position: "right",
                  style: {
                    marginHorizontal: 10,
                    borderRadius: 10,
                    marginTop: Platform.OS == "android" ? 10 : 40,
                  },
                });
                showMessage({
                  message: "OTP sent on phone successfully.",
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
                Actions.currentScene != "LoginVerification" &&
                  Actions.push("LoginVerification", {
                    loginEmail: loginEmail,
                    phoneNumber: phoneNumber,
                  });
                // Alert.alert(
                //   constants.APP_NAME,
                //   "Your email address and phone number is not verified.Please verify your phone number and email address and then try to login again.",
                //   [
                //     {
                //       text: "RESEND",
                //       onPress: () => {
                //         resendEmailPHoneOtp(
                //           dispatch,
                //           response?.email,
                //           response?.phones[0]?.number
                //         );
                //       },
                //     },
                //     {
                //       text: "CANCEL",
                //       onPress: () => loginUserFail(dispatch, ""),
                //       style: "cancel",
                //     },
                //   ],
                //   { cancelable: false }
                // );
              } else if (response?.state == "banned") {
                resolve(response);
                emptyCaptcha(dispatch);
                loginUserFail(dispatch, "Your account is banned by admin");
              }
            }
          })
          .catch((error) => {
            console.log("loginUser error-0-0-0>>>", error?.errors[0]);
            if (error?.errors[0] == "identity.session.missing_otp") {
              loginUserEnterAuth(dispatch, true);
            } else if (error?.errors[0] == "session.code_not_match") {
              // loginUserEnterAuth(dispatch, true);
              loginUserOtpFail(dispatch, getMultiLingualData(error?.errors[0]));
            } else {
              if (error?.errors[0] == "identity.captcha.verification_failed") {
                // loginUserFail(dispatch, 'Captcha_Session_failed');
                loginUserFail(dispatch, getMultiLingualData(error?.errors[0]));
              }
              loginUserFail(dispatch, getMultiLingualData(error?.errors[0]));
            }
            // loginUserFail(dispatch, getMultiLingualData(error?.errors[0]));
            reject(error?.errors[0]);
          }); //Call API
      }
    });
  };
};
/************************************** Login user check exist or not ****************************************************/
export const loginUserFirst = ({
  loginEmail,
  loginPassword,
  gOtpCode,
  gAuthEnable,
  recaptchaCheck,
  recaptchaData,
  phone_number,
  session_type,
}) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch({ type: LOGIN_USER_FIRST_SUBMIT });

      var params = {};
      if (recaptchaCheck) {
        if (gAuthEnable) {
          if (session_type === "email") {
            params = {
              email: loginEmail,
              password: loginPassword,
              otp_code: gOtpCode,
              authentication_state: "jwt",
              captcha_response: recaptchaData,
              session_type: session_type,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
              },
            };
          } else {
            params = {
              phone_number: phone_number,
              password: loginPassword,
              otp_code: gOtpCode,
              authentication_state: "jwt",
              captcha_response: recaptchaData,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
              },
              session_type: session_type,
            };
          }

          console.log("print login pararms=-=-=>>>>", params);
        } else {
          if (session_type === "email") {
            params = {
              email: loginEmail,
              password: loginPassword,
              captcha_response: recaptchaData,
              authentication_state: "jwt",
              session_type: session_type,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
              },
            };
          } else {
            params = {
              phone_number: phone_number,
              password: loginPassword,
              captcha_response: recaptchaData,
              authentication_state: "jwt",
              session_type: session_type,
              login_device: {
                device_id:
                  Singleton.getInstance().deviceToken === ""
                    ? "abc"
                    : Singleton.getInstance().deviceToken,
                device_type: Platform.OS,
                session_type: session_type,
              },
            };
          }
        }

        APIClient.getInstance()
          .postNoHeaderFirst(END_POINT.LOGIN_API_FIRST, params)

          .then((response) => {
            console.log("LOGIN_API_FIRSTresponse---", JSON.stringify(response));
            console.log(
              "LOGIN_API_FIRSTresponse---",
              JSON.stringify(response?.state)
            );

            if (response?.state == "pending") {
              resolve(response, false);
              emptyCaptcha(dispatch);
              showMessage({
                message: "OTP sent successfully on your phone and email.",
                backgroundColor: ThemeManager.colors.tabBottomBorder,
                autoHide: true,
                duration: 1000,
                type: "success",
                icon: "success",
                position: "right",
                style: {
                  marginHorizontal: 10,
                  borderRadius: 10,
                  marginTop: Platform.OS == "android" ? 10 : 40,
                },
              });
              // showMessage({
              //   message: "OTP sent on phone successfully.",
              //   backgroundColor: ThemeManager.colors.tabBottomBorder,
              //   autoHide: true,
              //   duration: 3000,
              //   type: "success",
              // });
              Actions.currentScene != "LoginVerification" &&
                Actions.push("LoginVerification", {
                  loginEmail: loginEmail,
                  phoneNumber: phone_number,
                  dataLogin: response,
                });
              loginUserFirstSuccess(dispatch, response);
              resolve(response);
            } else {
              loginUserFirstSuccess(dispatch, response);
              resolve(response);
            }
          })
          .catch((error) => {
            console.log("LOGIN_API_FIRSTerror-", JSON.stringify(error));
            if (error == "timeout") {
              reject(error);
              loginUserFirstFail(dispatch, error);
            } else {
              if (error?.errors[0] == "identity.session.missing_otp") {
                loginUserFirstFail(dispatch, true);
              } else {
                if (error?.errors[0]) {
                  loginUserFirstFail(
                    dispatch,
                    getMultiLingualData(error?.errors[0])
                  );
                } else {
                  console.log("LOGIN_API_FIRST success=-=error222-", error);
                  loginUserFirstFail(dispatch, error);
                }
              }
            }
            reject(error);
          }); //Call API
      }
    });
  };
};

export const ChangePhoneNumber = (email, number, country) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      //https://exchange2.stage-evoeuro.com/api/v2/barong/identity/users/edit/phone_number?email=sam_cool@antiersolutions.com&new_phone_number=919090907777
      var params = { email: email, new_phone_number: number, country: country };
      console.log("alskdaksdaklsd", params);
      APIClient.getInstance()
        .postWithoutToken(END_POINT.CHANGE_PHONE_NUMBER, params)
        .then((response) => {
          console.log("ChangePhoneNumber asdasdasdasdasdasdasdasd", response);
          if (response.status == 201) {
            showMessage({
              message: "OTP code sent successfully on your new phone number.",
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
            resolve(true);
          }
        })
        .catch((error) => {
          console.log(
            "ChangePhoneNumber=-==-error=-=--->>",
            JSON.stringify(error)
          );
          Singleton.getInstance().showError(
            getMultiLingualData(error?.errors[0])
          );
          reject(getMultiLingualData(error?.errors[0]));
          // showMessage({
          //   message: getMultiLingualData(error?.errors[0]),
          //   backgroundColor: ThemeManager.colors.tabBottomBorder,
          //   autoHide: true,
          //   duration: 3000,
          //   type: "success",
          //   icon: "success",
          //   position: "right",
          //   style: {
          //     marginHorizontal: 10,
          //     borderRadius: 10,
          //     marginTop: Platform.OS == "android" ? 10 : 40,
          //   },
          // });
        });
    });
  };
};

const authUserValidationFailed = (disptach, prop, value) => {
  disptach({
    type: AUTH_FIELD_VALIDATE,
    payload: { prop, value },
  });
};

const geProfileSuccess = (dispatch, user) => {
  dispatch({
    type: UPDATE_USER_DATA,
    payload: user,
  });
};

const loginUserFail = (dispatch, errorMessage) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: errorMessage,
  });
};

const loginUserOtpFail = (dispatch, errorMessage) => {
  dispatch({
    type: LOGIN_USER_OTP_FAIL,
    payload: errorMessage,
  });
};
const otpSentFail = (dispatch, errorMessage) => {
  dispatch({
    type: LOGIN_EMAIL_OTP_FAIL,
    payload: errorMessage,
  });
};
const otpSentPhoneFail = (dispatch, errorMessage) => {
  dispatch({
    type: LOGIN_PHONE_OTP_FAIL,
    payload: errorMessage,
  });
};
const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user,
  });
};
const loginUserFirstSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_FIRST_SUCCESS,
    payload: user,
  });
};
const loginUserFirstFail = (dispatch, errorMessage) => {
  dispatch({
    type: LOGIN_USER_FIRST_FAIL,
    payload: errorMessage,
  });
};
const emptyCaptcha = (dispatch) => {
  dispatch({
    type: EMPTY_CAPTCHA,
  });
};
const logoutUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGOUT_USER_SUCCESS,
    payload: user,
  });
};
const logoutUserFail = (dispatch, errorMessage) => {
  dispatch({
    type: LOGOUT_USER_FAIL,
    payload: errorMessage,
  });
};
const otpSentSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_EMAIL_OTP_SUCCESS,
    payload: user,
  });
};
const otpSentPhoneSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_PHONE_OTP_SUCCESS,
    payload: user,
  });
};
const loginUserEnterAuth = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_ENABLE_AUTH,
    payload: user,
  });
};
