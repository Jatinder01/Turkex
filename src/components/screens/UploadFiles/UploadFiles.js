/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Keyboard,
  BackHandler,
} from "react-native";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import styles from "./UploadFilesStyles";
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
import Moment, { ISO_8601 } from "moment";
import SNSMobileSDK from "@sumsub/react-native-mobilesdk-module";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useDispatch, useSelector } from "react-redux";
import { countryFlags } from "../../common/CountryFlags";
import {
  cardHolderCreate,
  getUploadDocsUserSide,
  getUploadDocsPaytendSide,
  getCardHolderDetails,
  resetUploadDocsUserSide,
} from "../../../Redux/Actions";
import Singleton from "../../../Singleton";
import END_POINT from "../../../EndPoints";
import DatePicker from "react-native-date-picker";
import moment from "moment";
// import {color} from 'react-native-reanimated';
import SimpleHeader from "../../common/SimpleHeader";
import SelectDropdown from "react-native-select-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import DeviceInfo from "react-native-device-info";
import LottieView from "lottie-react-native";
let documentData = [
  { id: 0, documentName: "PASSPORT", idType: 2, documentTypeName: "passport" },
  { id: 1, documentName: "ID Card", idType: 1, documentTypeName: "id_card" },
];
let backCall = false;
const { height, width } = Dimensions.get("window");
const UploadFiles = (props) => {
  const dispatch = useDispatch();
  const [idNumber, setIdNumber] = useState("");
  const [uploadDocumentFile, setUploadDocumentFile] = useState("");
  const [uploadDocumentSelfie, setUploadDocumentSelfie] = useState("");
  const [documentType, setDocumentType] = useState("PASSPORT");
  const [documentSetType, setDocumentSetType] = useState("passport");

  const [documentIndex, setDocumentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProfileFilled, setIsProfileFilled] = useState(false);
  const [docIdType, setDocIdType] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [showUploadSelfie, setShowUploadSelfie] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const {
    uploadDocPaytendSide,
    isUploadDocPaytendSideLoading,
    uploadDocPaytendSideError,
  } = useSelector((state) => state.uploadDocsPaytendSideReducer);
  // const [backStatus, setBackStatus] = useState(false);
  const [checkState, setCheckState] = useState(false);
  const {
    uploadDocUserSide,
    uploadDocUserSideError,
    isUploadDocUserSideLoading,
  } = useSelector((state) => state.uploadDocsUserSideReducer);

  const { cardHolder, error, isLoading } = useSelector(
    (state) => state.createCardHolderReducer
  );
  // console.log("isUploadDocUserSideLoading=--", isUploadDocUserSideLoading);
  // console.log(
  //   "isUploadDocPaytendSideLoading=--",
  //   isUploadDocPaytendSideLoading
  // );
  // console.log("isLoading=--", isLoading);

  useEffect(() => {
    // alert("singleddd");
    dispatch(resetUploadDocsUserSide());
    console.log("props=-=check-=-=", JSON.stringify(props));
    console.log("props=-=check-=-=1111", props?.documentType?.document_type);
    console.log("props=-=check-=-=auditStatus", props?.auditStatus);
    console.log("props=-=check-props?.nonEaa", props?.nonEaa);
    getUserCardDetails();
    if (props?.nonEaa) {
      // alert("single");
      if (props?.auditStatus) {
        console.log("props.nonEaa=-=-=-", props?.documentType?.document_type);

        // setDocumentSetType(
        //   props?.documentType?.document_type == "PASSPORT"
        //     ? "passport"
        //     : "id_card"
        // );
        setDocumentSetType(
          props?.auditStatus?.idno_type == "1" ? "id_card" : "passport"
        );
        console.log(
          "props?.auditStatus?.document_status=-=--",
          props?.auditStatus?.document_status
        );
        setDocIdType(2);
        if (props?.auditStatus?.document_status) {
          setShowUpload(false);
          setShowUploadSelfie(true);
        } else {
          setShowUpload(true);
          setShowUploadSelfie(false);
        }
      } else {
        console.log("props.nonEaa=-else=-=-");
        if (props?.auditStatus?.document_status) {
          if (props?.auditStatus?.document_status == "PASSPORT") {
            // alert("hello");
            setDocIdType(2);
          } else {
            setDocIdType(1);
            // alert("helloeee");
          }

          // setShowUpload(false);
          // setShowUploadSelfie(true);
        } else {
          setDocIdType(2);
          // setShowUpload(true);
          // setShowUploadSelfie(false);
        }
      }
    } else {
      let checkDocType = Singleton.getInstance().getData(
        constants.PAYTEND_ID_TYPE
      );
      console.log(
        "props?.auditStatus?.document_status=-=--",
        props?.auditStatus?.document_status
      );
      console.log(
        "props.documentType?.document_type=-=--",
        props.documentType?.document_type
      );
      console.log("props?.auditStatus=-=--", props?.auditStatus);
      if (props?.auditStatus) {
        if (props?.auditStatus?.document_status) {
          setShowUpload(false);
          setShowUploadSelfie(true);
          setDocIdType(props?.auditStatus?.idno_type);
          setDocumentSetType(
            props?.auditStatus?.idno_type == "1" ? "id_card" : "passport"
          );
        } else {
          setDocIdType(props?.auditStatus?.idno_type);

          setDocumentSetType(
            props?.auditStatus?.idno_type == "1" ? "id_card" : "passport"
          );
          setShowUpload(true);
          setShowUploadSelfie(false);
        }
        // if (props.documentType?.document_type) {
        //   console.log(
        //     "document_type=-=-=-=---",
        //     props.documentType?.document_type
        //   );
        //   if (props.documentType?.document_type.toUpperCase() === "PASSPORT") {
        //     setDocIdType(2);
        //     // alert("hey");
        //     setDocumentType("PASSPORT");
        //     setDocumentSetType("passport");
        //   } else {
        //     // alert("buy");
        //     setDocIdType(1);
        //     setDocumentType("ID Card");
        //     setDocumentSetType("id_card");
        //   }
        //   // setDocIdType(1);
        // } else {
        //   setShowUpload(true);
        //   setDocIdType(2);
        //   setDocumentType("PASSPORT");
        //   setDocumentSetType("passport");
        // }
      } else {
        console.log(
          "props.documentType?.document_type-----s=-=--",
          props.documentType?.document_type
        );
        if (props.documentType?.document_type) {
          if (props.documentType?.document_type.toUpperCase() === "PASSPORT") {
            setDocIdType(2);

            setDocumentType("PASSPORT");
            setDocumentSetType("passport");
          } else {
            setDocIdType(1);
            setDocumentType("ID Card");
            setDocumentSetType("id_card");
          }
        } else {
          setDocIdType(2);
          setDocumentType("PASSPORT");
          setDocumentSetType("passport");
        }
      }
    }
    const backAction = () => {
      console.log("Actions.currentScene=-=-=", Actions.currentScene);
      if (Actions.currentScene === "CardInitial") {
        Actions.currentScene != "Home" && Actions.Home();
        return true;
      } else if (Actions.currentScene === "UploadFiles") {
        console.log("Actions.currentScene=-=-=showUpload", showUpload);
        console.log(
          "Actions.currentScene=-=-=showUploadSelfie",
          showUploadSelfie
        );
        console.log(
          "Actions.currentScene=-=-=showUploadSelfie=-=-=",
          showUpload || showUploadSelfie
        );
        console.log(
          "Actions.currentScene=-=-=showUploadSelfie=-=-backCall=",
          backCall
        );
        backCall ? Actions.CardsScreen() : Actions.pop();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      // cleanup
      dispatch(resetUploadDocsUserSide());
      backHandler.remove();
    };
  }, []);
  const getUserCardDetails = () => {
    dispatch(getCardHolderDetails())
      .then((response) => {
        console.log("----getCardHolderDetails-22 res-->", response);
        if (response?.description == "Selfie upload successfully") {
          setModalVisible(true);
        }
      })
      .catch((err) => {
        console.log("----getCardHolderDetails-22 err-->", err);
      });
  };
  //   const handleImage = () => {
  //     this.setState({ dialogVisible: true });
  //   };

  //   const handleCancel = () => {
  //     this.setState({ dialogVisible: false });
  //   };
  const checkAndroidPermissionsSelfie = async () => {
    if (Platform.OS === "android") {
      DeviceInfo.getApiLevel().then((apiLevel) => {
        if (apiLevel >= 23) {
          //  alert('hellosss')
          requestGalleryPermissionSelfie();
        } else {
          openCameraSelfie();
          // alert("hello");
        }
      });
    } else {
      openCameraSelfie();
    }
  };
  const requestGalleryPermissionSelfie = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Evo Europe App read external storage Permission",
          message:
            "Evo Europe App needs access to read external storage " +
            "so you can upload phots.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openCameraSelfie();
      } else {
        console.log("Read external storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const checkAndroidPermissions = async () => {
    if (Platform.OS === "android") {
      DeviceInfo.getApiLevel().then((apiLevel) => {
        if (apiLevel >= 23) {
          //  alert('hellosss')
          requestGalleryPermission();
        } else {
          openGallery();
          // alert("hello");
        }
      });
    } else {
      openGallery();
    }
  };
  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Evo Europe App read external storage Permission",
          message:
            "Evo Europe App needs access to read external storage " +
            "so you can upload phots.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openGallery();
      } else {
        console.log("Read external storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const openCameraSelfie = () => {
    try {
      Alert.alert("EVO EUROPE", "Open Camera for selfie", [
        {
          text: "Cancel",
          onPress: () => {},
        },

        {
          text: "Camera",
          onPress: () => {
            ImagePicker.openCamera({
              width: 200,
              height: 200,
              compressImageMaxHeight: 400,
              compressImageMaxWidth: 400,
              compressImageQuality: 0.8,
              cropping: false,
              useFrontCamera: true,
              //multiple: true,
              // maxFiles: 3,
            }).then((image) => {
              console.log("image===->>>", image);
              //   handleCancel();
              let imageData = {
                uri: image.path,
              };
              setUploadDocumentSelfie(imageData.uri);
              saveCameraSelfie(imageData.uri);
            });
          },
        },
      ]);
    } catch (error) {
      console.log("error openGallery--------------" + error);
    }
  };
  const openGallery = () => {
    try {
      Alert.alert("EVO EUROPE", "Select photo", [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Camera",
          onPress: () => {
            ImagePicker.openCamera({
              width: 200,
              height: 200,
              compressImageMaxHeight: 400,
              compressImageMaxWidth: 400,
              compressImageQuality: 0.8,
              cropping: false,
              // multiple: false,
              // maxFiles: 3,
            }).then((image) => {
              //   handleCancel();
              console.log("image==111=->>>", image);
              let imageData = {
                uri: image.path,
              };
              setUploadDocumentFile(imageData.uri);
              saveProfileImage(imageData.uri);
            });
          },
        },
        {
          text: "Gallery",
          onPress: () => {
            ImagePicker.openPicker({
              width: 200,
              height: 200,
              compressImageMaxHeight: 400,
              compressImageMaxWidth: 400,
              compressImageQuality: 0.8,
              cropping: false,
              multiple: false,
              mediaType: "photo",
            }).then((image) => {
              console.log("image==222=->>>", image);

              //   handleCancel();
              let imageData = {
                uri: image.path,
              };
              setUploadDocumentFile(imageData.uri);
              saveProfileImage(imageData.uri);
            });
          },
        },
      ]);
    } catch (error) {
      console.log("error openGallery--------------" + error);
    }
  };
  const saveCameraSelfie = async (uri) => {
    let formData = new FormData();
    let fileName = uri.substring(uri.lastIndexOf("/") + 1);
    console.log("image upload---fileName", fileName);
    formData.append("profilePic", {
      name: fileName,
      uri: uri,
      type: "image/jpg",
    });

    console.log(
      "image upload--------------- formdata",
      JSON.stringify(formData)
    );
    const headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };
  };
  const saveProfileImage = async (uri) => {
    let formData = new FormData();
    let fileName = uri.substring(uri.lastIndexOf("/") + 1);
    console.log("image upload---fileName", fileName);
    formData.append("profilePic", {
      name: fileName,
      uri: uri,
      type: "image/jpg",
    });

    console.log(
      "image upload--------------- formdata",
      JSON.stringify(formData)
    );
    const headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };

    // axios
    //   .post(Config.API_URL + Config.updateProfile, formData, {headers: headers})
    //   .then(response => {
    //     console.warn(
    //       'image upload============>' +
    //         JSON.stringify(response.data.result.profile_pic_path),
    //     );
    //     var imageUrl = response.data.result.profile_pic_path;
    //     this.setState({loading: false});
    //     if (response.data.status) {
    //       this.setState({
    //         profileImage: imageUrl,
    //       });
    //       setTimeout(() => {
    //         showSnack('Profile pic updated');
    //       }, 300);
    //     } else {
    //     }
    //   })
    //   .catch(error => {
    //     console.log('response EE ---------->' + JSON.stringify(error));
    //     this.setState({
    //       loading: false,
    //     });
    //   });
  };
  const createCardHolder = () => {
    let noSpace = idNumber.replace(/\s/g, "");
    console.log("docIdType checkState==-=>>", docIdType);
    console.log("docIdType checkState==-=>>", noSpace);
    dispatch(cardHolderCreate(docIdType, noSpace))
      .then((res) => {
        setCheckState(true);
        backCall = true;
        setTimeout(() => {
          console.log("cardHolderCreate checkState==-=>>", checkState);
        }, 300);

        console.log("cardHolderCreate res==-=>>", res);
        console.log("cardHolderCreate props?.nonEaa==-=>>", props?.nonEaa);
        console.log("cardHolderCreateres.audit_status==-=>>", res.audit_status);
        console.log(
          "cardHolderCreateres.audit_status==-=>>111",
          props?.documentType?.document_type
        );

        if (res.audit_status == "under_review") {
          Singleton.getInstance().showMsg(res.description);
          if (
            props?.nonEaa &&
            props?.documentType?.document_type != "PASSPORT"
          ) {
            setShowUpload(true);
            setLoader(false);
          } else {
            console.log("cardHolderCreate EAA type==-=>>");
            if (
              props?.documentType?.document_type == false &&
              props?.nonEaa == false
            ) {
              setShowUpload(true);
              setLoader(false);
            } else {
              setLoader(true);
              setTimeout(() => {
                dispatch(getUploadDocsPaytendSide(documentSetType))
                  .then((response) => {
                    console.log("getUploadDocsPaytendSide res==-=>>", response);
                    if (
                      response?.data?.document_status &&
                      !response?.data?.selfie_status
                    ) {
                      setShowUploadSelfie(true);
                      setShowUpload(false);
                      setLoader(false);
                    }
                  })
                  .catch((error) => {
                    console.log(
                      "getUploadDocsPaytendSide-=>>err",
                      JSON.stringify(error)
                    );
                    console.log(
                      "getUploadDocsPaytendSide-=>>errww",
                      error?.response
                    );

                    console.log(
                      "getUploadDocsPaytendSide-=>>errweee",
                      error?.response?.status
                    );
                    if (error?.response?.status == "504") {
                      setTimeout(() => {
                        dispatch(getCardHolderDetails())
                          .then((response) => {
                            console.log(
                              "----getCardHolderDetails-22 res-ddd->",
                              response
                            );
                            if (
                              response?.document_status == true &&
                              response?.selfie_status == false
                            ) {
                              setShowUploadSelfie(true);
                              setShowUpload(false);
                              setLoader(false);
                            } else if (
                              response?.document_status == false &&
                              response?.selfie_status == false
                            ) {
                              // setShowUploadSelfie(false);
                              // setShowUpload(false);
                              Actions.pop();
                              setLoader(false);
                            } else {
                              setShowUploadSelfie(false);
                              setShowUpload(false);
                              setLoader(false);
                            }
                          })
                          .catch((err) => {
                            console.log(
                              "----getCardHolderDetails-22 err-->",
                              err
                            );
                          });
                      }, 10000);
                    } else {
                      // setShowUploadSelfie(false);
                      // setShowUpload(false);
                      Actions.pop();
                      setLoader(false);
                    }
                  });
              }, 3000);
            }
            //{"doc_type":"passport"/ "selfie"/ "id_card"}
          }
        }
      })
      .catch((err) => {
        console.log("cardHolderCreate=--error=-=->>>", err);
        if (err == "Cardholder has exists") {
          // Actions.pop();
          // Singleton.getInstance().showError(err);
          setModalVisible(false);
          setLoader(false);
        } else if (err == "Server down, please try after sometime") {
          setModalVisible(false);
          setLoader(false);

          Singleton.getInstance().showError(`${err}`);
        } else if (err == "Internal Server Error") {
          setModalVisible(false);
          setLoader(false);

          Singleton.getInstance().showError(`${err}`);
        } else {
          setModalVisible(false);
          setLoader(false);
          let textError = props?.nonEaa
            ? "Passport"
            : docIdType == "2"
            ? "Passport"
            : "ID";
          Singleton.getInstance().showError(`${textError}${err}`);
        }
      });
  };
  const submitButtonClicked = () => {
    Keyboard.dismiss();
    console.log("props.documentType==-=>>", props.documentType.document_type);
    console.log("documentType-=>>", documentType);

    console.log("props.documentType.document_type==----=>>", idNumber.length);
    console.log("props.documentType.document_type==<<=", idNumber.length > 8);
    let noSpace = idNumber.replace(/\s/g, "");
    if (noSpace.length <= 0) {
      let errMsg = `${strings.cardScreen.please_enter}${
        documentType == "PASSPORT" ? "Passport" : "ID"
      }${strings.cardScreen.number}`;
      Singleton.getInstance().showError(errMsg);
      setLoader(false);
      return;
    } else if (documentType.toUpperCase() == "PASSPORT") {
      if (noSpace.length > 8 && noSpace.length < 10) {
        // setLoader(true);
        console.log("cardHolderCreate docIdType=====-=>>", docIdType);
        console.log("cardHolderCreate idNumber==-==->>", idNumber);

        createCardHolder();
      } else {
        let errMsg = `${strings.cardScreen.please_enter}${"Passport"}${
          strings.cardScreen.number
        }`;
        Singleton.getInstance().showError(errMsg);
        setLoader(false);
        return;
      }
    } else if (documentType == "ID Card") {
      if (noSpace.length > 5 && noSpace.length <= 20) {
        console.log("cardHolderCreate docIdType=22====-=>>", docIdType);
        console.log("cardHolderCreate idNumber==22-==->>", idNumber);
        createCardHolder();
      } else {
        let errMsg = `${strings.cardScreen.please_enter}${"ID"}${
          strings.cardScreen.number
        }`;
        Singleton.getInstance().showError(errMsg);
        setLoader(false);
        return;
      }
    }
  };
  const uploadClickedSelfie = () => {
    Keyboard.dismiss();

    console.log("uploadDocumentSelfie-0-0>>", uploadDocumentSelfie);
    console.log(
      "uploadDocumentSelfie.length-0-0>>",
      uploadDocumentSelfie.length
    );
    console.log(
      "uploadDocumentSelfie.length < 0-0-0>>",
      uploadDocumentSelfie.length < 0
    );
    console.log(
      "uploadDocumentFile.length>0 < 0-0-0>>",
      uploadDocumentSelfie.length > 0
    );

    if (uploadDocumentSelfie.length > 0) {
      setLoader(true);
      dispatch(getUploadDocsUserSide("selfie", uploadDocumentSelfie))
        .then((res) => {
          console.log("uploadDocumentSelfie-0-0res>>", res);
          if (res.data.document_status && res.data.selfie_status) {
            setModalVisible(true);
            setLoader(false);
            backCall = true;
          }
        })
        .catch((err) => {
          console.log("uploadDocumentSelfie-0-0>>", err);
          setLoader(false);
        });
    } else {
      setLoader(false);
      Singleton.getInstance().showError("Please Upload Selfie");
    }
  };
  const uploadClicked = () => {
    Keyboard.dismiss();

    console.log("uploadDocumentFile-0-0>>", uploadDocumentFile);
    console.log("documentSetType-0-0>>", documentSetType);

    console.log("uploadDocumentFile.length-0-0>>", uploadDocumentFile.length);
    console.log(
      "uploadDocumentFile.length < 0-0-0>>",
      uploadDocumentFile.length < 0
    );
    console.log(
      "uploadDocumentFile.length>0 < 0-0-0>>",
      uploadDocumentFile.length > 0
    );

    if (
      props.documentType?.document_type == false ||
      props?.auditStatus?.audit_status == "rejection"
    ) {
      if (uploadDocumentFile.length > 0) {
        setLoader(true);
        dispatch(getUploadDocsUserSide(documentSetType, uploadDocumentFile))
          .then((res) => {
            console.log("getUploadDocsUserSide-0-0res>>", res);
            if (res.data?.document_status && !res.data?.selfie_status) {
              setShowUpload(false);
              setShowUploadSelfie(true);
              backCall = true;
              // setBackStatus(true)
              setLoader(false);
            }
          })
          .catch((err) => {
            setLoader(false);

            console.log("getUploadDocsUserSide-0-0>>", err);
          });
      } else {
        setLoader(false);

        Singleton.getInstance().showError("Please Upload File");
      }
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      {modalVisible ? (
        <Wrap
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          screenStyle={[
            styles.screenStyle,
            { backgroundColor: ThemeManager.colors.SwapInput },
          ]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <Loader isLoading={modalLoading} />
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  //   height: 200,
                  width: width - 60,
                  backgroundColor: ThemeManager.colors.DashboardBG,
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <LottieView
                  style={{ height: 100, width: 100 }}
                  source={Images.timerLottie}
                  autoPlay
                  loop={true}
                />
                <Text
                  style={{
                    color: ThemeManager.colors.modalTitle,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {strings.cardScreen.verificationPending}
                </Text>
                <Text
                  style={{
                    color: ThemeManager.colors.modalTitle1,
                    fontSize: 14,
                    fontFamily: Fonts.light,
                    textAlign: "center",
                    margin: 10,
                  }}
                >
                  {strings.cardScreen.thankYou}
                </Text>
                <ButtonPrimary
                  title={strings.cardScreen.ok}
                  style={{
                    height: 50,
                    marginVertical: 20,
                    width: "100%",
                    backgroundColor: ThemeManager.colors.selectedTextColor,
                    borderRadius: 4,
                  }}
                  textstyle={{ paddingHorizontal: 50 }}
                  onPress={() => {
                    // setModalVisible(false);
                    // alert("hello");
                    setModalLoading(true);
                    Actions.currentScene != "Home" && Actions.Home();
                  }}
                />
              </View>
            </View>
          </View>
        </Wrap>
      ) : (
        <>
          <View style={{ marginHorizontal: 20, height: 40, marginBottom: 15 }}>
            <SimpleHeader
              titleName={""}
              backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
              // titleName={'kjjkh'}
              titleStyle={{
                fontSize: 18,
                fontFamily: Fonts.medium,
                color: ThemeManager.colors.textColor,
                // marginLeft: 10,
              }}
              onBackPress={() => {
                backCall ? Actions.CardsScreen() : Actions.pop();
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
                {!showUpload && !showUploadSelfie && (
                  <>
                    {/* <Text
                    style={[
                      styles.inputTitle,
                      {
                        fontSize: 22,
                        fontFamily: Fonts.medium,
                        color: ThemeManager.colors.textColor,
                      },
                    ]}
                  >
                    {strings.cardScreen.uploadFile}
                  </Text> */}
                    {props.documentType.document_type == false ? (
                      <Text style={styles.inputTitle}>
                        {strings.cardScreen.selectDocumentType}
                      </Text>
                    ) : (
                      <View style={{ marginTop: 15 }} />
                    )}
                    <View style={{ marginHorizontal: 15 }}>
                      {props.nonEaa ? (
                        <View
                          style={{
                            height: 50,
                            // marginHorizontal: 15,
                            justifyContent: "center",

                            backgroundColor: ThemeManager.colors.SwapInput,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              marginHorizontal: 15,
                              fontFamily: Fonts.regular,
                              fontSize: 13,
                              color: ThemeManager.colors.textColor1,
                            }}
                          >
                            {"Passport"}
                          </Text>
                        </View>
                      ) : props.documentType.document_type == false ? (
                        <SelectDropdown
                          key={"first"}
                          dropdownOverlayColor={"transparent"}
                          data={documentData}
                          // defaultValueByIndex={3}
                          onSelect={(selectedItem, index) => {
                            console.log("");
                            setIdNumber("");
                            setDocumentType(
                              selectedItem ? selectedItem.documentName : 1
                            );
                            setDocumentSetType(
                              selectedItem
                                ? selectedItem.documentTypeName
                                : "passport"
                            );
                            setDocumentIndex(index == -1 ? 0 : index);
                            setDocIdType(
                              selectedItem ? selectedItem.idType : 1
                            );
                          }}
                          // selectedIndex={genderIndex}
                          // buttonStyle={styles.dropdown3BtnStyle}
                          buttonStyle={{
                            width: "100%",
                            borderBottomRightRadius: 4,
                            borderTopRightRadius: 4,
                            height: 49,
                            alignSelf: "flex-end",
                            backgroundColor: ThemeManager.colors.tabBackground,
                          }}
                          renderCustomizedButtonChild={(
                            selectedItem,
                            index
                          ) => {
                            console.log("selectedItem=-=-=-", selectedItem);
                            console.log("selectedItem=-=-=-index", index);

                            return (
                              <View style={[styles.dropdown3BtnChildStyle]}>
                                <Text
                                  style={[
                                    styles.dropdown3BtnTxt,
                                    {
                                      color: ThemeManager.colors.textColor1,
                                      textTransform: "capitalize",
                                      fontFamily: Fonts.regular,
                                      marginLeft: 5,
                                    },
                                  ]}
                                >
                                  {selectedItem
                                    ? selectedItem.documentName
                                    : documentType}
                                </Text>

                                <Image
                                  source={{ uri: Images.icon_dropDown }}
                                  style={{
                                    height: 15,
                                    width: 15,
                                    resizeMode: "contain",
                                    tintColor: ThemeManager.colors.textColor1,
                                    marginRight: 8,
                                  }}
                                />
                              </View>
                            );
                          }}
                          dropdownStyle={[
                            {
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            },
                          ]}
                          rowStyle={[
                            {
                              backgroundColor:
                                ThemeManager.colors.tabBackground,
                            },
                          ]}
                          renderCustomizedRowChild={(item, index) => {
                            console.log(
                              "print item -0-0-0>>",
                              item,
                              "=-=index=-=",
                              index
                            );
                            return (
                              <>
                                <View
                                  style={{
                                    flex: 1,

                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",

                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.dropdown3RowTxt,
                                      {
                                        color:
                                          documentIndex === index
                                            ? ThemeManager.colors
                                                .selectedTextColor
                                            : ThemeManager.colors.textColor1,
                                        fontFamily: Fonts.regular,
                                        textTransform: "capitalize",
                                      },
                                    ]}
                                  >
                                    {item?.documentName}
                                  </Text>
                                </View>
                              </>
                            );
                          }}
                        />
                      ) : props.documentType.document_type == "PASSPORT" ? (
                        <View
                          style={{
                            height: 50,
                            // marginHorizontal: 15,
                            justifyContent: "center",
                            borderRadius: 6,
                            backgroundColor: ThemeManager.colors.SwapInput,
                          }}
                        >
                          <Text
                            style={{
                              marginHorizontal: 15,
                              fontFamily: Fonts.regular,
                              fontSize: 13,
                              color: ThemeManager.colors.textColor1,
                            }}
                          >
                            {"Passport"}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            height: 50,
                            // marginHorizontal: 15,
                            justifyContent: "center",
                            borderRadius: 6,
                            backgroundColor: ThemeManager.colors.SwapInput,
                          }}
                        >
                          <Text
                            style={{
                              marginHorizontal: 15,
                              fontFamily: Fonts.regular,
                              fontSize: 13,
                              color: ThemeManager.colors.textColor1,
                            }}
                          >
                            {"ID Card"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.inputTitle}>
                      {props?.nonEaa
                        ? strings.cardScreen.passportNumber
                        : docIdType == "2"
                        ? strings.cardScreen.passportNumber
                        : strings.cardScreen.idNumber}
                    </Text>
                    <InputField
                      autoCapitalize={"characters"}
                      editable={true}
                      value={idNumber}
                      title={
                        props?.nonEaa
                          ? strings.cardScreen.enterPassportNumber
                          : docIdType == "2"
                          ? strings.cardScreen.enterPassportNumber
                          : strings.cardScreen.enterIdNumber
                      }
                      onChangeText={(text) => {
                        console.log("documentType=-=-=", documentType);
                        // if (documentType == "PASSPORT") {
                        //   console.log("documentType=-=-=222", documentType);
                        //   var patt = new RegExp("^([A-Z a-z]){1}([0-9]){7}$");
                        //   if (patt.test(text)) {
                        //     setIdNumber(text);
                        //   } else {
                        //     Singleton.getInstance().showError(
                        //       "Invalid Passport Number."
                        //     );
                        //   }
                        // } else {
                        //   setIdNumber(text);
                        // }
                        if (constants.ALPHANUMERIC_REGEX.test(text)) {
                          setIdNumber(text.replace(/\s/g, ""));
                        }
                      }}
                      maxlength={documentType == "PASSPORT" ? 9 : 20}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      customContainerStyle={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                      }}
                    />
                  </>
                )}

                {!showUpload && !showUploadSelfie && (
                  <ButtonPrimary
                    style={{ marginBottom: 30, marginTop: 30 }}
                    title={strings.enterAccountDetails.next}
                    onPress={() => {
                      // Actions.SelectCountry();
                      submitButtonClicked();
                    }}
                  />
                )}
                {showUpload && !showUploadSelfie && (
                  <>
                    <Text
                      style={[
                        styles.inputTitle,
                        {
                          fontSize: 22,
                          fontFamily: Fonts.medium,
                          color: ThemeManager.colors.textColor,
                        },
                      ]}
                    >
                      {strings.cardScreen.uploadFile}
                    </Text>
                    <Text style={styles.inputTitle}>
                      {/* {strings.cardScreen.uploadDocument}
                       */}
                      Upload{" "}
                      {props?.nonEaa
                        ? "Passport"
                        : docIdType == "2"
                        ? "Passport"
                        : "ID"}
                    </Text>
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {props?.nonEaa
                          ? strings.cardScreen.gov_issued_passport
                          : docIdType == "2"
                          ? strings.cardScreen.gov_issued_passport
                          : strings.cardScreen.gov_issued}
                      </Text>
                    </View>
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {strings.cardScreen.original_and}
                      </Text>
                    </View>
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {strings.cardScreen.clear_and}
                      </Text>
                    </View>
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {strings.cardScreen.no_black}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        checkAndroidPermissions();
                      }}
                      style={{
                        backgroundColor: ThemeManager.colors.SwapInput,
                        height: 170,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 15,
                        marginTop: 15,
                        borderRadius: 8,
                        borderColor: ThemeManager.colors.headerText,
                        borderWidth: 1,
                        borderStyle: "dashed",
                      }}
                    >
                      <View style={{ overflow: "hidden", borderRadius: 8 }}>
                        {uploadDocumentFile ? (
                          <Image
                            source={
                              uploadDocumentFile
                                ? { uri: uploadDocumentFile }
                                : ThemeManager.ImageIcons.icon_upload_doc
                            }
                            style={{
                              height: 168,
                              width: width - 30,
                              resizeMode: "stretch",
                            }}
                            // borderRadius={6}
                          />
                        ) : (
                          <Image
                            source={{
                              uri: ThemeManager.ImageIcons.icon_upload_doc,
                            }}
                            style={{
                              height: 120,
                              width: 120,
                              resizeMode: "contain",
                            }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.inputTitle}>
                      {strings.cardScreen.uploadJpg}
                    </Text>
                  </>
                )}
                {showUploadSelfie && (
                  <>
                    <Text
                      style={[
                        styles.inputTitle,
                        {
                          fontSize: 22,
                          fontFamily: Fonts.medium,
                          color: ThemeManager.colors.textColor,
                          marginBottom: 20,
                          // marginTop: -10,
                        },
                      ]}
                    >
                      {strings.cardScreen.upload_selfie}
                    </Text>
                    {/* <Text style={[styles.inputTitle]}>
                    {strings.cardScreen.upload_selfie}
                  </Text> */}
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {props?.nonEaa
                          ? strings.cardScreen.take_a_photo_of_yourself_passport
                          : docIdType == "2"
                          ? strings.cardScreen.take_a_photo_of_yourself_passport
                          : strings.cardScreen.take_a_photo_of_yourself}
                      </Text>
                    </View>
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {strings.cardScreen.make_sure_your}
                      </Text>
                    </View>
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {strings.cardScreen.ensure_adequate}
                      </Text>
                    </View>
                    <View style={styles.flexRowStyles}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Images.icon_Agree_check }}
                      />
                      <Text
                        style={[
                          styles.txtStyle,
                          { color: ThemeManager.colors.headerText },
                        ]}
                      >
                        {props?.nonEaa
                          ? strings.cardScreen.do_not_your_passport
                          : docIdType == "2"
                          ? strings.cardScreen.do_not_your_passport
                          : strings.cardScreen.do_not_your_Id}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        // checkAndroidPermissions();
                        checkAndroidPermissionsSelfie();
                      }}
                      style={{
                        marginTop: 10,
                        backgroundColor: ThemeManager.colors.SwapInput,
                        height: 200,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 15,
                        borderRadius: 8,
                        borderColor: ThemeManager.colors.headerText,
                        borderWidth: 1,
                        borderStyle: "dashed",
                      }}
                    >
                      <View style={{ overflow: "hidden", borderRadius: 8 }}>
                        {uploadDocumentSelfie ? (
                          <Image
                            source={
                              uploadDocumentSelfie
                                ? { uri: uploadDocumentSelfie }
                                : ThemeManager.ImageIcons.icon_upload_doc
                            }
                            style={{
                              height: 198,
                              width: width - 30,
                              // borderRadius: 3,
                              resizeMode: "stretch",
                            }}
                          />
                        ) : (
                          <Image
                            source={{
                              uri: ThemeManager.ImageIcons.icon_upload_doc,
                            }}
                            style={{
                              height: 120,
                              width: 120,
                              resizeMode: "contain",
                            }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.inputTitle}>
                      {strings.cardScreen.uploadJpg}
                    </Text>
                  </>
                )}
              </View>

              <View>
                {showUpload && (
                  <ButtonPrimary
                    style={{ marginBottom: 30 }}
                    title={strings.enterAccountDetails.next}
                    onPress={() => {
                      // Actions.SelectCountry();
                      uploadClicked();
                    }}
                  />
                )}
              </View>
              <View>
                {showUploadSelfie && !showUpload && (
                  <ButtonPrimary
                    style={{ marginBottom: 30 }}
                    title={strings.enterAccountDetails.next}
                    onPress={() => {
                      // Actions.SelectCountry();
                      uploadClickedSelfie();
                    }}
                  />
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
          <Loader
            isLoading={
              isUploadDocPaytendSideLoading ||
              isUploadDocUserSideLoading ||
              isLoading ||
              loader
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default UploadFiles;
