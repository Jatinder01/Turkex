/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Image } from "react-native";
import styles from "./SettingsStyle";
import { ButtonPrimary, Header, Wrap } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { strings } from "../../../../Localization";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";
import SimpleHeader from "../../common/SimpleHeader";
import { useDispatch, useSelector } from "react-redux";

const Settings = (props) => {
  const [backgroundColor, setbackgroundColor] = useState();
  const [isSelectedMode, setSelectedMode] = useState(" ");
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [userDate, setuserDate] = useState(null);
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  console.log("currentTheme=-=-=-=---->>>>", currentTheme);
  useEffect(() => {
    props.navigation.addListener("didFocus", () => {
      getUserData();
      themeStatus();
      Actions.refresh();
    });
  }, []);

  const getUserData = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        setuserDate(JSON.parse(res));
      })
      .catch((err) => {});
  };

  const themeStatus = () => {
    Singleton.getInstance()
      .getData(constants.IS_THEME_ENABLE)
      .then((res) => {
        if (res === "theme2") {
          setSelectedMode("Dark Mode");
        } else {
          setSelectedMode("Light Mode");
        }
      })
      .catch((err) => {
        Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, "theme1");
        setSelectedMode("Light Mode");
      });
  };
  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        // { backgroundColor: ThemeManager.colors.DashboardBG },
      ]}
    >
      <View
        style={{
          justifyContent: "space-between",
          flex: 1,
          backgroundColor: ThemeManager.colors.DashboardBG,
        }}
      >
        <View style={{ marginHorizontal: 20, height: 40, marginBottom: 15 }}>
          <SimpleHeader
            titleName={strings.titleName.settings}
            backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
            // titleName={'kjjkh'}
            titleStyle={{
              fontSize: 18,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor1,
              // marginLeft: 10,
            }}
            onBackPress={() => {
              // props.onRefresh();
              Actions.pop();
            }}
          />
        </View>
        <ScrollView bounces={false}>
          <View style={styles.alignCenter}>
            <Image
              source={{ uri: ThemeManager.ImageIcons.Logo_MAIN }}
              style={styles.logoImageStyle}
            />
          </View>
          <View>
            {/* <SimpleHeader />
            <Header
              titleCenter={strings.titleName.settings}
              mainView={{paddingHorizontal: 25}}
              customCenterTitle={{fontSize: 18}}
              leftImage={{uri: Images.icon_back}}
              btnTextLeft=" "
              btnTextRight=" "
              leftButtonClicked={() => {
                // Actions.jump('Profile');
                Actions.currentScene != 'Settings' && Actions.pop();
              }}
            /> */}
            {/* <TouchableOpacity
              onPress={() => {
                // Actions.currentScene != "Appearance" &&
                //   Actions.push("Appearance");
                Actions.currentScene != "CurrencyList" &&
                  Actions.CurrencyList();
              }}
            >
              <Header
                customLeftTitle={styles.customLeftTitle}
                btnTextLeft={strings.settings.currency}
                customRightImage={styles.customRightImage}
                btnTextRight={selectedCurrency}
                customRightTitle={{
                  right: 16,
                  color: colors.dashboarItemLightText,
                }}
                rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                // Actions.currentScene != "Appearance" &&
                //   Actions.push("Appearance");
                Actions.currentScene != "Appearance" &&
                  Actions.Appearance({
                    onRefresh: () => {
                      themeStatus();
                    },
                  });
              }}
            >
              <Header
                customLeftTitle={styles.customLeftTitle}
                btnTextLeft={strings.settings.appearance}
                customRightImage={styles.customRightImage}
                btnTextRight={isSelectedMode}
                customRightTitle={{
                  right: 16,
                  color: colors.dashboarItemLightText,
                }}
                rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // Actions.ChangePassword();
                Actions.currentScene != "ChangePassword" &&
                  Actions.push("ChangePassword");
              }}
            >
              <Header
                customLeftTitle={styles.customLeftTitle}
                btnTextLeft={strings.settings.password}
                customRightImage={styles.customRightImage}
                btnTextRight={strings.settings.changes}
                customRightTitle={{
                  right: 16,
                  color: colors.dashboarItemLightText,
                }}
                rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (userDate.otp == false) {
                } else {
                  global.twoFaFromScreen = "pop";
                }
                userDate != null
                  ? userDate.otp == false
                    ? Actions.currentScene != " GoogleAuthenticatorStep01" &&
                      Actions.GoogleAuthenticatorStep01()
                    : Actions.currentScene != " DisableGoogleAuth" &&
                      Actions.DisableGoogleAuth()
                  : Actions.currentScene != " GoogleAuthenticatorStep01" &&
                    Actions.GoogleAuthenticatorStep01();
              }}
            >
              <Header
                customLeftTitle={styles.customLeftTitle}
                btnTextLeft={
                  userDate != null
                    ? userDate.otp == false
                      ? strings.settings.google_authentication
                      : strings.settings.disable_google_authentication
                    : strings.settings.google_authentication
                }
                customRightImage={styles.customRightImage}
                btnTextRight={" "}
                customRightTitle={{
                  right: 16,
                  color: colors.dashboarItemLightText,
                }}
                rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
                leftButtonClicked={() => {
                  // Actions.ChangePassword();
                }}
                rightButtonClicked={() => {
                  // Actions.ChangePassword();
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // Actions.push('ChangeLanguage');
                Actions.currentScene != "ChangeLanguage" &&
                  Actions.push("ChangeLanguage");
              }}
            >
              <Header
                customLeftTitle={styles.customLeftTitle}
                btnTextLeft={strings.titleName.language}
                customRightImage={styles.customRightImage}
                btnTextRight=" "
                customRightTitle={{ right: 16 }}
                rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Actions.currentScene != "AboutUs" && Actions.push("AboutUs");
              }}
            >
              <Header
                customLeftTitle={styles.customLeftTitle}
                btnTextLeft={strings.settings.about_us}
                customRightImage={styles.customRightImage}
                btnTextRight=" "
                customRightTitle={{ right: 16 }}
                rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Actions.currentScene != "ManageAccount" &&
                  Actions.push("ManageAccount");
              }}
            >
              <Header
                customLeftTitle={styles.customLeftTitle}
                btnTextLeft={"Manage Account"}
                customRightImage={styles.customRightImage}
                btnTextRight=" "
                customRightTitle={{ right: 16 }}
                rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
