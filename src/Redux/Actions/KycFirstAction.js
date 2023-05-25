import { Actions } from "react-native-router-flux";
import END_POINT from "../../EndPoints";
import {
  KYC_FIRST_FORM_UPDATE,
  KYC_FIRST_SUCCESS,
  KYC_FIRST_FAIL,
  KYC_FIRST_SUBMIT,
  KYC_FIRST_RESET,
  KYC_DOC_GET,
  KYC_DOC_INITIAL,
  KYC_DOC_FAIL,
} from "../Actions/types";
import { Alert } from "react-native";
import * as constants from "../../Constants";
import Singleton from "../../Singleton";
import { getMultiLingualData } from "../../../Utils";
import { strings } from "../../../Localization";
import { APIClient, CoinCultApi } from "../../api";

export const kycFirstFormUpdate = ({ prop, value }) => {
  return {
    type: KYC_FIRST_FORM_UPDATE,
    payload: { prop, value },
  };
};

export const resetKYCForm = () => {
  return {
    type: KYC_FIRST_RESET,
  };
};

export const getKycDocument = () => {
  return (disptach) => {
    disptach({ type: KYC_DOC_INITIAL });
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.UPLOAD_DOC_FILE_API, {
          headers: {
            Authorization: JSON.parse(res),
          },
        })
          .then((res) => {
            let docArray = res?.data;
            let docObj = docArray[docArray.length - 1];
            disptach({ type: KYC_DOC_GET, payload: docObj });
          })
          .catch((err) => {
            if (err.response.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
          });
      });
  };
};
export const changeName =
  ({ kycFirstName, kycMiddleName, kycLastName, isEdit }) =>
  (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: KYC_FIRST_SUBMIT });
      Singleton.getInstance()
        .getDataSecure(constants.ACCESS_TOKEN)
        .then((res) => {
          let request = {
            method: isEdit == true ? "put" : "post",
            url: END_POINT.CREATE_USER_PROFILE_POST,
            data: {
              first_name: kycFirstName,
              middle_name: kycMiddleName,
              last_name: kycLastName,
            },
            headers: {
              contentType: "application/json",
              Authorization: JSON.parse(res),
            },
          };

          CoinCultApi(request)
            .then((response) => {
              resolve(response?.data);

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
                      submitDetailSuccessEdit(disptach, userData.data, isEdit);
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

              submitDetailFail(
                disptach,
                getMultiLingualData(error?.response?.data?.errors[0])
              );
              reject(error?.response);
            });
        });
    });
  };

export const submitKycDetails =
  ({
    kycFirstName,
    // kycGender,
    // kycMiddleName,
    kycLastName,
    kycDob,
    kycCountry,
    kycCountryId,
    kycZip,
    kycCity,
    isEdit,
    kycAddress,
    genderValue,
  }) =>
  (disptach) => {
    return new Promise((resolve, reject) => {
      disptach({ type: KYC_FIRST_SUBMIT });
      console.log("kycDob---", kycDob);
      console.log("kycCountry---", kycCountry);
      console.log("kycCountryId---", kycCountryId);
      console.log("kycZip---", kycZip);
      console.log("isEdit---", isEdit);
      console.log("kycAddress---", kycAddress);
      console.log("genderValue---", genderValue);
      console.log("kycDob--length-", kycDob?.length);
      console.log("kycCountry--length-", kycCountry?.length);
      console.log("kycCountryId--length-", kycCountryId?.length);
      console.log("kycZip--length-", kycZip?.length);
      console.log("isEdit--length-", isEdit?.length);
      console.log("kycAddress--length-", kycAddress?.length);
      console.log("genderValue--length-", genderValue?.length);
      // return;
      if (kycFirstName?.length <= 0) {
        submitDetailFail(disptach, constants.VALID_FIRST_NAME);
      } else if (kycFirstName?.length <= 1) {
        submitDetailFail(disptach, constants.VALID_FIRST_NAME_LENGTH);
      } else if (kycLastName?.length <= 0) {
        submitDetailFail(disptach, constants.VALID_LAST_NAME);
      } else if (kycLastName?.length <= 1) {
        submitDetailFail(disptach, constants.VALID_LAST_NAME_LENGTH);
      } else if (kycDob?.length <= 0) {
        submitDetailFail(disptach, constants.VALID_DOB);
      } else if (kycDob == "DD/MM/YYYY") {
        submitDetailFail(disptach, constants.VALID_DOB);
      } else if (kycCountryId?.length < 1) {
        submitDetailFail(disptach, constants.VALID_COUNTRY);
      } else if (kycAddress?.length < 3 || kycAddress == null) {
        submitDetailFail(
          disptach,
          strings.enterAccountDetails.enterValidAddress
        );
      } else if (kycZip?.length < 3 || kycZip == null) {
        submitDetailFail(
          disptach,
          strings.enterAccountDetails.enterValidPostcode
        );
      } else if (kycCity?.length < 2 || kycCity == null) {
        submitDetailFail(disptach, strings.enterAccountDetails.enterValidTown);
      } else {
        Singleton.getInstance()
          .getDataSecure(constants.ACCESS_TOKEN)
          .then((res) => {
            let body = {
              country: kycCountryId,
              first_name: kycFirstName,
              // middle_name: kycMiddleName,
              last_name: kycLastName,
              city: kycCity,
              dob: kycDob,
              postcode: kycZip,
              address: kycAddress,
              gender: genderValue,
            };
            let request = {
              // method: isEdit == true ? "put" : "post",
              method: "put",

              url: END_POINT.CREATE_USER_PROFILE_POST,
              data: {
                country: kycCountryId,
                first_name: kycFirstName,
                // middle_name: kycMiddleName,
                last_name: kycLastName,
                city: kycCity,
                dob: kycDob,
                postcode: kycZip,
                address: kycAddress,
                gender: genderValue,
              },
              headers: {
                contentType: "application/json",
                Authorization: res,
              },
            };

            CoinCultApi(request)
              // APIClient.putData(END_POINT.CREATE_USER_PROFILE_POST, body, res)
              .then((response) => {
                // console.log("submitKycDetailsapi=-=-", response);
                resolve(response?.data);

                CoinCultApi.get(END_POINT.GET_USER_ME, {
                  headers: {
                    contentType: "application/json",
                    Authorization: JSON.parse(res),
                  },
                })
                  .then((userData) => {
                    // console.log("submitKycDetailsapi=-=userData-", userData);
                    Singleton.getInstance()
                      .saveData(
                        constants.USER_DATA,
                        JSON.stringify(userData.data)
                      )
                      .then((res) => {
                        submitDetailSuccessEdit(
                          disptach,
                          userData.data,
                          isEdit
                        );
                      });
                  })
                  .catch((error) => {
                    console.log("submitKycDetails=-=api error-", error);
                    if (error?.response?.status == "401") {
                      Singleton.getInstance().isLoginSuccess = true;
                      Singleton.getInstance().refreshToken(1);
                    }
                  });
              })
              .catch((error) => {
                console.log("submitKycDetails=-=api error outer----", error);
                if (error?.response?.status == "401") {
                  Singleton.getInstance().isLoginSuccess = true;
                  Singleton.getInstance().refreshToken(1);
                  submitDetailFail(disptach, "");
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
                  submitDetailFail(disptach, "");
                  reject("");
                } else {
                  submitDetailFail(
                    disptach,
                    getMultiLingualData(error?.response?.data?.errors[0])
                  );
                  reject(error?.response);
                }
              });
          });
      }
    });
  };

export const getSumSubToken = () => (disptach) => {
  return new Promise((resolve, reject) => {
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        // console.log("getSumSubToken token--===-->>>", res);
        CoinCultApi.get(END_POINT.GET_SUM_SUB_TOKEN, {
          headers: {
            contentType: "application/json",
            Authorization: JSON.parse(res),
          },
        })
          .then((res) => {
            // console.log("getSumSubToken=-=res=-=", res);
            resolve(res?.data);
          })
          .catch((err) => reject(err.response));
      });
  });
};
export const updateSumSubApplicantId = (id) => (disptach) => {
  return new Promise((resolve, reject) => {
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        // console.log("updateSumSubApplicantId=-==-", res);
        let request = {
          method: "post",
          url: END_POINT.REGISTER_SUM_SUB_ID,
          data: {
            applicant_id: id,
          },
          headers: {
            contentType: "application/json",
            Authorization: res,
          },
        };
        CoinCultApi(request).then((response) => {
          console.log("response-----", response?.data);
        });
      });
  });
};

const submitDetailFail = (disptach, errorMessage) => {
  disptach({
    type: KYC_FIRST_FAIL,
    payload: errorMessage,
  });
};

const submitDetailSuccess = (disptach, response) => {
  disptach({
    type: KYC_FIRST_SUCCESS,
    payload: response,
  });
  Actions.SelectYourDocument();
};

const submitDetailSuccessEdit = (disptach, response, isEdit) => {
  disptach({
    type: KYC_FIRST_SUCCESS,
    payload: response,
  });
};
