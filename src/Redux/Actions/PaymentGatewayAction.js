import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";

// import {
//   SEND_EMAIL_2FA_AUTHENTICATE_API_GET,
//   TOKEN_VERIFICATION_API_POST,
//   GOOGLE_2FA_AUTHENTICATE_API_POST,
//   GOOGLE_AUTH_DETAILS_API_POST,
// } from '../EndPoints';
import END_POINT from "../../EndPoints";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";
import {
  POST_PAYMENT_GATEWAY_KET_SUBMIT,
  POST_PAYMENT_GATEWAY_KET_SUCCESS,
  POST_PAYMENT_GATEWAY_KET_FAIL,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";

export const getPaymentGatewayKetDetails = () => {
  return (disptach) => {
    disptach({ type: POST_PAYMENT_GATEWAY_KET_SUBMIT });

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.post(
          END_POINT.POST_PAYMENT_GATEWAY_TOKEN + END_POINT.GOONEY_API_KEY,
          {},
          {
            headers: {
              contentType: "application/json",
              //   Authorization: res,
            },
          }
        )
          .then((response) => {
            getPaymentGatewaySuccess(disptach, response);
          })
          .catch((error) => {
            getPaymentGatewayFail(
              disptach,
              getMultiLingualData(error?.response?.data?.errors[0])
            );
          });
      });
  };
};

const getPaymentGatewayFail = (disptach, errorMessage) => {
  disptach({
    type: POST_PAYMENT_GATEWAY_KET_FAIL,
    payload: errorMessage,
  });
};
const getPaymentGatewaySuccess = (disptach, details) => {
  disptach({
    type: POST_PAYMENT_GATEWAY_KET_SUCCESS,
    payload: details,
  });
};
