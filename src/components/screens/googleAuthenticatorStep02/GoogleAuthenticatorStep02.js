import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
} from "react-native";
import {
  HeaderGoogleAuthentication,
  AuthenticationFooterText,
  GoogleAuthKey,
  Button,
  Spinner,
  ButtonPrimary,
} from "../../common";
import Singleton from "../../../Singleton.js";

import { getGoogleAuthDetails } from "../../../Redux/Actions";
import { colors, Fonts } from "../../../theme";
import * as constants from "../../../Constants";
import { ThemeManager } from "../../../../ThemeManager";
import { strings } from "../../../../Localization";

class GoogleAuthenticatorStep02 extends Component {
  state = {
    userDate: null,
  };

  componentDidMount() {
    this.props.getGoogleAuthDetails();
  }

  renderError() {
    if (this.props.qrCodeError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>{this.props.qrCodeError}</Text>
        </View>
      );
    }
  }
  renderQrImage() {
    if (!this.props.qrCodeLoading) {
      var base64Icon =
        "data:image/png;base64," + this.props.qrCodeDetails.barcode;
      // 'data:image/png;base64,
      if (base64Icon != null) {
        return (
          <Image
            style={{ resizeMode: "contain", width: 180, height: 180 }}
            source={{ uri: base64Icon }}
          />
        );
      }
    }
  }

  getQrKey() {
    if (this.props.qrCodeDetails != null) {
      let arr = this.props.qrCodeDetails.url.split("secret=");
      if (arr?.length) {
        return arr[arr?.length - 1];
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  renderQrView() {
    if (this.props.qrCodeLoading) {
      return <Spinner />;
    } else {
      if (this.props.qrCodeDetails != null) {
        return (
          <View
            style={[
              styles.middleBlock,
              { backgroundColor: ThemeManager.colors.dashboardDarkBg },
            ]}
          >
            <View
              style={[
                styles.downloadAppBlock,
                { backgroundColor: ThemeManager.colors.dashboardDarkBg },
              ]}
            >
              {this.renderQrImage()}

              <View style={{ marginBottom: 14 }} />
              <Text
                style={[
                  styles.alreadyDownloaded,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {strings.googleAuth1.scan_the_qr}
              </Text>

              <GoogleAuthKey keyText={this.getQrKey()} />
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => this.copyKey(this.getQrKey())}
              >
                <Text
                  style={[
                    styles.copyText,
                    { color: ThemeManager.colors.textColor },
                  ]}
                >
                  {strings.googleAuth1.copy}
                </Text>
              </TouchableOpacity>
            </View>
            <ButtonPrimary
              title={strings.googleAuth1.continue}
              onPress={() => {
                Actions.currentScene != "GoogleAuthenticatorStep03" &&
                  Actions.GoogleAuthenticatorStep03({
                    secretKey: this.getQrKey(),
                    fromWithdraw: this.props.fromWithdraw,
                  });
              }}
            />
          </View>
        );
      }
    }
  }
  copyKey = async (value) => {
    if (value != null) {
      await Clipboard.setString(value);
      // Alert.alert(constants.APP_NAME, strings.googleAuth1.copied_to);
      Singleton.getInstance().showWarn(strings.googleAuth1.copied_to);
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
          hBtnText={strings.googleAuth1.security}
          isDoneAuth1st={styles.stepDone}
          isDoneAuthText1st={styles.stepDoneText}
          isDoneAuth2nd={styles.stepDone}
          isDoneAuthText2nd={styles.stepDoneText}
          isDoneAuth3rd={styles.stepDone1}
          isDoneAuthText3rd={styles.stepDoneText1}
          isDoneAuth4th={styles.stepDone1}
          isDoneAuthText4th={styles.stepDoneText1}
          goBacklink={() => {
            this.props.navigation.goBack();
          }}
          headerStyle={styles.headerMargnBottom}
          headerInfo={strings.googleAuth1.increase_security}
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
          {this.renderQrView()}
          <AuthenticationFooterText
            authTextFooter={strings.googleAuth1.this_is_used}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    // backgroundColor: '#FEECEC',
    backgroundColor: colors.black,
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
  errorMessageStyle: {
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },
  copyText: { color: "rgba(6,19,38,0.87)", fontFamily: Fonts.regular },
  // headerMargnBottom: {
  //   marginBottom: 10,
  // },
  copyButton: {
    width: 60,
    height: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => {
  const { qrCodeError, qrCodeDetails, qrCodeLoading } = state.qrCodeRed;

  return {
    qrCodeError,
    qrCodeDetails,
    qrCodeLoading,
  };
};

export default connect(mapStateToProps, {
  getGoogleAuthDetails,
})(GoogleAuthenticatorStep02);
