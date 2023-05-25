/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import useStyles from "./ChangePasswordStyle";
import {
  SubHeaderLinks,
  InputField,
  ButtonPrimary,
  Wrap,
  Loader,
} from "../../common";
import {
  changePasswordRequest,
  changePasswordFormUpdate,
  changePasswordFail,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";

import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import * as constants from "../../../Constants";
import SimpleHeader from "../../common/SimpleHeader";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
const ChangePassword = (props) => {
  const styles = useStyles(ThemeManager);
  const [modalPopUpVisible, setmodalPopUpVisible] = useState(false);
  const dispatch = useDispatch();
  const { passError, oldPassword, newPassword, conPassword, passwordLoading } =
    useSelector((state) => state?.changePass);
  const [ViewOldPassword, setViewOldPassword] = useState(false);
  const [ViewNewPassword, setViewNewPassword] = useState(false);
  const [ViewConfirmPassword, setViewConfirmPassword] = useState(false);

  useEffect(() => {
    let value = "";
    dispatch(changePasswordFormUpdate({ prop: "passError", value }));
    return () => {
      dispatch(changePasswordFormUpdate({ prop: "passError", value }));
      dispatch(changePasswordFormUpdate({ prop: "oldPassword", value }));
      dispatch(changePasswordFormUpdate({ prop: "newPassword", value }));
      dispatch(changePasswordFormUpdate({ prop: "conPassword", value }));
    };
  }, []);
  const renderError = () => {
    if (passError) {
      return (
        <View style={{ bottom: 12, marginHorizontal: 16, marginVertical: 20 }}>
          {passError == "password.weak" ? (
            <Text style={styles.errorMessageStyle}>{"Password is weak"}</Text>
          ) : (
            <Text style={styles.errorMessageStyle}>{passError}</Text>
          )}
        </View>
      );
    }
  };
  const onButtonPress = () => {
    let passReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    if (oldPassword?.length < 8) {
      dispatch(
        changePasswordFormUpdate({
          prop: "passError",
          value: constants.VALID_OLD_PASSWORD,
        })
      );
    } else if (passReg.test(newPassword) == false) {
      dispatch(
        changePasswordFormUpdate({
          prop: "passError",
          value: constants.VALID_NEW_PASSWORD,
        })
      );
    } else if (passReg.test(conPassword) == false) {
      dispatch(
        changePasswordFormUpdate({
          prop: "passError",
          value: constants.VALID_NEW_CON_PASSWORD,
        })
      );
    } else if (newPassword != conPassword) {
      dispatch(
        changePasswordFormUpdate({
          prop: "passError",
          value: constants.VALID_MISMATCH_PASSWORD,
        })
      );
    } else {
      setmodalPopUpVisible(true);
      dispatch(changePasswordFormUpdate({ prop: "passError", value: "" }));
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      <View style={{ marginHorizontal: 20, height: 40, marginBottom: 15 }}>
        <SimpleHeader
          titleName={strings.change_password_screen.password}
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          // titleName={'kjjkh'}
          titleStyle={{
            fontSize: 18,
            fontFamily: Fonts.medium,
            color: ThemeManager.colors.textColor1,
            // marginLeft: 10,
          }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <View>
          <Text style={styles.inputTitle}>
            {strings.change_password_screen.old_password}
          </Text>
          <InputField
            editable={true}
            title={strings.change_password_screen.old_password}
            secureTextEntry={!ViewOldPassword}
            image={
              !ViewOldPassword
                ? { uri: ThemeManager.ImageIcons.icon_hide_eye }
                : { uri: ThemeManager.ImageIcons.icon_open_eye }
            }
            onChangeText={(value) => {
              dispatch(
                changePasswordFormUpdate({
                  prop: "oldPassword",
                  value,
                })
              );
            }}
            customContainerStyle={{
              backgroundColor: ThemeManager.colors.SwapInput,
            }}
            maxlength={100}
            onPress={() => {
              setViewOldPassword(!ViewOldPassword);
            }}
          />
          <Text style={styles.inputTitle}>
            {strings.change_password_screen.new_password}
          </Text>
          <InputField
            editable={true}
            title={strings.change_password_screen.new_password}
            secureTextEntry={!ViewNewPassword}
            image={
              !ViewNewPassword
                ? { uri: ThemeManager.ImageIcons.icon_hide_eye }
                : { uri: ThemeManager.ImageIcons.icon_open_eye }
            }
            onChangeText={(value) => {
              dispatch(
                changePasswordFormUpdate({
                  prop: "newPassword",
                  value,
                })
              );
            }}
            customContainerStyle={{
              backgroundColor: ThemeManager.colors.SwapInput,
            }}
            maxlength={100}
            onPress={() => {
              setViewNewPassword(!ViewNewPassword);
            }}
          />
          <Text style={styles.inputTitle}>
            {strings.change_password_screen.confirm_password}
          </Text>
          <InputField
            editable={true}
            title={strings.change_password_screen.confirm_password}
            secureTextEntry={!ViewConfirmPassword}
            customContainerStyle={{
              backgroundColor: ThemeManager.colors.SwapInput,
            }}
            image={
              !ViewConfirmPassword
                ? { uri: ThemeManager.ImageIcons.icon_hide_eye }
                : { uri: ThemeManager.ImageIcons.icon_open_eye }
            }
            onChangeText={(value) => {
              dispatch(
                changePasswordFormUpdate({
                  prop: "conPassword",
                  value,
                })
              );
            }}
            maxlength={100}
            onPress={() => {
              setViewConfirmPassword(!ViewConfirmPassword);
            }}
          />
          {/* <Text style={styles.note}>
            {strings.change_password_screen.for_security_purpose}
          </Text> */}
        </View>
        <View>
          {renderError()}
          <ButtonPrimary
            style={{ marginBottom: 30 }}
            title={"Submit"}
            onPress={() => {
              onButtonPress();
            }}
          />
        </View>
        <Loader isLoading={passwordLoading} />
      </View>
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
                      changePasswordRequest({
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                        conPassword: conPassword,
                      })
                    );
                    setmodalPopUpVisible(false);
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

export default ChangePassword;
