import { Actions } from "react-native-router-flux";
import { RubyexApi } from "../api";
// import {
//   GET_REFRAL_REAWARD_API,
//   GET_REFRAL_REAWARD_HISTORY,
//   GET_REFRAL_FRIENDLIST_API,
//   SEND_REWARDS,
// } from '../EndPoints';
import END_POINT from "../../EndPoints";
import {
  //   REFRAL_USER,
  //   REFRAL_FORM_UPDATE,
  GET_REFRAL_REWARD,
  GET_REFRAL_FRIEND,
  GET_RERFAL_DETAILS_FAIL,
  GET_RERFAL_FRIEND_DETAILS_FAIL,
  GET_RERFAL_FRIEND_DETAILS_SUCCESS,
  GET_BANK_DETAILS_SUBMIT,
  GET_BANK_DETAILS_SUCCESS,
  GET_RERFAL_RewardHistory_SUCCESS,
  GET_RERFAL_RewardHistory_FAIL,
  GET_RERFAL_AWARD_DETAILS_SUCCESS,
  GET_ADMIN_BANK_DETAILS_FAIL,
  GET_REFRAL_REWARD_HOSTORY,
  SEND_REWARD_INIT,
  SEND_REWARD_SUCCESS,
  SEND_REWARD_FAILED,
} from "./types";
import { Alert, Platform } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { CoinCultApi } from "../../api";
import { showMessage, hideMessage } from "react-native-flash-message";
import { ThemeManager } from "../../../ThemeManager";
/*
export const loginFormUpdate = ({ prop, value }) => {
    return {
        type: LOGIN_FORM_UPDATE,
        payload: { prop, value },
    };
};
*/

export const getRefralReward = (UDID) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: GET_REFRAL_REWARD });

    // Singleton.getInstance()
    //   .getData(constants.ACCESS_TOKEN)
    //   .then(res => {
    // RubyexApi.get(GET_REFRAL_REAWARD_API + UDID, {
    //   headers: {
    //     'X-CSRF-Token': res,
    //     'Content-Type': 'application/json',
    //   },
    // });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_REFRAL_REAWARD_API + UDID,

          {
            headers: {
              Authorization: res,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            resolve(response?.data);
            getrefralRewardSuccess(disptach, response?.data);
          })
          .catch((error) => {
            reject(error?.response);
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getrefralDetailsFail(disptach, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getrefralDetailsFail(disptach, "");
            } else {
              getrefralDetailsFail(disptach, error?.response?.data.message);
            }
          });
      });
  });
};
export const sendReward = (data) => {
  return (disptach) => {
    disptach({ type: SEND_REWARD_INIT });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(END_POINT.SEND_REWARDS, data, {
          headers: {
            Authorization: res,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            showMessage({
              message: "Reward Send Successfully!!",
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
            disptach({ type: SEND_REWARD_SUCCESS });
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              disptach({ type: SEND_REWARD_FAILED });
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              disptach({ type: SEND_REWARD_FAILED });
            } else {
              var err = getMultiLingualData(error?.response?.data?.errors[0]);

              Singleton.getInstance().showError(err);
              disptach({ type: SEND_REWARD_FAILED });
            }
          });
      });
  };
};

export const getRefralFriend = (UDID) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: GET_REFRAL_FRIEND });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.GET_REFRAL_FRIENDLIST_API + UDID, {
          headers: {
            Authorization: res,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            getrefralFriendSuccess(disptach, response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getrefralFriendFail(dispatch, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getrefralFriendFail(dispatch, "");
            } else {
              getrefralFriendFail(disptach, error?.response?.data.message);
            }
          });
      });
  });
};

export const getRewardHistory = (UDID, page) => (disptach) => {
  return new Promise((resolve, reject) => {
    disptach({ type: GET_REFRAL_REWARD_HOSTORY, payload: page });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(
          END_POINT.GET_REFRAL_REAWARD_HISTORY + UDID + `&limit=5&page=${page}`,
          {
            headers: {
              Authorization: res,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            getRewardHistorySuccess(disptach, response?.data);
          })
          .catch((error) => {
            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              getRewardHistoryFail(dispatch, "");
            } else if (
              error?.response?.status == "403" ||
              error?.response?.status == "500" ||
              error?.response?.status == "503" ||
              error?.response?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              getRewardHistoryFail(dispatch, "");
            }
            getRewardHistoryFail(disptach, error?.response?.data.message);
          });
      });
  });
};

const getRewardHistoryFail = (disptach, errorMessage) => {
  disptach({
    type: GET_RERFAL_RewardHistory_FAIL,
    payload: errorMessage,
  });
};
const getRewardHistorySuccess = (disptach, details) => {
  disptach({
    type: GET_RERFAL_RewardHistory_SUCCESS,
    payload: details,
  });
};

const getrefralDetailsFail = (disptach, errorMessage) => {
  disptach({
    type: GET_RERFAL_DETAILS_FAIL,
    payload: errorMessage,
  });
};
const getrefralRewardSuccess = (disptach, details) => {
  disptach({
    type: GET_RERFAL_AWARD_DETAILS_SUCCESS,
    payload: details,
  });
};

const getrefralFriendFail = (disptach, errorMessage) => {
  disptach({
    type: GET_RERFAL_FRIEND_DETAILS_FAIL,
    payload: errorMessage,
  });
};
const getrefralFriendSuccess = (disptach, details) => {
  disptach({
    type: GET_RERFAL_FRIEND_DETAILS_SUCCESS,
    payload: details,
  });
};
