import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import {
  TitleAuthentication,
  Button,
  HeaderWhite,
  LoginInput,
  Spinner,
  OtpInputs,
} from "../../common";
import { googleAuthFormUpdate, googleAuthUser } from "../../../actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import Singleton from "../../../Singleton.js";
import { Fonts } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
// import * as constants from '../../../Constants';

const { height } = Dimensions.get("window");
class GoogleAutheticator extends Component {
  state = {
    userData: null,
  };

  componentDidUpdate() {
    // withdrawValidate
    // Alert.alert(constants.APP_NAME,this.props?.forWithdraw)

    Singleton.getInstance()
      .getData("userdata")
      .then((res) => {
        this.setState({ userData: JSON.parse(res) });
      })
      .catch((err) => {});
  }

  componentWillUnmount() {
    this.props?.googleAuthFormUpdate({ prop: "googleAuthError", value: "" });
    // googleAuthError
  }

  renderButton() {
    if (this.props?.googleAuthLoading) {
      return <Spinner size="large" />;
    }
    if (this.props?.forWithdraw) {
      if (
        this.state.userData?.data != null &&
        this.state.userData?.data.is_email_active == 1
      ) {
        return (
          <Button
            defaultBtn={styles.btnVerification}
            onPress={this.onButtonPress.bind(this)}
          >
            Email Authentication
          </Button>
        );
      }
    } else {
      if (
        this.props?.loginUser?.data != null &&
        this.props?.loginUser?.data.is_email_active == 1
      ) {
        return (
          <Button
            defaultBtn={styles.btnVerification}
            onPress={this.onButtonPress.bind(this)}
          >
            Email Authentication
          </Button>
        );
      }
    }
  }

  onButtonPress() {
    // Actions.EmailAutheticator();
    this.props?.navigation.navigate("EmailAutheticator", {
      forWithdraw: this.props?.forWithdraw,
    });
  }

  renderError() {
    if (this.props?.googleAuthError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>
            {this.props?.googleAuthError}
          </Text>
        </View>
      );
    }
  }
  render() {
    return (
      <ImageBackground
        style={styles.viewMainContainer}
        source={require("../../../../assets/images/bg_screen.png")}
      >
        <HeaderWhite
          headerBtnText={styles.btnBack}
          btnTextLeft=""
          onPressBtnBack={() => {
            Actions.pop();
          }}
        />

        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          style={{ flexGrow: 1 }}
        >
          <TitleAuthentication
            viewStyle={{ marginTop: "50%" }}
            iconAuth={require("../../../../assets/images/icon_googleAuthenticationCode.png")}
            title="Google Authentication Code"
          />
          <OtpInputs
            otpStyle={styles.editInput}
            getOtp={(otp) => {
              console.log(otp);
              if (otp?.length >= 6) {
                let googleAuthCode = otp;
                let withdraw = this.props?.forWithdraw;

                let refProps = this.props;
                this.props?.googleAuthUser({
                  googleAuthCode,
                  withdraw,
                  refProps,
                });
              }
            }}
          />
          {this.renderError()}
        </KeyboardAwareScrollView>
        {/* <View style={styles.verifyInput}>

                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.vform}>

                    </View>
                </ScrollView>
                <View> */}
        {/* <TouchableWithoutFeedback>
                        <Text style={styles.lostGoogleAuthText}>Lost your Google Authenticator?</Text>
                    </TouchableWithoutFeedback> */}
        {/* </View> */}

        {this.renderButton()}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  viewMainContainer: {
    flex: 1,
    alignContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  btnBack: {
    color: "#fff",
    fontFamily: Fonts.medium,
  },
  vform: {
    width: "100%",
    flex: 1,
    paddingTop: 35,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
    // justifyContent: 'center',
  },
  btnVerification: {
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  lostGoogleAuthText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "rgba(237,247,255,60)",
    marginBottom: 20,
    marginTop: 20,
  },
  verifyInput: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'center',
    paddingTop: 45,
  },
  contStyle: {
    width: 53,
    justifyContent: "center",
    alignItems: "center",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#fff",
    // height: 56,
    borderRadius: 5,
    padding: 5,
    textAlign: "center",
    // paddingLeft: 0,
    // paddingRight: 0,
    marginBottom: 5,
    margin: 5,
    color: ThemeManager.colors.textColor1,
    fontFamily: Fonts.regular,
    width: 42,
  },
  errorMessageStyle: {
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },
});
const mapStateToProps = (state) => {
  const {
    googleAuth1,
    googleAuth2,
    googleAuth3,
    googleAuth4,
    googleAuth5,
    googleAuth6,
    googleAuthCode,
    googleAuthError,
    googleAuthLoading,
  } = state.googleAuth;
  const { loginUser } = state.auth;
  return {
    loginUser,
    googleAuth1,
    googleAuth2,
    googleAuth3,
    googleAuth4,
    googleAuth5,
    googleAuth6,
    googleAuthCode,
    googleAuthError,
    googleAuthLoading,
  };
};
export default connect(mapStateToProps, {
  googleAuthFormUpdate,
  googleAuthUser,
})(GoogleAutheticator);
