import { Actions } from "react-native-router-flux";
import { CoinCultApi } from "../../api/CoinCultApi";
import END_POINT from "../../EndPoints";
import { APP_NAME_CAPS, VALID_EMAIL } from "../../Constants";
import { APP_NAME } from "../../Constants";
import {
  FORGOT_PASSWORD_FORM_UPDATE,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_USER,
} from "./types";
import { getMultiLingualData } from "../../../Utils";
import { Alert } from "react-native";

export const forgotPasswordFormUpdate = ({ prop, value }) => {
  return {
    type: FORGOT_PASSWORD_FORM_UPDATE,
    payload: { prop, value },
  };
};
/**************************************  forget password ****************************************************/
export const forgotPasswordUser = ({ forgotPasswordEmail }) => {
  console.log("forgotPasswordEmail=-=-=-", forgotPasswordEmail);
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: FORGOT_PASSWORD_USER });
      // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let reg = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(forgotPasswordEmail) === false) {
        forgotPasswordFail(dispatch, VALID_EMAIL);
        reject(VALID_EMAIL);
      } else {
        //Call API
        CoinCultApi.post(END_POINT.FORGOT_PASSWORD_API_POST, {
          email: forgotPasswordEmail,
        })
          .then((response) => {
            console.log(
              "forgotPasswordUser-0-=-=-=>>>",
              JSON.stringify(response)
            );
            forgotPasswordSuccess(dispatch, response?.data);
            resolve(response?.data);
            Alert.alert(
              APP_NAME_CAPS,
              "Password reset link sent.",
              [
                {
                  text: "ok",
                  onPress: () => {
                    Actions.pop();
                  },
                },
              ],
              { cancelable: false }
            );
          })
          .catch((error) => {
            console.log(
              "forgotPasswordUser-0-=-error=-=>>>",
              JSON.stringify(error)
            );
            if (
              error?.response?.data?.errors[0] ==
              "Sorry, we don't recognise this email address"
            ) {
              forgotPasswordFail(
                dispatch,
                "Sorry, we don't recognize this email address"
              );
              reject("Sorry, we don't recognize this email address");
            } else {
              forgotPasswordFail(
                dispatch,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
              reject(getMultiLingualData(error?.response?.data?.errors[0]));
            }
          });
      }
    });
  };
};
const forgotPasswordFail = (dispatch, errorMessage) => {
  dispatch({
    type: FORGOT_PASSWORD_FAIL,
    payload: errorMessage,
  });
};
const forgotPasswordSuccess = (dispatch, user) => {
  dispatch({
    type: FORGOT_PASSWORD_SUCCESS,
    payload: user,
  });
};
