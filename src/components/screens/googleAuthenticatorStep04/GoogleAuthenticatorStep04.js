import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import {
  HeaderGoogleAuthentication,
  AuthenticationFooterText,
  Spinner,
  LoginTitle,
  InputDark,
  ButtonPrimary,
} from "../../common";
import {
  validateGoogleAuthUser,
  googleValidateFormUpdate,
} from "../../../Redux/Actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import * as constants from "../../../Constants";

import { colors, Fonts } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";

class GoogleAuthenticatorStep04 extends Component {
  componentWillUnmount() {
    this.props.googleValidateFormUpdate({ prop: "gValidateError", value: "" });
  }
  componentDidMount() {
    this.props.googleValidateFormUpdate({
      prop: "gValidateCode",
      value: "",
    });
  }
  renderError() {
    if (this.props.gValidateError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>
            {this.props.gValidateError}
          </Text>
        </View>
      );
    }
  }
  renderSpinner() {
    if (this.props.gValidateLoading) {
      return <Spinner size="large" />;
    }

    return (
      <ButtonPrimary
        title={"Continue"}
        onPress={() => {
          if (this.props.gValidateCode?.length > 0) {
            const {
              gValidateCode,
              gValidatePassword,
              secretKey,
              isEnabled,
              fromWithdraw,
            } = this.props;
            let refProps = this.props;
            this.props
              .validateGoogleAuthUser({
                gValidateCode,
                gValidatePassword,
                secretKey,
                isEnabled,
                refProps,
                fromWithdraw,
              })
              .then((res) => {
                console.log("validateGoogleAuthUser=-=-=->>>>res", res);
                console.log(
                  "validateGoogleAuthUser=-=-global.twoFaFromScreen",
                  global?.twoFaFromScreen
                );

                if (global?.twoFaFromScreen == "WithdrawWallet") {
                  Actions.currentScene != "WithdrawWallet" &&
                    Actions.replace("WithdrawWallet");
                } else {
                  Actions.replace("Main");
                }
              })
              .catch((err) => {
                console.log(
                  "validateGoogleAuthUser=-=-=->>>>err",
                  JSON.stringify(err)
                );
              });
          } else {
            alert("Please enter a valid Google Authenticator code.");
          }
        }}
      />
    );
  }
  render() {
    return (
      <View
        style={[
          styles.viewMain,
          { backgroundColor: ThemeManager.colors.DashboardBG },
        ]}
      >
        {this.props.isEnabled == false ? (
          <HeaderGoogleAuthentication
            hBtnText="Security"
            goBacklink={() => {
              this.props.navigation.goBack();
            }}
            headerStyle={styles.headerMargnBottom}
            isEnable={true}
            headerInfo="Increase security in your account"
          />
        ) : (
          <HeaderGoogleAuthentication
            hBtnText="Security"
            isDoneAuth1st={styles.stepDone}
            isDoneAuthText1st={styles.stepDoneText}
            isDoneAuth2nd={styles.stepDone}
            isDoneAuthText2nd={styles.stepDoneText}
            isDoneAuth3rd={styles.stepDone}
            isDoneAuthText3rd={styles.stepDoneText}
            isDoneAuth4th={styles.stepDone}
            isDoneAuthText4th={styles.stepDoneText}
            goBacklink={() => {
              this.props.googleValidateFormUpdate({
                prop: "gValidateCode",
                value: "",
              });
              this.props.navigation.goBack();
            }}
            headerStyle={styles.headerMargnBottom}
            headerInfo="Increase security in your account"
            // onPress={() => { this.props.navigation.navigate('Menuscreen') }}
          />
        )}

        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          style={{
            backgroundColor: ThemeManager.colors.dashboardSubViewBg,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          <View style={styles.middleBlock}>
            <View style={styles.logoWelcome}>
              <View style={[styles.loginTitle, { alignItems: "center" }]}>
                {this.props.isEnabled == false ? (
                  <LoginTitle styleProp={styles.title} title="Disable Auth" />
                ) : (
                  <LoginTitle styleProp={styles.title} title="Almost Done" />
                )}
              </View>
              <View style={[styles.inputRow, { marginTop: -40 }]}>
                <InputDark
                  inputCustomStyle={styles.noPaddingAsside}
                  lightStyle={{
                    color: ThemeManager.colors.textColor1,
                    backgroundColor: ThemeManager.colors.SwapInput,
                    borderRadius: 6,
                  }}
                  labelText="Google authentication code"
                  placeHolder="Enter 2FA code"
                  keyboardType={"numeric"}
                  value={this.props.gValidateCode}
                  darkCustomStyle={styles.inputStyle}
                  customLableStyle={styles.lableStyle}
                  maxLength={6}
                  returnKeyType={"done"}
                  onChangeText={(value) => {
                    if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                      this.props.googleValidateFormUpdate({
                        prop: "gValidateCode",
                        value,
                      });
                    }
                  }}
                />
              </View>
              {this.renderError()}
              <View style={styles.btnSignup}>{this.renderSpinner()}</View>
            </View>
          </View>
          <AuthenticationFooterText authTextFooter="This is used for withdraws and security modifications." />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    backgroundColor: ThemeManager.colors.dashboardDarkBg,
  },
  noPaddingAsside: {
    padding: 0,
    marginRight: 0,
    marginLeft: 0,
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
  downloadAppBlock: {
    borderWidth: 1,
    borderColor: "rgba(6,19,38,0.12)",
    padding: 25,
    marginBottom: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    color: "rgba(6,19,38,0.87)",
    textAlign: "left",
    fontFamily: Fonts.bold,
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
  inputStyle: {
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    backgroundColor: "#900",
  },
  btnSignup: {
    marginTop: 30,
  },
  lableStyle: {
    color: "rgba(6,19,38,0.87)",
    fontFamily: Fonts.bold,
  },
  errorMessageStyle: {
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },
});

const mapStateToProps = (state) => {
  const {
    gValidateCode,
    gValidatePassword,
    gValidateError,
    gValidateDetails,
    gValidateLoading,
  } = state.googleValidate;

  return {
    gValidateCode,
    gValidatePassword,
    gValidateError,
    gValidateDetails,
    gValidateLoading,
  };
};

export default connect(mapStateToProps, {
  validateGoogleAuthUser,
  googleValidateFormUpdate,
})(GoogleAuthenticatorStep04);
