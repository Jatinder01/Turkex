import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  ADD_BANK_SUBMIT,
  ADD_BANK_SUCCESS,
  ADD_BANK_FAIL,
  ADD_BANK_UPDATE,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";
export const addBankCardUpdate = ({ prop, value }) => {
  return {
    type: ADD_BANK_UPDATE,
    payload: { prop, value },
  };
};
export const addBankCardAction = (holder_name, iban, bic) => {
  return (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: ADD_BANK_SUBMIT });

      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          CoinCultApi.post(
            END_POINT.GET_BANK_ACCOUNT_LIST,
            { holder_name: holder_name, iban: iban, bic: bic },
            {
              headers: {
                contentType: "application/json",
                // Authorization: Singleton.getInstance().accessToken,
                Authorization: res,
              },
            }
          )
            .then((response) => {
              // console.log("addBankCardAction success=-=-=>>>", response?.data);
              addBankCardSuccess(disptach, response?.data);
              resolve(response?.data);
            })
            .catch((error) => {
              console.log("Error addBankCardAction---", JSON.stringify(error));
              if (error?.response?.status == "401") {
                Singleton.getInstance().isLoginSuccess = true;
                Singleton.getInstance().refreshToken(1);
                reject(getMultiLingualData(""));
                addBankCardFail(disptach, "");
              } else if (
                error?.response?.status == "403" ||
                error?.response?.status == "500" ||
                error?.response?.status == "503" ||
                error?.response?.status == "504"
              ) {
                Singleton.getInstance().showError(
                  "Server down, please try after sometime"
                );
                reject(getMultiLingualData(""));
                addBankCardFail(disptach, "");
              } else {
                reject(getMultiLingualData(error?.response?.data?.errors[0]));
                addBankCardFail(
                  disptach,
                  getMultiLingualData(error?.response?.data?.errors[0])
                );
              }
              //  console.log("Error addBankCardAction", error?.response);
            });
        });
    });
  };
};

const addBankCardFail = (disptach, errorMessage) => {
  disptach({
    type: ADD_BANK_FAIL,
    payload: errorMessage,
  });
};
const addBankCardSuccess = (disptach, details) => {
  disptach({
    type: ADD_BANK_SUCCESS,
    payload: details,
  });
};
