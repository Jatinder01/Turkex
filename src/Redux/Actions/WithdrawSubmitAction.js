import { Actions } from "react-native-router-flux";

import { CoinCultApi } from "../../api/CoinCultApi";
import END_POINT from "../../EndPoints";

// import {
//   WITHDRAW_VALIDATE_API_POST,
//   WITHDRAW_SUBMIT_API_POST,
// } from '../EndPoints';
import {
  WITHDRAWAL_REQ_SUBMIT,
  WITHDRAWAL_FORM_UPDATE,
  WITHDRAWAL_REQ_SUCCESS,
  WITHDRAWAL_REQ_FAIL,
  WITHDRAWAL_FORM_RESET,
} from "./types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { APIClient } from "../../api";

// export const withdrawFormUpdate = ({ prop, value }) => {
//     return {
//         type: WITHDRAWAL_FORM_UPDATE,
//         payload: { prop, value },
//     };
// };
/************************************** submit withdraw request  ****************************************************/
export const sumbitWithdrawRequest = ({
  coinName,
  amount,
  address,
  otp,
  beniId,
  blockchain_key,
  withdraw_otp,
}) => {
  return (disptach) => {
    disptach({ type: WITHDRAWAL_REQ_SUBMIT });
    const body = {
      otp: otp,
      beneficiary_id: beniId,
      currency: coinName,
      blockchain_key: blockchain_key,
      amount: amount,
      note: "",
      withdraw_otp: withdraw_otp,
    };

    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        APIClient.getInstance()
          .postData(
            END_POINT.WITHDRAW_SUBMIT_API_POST,
            body,
            res
            // Singleton.getInstance().accessToken
          )
          .then((response) => {
            withdrawReqSuccess(disptach, response);
          })
          .catch((error) => {
            // console.log("response=-=sumbitWithdrawRequest-=>>>error>>", error);

            if (error?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
              withdrawReqFail(disptach, "");
            } else if (
              error?.status == "403" ||
              error?.status == "500" ||
              error?.status == "503" ||
              error?.status == "504"
            ) {
              Singleton.getInstance().showError(
                "Server down, please try after sometime"
              );
              withdrawReqFail(disptach, "");
            } else {
              Singleton.getInstance().showError(
                JSON.parse(error?.bodyString)?.message
                  ? JSON.parse(error?.bodyString)?.message
                  : getMultiLingualData(
                      JSON.parse(error?.bodyString)?.errors[0]
                    )
              );
              withdrawReqFail(
                disptach,
                JSON.parse(error?.bodyString)?.message
                  ? JSON.parse(error?.bodyString)?.message
                  : getMultiLingualData(
                      JSON.parse(error?.bodyString)?.errors[0]
                    )
              );
            }
          });
      });
  };
};
export const resetWithdrawReq = () => {
  return {
    type: WITHDRAWAL_FORM_RESET,
  };
};
const withdrawReqFail = (disptach, errorMessage) => {
  disptach({
    type: WITHDRAWAL_REQ_FAIL,
    payload: errorMessage,
  });
};

const withdrawReqSuccess = (disptach, details) => {
  disptach({
    type: WITHDRAWAL_REQ_SUCCESS,
    payload: details,
  });
  Actions.WithdrawalSuccessful({ deposit: false });
};
