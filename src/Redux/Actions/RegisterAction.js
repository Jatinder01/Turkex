import { Actions } from "react-native-router-flux";
import { useDispatch, useSelector } from "react-redux";
import { CoinCultApi } from "../../api/CoinCultApi";
import END_POINT from "../../EndPoints";
import {
  REGISTER_FORM_UPDATE,
  EMAIL_REGISTER_CHANGED,
  PASSWORD_REGISTER_CHANGED,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER,
  RESET_REGISTER,
  REGISTER_FIELD_VALIDATE,
  //otp verfy
  REGISTER_EMAIL_VERIFY_SUCCESS,
  REGISTER_EMAIL_VERIFY_FAIL,
  REGISTER_EMAIL_VERIFY_RESET,
  REGISTER_EMAIL_VERIFY_UPDATE,
  REGISTER_EMAIL_VERIFY_SUBMIT,
  //resend otp
  RESEND_EMAIL_OTP_SUCCESS,
  RESEND_EMAIL_OTP_SUBMIT,
  RESEND_EMAIL_OTP_FAIL,
  RESEND_EMAIL_OTP_RESET,
  RESEND_EMAIL_OTP_UPDATE,

  //resend phone otp
  RESEND_PHONE_OTP_SUCCESS,
  RESEND_PHONE_OTP_SUBMIT,
  RESEND_PHONE_OTP_FAIL,
  RESEND_PHONE_OTP_RESET,
  RESEND_PHONE_OTP_UPDATE,

  //edit phone number
  EDIT_PHONE_NUMBER_SUCCESS,
  EDIT_PHONE_NUMBER_SUBMIT,
  EDIT_PHONE_NUMBER_FAIL,
  EDIT_PHONE_NUMBER_RESET,
  UPDATE_EDIT_PHONE_NUMBER,
} from "./types";
import * as constants from "../../Constants";
import { Alert, Platform } from "react-native";
import { getMultiLingualData } from "../../../Utils";
import { showMessage } from "react-native-flash-message";
import { ThemeManager } from "../../../ThemeManager";
import Singleton from "../../Singleton";
import { APIClient } from "../../api";
export const registerFormUpdate = ({ prop, value }) => {
  return {
    type: REGISTER_FORM_UPDATE,
    payload: { prop, value },
  };
};
export const resetRegisterForm = () => {
  return {
    type: RESET_REGISTER,
  };
};
export const resetEditPhoneNumber = () => {
  return {
    type: EDIT_PHONE_NUMBER_RESET,
  };
};
export const updateEditPhoneNumber = ({ prop, value }) => {
  return {
    type: UPDATE_EDIT_PHONE_NUMBER,
    payload: { prop, value },
  };
};
export const registerEmailVerifyFormUpdate = ({ prop, value }) => {
  return {
    type: REGISTER_EMAIL_VERIFY_UPDATE,
    payload: { prop, value },
  };
};
export const resetRegisterEmailVerify = () => {
  return {
    type: REGISTER_EMAIL_VERIFY_RESET,
  };
};
export const resetEmailOtp = () => {
  return {
    type: RESEND_EMAIL_OTP_RESET,
  };
};
export const resetPhoneOtp = () => {
  return {
    type: RESEND_PHONE_OTP_RESET,
  };
};
export const registerEmailOtpUpdate = ({ prop, value }) => {
  return {
    type: RESEND_EMAIL_OTP_UPDATE,
    payload: { prop, value },
  };
};

export const registerPhoneOtpUpdate = ({ prop, value }) => {
  return {
    type: RESEND_PHONE_OTP_UPDATE,
    payload: { prop, value },
  };
};
/************************************** register user ****************************************************/
export const registerUser = ({
  registerFirstName,
  registerLastName,
  registerMiddleName,

  registerEmail,
  registerPhoneNumber,
  registerCountry,
  registerCountryCode,
  registerPassword,
  regEmailUpdates,
  recaptchaCheck,
  registerReferralId,

  recaptchaData,
  regMarketing,
  register,
  registerRefID,
}) => {
  return (dispatch) => {
    dispatch({ type: REGISTER_USER });

    if (recaptchaCheck) {
      const body = {
        first_name: registerFirstName,
        last_name: registerLastName,
        middle_name: registerMiddleName,
        phone_number: registerPhoneNumber,
        country_code: registerCountryCode,
        country: registerCountry,
        email: registerEmail,
        password: registerPassword,
        captcha_response: recaptchaData,
        refid: registerRefID,
      };

      APIClient.getInstance()
        .postWithoutTokenRegister(END_POINT.REGISTER_USER_API_POST, body)
        .then((response) => {
          registerUserSuccess(dispatch, response);
        })
        .catch((error) => {
          console.log("response=-=-=-=-=-error=-=--->>", JSON.stringify(error));
          if (error?.status == "422") {
            registerUserFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
          } else {
            registerUserFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
          }
        });
    }
  };
};
/************************************** register email phone verify ****************************************************/
export const registerEmailPhoneVerify = ({
  registerEmail,
  registerEmailOtp,
  registerPhoneNumber,
  registerPhoneNumberOtp,
}) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: REGISTER_EMAIL_VERIFY_SUBMIT });
      const body = {
        email: registerEmail,
        email_otp: registerEmailOtp,
        phone_number: registerPhoneNumber,
        phone_otp: registerPhoneNumberOtp,
      };

      APIClient.getInstance()
        .postWithoutTokenRegister(
          END_POINT.REGISTER_USER_API_POST + "/verify_account",
          body
        )
        .then((response) => {
          // console.log("registerVerifyEmailPhoneOtpSuccess--->>", response);
          registerVerifyEmailPhoneOtpSuccess(dispatch, response);
          resolve(response);
        })
        .catch((error) => {
          console.log("registerVerifyEmailPhoneOtpSuccess---error>>", error);
          if (error?.status == "422") {
            registerEmailVerifyFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
            reject(error);
          } else {
            registerEmailVerifyFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
            reject(error);
          }
        });
    });
  };
};
/************************************** register email otp verify ****************************************************/
export const resendEmailOtpVerify = (registerEmail) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: RESEND_EMAIL_OTP_SUBMIT });
      const body = {
        email: registerEmail,
      };

      APIClient.getInstance()
        .postWithoutTokenRegister(END_POINT.RESEND_REGISTER_EMAIL_OTP, body)
        .then((response) => {
          registerEmailOtpSuccess(dispatch, response);

          resolve(response);
        })
        .catch((error) => {
          console.log("RESEND_EMAIL_OTP_SUBMIT---error>>", error);
          if (error?.status == "422") {
            resendEmailOtpFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
            reject(
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
          } else {
            resendEmailOtpFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
            reject(
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
          }
        });
    });
  };
};
/************************************** register phone otp verify ****************************************************/
export const resendPhoneOtpVerify = (registerPhoneNumber, email) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: RESEND_PHONE_OTP_SUBMIT });
      const body = {
        phone_number: registerPhoneNumber,
        email: email,
      };

      APIClient.getInstance()
        .postWithoutTokenRegister(END_POINT.RESEND_REGISTER_PHONE_OTP, body)
        .then((response) => {
          registerPhoneOtpSuccess(dispatch, response);

          resolve(response);
        })
        .catch((error) => {
          console.log("resendPhoneOtpVerify-error-->>", error);

          if (error?.status == "422") {
            resendPhoneOtpFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
            reject(
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
          } else {
            resendPhoneOtpFail(
              dispatch,
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
            reject(
              getMultiLingualData(JSON.parse(error?.bodyString)?.errors[0])
            );
          }
        });
    });
  };
};

/************************************** edit phone number ****************************************************/
export const editPhoneNumber = (registerPhoneNumber, email) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: EDIT_PHONE_NUMBER_SUBMIT });
      const body = {
        phone_number: registerPhoneNumber,
        email: email,
      };

      CoinCultApi.post(
        END_POINT.EDIT_PHONE_NUMBER_URL +
        `${email}/new_phone_number=${registerPhoneNumber}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          console.log("editPhoneNumber-response-->>", response);
          editPhoneNumberSuccess(dispatch, response?.data);
          resolve(response?.data);
        })
        .catch((error) => {
          console.log("editPhoneNumber-error-->>", JSON.stringify(error));

          if (error?.status == "422") {
            editPhoneNumberFail(
              dispatch,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          } else {
            editPhoneNumberFail(
              dispatch,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
            reject(getMultiLingualData(error?.response?.data?.errors[0]));
          }
        });
    });
  };
};
const registerUserFail = (disptach, errorMessage) => {
  disptach({
    type: REGISTER_USER_FAIL,
    payload: errorMessage,
  });
};
const registerEmailVerifyFail = (disptach, errorMessage) => {
  disptach({
    type: REGISTER_EMAIL_VERIFY_FAIL,
    payload: errorMessage,
  });
  Singleton.getInstance().showError(errorMessage);
};
const registerUserSuccess = (disptach, user) => {
  disptach({
    type: REGISTER_USER_SUCCESS,
    payload: user,
  });
  Alert.alert(
    constants.APP_NAME_CAPS,
    "You have registered successfully.\nPlease verify your phone number and email address",
    [
      {
        text: "OK",
        onPress: () => {
          showMessage({
            message: "Please check your email and phone for OTP code",
            backgroundColor: ThemeManager.colors.tabBottomBorder,
            autoHide: true,
            duration: 2000,
            type: "success",
            icon: "success",
            position: "right",
            style: {
              marginHorizontal: 10,
              borderRadius: 10,
              marginTop: Platform.OS == "android" ? 10 : 40,
            },
          });
          Actions.currentScene != "RegisterVerification" &&
            Actions.RegisterVerification();
        },
      },
    ],
    { cancelable: false }
  );
};
const registerVerifyEmailPhoneOtpSuccess = (disptach, user) => {
  disptach({
    type: REGISTER_EMAIL_VERIFY_SUCCESS,
    payload: user,
  });
  Alert.alert(
    constants.APP_NAME_CAPS,
    "Registration process complete.\nPlease login now",
    [
      {
        text: "ok",
        onPress: () => {
          Actions.currentScene != "Login" && Actions.Login();
        },
      },
    ],
    { cancelable: false }
  );
};

const registerEmailOtpSuccess = (disptach, user) => {
  disptach({
    type: RESEND_EMAIL_OTP_SUCCESS,
    payload: user,
  });
  showMessage({
    message: "Otp resent on email successfully.",
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
};
const editPhoneNumberSuccess = (disptach, user) => {
  disptach({
    type: RESEND_PHONE_OTP_SUCCESS,
    payload: user,
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
};
const registerPhoneOtpSuccess = (disptach, user) => {
  disptach({
    type: EDIT_PHONE_NUMBER_SUCCESS,
    payload: user,
  });
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
};
const editPhoneNumberFail = (disptach, errorMessage) => {
  disptach({
    type: EDIT_PHONE_NUMBER_FAIL,
    payload: errorMessage,
  });
};
const resendEmailOtpFail = (disptach, errorMessage) => {
  disptach({
    type: RESEND_EMAIL_OTP_FAIL,
    payload: errorMessage,
  });
};
const resendPhoneOtpFail = (disptach, errorMessage) => {
  disptach({
    type: RESEND_PHONE_OTP_FAIL,
    payload: errorMessage,
  });
  Singleton.getInstance().showError(errorMessage);
};
