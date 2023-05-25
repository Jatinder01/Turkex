import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import {
  SelectPaymentOption,
  CheckboxWithImg,
  Button,
  InputVerification,
  Loader,
  Wrap,
  ButtonPrimary,
} from "../../common";
import * as constants from "../../../Constants";
import { ThemeManager } from "../../../../ThemeManager";
import {
  sumbitWithdrawRequest,
  withdrawFormUpdate,
  resetWithdrawReq,
  withdrawOtpSendRequest,
  withdrawOtpExpireRequest,
} from "../../../Redux/Actions";
import styles from "./WithdrawConfirmationStyle";
import SimpleHeader from "../../common/SimpleHeader";
import { strings } from "../../../../Localization";
import { colors, Fonts, Images } from "../../../theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import Singleton from "../../../Singleton";
import { showMessage } from "react-native-flash-message";
let intervalId;
const { height } = Dimensions.get("window");
class WithdrawConfirmation extends Component {
  state = {
    accepted: false,
    otp: "",
    emailOtp: "",
    kycStatus: false,
    count: 60,
    showCountDown: true,
    loader: false,
  };

  renderError() {
    if (this.props?.withdrawError) {
      return (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.errorMessageStyle}>
            {this.props?.withdrawError}
          </Text>
        </View>
      );
    }
  }
  backAction = () => {
    this.setState({
      loader: true,
    });
    this.props
      ?.withdrawOtpExpireRequest()
      .then((res) => {
        console.log("withdrawOtpExpireRequest=-=res-", JSON.stringify(res));
        this.props?.resetWithdrawReq();
        this.props.withdrawFormUpdate({
          prop: "withdrawAddress",
          value: "",
        });
        this.props.withdrawFormUpdate({
          prop: "withBeniId",
          value: "",
        });
        this.props.withdrawFormUpdate({
          prop: "amount",
          value: "",
        });
        this.props?.navigation.goBack();
        this.setState({
          loader: false,
        });
      })
      .catch((err) => {
        Singleton.getInstance().showError(err);
        console.log("withdrawOtpExpireRequest=-=error-", JSON.stringify(err));
        this.setState({
          loader: false,
        });
      });
    return true;
  };
  componentDidMount() {
    this.startTimer();
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  startTimer = () => {
    intervalId = setInterval(() => {
      if (this.state.count == 1) {
        this.setState({
          showCountDown: false,
        });
        clearInterval(intervalId);
      } else {
        this.setState((prevState) => {
          return {
            count: prevState.count - 1,
          };
        });
      }
    }, 1000);
  };
  componentWillUnmount() {
    this.backHandler.remove();
    clearInterval(intervalId);
  }
  renderButton() {
    return (
      <ButtonPrimary
        style={styles.btnBottom}
        title={"Confirm Withdraw"}
        onPress={() => {
          if (this.state.accepted) {
            var coinName = this.props?.coinType.id;
            var amount = this.props?.amt;
            var address = this.props?.address;
            var otp = this.props?.gOTP;
            var beniId = this.props?.withBeniId;
            var blockchainKey = this.props?.networkType;
            var withdraw_otp = this.state.emailOtp;
            if (otp?.length == 0) {
              Singleton.getInstance().showError(
                "Google verification code is required"
              );
            } else if (withdraw_otp?.length == 0) {
              Singleton.getInstance().showError("OTP is required");
            } else if (withdraw_otp?.length < 5) {
              Singleton.getInstance().showError("Please enter valid OTP Code");
            } else if (otp?.length < 6) {
              Singleton.getInstance().showError("Please enter valid 2FA Code");
            } else {
              this.props?.sumbitWithdrawRequest({
                coinName,
                amount,
                address,
                otp,
                beniId,
                blockchainKey,
                withdraw_otp,
              });
            }
          } else {
            Singleton.getInstance().showError("Please accept confirmation");
          }
        }}
      />
    );
  }
  onResendBtnPress = () => {
    // alert("hello");
    var amount = this.props?.amt;
    var beneficiary_id = this.props?.withBeniId;
    var currency = this.props?.coinType.id;
    var resend_otp = true;
    // console.log("amount=-=-=", amount);
    // console.log("beniId=-=-=", beniId);
    // console.log("coinName=-=-=", coinName);

    this.props
      ?.withdrawOtpSendRequest({ amount, beneficiary_id, currency, resend_otp })
      .then((res) => {
        console.log("withdrawOtpSendRequest=-=res-", res);
        Singleton.getInstance().showMsg("OTP resent on your email.");
        this.setState({
          showCountDown: true,
          count: 60,
        });
        // this.setState((prevState) => {
        //   return {
        //     count: prevState.count - 1,
        //   };
        // });
        this.startTimer();
      })
      .catch((err) => {
        Singleton.getInstance().showError(err);
        console.log("withdrawOtpSendRequest=-=error-", err);
      });
  };
  render() {
    return (
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.whiteScreen }}
        screenStyle={[
          styles.screenStyle,
          { backgroundColor: ThemeManager.colors.whiteScreen },
        ]}
        bottomStyle={{
          backgroundColor: ThemeManager.colors.whiteScreen,
        }}
      >
        <View style={{ margin: 10, height: 40 }}>
          <SimpleHeader
            backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
            titleName={strings.titleName.confirmation}
            onBackPress={() => {
              this.setState({
                loader: true,
              });
              this.props
                ?.withdrawOtpExpireRequest()
                .then((res) => {
                  console.log(
                    "withdrawOtpExpireRequest=-=res-",
                    JSON.stringify(res)
                  );
                  this.props.withdrawFormUpdate({
                    prop: "withdrawAddress",
                    value: "",
                  });
                  this.props.withdrawFormUpdate({
                    prop: "withBeniId",
                    value: "",
                  });
                  this.props.withdrawFormUpdate({
                    prop: "amount",
                    value: "",
                  });
                  this.props?.resetWithdrawReq();
                  this.props?.navigation.goBack();

                  this.setState({
                    loader: false,
                  });
                })
                .catch((err) => {
                  Singleton.getInstance().showError(err);
                  console.log(
                    "withdrawOtpExpireRequest=-=error-",
                    JSON.stringify(err)
                  );
                  this.setState({
                    loader: false,
                  });
                });
            }}
          />
        </View>

        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        >
          <View style={styles.middleBlock}>
            <View style={styles.header}>
              <Text
                style={[
                  styles.titleDepositLimt,
                  { color: ThemeManager.colors.textColor1 },
                ]}
              >
                {this.props?.deposit ? "Deposit order" : "Withdrawal details"}
              </Text>
            </View>
            <View
              style={[
                styles.depositeOrderDetails,
                { backgroundColor: ThemeManager.colors.tabBackground },
              ]}
            >
              <Text
                style={[
                  styles.depositeOrderText,
                  { color: ThemeManager.colors.textColor1 },
                ]}
              >
                {"Amount: " +
                  this.props?.amt +
                  " " +
                  this.props?.coinType.id.toUpperCase()}
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    loader: true,
                  });
                  this.props
                    ?.withdrawOtpExpireRequest()
                    .then((res) => {
                      console.log(
                        "withdrawOtpExpireRequest=--=--=res-",
                        JSON.stringify(res)
                      );
                      this.props?.navigation.goBack();
                      this.setState({
                        loader: false,
                      });
                    })
                    .catch((err) => {
                      Singleton.getInstance().showError(err);
                      console.log(
                        "withdrawOtpExpireRequest=-00=error-",
                        JSON.stringify(err)
                      );
                      this.setState({
                        loader: false,
                      });
                    });
                }}
              >
                <View
                  style={[
                    styles.orderBtn,
                    { backgroundColor: ThemeManager.colors.tabBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.depositeOrderBtn,
                      { color: ThemeManager.colors.textColor1 },
                    ]}
                  >
                    Change
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={[
                styles.depositeOrderDetails,
                { backgroundColor: ThemeManager.colors.tabBackground },
              ]}
            >
              <Text
                style={[
                  styles.depositeOrderText,
                  { color: ThemeManager.colors.textColor1 },
                ]}
              >
                {"Transaction fee: " +
                  this.props?.transFee +
                  " " +
                  this.props?.coinType.id.toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.depositeOrderDetails,
                { backgroundColor: ThemeManager.colors.tabBackground },
              ]}
            >
              <Text
                style={[
                  styles.depositeOrderText,
                  { color: ThemeManager.colors.textColor1 },
                ]}
              >
                {"Receiver will get: " +
                  parseFloat(
                    this.props?.amt - this.props?.transFee
                  ).toPrecision(2) +
                  " " +
                  this.props?.coinType.id.toUpperCase()}{" "}
              </Text>
            </View>

            <View style={styles.payWithBlock}>
              <Text
                style={[
                  styles.payWithTitle,
                  { color: ThemeManager.colors.textColor1 },
                ]}
              >
                {this.props?.deposit ? "Pay With" : "Withdraw to"}
              </Text>
              <SelectPaymentOption
                optionSelected={
                  this.props?.deposit
                    ? { uri: ThemeManager.ImageIcons.icon_market_filter_right }
                    : {}
                }
                btnLabel={this.props?.address}
                btnSelected={styles.isSelected}
                paymentType={
                  this.props?.deposit
                    ? { uri: ThemeManager.ImageIcons.icon_market_filter_right }
                    : {}
                }
              />
            </View>
          </View>
          {this.props?.deposit == false && (
            <View style={{ marginLeft: 15, marginRight: 15, marginTop: 10 }}>
              <InputVerification
                inputLabel={strings.withdraw_screen.enter_otp_sent}
                verifyInputStyle={{
                  color: ThemeManager.colors.textColor1,
                }}
                verifyLable={{ color: ThemeManager.colors.textColor5 }}
                maxLength={6}
                value={this.state.emailOtp}
                keyboardStyle="numeric"
                returnKeyType={"done"}
                placeHolder={strings.withdraw_screen.enter_otp_code}
                onChangeText={(value) => {
                  if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                    this.setState({
                      emailOtp: value,
                    });
                    this.props?.withdrawFormUpdate({ prop: "mailOTP", value });
                  }
                }}
              />
              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: 10,
                  marginBottom: 15,
                }}
              >
                {this.state.showCountDown ? (
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                    }}
                  >
                    {this.state.count} {strings.withdraw_screen.seconds}
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.onResendBtnPress();
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: 14,
                        color: ThemeManager.colors.textColor,
                      }}
                    >
                      {strings.withdraw_screen.resent_otp}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          {this.props?.deposit == false && (
            <View style={{ marginLeft: 15, marginRight: 15 }}>
              <InputVerification
                inputLabel={strings.withdraw_screen.enter_google_verification}
                verifyInputStyle={{
                  color: ThemeManager.colors.textColor1,
                }}
                verifyLable={{ color: ThemeManager.colors.textColor5 }}
                maxLength={6}
                value={this.state.otp}
                keyboardStyle="numeric"
                returnKeyType={"done"}
                placeHolder={strings.withdraw_screen.google_verification_code}
                onChangeText={(value) => {
                  if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                    this.setState({
                      otp: value,
                    });
                    this.props?.withdrawFormUpdate({ prop: "gOTP", value });
                  }
                }}
              />
            </View>
          )}

          <View style={{ width: "100%", paddingHorizontal: 15 }}>
            <CheckboxWithImg
              checkboxLabel="I accept the above confirmation"
              checkBoxStyle={styles.checkboxStyleCustom}
              checkboxImgPosition={styles.checkboxPosition}
              checkboxImg={
                this.state.accepted
                  ? { uri: Images.icon_Agree_check }
                  : { uri: ThemeManager.ImageIcons.icon_select_k }
              }
              buttonClicked={() => {
                this.setState({ accepted: !this.state.accepted });
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        {/* {this.renderError()} */}
        {this.renderButton()}
        <Loader isLoading={this.props?.withdrawLoading || this.state.loader} />
      </Wrap>
    );
  }
}

const mapStateToProps = (state) => {
  const { withdrawError, withdrawSuccessDetails, withdrawLoading } =
    state.withdrawSubmit;

  const { gOTP, withBeniId } = state.withDetails;
  return {
    withdrawError,
    withdrawSuccessDetails,
    withdrawLoading,
    gOTP,
    withBeniId,
  };
};
export default connect(mapStateToProps, {
  sumbitWithdrawRequest,
  withdrawFormUpdate,
  resetWithdrawReq,
  withdrawOtpSendRequest,
  withdrawOtpExpireRequest,
})(WithdrawConfirmation);
