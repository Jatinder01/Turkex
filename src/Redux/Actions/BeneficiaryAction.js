import { Actions } from "react-native-router-flux";
import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import * as constants from "../../Constants";
import {
  BENIFI_DETAILS_SUBMIT,
  BENIFI_DETAILS_FORM_UPDATE,
  BENIFI_DETAILS_FAIL,
  BENIFI_DETAILS_SUCCESS,
  RESET_BENIFICIARY_FORM,
  BENIFI_LIST_DETAILS_SUCCESS,
  DELETE_BENIFICIARY_SUBMIT,
  FAIL_DELETE_BENIFICIARY,
  SUCCESS_DELETE_BENIFICIARY,
  RESET_DELETE_BENIFICIARY,
  //activate beneficiary  otp send
  ACTIVATE_OTP_SUBMIT,
  ACTIVATE_OTP_SUCCESS,
  ACTIVATE_OTP_FAIL,
  ACTIVATE_OTP_RESET,
} from "./types";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Alert, Platform } from "react-native";
import Singleton from "../../Singleton";

import { getMultiLingualData } from "../../../Utils";
import { ThemeManager } from "../../../ThemeManager";
import { APIClient } from "../../api";

export const benificiaryFormUpdate = ({ prop, value }) => {
  return {
    type: BENIFI_DETAILS_FORM_UPDATE,
    payload: { prop, value },
  };
};
export const resetActivateOtpMail = () => {
  return {
    type: ACTIVATE_OTP_RESET,
  };
};
export const resetBenificiaryForm = () => {
  return {
    type: RESET_BENIFICIARY_FORM,
  };
};
export const resetDeleteBenificiaryForm = () => {
  return {
    type: RESET_DELETE_BENIFICIARY,
  };
};
/************************************** Delete beneficiary ****************************************************/
export const deleteBenificiary =
  ({ beniId, otp }) =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: DELETE_BENIFICIARY_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.delete(
            END_POINT.DELETE_BENIFICIARY_API + beniId + "?otp=" + otp,

            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              deleteBenificiarySuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                deleteDetailsSubmitFail(dispatch, "");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                reject("");
                deleteDetailsSubmitFail(dispatch, "");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
                deleteDetailsSubmitFail(
                  dispatch,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
              }
            });
        });
    });

    //  };
  };
/************************************** Activate beneficiary ****************************************************/
export const activateBenificiary =
  ({ beniId, code }) =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BENIFI_DETAILS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.patch(
            END_POINT.ACTIVATE_BENIFICIARY_API_PATCH + beniId + "/activate",
            {
              pin: `${code}`,
            },
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            });
        });
    });
  };
/************************************** Activate OTP mail beneficiary ****************************************************/

export const activateOtpMailBenificiary =
  ({ beniId }) =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: ACTIVATE_OTP_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.RESEND_BENEFICIARY_PIN_CODE + beniId + "/new",
            null,
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              console.log("activateOtpMailBenificiary=-=-=", response);
              Singleton.getInstance().showMsg(
                "Pin has been sent successfully on your registered email id."
              );
              // showMessage({
              //   message:
              //     "Pin has been sent successfully on your registered email id.",
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

              resolve(response?.data);
            })
            .catch((error) => {
              console.log(
                "activateOtpMailBenificiary=-error=-=",
                JSON.stringify(error)
              );
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }

              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            });
        });
    });
  };
/************************************** resend pin****************************************************/
export const resendPinCodeBenificiary =
  ({ beniId }) =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BENIFI_DETAILS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.RESEND_BENEFICIARY_PIN_CODE + beniId + "/resend",
            null,
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              console.log("resendPinCodeBenificiary=-=-=", response);
              Singleton.getInstance().showMsg(
                "Pin has been resent successfully on your registered email id."
              );
              // showMessage({
              //   message:
              //     "Pin has been resent successfully on your registered email id.",
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

              resolve(response?.data);
            })
            .catch((error) => {
              console.log(
                "resendPinCodeBenificiary=-=-=",
                JSON.stringify(error)
              );

              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }

              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            });
        });
    });
  };
/************************************** get all beneficiary ****************************************************/
export const getAllBenificiary = (currency) => {
  return (dispatch) => {
    dispatch({ type: BENIFI_DETAILS_SUBMIT });

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .getData(END_POINT.GET_ALL_BENIFICIARY_LIST, res)
          .then((response) => {
            getAllBenificiarySuccess(dispatch, response);
          })
          .catch((error) => {
            console.log("error getAllBenificiarySuccess=-=-=>>>", error);
            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              benificiaryDetailsSubmitFail(dispatch, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              benificiaryDetailsSubmitFail(
                disptach,
                "Server down, please try after sometime"
              );
            } else {
              benificiaryDetailsSubmitFail(dispatch, "");
            }
          });
      });
  };
};
/************************************** add new beneficiary ****************************************************/
export const addNewBenificiary =
  ({ beniName, beniAddress, beniDesc, currency, blockchain_key }) =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BENIFI_DETAILS_SUBMIT });
      if (beniName?.length == 0) {
        benificiaryDetailsSubmitFail(dispatch, constants.ENTER_BENI_NAME);
      } else if (beniName?.length < 2) {
        benificiaryDetailsSubmitFail(dispatch, constants.VALID_BENI_NAME);
      } else if (beniAddress?.length == 0) {
        benificiaryDetailsSubmitFail(dispatch, constants.ENTER_BENI_ADDRESS);
      } else if (beniAddress?.length < 10) {
        benificiaryDetailsSubmitFail(dispatch, constants.VALID_BENI_ADDRESS);
      } else {
        const body = {
          currency: currency,
          name: beniName,
          description: beniDesc,
          data: { address: beniAddress },
          blockchain_key: blockchain_key,
          // otp: beniOtp,
        };

        Singleton.getInstance()
          .getDataSecure(constants.ACCESS_TOKEN)
          .then((res) => {
            APIClient.getInstance()
              .post(END_POINT.ADD_BENIFICIARY_DETAILS_POST, body, res)
              .then((response) => {
                benificiaryDetailsSubmitSuccess(dispatch, response);
                resolve(response);
              })
              .catch((error) => {
                console.log(
                  "ADD_BENIFICIARY_DETAILS_POST--error->",
                  JSON.stringify(error)
                );
                if (error?.status == "401") {
                  Singleton.getInstance().isLoginSuccess = true;
                  Singleton.getInstance().refreshToken(1);
                }
                benificiaryDetailsSubmitFail(
                  dispatch,
                  getMultiLingualData(error?.errors[0])
                );
                reject(getMultiLingualData(error?.errors[0]));
              });
          });
      }
    });
  };

const benificiaryDetailsSubmitFail = (dispatch, errorMessage) => {
  dispatch({
    type: BENIFI_DETAILS_FAIL,
    payload: errorMessage,
  });
};
const benificiaryDetailsSubmitSuccess = (dispatch, details) => {
  dispatch({
    type: BENIFI_DETAILS_SUCCESS,
    payload: details,
  });
  showMessage({
    message: "Beneficiary added successfully.",
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
};

const getAllBenificiarySuccess = (dispatch, details) => {
  dispatch({
    type: BENIFI_LIST_DETAILS_SUCCESS,
    payload: details,
  });
};
const deleteBenificiarySuccess = (dispatch, details) => {
  dispatch({
    type: SUCCESS_DELETE_BENIFICIARY,
    payload: details,
  });
};
const deleteDetailsSubmitFail = (dispatch, errorMessage) => {
  dispatch({
    type: FAIL_DELETE_BENIFICIARY,
    payload: errorMessage,
  });
};
