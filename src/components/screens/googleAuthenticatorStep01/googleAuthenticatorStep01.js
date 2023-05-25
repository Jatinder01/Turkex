import React, { Component } from "react";
import { Actions } from "react-native-router-flux";

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from "react-native";
import {
  HeaderGoogleAuthentication,
  AuthenticationFooterText,
  Card,
  CardSection,
  Button,
  ButtonPrimary,
} from "../../common";
import { colors, Fonts } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";

class googleAuthenticatorStep01 extends Component {
  render() {
    return (
      <View
        style={[
          styles.viewMain,
          { backgroundColor: ThemeManager.colors.DashboardBG },
        ]}
      >
        <HeaderGoogleAuthentication
          hBtnText="Security"
          // isDoneAuth1st={{
          //   backgroundColor: ThemeManager.colors.dashboardSubViewBg,
          // }}
          // isDoneAuthText1st={{color: ThemeManager.colors.textColor}}
          isDoneAuth1st={styles.stepDone}
          isDoneAuthText1st={styles.stepDoneText}
          isDoneAuth2nd={styles.stepDone1}
          isDoneAuthText2nd={styles.stepDoneText1}
          isDoneAuth3rd={styles.stepDone1}
          isDoneAuthText3rd={styles.stepDoneText1}
          isDoneAuth4th={styles.stepDone1}
          isDoneAuthText4th={styles.stepDoneText1}
          goBacklink={() => {
            Actions.pop();
          }}
          headerStyle={styles.headerMargnBottom}
          headerInfo="Increase security in your account"
        />
        <ScrollView
          bounces={false}
          style={{
            backgroundColor: ThemeManager.colors.dashboardSubViewBg,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          <View style={styles.middleBlock}>
            <View style={styles.downloadAppBlock}>
              <Text
                style={[styles.title, { color: ThemeManager.colors.textColor }]}
              >
                Download and Install Google Authentication App
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  Linking.openURL(
                    "https://apps.apple.com/us/app/google-authenticator/id388497605"
                  ).catch((err) => console.error("An error occurred", err));
                }}
              >
                <Image
                  source={require("../../../../assets/images/icon_download_from_appStore.png")}
                  width="180"
                  height="60"
                />
              </TouchableWithoutFeedback>
              <View style={{ marginBottom: 14 }} />
              <TouchableWithoutFeedback
                onPress={() => {
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_IN"
                  ).catch((err) => console.error("An error occurred", err));
                }}
              >
                <Image
                  source={require("../../../../assets/images/icon_download_from_googlePlay.png")}
                  width="180"
                  height="54"
                />
              </TouchableWithoutFeedback>
            </View>
            <ButtonPrimary
              style={{ marginBottom: 30 }}
              title={"Continue"}
              onPress={() => {
                Actions.currentScene != "GoogleAuthenticatorStep02" &&
                  Actions.GoogleAuthenticatorStep02({
                    fromWithdraw: this.props.fromWithdraw,
                  });
              }}
            />
            <Text
              style={[
                styles.alreadyDownloaded,
                { color: ThemeManager.colors.textColor },
              ]}
            >
              I already downloaded the app
            </Text>
          </View>
          <AuthenticationFooterText authTextFooter="This is used for withdraws and security modifications." />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    backgroundColor: ThemeManager.colors.placeholderTextColor,
  },
  headerMargnBottom: {
    marginBottom: 10,
  },
  stepDone: {
    backgroundColor: colors.btnTextColor,
  },
  stepDoneText: {
    color: ThemeManager.colors.textColor,
  },
  stepDone1: {
    backgroundColor: ThemeManager.colors.tabBackground,
  },
  stepDoneText1: {
    color: ThemeManager.colors.textColor1,
  },
  // stepDone: {
  //   backgroundColor: ThemeManager.colors.dashboardSubViewBg,
  // },
  // stepDoneText: {
  //   color: '#e14e3e',
  // },
  downloadAppBlock: {
    borderWidth: 1,
    borderColor: "rgba(6,19,38,0.12)",
    padding: 25,
    marginBottom: 35,
    alignItems: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    color: "rgba(6,19,38,0.87)",
    textAlign: "center",
    fontFamily: Fonts.regular,
    marginBottom: 15,
  },
  middleBlock: {
    flex: 1,
    padding: 15,
  },
  alreadyDownloaded: {
    fontSize: 13,
    color: "rgba(6,19,38,0.60)",
    textAlign: "center",
    fontFamily: Fonts.regular,
    marginTop: 10,
  },
});

export default googleAuthenticatorStep01;
