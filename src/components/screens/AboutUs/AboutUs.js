/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Linking,
  Platform,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
// import styles from './AboutUsStyle';
import { Wrap } from "../../common/Wrap";
import { Header } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, Fonts, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import { strings } from "../../../../Localization";
import Singleton from "../../../Singleton";

import * as constants from "../../../Constants";
import BorderLine from "../../common/BorderLine";
import SimpleHeader from "../../common/SimpleHeader";
import DeviceInfo from "react-native-device-info";
import Clipboard from "@react-native-clipboard/clipboard";
import { showMessage, hideMessage } from "react-native-flash-message";
import END_POINT from "../../../EndPoints";
import { CoinCultApi } from "../../../api/CoinCultApi";
let android_app_url =
  "https://play.google.com/store/apps/details?id=com.xchangemonster";
let ios_app_url = "https://apps.apple.com/in/app/xchange-monster/id1621071750";
const AboutUs = () => {
  const styles = useStyles(ThemeManager);
  const [deviceId, setDeviceId] = useState(" ");
  const [modalVisible, setModalVisible] = useState(false);
  const [androidVersion, setAndroidVersion] = useState("");
  const [iosVersion, setIosVersion] = useState("");
  const [message, setMessage] = useState(false);
  useEffect(() => {
    //
    getVersionApi(true);
    // if (Platform.OS === "android") {
    let uniqueId = DeviceInfo.getUniqueId();
    setDeviceId(uniqueId);
    // }
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(deviceId);
    Singleton.getInstance().showMsg(strings.aboutUs.deviceIdCopied);
    // showMessage({
    //   message: strings.aboutUs.deviceIdCopied,
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

  const getVersionApi = (status) => {
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        CoinCultApi.get(END_POINT.GET_APP_VERSION, {
          headers: {
            Authorization: JSON.parse(res),
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            console.log("check current version=-=-=>>>", response);
            setAndroidVersion(response?.data.andriodAppVersion);
            setIosVersion(response?.data.iosAppVersion);
            checkVersionUpdate(
              response?.data.android_version,
              response?.data.ios_version,
              status
            );
          })
          .catch((error) => {
            console.log("check current version=-=-=>>>error", error);

            if (error?.response?.status == "401") {
              Singleton.getInstance().isLoginSuccess = true;
              Singleton.getInstance().refreshToken(1);
            }
          });
      });
  };
  const checkVersionUpdate = (android, ios, status) => {
    if (
      Platform.OS === "android" &&
      Singleton.getInstance().isNewerVersion(
        END_POINT.CURRENT_BUILD_VERSION_ANDROID,
        android
      )
    ) {
      if (status) {
        setMessage(true);
      } else {
        setModalVisible(true);
      }
    } else {
      if (status) {
        // setMessage(true);
      } else {
        Platform.OS === "android" &&
          Singleton.getInstance().showMsg("App already updated");
      }
    }
    if (
      Platform.OS === "ios" &&
      Singleton.getInstance().isNewerVersion(
        END_POINT.CURRENT_BUILD_VERSION_IOS,
        ios
      )
    ) {
      if (status) {
        setMessage(true);
      } else {
        setModalVisible(true);
      }
    } else {
      if (status) {
        // setMessage(true);
      } else {
        Platform.OS === "ios" &&
          Singleton.getInstance().showMsg("App already updated");
      }
    }
  };
  return (
    <SafeAreaView style={styles.mainViewStyle}>
      <View style={styles.headerView}>
        <SimpleHeader
          titleName={strings.titleName.aboutUs}
          // backImageColor={{tintColor: ThemeManager.colors.headTxt}}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <View style={styles.containerStyle}>
        <ScrollView bounces={false}>
          <View style={styles.alignCenter}>
            <Image
              source={{ uri: ThemeManager.ImageIcons.Logo_MAIN }}
              style={styles.logoImageStyle}
            />
          </View>
          <View>
            <Header
              mainView={styles.horizontalMargin}
              customLeftTitle={styles.headerTextStyle}
              leftImage={{ uri: ThemeManager.ImageIcons.icon_facebook }}
              btnTextLeft={strings.aboutUs.like_facebook}
              btnTextRight=" "
              rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              customRightImage={styles.customRightImage}
              textClicked={() => {
                // alert("Coming Soon");
                Linking.openURL(
                  "https://www.facebook.com/people/Evo-Euro/100088870285586/"
                );
                // https://twitter.com/evoeuro?s=11&t=pO0ezdKjjCYYE-vAHYoCEg
              }}
            />
            <Header
              mainView={styles.horizontalMargin}
              customLeftTitle={styles.headerTextStyle}
              leftImage={{ uri: ThemeManager.ImageIcons.icon_twitter }}
              btnTextLeft={strings.aboutUs.follow_twitter}
              btnTextRight=" "
              rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              customRightImage={styles.customRightImage}
              textClicked={() => {
                // alert("Coming Soon");
                Linking.openURL(
                  "https://twitter.com/evoeuro?s=11&t=pO0ezdKjjCYYE-vAHYoCEg"
                );
                //
              }}
            />

            <Header
              mainView={{ marginHorizontal: 16 }}
              customLeftTitle={styles.headerTextStyle}
              leftImage={{ uri: ThemeManager.ImageIcons.icon_telegram }}
              btnTextLeft={strings.aboutUs.join_telegram}
              btnTextRight=" "
              rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              customRightImage={styles.customRightImage}
              textClicked={() => {
                Linking.openURL("https://t.me/evoeurope");
              }}
            />

            <Header
              mainView={{ marginHorizontal: 16 }}
              customLeftTitle={styles.headerTextStyle}
              leftImage={Images.inst_icon}
              btnTextLeft={strings.aboutUs.join_instagram}
              btnTextRight=" "
              custmImg={{ tintColor: ThemeManager.colors.headerText }}
              rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              customRightImage={styles.customRightImage}
              textClicked={() => {
                Linking.openURL(
                  "https://instagram.com/evo_euro?igshid=YmMyMTA2M2Y="
                );
              }}
            />
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                copyToClipboard();
              }}
            >
              <View style={styles.copyButtonView}>
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_phone }}
                  style={styles.copyButtonIcon}
                />
                <View style={styles.deviceIdView}>
                  <Text style={styles.deviceIdText}>
                    {strings.aboutUs.device_id}
                  </Text>
                  <Text style={styles.deviceIdTextStyle}>{deviceId}</Text>
                </View>
              </View>
              <View style={styles.profileIconView}>
                <Image
                  source={{ uri: ThemeManager.ImageIcons.Icon_Profile_Copy }}
                  style={styles.profileIconStyle}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.borderStyle}>
              <BorderLine />
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => {
                getVersionApi(false);
              }}
            >
              <View style={styles.copyButtonView}>
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_update }}
                  style={styles.copyButtonIcon}
                />
                <View style={styles.flexAlign}>
                  <Text style={styles.deviceIdText}>
                    {strings.aboutUs.check_update}
                  </Text>
                  {message ? (
                    <Text style={styles.deviceIdTextStyle}>
                      {strings.aboutUs.version_update}
                    </Text>
                  ) : (
                    <Text style={styles.deviceIdTextStyle}>
                      {strings.aboutUs.current_version_update}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <Wrap
          style={styles.backgroundTransparent}
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.subContainer}>
              <View style={styles.alignView}>
                <Text style={styles.appNameText}>{constants.APP_NAME}</Text>
              </View>
              <View style={styles.alignView}>
                <Text style={styles.updateText}>
                  {constants.WANT_TO_UPDATE_APP}
                </Text>
              </View>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  style={styles.notButton}
                >
                  <Text style={styles.notText}>Not Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === "android") {
                      Linking.openURL(android_app_url);
                    } else {
                      Linking.openURL(ios_app_url);
                    }
                  }}
                  style={[
                    styles.notButton,
                    {
                      backgroundColor: ThemeManager.colors.textGreenColor,
                    },
                  ]}
                >
                  <Text style={styles.okText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default AboutUs;
const useStyles = (theme) =>
  StyleSheet.create({
    viewPasswordImage: {
      height: 16,
      width: 16,
      resizeMode: "center",
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
    },
    viewEmailPhone: {
      left: 4,
      alignSelf: "center",
      top: 6,
    },
    IdText: {
      fontSize: 14,
      fontFamily: fonts.regular,
    },
    verifiedView: {
      flexDirection: "row",
      backgroundColor: colors.buttonBgColor,
      alignContent: "center",
      alignItems: "center",
      padding: 6,
      borderBottomLeftRadius: 15,
      borderTopLeftRadius: 15,
      height: 30,
    },
    verifiedImage: { marginLeft: 10, marginRight: 6, height: 18, width: 15 },
    verifiedText: {
      fontSize: 14,
      fontFamily: fonts.regular,
      color: colors.white,
    },
    infoView: {
      marginHorizontal: 16,
      marginVertical: 15,
      height: 60,
      backgroundColor: colors.white,
      alignItems: "center",
      paddingLeft: 15,
      flexDirection: "row",
    },
    customRightImage: {
      width: 12,
      height: 12,
      right: 32,
      // tintColor: theme.colors.textColor,
      resizeMode: "contain",
    },
    modeIcon: {
      width: 23,
      height: 23,
      right: 32,
      tintColor: theme.colors.textColor,
      resizeMode: "contain",
    },
    logoImageStyle: {
      height: 140,
      width: 140,
      resizeMode: "contain",
      marginTop: 5,
      marginBottom: 15,
    },
    mainViewStyle: {
      flex: 1,
      backgroundColor: theme.colors.DashboardBG,
      justifyContent: "space-between",
    },
    headerView: { marginHorizontal: 15, marginVertical: 10, height: 45 },
    headerTextStyle: { fontSize: 16, fontFamily: fonts.regular },
    containerStyle: { justifyContent: "space-between", flex: 1 },
    alignCenter: { alignItems: "center" },
    horizontalMargin: { marginHorizontal: 16 },
    copyButton: {
      marginHorizontal: 16,
      marginVertical: 15,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    copyButtonView: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexDirection: "row",
    },
    copyButtonIcon: { height: 20, width: 20, resizeMode: "contain" },
    deviceIdView: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flex: 0.9,
    },
    deviceIdText: {
      color: theme.colors.textColor1,
      fontSize: 16,
      fontFamily: Fonts.regular,
      marginLeft: 10,
    },
    deviceIdTextStyle: {
      color: theme.colors.inactiveTextColor,
      fontSize: 14,
      fontFamily: Fonts.regular,
      marginLeft: 10,
      marginTop: 10,

      // width: "85%",
    },
    profileIconView: { marginRight: 15, flex: 0.1 },
    profileIconStyle: { height: 20, width: 20, resizeMode: "contain" },
    borderStyle: { marginHorizontal: 15 },
    updateButton: {
      marginHorizontal: 16,
      marginVertical: 15,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    flexAlign: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginBottom: 80,
    },
    backgroundTransparent: { backgroundColor: "rgba(0,0,0,0.5)" },
    modalContainer: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.1)",
      flex: 1,
    },
    subContainer: {
      backgroundColor: theme.colors.DashboardBG,
      justifyContent: "center",
      borderRadius: 8,
      width: "90%",
    },
    appNameText: {
      color: theme.colors.textColor1,
      fontSize: 22,
      padding: 16,
      fontFamily: Fonts.bold,
    },
    alignView: { alignItems: "center" },
    updateText: {
      fontSize: 17,
      color: theme.colors.textColor1,
    },
    modalView: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 20,
    },
    notButton: {
      height: 40,
      padding: 5,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.SwapInput,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      width: 110,
    },
    notText: {
      color: theme.colors.textColor,
      fontFamily: Fonts.bold,
      fontSize: 14,
    },
    okText: {
      color: "white",
      fontFamily: Fonts.bold,
      fontSize: 14,
    },
  });
