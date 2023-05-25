/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  Appearance,
  AppState,
} from "react-native";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import useStyles from "./VerificationStyle";
import {
  SubHeaderLinks,
  InputField,
  ButtonPrimary,
  PhoneNumberInput,
  HeaderCancel,
  CountryList,
  Header,
  Wrap,
  Loader,
} from "../../common";
import * as constants from "../../../Constants";
import Moment from "moment";
import SNSMobileSDK from "@sumsub/react-native-mobilesdk-module";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useDispatch, useSelector } from "react-redux";
import { countryFlags } from "../../common/CountryFlags";
import {
  kycFirstFormUpdate,
  submitKycDetails,
  resetKYCForm,
  getSumSubToken,
  updateSumSubApplicantId,
  getProfile1,
  postSumSubToken,
} from "../../../Redux/Actions";
import Singleton from "../../../Singleton";
import END_POINT from "../../../EndPoints";
import DatePicker from "react-native-date-picker";
import moment from "moment";
// import {color} from 'react-native-reanimated';
import SimpleHeader from "../../common/SimpleHeader";
import SelectDropdown from "react-native-select-dropdown";
import BorderLine from "../../common/BorderLine";

let genderData = [
  { id: 0, genderName: "Male" },
  { id: 1, genderName: "Female" },
];
let isPop = false;
var date1 = new Date();
date1.setFullYear(date1.getFullYear() - 18);
let previousState = "";
const Verification = (props) => {
  const styles = useStyles(ThemeManager);
  const dispatch = useDispatch();
  const kycFirst = useSelector((state) => state.kycFirst);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    kycFirst.kycCountry ? kycFirst.kycCountry : "Select Country"
  );
  const [selectedDob, setSelectedDob] = useState("DD/MM/YYYY");
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("🇺🇸");
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [userData, setuserData] = useState(null);
  const [resubmit, setresubmit] = useState(false);
  const [isUpdate, setisUpdate] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [genderValue, setGenderValue] = useState("Male");
  const [genderIndex, setGenderIndex] = useState(0);

  const [loader, setLoader] = useState(true);
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date().setFullYear(date1.getFullYear() - 18)
  );
  const handleAppStateChange = (nextAppState) => {
    console.log("nextAppState------++++---", nextAppState);
    if (previousState == "background" && nextAppState == "active") {
      console.log("nextAppState------++++---", nextAppState);
      setTheme(Appearance.getColorScheme());
    }
    previousState = nextAppState;
    // console.log("fgd0------++---", previousState);
  };
  useEffect(() => {
    isPop = false;
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log(colorScheme);
      setTheme(colorScheme);
    });
    const subscriptionAppState = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    dispatch(getProfile1());
    props.navigation.addListener("didFocus", () => {
      Singleton.getInstance()
        .getData(constants.USER_DATA)
        .then((res) => {
          console.log("USER_DATA=-=-=-=-=---->>", res);
          if (res != null && JSON.parse(res).profiles != null) {
            let uData = JSON.parse(res);
            console.log(
              "USER_DATA----===-==-=---",
              JSON.parse(res)?.profiles,
              uData?.country
            );
            const getProfileStatus = JSON.parse(res).labels.filter((item) => {
              return item.key === "profile";
            });
            // if (JSON.parse(res)?.level == 2 && getProfileStatus[0] == null) {
            //   setProfileCompleted(false);
            //   setLoader(false);
            // } else {
            //   setProfileCompleted(true);
            // }
            // if (JSON.parse(res)?.profiles[0]?.gender != null) {
            //   setProfileCompleted(true);
            // } else {
            //   setProfileCompleted(false);
            //   setLoader(false);
            // }
            if (JSON.parse(res)?.profiles.length > 0) {
              setisUpdate(true);
              console.log("COUNTRY------==-=-=---setisUpdate");
              dispatch(
                kycFirstFormUpdate({
                  prop: "kycFirstName",
                  value: JSON.parse(res)?.profiles[0]?.first_name,
                })
              );
              dispatch(
                kycFirstFormUpdate({
                  prop: "kycLastName",
                  value: JSON.parse(res)?.profiles[0]?.last_name,
                })
              );
              dispatch(
                kycFirstFormUpdate({
                  prop: "kycCountryId",
                  value: JSON.parse(res)?.profiles[0]?.country,
                })
              );
              console.log(
                "date of birth=-=-",
                JSON.parse(res)?.profiles[0]?.dob
              );
              let dateBirth = JSON.parse(res)?.profiles[0]?.dob;
              console.log("dateBirth------dateBirth", dateBirth);
              if (dateBirth != null) {
                let value = Moment(dateBirth).format("DD-MM-YYYY");
                console.log("dateBirth------==-=-=---value", value);
                dispatch(kycFirstFormUpdate({ prop: "kycDob", value }));
              } else {
                dispatch(
                  kycFirstFormUpdate({ prop: "kycDob", value: "DD/MM/YYYY" })
                );
              }
              let genderVal = JSON.parse(res)?.profiles[0]?.gender;
              console.log("genderVal------==-=-=---genderVal", genderVal);
              setGenderValue(genderVal ? genderVal : "Male");
              // let kycGenderName = selectedItem
              if (genderVal) {
                setGenderIndex(genderVal == "Male" ? 0 : 1);
              } else {
                setGenderIndex(0);
              }
              let add = JSON.parse(res)?.profiles[0]?.address;
              dispatch(kycFirstFormUpdate({ prop: "kycAddress", value: add }));
              let zip = JSON.parse(res)?.profiles[0]?.postcode;
              dispatch(kycFirstFormUpdate({ prop: "kycZip", value: zip }));
              let city = JSON.parse(res)?.profiles[0]?.city;
              dispatch(kycFirstFormUpdate({ prop: "kycCity", value: city }));
            } else {
              console.log("COUNTRY------==-=-=---setisUpdateelse");

              setisUpdate(false);
            }
            setuserData(uData);

            uData.labels.filter((item) => {
              if (item.value == "pending" && item.key == "document") {
                setresubmit(true);
              }
            });

            console.log(
              "COUNTRY-uData.profiles[0]?.country",
              uData.profiles[0]?.country
            );
            console.log(
              "COUNTRY-uData?.profiles?.country",
              uData?.profiles[0]?.country
            );
            if (uData?.profiles[0]?.country) {
              let countryData = countryFlags.find(
                (res) => res?.countryCode == uData.profiles[0]?.country
              );
              console.log("COUNTRY------", countryData);

              dispatch(
                kycFirstFormUpdate({
                  prop: "kycCountry",
                  value: countryData?.countryNameEn,
                })
              );
            }
            console.log(" JSON.parse(res).profiles.first_name,");

            dispatch(kycFirstFormUpdate({ prop: "kycError", value: "" }));

            dispatch(kycFirstFormUpdate({ prop: "kycLoading", value: false }));
            // dispatch(
            //   kycFirstFormUpdate({
            //     prop: 'kycMiddleName',
            //     value: JSON.parse(res).profiles.middle_name,
            //   }),
            // );
            // dispatch(
            //   kycFirstFormUpdate({
            //     prop: 'kycLastName',
            //     value: JSON.parse(res).profiles.last_name,
            //   }),
            // );
            // dispatch(
            //   kycFirstFormUpdate({
            //     prop: 'kycDob',
            //     value: JSON.parse(res).profiles.dob,
            //   }),
            // );
            setLoader(false);
          } else {
            setisUpdate(false);
            alert(2);
          }
        });
    });
    return () => {
      subscription.remove();
      subscriptionAppState.remove();
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
      dispatch(
        kycFirstFormUpdate({
          prop: "kycCity",
          value: "",
        })
      );
      dispatch(
        kycFirstFormUpdate({
          prop: "kycZip",
          value: "",
        })
      );
      dispatch(
        kycFirstFormUpdate({
          prop: "kycAddress",
          value: "",
        })
      );
      dispatch(
        kycFirstFormUpdate({
          prop: "kycAddress",
          value: "",
        })
      );
      setGenderValue("Male");
      // let kycGenderName = selectedItem
      //   ? selectedItem.genderName
      //   : "male";
      // dispatch(
      //   kycFirstFormUpdate({
      //     prop: "kycGender",
      //     kycGenderName,
      //   })
      // );
      setGenderIndex(0);
      // dispatch(
      //   kycFirstFormUpdate({
      //     prop: "kycLastName",
      //     value: "",
      //   })
      // );
    };
  }, []);

  const onSearch = (value) => {
    setCountryData(
      searchData.filter(
        (i) =>
          i.countryNameEn.toLowerCase().includes(value.toLowerCase()) ||
          i.countryCallingCode.toLowerCase().includes(value.toLowerCase()) ||
          i?.countryCallingCode
            ?.toLowerCase()
            .includes(value.replace("+", "").toLowerCase())
      )
    );
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

  const handleDatePicked = (date) => {
    console.warn("A date has been picked: ", date);

    let value = Moment(date).format("DD/MM/YYYY");

    console.warn("A date has been picked: ", value);

    dispatch(kycFirstFormUpdate({ prop: "kycDob", value }));
    datePickerCancel();
  };

  const datePickerCancel = () => {
    let value = false;
    dispatch(kycFirstFormUpdate({ prop: "KycShowDatePicker", value }));
  };

  const dobButtonClicked = () => {
    let value = true;
    dispatch(kycFirstFormUpdate({ prop: "KycShowDatePicker", value }));
  };
  const renderDatePicker = () => {
    var date1 = new Date();
    date1.setFullYear(date1.getFullYear() - 18);
    return (
      <DatePicker
        modal
        fadeToColor="white"
        textColor={theme == "dark" ? "white" : "black"}
        open={showDatePicker}
        mode="date"
        // androidVariant="iosClone"
        date={date1}
        maximumDate={date1}
        // theme="light"
        theme={theme}
        onConfirm={(date) => {
          let value = Moment(date).format("DD-MM-YYYY");
          dispatch(kycFirstFormUpdate({ prop: "kycDob", value }));
          dispatch(kycFirstFormUpdate({ prop: "kycLoading", value: false }));
          setShowDatePicker(false);
        }}
        onCancel={() => {
          setShowDatePicker(false);
          dispatch(kycFirstFormUpdate({ prop: "kycLoading", value: false }));
        }}
      />
    );
  };
  // const renderDatePicker = () => {
  //   var date1 = new Date();
  //   date1.setFullYear(date1.getFullYear() - 18);

  //   return (
  //     <Modal
  //       animationType="slide"
  //       transparent={true}
  //       visible={showDatePicker}
  //       onRequestClose={() => {
  //         setShowDatePicker(false);
  //       }}
  //     >
  //       <Wrap
  //         style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  //         screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
  //         bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
  //       >
  //         <TouchableOpacity
  //           onPress={() => {
  //             setShowDatePicker(false);
  //           }}
  //           style={{
  //             backgroundColor: "rgba(255,255,255,0.1)",
  //             flex: 1,
  //             justifyContent: "center",
  //           }}
  //         ></TouchableOpacity>
  //         <View
  //           style={{
  //             backgroundColor: ThemeManager.colors.DashboardBG,
  //             marginHorizontal: 15,
  //           }}
  //         >
  //           <DatePicker
  //             // modal
  //             // fadeToColor="white"
  //             // open={showDatePicker}
  //             // mode="date"
  //             // date={date1}
  //             // maximumDate={date1}
  //             // theme="light"
  //             // onConfirm={(date) => {
  //             //   let value = Moment(date).format("DD-MM-YYYY");
  //             //   dispatch(kycFirstFormUpdate({ prop: "kycDob", value }));
  //             //   dispatch(
  //             //     kycFirstFormUpdate({ prop: "kycLoading", value: false })
  //             //   );
  //             //   setShowDatePicker(false);
  //             // }}
  //             // onCancel={() => {
  //             //   setShowDatePicker(false);
  //             //   dispatch(
  //             //     kycFirstFormUpdate({ prop: "kycLoading", value: false })
  //             //   );
  //             // }}
  //             fadeToColor="white"
  //             mode="date"
  //             date={dateOfBirth}
  //             maximumDate={date1}
  //             // theme={ThemeManager.colors.themeColor === "dark" ? "dark" : "light"}
  //             // textColor={ThemeManager.colors.textColor1}
  //             textColor={ThemeManager.colors.textColor}
  //             // onConfirm={(date) => {
  //             //   let value = Moment(date).format("YYYY-MM-DD");
  //             //   setfromDate(value);
  //             //   setMinimumToDate(date);
  //             //   setShowDatePicker(false);
  //             // }}
  //             onDateChange={(date) => {
  //               let value = Moment(date).format("DD-MM-YYYY");
  //               setDateOfBirth(value);

  //               // let value = Moment(date).format("YYYY-MM-DD");
  //               // setMainFromDate(date);
  //               // setfromDate(value);
  //               // setMinimumToDate(date);
  //               // // setShowDatePicker(false);
  //             }}
  //           />
  //           <View
  //             style={{
  //               justifyContent: "center",
  //               alignItems: "center",
  //               // flexDirection: 'row',
  //               marginHorizontal: 30,
  //               marginVertical: 20,
  //             }}
  //           >
  //             {/* <TouchableOpacity
  //                 onPress={() => {
  //                   setShowDatePicker(false);
  //                 }}
  //                 style={{
  //                   height: 40,
  //                   backgroundColor: ThemeManager.colors.SwapInput,
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                   width: "40%",
  //                   borderRadius: 6,
  //                 }}
  //               >
  //                 <Text
  //                   style={{
  //                     fontFamily: Fonts.regular,
  //                     fontSize: 14,
  //                     color: ThemeManager.colors.textColor,
  //                   }}
  //                 >
  //                   {"Cancel"}
  //                 </Text>
  //               </TouchableOpacity> */}
  //             <TouchableOpacity
  //               onPress={() => {
  //                 dispatch(
  //                   kycFirstFormUpdate({ prop: "kycDob", value: dateOfBirth })
  //                 );
  //                 dispatch(
  //                   kycFirstFormUpdate({ prop: "kycLoading", value: false })
  //                 );
  //                 setShowDatePicker(false);
  //                 setShowDatePicker(false);
  //               }}
  //               style={{
  //                 height: 40,
  //                 backgroundColor: ThemeManager.colors.SwapInput,
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 width: "40%",
  //                 borderRadius: 6,
  //               }}
  //             >
  //               <Text
  //                 style={{
  //                   fontFamily: Fonts.regular,
  //                   fontSize: 14,
  //                   color: ThemeManager.colors.textColor,
  //                 }}
  //               >
  //                 {"Done"}
  //               </Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //         <TouchableOpacity
  //           onPress={() => {
  //             setShowDatePicker(false);
  //           }}
  //           style={{
  //             backgroundColor: "rgba(255,255,255,0.1)",
  //             flex: 1,
  //             justifyContent: "center",
  //           }}
  //         ></TouchableOpacity>
  //       </Wrap>
  //     </Modal>
  //   );
  // };
  const submitButtonClicked = () => {
    dispatch(kycFirstFormUpdate({ prop: "kycLoading", value: false }));

    const {
      kycFirstName,
      kycGender,
      kycMiddleName,
      kycLastName,
      kycDob,
      kycCountry,
      kycCountryId,
      kycZip,
      kycCity,
      KycShowDatePicker,
      kycAddress,
    } = kycFirst;

    let param = {
      kycFirstName: kycFirstName,
      kycGender: kycGender,
      kycMiddleName: kycMiddleName,
      kycLastName: kycLastName,
      kycDob: kycDob,
      kycCountry: kycCountry,
      kycCountryId: kycCountryId,
      kycZip: kycZip,
      kycCity: kycCity,
      kycAddress: kycAddress,
    };
    // if (param != null) {
    //   Singleton.getInstance().saveData(
    //     constants.VERIFY_INFO_STEP,
    //     JSON.stringify(param)
    //   );
    // }

    // console.log("verification kycCountryId-=-=-=-=->>>", kycCountryId);
    // console.log("verification kycGender-=-=-=-=->>>", kycGender);

    let isEdit = isUpdate;
    dispatch(
      submitKycDetails({
        kycFirstName,
        kycGender,

        // kycMiddleName,
        kycLastName,
        kycDob,
        kycCountry,
        kycCountryId,
        kycZip,
        kycCity,
        KycShowDatePicker,
        isEdit,
        kycAddress,
        genderValue,
      })
    )
      .then((res) => {
        // setisUpdate(true);
        // console.log('RESPONSE-----', res.token);
        setLoader(false);
        dispatch(getSumSubToken())
          .then((res) => {
            console.log("getSumSubToken-RESPONSE-----", res);
            //_act-b1bb0a12-1e3e-4c34-b2b6-2c036a5b0426
            renderSumSub(res.token);
          })
          .catch((err) => {
            console.log("getSumSubToken-ERR----", err);
          });
      })
      .catch((err) => {
        console.log("getSumSubToken-ERR_PROFILE----", err, isEdit);
      });
  };
  const saveButtonClicked = () => {
    dispatch(kycFirstFormUpdate({ prop: "kycLoading", value: false }));

    const {
      kycFirstName,
      kycGender,
      kycMiddleName,
      kycLastName,
      kycDob,
      kycCountry,
      kycCountryId,
      kycZip,
      kycCity,
      KycShowDatePicker,
      kycAddress,
    } = kycFirst;

    let param = {
      kycFirstName: kycFirstName,
      kycGender: kycGender,
      kycMiddleName: kycMiddleName,
      kycLastName: kycLastName,
      kycDob: kycDob,
      kycCountry: kycCountry,
      kycCountryId: kycCountryId,
      kycZip: kycZip,
      kycCity: kycCity,
      kycAddress: kycAddress,
    };
    // if (param != null) {
    //   Singleton.getInstance().saveData(
    //     constants.VERIFY_INFO_STEP,
    //     JSON.stringify(param)
    //   );
    // }

    // console.log("verification kycCountryId-=-=-=-=->>>", kycCountryId);
    // console.log("verification kycGender-=-=-=-=->>>", kycGender);

    let isEdit = isUpdate;
    dispatch(
      submitKycDetails({
        kycFirstName,
        kycGender,

        // kycMiddleName,
        kycLastName,
        kycDob,
        kycCountry,
        kycCountryId,
        kycZip,
        kycCity,
        KycShowDatePicker,
        isEdit,
        kycAddress,
        genderValue,
      })
    )
      .then((res) => {
        // setisUpdate(true);
        console.log("saveButtonClicked-----", res);
        Singleton.getInstance().showMsg("Profile updated successfully.");
        setLoader(false);
        // dispatch(getSumSubToken())
        //   .then((res) => {
        //     console.log("getSumSubToken-RESPONSE-----", res);
        //     //_act-b1bb0a12-1e3e-4c34-b2b6-2c036a5b0426
        //     renderSumSub(res.token);
        //   })
        //   .catch((err) => {
        //     console.log("getSumSubToken-ERR----", err);
        //   });
      })
      .catch((err) => {
        console.log("saveButtonClicked-ERR_PROFILE----", err);
      });
  };
  const getSumSubDetails = () => {
    dispatch(getSumSubToken())
      .then((res) => {
        // console.log("getSumSubDetails==RESPONSE----res-", res);
        //_act-b1bb0a12-1e3e-4c34-b2b6-2c036a5b0426
        renderSumSub(res.token);
      })
      .catch((err) => {
        console.log("getSumSubToken==ERR----", err);
      });
  };
  function renderSumSub(accessToken) {
    console.log("dsa======", accessToken);
    let apiUrl = "https://api.sumsub.com"; //'https://test-api.sumsub.com'; // or https://api.sumsub.com
    let flowName = "msdk-basic-kyc"; // or set up your own with the dashboard
    let snsMobileSDK = SNSMobileSDK.Builder(apiUrl)
      .withAccessToken(accessToken, () => {
        console.log("sumsub access token---->>", accessToken);
        return Singleton.getInstance()
          .getDataSecure(constants.ACCESS_TOKEN)
          .then((res) => {
            fetch(END_POINT.BASE_URL + END_POINT.GET_SUM_SUB_TOKEN, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                // Authorization: 'Bearer ' + res,
                Authorization: "Bearer " + res,
              },
            })
              .then((resp) => {
                setLoader(false);
                // return a fresh token from here
                console.log("renderSumSub------resp-", resp);
                return resp.token;
              })
              .catch((err) => {
                console.log("renderSumSub=-=-=-=err", JSON.stringify(err));
              });
          });
      })
      .withHandlers({
        // Optional callbacks you can use to get notified of the corresponding events
        onStatusChanged: (event) => {
          console.log("onStatusChanged11: =-=-=-=-=-=>>>>>[event", event);
          console.log(
            "onStatusChanged11: =-=-=-=-=-=>>>>>[event",
            event.newStatus
          );
          console.log("onStatusC", event.newStatus === ["Pending"]);
          console.log("onStatusC=-=-=", event.newStatus === "Pending");

          console.log(
            "onStatusChanged11: =-=-=-=-=-=>>>>>[" +
            event.prevStatus +
            "] => =-=-=-=-=-=-=-=-[" +
            event.newStatus +
            "]"
          );

          if (event.newStatus === "Pending") {
            // Actions.reset('Profile');
            // Actions.pop();
            console.log("check on close click=-=-=-");
            isPop = true;
            Actions.popTo("Profile");
            snsMobileSDK.dismiss();

            // Actions.pop();
            // Actions.reset('Profile');
          }
        },
        onLog: (event) => {
          console.log("onLog-=======--www----:", event);

          console.log("onLog-=======------:", event.message);
          if (event.message == "IdensicMobileSDK dismissed") {
            Actions.popTo("Profile");
          }
          if (event.message.includes("SDK is prepared. Applicant - ")) {
            var applicantId = event.message.replace(
              "SDK is prepared. Applicant - ",
              ""
            );
            console.log("Sd===========", applicantId);
            dispatch(updateSumSubApplicantId(applicantId));
          }
          if (
            event.message ==
            "Cancel verification with reason - SuccessTermination(reason=null)"
          ) {
            console.log("=-=-close.status=-=event.message", event.message);
            if (!isPop) {
              console.log("check on close click=-=2222-=-");
              Actions.popTo("Profile");
              snsMobileSDK.dismiss();
              // Actions.reset('Profile');
              // Actions.pop();
              // Actions.pop();
            }
          }
        },
        onEvent: (event) => {
          console.log("onEvent111: " + JSON.stringify(event));
        },
      })
      .withDebug(true)
      .withLocale("en") // Optional, for cases when you need to override system locale
      .build();

    snsMobileSDK
      .launch()
      .then((result) => {
        console.log("SumSub SDK State111ddd---: " + JSON.stringify(result));
        let close = JSON.stringify(result);
        if (close.status === "TemporarilyDeclined") {
          console.log("=-=-close.status=-=", close.status);
          console.log("check on close click=-=44444-=-");
          Actions.popTo("Profile");
          snsMobileSDK.dismiss();
          // Actions.pop();
          // Actions.pop();
          // Actions.reset('Profile');
        }
      })
      .catch((err) => {
        console.log("SumSub SDK Error011: ", err);
      });
  }

  // console.log(theme);
  const countryListData = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={() => {
          setModalVisible(false);
          setSelectedCountry(item.countryNameEn);
          setSelectedCountryFlag(item.flag);
          dispatch(
            kycFirstFormUpdate({
              prop: "kycCountry",
              value: item.countryNameEn,
            })
          );

          dispatch(
            kycFirstFormUpdate({
              prop: "kycCountryId",
              value: item.countryCode,
            })
          );
          setCountryData(countryFlags);
        }}
      >
        <View style={styles.flagView}>
          <Text style={styles.flagSymbol}>{item.flag}</Text>
        </View>
        <Text style={styles.countryName}>{item.countryNameEn}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {profileCompleted === false ? (
        <>
          {loader ? (
            <Loader isLoading={true} />
          ) : (
            <>
              <View style={styles.headerView}>
                <SimpleHeader
                  titleName={"Verification"}
                  backImageColor={styles.bgColor}
                  // titleName={'kjjkh'}
                  titleStyle={styles.titleStyle}
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
                <View style={{ justifyContent: "space-between", flex: 1 }}>
                  <View>
                    {/* <Header
            mainView={{paddingHorizontal: 16}}
            customCenterTitle={{fontSize: 18}}
            leftImage={{uri: Images.icon_back}}
            titleCenter="Verification"
            btnTextLeft=" "
            btnTextRight=" "
            leftButtonClicked={() => {
              Actions.pop();
            }}
          /> */}
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.firstName}
                    </Text>
                    <InputField
                      editable={true}
                      value={kycFirst.kycFirstName}
                      title={strings.enterAccountDetails.firstNamePlaceholder}
                      onChangeText={(text) => {
                        if (/^[a-zA-Z]+$/.test(text) || text == "") {
                          let value = text;
                          dispatch(
                            kycFirstFormUpdate({
                              prop: "kycFirstName",
                              value,
                            })
                          );
                        } else {
                          // Alert.alert(
                          //   constants.APP_NAME_CAPS,
                          //   "First name accept only alphabets."
                          // );
                          Singleton.getInstance().showError(
                            "First name accept only alphabets."
                          );
                        }
                      }}
                      maxlength={100}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                      }}
                    />
                    {/* <Text style={styles.inputTitle}>Middle Name</Text>
                  <InputField
                    editable={true}
                    value={kycFirst.kycMiddleName}
                    title="Enter Middle name"
                    onChangeText={(text) => {
                      if (/^[a-zA-Z]+$/.test(text) || text == "") {
                        let value = text;
                        dispatch(
                          kycFirstFormUpdate({
                            prop: "kycMiddleName",
                            value,
                          })
                        );
                      } else {
                        Alert.alert(
                          constants.APP_NAME,
                          "Middle name accept only alphabets."
                        );
                      }
                    }}
                    maxlength={100}
                    placeholderTextColor={
                      ThemeManager.colors.placeholderTextColor
                    }
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                    }}
                  /> */}
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.lastName}
                    </Text>
                    <InputField
                      editable={true}
                      title={strings.enterAccountDetails.lastNamePlaceholder}
                      value={kycFirst.kycLastName}
                      onChangeText={(text) => {
                        if (/^[a-zA-Z]+$/.test(text) || text == "") {
                          let value = text;
                          dispatch(
                            kycFirstFormUpdate({ prop: "kycLastName", value })
                          );
                        } else {
                          // Alert.alert(
                          //   constants.APP_NAME_CAPS,
                          //   "Last name accept only alphabets."
                          // );
                          Singleton.getInstance().showError(
                            "Last name accept only alphabets."
                          );
                        }
                      }}
                      maxlength={100}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                      }}
                    />
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.dateOfBirth}
                    </Text>
                    <InputField
                      editable={false}
                      value={kycFirst.kycDob ? kycFirst.kycDob : "DD/MM/YYYY"}
                      image={{ uri: Images.icon_selectCountry_RightArrow }}
                      rightImageStyle={{ resizeMode: "contain" }}
                      Next={() => {
                        setShowDatePicker(true);
                        dobButtonClicked();
                      }}
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                      }}
                      textInactiveStyle={{
                        color: ThemeManager.colors.textColor1,
                      }}
                    />
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.country}
                    </Text>
                    <InputField
                      editable={false}
                      value={
                        kycFirst.kycCountry
                          ? kycFirst.kycCountry
                          : "Select country"
                      }
                      image={{ uri: Images.icon_selectCountry_RightArrow }}
                      rightImageStyle={{ resizeMode: "contain" }}
                      Next={() => {
                        setModalVisible(true);
                      }}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                      }}
                      textInactiveStyle={{
                        color: ThemeManager.colors.textColor1,
                      }}
                    />
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.gender}
                    </Text>
                    <View style={{ marginHorizontal: 20 }}>
                      <SelectDropdown
                        key={"first"}
                        data={genderData}
                        dropdownOverlayColor={"transparent"}
                        defaultValueByIndex={genderIndex ? genderIndex : 0}
                        onSelect={(selectedItem, index) => {
                          setGenderValue(
                            selectedItem ? selectedItem.genderName : "Male"
                          );

                          setGenderIndex(index == -1 ? 0 : index);
                        }}
                        buttonStyle={styles.buttonViewStyle}
                        renderCustomizedButtonChild={(selectedItem, index) => {
                          return (
                            <View style={[styles.dropdown3BtnChildStyle]}>
                              <Text
                                style={[
                                  styles.dropdown3BtnTxt,
                                  {
                                    color: ThemeManager.colors.textColor1,
                                    textTransform: "capitalize",
                                    marginLeft: 5,
                                  },
                                ]}
                              >
                                {selectedItem
                                  ? selectedItem.genderName
                                  : genderValue}
                              </Text>

                              <Image
                                source={{ uri: Images.icon_dropDown }}
                                style={styles.dropDownIcon}
                              />
                            </View>
                          );
                        }}
                        // dropdownStyle={styles.dropdown3DropdownStyle}
                        dropdownStyle={styles.bgDropdownColor}
                        // rowStyle={styles.dropdown3RowStyle}
                        rowStyle={styles.bgDropdownColor}
                        renderCustomizedRowChild={(item, index) => {
                          return (
                            <>
                              <View style={styles.customView}>
                                <Text
                                  style={[
                                    styles.dropdown3RowTxt,
                                    {
                                      color:
                                        genderIndex === index
                                          ? ThemeManager.colors
                                            .selectedTextColor
                                          : ThemeManager.colors.textColor1,
                                      textTransform: "capitalize",
                                    },
                                  ]}
                                >
                                  {item?.genderName}
                                </Text>
                              </View>
                            </>
                          );
                        }}
                      />
                    </View>
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.address}
                    </Text>
                    <InputField
                      editable={true}
                      title={strings.enterAccountDetails.addressPlaceholder}
                      value={kycFirst.kycAddress}
                      onChangeText={(text) => {
                        let value = text;
                        dispatch(
                          kycFirstFormUpdate({ prop: "kycAddress", value })
                        );
                      }}
                      maxlength={100}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      customContainerStyle={styles.inputBg}
                    />
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.postcode}
                    </Text>
                    <InputField
                      editable={true}
                      title={strings.enterAccountDetails.postcodePlaceholder}
                      value={kycFirst.kycZip}
                      onChangeText={(text) => {
                        let value = text;

                        if (constants.ALPHANUMERIC_SPACE_REGEX.test(value)) {
                          dispatch(
                            kycFirstFormUpdate({ prop: "kycZip", value })
                          );
                        }
                      }}
                      autoCapitalize={"characters"}
                      defaulEmailInput={{ textTransform: "uppercase" }}
                      maxlength={10}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                      }}
                    />
                    <Text style={styles.inputTitle}>
                      {strings.enterAccountDetails.town}
                    </Text>
                    <InputField
                      editable={true}
                      title={strings.enterAccountDetails.townPlaceholder}
                      value={kycFirst.kycCity}
                      onChangeText={(text) => {
                        let value = text;
                        dispatch(
                          kycFirstFormUpdate({ prop: "kycCity", value })
                        );
                      }}
                      maxlength={100}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                        marginBottom: 20,
                      }}
                    />
                  </View>
                  {renderError()}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 30,
                    }}
                  >
                    <ButtonPrimary
                      style={{ width: 120, marginRight: 10 }}
                      title={strings.enterAccountDetails.save}
                      onPress={() => {
                        // Actions.SelectCountry();
                        saveButtonClicked();
                      }}
                    />
                    <ButtonPrimary
                      style={{ width: 120, marginLeft: 10 }}
                      title={strings.enterAccountDetails.next}
                      onPress={() => {
                        // Actions.SelectCountry();
                        submitButtonClicked();
                      }}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
              {renderDatePicker()}
              <Loader isLoading={kycFirst.kycLoading} />
              <Modal
                animationType="Slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                  setCountryData(countryFlags);
                }}
              >
                <Wrap
                  style={{ backgroundColor: ThemeManager.colors.modalBox }}
                  screenStyle={[
                    styles.screenStyle,
                    { backgroundColor: "transparent" },
                  ]}
                  bottomStyle={{
                    backgroundColor: ThemeManager.colors.DashboardBG,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: ThemeManager.colors.modalBox,
                      flex: 1,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View>
                        <View style={styles.searchContainer}>
                          <View
                            style={[
                              styles.searchView,
                              // {
                              //   backgroundColor: ThemeManager.colors.SwapInput,
                              // },
                            ]}
                          >
                            <Image
                              source={{ uri: ThemeManager.ImageIcons.icon_search_text }
                              }
                              style={styles.searchIcon}
                            />
                            <TextInput
                              value={searchData}
                              onChangeText={onSearch}
                              style={styles.inputStyle}
                              placeholder={strings.currencyDetails.search}
                              placeholderTextColor={
                                ThemeManager.colors.placeholderTextColor
                              }
                            />
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                setModalVisible(false);
                                setCountryData(countryFlags);
                              }}
                            >
                              <Text style={styles.cancelText}>
                                {strings.currencyDetails.cancel}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View style={{ marginHorizontal: 15, flex: 1 }}>
                        <Text style={styles.countryNameText}>
                          {strings.location.location}
                        </Text>
                        <BorderLine />
                        <Text style={styles.selectedCountryText}>
                          {selectedCountry}
                        </Text>
                        <Text style={styles.countryNameText}>
                          {strings.location.countryRegion}
                        </Text>
                        <BorderLine />
                        <ScrollView
                          bounces={false}
                          keyboardShouldPersistTaps="handled"
                        >
                          {countryData.map(countryListData)}
                          <View>
                            {countryData.length == 0 && (
                              <Text style={styles.notFound}>
                                Country not found
                              </Text>
                            )}
                          </View>
                          <View style={{ height: 50 }}></View>
                        </ScrollView>
                      </View>
                    </View>
                  </View>
                </Wrap>
              </Modal>
            </>
          )}
        </>
      ) : (
        <>
          {/* <View style={{marginHorizontal: 20, height: 40, marginBottom: 15}}>
            <SimpleHeader
              titleName={'Verification'}
              backImageColor={{tintColor: ThemeManager.colors.headTxt}}
              // titleName={'kjjkh'}
              titleStyle={{
                fontSize: 18,
                fontFamily: Fonts.medium,
                color: ThemeManager.colors.textColor,
                // marginLeft: 10,
              }}
              onBackPress={() => {
                Actions.pop();
              }}
            />
          </View> */}
          {getSumSubDetails()}
        </>
      )}
    </SafeAreaView>
  );
};

export default Verification;
