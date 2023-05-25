import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  GET_BANK_LIST_SUBMIT,
  GET_BANK_LIST_SUCCESS,
  GET_BANK_LIST_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";

export const bankListAction = () => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GET_BANK_LIST_SUBMIT });

      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.get(END_POINT.GET_BANK_ACCOUNT_LIST, {
            headers: {
              contentType: "application/json",
              Authorization: res,
            },
          })
            .then((response) => {
              getBankListSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
              }

              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              getBankListFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    });
  };
};

const getBankListFail = (disptach, errorMessage) => {
  disptach({
    type: GET_BANK_LIST_FAIL,
    payload: errorMessage,
  });
};
const getBankListSuccess = (disptach, details) => {
  disptach({
    type: GET_BANK_LIST_SUCCESS,
    payload: details,
  });
};
