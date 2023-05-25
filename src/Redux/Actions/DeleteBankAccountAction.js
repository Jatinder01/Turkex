import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  DELETE_BANK_UPDATE,
  DELETE_BANK_SUBMIT,
  DELETE_BANK_SUCCESS,
  DELETE_BANK_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";
export const deleteBankAccountUpdate = ({ prop, value }) => {
  return {
    type: DELETE_BANK_UPDATE,
    payload: { prop, value },
  };
};
export const deleteBankAccountAction = (id) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: DELETE_BANK_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.delete(END_POINT.GET_BANK_ACCOUNT_LIST + "/" + id, {
            headers: {
              contentType: "application/json",
              Authorization: JSON.parse(res),
            },
          })
            .then((response) => {
              deleteBankAccountSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              deleteBankAccountFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    });
  };
};

const deleteBankAccountFail = (disptach, errorMessage) => {
  disptach({
    type: DELETE_BANK_FAIL,
    payload: errorMessage,
  });
};
const deleteBankAccountSuccess = (disptach, details) => {
  disptach({
    type: DELETE_BANK_SUCCESS,
    payload: details,
  });
};
