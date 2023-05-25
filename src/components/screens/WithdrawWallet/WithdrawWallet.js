import React, { Component, PureComponent } from "react";
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
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from "react-native";

import {
  CurrencyType,
  ButtonSelectCurrency,
  Button,
  InputDark,
  Spinner,
  InputVerification,
  DropDownButton,
  Wrap,
  ButtonPrimary,
  Loader,
} from "../../common";

import {
  getCurrencyDetails,
  getBalanceDetails,
  withdrawFormUpdate,
  resetWithdrawalForm,
  getAllBenificiary,
  getFundsLimit,
  getProfile1,
  deleteUserAccountAction,
  getSumSubToken,
  updateSumSubApplicantId,
  withdrawOtpSendRequest,
  withdrawOtpExpireRequest,
} from "../../../Redux/Actions";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import Singleton from "../../../Singleton.js";

import * as constants from "../../../Constants";

import { Fonts, Images } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
import SimpleHeader from "../../common/SimpleHeader";
import { strings } from "../../../../Localization";
import WalletHeader from "../../common/WalletHeader";
import styles from "./WithdrawWalletStyle";
import { OptionsModal } from "../../common/OptionsModal";
import SNSMobileSDK from "@sumsub/react-native-mobilesdk-module";
import END_POINT from "../../../EndPoints";
const { height } = Dimensions.get("window");
const satoshiDivider = 100000000;
let nameJoin = [];
let combineValue;
class WithdrawWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      loading: true,
      selectedCoin: this.props?.coin,
      isBackspace: false,
      userData: null,
      modalNetworkVisible: false,
      networkList: this.props?.coin?.networks,
      initialNetwork: this.props?.coin?.networks[0]?.blockchain_key,
      networkMessageModal: false,
      selectedNetwork: this.props?.coin?.networks[0],
      tierStatus: "",
      usdRate: "",
      calculatedWithdraw: "0",
      showTwoFaButton: false,
      kycStatus: false,
      isDocumentVerified: false,
      isProfile: false,
      isDocumentReject: false,
      userVerified: false,
      isDocumentPending: false,
      checkLoader: true,
      isKycPending: false,
      userData: null,
      profileCompleted: false,
      showSumsub: false,
      loader: false,
      isProfileFilled: false,
      beniId: "",
      screenLoading: true,
      selectedAddress: "",
    };
  }

  componentDidMount() {
    let coinName = this.props?.coin?.id;

    var currentRoute = this.props?.navigation?.state?.routeName;
    this.props.navigation.addListener("didFocus", (event) => {
      if (currentRoute === event?.state?.routeName) {
        this.setState({
          usdRate: this.props?.coin?.price,
        });

        this.getCurrBalanceDetails(coinName);
        this.getUserData();
        this.props.getFundsLimit();
        this.props.getProfile1().then((res) => {
          this.checkUserVerificationStatus(res);
        });
        this.props.withdrawFormUpdate({
          prop: "withdrawAddress",
          value: "",
        });
        this.props.withdrawFormUpdate({
          prop: "amount",
          value: "",
        });
        this.props.withdrawFormUpdate({
          prop: "withBeniId",
          value: "",
        });
        this.setState({
          selectedAddress: "",
        });
        // console.log("hello=-=-=-=-=-=-=");
      }
    });
  }
  componentWillUnmount() {
    this.props.resetWithdrawalForm();
  }
  getUserData() {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        // console.log("JSON.parse(res=-=-=->>>>", JSON.parse(res));
        this.setState({ userData: JSON.parse(res) });
      })
      .catch((err) => {});

    this.props.getAllBenificiary();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getCurrBalanceDetails(coinName) {
    this.props.getBalanceDetails({ coinName });
  }
  // getCurrBalanceDetails(coinName) {
  //   this.props
  //     .getBalanceDetails({ coinName })
  //     .then((res) => {
  //       this.setState({
  //         loading: false,
  //       });
  //     })
  //     .catch((err) => {
  //       this.setState({
  //         loading: false,
  //       });
  //     });
  // }

  submitButtonClicked() {
    console.log("this.props.amount=-=-=-", this.props.amount);
    console.log(
      "this.state.selectedCoin.min_withdraw_amount=-=-=-",
      this.state.selectedCoin?.min_withdraw_amount
    );
    console.log("this.props.withdrawAddress=-=-=-", this.props.withdrawAddress);
    console.log(
      "this.props.withdrawAddress?.length=-=-=-",
      this.props.withdrawAddress?.length
    );
    if (this.state.kycStatus) {
      Singleton.getInstance()
        .getData(constants.USER_DATA)
        .then((res) => {
          console.log("result data", res);
          let totalBalance = this.props.balanceDetails?.balance;

          // debugger;
          if (this.props.withdrawAddress?.length < 10) {
            // Alert.alert(
            //   constants.APP_NAME_CAPS,
            //   "Enter a valid withdrawal address"
            // );
            Singleton.getInstance().showError(
              "Enter a valid withdrawal address"
            );
          } else if (this.props.amount?.length <= 0) {
            // Alert.alert(constants.APP_NAME_CAPS, "Enter withdrawal amount");
            Singleton.getInstance().showError("Enter withdrawal amount");
          } else if (
            parseFloat(this.props.amount) <
            parseFloat(this.state.selectedCoin?.min_withdraw_amount)
          ) {
            // Alert.alert(
            //   constants.APP_NAME_CAPS,
            //   "Minimum withdrawal amount is " +
            //     this.state.selectedCoin?.min_withdraw_amount
            // );
            // Singleton.getInstance().showError("Enter withdrawal amount");
            Singleton.getInstance().showError(
              `Minimum withdrawal amount is ${this.state.selectedCoin?.min_withdraw_amount}`
            );
          } else if (
            this.props.amount >
            parseFloat(this.state.selectedCoin?.withdraw_fee) +
              parseFloat(totalBalance)
          ) {
            // Alert.alert(constants.APP_NAME_CAPS, "Insufficient balance");
            Singleton.getInstance().showError("Insufficient balance");
          } else if (parseFloat(this.props.amount) > parseFloat(totalBalance)) {
            // Alert.alert(constants.APP_NAME_CAPS, "Insufficient balance");
            Singleton.getInstance().showError("Insufficient balance");
          } else if (
            parseFloat(this.state.selectedCoin?.withdraw_fee) >=
            parseFloat(this.props.amount)
          ) {
            // Alert.alert(
            //   constants.APP_NAME_CAPS,
            //   "Withdrawal amount should be greater than transaction fee."
            // );
            Singleton.getInstance().showError(
              "Withdrawal amount should be greater than transaction fee."
            );
          } else if (
            parseFloat(this.props.amount) >
            parseFloat(this.state.selectedCoin?.withdraw_fee) +
              parseFloat(this.state.selectedCoin?.withdraw_limit_24h)
          ) {
            // Alert.alert(
            //   constants.APP_NAME_CAPS,
            //   "You can maximum withdraw upto " +
            //     (this.state.selectedCoin?.withdraw_limit_24h +
            //       " " +
            //       this.state.selectedCoin?.id?.toUpperCase())
            // );
            Singleton.getInstance().showError(
              `You can maximum withdraw upto ${
                this.state.selectedCoin?.withdraw_limit_24h
              } ${this.state.selectedCoin?.id?.toUpperCase()}`
            );
          } else {
            console.log("this.props.amount", this.props.amount);
            console.log(
              "this.state.selectedCoin.withdraw_fee",
              this.state.selectedCoin?.withdraw_fee
            );
            console.log(
              "this.props.amount-this.state.selectedCoin.withdraw_fee",
              this.props.amount - this.state.selectedCoin?.withdraw_fee
            );

            // Actions.WithdrawConfirmation({
            //   deposit: false,
            //   address: this.props.withdrawAddress,
            //   amt: this.props.amount,
            //   transFee: this.state.selectedCoin.withdraw_fee,
            //   coinType: this.state.selectedCoin,
            // });
            console.log("withBeniId=-=-=-", this.state.beniId);
            console.log("this.props?.amount=-=-=-", this.props?.amount);

            console.log("initialNetworkt=-=-we=-", this.state.selectedCoin?.id);
            let amount = this.props?.amount;
            let beneficiary_id = this.state.beniId;
            let currency = this.state.selectedCoin?.id;
            var resend_otp = false;
            this.setState({
              loader: true,
            });
            // this.props
            // ?.withdrawOtpExpireRequest()
            // .then((res) => {

            // })
            // .catch((err) => {
            //   Singleton.getInstance().showError(err);
            //   console.log(
            //     "withdrawOtpExpireRequest=-=error-",
            //     JSON.stringify(err)
            //   );
            //   this.setState({
            //     loader: false,
            //   });
            // });
            this.props
              ?.withdrawOtpSendRequest({
                amount,
                beneficiary_id,
                currency,
                resend_otp,
              })
              .then((res) => {
                console.log("withdrawOtpSendRequest=-=res-", res);
                Singleton.getInstance().showMsg("OTP sent on your email.");
                Actions.currentScene != "WithdrawConfirmation" &&
                  Actions.WithdrawConfirmation({
                    deposit: false,
                    address: this.props?.withdrawAddress,
                    amt: this.props?.amount,
                    transFee: this.state.selectedNetwork.withdraw_fee,
                    coinType: this.state.selectedCoin,
                    networkType: this.state.initialNetwork,
                  });
                this.setState({
                  loader: false,
                });
              })
              .catch((err) => {
                Singleton.getInstance().showError(err);
                this.setState({
                  loader: false,
                });
                console.log("withdrawOtpSendRequest=-=error-", err);
              });
          }
        })
        .catch((err) => {});
    } else {
      // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
      Singleton.getInstance().showError("KYC is not verified.");
    }
    // Singleton.getInstance()
    //   .getData(constants.USER_DATA)
    //   .then((res) => {
    //     let totalBalance = this.props?.balanceDetails?.balance;

    //     if (this.props?.amount?.length <= 0) {
    //       Singleton.getInstance().showError("Enter withdrawal amount");
    //     } else if (
    //       this.props.amount < this.state.selectedCoin.min_withdraw_amount
    //     ) {
    //       Singleton.getInstance().showError(
    //         "Minimum withdrawal amount is " +
    //           this.state.selectedCoin?.min_withdraw_amount
    //       );
    //     } else if (
    //       this.props.amount >
    //       parseFloat(this.state.selectedNetwork.withdraw_fee) +
    //         parseFloat(totalBalance)
    //     ) {
    //       Singleton.getInstance().showError("Insufficient balance");
    //     } else if (this.props.amount > totalBalance) {
    //       Singleton.getInstance().showError("Insufficient balance");
    //     } else if (
    //       parseFloat(this.state.selectedNetwork.withdraw_fee) >=
    //       this.props.amount
    //     ) {
    //       Singleton.getInstance().showError(
    //         "Withdrawal amount should be greater than transaction fee."
    //       );
    //     } else if (
    //       this.props.amount >
    //       parseFloat(this.state.selectedNetwork.withdraw_fee) +
    //         parseFloat(this.state.selectedCoin.withdraw_limit_24h)
    //     ) {
    //       Singleton.getInstance().showError(
    //         "You can maximum withdraw upto " +
    //           this.state.selectedCoin.withdraw_limit_24h +
    //           " " +
    //           this.state.selectedCoin.id.toUpperCase()
    //       );
    //     } else if (this.props.withdrawAddress.length < 10) {
    //       Singleton.getInstance().showError("Select a valid receiving address");
    //     } else {
    //       Actions.currentScene != "WithdrawConfirmation" &&
    //         Actions.WithdrawConfirmation({
    //           deposit: false,
    //           address: this.props?.withdrawAddress,
    //           amt: this.props?.amount,
    //           transFee: this.state.selectedNetwork.withdraw_fee,
    //           coinType: this.state.selectedCoin,
    //           networkType: this.state.initialNetwork,
    //         });
    //     }
    //   })
    //   .catch((err) => {});
  }

  renderBalance() {
    if (this.props?.balanceDetails != null) {
      let totalBalance = this.props?.balanceDetails?.balance;
      return (
        <Text style={styles.helpText}>
          Available balance: <Text>{totalBalance}</Text>
          {" " + this.state.selectedCoin.id.toUpperCase()}
        </Text>
      );
    }
  }
  renderError() {
    if (this.props?.currencyError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>
            {this.props?.currencyError}
          </Text>
        </View>
      );
    }
  }
  checkUserVerificationStatus = (res) => {
    // Singleton.getInstance()
    //   .getData(constants.USER_DATA)
    //   .then((res) => {
    // console.log("JSON.parse(res).otp--=-=", res);
    // console.log("JSON.parse(res).otp--1", JSON.parse(res).level);
    this.setState({
      userData: res,
    });
    if (res?.sumsub_applicants.length > 0) {
      // setIsProfileFilled(true);
      this.setState({
        isProfileFilled: true,
      });
      // console.log("user profile=-=isprofile");
    } else {
      // setIsProfileFilled(false);
      this.setState({
        isProfileFilled: false,
      });
      // console.log("user profile=-=gender>66");
    }
    if (res.otp === false) {
      this.setState({
        showTwoFaButton: true,
        checkLoader: false,
      });
    } else {
      this.setState({
        showTwoFaButton: false,
        checkLoader: false,
      });
    }
    try {
      // let confirmations = JSON.parse(res).labels.find(
      //   (item) => item.value === "verified" && item.key === "document"
      // );
      if (res?.level == 3) {
        this.setState({
          kycStatus: true,
          checkLoader: false,
        });
      } else {
        this.setState({
          kycStatus: false,
          checkLoader: false,
        });
      }

      // if (confirmations === undefined) {
      //   this.setState({
      //     kycStatus: false,
      //     checkLoader: false,
      //   });
      // } else if (confirmations?.value === "verified") {
      //   this.setState({
      //     // kycStatus: true,
      //     checkLoader: false,
      //   });
      // } else {
      //   this.setState({
      //     kycStatus: false,
      //     checkLoader: false,
      //   });
      // }
      this.setState({
        screenLoading: false,
      });
    } catch (err) {
      this.setState({
        screenLoading: false,
      });
    }
    // })
    // .catch((err) => {});
  };
  renderSumSub = (accessToken) => {
    // console.log("dsa======", accessToken);
    let apiUrl = "https://api.sumsub.com"; //'https://test-api.sumsub.com'; // or https://api.sumsub.com
    let flowName = "msdk-basic-kyc"; // or set up your own with the dashboard
    let snsMobileSDK = SNSMobileSDK.Builder(apiUrl)
      .withAccessToken(accessToken, () => {
        console.log("sumsub access token---->>", accessToken);
        return Singleton.getInstance()
          .getDataSecure(constants.ACCESS_TOKEN)
          .then((res) => {
            fetch(END_POINT.BASE_URL + END_POINT.GET_SUM_SUB_TOKEN, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                // Authorization: 'Bearer ' + res,
                Authorization: "Bearer " + res,
              },
            })
              .then((resp) => {
                // setLoader(false);
                this.setState({
                  loader: false,
                });
                // return a fresh token from here
                console.log("renderSumSub------resp-", resp);
                return resp.token;
              })
              .catch((err) => {
                console.log("renderSumSub=-=-=-=err", JSON.stringify(err));
              });
          });
      })
      .withHandlers({
        // Optional callbacks you can use to get notified of the corresponding events
        onStatusChanged: (event) => {
          console.log("event.newStatu=====-=", event.newStatus);
          if (event.newStatus === "Pending") {
            // setProfileCompleted(false);
            // setShowSumsub(false);
            this.setState({
              showSumsub: false,
              profileCompleted: false,
            });
            this.props.navigation.navigate("Profile");
            snsMobileSDK.dismiss();
            // onRefresh();

            // Actions.pop();
          }
        },
        onLog: (event) => {
          // console.log("onLog-=======------:", event.message);
          if (event.message.includes("SDK is prepared. Applicant - ")) {
            var applicantId = event.message.replace(
              "SDK is prepared. Applicant - ",
              ""
            );
            console.log("Sevent.message=========", event.message);

            console.log("Sd===========", applicantId);
            // dispatch(updateSumSubApplicantId(applicantId));
            this.props.updateSumSubApplicantId(applicantId);
          }
          if (
            event.message ==
            "Cancel verification with reason - SuccessTermination(reason=null)"
          ) {
            snsMobileSDK.dismiss();
            // setShowSumsub(false);
            this.setState({
              showSumsub: false,
            });
            // onRefresh();
            // Actions.pop();
          } else if (event.message == "IdensicMobileSDK dismissed") {
            // setShowSumsub(false);
            this.setState({
              showSumsub: false,
            });
          }
        },
        onEvent: (event) => {
          console.log("onEvent111: " + JSON.stringify(event));
        },
      })
      .withDebug(true)
      .withLocale("en") // Optional, for cases when you need to override system locale
      .build();

    snsMobileSDK
      .launch()
      .then((result) => {
        console.log("SumSub SDK State111: " + JSON.stringify(result));
        let close = JSON.stringify(result);
        if (close.status === "TemporarilyDeclined") {
          console.log("=-=-close.status=-=", close.status);
          snsMobileSDK.dismiss();
          // Actions.pop();
          // setProfileCompleted(false);
          // setShowSumsub(false);
          this.setState({
            showSumsub: false,
            profileCompleted: false,
          });
          // onRefresh();
        }
      })
      .catch((err) => {
        console.log("SumSub SDK Error011: ", err);
      });
  };
  handleKeyPress({ nativeEvent: { key: keyValue } }) {
    if (keyValue === "Backspace") {
      this.setState({ isBackspace: true });
    } else {
      this.setState({ isBackspace: false });
    }
  }
  getUsdPrice = (name) => {
    // let data = activeCoin?.activeCoinInfo?.find(value => value.id == name);
    // return data;
  };
  renderSpinner() {
    if (this.props.currencyDetailsLoading) {
      return (
        <View style={{ height: 40 }}>
          <Spinner />
        </View>
      );
    } else {
      let addArray = [];
      let addId = [];
      // debugger;
      nameJoin = [];
      for (let i = 0; i < this.props.allBenificiaries.length; i++) {
        if (
          this.props?.allBenificiaries[i]?.currency ==
          this.state.selectedCoin.id
        ) {
          if (
            this.props?.allBenificiaries[i]?.state != "pending" &&
            this.props?.allBenificiaries[i]?.blockchain_key ===
              this.state.initialNetwork
          ) {
            addArray.push({
              value: this.props?.allBenificiaries[i]?.data?.address,
            });
            addId.push({ value: this.props?.allBenificiaries[i]?.id });

            combineValue =
              this.props?.allBenificiaries[i]?.name +
              "(" +
              this.props?.allBenificiaries[i]?.blockchain_name
                .replace(" Testnet", "")
                .replace(" testnet", "")
                .replace(" Mainnet", "")
                .replace(" mainnet", "") +
              "):" +
              this.props?.allBenificiaries[i]?.data.address;
            nameJoin.push({
              label: combineValue,
              address: this.props?.allBenificiaries[i]?.data.address,
              name: this.props?.allBenificiaries[i]?.name,
              id: this.props?.allBenificiaries[i]?.id,
              coinType: this.props?.allBenificiaries[i]?.blockchain_name,
            });
          }
        }
      }

      return (
        <>
          <ButtonSelectCurrency
            styleDropDown={{
              backgroundColor: ThemeManager.colors.tabBackground,
            }}
            coinIcon={this.state.selectedCoin?.icon_url}
            coinName={this.state.selectedCoin?.name.toUpperCase()}
            coinSymbol={this.state.selectedCoin?.id.toUpperCase()}
            btnSelectCurrency={() => this.setModalVisible(true)}
          />
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              marginTop: 20,
              marginBottom: 5,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.inactiveTextColor,
              }}
            >
              {strings.spot.network}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                modalNetworkVisible: true,
              });
            }}
            style={{
              height: 50,
              marginTop: 5,
              backgroundColor: ThemeManager.colors.inputBackground,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.headerText,
                fontFamily: Fonts.regular,
                fontSize: 14,
                marginHorizontal: 10,
              }}
            >
              {this.state.initialNetwork.toUpperCase()}
            </Text>

            <Image
              source={{ uri: Images.icon_right_arrow }}
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginRight: 10,
              }}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: ThemeManager.colors.textColor5,
                marginBottom: 20,
              }}
            >
              Wallet Address
            </Text>
            {nameJoin.length > 0 ? (
              <TouchableOpacity
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                  // marginTop: 5,
                  flex: 1,
                  height: 50,
                  backgroundColor: ThemeManager.colors.tabBackground,
                  borderRadius: 6,
                }}
                onPress={() => {
                  this.setState({
                    isVisible: true,
                  });
                }}
              >
                <Text
                  style={{
                    color: this.state.selectedAddress
                      ? ThemeManager.colors.textColor1
                      : ThemeManager.colors.headerText,
                    marginRight: 5,
                    flex: 0.9,
                    marginLeft: 10,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {this.state.selectedAddress || "Please enter address"}
                </Text>
                <Image
                  // source={Images.icon_down}
                  source={{ uri: ThemeManager.ImageIcons.icon_dropdown }}
                  style={{
                    height: 15,
                    width: 15,
                    marginRight: 10,
                    resizeMode: "contain",
                    tintColor: ThemeManager.colors.textColor1,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                  // marginTop: 5,
                  flex: 1,
                  height: 50,
                  backgroundColor: ThemeManager.colors.tabBackground,
                  borderRadius: 6,
                }}
                onPress={() => {
                  this.props.navigation.navigate("AddWithdrawAddress", {
                    selectedCoin: this.state.selectedCoin,
                    selectedBlockchainKey: this.state.initialNetwork,
                  });
                }}
              >
                <Text
                  style={{
                    color: this.state.selectedAddress
                      ? ThemeManager.colors.textColor1
                      : ThemeManager.colors.inactiveTextColor,
                    marginRight: 5,
                    flex: 0.9,
                    marginLeft: 10,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {this.state.selectedAddress || "Please enter address"}
                </Text>
                <Image
                  // source={Images.icon_down}
                  source={{ uri: ThemeManager.ImageIcons.icon_dropdown }}
                  style={{
                    height: 15,
                    width: 15,
                    marginRight: 10,
                    resizeMode: "contain",
                    tintColor: ThemeManager.colors.textColor1,
                  }}
                />
              </TouchableOpacity>
            )}

            <OptionsModal
              listItemKeyName={"label"}
              dataList={nameJoin}
              modalVisible={this.state.isVisible}
              backgroundColor={ThemeManager.colors.SwapInput}
              textStyle={{ color: ThemeManager.colors.textColor1 }}
              onItemSelect={(item, index) => {
                console.log("item.id=-=-=-=", item);
                this.setState({
                  onItemSelect: item.name,
                  selectedAddress: item.address,
                });
                this.props.withdrawFormUpdate({
                  prop: "withdrawAddress",
                  value: item.address,
                });
                this.props.withdrawFormUpdate({
                  prop: "withBeniId",
                  value: item.id,
                });
                this.setState({
                  beniId: item.id,
                });
              }}
              onRequestClose={() => {
                this.setState({
                  isVisible: false,
                });
              }}
            />

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignSelf: "flex-end",
                position: "absolute",
                right: 0,
                top: 0,
              }}
              onPress={(res) =>
                this.props.navigation.navigate("AddWithdrawAddress", {
                  selectedCoin: this.state.selectedCoin,
                  selectedBlockchainKey: this.state.initialNetwork,
                })
              }
            >
              <Text
                style={[
                  styles.titleDepositLimt,
                  {
                    color: ThemeManager.colors.textColor1,
                    fontFamily: Fonts.medium,
                    fontSize: 14,
                    textDecorationLine: "none",
                    fontWeight: "500",
                  },
                ]}
              >
                {strings.withdraw_screen.manage_address}
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.showTwoFaButton ||
          !this.state.kycStatus ||
          this.state.isDocumentPending ? null : (
            <View style={{ marginTop: 10 }}>
              <InputVerification
                verifyLable={{
                  fontSize: 14,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textColor5,
                }}
                inputLabel={strings.withdraw_screen.amount}
                // onKeyPress={this.handleKeyPress.bind(this)}
                verifyInputStyle={{
                  // paddingTop: 5,
                  color: ThemeManager.colors.textColor1,
                }}
                placeHolder={
                  this.state.selectedNetwork != null
                    ? "Min. withdrawal " +
                      this.state.selectedNetwork.min_withdraw_amount +
                      " " +
                      this.state.selectedCoin.id.toUpperCase()
                    : "Min. withdrawal "
                }
                value={this.props.amount}
                keyboardStyle={"numeric"}
                returnKeyType={"done"}
                hideCounterBtns={{ top: 42 }}
                hideScan={{ display: "none" }}
                showButton={false}
                maxLength={15}
                maxTxt="MAX"
                maxOnPress={() => {
                  // Alert.alert(constants.APP_NAME_CAPS, "maxx")
                  Singleton.getInstance().showError("maxx");
                }}
                onChangeText={(text) => {
                  let overAllLimit = parseFloat(
                    this.props.fundsLimitInfo?.limits?.over_all_limit_in_usd
                  );

                  let totalTransaction = parseFloat(
                    this.props.fundsLimitInfo?.transactions?.total
                  );
                  let yearTransaction = parseFloat(
                    this.props.fundsLimitInfo?.transactions?.year
                  );
                  let dailyLimitUSD = parseFloat(
                    this.props.fundsLimitInfo?.limits?.daily_limit_in_usd
                  );
                  const countTransaction =
                    this.props.fundsLimitInfo?.transactions?.count;

                  let dayTransaction = parseFloat(
                    this.props.fundsLimitInfo?.transactions?.h24
                  );
                  console.log("overAllLimit=-=-=-=-=", overAllLimit);
                  console.log("yearTransaction=-=-=-=-=", yearTransaction);
                  console.log("dailyLimitUSD=-=-=-=-=", dailyLimitUSD);
                  console.log("dayTransaction=-=-=-=-=", dayTransaction);

                  if (/^\d*\.?\d*$/.test(text)) {
                    var value = text;
                    if (value == ".") {
                      value = "0.";
                    }
                    let val = parseFloat(this.state.usdRate) * parseFloat(text);
                    let totalAmount =
                      parseFloat(val) + parseFloat(yearTransaction);

                    let dailyLimit =
                      parseFloat(val) + parseFloat(dayTransaction);
                    // this.props.withdrawFormUpdate({ prop: "amount", value });
                    if (1 * dailyLimit > 1 * dailyLimitUSD) {
                      this.setState({
                        calculatedWithdraw: "0",
                      });
                      Singleton.getInstance().showError(
                        `You exceeded your daily limit of $${parseFloat(
                          this.props?.fundsLimitInfo?.limits?.daily_limit_in_usd
                        ).toFixed(2)}.`
                      );
                    } else {
                      if (1 * totalAmount > 1 * overAllLimit) {
                        Singleton.getInstance().showError("Limit exceeded.");
                      } else {
                        this.setState({
                          calculatedWithdraw: val,
                        });
                        // setWithdrawAmount(text);
                        this.props.withdrawFormUpdate({
                          prop: "amount",
                          value,
                        });
                      }
                    }
                  }
                }}
                // onChangeText={(text) => {
                //   let overAllLimit = parseFloat(
                //     this.props.fundsLimitInfo?.limits?.over_all_limit_in_usd
                //   );

                //   let totalTransaction = parseFloat(
                //     this.props.fundsLimitInfo?.transactions?.total
                //   );
                //   let yearTransaction = parseFloat(
                //     this.props.fundsLimitInfo?.transactions?.year
                //   );
                //   let dailyLimitUSD = parseFloat(
                //     this.props.fundsLimitInfo?.limits?.daily_limit_in_usd
                //   );
                //   const countTransaction =
                //     this.props.fundsLimitInfo?.transactions?.count;

                //   let dayTransaction = parseFloat(
                //     this.props.fundsLimitInfo?.transactions?.h24
                //   );

                //   let val = parseFloat(this.state.usdRate) * parseFloat(text);

                //   this.setState({
                //     calculatedWithdraw: val,
                //   });

                //   if (/^\d*\.?\d*$/.test(text)) {
                //     var value = text;
                //     if (value == ".") {
                //       value = "0.";
                //     }
                //     if (this.state.tierStatus == "tier_1") {
                //       // alert('tier1');
                //       let totalAmount =
                //         parseFloat(val) + parseFloat(totalTransaction);
                //       if (
                //         1 * totalAmount > 1 * overAllLimit ||
                //         countTransaction > 2
                //       ) {
                //         this.setState({
                //           calculatedWithdraw: "0",
                //         });
                //         Singleton.getInstance().showError(
                //           "Limit exceeded. Upgrade to KYC tier 2."
                //         );
                //       } else {
                //         this.props.withdrawFormUpdate({ prop: "amount", value });
                //       }
                //     } else if (this.state.tierStatus == "tier_2") {
                //       let totalAmount =
                //         parseFloat(val) + parseFloat(yearTransaction);
                //       if (1 * totalAmount > 1 * overAllLimit) {
                //         this.setState({
                //           calculatedWithdraw: "0",
                //         });
                //         Singleton.getInstance().showError(
                //           "Limit exceeded. Upgrade to KYC tier 3."
                //         );
                //       } else {
                //         this.props.withdrawFormUpdate({ prop: "amount", value });
                //       }
                //     } else if (this.state.tierStatus == "tier_3") {
                //       let totalAmount =
                //         parseFloat(val) + parseFloat(yearTransaction);

                //       let dailyLimit =
                //         parseFloat(val) + parseFloat(dayTransaction);

                //       if (1 * dailyLimit > 1 * dailyLimitUSD) {
                //         this.setState({
                //           calculatedWithdraw: "0",
                //         });
                //         Singleton.getInstance().showError(
                //           "Daily limit exceeded."
                //         );
                //       } else {
                //         if (1 * totalAmount > 1 * overAllLimit) {
                //           Singleton.getInstance().showError("Limit exceeded.");
                //         } else {
                //           // setWithdrawAmount(text);
                //           this.props.withdrawFormUpdate({
                //             prop: "amount",
                //             value,
                //           });
                //         }
                //       }
                //     }
                //   }
                // }}
              />
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor5,
                    fontSize: 10,
                    fontFamily: Fonts.regular,
                    marginVertical: 5,
                    // textAlign: 'right',
                  }}
                >
                  {strings.trade_tab.equals}
                  {": $"}
                  {this.state.calculatedWithdraw
                    ? parseFloat(this.state.calculatedWithdraw).toFixed(2)
                    : 0}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // marginTop: -20,
                }}
              >
                <Text
                  style={[
                    styles.helpText,
                    { color: ThemeManager.colors.textColor5 },
                  ]}
                >
                  {this.state.selectedNetwork != null
                    ? "Transaction fee: " +
                      this.state.selectedNetwork.withdraw_fee
                    : "Transaction fee: 0.00"}
                </Text>
              </View>
            </View>
          )}
        </>
      );
    }
  }

  renderFlatList() {
    if (this.props.coinList != null) {
      return (
        <FlatList
          data={this.props.coinList}
          renderItem={(item) => {
            return (
              <CurrencyType
                coinIcon={item.item.icon_url}
                CoinFullName={item.item.name}
                CoinShortName={item.item.id}
                BoldTitleStyle={{
                  color: ThemeManager.colors.cryptoAmountTextColor,
                }}
                buttonClicked={() => {
                  let value = item.item;

                  this.setState({ selectedCoin: value });
                  // this.props.setSelectedCoin({ prop: 'selectedCoin', value })
                  // this.props.getCoinAddressDetails({ value })
                  let coinName = value.id;
                  this.props.resetWithdrawalForm();
                  // this.props.getCurrencyDetails({ coinName })
                  // this.props.getBalanceDetails({ coinName })
                  this.getCurrBalanceDetails(coinName);
                  this.setModalVisible(false);
                }}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }
  }

  renderCoinAddress() {
    if (this.props.coinAddressLoading) {
      return (
        <View style={{ height: 40 }}>
          <Spinner />
        </View>
      );
    } else {
      return (
        <InputDark
          labelText={
            this.state.selectedCoin.id.toUpperCase() + " deposit address"
          }
          value={
            this.props.coinAddressInfo != null
              ? this.props.coinAddressInfo.address
              : ""
          }
          customLableStyle={styles.labelStyle}
          darkCustomStyle={styles.inputStyle}
          placeholderCustomStyle={ThemeManager.colors.selectedTextColor}
        />
      );
    }
  }
  onKycPress = () => {
    this.state.userData?.labels?.filter((item) => {
      if (item.value == "verified" && item.key == "document") {
        // setIsDocumentVerified(true);
        this.setState({
          isDocumentVerified: true,
        });
      } else if (item.value == "verified" && item.key == "profile") {
        // setIsProfile(true);
        this.setState({
          isProfile: true,
        });
      }
    });
    console.log("this.state.isProfileFilled-=-=", this.state.isProfileFilled);
    if (this.state.isProfileFilled) {
      this.setState({
        showSumsub: true,
      });
      // setShowSumsub(true);
    } else {
      // setShowSumsub(false);
      this.setState({
        showSumsub: false,
      });
      this.props.navigation.navigate("Verification");
    }
  };
  getSumSubDetails = () => {
    this.props
      .getSumSubToken()
      .then((res) => {
        console.log("RESPONSE--++---", res);
        //_act-b1bb0a12-1e3e-4c34-b2b6-2c036a5b0426
        this.renderSumSub(res.token);
      })
      .catch((err) => {
        console.log("ERR----", err);
      });
  };
  render() {
    let balance = 0;
    let totalBalance = 0.0;
    let lockedBalance = 0.0;
    if (this.props?.balanceDetails != null) {
      balance = this.props.balanceDetails;
      // console.log("balance=-=-=-=-=-=->>>", balance);
      totalBalance = this.props?.balanceDetails?.balance;
      lockedBalance = this.props?.balanceDetails?.locked;
    }
    // console.log(
    //   "this.props.currencyDetailsLoading-=-=>>",
    //   this.props.currencyDetailsLoading
    // );

    return (
      <>
        <Wrap
          style={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
          screenStyle={[
            styles.screenStyle,
            { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
          ]}
          bottomStyle={{
            backgroundColor: ThemeManager.colors.dashboardSubViewBg,
          }}
        >
          {this.state.showSumsub ? (
            <View>{this.getSumSubDetails()}</View>
          ) : (
            <View style={{ flex: 1 }}>
              <WalletHeader
                onBackPress={() => Actions.pop()}
                onHistoryPress={() => {
                  global.fromNotification = false;
                  Actions.currentScene != "HistoryWallet" &&
                    Actions.push("HistoryWallet");
                }}
              />
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: Fonts.medium,
                  color: ThemeManager.colors.textColor,
                  marginTop: 10,
                  marginLeft: 15,
                }}
              >
                {strings.spot.withdraw}{" "}
                {this.state.selectedCoin.id.toUpperCase()}
              </Text>
              {this.props?.balanceDetails == null && (
                <Loader isLoading={true} />
              )}
              <Loader
                isLoading={
                  this.props.currencyDetailsLoading || this.state.loader
                }
              />
              {this.props.currencyDetailsLoading === false && (
                <KeyboardAwareScrollView
                  bounces={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={{ paddingVertical: 5 }} />
                  <View style={[styles.middleBlock, { paddingVertical: 10 }]}>
                    <>
                      <View
                        style={{
                          backgroundColor: ThemeManager.colors.tabBackground,
                          padding: 15,
                          borderRadius: 6,
                        }}
                      >
                        <View style={styles.availStatusView}>
                          <Text style={styles.titleAvailStatus}>
                            {strings.withdraw_screen.available_balance}
                          </Text>
                          <Text
                            style={[
                              styles.titleAvailStatus,
                              {
                                textAlign: "right",
                                color:
                                  ThemeManager.colors.anouncementtextColour,
                              },
                            ]}
                          >
                            {this.props?.balanceDetails != null &&
                              balance?.balance +
                                " " +
                                balance?.currency?.toUpperCase()}
                          </Text>
                        </View>

                        <View style={styles.availStatusView}>
                          <Text style={styles.titleAvailStatus}>
                            {strings.withdraw_screen.in_order}
                          </Text>
                          <Text
                            style={[
                              styles.titleAvailStatus,
                              {
                                textAlign: "right",
                                color:
                                  ThemeManager.colors.anouncementtextColour,
                              },
                            ]}
                          >
                            {this.props?.balanceDetails != null &&
                              lockedBalance +
                                " " +
                                balance?.currency?.toUpperCase()}
                          </Text>
                        </View>

                        {/* <View style={styles.availStatusView}>
                      <Text style={styles.titleAvailStatus}>
                        {strings.withdraw_screen.total_balance}
                      </Text>
                      <Text
                        style={[
                          styles.titleAvailStatus,
                          {
                            textAlign: "right",
                            color: ThemeManager.colors.anouncementtextColour,
                          },
                        ]}
                      >
                        {this.props?.balanceDetails != null &&
                          Singleton.getInstance().ParseFloatNumberOnly(
                            totalBalance - lockedBalance,
                            8
                          ) +
                            " " +
                            balance?.currency?.toUpperCase()}
                      </Text>
                    </View> */}
                        {/* <View style={styles.availStatusView}>
                          <Text style={styles.titleAvailStatus}>
                            {strings.trade_tab.total_transactions}
                          </Text>
                          <Text
                            style={[
                              styles.titleAvailStatus,
                              {
                                textAlign: "right",
                                color:
                                  ThemeManager.colors.anouncementtextColour,
                              },
                            ]}
                          >
                            {"$"}
                            {this.props.fundsLimitInfo != null
                              ? Singleton.getInstance().ParseFloatNumberOnly(
                                  this.props.fundsLimitInfo?.transactions
                                    ?.total,
                                  4
                                )
                              : 0}
                          </Text>
                        </View>
                        <View style={styles.availStatusView}>
                          <Text style={styles.titleAvailStatus}>
                            {strings.trade_tab.total_limits}
                          </Text>
                          <Text
                            style={[
                              styles.titleAvailStatus,
                              {
                                textAlign: "right",
                                color:
                                  ThemeManager.colors.anouncementtextColour,
                              },
                            ]}
                          >
                            {"$"}
                            {this.props?.fundsLimitInfo != null
                              ? parseFloat(
                                  this.props?.fundsLimitInfo?.limits
                                    ?.over_all_limit_in_usd
                                ).toFixed(2)
                              : 0}
                          </Text>
                        </View>
                        <View style={styles.availStatusView}>
                          <Text style={styles.titleAvailStatus}>
                            {strings.trade_tab.total_daily_limits}
                          </Text>
                          <Text
                            style={[
                              styles.titleAvailStatus,
                              {
                                textAlign: "right",
                                color:
                                  ThemeManager.colors.anouncementtextColour,
                              },
                            ]}
                          >
                            {"$"}
                            {this.props?.fundsLimitInfo != null
                              ? parseFloat(
                                  this.props?.fundsLimitInfo?.limits
                                    ?.daily_limit_in_usd
                                ).toFixed(2)
                              : 0}
                          </Text>
                        </View>
                       */}
                      </View>
                    </>
                  </View>
                  <View
                    style={{
                      backgroundColor: ThemeManager.colors.lightdark,
                      paddingVertical: 5,
                    }}
                  />

                  <View style={styles.middleBlock}>
                    {this.renderError()}
                    {this.renderSpinner()}

                    {this.state.screenLoading == false &&
                      this.state.kycStatus === false && (
                        <View style={{ marginTop: 15, marginBottom: -15 }}>
                          <Text
                            style={[
                              styles.helpText,
                              {
                                fontSize: 14,
                                letterSpacing: -0.35,
                                color: "red",
                                marginBottom: 20,
                                // fontWeight: "bold",
                                fontFamily: Fonts.medium,
                              },
                            ]}
                          >
                            {
                              "Important: Please complete KYC and Phone verification for Withdrawal."
                            }
                          </Text>
                        </View>
                      )}

                    <View style={styles.helpTextBlock}>
                      <Text
                        style={[
                          styles.helpText,
                          {
                            fontSize: 14,
                            letterSpacing: -0.35,
                            color: ThemeManager.colors.inactiveTextColor,
                          },
                        ]}
                      >
                        {strings.withdraw_screen.with_only +
                          this.state.selectedCoin.id.toUpperCase() +
                          strings.withdraw_screen.address_sending}
                      </Text>
                    </View>
                    <View style={{ marginTop: 30 }} />
                    {this.state.showTwoFaButton ? (
                      <ButtonPrimary
                        style={{
                          marginTop: 8,
                          borderRadius: 6,
                          marginBottom: 30,
                        }}
                        title={"Enable 2FA"}
                        onPress={() => {
                          global.twoFaFromScreen = "WithdrawWallet";
                          Actions.currentScene !=
                            " GoogleAuthenticatorStep01" &&
                            Actions.GoogleAuthenticatorStep01();
                        }}
                      />
                    ) : (
                      <>
                        {this.state.kycStatus ? (
                          <View>
                            {this.state.loader ? (
                              <View style={{ height: 40 }}>
                                <Spinner />
                              </View>
                            ) : (
                              <ButtonPrimary
                                style={styles.btnBottomActive}
                                title={"Confirm"}
                                onPress={() => {
                                  this.submitButtonClicked();
                                }}
                              />
                            )}
                          </View>
                        ) : this.state.isDocumentPending ? (
                          <Button
                            disabled={true}
                            defaultBtn={styles.btnBottomActive}
                            defaultBtnText={{
                              color: "white",
                            }}
                            children="KYC IN PROGRESS"
                            onPress={() => {
                              // if (this.state.userData.level == 1) {
                              //   Actions.currentScene != 'EnterPhoneToVerify' &&
                              //     Actions.EnterPhoneToVerify();
                              // } else if (
                              //   this.state.userData.level == 2 &&
                              //   !this.state.isProfile &&
                              //   !this.state.isDocumentReject
                              // ) {
                              //   this.props.navigation.navigate('Verification');
                              // } else if (
                              //   this.state.userData.level == 2 &&
                              //   this.state.isDocumentReject
                              // ) {
                              //   this.props.navigation.navigate('Verification');
                              // }
                            }}
                          />
                        ) : (
                          <ButtonPrimary
                            style={styles.btnBottomActive}
                            title={"Submit KYC"}
                            onPress={() => {
                              // if (this.state.userData.level == 1) {
                              //   Actions.currentScene != "EnterPhoneToVerify" &&
                              //     Actions.EnterPhoneToVerify();
                              // } else if (
                              //   (this.state.userData.level == 2 ||
                              //     this.state.userData.level == 1) &&
                              //   !this.state.isProfile &&
                              //   !this.state.isDocumentReject
                              // ) {
                              //   this.props.navigation.navigate("Verification");
                              // } else if (
                              //   (this.state.userData.level == 2 ||
                              //     this.state.userData.level == 1) &&
                              //   this.state.isDocumentReject
                              // ) {
                              // this.props.navigation.navigate("Verification");
                              this.onKycPress();
                              // }
                            }}
                          />
                        )}
                      </>
                    )}
                  </View>

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                  >
                    <View style={styles.modelContainer}>
                      <TouchableOpacity
                        style={{ width: "100%", height: "100%" }}
                        onPress={() => this.setModalVisible(false)}
                      />
                      <View
                        style={[
                          styles.modelContainerChild,
                          { backgroundColor: ThemeManager.colors.lightdark },
                        ]}
                      >
                        <View style={styles.slideContainer}>
                          <Text
                            style={[
                              styles.titleCurrency,
                              {
                                color:
                                  ThemeManager.colors.cryptoAmountTextColor,
                              },
                            ]}
                          >
                            Select Currency
                          </Text>
                          <Text style={styles.subTitleCurrency}>
                            Select the cryptocurrency you want to buy or sell
                          </Text>
                          <View
                            style={{
                              width: "100%",
                              marginBottom: 15,
                              paddingLeft: 25,
                            }}
                          >
                            {this.renderFlatList()}
                          </View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </KeyboardAwareScrollView>
              )}
            </View>
          )}
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalNetworkVisible}
            onRequestClose={() => {
              this.setState({
                modalNetworkVisible: false,
              });
            }}
          >
            <Wrap
              darkMode={
                ThemeManager.colors.themeColor === "light" ? false : true
              }
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              screenStyle={[
                styles.screenStyle,
                { backgroundColor: "transparent" },
              ]}
              bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.setState({
                      modalNetworkVisible: false,
                    });
                  }}
                ></TouchableOpacity>
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.whiteScreen,

                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginHorizontal: 15,
                      marginVertical: 15,
                    }}
                  >
                    <View style={{ width: 40 }} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}
                    >
                      {strings.spot.choose_network}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          modalNetworkVisible: false,
                        });
                      }}
                    >
                      <Image
                        source={{ uri: Images.icon_cancel_light }}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginHorizontal: 10 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.inactiveTextColor,
                      }}
                    >
                      {strings.spot.ensure_the_network_withdrawal}
                    </Text>
                    <FlatList
                      data={this.state.networkList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ selectedNetwork: item });
                              this.setState({
                                initialNetwork: item?.blockchain_key,
                              });
                              this.setState({
                                modalNetworkVisible: false,
                                selectedAddress: "",
                              });
                            }}
                            style={{
                              height: 50,
                              marginTop: 5,
                              backgroundColor:
                                ThemeManager.colors.tabBackground,

                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                                color: ThemeManager.colors.textColor1,
                                marginLeft: 10,
                              }}
                            >
                              {item.blockchain_key.toUpperCase()}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      ListFooterComponent={() => {
                        return <View style={{ marginBottom: 20 }} />;
                      }}
                    />
                  </View>
                </View>
              </View>
            </Wrap>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.networkMessageModal}
          >
            <View style={styles.modelContainer}>
              <TouchableOpacity
                style={{ width: "100%", height: "100%" }}
                onPress={() =>
                  this.setState({
                    networkMessageModal: false,
                  })
                }
              />
              <View
                style={[
                  {
                    backgroundColor: ThemeManager.colors.DashboardBG,
                    marginHorizontal: 20,
                    borderRadius: 10,
                    padding: 14,
                  },
                ]}
              >
                <Text
                  style={{
                    color: ThemeManager.colors.textColor1,
                    fontSize: 24,
                    fontFamily: Fonts.bold,
                    alignSelf: "center",
                  }}
                >
                  Transfer Network
                </Text>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor1,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    alignSelf: "center",
                    marginVertical: 10,
                    textAlign: "center",
                  }}
                >
                  Please make sure that the currency is charged and withdrawn on
                  the same network, otherwise the currency withdrawal cannot be
                  successful. The different effects of the network are the rate,
                  the minimum amount of money withdrawn and the transfer time.
                </Text>
                <ButtonPrimary
                  style={{ marginTop: 8, borderRadius: 6 }}
                  title={"I Understand"}
                  onPress={() => {
                    this.setState({
                      networkMessageModal: false,
                    });
                  }}
                />
              </View>
              <TouchableOpacity
                style={{ width: "100%", height: "100%" }}
                onPress={() =>
                  this.setState({
                    networkMessageModal: false,
                  })
                }
              />
            </View>
          </Modal>
        </Wrap>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    currencyDetails,
    currencyError,
    currencyDetailsLoading,
    balanceDetails,
    withdrawAddress,
    amount,
    withBeniId,
  } = state.withDetails;
  const { fundsLimitInfo } = state.fundsLimitReducer;
  const { allBenificiaries, isLoadingBeni, beniError } =
    state.benificiaryReducer;

  return {
    currencyDetails,
    currencyError,
    currencyDetailsLoading,
    balanceDetails,
    withdrawAddress,
    amount,
    withBeniId,

    allBenificiaries,
    isLoadingBeni,
    beniError,
    fundsLimitInfo,
  };
};
export default connect(mapStateToProps, {
  getCurrencyDetails,
  getBalanceDetails,
  withdrawFormUpdate,
  resetWithdrawalForm,
  getAllBenificiary,
  getFundsLimit,
  getProfile1,
  deleteUserAccountAction,
  updateSumSubApplicantId,
  getSumSubToken,
  withdrawOtpSendRequest,
  withdrawOtpExpireRequest,
})(WithdrawWallet);
