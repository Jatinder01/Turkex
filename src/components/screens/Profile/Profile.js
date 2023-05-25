/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Alert,
  Share,
  Platform,
  Modal,
  StyleSheet,
  TouchableOpacity as TouchableOpacityNative,
  RefreshControl,
} from "react-native";

import { Wrap } from "../../common/Wrap";
import {
  ButtonPrimary,
  Header,
  Button,
  InputVerification,
  Loader,
} from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { strings } from "../../../../Localization";
import { string } from "prop-types";
import Singleton from "../../../Singleton";
import { useDispatch, useSelector } from "react-redux";
import SNSMobileSDK from "@sumsub/react-native-mobilesdk-module";
// import AsyncStorage from "@react-native-community/async-storage";
import {
  logoutUser,
  getProfile1,
  updateSumSubApplicantId,
  deleteUserAccountAction,
  changeThemeAction,
  getSumSubToken,
  resetFavMarketList,
  getNotificationDataOnly,
} from "../../../Redux/Actions";
import * as constants from "../../../Constants";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-simple-toast";
import SimpleHeader from "../../common/SimpleHeader";
import { showMessage, hideMessage } from "react-native-flash-message";
import END_POINT from "../../../EndPoints";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { EventRegister } from "react-native-event-listeners";
let coinToDollar = 0;
const Profile = (props) => {
  const styles = useStyles(ThemeManager);
  const [userData, setuserData] = useState({});
  const [isSecureClick, setSecureClick] = useState(false);
  // const AuthReducer = useSelector((state) => state.AuthReducer);
  const [darkTheme, setDarkTheme] = useState(false);
  const [darkModeOn, setDarkModeOn] = useState(0);
  const [userVerified, setUserVerified] = useState(false);
  const dispatch = useDispatch();
  const [isSelectedMode, setSelectedMode] = useState(" ");

  const [isProfile, setisProfile] = useState(false);
  const [isDocumentReject, setisDocumentReject] = useState(false);
  const [selectedIndex, setselectedIndex] = useState(0);
  const [isKycVerified, setisKycVerified] = useState(false);
  const [check2fa, setCheck2fa] = useState(false);
  const [code_2fa, setCode_2fa] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [errorRemove, setErrorRemove] = useState("");
  const [balanceStatus, setBalanceStatus] = useState(false);
  const [kycPending, setKycPending] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [showSumsub, setShowSumsub] = useState(false);
  const [initializeKyc, setInitializedKyc] = useState(false);
  const [isDocumentPending, setIsDocumentPending] = useState(false);
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  const [kycValue, setKycValue] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [isProfileFilled, setIsProfileFilled] = useState(false);
  //--total balance
  // const [totalFait, setTotalFait] = useState('0.00');
  const [refreshing, setRefreshing] = React.useState(false);

  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  //--total balance
  const [totalFait, setTotalFait] = useState("0.00");

  // const FundsReducer = useSelector((state) => state.FundsReducer);
  const { fundsUserDetails, coinToUsdData } = useSelector(
    (state) => state.FundsReducer
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLImit] = useState(10);
  // useEffect(() => {
  //   dispatch(getProfile1());
  //   getProfileInfo();
  //   let coinToDollar = 0;
  //   // getData();
  //   props.navigation.addListener('didFocus', () => {
  //     FundsReducer?.fundsUserDetails &&
  //       FundsReducer?.fundsUserDetails?.map((item, index) => {
  //         let price = FundsReducer?.coinToUsdData[item.id.toUpperCase()];
  //         item.usdPrice = price ? price.USD : 1;
  //         coinToDollar += parseFloat(item.balance.balance) * item.usdPrice;
  //       });
  //     setTotalFait(coinToDollar.toFixed(constants.CRYPTO_DECIMAL_ROUNDOFF));

  //     if (parseFloat(coinToDollar) < 20) {
  //       setBalanceStatus(false);
  //     } else {
  //       setBalanceStatus(true);
  //     }
  //     dispatch(getProfile1());
  //     getProfileInfo();
  //     Actions.refresh();
  //   });
  // }, []);

  // function renderSumSub(accessToken) {
  //   let apiUrl = 'https://api.sumsub.com';
  //   let flowName = 'Questionnaire';
  //   let snsMobileSDK = SNSMobileSDK.Builder(apiUrl)
  //     .withAccessToken(accessToken, () => {
  //       return Singleton.getInstance()
  //         .getData(constants.ACCESS_TOKEN)
  //         .then(res => {
  //           fetch(END_POINT.BASE_URL + END_POINT.GET_SUM_SUB_TOKEN, {
  //             method: 'GET',
  //             headers: {
  //               Accept: 'application/json',
  //               'Content-Type': 'application/json',
  //               Authorization: res,
  //             },
  //           }).then(resp => {
  //             return resp.token;
  //           });
  //         });
  //     })
  //     .withHandlers({
  //       // Optional callbacks you can use to get notified of the corresponding events
  //       onStatusChanged: event => {
  //         console.log(
  //           'onStatusChanged11: [' +
  //             event.prevStatus +
  //             '] => [' +
  //             event.newStatus +
  //             ']',
  //         );
  //       },
  //       onLog: event => {
  //         if (event.message.includes('SDK is prepared. Applicant - ')) {
  //           var applicantId = event.message.replace(
  //             'SDK is prepared. Applicant - ',
  //             '',
  //           );
  //           dispatch(updateSumSubApplicantId(applicantId));
  //         }
  //       },
  //       onEvent: event => {
  //         console.log('onEvent111: ' + JSON.stringify(event));
  //       },
  //     })
  //     .withDebug(true)
  //     .withLocale('en') // Optional, for cases when you need to override system locale
  //     .build();

  //   snsMobileSDK
  //     .launch()
  //     .then(result => {
  //       console.log('SumSub SDK State111: ' + JSON.stringify(result));
  //     })
  //     .catch(err => {
  //       console.log('SumSub SDK Error011: ', err);
  //     });
  // }

  // function renderSumSubs(accessToken) {
  //   let apiUrl = 'https://api.sumsub.com';
  //   let flowName = 'msdk-basic-kyc';

  //   let snsMobileSDK = SNSMobileSDK.init(accessToken, () => {
  //     return Singleton.getInstance()
  //       .getData(constants.ACCESS_TOKEN)
  //       .then(res => {
  //         fetch(END_POINT.BASE_URL + END_POINT.GET_SUM_SUB_TOKEN, {
  //           method: 'GET',
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json',
  //             Authorization: res,
  //           },
  //         }).then(resp => {
  //           return resp.token;
  //         });
  //       });
  //   })
  //     .withApplicantConf({
  //       email: 'sohit.h',
  //       phone: '919781545728',
  //     })
  //     .withHandlers({
  //       // Optional callbacks you can use to get notified of the corresponding events
  //       onStatusChanged: event => {
  //         console.log(
  //           'onStatusChanged: =-=-=-[' +
  //             event.prevStatus +
  //             '] =-=-=-=-=> [' +
  //             event.newStatus +
  //             ']',
  //         );
  //       },
  //       onLog: event => {
  //         console.log('onLog: [Idensic]=-=-=-= ' + event.message);
  //       },
  //       onEvent: event => {
  //         console.log('onEvent: ' + JSON.stringify(event));
  //       },
  //     })
  //     .withDebug(true)
  //     .withLocale('en') // Optional, for cases when you need to override the system locale
  //     .build();

  //   snsMobileSDK
  //     .launch()
  //     .then(result => {})
  //     .catch(err => {});

  //   // let snsMobileSDK = SNSMobileSDK.Builder(apiUrl)
  //   //   .withAccessToken(accessToken, () => {
  //   //     console.log('sumsub access token---->>', accessToken);
  //   //     return Singleton.getInstance()
  //   //       .getData(constants.ACCESS_TOKEN)
  //   //       .then(res => {
  //   //         fetch(END_POINT.BASE_URL + END_POINT.GET_SUM_SUB_TOKEN, {
  //   //           method: 'GET',
  //   //           headers: {
  //   //             Accept: 'application/json',
  //   //             'Content-Type': 'application/json',
  //   //             Authorization: res,
  //   //           },
  //   //         }).then(resp => {
  //   //           // return a fresh token from here
  //   //           console.log('-renderSumSub=-=-=-=-=-=>>>>>------', resp);
  //   //           return resp.token;
  //   //         });
  //   //       });
  //   //   })
  //   //   .withApplicantConf({
  //   //     lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
  //   //     email: 'tony@yopmail.com',
  //   //     phone: '919896389798',
  //   //     i18n: 'customI18nMessages', //JSON of custom SDK Translations
  //   //     uiConf: {
  //   //       customCss: 'https://url.com/styles.css',
  //   //       // URL to css file in case you need change it dynamically from the code
  //   //       // the similar setting at Customizations tab will rewrite customCss
  //   //       // you may also use to pass string with plain styles `customCssStr:`
  //   //     },
  //   //   })
  //   //   .withHandlers({
  //   //     // Optional callbacks you can use to get notified of the corresponding events
  //   //     onStatusChanged: event => {
  //   //       console.log(
  //   //         'onStatusChanged11=-=-=-=-=>>>: [' +
  //   //           event.prevStatus +
  //   //           '] =>>>>>>>> [' +
  //   //           event.newStatus +
  //   //           ']',
  //   //       );
  //   //     },
  //   //     onLog: event => {
  //   //       console.log('onLog:=-=-=-=-=>>>>', event);

  //   //       console.log('onLog:>>>>>>>' + event.message);
  //   //       if (event.message.includes('SDK is prepared. Applicant - ')) {
  //   //         var applicantId = event.message.replace(
  //   //           'SDK is prepared. Applicant - ',
  //   //           '',
  //   //         );
  //   //         //  console.log("Sd===========", dd)
  //   //         dispatch(updateSumSubApplicantId(applicantId));
  //   //       }
  //   //     },
  //   //     onEvent: event => {
  //   //       console.log('onEvent111: ' + JSON.stringify(event));
  //   //     },
  //   //   })
  //   //   .withDebug(true)
  //   //   .withLocale('en') // Optional, for cases when you need to override system locale
  //   //   .build();

  //   // snsMobileSDK
  //   //   .launch()
  //   //   .then(result => {
  //   //     console.log(
  //   //       'SumSub SDK State111:=-=-=-=->>> ' + JSON.stringify(result),
  //   //     );
  //   //   })
  //   //   .catch(err => {
  //   //     console.log('SumSub SDK Error011:=-=-=-=-=->>>> ', err);
  //   //   });
  // }

  // const getProfileInfo = () => {
  //   Singleton.getInstance()
  //     .getData(constants.USER_DATA)
  //     .then(async res => {
  //       // console.log('check profile data=-=-=-=>>>', JSON.parse(res));
  //       setuserData(JSON.parse(res));

  //       if (JSON.parse(res)?.otp) {
  //         setCheck2fa(true);
  //       } else {
  //         setCheck2fa(false);
  //       }
  //       if (JSON.parse(res)?.level == 3) {
  //         setisKycVerified(true);
  //       } else {
  //         setisKycVerified(false);
  //       }
  //       JSON.parse(res)?.labels?.filter(item => {
  //         if (
  //           item.value == 'verified' &&
  //           (item.key == 'tier_3' || item.key == 'tier_4')
  //         ) {
  //           setisDocumentVerified(true);
  //         } else if (item.value == 'verified' && item.key == 'profile') {
  //           setisProfile(true);
  //         }
  //       });
  //       let confirmations = JSON.parse(res)?.labels?.find(
  //         item => item.value === 'verified' && item.key === 'document',
  //       );
  //       if (confirmations != undefined) {
  //         if (confirmations?.value === 'verified') {
  //           setUserVerified(true);
  //         } else {
  //           setUserVerified(false);
  //         }
  //       } else {
  //         setUserVerified(false);
  //       }
  //     })
  //     .catch(err => {});
  // };

  // const onShare = async () => {
  //   try {
  //     const result = await Share.share({
  //       title: 'App link',
  //       message: `Please install this app and stay safe , AppLink :${
  //         Platform.OS === 'ios'
  //           ? 'https://apps.apple.com/in/app/xchange-monster/id1621071750'
  //           : 'https://play.google.com/store/apps/details?id=com.xchangemonster'
  //       }`,
  //       url:
  //         Platform.OS === 'ios'
  //           ? 'https://apps.apple.com/in/app/xchange-monster/id1621071750'
  //           : 'https://play.google.com/store/apps/details?id=com.xchangemonster',
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //       } else {
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };
  const getTotalRecords = () => {
    dispatch(getNotificationDataOnly(pageNumber, pageLimit)).then((res) => {
      // console.log("getNotificationList=-=-=-=total>>>", res.headers.total);
      // console.log("getNotificationList=-=-=-=data>ee>>", res.data);
      // console.log(
      //   "getNotificationList=-=-=-=count-ee>>>",
      //   res?.data[0]?.unread_count
      // );

      setUnreadCount(res?.data[0]?.unread_count);
    });
  };
  const getProfileData = () => {
    dispatch(getProfile1())
      .then((res) => {
        getProfileInfo();
        getTotalRecords();
      })
      .catch((err) => console.log("getProfileInfo=-=-=err-=->>", err));
  };
  useEffect(() => {
    getProfileData();
    props.navigation.addListener("didFocus", () => {
      getProfileData();

      // getData();
      Actions.refresh();
      // console.log(
      //   "coinToDollar=-=-FundsReducer?.fundsUserDetails=-=->>>",
      //   FundsReducer?.fundsUserDetails
      // );
      // console.log(
      //   "coinToDollar=-=-FundsReducer?.coinToUsdData=-=->>>",
      //   FundsReducer?.coinToUsdData
      // );
      fundsUserDetails &&
        fundsUserDetails?.map((item, index) => {
          // console.log("coinToDollar=-=item=-=->>>", item);
          let price = coinToUsdData[item.id.toUpperCase()];
          // console.log("coinToDollar=-=price=-=->>>", price);
          item.usdPrice = price ? price.USD : 1;
          // console.log("coinToDollar=-.balance=->>>", item.balance.balance);
          coinToDollar += parseFloat(item.balance.balance) * item.usdPrice;
        });
      // setTotalFait(coinToDollar.toFixed(constants.CRYPTO_DECIMAL_ROUNDOFF));
      // console.log("coinToDollar=-=-=-=->>>", coinToDollar);
      if (parseFloat(coinToDollar) < 20) {
        setBalanceStatus(false);
      } else {
        setBalanceStatus(true);
      }
    });
  }, []);
  const getThemeData = React.useCallback(async () => {
    Singleton.getInstance()
      .getData(constants.CURRENT_THEME_MODE)
      .then(async (res) => {
        // setSelectedIndex(res);
        // console.log('meri_current_int_Theme====-=-=-', res);
        if (res != null) {
          if (res === "0") {
            setSelectedIndex(0);
            Singleton.getInstance().statusChange.updateStatusBar();
            // Actions.refresh();
          } else {
            setSelectedIndex(1);
            Singleton.getInstance().statusChange.updateStatusBar();
            // Actions.refresh();
          }
        } else {
          setSelectedIndex(0);
          Singleton.getInstance().statusChange.updateStatusBar();
          // Actions.refresh();
        }
      });
  }, []);
  // const getData = async () => {
  //   await Singleton.getInstance()
  //     .getData(constants.CURRENT_THEME_MODE)
  //     .then(async res => {
  //       // setSelectedIndex(res);
  //       console.log('meri_current_int_Theme==', res);
  //       if (res != null) {
  //         if (res === '0') {
  //           setSelectedIndex(0);
  //           await Singleton.getInstance().statusChange.updateStatusBar();
  //           Actions.refresh();
  //         } else {
  //           setSelectedIndex(1);
  //           await Singleton.getInstance().statusChange.updateStatusBar();
  //           Actions.refresh();
  //         }
  //       } else {
  //         setSelectedIndex(0);
  //         await Singleton.getInstance().statusChange.updateStatusBar();
  //         Actions.refresh();
  //       }
  //     });
  // };

  const getProfileInfo = () => {
    // setLoading(true);
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then(async (res) => {
        setuserData(JSON.parse(res));
        let userData = JSON.parse(res);
        if (JSON.parse(res)?.otp) {
          setCheck2fa(true);
        } else {
          setCheck2fa(false);
        }
        console.log("userdata=-=-=-=---profile=-=>", JSON.parse(res));
        setKycPending(userData?.kyc_panding);
        if (JSON.parse(res)?.level == 2 || JSON.parse(res)?.level == 1) {
          // setIsDocumentVerified(true);
          setKycStatus(false);
        } else if (JSON.parse(res)?.level == 3) {
          setKycStatus(true);
          // setIsDocumentVerified(true);
        }
        // console.log(
        //   "user profile=-=gender>333",
        //   JSON.parse(res)?.profiles[0].gender
        // );
        // console.log(
        //   "JSON.parse(res)?.sumsub_applicantsder>333",
        //   JSON.parse(res)?.sumsub_applicants
        // );
        // console.log(
        //   "JSON.parse(res)?.sumsub_applicantsder>333",
        //   JSON.parse(res)?.sumsub_applicants.length
        // );
        if (JSON.parse(res)?.sumsub_applicants.length > 0) {
          setIsProfileFilled(true);
          // console.log("user profile=-=gender>55");
        } else {
          setIsProfileFilled(false);
          // console.log("user profile=-=gender>66");
        }
        // console.log(
        //   "user profile=-=gender>phNo",
        //   JSON.parse(res)?.phones[0]?.number
        // );
        // const phNo = JSON.parse(res)?.phones[0]?.number;
        let numberPhn = JSON.parse(res)?.phones;
        let phNo;
        console.log("numberPhn profile=-=gender>phNo", numberPhn);
        console.log("numberPhn profile=-=gender>phNo===", numberPhn.length);
        if (numberPhn.length == 1) {
          phNo = numberPhn[0]?.number;

          console.log("phNo profile=-=gender>phNo", phNo);
          setPhoneNo(phNo);
        } else {
          phNo = numberPhn[numberPhn.length - 1]?.number;

          console.log("phNo profile=-=gender>phNo", phNo);
          setPhoneNo(phNo);
        }

        // console.log("userdata=-=item?.kyc_panding", userData?.kyc_panding);
        JSON.parse(res)?.labels?.filter((item) => {
          if (item.key == "profile") {
            let checkKycInitialize = JSON.parse(res)?.sumsub_applicants?.find(
              (item) => item.level == "basic-kyc-level"
            );
            if (checkKycInitialize == undefined) {
              setInitializedKyc(false);
            } else {
              let checkKyc = JSON.parse(res)?.labels?.find(
                (item) => item.key === "basic-kyc-level"
              );
              if (checkKyc == undefined) {
              } else {
                // setInitializedKyc(true);
                // console.log("checkKyc=-=-=-=-=-=>>", checkKyc);
                setKycValue(checkKyc.value);
                if (checkKyc?.value == "verified") {
                  setIsDocumentVerified(true);
                }
              }
            }
            // let checkKyc = JSON.parse(res)?.labels?.find(
            //   (item) => item.key === "document"
            // );
            // if (checkKyc == undefined) {
            //   setInitializedKyc(true);
            // }
            // if (item.key == "profile") {
            //   let checkKyc = JSON.parse(res)?.labels?.find(
            //     (item) => item.key === "document"
            //   );
            //   if (checkKyc == undefined) {
            //     setInitializedKyc(true);
            //   }
            // } else if (item.value == "rejected" && item.key == "document") {
            //   setIsDocumentReject(true);

            //   setInitializedKyc(false);
            // }
            // if (item.value != "pending" && item.key == "document") {
            //   setKycStatus(item.value);
            //   setInitializedKyc(false);
            // }
          }
        });
        // console.log(
        //   "userdata=-=-=-=---profile=-=>5555--",
        //   JSON.parse(res)?.level == 1 && JSON.parse(res)?.profiles.length > 0
        // );

        // if (
        //   JSON.parse(res)?.level == 1 &&
        //   JSON.parse(res)?.profiles.length > 0
        // ) {
        //   setProfileCompleted(true);
        // } else {
        //   setProfileCompleted(false);
        // }
        // let confirmations = JSON.parse(res)?.labels.find(
        //   (item) => item.value === "verified" && item.key === "document"
        // );
        // // return confirmations;
        // if (confirmations?.value === "verified") {
        //   setUserVerified(true);
        // } else {
        //   setUserVerified(false);
        // }
        setLoading(false);
      })
      .catch((err) => {
        console.log("----value- err-->", err);
        setLoading(false);
      });
    setRefreshing(false);
  };

  const onShare = async () => {
    alert("Coming soon");
    // try {
    //   const result = await Share.share({
    //     title: 'App link',
    //     message:
    //       'Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
    //     url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
    //   });
    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //     } else {
    //       // shared
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    // } catch (error) {
    //   alert(error.message);
    // }
  };

  // const copyToClipboard = (id) => {
  //   Clipboard.setString(id);
  //   Toast.showWithGravity(strings.Profile.idCopied, Toast.SHORT, Toast.BOTTOM);
  // };
  const themeStatus = () => {
    // console.log("check theme status=-=->>>1111123");
    Singleton.getInstance()
      .getData(constants.IS_THEME_ENABLE)
      .then((res) => {
        console.log("check theme status=-=->>>", res);
        if (res === "theme2") {
          // setSelectedMode('Dark Mode');
          // setSelectedIndex(0);
        } else {
          // setSelectedMode('Light Mode');
          // setSelectedIndex(0);
        }
      })
      .catch((err) => {
        Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, "theme1");
        setSelectedMode("Light Mode");
      });
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getProfileData();
  }, [refreshing]);

  const getSumSubDetails = () => {
    dispatch(getSumSubToken())
      .then((res) => {
        // console.log("RESPONSE-----", res);
        //_act-b1bb0a12-1e3e-4c34-b2b6-2c036a5b0426
        renderSumSub(res.token);
      })
      .catch((err) => {
        console.log("ERR----", err);
      });
  };
  function renderSumSub(accessToken) {
    // console.log("dsa======", accessToken);
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
                // console.log("renderSumSub------resp-", resp);
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
          // console.log("onStatusChanged11: =-=-=-=-=-=>>>>>[event", event);
          // console.log(
          //   "onStatusChanged11: =-=-=-=-=-=>>>>>[event",
          //   event.newStatus
          // );
          // console.log("onStatusC", event.newStatus === ["Pending"]);
          // console.log("onStatusC=-=-=", event.newStatus === "Pending");

          // console.log(
          //   "onStatusChanged11: =-=-=-=-=-=>>>>>[" +
          //     event.prevStatus +
          //     "] => =-=-=-=-=-=-=-=-[" +
          //     event.newStatus +
          //     "]"
          // );

          if (event.newStatus === "Pending") {
            // Actions.reset('Profile');
            // Actions.pop();
            setProfileCompleted(false);
            setShowSumsub(false);
            snsMobileSDK.dismiss();
            onRefresh();

            // Actions.pop();
          }
        },
        onLog: (event) => {
          // console.log("onLog-=======------:", event.message);
          // if (event.message == "IdensicMobileSDK dismissed") {
          //   // Actions.popTo("Profile");
          //   // console.log("hello i am here");
          //   Actions.pop();
          // }
          if (event.message.includes("SDK is prepared. Applicant - ")) {
            var applicantId = event.message.replace(
              "SDK is prepared. Applicant - ",
              ""
            );
            //  console.log("Sd===========", dd)
            dispatch(updateSumSubApplicantId(applicantId));
          }
          if (
            event.message ==
            "Cancel verification with reason - SuccessTermination(reason=null)"
          ) {
            // console.log("=-=-close.status=-=event.message", event.message);
            // setProfileCompleted(false);
            snsMobileSDK.dismiss();
            setShowSumsub(false);
            onRefresh();
            // Actions.pop();
          } else if (event.message == "IdensicMobileSDK dismissed") {
            setShowSumsub(false);
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
        console.log("SumSub SDK State111: " + JSON.stringify(result));
        let close = JSON.stringify(result);
        if (close.status === "TemporarilyDeclined") {
          console.log("=-=-close.status=-=", close.status);
          snsMobileSDK.dismiss();
          // Actions.pop();
          setProfileCompleted(false);
          setShowSumsub(false);
          onRefresh();
        }
      })
      .catch((err) => {
        console.log("SumSub SDK Error011: ", err);
      });
  }
  const copyToClipboard = (id) => {
    Clipboard.setString(id);
    Singleton.getInstance().showMsg(strings.Profile.idCopied);
    // showMessage({
    // showMessage({
    //   message: strings.Profile.idCopied,
    //   backgroundColor: ThemeManager.colors.tabBottomBorder,
    //   autoHide: true,
    //   duration: 3000,
    //   type: "success",
    //   icon: "success",
    //   position: "right",
    //   style: {
    //     marginHorizontal: 10,
    //     borderRadius: 10,
    //     marginTop: Platform.OS == "android" ? 10 : 40,
    //   },
    // });
  };
  const deleteBtnClick = () => {
    if (code_2fa.length < 5 || code_2fa.length > 6) {
      Singleton.getInstance().showError(
        strings.add_beneficiary.please_enter_valid_pin
      );
    } else {
      setLoading(true);
      // console.log("chcek response=-=-=-=->>>userData?.uid", userData?.uid);
      // console.log("chcek response=-=-=-=->>>code_2fa", code_2fa);

      dispatch(deleteUserAccountAction(userData?.uid, code_2fa))
        .then((res) => {
          console.log("chcek response=-=-=-=->>>", res);
          setCode_2fa("");
          setLoading(false);
          setModalVisible(false);
          dispatch(logoutUser());
        })
        .catch((err) => {
          // console.log("chcek response=-=-=-=->>>err", err);
          setCode_2fa("");
          setLoading(false);
          setModalVisible(false);
          setErrorRemove(err);
        });
    }
  };
  const logoutPress = () => {
    Alert.alert(
      constants.APP_NAME_CAPS,
      strings.Profile.are_you_really,
      [
        {
          text: strings.spot.yes,
          onPress: () => {
            if (!global.isConnected || !global.isInternetReachable) {
              if (!this.alertPresent) {
                this.alertPresent = true;
                Alert.alert(
                  "",
                  Constant.NO_NETWORK,
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        this.alertPresent = false;
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }
              return new Promise((resolve, reject) => {
                reject({ message: Constant.NO_NETWORK });
              });
            } else {
              setLogoutLoading(true);
              dispatch(logoutUser())
                .then((res) => {
                  dispatch(resetFavMarketList());
                  setLogoutLoading(false);
                })
                .catch((err) => {
                  setLogoutLoading(false);
                });
              // Singleton.getInstance().saveEmptyDefault();
              // Singleton.getInstance()
              //   .deleteOfflineStepsData()
              //   .then(res => {
              //     dispatch(logoutAndReset());
              //     Actions.Login();
              //   });
            }
          },
        },
        {
          text: strings.spot.no,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  const onDeleteAccountPress = () => {
    if (check2fa === false) {
      // alert("Please enable 2FA");
      Singleton.getInstance().showError("Please enable 2FA");
    } else {
      if (balanceStatus) {
        Alert.alert(
          constants.APP_NAME_CAPS,
          strings.Profile.you_have_balance,
          [
            {
              text: "OK",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          constants.APP_NAME_CAPS,
          strings.Profile.are_you_sure,
          [
            {
              text: strings.spot.yes,
              onPress: () => {
                setModalVisible(true);
              },
            },
            {
              text: strings.spot.no,
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    }
  };
  const onThemeChange = async () => {
    let themeValue = "0";
    console.log(
      "ThemeManager.colors.themeColor =-=-=>>",
      ThemeManager.colors.themeColor
    );
    if (ThemeManager.colors.themeColor === "dark") {
      var val = "theme1";
      ThemeManager.setLanguage(val);
      await Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, val);
      await Singleton.getInstance().saveData(
        constants.CURRENT_THEME_MODE,
        JSON.stringify(0)
      );
      await Singleton.getInstance().statusChange.updateStatusBar();
      setselectedIndex(0);
      themeValue = "0";
      EventRegister.emit("themeChange", "#ffffff");
      Actions.refresh();
    } else {
      var val = "theme2";
      ThemeManager.setLanguage(val);
      await Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, val);
      await Singleton.getInstance().statusChange.updateStatusBar();
      await Singleton.getInstance().saveData(
        constants.CURRENT_THEME_MODE,
        JSON.stringify(1)
      );
      setselectedIndex(1);
      themeValue = "1";
      dispatch(changeThemeAction(themeValue));
      EventRegister.emit("themeChange", "#171c28");
      Actions.refresh();
    }
  };
  const onKycPress = () => {
    userData?.labels?.filter((item) => {
      if (item.value == "verified" && item.key == "document") {
        setIsDocumentVerified(true);
      } else if (item.value == "verified" && item.key == "profile") {
        setIsProfile(true);
      }
    });
    // console.log(
    //   "isDocumentVerified--",
    //   isProfile,
    //   isDocumentVerified,
    //   userData.level
    // );
    // if (userData.level == 1) {
    //   Actions.currentScene != "EnterPhoneToVerify" &&
    //     Actions.EnterPhoneToVerify();
    // } else if (profileCompleted) {
    if (isProfileFilled) {
      setShowSumsub(true);
    } else {
      setShowSumsub(false);
      props.navigation.navigate("Verification");
    }
    // } else if (
    //   userData.level == 2 &&
    //   !isProfile &&
    //   !isDocumentReject &&
    //   !isDocumentPending
    // ) {
    //   props.navigation.navigate("Verification");
    // } else if (
    //   userData.level == 2 &&
    //   isDocumentReject &&
    //   !isDocumentPending
    // ) {
    //   props.navigation.navigate("Verification");
    // }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {showSumsub ? (
        <>{getSumSubDetails()}</>
      ) : (
        <>
          <View style={styles.subContainer}>
            <View style={styles.headerView}>
              <SimpleHeader
                titleName={strings.Profile.profile}
                rightIcon
                backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
                rightIconUrl={{
                  uri:
                    ThemeManager.colors.themeColor === "dark"
                      ? Images.mode_light
                      : Images.icon_moon,
                }}
                rightIconPress={onThemeChange}
                onBackPress={() => {
                  Actions.pop();
                }}
              // customRightImage={[{tintColor: ThemeManager.colors.textBW}]}
              />
            </View>

            <KeyboardAwareScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onRefresh={() => onRefresh()}
              refreshing={refreshing}
              keyboardShouldPersistTaps="handled"
              // bounces={false}
              style={{ flex: 1 }}
            >
              <View>
                <View style={styles.userInfoView}>
                  <View style={{ flex: 0.6 }}>
                    <View style={styles.rowFlex}>
                      <Text
                        style={[
                          styles.emailPhonetext,
                          { color: ThemeManager.colors.textBW },
                        ]}
                      >
                        {isSecureClick ? userData?.email : "***@***.com"}
                      </Text>
                      <TouchableOpacity
                        style={styles.viewEmailPhone}
                        onPress={() => {
                          setSecureClick(!isSecureClick);
                        }}
                      >
                        {!isSecureClick ? (
                          <Image
                            style={[styles.viewPasswordImage]}
                            source={{ uri: ThemeManager.ImageIcons.icon_hide_eye }
                            }
                          />
                        ) : (
                          <Image
                            style={[styles.viewPasswordImage]}
                            source={{
                              uri: ThemeManager.ImageIcons.icon_open_eye,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", top: 10 }}>
                      <Image
                        style={[
                          styles.viewPasswordImage,
                          { marginLeft: 0, marginRight: 8 },
                        ]}
                        source={{
                          uri: ThemeManager.ImageIcons.icon_ph,
                        }}
                      />
                      <Text
                        style={[
                          styles.IdText,
                          { color: ThemeManager.colors.textBW },
                        ]}
                      >
                        +{phoneNo}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", top: 15 }}>
                      <Text
                        style={[
                          styles.IdText,
                          { color: ThemeManager.colors.textBW },
                        ]}
                      >
                        ID : {userData?.uid}
                      </Text>
                      <TouchableOpacity
                        style={{
                          left: 4,
                          alignSelf: "center",
                        }}
                        onPress={() => {
                          copyToClipboard(userData?.uid);
                        }}
                      >
                        <Image
                          style={[styles.viewPasswordImage]}
                          source={{
                            uri: ThemeManager.ImageIcons.Icon_Profile_Copy,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {kycStatus != null ? (
                    <View
                      style={[
                        kycStatus ? styles.verifiedView : styles.unVerifiedView,
                        { flex: 0.3 },
                      ]}
                    >
                      <Image
                        style={styles.verifiedImage}
                        source={{ uri: Images.userVerified }}
                      />
                      <Text style={styles.verifiedText}>
                        {kycStatus
                          ? strings.Profile.verified
                          : strings.Profile.Unverified}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.verifiedView,
                        { backgroundColor: ThemeManager.colors.DashboardBG },
                      ]}
                    ></View>
                  )}
                </View>
                {isDocumentVerified ? (
                  <View style={{ marginTop: 30 }} />
                ) : (
                  <View style={[styles.infoView]}>
                    <View style={{ flex: 0.1 }}>
                      <Image
                        style={styles.profileIconStyle}
                        source={{ uri: Images.icon_Profile_Info }}
                      />
                    </View>
                    <View style={{ flex: 0.9 }}>
                      <Text style={styles.youRequested}>
                        {strings.Profile.you_are_requested}
                      </Text>
                    </View>
                  </View>
                )}
                {/* <TouchableOpacity
              onPress={() => {
                Actions.currentScene != 'ReferralMain' &&
                  Actions.push('ReferralMain');
              }}>
              <Header
                mainView={{marginHorizontal: 16}}
                customLeftTitle={{
                  fontSize: 16,
                  fontFamily: fonts.regular,
                }}
                leftImage={{uri: Images.icon_Referrall}}
                btnTextLeft={strings.Profile.MyReferralID}
                btnTextRight=" "
                rightImage={{uri: Images.Icon_Profile_Right}}
                customRightImage={styles.customRightImage}
              />
            </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => {
                    Actions.currentScene != "Notifications" &&
                      Actions.push("Notifications");
                  }}
                  style={styles.notificationBtn}
                >
                  <View style={styles.notificationView}>
                    <Image
                      source={{
                        uri: ThemeManager.ImageIcons.icon_notification_k,
                      }}
                      style={[styles.notificationBtnIcon]}
                    />
                    <Text style={[styles.notificationBtnText]}>
                      {strings.Notification}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      // justifyContent: "flex-end",
                    }}
                  >
                    {unreadCount > 0 && <View style={styles.unreadView} />}
                    <Image
                      source={{
                        uri: ThemeManager.ImageIcons.icon_forward_arrow,
                      }}
                      style={styles.unreadArrow}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Actions.currentScene != "Settings" &&
                      Actions.push("Settings");
                  }}
                >
                  <Header
                    mainView={{ marginHorizontal: 16 }}
                    customLeftTitle={{
                      fontSize: 16,
                      fontFamily: fonts.regular,
                    }}
                    leftImage={{
                      uri: ThemeManager.ImageIcons.icon_Profile_Settings,
                    }}
                    btnTextLeft={strings.Settings}
                    btnTextRight=" "
                    rightImage={{
                      uri: ThemeManager.ImageIcons.icon_forward_arrow,
                    }}
                    customRightImage={styles.customRightImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={
                    kycValue === "in_review"
                      ? true
                      : kycStatus
                        ? true
                        : kycValue === "onhold"
                          ? true
                          : false
                  }
                  // disabled={true}
                  onPress={onKycPress}
                >
                  <Header
                    disabled={true}
                    mainView={{ marginHorizontal: 16 }}
                    customLeftTitle={{
                      fontSize: 16,
                      fontFamily: fonts.regular,
                    }}
                    leftImage={{
                      uri: ThemeManager.ImageIcons.icon_Profile_Kyc,
                    }}
                    btnTextLeft={
                      kycStatus ? "KYC" : "Submit KYC"
                      // isDocumentReject
                      //   ? "KYC"
                      //   : isDocumentVerified
                      //   ? "KYC"
                      //   : isDocumentPending
                      //   ? "KYC"
                      //   : "Submit KYC"
                    } //{strings.Profile.SubmitKyc}
                    btnTextRight={
                      loading
                        ? " "
                        : kycStatus
                          ? "Verified"
                          : kycValue == "initiated"
                            ? "Initiated"
                            : kycValue == "in_review"
                              ? "Under review"
                              : kycValue === "onhold"
                                ? "Under review"
                                : kycValue === "rejected"
                                  ? "Rejected"
                                  : kycValue === "retry"
                                    ? "Resubmit"
                                    : kycValue === "verified"
                                      ? "Verified"
                                      : "Pending"
                    }
                    rightImage={
                      kycValue === "in_review"
                        ? null
                        : kycValue === "onhold"
                          ? null
                          : kycStatus
                            ? null
                            : { uri: ThemeManager.ImageIcons.icon_forward_arrow }
                      // isDocumentVerified ||
                      // isDocumentPending ||
                      // kycPending === false
                      //   ? null
                      //   : { uri: ThemeManager.ImageIcons.icon_forward_arrow }
                    }
                    customRightImage={styles.customRightImage}
                    customRightTitle={{
                      right: 40,
                      color: isDocumentReject ? colors.appRed : colors.appGreen,
                      fontFamily: fonts.bold,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onShare();
                  }}
                >
                  <Header
                    mainView={{ marginHorizontal: 16 }}
                    customLeftTitle={{
                      fontSize: 16,
                      fontFamily: fonts.regular,
                    }}
                    leftImage={{
                      uri: ThemeManager.ImageIcons.icon_profile_Share,
                    }}
                    btnTextLeft={strings.Profile.shareTheApp}
                    btnTextRight=" "
                    rightImage={{
                      uri: ThemeManager.ImageIcons.icon_forward_arrow,
                    }}
                    customRightImage={styles.customRightImage}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={onDeleteAccountPress}>
                  <Header
                    titleCenter={isKycVerified ? true : false}
                    mainView={{ marginHorizontal: 16, marginBottom: -15 }}
                    customLeftTitle={{
                      fontSize: 16,
                      fontFamily: fonts.regular,
                    }}
                    // custmImg={{ tintColor: ThemeManager.colors.textColor }}
                    leftImage={{ uri: ThemeManager.ImageIcons.iconDeleteUser }}
                    btnTextLeft={strings.Profile.delete_account}
                    btnTextRight={" "}
                    rightImage={{
                      uri: null,
                    }}
                    customRightImage={styles.customRightImage}
                    customRightTitle={{
                      right: 40,
                      color: isKycVerified ? colors.appGreen : colors.appRed,
                      fontFamily: fonts.bold,
                    }}
                  />
                  <Text style={styles.onceText}>
                    {strings.Profile.once_the_account}
                  </Text>
                </TouchableOpacity> */}
              </View>
            </KeyboardAwareScrollView>
            <View>
              <ButtonPrimary
                style={{ marginVertical: 20 }}
                title={strings.Logout}
                onPress={logoutPress}
              />
              <Text style={styles.warningText}>{strings.Profile.waring}</Text>
            </View>
          </View>
          <Loader isLoading={loading || logoutLoading} />
        </>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setErrorRemove("");
        }}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={styles.backgroundView}
          screenStyle={[styles.screenStyle, styles.backgroundView]}
          bottomStyle={styles.backgroundView}
        >
          <Loader isLoading={loading} />
          <View style={{ flex: 1 }}>
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacityNative
                style={{ marginRight: 15, marginTop: 15 }}
                onPress={() => {
                  // alert('hello');
                  setModalVisible(false);
                  setErrorRemove("");

                  setCode_2fa("");
                  setLoading(false);
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                  style={{ height: 25, width: 25, resizeMode: "contain" }}
                />
              </TouchableOpacityNative>
            </View>
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {balanceStatus ? (
                <View>
                  <Text style={styles.headerDeleteText}>
                    {strings.Profile.delete_account}
                  </Text>
                  <Text style={styles.beforeDeleteText}>
                    {strings.Profile.before_you_delete}
                  </Text>
                  <View style={styles.viewModal}>
                    <Text style={styles.totalBalanceText}>
                      {strings.Profile.the_total_balance}
                    </Text>
                  </View>
                  <Text style={styles.accountDeleteText}>
                    {strings.Profile.account_deletion}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.enterText}>
                    {strings.Profile.please_enter_the_2fa}
                  </Text>

                  <View style={{ marginTop: 30 }}>
                    <View style={{ marginHorizontal: 15 }}>
                      <InputVerification
                        verifyLable={{ color: ThemeManager.colors.textColor5 }}
                        inputLabel={strings.spot.enter_2fa_code}
                        editable={true}
                        verifyInputStyle={{
                          color: ThemeManager.colors.textColor1,
                          backgroundColor: ThemeManager.colors.tabBackground,
                        }}
                        placeHolder={`EG. "303454"`}
                        value={code_2fa}
                        onChangeText={(value) => {
                          // setOtp(value);
                          if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                            setCode_2fa(value);
                          }
                        }}
                        maxLength={6}
                        keyboardStyle={"numeric"}
                        returnKeyType={"done"}
                      />
                    </View>
                    {errorRemove ? (
                      <View>
                        <Text style={styles.errorMessageStyle}>
                          {errorRemove}
                        </Text>
                      </View>
                    ) : null}
                    <View style={{ marginTop: 30 }}>
                      <ButtonPrimary
                        style={styles.btnBottom}
                        title={strings.Profile.delete_account}
                        onPress={deleteBtnClick}
                      />
                    </View>
                  </View>
                  <Text style={styles.looseText}>
                    {strings.Profile.what_you_loose}
                  </Text>
                  <Text style={styles.accessText}>
                    {strings.Profile.access_to}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.kyc_and_platform}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.trading_data}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.any_available_balance}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.app_preferences}
                  </Text>
                </View>
              )}
            </KeyboardAwareScrollView>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

const useStyles = (theme) =>
  StyleSheet.create({
    textStyle: {
      fontFamily: Fonts.regular,
      alignSelf: "center",
      color: colors.black,
      fontSize: 14,
      fontWeight: "500",
      letterSpacing: -0.35,
    },
    textStyle1: {
      marginEnd: 15,
    },
    buttonStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      // marginLeft: 15,
    },
    buttonStyle1: {
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    navIconStyle: {
      width: 35,
      height: 35,
    },
    rightArrowStyle: {
      height: 15,
      width: 12,
    },
    viewPasswordImage: {
      height: 16,
      width: 16,
      resizeMode: "contain",
      marginLeft: 5,
    },
    userInfoView: {
      flexDirection: "row",
      alignContent: "center",
      marginVertical: 20,
      justifyContent: "space-between",
      paddingLeft: 16,
    },
    rowFlex: { flexDirection: "row" },
    emailPhonetext: {
      fontSize: 18,
      fontFamily: fonts.regular,
      color: theme.colors.textColor,
    },
    viewEmailPhone: {
      left: 4,
      alignSelf: "flex-start",
      height: 30,
      width: 30,
      justifyContent: "flex-start",
      top: 6,
    },
    IdText: {
      fontSize: 14,
      fontFamily: fonts.regular,
      color: colors.searchPlaceHolder,
    },
    unVerifiedView: {
      flexDirection: "row",
      backgroundColor: colors.buttonBgColor,
      alignContent: "center",
      alignItems: "center",
      padding: 6,
      borderBottomLeftRadius: 15,
      borderTopLeftRadius: 15,
      height: 30,
    },
    verifiedView: {
      flexDirection: "row",
      backgroundColor: theme.colors.textGreenColor,
      alignContent: "center",
      alignItems: "center",
      padding: 6,
      borderBottomLeftRadius: 15,
      borderTopLeftRadius: 15,
      height: 30,
    },
    verifiedImage: {
      marginLeft: 10,
      marginRight: 6,
      height: 18,
      width: 15,
      resizeMode: "contain",
    },
    verifiedText: {
      fontSize: 14,
      fontFamily: fonts.regular,
      color: colors.white,
    },
    infoView: {
      marginHorizontal: 16,
      paddingHorizontal: 10,
      marginVertical: 15,
      height: 60,
      backgroundColor: theme.colors.tabBackground,
      // backgroundColor: colors.white,
      alignItems: "center",
      paddingLeft: 15,
      flexDirection: "row",
      flex: 1,
      borderRadius: 6,
      // flexShrink: 0,
    },
    customRightImage: {
      width: 12,
      height: 12,
      right: 32,
      // tintColor: theme.colors.inactiveTextColor,
      resizeMode: "contain",
    },
    modeIcon: {
      width: 23,
      height: 23,
      right: 32,
      tintColor: theme.colors.textColor,
      resizeMode: "contain",
    },
    btnBottom: {
      marginBottom: 30,
      marginLeft: 15,
      marginRight: 15,
      // backgroundColor: ThemeManager.colors.selectedTextColor,
      backgroundColor: theme.colors.walletDPbtn,
    },
    textModalStyle: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: theme.colors.textColor,
      // marginTop: 5,
      marginLeft: 15,
    },
    accessText: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: theme.colors.textColor,
      marginTop: 10,
      marginLeft: 15,
    },
    looseText: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: theme.colors.textColor,
      textDecorationLine: "underline",
      marginTop: 10,
      marginLeft: 15,
    },
    enterText: {
      fontSize: 18,
      fontFamily: Fonts.medium,
      color: theme.colors.textColor,
      marginTop: 10,
      marginLeft: 15,
    },
    accountDeleteText: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: theme.colors.textRedColor,
      marginTop: 10,
      marginHorizontal: 15,
    },
    totalBalanceText: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: theme.colors.textColor,
      marginVertical: 10,
      marginHorizontal: 15,
    },
    beforeDeleteText: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: theme.colors.textColor,
      marginTop: 10,
      marginHorizontal: 15,
    },
    headerDeleteText: {
      fontSize: 24,
      fontFamily: Fonts.medium,
      color: theme.colors.textColor,
      marginTop: 10,
      marginHorizontal: 15,
    },
    viewModal: {
      backgroundColor: "rgba(255,255,255,0.1)",
      margin: 20,
      padding: 10,
    },
    backgroundView: {
      backgroundColor: theme.colors.dashboardSubViewBg,
    },
    warningText: {
      alignSelf: "center",
      marginHorizontal: 16,
      color: colors.dashboarItemLightText,
      fontFamily: fonts.regular,
      fontSize: 12,
      marginBottom: 20,
    },
    onceText: {
      color: theme.colors.inactiveTextColor,
      fontSize: 14,
      fontFamily: Fonts.regular,
      marginLeft: 42,
      marginRight: 20,
      marginBottom: 30,
    },
    youRequested: {
      marginHorizontal: 8,
      color: theme.colors.textColor,
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    profileIconStyle: { height: 20, width: 20, resizeMode: "contain" },
    headerView: { marginHorizontal: 20, height: 45 },
    notificationBtn: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 15,
      marginVertical: 15,
    },
    notificationView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    notificationBtnIcon: {
      width: 20,
      height: 20,
      resizeMode: "contain",
    },
    notificationBtnText: {
      color: theme.colors.headTxt,
      fontSize: 16,
      fontFamily: fonts.regular,
      marginLeft: 10,
    },
    unreadView: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.selectedTextColor,
      marginRight: 10,
    },
    unreadArrow: { height: 12, width: 12, resizeMode: "contain" },
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.DashboardBG,
      justifyContent: "space-between",
    },
    subContainer: { justifyContent: "space-between", flex: 1 },
    errorMessageStyle: {
      fontSize: 15,
      color: "red",
      alignSelf: "center",
    },
  });
