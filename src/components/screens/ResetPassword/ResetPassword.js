import React, { useState, useEffect } from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import useStyles from "./ResetPasswordStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeManager } from "../../../../ThemeManager";
import {
  Header,
  InputField,
  PhoneNumberInput,
  ButtonPrimary,
  Loader,
  Wrap,
} from "../../common";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
// import {  } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordFormUpdate,
  forgotPasswordUser,
  // forgotPasswordFail,
} from "../../../Redux/Actions";
import SimpleHeader from "../../common/SimpleHeader";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import * as constants from "../../../Constants";
const ResetPassword = (props) => {
  const styles = useStyles(ThemeManager);
  const [showMobile, setShowMobile] = useState(false);
  const [textLeft, settextLeft] = useState("Email");
  const [textRight, settextRight] = useState("Switch to mobile");
  const [modalPopUpVisible, setmodalPopUpVisible] = useState(false);
  // const forgotPasswordReducer = useSelector(
  //   (state) => state.ForgotPasswordReducer
  // );
  const { forgotPasswordEmail, forgotPasswordError, forgotPasswordLoading } =
    useSelector((state) => state.ForgotPasswordReducer);
  // console.log("forgotPasswordError=-=-=>>", forgotPasswordError);
  const dispatch = useDispatch();

  const changeView = (view) => {
    if (view) {
      settextLeft("Mobile");
      settextRight("Switch to email");
    } else {
      settextLeft("Email");
      settextRight("Switch to mobile");
    }
    setShowMobile(view);
  };

  const onButtonPress = () => {
    // setmodalPopUpVisible(true);
    let reg = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(forgotPasswordEmail) === false) {
      // forgotPasswordFail(dispatch, VALID_EMAIL);
      // dispatch(forgotPasswordFail(dispatch, constants.VALID_EMAIL));
      dispatch(
        forgotPasswordFormUpdate({
          prop: "forgotPasswordError",
          value: constants.VALID_EMAIL,
        })
      );
    } else {
      setmodalPopUpVisible(true);
    }
  };

  const renderError = () => {
    if (forgotPasswordError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>{forgotPasswordError}</Text>
        </View>
      );
    }
  };
  useEffect(() => {
    return () => {
      let value = "";
      dispatch(
        forgotPasswordFormUpdate({ prop: "forgotPasswordError", value })
      );
    };
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      {/* <Header
        mainView={{ marginHorizontal: 16 }}
        leftImage={{ uri: ThemeManager.ImageIcons.icon_back }}
        btnTextLeft=" "
        leftButtonClicked={() => {
          Actions.pop();
        }}
      /> */}
      <View
        style={{ marginHorizontal: 16, marginBottom: 15, marginVertical: 10 }}
      >
        <SimpleHeader
          // backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>
      <Text
        style={{
          marginTop: 20,
          marginHorizontal: 16,
          color: ThemeManager.colors.headTxt,
          fontFamily: fonts.medium,
          fontSize: 22,
          marginBottom: 10,
        }}
      >
        Reset Password
      </Text>
      {/* <Text
        style={{
          marginTop: 0,
          marginHorizontal: 16,
          color: colors.appRed,
          fontFamily: fonts.regular,
          fontSize: 14,
        }}
      >
        For security purposes, no withdrawals are permitted for 24 hours after
        modification of security methods.
      </Text> */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.inputTitle}>{textLeft}</Text>
        {/* <TouchableOpacity
          onPress={() => {
            changeView(!showMobile);
          }}>
          <Text style={[styles.inputTitle, {color: colors.buttonBgColor}]}>
            {textRight}
          </Text>
        </TouchableOpacity> */}
      </View>
      {showMobile ? (
        <PhoneNumberInput
          verifyLable={styles.notShow}
          placeHolder="Mobile Number"
          verifyInputStyle={styles.inputStyle}
          countryCodeText={props.mobilePhoneCode}
          placeHolderTextColor={ThemeManager.colors.inactiveTextColor}
          maxLength={15}
          countryCodeClicked={() => setModalCountryVisible(true)}
          onChangeText={(value) => {
            let extraSpaceRegex = /^\s*\s*$/;
          }}
        />
      ) : (
        <InputField
          editable={true}
          title="Please enter email"
          onChangeText={(value) => {
            dispatch(
              forgotPasswordFormUpdate({
                prop: "forgotPasswordEmail",
                value,
              })
            );
          }}
          maxlength={100}
          keyboardType="email-address"
          customContainerStyle={{
            backgroundColor: ThemeManager.colors.SwapInput,
          }}
        />
      )}
      {renderError()}
      <Loader isLoading={forgotPasswordLoading} />
      <ButtonPrimary
        style={{ marginTop: 30 }}
        title={strings.Next}
        onPress={() => {
          onButtonPress();
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalPopUpVisible}
        onRequestClose={() => setmodalPopUpVisible(false)}
      >
        <Wrap
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
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
                setmodalPopUpVisible(false);
              }}
            ></TouchableOpacity>
            <View style={styles.msgContainer}>
              {/* <Image
                source={{ uri: Images.icon_caution }}
                style={styles.cautionIcon}
              /> */}
              <View style={{ alignItems: "center", marginTop: 15 }}>
                <LottieView
                  style={{ height: 60, width: 60 }}
                  source={Images.forgetJson}
                  autoPlay
                  loop={true}
                />
              </View>
              <Text style={styles.impText}>{strings.Important}</Text>
              <Text style={styles.alertText}>
                {strings.changePasswordAlert}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 20,
                  justifyContent: "space-between",
                  marginHorizontal: 10,
                }}
              >
                {/* <ButtonPrimary
                  showGradient={true}
                  title={"Cancel"}
                  touchableStyle={{ flex: 1 }}
                  style={{
                    // height: 50,
                    // marginTop: 8,
                    width: "80%",
                    borderWidth: 1,
                    borderColor: ThemeManager.colors.btnColor3,
                    borderRadius: 4,
                  }}
                  textSimpleStyle={{ color: ThemeManager.colors.btnColor3 }}
                  onPress={() => {
                    alert("hey");
                    setChangePhoneNumberModal(false);
                  }}
                /> */}
                {/* <ButtonPrimary
                  // touchableStyle={{ flex: 1 }}
                  style={{ marginTop: 10 }}
                  title={strings.titleName.logIn}
                  onPress={() => {
                    alert("hellodd");
                  }}
                />
                <ButtonPrimary
                  // touchableStyle={{ flex: 1 }}
                  style={{ marginTop: 10 }}
                  title={strings.titleName.logIn}
                  onPress={() => {
                    alert("helloddd");
                  }}
                /> */}
                <TouchableOpacity
                  style={{
                    color: ThemeManager.colors.btnColor3,
                    borderWidth: 1,
                    borderColor: ThemeManager.colors.btnColor3,
                    borderRadius: 4,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 30,
                  }}
                  onPress={() => {
                    // alert("hello");
                    setmodalPopUpVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {strings.spot.cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    dispatch(
                      forgotPasswordUser({
                        forgotPasswordEmail: forgotPasswordEmail,
                      })
                    )
                      .then((res) => {
                        console.log("forgotPasswordUser=-=res-=", res);
                        setmodalPopUpVisible(false);
                      })
                      .catch((err) => {
                        console.log("forgotPasswordUser=-err=-=", err);
                        setmodalPopUpVisible(false);
                      });
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={["#64B77C", "#347899", "#1F5BA7"]}
                    // style={{
                    //   justifyContent: 'center',
                    //   alignItems: 'center',
                    // }}
                    style={{
                      height: 40,
                      // width: 140,
                      backgroundColor: ThemeManager.colors.walletDPbtn,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                      }}
                    >
                      {strings.Continue}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.rowStyle}>
                <TouchableOpacity
                  onPress={() => {
                    setmodalPopUpVisible(false);
                  }}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelText}>{strings.spot.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      changePasswordRequest({
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                        conPassword: conPassword,
                      })
                    );
                    setmodalPopUpVisible(false);
                  }}
                  style={styles.continueBtn}
                >
                  <Text style={styles.continueText}>{strings.Continue}</Text>
                </TouchableOpacity>
              </View> */}
            </View>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setmodalPopUpVisible(false);
              }}
            ></TouchableOpacity>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default ResetPassword;
