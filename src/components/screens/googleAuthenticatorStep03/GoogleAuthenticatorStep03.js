import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
} from "react-native";
import {
  HeaderGoogleAuthentication,
  AuthenticationFooterText,
  GoogleAuthKey,
  ButtonPrimary,
} from "../../common";
import { colors, Fonts } from "../../../theme";
import * as constants from "../../../Constants";
import { ThemeManager } from "../../../../ThemeManager";
import Singleton from "../../../Singleton";

class GoogleAuthenticatorStep03 extends Component {
  copyKey = async () => {
    if (this.props.secretKey != null) {
      await Clipboard.setString(this.props.secretKey);
      // Alert.alert(constants.APP_NAME, 'Copied to Clipboard!');
      Singleton.getInstance().showWarn("Copied to Clipboard!");
    }
  };

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
          isDoneAuth1st={styles.stepDone}
          isDoneAuthText1st={styles.stepDoneText}
          isDoneAuth2nd={styles.stepDone}
          isDoneAuthText2nd={styles.stepDoneText}
          isDoneAuth3rd={styles.stepDone}
          isDoneAuthText3rd={styles.stepDoneText}
          isDoneAuth4th={styles.stepDone1}
          isDoneAuthText4th={styles.stepDoneText1}
          goBacklink={() => {
            this.props.navigation.goBack();
          }}
          headerStyle={styles.headerMargnBottom}
          headerInfo="Increase security in your account"
          // onPress={() => { this.props.navigation.navigate('Menuscreen') }}
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
              <View style={{ marginBottom: 14 }} />
              <Text
                style={[
                  styles.alreadyDownloaded,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                Save this Key on paper. This key will allow you to recover you
                Google Authentication in case of phone loss
              </Text>
              <GoogleAuthKey keyText={this.props.secretKey} />
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => this.copyKey()}
              >
                <Text
                  style={[
                    styles.copyText,
                    { color: ThemeManager.colors.textColor },
                  ]}
                >
                  Copy
                </Text>
              </TouchableOpacity>
              {/* <Text style={[styles.alreadyDownloaded, styles.isHighlighted]}>
                {" "}
              </Text> */}
            </View>
            <ButtonPrimary
              title={"Continue"}
              onPress={() => {
                Actions.currentScene != "GoogleAuthenticatorStep04" &&
                  Actions.GoogleAuthenticatorStep04({
                    isEnabled: true,
                    fromWithdraw: this.props.fromWithdraw,
                  });
              }}
            />
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
    // backgroundColor: '#FEECEC',
    backgroundColor: colors.blackTxt,
  },
  copyButton: {
    width: 60,
    height: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  copyText: {
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.bold,
    fontSize: 15,
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
  downloadAppBlock: {
    borderWidth: 1,
    borderColor: "rgba(6,19,38,0.12)",
    padding: 25,
    marginBottom: 15,
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
  isHighlighted: {
    color: "#EA2027",
  },
});

export default GoogleAuthenticatorStep03;
