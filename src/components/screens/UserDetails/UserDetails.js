/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import useStyles from "./UserDetailsStyle";
import { ButtonPrimary, Loader } from "../../common";
import * as constants from "../../../Constants";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useDispatch, useSelector } from "react-redux";
import { countryFlags } from "../../common/CountryFlags";
import {
  kycFirstFormUpdate,
  getCardHolderDetails,
  getProfile1,
  getCheckDocumentSumSubDetails,
  getUploadDocsPaytendSide,
} from "../../../Redux/Actions";
import Singleton from "../../../Singleton";
// import {color} from 'react-native-reanimated';
import SimpleHeader from "../../common/SimpleHeader";

let genderData = [
  { id: 0, genderName: "Man" },
  { id: 1, genderName: "Woman" },
];
const TextComponent = ({ title, value }) => {
  const styles = useStyles(ThemeManager);
  return (
    <View>
      <Text style={styles.inputTitle}>{title}</Text>
      <View
        style={{
          height: 50,
          justifyContent: "center",
          backgroundColor: ThemeManager.colors.SwapInput,
          //   width: "100%",
          marginHorizontal: 16,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: ThemeManager.colors.textColor1,
            fontFamily: Fonts.regular,
            fontSize: 14,
            marginLeft: 15,
            textTransform: "capitalize",
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
const UserDetails = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles(ThemeManager);
  const { isCardHolderLoading, cardHolderError, cardHolderInfo } = useSelector(
    (state) => state.cardHolderDetailsReducer
  );
  // const { checkDocumentError, checkDocumentInfo, isCheckDocumentLoading } =
  //   useSelector((state) => state.cardCheckDocumentReducer);
  // const [kycStatus, setKycStatus] = useState(false);
  // const [isProfileFilled, setIsProfileFilled] = useState(false);
  const [userData, setuserData] = useState({});
  // const [address, setAddress] = useState("");
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  const [countryCode, setCountryCode] = useState("");
  // const [eaa, setEaa] = useState(false);

  const kycFirst = useSelector((state) => state.kycFirst);

  const [isUpdate, setisUpdate] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [loader, setLoader] = useState(true);
  const [uploadLoader, setUploadLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    dispatch(getProfile1())
      .then((res) => {
        // console.log("getProfile1=-=-=-=>>>11>", res);
        getUserData();
      })
      .catch((err) => {
        console.log("error=-=-=-=>>>>", err);
      });
    props.navigation.addListener("didFocus", () => {
      setLoader(true);
      dispatch(getProfile1())
        .then((res) => {
          // console.log("getProfile1=-=-=-=>>>22>", res);
          getUserData();
        })
        .catch((err) => {
          console.log("error=-=-=-=>>>>", err);
        });
    });
    return () => {
      dispatch(
        kycFirstFormUpdate({
          prop: "kycCountry",
          value: "",
        })
      );
      dispatch(
        kycFirstFormUpdate({
          prop: "kycCountryId",
          value: "",
        })
      );
      dispatch(
        kycFirstFormUpdate({
          prop: "kycDob",
          value: "",
        })
      );
      // dispatch(
      //   kycFirstFormUpdate({
      //     prop: "kycFirstName",
      //     value: "",
      //   })
      // );
      dispatch(
        kycFirstFormUpdate({
          prop: "kycMiddleName",
          value: "",
        })
      );
      // dispatch(
      //   kycFirstFormUpdate({
      //     prop: "kycLastName",
      //     value: "",
      //   })
      // );
    };
  }, []);

  const getCardDetails = () => {
    dispatch(getCardHolderDetails())
      .then((response) => {
        console.log("----getCardDetails- res-->", response);

        // Actions.currentScene != "UploadFiles" && Actions.push("UploadFiles");
      })
      .catch((err) => {
        console.log("----getCardDetails- err--666>", err);
      });
  };
  const getUserData = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        // console.log("USER_DATA=-=-=-=-=---->>", res);
        if (res != null && JSON.parse(res).profiles != null) {
          let uData = JSON.parse(res);

          getCardDetails();
          const getProfileStatus = JSON.parse(res).labels.filter((item) => {
            return item.key === "profile";
          });

          if (JSON.parse(res)?.profiles[0]?.gender != null) {
            setUserInfo(JSON.parse(res)?.profiles[0]);
            let country = JSON.parse(res)?.profiles[0]?.country;

            setCountryCode(country);
            setProfileCompleted(true);
            setLoader(false);
          } else {
            setProfileCompleted(false);
            setLoader(false);
          }
          if (uData?.profiles[0]?.country) {
            let countryData = countryFlags.find(
              (res) => res?.countryCode == uData.profiles[0]?.country
            );

            setCountryName(countryData?.countryNameEn);
          }
          setLoader(false);
          setuserData(uData);
        } else {
          setisUpdate(false);
          setLoader(false);
        }
      });
  };
  const renderError = () => {
    if (kycFirst.kycError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>
            {capitalize(kycFirst.kycError)}
          </Text>
        </View>
      );
    }
  };
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const submitButtonClicked = () => {
    setUploadLoader(true);
    dispatch(getCardHolderDetails())
      .then((response) => {
        console.log("response=-=res-", response);
        let checkEAA = constants.EEA_COUNTRY.find(
          (code) => code.toUpperCase() === countryCode.toUpperCase()
        );
        console.log("----getCardHolderDetails- checkEAAee-->", checkEAA);
        if (response === null) {
          dispatch(getCheckDocumentSumSubDetails(countryCode))
            .then((res) => {
              console.log("getCardHolderDetails=-=eeres-", res);
              if (checkEAA != undefined) {
                Actions.currentScene != "UploadFiles" &&
                  Actions.push("UploadFiles", {
                    documentType: res,
                    nonEaa: false,
                    auditStatus: false,
                  });
                setUploadLoader(false);
              } else {
                Actions.currentScene != "UploadFiles" &&
                  Actions.push("UploadFiles", {
                    documentType: res,
                    nonEaa: true,
                    auditStatus: false,
                  });
                setUploadLoader(false);
              }
            })
            .catch((err) => {
              console.log("getCardHolderDetails=-ee=err=-", err);
              setUploadLoader(false);
            });
        } else {
          console.log("getCheckDocumentSumSubDetails=-=eeres3333-");
          if (checkEAA != undefined) {
            dispatch(getCheckDocumentSumSubDetails(countryCode))
              .then((res) => {
                console.log("getCheckDocumentSumSubDetails=ee-=res222-", res);
                if (res?.document_type) {
                  if (response?.document_status) {
                    Actions.currentScene != "UploadFiles" &&
                      Actions.push("UploadFiles", {
                        auditStatus: response,
                        documentType: res,
                        nonEaa: true,
                      });
                  } else {
                    dispatch(getUploadDocsPaytendSide(res?.document_type))
                      .then((res) => {
                        console.log("getUploadDocsPaytendSide-ee0-0res>>", res);
                        if (res.status == 200 || res.status == 201) {
                        }
                      })
                      .catch((err) => {
                        console.log("getUploadDocsPaytendSide-0-ee0>==>", err);
                        setUploadLoader(false);
                      });
                  }
                } else {
                  Actions.currentScene != "UploadFiles" &&
                    Actions.push("UploadFiles", {
                      auditStatus: response,
                      documentType: res,
                      nonEaa: false,
                    });
                  setUploadLoader(false);
                }
              })
              .catch((err) => {
                console.log("getCardHolderDetails=-=err444=ee===-", err);
                setUploadLoader(false);
              });
          } else {
            console.log("non eaa getCheckDocumentSumSubDetails=-ee=-");
            dispatch(getCheckDocumentSumSubDetails(countryCode))
              .then((res) => {
                console.log(
                  "non eaa getCheckDocumentSumSubDetails=-res=-",
                  res
                );
                if (res?.document_type) {
                  if (response?.document_status) {
                    Actions.currentScene != "UploadFiles" &&
                      Actions.push("UploadFiles", {
                        auditStatus: response,
                        documentType: res,
                        nonEaa: true,
                      });
                  } else {
                    dispatch(getUploadDocsPaytendSide(res?.document_type))
                      .then((response) => {
                        console.log(
                          "getUploadDocsPaytendSide-0-0res>>",
                          response
                        );
                        if (response.status == 200 || response.status == 201) {
                          Actions.currentScene != "UploadFiles" &&
                            Actions.push("UploadFiles", {
                              auditStatus: response?.data,
                              documentType: res,
                              nonEaa: true,
                            });
                        }
                      })
                      .catch((err) => {
                        console.log("getUploadDocsPaytendSide-0-0>>", err);
                        if (err?.response?.status === 504) {
                          // setModalVisible(true);
                          Actions.pop();
                        }
                      });
                  }
                } else {
                  Actions.currentScene != "UploadFiles" &&
                    Actions.push("UploadFiles", {
                      auditStatus: response,
                      documentType: res,
                      nonEaa: true,
                    });
                }
              })
              .catch((err) => {
                console.log("getCardHolderDetails=-=err555=-", err);
              });
          }
        }
      })
      .catch((err) => {
        console.log("----getCardHolderDetails- err--666>", err);
      });
  };
  // const submitButtonClicked = () => {
  //   setUploadLoader(true);
  //   dispatch(getCardHolderDetails())
  //     .then((response) => {
  //       console.log("response=-=res-", response);
  //       let checkEAA = constants.EEA_COUNTRY.find(
  //         (code) => code.toUpperCase() === countryCode.toUpperCase()
  //       );
  //       console.log("----getCardHolderDetails- checkEAA-->", checkEAA);
  //       if (response === null) {
  //         if (checkEAA != undefined) {
  //           dispatch(getCheckDocumentSumSubDetails(countryCode))
  //             .then((res) => {
  //               // console.log("----getCardHolderDetails- response--34433>");
  //               console.log("getCardHolderDetails=-=res-", res);
  //               Actions.currentScene != "UploadFiles" &&
  //                 Actions.push("UploadFiles", {
  //                   documentType: res,
  //                   nonEaa: false,
  //                   auditStatus: false,
  //                 });
  //               setUploadLoader(false);
  //             })
  //             .catch((err) => {
  //               console.log("getCardHolderDetails=-=err=-", err);
  //               setUploadLoader(false);
  //             });
  //         } else {
  //           console.log("non EAA getCardHolderDetails=-");
  //           dispatch(getCheckDocumentSumSubDetails(countryCode))
  //             .then((res) => {
  //               // console.log("----getCardHolderDetails- response--4444>");
  //               console.log("getCardHolderDetails=-=res222-", res);
  //               Actions.currentScene != "UploadFiles" &&
  //                 Actions.push("UploadFiles", {
  //                   documentType: res,
  //                   nonEaa: true,
  //                   auditStatus: false,
  //                 });
  //               setUploadLoader(false);
  //             })
  //             .catch((err) => {
  //               console.log("getCardHolderDetails=-=err22=-", err);
  //               setUploadLoader(false);
  //             });
  //         }
  //       } else {
  //         console.log("getCheckDocumentSumSubDetails=-=res3333-");
  //         if (checkEAA != undefined) {
  //           dispatch(getCheckDocumentSumSubDetails(countryCode))
  //             .then((res) => {
  //               console.log("getCheckDocumentSumSubDetails=-=res222-", res);
  //               if (res?.document_type) {
  //                 if (response?.document_status) {
  //                   Actions.currentScene != "UploadFiles" &&
  //                     Actions.push("UploadFiles", {
  //                       auditStatus: response,
  //                       documentType: res,
  //                       nonEaa: true,
  //                     });
  //                 } else {
  //                   dispatch(getUploadDocsPaytendSide(res?.document_type))
  //                     .then((res) => {
  //                       console.log("getUploadDocsPaytendSide-0-0res>>", res);
  //                       if (res.status == 200 || res.status == 201) {
  //                         // setTimeout(() => {
  //                         //   dispatch(getUploadDocsPaytendSide("selfie"))
  //                         //     .then((response) => {
  //                         //       console.log(
  //                         //         "getUploadDocsPaytendSide res==selfie-=222>>",
  //                         //         response
  //                         //       );
  //                         //       setTimeout(() => {
  //                         //         setUploadLoader(false);
  //                         //       }, 35000);
  //                         //     })
  //                         //     .catch((err) => {
  //                         //       console.log(
  //                         //         "getUploadDocsPaytendSide res==selfie-00--->",
  //                         //         err
  //                         //       );
  //                         //       if (err?.response?.status === 504) {
  //                         //         // setModalVisible(true);
  //                         //         Actions.pop();
  //                         //       }
  //                         //       setUploadLoader(false);
  //                         //     });
  //                         // }, 7000);
  //                       }
  //                     })
  //                     .catch((err) => {
  //                       console.log("getUploadDocsPaytendSide-0-0>==>", err);
  //                       setUploadLoader(false);
  //                     });
  //                 }
  //               } else {
  //                 Actions.currentScene != "UploadFiles" &&
  //                   Actions.push("UploadFiles", {
  //                     auditStatus: response,
  //                     documentType: res,
  //                     nonEaa: false,
  //                   });
  //                 setUploadLoader(false);
  //               }
  //             })
  //             .catch((err) => {
  //               console.log("getCardHolderDetails=-=err444====-", err);
  //               setUploadLoader(false);
  //             });
  //         } else {
  //           console.log("non eaa getCheckDocumentSumSubDetails=-=-");
  //           dispatch(getCheckDocumentSumSubDetails(countryCode))
  //             .then((res) => {
  //               if (res?.document_type) {
  //                 if (response?.document_status) {
  //                   Actions.currentScene != "UploadFiles" &&
  //                     Actions.push("UploadFiles", {
  //                       auditStatus: response,
  //                       documentType: res,
  //                       nonEaa: true,
  //                     });
  //                 } else {
  //                   dispatch(getUploadDocsPaytendSide(res?.document_type))
  //                     .then((response) => {
  //                       console.log(
  //                         "getUploadDocsPaytendSide-0-0res>>",
  //                         response
  //                       );
  //                       if (response.status == 200 || response.status == 201) {
  //                         // setTimeout(() => {
  //                         //   dispatch(getUploadDocsPaytendSide("selfie"))
  //                         //     .then((response) => {
  //                         //       console.log(
  //                         //         "getUploadDocsPaytendSide res==selfie-000=>>",
  //                         //         response
  //                         //       );
  //                         //       setTimeout(() => {
  //                         //         setUploadLoader(false);
  //                         //       }, 35000);
  //                         //     })
  //                         //     .catch((err) => {
  //                         //       console.log(
  //                         //         "getUploadDocsPaytendSide err==selfie-000=>>",
  //                         //         err
  //                         //       );
  //                         //       if (err?.response?.status === 504) {
  //                         //         // setModalVisible(true);
  //                         //         Actions.pop();
  //                         //       }
  //                         //     });
  //                         // }, 7000);
  //                       }
  //                     })
  //                     .catch((err) => {
  //                       console.log("getUploadDocsPaytendSide-0-0>>", err);
  //                       if (err?.response?.status === 504) {
  //                         // setModalVisible(true);
  //                         Actions.pop();
  //                       }
  //                       // if (err?.response.status == 504) {
  //                       //   setTimeout(() => {
  //                       //     dispatch(getUploadDocsPaytendSide(res?.document_type))
  //                       //       .then((response) => {
  //                       //         console.log(
  //                       //           "getUploadDocsPaytendSide res==-55=>>",
  //                       //           response
  //                       //         );
  //                       //         if (
  //                       //           response.status == 200 ||
  //                       //           response.status == 201
  //                       //         ) {
  //                       //           setTimeout(() => {
  //                       //             dispatch(getUploadDocsPaytendSide("selfie"))
  //                       //               .then((responseData) => {
  //                       //                 console.log(
  //                       //                   "getUploadDocsPaytendSide res==selfie-999=>>",
  //                       //                   responseData
  //                       //                 );
  //                       //                 setUploadLoader(false);
  //                       //               })
  //                       //               .catch((err) => {
  //                       //                 if (err?.response?.status === 504) {
  //                       //                   // setModalVisible(true);
  //                       //                   Actions.pop();
  //                       //                 }
  //                       //                 console.log(
  //                       //                   "getUploadDocsPaytendSide err==selfie-999=>>",
  //                       //                   err
  //                       //                 );
  //                       //               });
  //                       //           }, 5000);
  //                       //         }
  //                       //       })
  //                       //       .catch((err) => {
  //                       //         console.log(
  //                       //           "getUploadDocsPaytendSide err==-555=>>",
  //                       //           err
  //                       //         );
  //                       //         setUploadLoader(false);
  //                       //       });
  //                       //   }, 5000);
  //                       // }
  //                     });
  //                 }
  //               } else {
  //                 Actions.currentScene != "UploadFiles" &&
  //                   Actions.push("UploadFiles", {
  //                     auditStatus: response,
  //                     documentType: res,
  //                     nonEaa: true,
  //                   });
  //               }
  //             })
  //             .catch((err) => {
  //               console.log("getCardHolderDetails=-=err555=-", err);
  //             });
  //         }
  //       }
  //       // Actions.currentScene != "UploadFiles" && Actions.push("UploadFiles");
  //     })
  //     .catch((err) => {
  //       console.log("----getCardHolderDetails- err--666>", err);
  //     });
  // };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <>
        <View style={styles.viewStyle}>
          <SimpleHeader
            titleName={"Review Information"}
            backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
            // titleName={'kjjkh'}
            titleStyle={styles.titleStyles}
            onBackPress={() => {
              Actions.pop();
            }}
          />
        </View>
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.subContainer}>
            <View>
              <TextComponent
                title={strings.enterAccountDetails.firstName}
                value={userInfo?.first_name}
              />
              <TextComponent
                title={strings.enterAccountDetails.lastName}
                value={userInfo?.last_name}
              />
              <TextComponent
                title={strings.enterAccountDetails.dateOfBirth}
                value={userInfo?.dob}
              />
              <TextComponent
                title={strings.enterAccountDetails.country}
                value={countryName}
              />
              <TextComponent
                title={strings.enterAccountDetails.gender}
                value={userInfo?.gender}
              />
              <TextComponent
                title={strings.enterAccountDetails.address}
                value={userInfo?.address}
              />
              <TextComponent
                title={strings.enterAccountDetails.postcode}
                value={userInfo?.postcode}
              />
              <TextComponent
                title={strings.enterAccountDetails.town}
                value={userInfo?.city}
              />
            </View>
            {renderError()}
            <View>
              <ButtonPrimary
                style={{ marginVertical: 30 }}
                title={strings.enterAccountDetails.next}
                onPress={() => {
                  submitButtonClicked();
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        <Loader isLoading={isCardHolderLoading || loader || uploadLoader} />
      </>
    </SafeAreaView>
  );
};

export default UserDetails;
