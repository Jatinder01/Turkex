import React from "react";
import { Text, SafeAreaView, View, Image } from "react-native";
import styles from "./LoginOrRegisterStyle";
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, Header } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { strings } from "../../../../Localization";
import { string } from "prop-types";

const LoginOrRegister = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
        justifyContent: "space-between",
      }}
    >
      <View>
        <Header
          mainView={{ marginHorizontal: 16 }}
          customCenterTitle={{ fontSize: 18 }}
          leftImage={{ uri: ThemeManager.ImageIcons.icon_back }}
          customRightImage={styles.customRightImage}
          titleCenter=" "
          btnTextLeft=" "
          btnTextRight=" "
          rightImage={{ uri: Images.mode }}
          leftButtonClicked={() => {
            Actions.pop();
          }}
        />
        <Text
          style={{
            marginTop: 20,
            marginHorizontal: 16,
            color: ThemeManager.colors.textColor,
            fontFamily: fonts.medium,

            fontSize: 22,
          }}
        >
          {strings.LoginOrRegister}
        </Text>

        <Header
          mainView={{ marginHorizontal: 16 }}
          customLeftTitle={{ fontSize: 16, fontFamily: fonts.regular }}
          leftImage={{ uri: Images.icon_Profile_Settings }}
          btnTextLeft={strings.Settings}
          customRightImage={styles.customRightImage}
          btnTextRight=" "
          rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
        />
        <Header
          mainView={{ marginHorizontal: 16 }}
          customLeftTitle={{ fontSize: 16, fontFamily: fonts.regular }}
          leftImage={{ uri: Images.icon_Language }}
          btnTextLeft={strings.Language}
          customRightImage={styles.customRightImage}
          btnTextRight="English"
          customRightTitle={{ right: 30 }}
          rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
        />
        <Header
          mainView={{ marginHorizontal: 16 }}
          customLeftTitle={{ fontSize: 16, fontFamily: fonts.regular }}
          customCenterTitle={{ marginRight: 20 }}
          leftImage={{ uri: Images.help }}
          btnTextLeft={strings.HelpSupport}
          btnTextRight=" "
          rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
          customRightImage={styles.customRightImage}
        />
        <Header
          mainView={{ marginHorizontal: 16 }}
          customLeftTitle={{ fontSize: 16, fontFamily: fonts.regular }}
          leftImage={{ uri: Images.icon_profile_Share }}
          btnTextLeft={strings.Profile.shareTheApp}
          btnTextRight=" "
          rightImage={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
          customRightImage={styles.customRightImage}
        />
      </View>
      <Text
        style={{
          bottom: 30,
          alignSelf: "center",
          marginHorizontal: 16,
          color: colors.dashboarItemLightText,
          fontFamily: fonts.regular,
          fontSize: 12,
        }}
      >
        {strings.Profile.waring}
      </Text>
    </SafeAreaView>
  );
};

export default LoginOrRegister;
