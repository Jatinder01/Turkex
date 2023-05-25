import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  GOONEY_DETAILS_UPDATE,
  GOONEY_DETAILS_SUBMIT,
  GOONEY_DETAILS_SUCCESS,
  GOONEY_DETAILS_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";
/************************************** gooney user  ****************************************************/
export const gooneyDetailsAction = () => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: GOONEY_DETAILS_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.get(END_POINT.GOONEY_DETAILS_API, {
            headers: {
              contentType: "application/json",
              Authorization: res,
            },
          })
            .then((response) => {
              gooneyDetailsSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
              gooneyDetailsFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
            });
        });
    });
  };
};

const gooneyDetailsFail = (disptach, errorMessage) => {
  disptach({
    type: GOONEY_DETAILS_FAIL,
    payload: errorMessage,
  });
};
const gooneyDetailsSuccess = (disptach, details) => {
  disptach({
    type: GOONEY_DETAILS_SUCCESS,
    payload: details,
  });
};
