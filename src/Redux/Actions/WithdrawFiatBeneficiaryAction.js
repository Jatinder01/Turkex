import { Actions } from "react-native-router-flux";
import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import * as constants from "../../Constants";
import {
  BENIFI_FIAT_DETAILS_SUBMIT,
  BENIFI_FIAT_DETAILS_FORM_UPDATE,
  BENIFI_FIAT_DETAILS_FAIL,
  BENIFI_FIAT_DETAILS_SUCCESS,
  RESET_FIAT_BENIFICIARY_FORM,
  BENIFI_FIAT_LIST_DETAILS_SUCCESS,
  DELETE_FIAT_BENIFICIARY_SUBMIT,
  FAIL_FIAT_DELETE_BENIFICIARY,
  SUCCESS_FIAT_DELETE_BENIFICIARY,
  RESET_FIAT_DELETE_BENIFICIARY,
  RESEND_FIAT_BENIFICIARY_OTP_SUBMIT,
  RESEND_FIAT_BENIFICIARY_OTP_SUCCESS,
  RESEND_FIAT_BENIFICIARY_OTP_FAIL,
  BENIFI_FIAT_ACTIVATE_FAIL,
} from "./types";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Alert, Platform } from "react-native";
import Singleton from "../../Singleton";

import { getMultiLingualData } from "../../../Utils";
import { ThemeManager } from "../../../ThemeManager";

export const beneficiaryFiatFormUpdate = ({ prop, value }) => {
  return {
    type: BENIFI_FIAT_DETAILS_FORM_UPDATE,
    payload: { prop, value },
  };
};

export const resetBeneficiaryFiatForm = () => {
  return {
    type: RESET_FIAT_BENIFICIARY_FORM,
  };
};

export const resetDeleteBeneficiaryFiatForm = () => {
  return {
    type: RESET_FIAT_DELETE_BENIFICIARY,
  };
};
/************************************** delete beneficiary ****************************************************/
export const deleteBeneficiaryFiat = (beniId, otp) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: DELETE_FIAT_BENIFICIARY_SUBMIT });
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
            deleteBenificiaryFiatSuccess(dispatch, response?.data);
            resolve(response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              reject("");
              deleteDetailsFiatSubmitFail(dispatch, "");
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
              deleteDetailsFiatSubmitFail(dispatch, "");
            } else {
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              deleteDetailsFiatSubmitFail(
                dispatch,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            }
          });
      });
  });

  //  };
};
/************************************** activate beneficiary fiat ****************************************************/
export const activateBeneficiaryFiat =
  ({ beniId, code }) =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BENIFI_FIAT_DETAILS_SUBMIT });
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
                reject("");
                benificiaryActivateFail(dispatch, "");
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
                benificiaryActivateFail(dispatch, "");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
                benificiaryActivateFail(dispatch, "");
              }
            });
        });
    });

    //  };
  };
/************************************** resend pin beneficiary fiat ****************************************************/
export const resendPinCodeBenificiaryFiat =
  ({ beniId }) =>
  (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: RESEND_FIAT_BENIFICIARY_OTP_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.patch(
            END_POINT.RESEND_BENEFICIARY_PIN_CODE + beniId + "/resend_pin",
            null,
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
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
              resentOtpBenificiarySuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject("");
                resentOtpBenificiaryFail(dispatch, "");
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
                resentOtpBenificiaryFail(dispatch, "");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
                resentOtpBenificiaryFail(dispatch, "");
              }
            });
        });
    });
  };
/************************************** get all beneficiary fiat ****************************************************/
export const getAllBeneficiaryFiat = (currency) => {
  return (dispatch) => {
    dispatch({ type: BENIFI_FIAT_DETAILS_SUBMIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.WITHDRAW_FIAT_BENEFICIARY + currency, {
          headers: {
            Authorization: JSON.parse(res),
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            getAllBenificiaryFiatSuccess(dispatch, response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
            benificiaryDetailsFiatSubmitFail(dispatch, "");
          });
      });
  };
};
/************************************** add new beneficiary fiat ****************************************************/
export const addNewBeneficiaryFiat =
  (currency, name, address, bic) => (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: BENIFI_FIAT_DETAILS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.ADD_WITHDRAW_PAYEE,
            {
              currency: currency,
              name: name,
              data: { address: address, bic: bic },
            },
            {
              headers: {
                Authorization: res,
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => {
              benificiaryDetailsFiatSubmitSuccess(dispatch, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }
              benificiaryDetailsFiatSubmitFail(
                dispatch,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            });
        });
    });
  };

const benificiaryDetailsFiatSubmitFail = (dispatch, errorMessage) => {
  dispatch({
    type: BENIFI_FIAT_DETAILS_FAIL,
    payload: errorMessage,
  });
};
const benificiaryDetailsFiatSubmitSuccess = (dispatch, details) => {
  dispatch({
    type: BENIFI_FIAT_DETAILS_SUCCESS,
    payload: details,
  });
  Singleton.getInstance().showMsg("Beneficiary added successfully.");
  // showMessage({
  //   message: "Beneficiary added successfully.",
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
};

const getAllBenificiaryFiatSuccess = (dispatch, details) => {
  dispatch({
    type: BENIFI_FIAT_LIST_DETAILS_SUCCESS,
    payload: details,
  });
};
const deleteBenificiaryFiatSuccess = (dispatch, details) => {
  dispatch({
    type: SUCCESS_FIAT_DELETE_BENIFICIARY,
    payload: details,
  });
};
const benificiaryActivateFail = (dispatch, error) => {
  dispatch({
    type: BENIFI_FIAT_ACTIVATE_FAIL,
    payload: "",
  });
};
const deleteDetailsFiatSubmitFail = (dispatch, errorMessage) => {
  dispatch({
    type: FAIL_FIAT_DELETE_BENIFICIARY,
    payload: errorMessage,
  });
};
const resentOtpBenificiarySuccess = (dispatch, errorMessage) => {
  dispatch({
    type: RESEND_FIAT_BENIFICIARY_OTP_FAIL,
    payload: errorMessage,
  });
};
const resentOtpBenificiaryFail = (dispatch, errorMessage) => {
  dispatch({
    type: RESEND_FIAT_BENIFICIARY_OTP_SUCCESS,
    payload: errorMessage,
  });
};
