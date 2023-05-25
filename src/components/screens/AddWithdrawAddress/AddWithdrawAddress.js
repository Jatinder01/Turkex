/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";

import {
  View,
  Text,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking,
  Platform,
  PermissionsAndroid,
} from "react-native";

import {
  Button,
  HeaderVerification,
  Spinner,
  InputVerification,
  BenificiaryList,
  Wrap,
  InputField,
  Loader,
  ButtonPrimary,
} from "../../common";

import {
  resetBenificiaryForm,
  benificiaryFormUpdate,
  addNewBenificiary,
  getAllBenificiary,
  deleteBenificiary,
  activateBenificiary,
  resendPinCodeBenificiary,
  activateOtpMailBenificiary,
} from "../../../Redux/Actions";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import * as constants from "../../../Constants";
import { showMessage, hideMessage } from "react-native-flash-message";

const { height } = Dimensions.get("window");
import DialogInput from "react-native-dialog-input";
import { ThemeManager } from "../../../../ThemeManager";
import styles from "./AddWithdrawAddressStyle";
import WalletHeader from "../../common/WalletHeader";
import { strings } from "../../../../Localization";
import { Fonts, Images } from "../../../theme";
import Singleton from "../../../Singleton";
import QRScanner from "../../common/QRScanner";
import QrImageReader, { DecodeOptions } from "react-native-qr-image-reader";
// import { CameraKitCameraScreen } from "react-native-camera-kit";
// import { CameraScreen } from "react-native-camera-kit";
import QRCodeScanner from "react-native-qrcode-scanner";
import ImagePicker, { launchImageLibrary } from "react-native-image-picker";
// import { RNCamera } from "react-native-camera";
// import { CameraScreen } from "react-native-camera-kit";
import { RNCamera } from "react-native-camera";
import moment from "moment";
// import { RNCamera } from "../../../../react-native-camera";
// const { RNCamera } = require("../../../../react-native-camera");
let beniId;
let intervalId;
class AddWithdrawAddress extends PureComponent {
  componentDidMount() {
    this.props.benificiaryFormUpdate({
      prop: "beniAddress",
      value: "",
    });
    this.setState({
      errorRemove: "",
      showCountDown: false,
      pinCode: "",
    });
    // this.startTimer();
    // this.getPermissions();
  }
  getPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Evo Europe App Camera Permission for scanning qr code",
          message:
            "Evo Europe App needs access to your camera " +
            "so you can scan pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the camera");
        // this.setState({
        //   // showScanner: true,
        //   showCamera: true,
        // });
      } else {
        console.log("Camera permission denied");
        // alert("Camera permission denied");
        Singleton.getInstance().showError("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  componentWillUnmount() {
    this.props.getAllBenificiary();
    this.setState({
      errorRemove: "",
      showCountDown: false,
      pinCode: "",
    });

    clearInterval(intervalId);
  }
  startTimer = () => {
    intervalId = setInterval(() => {
      if (this.state.count == 1) {
        this.setState({
          showCountDown: false,
        });
        clearInterval(intervalId);
      } else {
        this.setState((prevState) => {
          Singleton.getInstance()
            .saveData(
              constants.TIME_INTERVAL,
              JSON.stringify(prevState.count - 1)
            )
            .then((res) => { });
          return {
            count: prevState.count - 1,
          };
        });
      }
    }, 1000);
  };

  state = {
    isDialogVisible: false,
    beniId: 0,
    pinCode: "",
    loading: false,
    modalVisible: false,
    code_2fa: "",
    errorRemove: "",
    showScanner: false,
    qrCodeValue: "",
    result: null,
    showCamera: false,
    loader: false,
    count: 60,
    showCountDown: false,
  };

  showDialog(value) {
    this.setState({ isDialogVisible: value });
  }

  renderAddButton() {
    if (this.props.isLoadingBeni) {
      return (
        <View style={{ height: 40 }}>
          <Spinner />
        </View>
      );
    }

    return (
      <ButtonPrimary
        style={styles.btnBottom}
        title={strings.beneficiary_screen.add}
        onPress={() => {
          const { beniName, beniAddress, beniDesc, beniOtp } = this.props;
          var currency = this.props.selectedCoin.id;
          var blockchain_key = this.props.selectedBlockchainKey;
          this.props
            .addNewBenificiary({
              beniName,
              beniAddress,
              beniDesc,
              currency,
              blockchain_key,
              // beniOtp,
            })
            .then((res) => {
              console.log("addNewBenificiary-=-=-res>>", res);
              this.props.getAllBenificiary();
              this.setState({
                errorRemove: "",
              });
            })
            .catch((err) => {
              console.log("addNewBenificiary=-=-=->err>", err);
              this.props.getAllBenificiary();
              Singleton.getInstance().showError(err);
              this.setState({
                errorRemove: "",
              });
            });
        }}
      />
    );
  }

  renderError() {
    if (this.props.beniError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>{this.props.beniError}</Text>
        </View>
      );
    }
  }

  renderBenificiaryList() {
    let addArray = [];

    for (let i = 0; i < this.props.allBenificiaries?.length; i++) {
      if (
        this.props.allBenificiaries[i]?.currency == this.props.selectedCoin?.id
      ) {
        addArray.push(this.props.allBenificiaries[i]);
      }
    }
    return (
      <View style={{ height: "auto" }}>
        <BenificiaryList
          data={addArray}
          activateClicked={(item) => {
            // activateOtpMailBenificiary
            // this.props.activateOtpMailBenificiary()
            // beniId = this.state.beniId;
            beniId = item?.id;
            console.log("beniId==llpppp-", beniId);
            this.setState(
              { beniId: item?.id, loading: true, errorRemove: "" },
              () => {
                // this.showDialog(true);

                this.props
                  .activateOtpMailBenificiary({ beniId })
                  .then((res) => {
                    console.log("activateOtpMailBenificiary==-", res);

                    // Singleton.getInstance().showWarn(
                    //   strings.add_beneficiary.pin_code_sent
                    // );

                    this.setState(
                      {
                        pinCode: "",
                        loading: false,
                        showCountDown: false,
                        // count: 60,
                      },
                      () => {
                        // this.startTimer();
                        this.showDialog(true);
                      }
                    );
                  })
                  .catch((error) => {
                    this.setState({
                      loading: false,
                      // errorRemove: error,
                    });
                    console.log("activateOtpMailBenificiary==error===-", error);
                    if (error == "Please wait for one minute.") {
                      console.log("TIME_STAMP-=-val=uuu8888-=-");
                      Singleton.getInstance().showError(error);
                      // this.setState(
                      //   {
                      //     pinCode: "",
                      //     loading: false,
                      //     // showCountDown: true,
                      //     // count: c,
                      //   },
                      //   () => {
                      //     // this.startTimer();
                      //     this.showDialog(true);
                      //   }
                      // );
                      // Singleton.getInstance()
                      //   .getData(constants.TIME_STAMP)
                      //   .then((res) => {
                      //     console.log("TIME_STAMP-=-val=-=-", res);
                      //     console.log(
                      //       "res=-=-val=-=->>>>>",
                      //       JSON.parse(res) > 1
                      //     );
                      //     let a12 = new Date();
                      //     console.log("a12==-=-", JSON.stringify(a12));
                      //     let b12 = moment(a12).unix();
                      //     console.log("b12==-=-", JSON.stringify(b12));
                      //     let tt = Number(b12) - Number(res);
                      //     console.log("tt==-=-", tt);
                      //     let d = 60;
                      //     let c = d - tt;
                      //     console.log("tt==cc-=-", c);

                      //     if (JSON.parse(c) >= 1) {
                      //       clearInterval(intervalId);
                      //       this.setState(
                      //         {
                      //           pinCode: "",
                      //           loading: false,
                      //           showCountDown: true,
                      //           count: c,
                      //         },
                      //         () => {
                      //           this.startTimer();
                      //           this.showDialog(true);
                      //         }
                      //       );
                      //     } else {
                      //       this.setState(
                      //         {
                      //           pinCode: "",
                      //           loading: false,
                      //           showCountDown: false,
                      //           count: 60,
                      //         },
                      //         () => {
                      //           clearInterval(intervalId);
                      //           // this.startTimer();
                      //           // this.showDialog(true);
                      //         }
                      //       );
                      //     }
                      //   });

                      // Singleton.getInstance()
                      //   .getData(constants.TIME_INTERVAL)
                      //   .then((res) => {
                      //     console.log("res=-=-val=-=-", res);
                      //     console.log(
                      //       "res=-=-val=-=->>>>>",
                      //       JSON.parse(res) > 1
                      //     );

                      //     if (JSON.parse(res) >= 1) {
                      //       clearInterval(intervalId);
                      //       this.setState(
                      //         {
                      //           pinCode: "",
                      //           loading: false,
                      //           showCountDown: true,
                      //           count: JSON.parse(res),
                      //         },
                      //         () => {
                      //           this.startTimer();
                      //           this.showDialog(true);
                      //         }
                      //       );
                      //     } else {
                      //       this.setState(
                      //         {
                      //           pinCode: "",
                      //           loading: false,
                      //           showCountDown: false,
                      //           count: 60,
                      //         },
                      //         () => {
                      //           clearInterval(intervalId);
                      //           // this.startTimer();
                      //           // this.showDialog(true);
                      //         }
                      //       );
                      //     }
                      //   });
                    } else {
                      Alert.alert(constants.APP_NAME_CAPS, error);
                    }
                  });
              }
            );
          }}
          removeClicked={(item) => {
            this.setState({
              beniId: item?.id,
            });
            beniId = item?.id;
            Alert.alert(
              constants.APP_NAME_CAPS,
              strings.spot.are_really_wants_to_remove,
              [
                {
                  text: strings.spot.yes,
                  onPress: () => {
                    this.setState({
                      modalVisible: true,
                    });
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
          }}
        />
      </View>
    );
  }
  requestCameraPermission = async () => {
    console.log("requestCameraPermission-=-=-=-=");
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Evo Europe App Camera Permission for scanning qr code",
            message:
              "Evo Europe App needs access to your camera " +
              "so you can scan pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
          this.setState({
            // showScanner: true,
            showCamera: true,
          });
        } else {
          console.log("Camera permission denied");
          // alert("Camera permission denied");
          Singleton.getInstance().showError("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      Singleton.getInstance()
        .cameraPermission()
        .then((res) => {
          if (res == "granted") {
            this.setState({
              showCamera: true,
            });
          }
        });
    }
  };
  onQRCodeScanDone = (QR_Codes) => {
    // let QR_C = QR_Codes;
    // let QR_Code = QR_C.replace("ethereum:", "");
    // console.log("QR_Code---_____++++--onQR_Code_Scan_Done------", QR_Code);
    console.log("abc---_____++++--onQR_Code_Scan_Done------", QR_Codes);
    this.props.benificiaryFormUpdate({
      prop: "beniAddress",
      value: QR_Codes,
    });
    this.setState({
      showCamera: false,
    });

    // Singleton.getInstance().showNavigationWhiteView = true;
    // if (QR_Code.includes('/')) {
    //   console.log('QR_Code-----------', QR_Code);
    //   let scannedArr = QR_Code.split('/');
    //   console.log(
    //     'QR_Code------scannedArr-----',
    //     scannedArr + '------------' + scannedArr.length + 'scannedArr[6]------',
    //     scannedArr[4],
    //   );
    // } else {
    //   if (state?.params.myCoin_symbol != null) {
    //     this.setState({
    //       QR_Code_Value: QR_Code,
    //       amountText: '',
    //       selectedValue: state?.params.myCoin_symbol,
    //       showCamera: false,
    //     });
    //     this.props.benificiaryFormUpdate({
    //       prop: "beniAddress",
    //       value,
    //     });
    //   } else {
    //     this.setState({
    //       QR_Code_Value: QR_Code,
    //       amountText: '',
    //       selectedValue: '',
    //       // selectedValue: this.state?.selectedValue,
    //       showCamera: false,
    //     });
    //   }
    // }
  };
  decode = async (options) => {
    const {
      result: decodeResult,
      errorCode,
      errorMessage,
    } = await QrImageReader.decode(options);

    if (decodeResult !== undefined) {
      this.setState({
        result: decodeResult,
        showScanner: false,
        qrCodeValue: decodeResult,
      });

      console.error("An  res?.decodeResult=-=-", decodeResult);
      // setResult(decodeResult);
      // setShowScanner(false);
      // setQrCodeValue(decodeResult);
    } else {
      // alert("Not found any qr code");
      Singleton.getInstance().showError("Not found any qr code");
    }
  };
  onChooseImage = () => {
    // setResult("");
    this.setState({
      result: "",
    });
    var options = {
      mediaType: "photo",
      CancelButtonTitle: "Cancel",
      takePhotoButtonTitle: "Take Photo",
      chooseFromLibraryButtonTitle: "Choose From Gallery",
      title: "Choose Option",
      allowsEditing: true,
      quality: 0.2,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    launchImageLibrary({ mediaType: "photo" }, async (res) => {
      this.decode({
        path: res?.uri,
      });
      console.error("An  res?.uri=-=-", res?.uri);
    });
  };
  onSuccess = (e) => {
    console.error("An error occuredeeee=-=-", e);
    Linking.openURL(e.data).catch((err) =>
      console.error("An error occured=-=-", err)
    );
  };
  // renderQrCode() {
  //   return (
  //     <View style={{ justifyContent: "center" }}>
  //       <CameraScreen
  //         width={Dimensions.get("window").width}
  //         height={Dimensions.get("window").height}
  //         style={{
  //           backgroundColor: "#FFF",
  //           flex: 1,
  //         }}
  //         zoomMode={"on"}
  //         scanBarcode={true}
  //         onReadCode={(event) => console.log("event=-=-=-=-", event)}
  //         showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
  //         laserColor={"blue"} // (default red) optional, color of laser in scanner frame
  //         frameColor={"gray"} // (default white) optional, color of border of scanner frame
  //       />
  //     </View>
  //   );
  // }
  onSuccess = (e) => {
    // Linking.openURL(e.data).catch(err =>
    console.error("An log occured=-=-=-", e);
    // );
  };
  // render() {
  //   return (
  //     <QRCodeScanner
  //       onRead={e => {
  //         console.error('An log occured=-=-=-', e);
  //       }}
  //       reactivate={true}
  //       reactivateTimeout={2000}
  //       checkAndroid6Permissions={true}
  //     />
  //   );
  // }
  // render() {
  //   return (
  //     <CameraScreen
  //       // width={Dimensions.get("window").width}
  //       // height={Dimensions.get("window").height}
  //       style={{
  //         backgroundColor: "#FFF",
  //         // width: Dimensions.get("window").width,
  //         // height: 500,
  //       }}
  //       // hideControls
  //       // zoomMode={"on"}
  //       // scanBarcode={true}
  //       ratioOverlay={["9:6"]}
  //       // onReadCode={(event) => {
  //       //   console.log("event=-=-=", event.nativeEvent.codeStringValue);
  //       //   this.onQRCodeScanDone(event.nativeEvent.codeStringValue);
  //       // }}
  //       // showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
  //       // laserColor={"blue"} // (default red) optional, color of laser in scanner frame
  //       // frameColor={"blue"} // (default white) optional, color of border of scanner frame
  //     />
  //   );
  // }
  // renderdd() {
  //   return (
  //     <RNCamera
  //       ref={ref => {
  //         this.camera = ref;
  //       }}
  //       captureAudio={false}
  //       style={{flex: 1}}
  //       type={RNCamera.Constants.Type.back}
  //       androidCameraPermissionOptions={{
  //         title: 'Permission to use camera',
  //         message: 'We need your permission to use your camera',
  //         buttonPositive: 'Ok',
  //         buttonNegative: 'Cancel',
  //       }}
  //     />
  //   );
  // }
  onResendBtnPress = () => {
    beniId = this.state.beniId;
    this.props
      .resendPinCodeBenificiary({ beniId })
      .then((res) => {
        console.log("res=-=resendPinCodeBenificiary-=", JSON.stringify(res));
        let a1 = new Date();
        console.log("a1==-=-", JSON.stringify(a1));
        let b1 = moment(a1).unix();
        console.log("b1==-=-", JSON.stringify(b1));
        Singleton.getInstance()
          .saveData(constants.TIME_STAMP, JSON.stringify(b1))
          .then((res) => {
            console.log("=-=-b1=-=-", res);
          });
        // this.setState({
        //   pinCode: "",
        //   showCountDown: true,
        //   count: 60,
        // });
        // if (res === 200) {
        Singleton.getInstance().showMsg(strings.add_beneficiary.pin_code_sent);
        // this.setState(
        //   {
        //     pinCode: "",
        //     showCountDown: true,
        //     count: 60,
        //   },
        //   () => {
        //     clearInterval(intervalId);
        //     this.startTimer();
        //     this.showDialog(true);
        //   }
        // );
        // this.showDialog(true);
        // this.startTimer();
        // }
      })
      .catch((error) => {
        console.log(
          "error=-=resendPinCodeBenificiary-=",
          JSON.stringify(error)
        );
        this.setState(
          {
            pinCode: "",
            // showCountDown: true,
            // count: 60,
          },
          () => {
            clearInterval(intervalId);
            // this.startTimer();
            // this.showDialog(true);
          }
        );
        Singleton.getInstance().showError(error);
        // Singleton.getInstance().showWarn(strings.add_beneficiary.pin_code_sent);
        // Alert.alert(constants.APP_NAME_CAPS, error);
      });
  };
  render() {
    return (
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
        screenStyle={[
          styles.screenStyle,
          { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
        ]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={{
          backgroundColor: ThemeManager.colors.dashboardSubViewBg,
        }}
      >
        {/* <HeaderVerification
          btnTextLeft="Withdrawal Address"
          btnTextRight=" "
          leftButtonClicked={() => {
            this.props.navigation.goBack();
          }}
        /> */}
        {this.state.showCamera ? (
          <View style={{ backgroundColor: "black", flex: 1 }}>
            <TouchableOpacity
              style={{
                // position: "absolute",
                // top: 20,
                // left: 10,
                zIndex: 100,
                height: 40,
                width: 40,
                marginTop: 20,
                // justifyContent: "flex-start",
                // alignItems: "flex-start",
                // backgroundColor: "black",
              }}
              onPress={() => {
                // alert('he');
                this.setState({
                  showScanner: false,
                  qrCodeValue: "",
                  showCamera: false,
                });
                // setShowScanner(false);
                // setQrCodeValue("");
              }}
            >
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_back }}
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 20,
                  resizeMode: "contain",
                  tintColor: "white",
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <QRCodeScanner
                onRead={(e) => {
                  console.error("An log occured=-=-=-", e);
                  this.onQRCodeScanDone(e.data);
                }}
                // flashMode={RNCamera.Constants.FlashMode.torch}
                reactivate={true}
                reactivateTimeout={2000}
                checkAndroid6Permissions={true}
              />
              {/* <CameraKitCameraScreen
                style={{
                  width: Dimensions.get('window').width,
                  flex: 1,
                  backgroundColor: '#000',
                }}
                showFrame={true}
                scanBarcode={true}
                laserColor={'#FF3D00'}
                frameColor={'#00C853'}
                colorForScannerFrame={'black'}
                onReadCode={event => {
                  console.log('event=-=-=', event);
                  this.onQRCodeScanDone(event.nativeEvent.codeStringValue);
                }}
              /> */}
              {/* <CameraScreen
                // width={Dimensions.get("window").width}
                // height={Dimensions.get("window").height}
                style={{
                  backgroundColor: "#FFF",
                  // width: Dimensions.get("window").width,
                  // height: 500,
                }}
                // hideControls
                zoomMode={"on"}
                scanBarcode={true}
                ratioOverlay={["3:4"]}
                onReadCode={(event) => {
                  console.log("event=-=-=", event.nativeEvent.codeStringValue);
                  this.onQRCodeScanDone(event.nativeEvent.codeStringValue);
                }}
                // showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                // laserColor={"blue"} // (default red) optional, color of laser in scanner frame
                // frameColor={"blue"} // (default white) optional, color of border of scanner frame
              /> */}
              {/* <CameraKitCameraScreen
                style={{
                  width: Dimensions.get("window").width,
                  flex: 1,
                  backgroundColor: "#000",
                }}
                showFrame={true}
                scanBarcode={true}
                laserColor={"#FF3D00"}
                frameColor={"#00C853"}
                colorForScannerFrame={"black"}
                onReadCode={(event) => {
                  console.log("event=-=-=", event);
                  this.onQRCodeScanDone(event.nativeEvent.codeStringValue);
                }}
              /> */}
              {/* <View
              style={{
                // flexDirection: "row",
                position: "absolute",
                bottom: 30,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                // justifyContent: "space-between",
                // marginHorizontal: 50,
                // marginBottom: 30,
              }}
            >

              <TouchableOpacity
                onPress={() => {
                  this.onChooseImage();
                }}
                style={styles.scannerButton}
              >
                <Image
                  source={{ uri: Images.icon_gallery }}
                  style={{ height: 30, width: 30, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </View> */}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {this.state.isDialogVisible ? (
              <View style={{ flex: 1 }}>
                <View style={{ alignItems: "flex-end" }}>
                  <TouchableOpacity
                    style={{ marginRight: 15, marginTop: 15 }}
                    onPress={() => {
                      // this.props.resetBenificiaryForm();
                      this.props.getAllBenificiary();
                      this.setState({
                        isDialogVisible: false,
                      });
                      this.setState({
                        pinCode: "",
                      });
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                      style={{ height: 25, width: 25, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                </View>
                <KeyboardAwareScrollView
                  bounces={false}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <Text
                    style={{
                      fontSize: 26,
                      fontFamily: Fonts.medium,
                      color: ThemeManager.colors.textColor,
                      marginTop: 10,
                      marginLeft: 15,
                    }}
                  >
                    {strings.spot.pin_code}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                      marginRight: 10,
                      marginTop: 10,
                      marginLeft: 15,
                    }}
                  >
                    {strings.spot.enter_pin_code_which}
                  </Text>
                  <View style={{ marginTop: 30 }}>
                    {/* <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                    marginTop: 10,
                    marginLeft: 15,
                    marginBottom: 10,
                  }}>
                  {strings.spot.enter_pin_code}
                </Text>
                <InputField
                  // customContainerStyle={{marginHorizontal: 0, width: '110%'}}
                  customContainerStyle={{
                    // backgroundColor: ThemeManager.colors.SwapInput,
                    // marginHorizontal: 10,
                    width: '100%',
                  }}
                  editable={true}
                  title={'EG. 303454'}
                  defaulEmailInput={{
                    backgroundColor: ThemeManager.colors.tabBackground,
                  }}
                  value={this.state.pinCode}
                  onChangeText={value => {
                    // setOtp(value);
                    this.setState({
                      pinCode: value,
                    });
                  }}
                  maxlength={6}
                  keyboardType="numeric"
                  returnKeyType={'done'}
                /> */}
                    <View style={{ marginHorizontal: 15 }}>
                      <InputVerification
                        inputLabel={strings.spot.enter_pin_code}
                        verifyLable={{ color: ThemeManager.colors.textColor5 }}
                        editable={true}
                        verifyInputStyle={{
                          color: ThemeManager.colors.textColor1,
                          backgroundColor: ThemeManager.colors.tabBackground,
                        }}
                        placeHolder={`EG. "303456"`}
                        value={this.state.pinCode}
                        onChangeText={(value) => {
                          // setOtp(value);
                          if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                            this.setState({
                              pinCode: value,
                            });
                          }
                        }}
                        maxLength={6}
                        keyboardStyle={"numeric"}
                        returnKeyType={"done"}
                      />
                    </View>

                    <View style={{ marginTop: 30 }}>
                      <ButtonPrimary
                        style={styles.btnBottom}
                        title={strings.spot.submit}
                        onPress={() => {
                          if (this.state.pinCode?.length < 6) {
                            // Alert.alert(
                            //   constants.APP_NAME,
                            //   strings.add_beneficiary.please_enter_valid_pin,
                            // );
                            Singleton.getInstance().showError(
                              strings.add_beneficiary.please_enter_valid_pin
                            );
                          } else {
                            let code = this.state.pinCode;
                            beniId = this.state.beniId;

                            this.props
                              .activateBenificiary({ beniId, code })
                              .then((res) => {
                                console.log(
                                  "activateBenificiary=-=-=-",
                                  JSON.stringify(res)
                                );
                                if (res?.state === "active") {
                                  Singleton.getInstance().showMsg(
                                    strings.add_beneficiary
                                      .beneficiary_address_activated
                                  );

                                  this.showDialog(true);
                                  this.setState({
                                    pinCode: "",
                                  });
                                }
                                this.showDialog(false);
                                this.props.getAllBenificiary();
                              })
                              .catch((error) => {
                                console.log(
                                  "activateBenificiary=-=-=error-",
                                  JSON.stringify(error)
                                );
                                // Alert.alert(constants.APP_NAME, error);
                                Singleton.getInstance().showError(error);
                              });
                          }
                        }}
                      />
                      <View
                        style={{
                          alignSelf: "flex-end",
                          // marginTop: 10,
                          marginRight: 15,
                        }}
                      >
                        {this.state.showCountDown ? (
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontSize: 14,
                              fontFamily: Fonts.regular,
                            }}
                          >
                            {this.state.count} {strings.withdraw_screen.seconds}
                          </Text>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              this.onResendBtnPress();
                              // let a = new Date();
                              // console.log("a==-=-", JSON.stringify(a));
                              // let b = moment(a).unix();
                              // console.log("b==-=-", JSON.stringify(b));
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.regular,
                                fontSize: 14,
                                color: ThemeManager.colors.textColor,
                              }}
                            >
                              {strings.withdraw_screen.resent_otp}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      {/* <View
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                          marginRight: 15,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.onResendBtnPress();
                          }}
                        >
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                            }}
                          >
                            {strings.add_beneficiary.resend_pin}
                          </Text>
                        </TouchableOpacity>
                      </View>
                     */}
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Loader isLoading={this.state.loading} />
                <WalletHeader
                  onBackPress={() => {
                    this.props.navigation.goBack();
                  }}
                  noRightIcons={true}
                  onHistoryPress={() => { }}
                />
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: Fonts.medium,
                    color: ThemeManager.colors.textColor,
                    marginTop: 10,
                    marginLeft: 15,
                  }}
                >
                  {strings.spot.withdrawal} {strings.spot.address}
                </Text>
                <KeyboardAwareScrollView
                  bounces={false}
                  style={{ flex: 1, width: "100%" }}
                >
                  <View style={{ padding: 15 }}>
                    <InputVerification
                      verifyLable={{ color: ThemeManager.colors.textColor5 }}
                      inputLabel={strings.beneficiary_screen.name}
                      verifyInputStyle={{
                        color: ThemeManager.colors.textColor1,
                        backgroundColor: ThemeManager.colors.tabBackground,
                        paddingVertical: 7,
                        paddingBottom: 10,
                        // textAlign: "center",
                      }}
                      maxLength={14}
                      placeHolder={strings.beneficiary_screen.enter_name}
                      value={this.props.beniName}
                      onChangeText={(value) => {
                        if (constants.NAME_REGEX.test(value)) {
                          this.props.benificiaryFormUpdate({
                            prop: "beniName",
                            value,
                          });
                        }
                      }}
                    />

                    {/* <InputVerification
                  verifyLable={{ color: ThemeManager.colors.textColor5 }}
                  inputLabel={strings.beneficiary_screen.address}
                  verifyInputStyle={{
                    color: ThemeManager.colors.textColor1,
                    backgroundColor: ThemeManager.colors.tabBackground,
                    paddingVertical: 7,
                    paddingBottom: 10,
                    // textAlign: "center",
                  }}
                  multiline={false}
                  placeHolder={strings.beneficiary_screen.enter_address}
                  value={this.props.beniAddress}
                  // value={'0x25628fA13E8f0F5F6d75fc5672c4DF4d44542ea1'}
                  onChangeText={(value) => {
                    this.props.benificiaryFormUpdate({
                      prop: "beniAddress",
                      value,
                    });
                  }}
                /> */}
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                        fontSize: 14,
                        marginVertical: 10,
                      }}
                    >
                      {strings.beneficiary_screen.address}
                    </Text>
                    <View
                      style={{
                        height: 48,
                        backgroundColor: ThemeManager.colors.tabBackground,
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 15,
                        marginBottom: 15,
                        borderRadius: 6,
                      }}
                    >
                      <TextInput
                        placeholderTextColor={
                          ThemeManager.colors.inactiveTextColor
                        }
                        value={this.props.beniAddress}
                        placeholder={strings.beneficiary_screen.enter_address}
                        onChangeText={(value) => {
                          this.props.benificiaryFormUpdate({
                            prop: "beniAddress",
                            value,
                          });
                        }}
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.textColor,
                          flex: 1,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          // alert("hello");
                          this.requestCameraPermission();
                        }}
                      >
                        <Image
                          source={{ uri: ThemeManager.ImageIcons.qr_scanner }}
                          style={{
                            height: 24,
                            width: 24,
                            resizeMode: "contain",
                            marginLeft: 10,
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    <InputVerification
                      verifyLable={{ color: ThemeManager.colors.textColor5 }}
                      inputLabel={strings.beneficiary_screen.status}
                      verifyInputStyle={{
                        color: ThemeManager.colors.textColor1,
                        backgroundColor: ThemeManager.colors.tabBackground,
                        paddingVertical: 7,
                        paddingBottom: 10,
                      }}
                      placeHolder={strings.beneficiary_screen.description}
                      value={this.props.beniDesc}
                      onChangeText={(value) => {
                        this.props.benificiaryFormUpdate({
                          prop: "beniDesc",
                          value,
                        });
                      }}
                    />
                  </View>
                  {this.renderError()}
                  {this.renderAddButton()}
                  {this.renderBenificiaryList()}
                </KeyboardAwareScrollView>
              </View>
            )}
          </View>
        )}

        {/* <DialogInput
          isDialogVisible={this.state.isDialogVisible}
          title={'Enter Pin-Code'}
          message={
            'Enter Pin-code which is sent over to your registered Email address.'
          }
          hintInput={'Pin code'}
          submitInput={inputText => {
            console.log(inputText);
            if (inputText.length < 5 || inputText.length > 6) {
              Alert.alert(constants.APP_NAME, 'Please enter valid Pin');
            } else {
              let code = inputText;
              let beniId = this.state.beniId;
              this.props
                .activateBenificiary({beniId, code})
                .then(res => {
                  this.showDialog(false);
                  this.props.getAllBenificiary();
                })
                .catch(error => {
                  Alert.alert(constants.APP_NAME, error);
                });
            }
          }}
          closeDialog={() => {
            this.showDialog(false);
          }}></DialogInput> */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        >
          <Wrap
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            style={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
            ]}
            bottomStyle={{
              backgroundColor: ThemeManager.colors.dashboardSubViewBg,
            }}
          >
            <Loader isLoading={this.state.loading} />
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={{ marginRight: 15, marginTop: 15 }}
                  onPress={() => {
                    this.setState({
                      modalVisible: false,
                      loading: false,
                      code_2fa: "",
                    });
                  }}
                >
                  <Image
                    source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                    style={{ height: 25, width: 25, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
              <KeyboardAwareScrollView
                bounces={false}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: Fonts.medium,
                    color: ThemeManager.colors.textColor,
                    marginTop: 10,
                    marginLeft: 15,
                  }}
                >
                  {strings.spot.pin_code}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                    marginRight: 10,
                    marginTop: 10,
                    marginLeft: 15,
                  }}>
                  {strings.spot.enter_pin_code_which}
                </Text> */}
                <View style={{ marginTop: 30 }}>
                  {/* <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                    marginTop: 10,
                    marginLeft: 15,
                    marginBottom: 10,
                  }}>
                  {strings.spot.enter_pin_code}
                </Text>
                <InputField
                  // customContainerStyle={{marginHorizontal: 0, width: '110%'}}
                  customContainerStyle={{
                    // backgroundColor: ThemeManager.colors.SwapInput,
                    // marginHorizontal: 10,
                    width: '100%',
                  }}
                  editable={true}
                  title={'EG. 303454'}
                  defaulEmailInput={{
                    backgroundColor: ThemeManager.colors.tabBackground,
                  }}
                  value={this.state.pinCode}
                  onChangeText={value => {
                    // setOtp(value);
                    this.setState({
                      pinCode: value,
                    });
                  }}
                  maxlength={6}
                  keyboardType="numeric"
                  returnKeyType={'done'}
                /> */}
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
                      value={this.state.code_2fa}
                      onChangeText={(value) => {
                        // setOtp(value);
                        if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                          this.setState({
                            code_2fa: value,
                          });
                        }
                      }}
                      maxLength={6}
                      keyboardStyle={"numeric"}
                      returnKeyType={"done"}
                    />
                  </View>
                  {this.state.errorRemove ? (
                    <View>
                      <Text style={styles.errorMessageStyle}>
                        {this.state.errorRemove}
                      </Text>
                    </View>
                  ) : null}
                  <View style={{ marginTop: 30 }}>
                    <ButtonPrimary
                      style={styles.btnBottom}
                      title={strings.spot.submit}
                      onPress={() => {
                        if (this.state.code_2fa?.length < 6) {
                          Alert.alert(
                            constants.APP_NAME_CAPS,
                            strings.add_beneficiary.please_enter_valid_pin
                          );
                          // Singleton.getInstance().showError(strings.add_beneficiary.please_enter_valid_pin);
                          // Singleton.getInstance().showError(
                          //   strings.add_beneficiary.please_enter_valid_pin
                          // );
                        } else {
                          let otp = this.state.code_2fa;

                          beniId = this.state.beniId;

                          this.setState({
                            loading: true,
                          });
                          this.props
                            .deleteBenificiary({ beniId, otp })
                            .then((res) => {
                              this.props.resetBenificiaryForm();
                              this.props.getAllBenificiary();
                              this.setState({
                                loading: false,
                                modalVisible: false,
                              });
                              Singleton.getInstance().showMsg(
                                strings.add_beneficiary.address_deleted
                              );
                            })
                            .catch((error) => {
                              this.setState({
                                loading: false,
                                errorRemove: error,
                              });
                            });
                        }
                      }}
                    />
                    {/* <Button
                      defaultBtn={styles.btnBottom}
                      children={strings.spot.submit}
                      onPress={() => {
                        if (this.state.code_2fa.length < 6) {
                          // Alert.alert(
                          //   constants.APP_NAME,
                          //   strings.add_beneficiary.please_enter_valid_pin,
                          // );
                          Singleton.getInstance().showError(
                            strings.add_beneficiary.please_enter_valid_pin
                          );
                        } else {
                          let otp = this.state.code_2fa;

                          beniId = this.state.beniId;

                          this.setState({
                            loading: true,
                          });
                          this.props
                            .deleteBenificiary({ beniId, otp })
                            .then((res) => {
                              this.props.resetBenificiaryForm();
                              this.props.getAllBenificiary();
                              this.setState({
                                loading: false,
                                modalVisible: false,
                              });
                              Singleton.getInstance().showWarn(
                                strings.add_beneficiary.address_deleted
                              );
                            })
                            .catch((error) => {
                              this.setState({
                                loading: false,
                                errorRemove: error,
                              });
                            });
                        }
                      }}
                    /> */}
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Wrap>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showScanner}
          onRequestClose={() => {
            this.setState({
              showScanner: false,
            });
          }}
        >
          <Wrap
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            style={{ backgroundColor: "transparent" }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: "transparent", flex: 1 },
            ]}
            bottomStyle={{ backgroundColor: "transparent" }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 20,
                  left: 10,
                  zIndex: 100,
                  height: 80,
                  width: 80,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  backgroundColor: "transparent",
                }}
                onPress={() => {
                  // alert('he');
                  this.setState({
                    showScanner: false,
                    qrCodeValue: "",
                  });
                  // setShowScanner(false);
                  // setQrCodeValue("");
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_back }}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 20,
                    resizeMode: "contain",
                    tintColor: "white",
                  }}
                />
              </TouchableOpacity>
              {/* <CameraScreen
                width={Dimensions.get("window").width}
                height={Dimensions.get("window").height}
                style={{
                  backgroundColor: "#FFF",
                }}
                // zoomMode={"on"}
                scanBarcode={true}
                onReadCode={(event) => {}}
                showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                laserColor={"blue"} // (default red) optional, color of laser in scanner frame
                frameColor={"blue"} // (default white) optional, color of border of scanner frame
              /> */}
              {/* <CameraKitCameraScreen
                style={{
                  width: Dimensions.get("window").width,
                  flex: 1,
                  backgroundColor: "#000",
                }}
                showFrame={true}
                scanBarcode={true}
                laserColor={"#FF3D00"}
                frameColor={"#00C853"}
                colorForScannerFrame={"black"}
                onReadCode={(event) => {
                  console.log("event=-=-=", event);
                  this.onQRCodeScanDone(event.nativeEvent.codeStringValue);
                }}
              /> */}
              <View
                style={{
                  // flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 50,
                  marginBottom: 30,
                }}
              >
                {/* <TouchableOpacity
                  onPress={() => {
                    //
                    // Actions.currentScene != "ReceiveQR" &&
                    //   Actions.push("ReceiveQR");
                  }}
                  style={styles.scannerButton}
                >
                  <Image
                    source={{ uri: Images.icon_scanner }}
                    style={{ height: 30, width: 30, resizeMode: "contain" }}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    // onChooseImage();
                  }}
                  style={styles.scannerButton}
                >
                  <Image
                    source={{ uri: Images.icon_gallery }}
                    style={{ height: 30, width: 30, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Wrap>
        </Modal>
      </Wrap>
    );
  }
}

// const styles = StyleSheet.create({

// });

const mapStateToProps = (state) => {
  const {
    beniName,
    beniAddress,
    beniDesc,
    beniOtp,
    isLoadingBeni,
    beniError,
    allBenificiaries,
  } = state.benificiaryReducer;

  return {
    beniName,
    beniAddress,
    beniDesc,
    beniOtp,
    isLoadingBeni,
    beniError,
    allBenificiaries,
  };
};
export default connect(mapStateToProps, {
  resetBenificiaryForm,
  benificiaryFormUpdate,
  addNewBenificiary,
  getAllBenificiary,
  deleteBenificiary,
  activateBenificiary,
  resendPinCodeBenificiary,
  activateOtpMailBenificiary,
})(AddWithdrawAddress);
{
  /* <Button
defaultBtn={styles.btnBottom}
children={strings.beneficiary_screen.add}
onPress={() => {
  const { beniName, beniAddress, beniDesc, beniOtp } = this.props;
  var currency = this.props.selectedCoin.id;
  var blockchain_key = this.props.selectedBlockchainKey;
  this.props
    .addNewBenificiary({
      beniName,
      beniAddress,
      beniDesc,
      currency,
      blockchain_key,
      // beniOtp,
    })
    .then((res) => {
      this.props.getAllBenificiary();
      this.setState({
        errorRemove: "",
      });
    })
    .catch((err) => {
      this.props.getAllBenificiary();
      this.setState({
        errorRemove: "",
      });
    });
}}
/> */
}
