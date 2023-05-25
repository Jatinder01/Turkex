import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  MOBILE_VERIFY_FORM_UPDATE,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAIL,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  MOBILE_VERIFY_SUBMIT,
  MOBILE_VERIFY_RESET,
} from "../Actions/types";
import { Alert, Platform } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { strings } from "../../Localization";
import { CoinCultApi } from "../../api";
import { showMessage, hideMessage } from "react-native-flash-message";
import { ThemeManager } from "../../../ThemeManager";

export const mobileVerifyFormUpdate = ({ prop, value }) => {
  return {
    type: MOBILE_VERIFY_FORM_UPDATE,
    payload: { prop, value },
  };
};

export const resetMobileVerifyForm = () => {
  return {
    type: MOBILE_VERIFY_RESET,
  };
};
/************************************** mobile verify otp ****************************************************/
export const submitOtpDetails =
  ({ mobilePhoneCode, mobilePhoneNO, isResend }) =>
  (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: MOBILE_VERIFY_SUBMIT });

      if (mobilePhoneCode?.length <= 0) {
        sendOtpFail(disptach, constants.VALID_PHONE_CODE);
      } else if (mobilePhoneNO?.length < 5) {
        sendOtpFail(disptach, constants.VALID_PHONE_NO);
      } else {
        let params = {
          phone_number: mobilePhoneCode.replace("+", "") + mobilePhoneNO,
          channel: "sms",
        };
        Singleton.getInstance()
          .getDataSecure(constants.ACCESS_TOKEN)
          .then((res) => {
            CoinCultApi.post(
              isResend
                ? END_POINT.RESEND_OTP_API_POST
                : END_POINT.SEND_OTP_API_POST,
              params,
              {
                headers: {
                  contentType: "application/json",
                  Authorization: res,
                },
              }
            )
              .then((response) => {
                showMessage({
                  message: response?.data.message,
                  backgroundColor: ThemeManager.colors.tabBottomBorder,
                  autoHide: true,
                  duration: 4000,
                  type: "success",
                  icon: "success",
                  position: "right",
                  style: {
                    marginHorizontal: 10,
                    borderRadius: 10,
                    marginTop: Platform.OS == "android" ? 10 : 40,
                  },
                });
                sendOtpSuccess(disptach, response?.data);
                resolve(response?.data);
                // resolve(true)
              })
              .catch((error) => {
                if (error?.response?.status == "401") {
                  Singleton.getInstance().isLoginSuccess = true;
                  Singleton.getInstance().refreshToken(1);
                  sendOtpFail(disptach, "");
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
                  sendOtpFail(disptach, "");
                  reject("");
                } else {
                  sendOtpFail(
                    disptach,
                    getMultiLingualData(error?.response?.data?.errors[0])
                  );
                  reject(getMultiLingualData(error?.response?.data?.errors[0]));
                }
              });
          });

        // End API
      }
    });

    // };
  };
/************************************** mobile verify mobile number otp ****************************************************/
export const verifyMobileNumberWithOTP = ({
  mobilePhoneCode,
  mobilePhoneNO,
  mobileOtp,
  forEdit,
  refProps,
}) => {
  return (disptach) => {
    disptach({ type: MOBILE_VERIFY_SUBMIT });
    // Call API
    if (mobileOtp?.length < 5) {
      mobileVerifyFail(disptach, constants.VALID_OTP_CODE);
    } else {
      var ss = {
        phone_code: mobilePhoneCode,
        phone_number: mobilePhoneCode + mobilePhoneNO,
        verification_code: mobileOtp,
      };
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.VERIFY_OTP_API_POST,
            {
              phone_code: mobilePhoneCode,
              phone_number: mobilePhoneCode + mobilePhoneNO,
              verification_code: mobileOtp,
            },
            {
              headers: {
                ContentType: "application/json",
                Authorization: JSON.parse(res),
              },
            }
          )
            .then((response) => {
              CoinCultApi.get(END_POINT.GET_USER_ME, {
                headers: {
                  contentType: "application/json",
                  Authorization: JSON.parse(res),
                },
              })
                .then((userData) => {
                  Singleton.getInstance()
                    .saveData(
                      constants.USER_DATA,
                      JSON.stringify(userData.data)
                    )
                    .then((res) => {
                      mobileVerifySuccess(disptach, userData.data);
                    });
                })
                .catch((error) => {
                  if (error?.response?.status == "401") {
                    Singleton.getInstance().isLoginSuccess = true;
                    Singleton.getInstance().refreshToken(1);
                  }
                });
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }
              mobileVerifyFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    }
    // End API
  };
};

const sendOtpFail = (disptach, errorMessage) => {
  disptach({
    type: SEND_OTP_FAIL,
    payload: errorMessage,
  });
};

const sendOtpSuccess = (disptach, response) => {
  disptach({
    type: SEND_OTP_SUCCESS,
    payload: response,
  });
};

const mobileVerifyFail = (disptach, errorMessage) => {
  disptach({
    type: VERIFY_OTP_FAIL,
    payload: errorMessage,
  });
};

const mobileVerifySuccess = (disptach, response) => {
  disptach({
    type: VERIFY_OTP_SUCCESS,
    payload: response,
  });
  Actions.replace("Verification");
};

const mobileVerifySuccessEdit = (disptach, response, refProps) => {
  disptach({
    type: VERIFY_OTP_SUCCESS,
    payload: response,
  });
  refProps.navigation.navigate("Profile", { refresh: {} });
  // Actions.pop({ refresh: {} })
};
