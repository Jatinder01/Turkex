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
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useDispatch, useSelector } from "react-redux";
import { countryFlags } from "../../common/CountryFlags";
import {
  cardHolderCreate,
  getUploadDocsUserSide,
  getUploadDocsPaytendSide,
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
  { id: 0, documentName: "PASSPORT", idType: 1 },
  { id: 1, documentName: "ID Card", idType: 2 },
];
const { height, width } = Dimensions.get("window");
const UploadFiles = (props) => {
  const dispatch = useDispatch();
  const [idNumber, setIdNumber] = useState("");
  const [uploadDocumentFile, setUploadDocumentFile] = useState("");
  const [documentType, setDocumentType] = useState("PASSPORT");
  const [documentIndex, setDocumentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProfileFilled, setIsProfileFilled] = useState(false);
  const [docIdType, setDocIdType] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const hasAndroidPermission = async () => {
    if (Platform.OS === "android") {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      let status = await PermissionsAndroid.request(permission);
      if (status === "granted") {
        // savePicture();
        return true;
      } else {
        Alert.alert(constants.APP_NAME_CAPS, "CAMERA permission denied");
      }
      return status === "granted";
    } else {
      //   savePicture();
    }
  };
  useEffect(() => {
    console.log("props=-=check-=-=", JSON.stringify(props));
    console.log("props=-=check-=-=1111", props?.documentType?.document_type);
    console.log("props=-=check-=-=auditStatus", props?.auditStatus);
    console.log("props=-=check-props?.nonEaa", props?.nonEaa);

    if (props?.nonEaa) {
      if (props?.auditStatus) {
        setDocIdType(1);
        setShowUpload(true);
      } else {
        setDocIdType(1);
      }
    } else {
      if (props?.auditStatus) {
        setShowUpload(true);
      } else {
        if (props.documentType?.document_type) {
          // if (props.documentType?.document_type.toUpperCase() === "PASSPORT") {
          //   setDocIdType(1);
          // } else {
          //   setDocIdType(2);
          // }
          setDocIdType(1);
        } else {
          setDocIdType(1);
        }
      }
    }
    return () => {
      // cleanup
    };
  }, []);
  //   const handleImage = () => {
  //     this.setState({ dialogVisible: true });
  //   };

  //   const handleCancel = () => {
  //     this.setState({ dialogVisible: false });
  //   };
  const checkAndroidPermissions = async () => {
    if (Platform.OS === "android") {
      DeviceInfo.getApiLevel().then((apiLevel) => {
        if (apiLevel >= 23) {
          //  alert('hellosss')
          requestGalleryPermission();
        } else {
          openGallery();
          alert("hello");
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
  const openGallery = () => {
    try {
      Alert.alert("Select photo", "", [
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
              cropping: true,
              //multiple: true,
              // maxFiles: 3,
            }).then((image) => {
              //   handleCancel();
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
              cropping: true,
            }).then((image) => {
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
  const submitButtonClicked = () => {
    if (idNumber.length < 1) {
      Singleton.getInstance().showError(strings.cardScreen.pleaseEnterIdNumber);
    } else {
      dispatch(cardHolderCreate(docIdType, idNumber))
        .then((res) => {
          // console.log("cardHolderCreate res==-=>>", res);
          if (res.audit_status == "under_review") {
            Singleton.getInstance().showMsg(res.description);
            setShowUpload(true);
          }
        })
        .catch((err) => {
          // console.log("cardHolderCreate=--error=-=->>>", err);
          setModalVisible(false);
        });
    }
  };
  const uploadClicked = () => {
    if (props.documentType?.document_type == false) {
      dispatch(getUploadDocsUserSide())
        .then((res) => {
          console.log("getUploadDocsUserSide-0-0res>>", res);
        })
        .catch((err) => {
          console.log("getUploadDocsUserSide-0-0>>", err);
        });
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
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
              {!showUpload && (
                <>
                  <Text style={styles.inputTitle}>
                    {strings.cardScreen.selectDocumentType}
                  </Text>
                  <View style={{ marginHorizontal: 15 }}>
                    {props.nonEaa ? (
                      <View
                        style={{
                          height: 50,
                          // marginHorizontal: 15,
                          justifyContent: "center",

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
                          {"Passport"}888
                        </Text>
                      </View>
                    ) : props.documentType.document_type == false ? (
                      <SelectDropdown
                        key={"first"}
                        data={documentData}
                        // defaultValueByIndex={3}
                        onSelect={(selectedItem, index) => {
                          setDocumentType(
                            selectedItem ? selectedItem.documentName : 1
                          );

                          setDocumentIndex(index == -1 ? 0 : index);
                          setDocIdType(selectedItem ? selectedItem.idType : 1);
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
                        renderCustomizedButtonChild={(selectedItem, index) => {
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
                            backgroundColor: ThemeManager.colors.tabBackground,
                          },
                        ]}
                        rowStyle={[
                          {
                            backgroundColor: ThemeManager.colors.tabBackground,
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
                    {strings.cardScreen.idNumber}
                  </Text>
                  <InputField
                    editable={true}
                    value={idNumber}
                    title={strings.cardScreen.enterIdNumber}
                    onChangeText={(text) => {
                      setIdNumber(text);
                    }}
                    maxlength={40}
                    placeholderTextColor={
                      ThemeManager.colors.placeholderTextColor
                    }
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                    }}
                  />
                </>
              )}

              {!showUpload && (
                <ButtonPrimary
                  style={{ marginBottom: 30, marginTop: 30 }}
                  title={strings.enterAccountDetails.next}
                  onPress={() => {
                    // Actions.SelectCountry();
                    submitButtonClicked();
                  }}
                />
              )}
              {showUpload && (
                <>
                  <Text style={styles.inputTitle}>
                    {strings.cardScreen.uploadDocument}
                  </Text>
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
                      borderRadius: 8,
                      borderColor: ThemeManager.colors.headerText,
                      borderWidth: 1,
                      borderStyle: "dashed",
                    }}
                  >
                    <View>
                      {uploadDocumentFile ? (
                        <Image
                          source={
                            uploadDocumentFile
                              ? { uri: uploadDocumentFile }
                              : ThemeManager.ImageIcons.icon_upload_doc
                          }
                          style={{
                            height: 165,
                            width: width - 40,
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
          </View>
        </KeyboardAwareScrollView>
      </>
      <Modal
        animationType="Slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <Wrap
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setModalVisible(false);
              }}
            ></TouchableOpacity>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  //   height: 200,
                  width: width - 60,
                  backgroundColor: ThemeManager.colors.modalBg,
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <LottieView
                  style={{ height: 100, width: 100 }}
                  source={Images.timerLottie}
                  autoPlay
                  loop={false}
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
                    setModalVisible(false);
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setModalVisible(false);
              }}
            ></TouchableOpacity>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default UploadFiles;
