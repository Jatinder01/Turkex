/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import styles from "./EnterPhoneToVerifyStyle";
import { colors, Fonts } from "../../../theme";
import { Images } from "../../../theme";
import fonts from "../../../theme/fonts";
const { height } = Dimensions.get("window");
import { connect, useDispatch, useSelector } from "react-redux";
import { Actions } from "react-native-router-flux";
import * as constants from "../../../Constants";

import {
  ButtonPrimary,
  Header,
  PhoneNumberInput,
  EnterVerificationCode,
  OtpInputs,
  Wrap,
} from "../../common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { ThemeManager } from "../../../../ThemeManager";
import { strings } from "../../../../Localization";
import { countryFlags } from "../../common/CountryFlags";
import { TextInput } from "react-native-gesture-handler";
import {
  mobileVerifyFormUpdate,
  submitOtpDetails,
  resetMobileVerifyForm,
  verifyMobileNumberWithOTP,
} from "../../../Redux/Actions";
import Singleton from "../../../Singleton";
import SimpleHeader from "../../common/SimpleHeader";
import BorderLine from "../../common/BorderLine";
const EnterPhoneToVerify = (props) => {
  // const accountDetails = useSelector(state => state.RegisterReducer);
  const { mobileVerifyError, mobilePhoneNO, mobileOtp } = useSelector(
    (state) => state.MobileVerifyReducer
  );
  const dispatch = useDispatch();
  const [sendCodeText, setsendCodeText] = useState("Send OTP");
  const [modalOTPVisible, setmodalOTPVisible] = useState(false);
  const [optEntered, setotpEntered] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("🇬🇧");
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United Kingdom");
  const [selectedCountryCode, setSelectedCountryCode] = useState("44");

  useEffect(() => {
    setotpEntered(false);
    return () => {
      dispatch(resetMobileVerifyForm());
    };
  }, [false]);

  const onSearch = (value) => {
    setCountryData(
      searchData.filter(
        (i) =>
          i.countryNameEn.toLowerCase().includes(value.toLowerCase()) ||
          i.countryCallingCode.toLowerCase().includes(value.toLowerCase()) ||
          i?.countryCallingCode
            ?.toLowerCase()
            .includes(value.replace("+", "").toLowerCase())
      )
    );
  };
  const renderError = () => {
    if (mobileVerifyError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>{mobileVerifyError}</Text>
        </View>
      );
    }
  };
  const resentOTP = () => {
    buttonPress();
  };
  const confirmOTP = () => {
    if (mobilePhoneNO?.length < 5) {
      // Alert.alert(constants.APP_NAME, 'Please enter a valid phone number');
      Singleton.getInstance().showError("Please enter a valid phone number");
    } else if (mobileOtp?.length < 5) {
      // Alert.alert(constants.APP_NAME, 'Please resend OTP and then enter OTP');
      Singleton.getInstance().showError("Please resend OTP and then enter OTP");
      // props.mobileVerifyFormUpdate({
      //   prop: 'mobileOtp',
      //   value: '',
      // });
      dispatch(
        mobileVerifyFormUpdate({
          prop: "mobileOtp",
          value: "",
        })
      );
    } else {
      let param = {
        mobilePhoneCode: selectedCountryCode,
        mobilePhoneNO: mobilePhoneNO,
        mobileOtp: mobileOtp,
      };
      Singleton.getInstance().saveData(
        constants.PHONE_VERIFY_STEP,
        JSON.stringify(param)
      );

      dispatch(
        verifyMobileNumberWithOTP({
          mobilePhoneCode: selectedCountryCode,
          mobilePhoneNO: mobilePhoneNO,
          mobileOtp: mobileOtp,
        })
      );
    }
  };
  const buttonPress = () => {
    // const {mobilePhoneCode, mobilePhoneNO} = MobileVerifyReducer;
    if (mobilePhoneNO?.length <= 5) {
      Singleton.getInstance().showError("Please enter a valid phone number");
    } else {
      let isResend = sendCodeText == "RESEND OTP" ? true : false;
      dispatch(
        submitOtpDetails({
          mobilePhoneCode: selectedCountryCode,
          mobilePhoneNO: mobilePhoneNO,
          isResend,
        })
      )
        .then((res) => {
          setmodalOTPVisible(true);
          setsendCodeText("RESEND OTP");
        })
        .catch((error) => {
          if (error == "Phone number already exists") {
            let isResend = true;
            dispatch(
              submitOtpDetails({
                mobilePhoneCode,
                mobilePhoneNO,
                isResend,
              })
            )
              .then((res) => {
                setmodalOTPVisible(true);
                setsendCodeText("RESEND OTP");
              })
              .catch((error) => {
                setmodalOTPVisible(false);
                //  this.setModalOTPVisible(false)
              });
          } else if (error == "Phone number is invalid") {
            setmodalOTPVisible(false);
          }
          //
        });
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
        justifyContent: "space-between",
      }}
    >
      <View style={{ marginHorizontal: 16, marginVertical: 10, height: 40 }}>
        <SimpleHeader
          titleName={strings.SMSVerification}
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          // titleName={'kjjkh'}
          titleStyle={{
            fontSize: 18,
            fontFamily: Fonts.medium,
            color: ThemeManager.colors.textColor1,
            // marginLeft: 10,
          }}
          onBackPress={() => {
            Actions.pop();
            dispatch(
              mobileVerifyFormUpdate({
                prop: "mobileVerifyError",
                value: "",
              })
            );
            //   setShowConvertModal(false);
          }}
        />
      </View>

      {/* <Header
        mainView={{marginHorizontal: 16}}
        customCenterTitle={{fontSize: 18}}
        leftImage={{uri: Images.icon_back}}
        titleCenter={strings.SMSVerification}
        btnTextLeft=" "
        btnTextRight=" "
        leftButtonClicked={() => {
          Actions.pop();
          dispatch(
            mobileVerifyFormUpdate({
              prop: 'mobileVerifyError',
              value: '',
            }),
          );
        }}
      /> */}
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          <Text style={styles.title}>{strings.SMSVerificationTitle}</Text>
          <Text
            style={[
              styles.inputTitle,
              { color: ThemeManager.colors.textColor1 },
            ]}
          >
            Mobile
          </Text>
          <View
            style={[
              styles.veriFormMiddle,
              {
                backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
                marginHorizontal: 15,
              },
            ]}
          >
            <PhoneNumberInput
              verifyLable={styles.notShow}
              codeTextStyle={{ color: ThemeManager.colors.textColor1 }}
              placeHolder="Mobile Number"
              countryCodeText={selectedCountryCode}
              customStyle={{
                backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
              }}
              verifyInputStyle={{
                color: ThemeManager.colors.textColor1,
              }}
              // placeHolderTextColor={'white'}
              placeHolderTextColor={ThemeManager.colors.inactiveTextColor}
              maxLength={15}
              flag={selectedCountryFlag}
              countryCodeClicked={() => {
                setModalVisible(true);
              }}
              onChangeText={(value) => {
                let extraSpaceRegex = /^\s*\s*$/;
                setsendCodeText("Send");
                dispatch(
                  mobileVerifyFormUpdate({
                    prop: "mobilePhoneNO",
                    value,
                  })
                );
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {renderError()}
      {optEntered ? (
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <ButtonPrimary
            style={{
              width: "42%",
              backgroundColor: ThemeManager.colors.tabBackground,
            }}
            title={"Resend OTP"}
            textstyle={{ color: ThemeManager.colors.textColor1 }}
            onPress={() => {
              resentOTP();
              // setmodalOTPVisible(true);
            }}
          />
          <ButtonPrimary
            style={{ width: "42%" }}
            title={"Confirm"}
            onPress={() => {
              confirmOTP();
            }}
          />
        </View>
      ) : (
        <ButtonPrimary
          style={{ marginBottom: 20 }}
          title={strings.SendOTP}
          onPress={() => {
            // setmodalOTPVisible(true);
            buttonPress();
          }}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOTPVisible}
        onRequestClose={() => setmodalOTPVisible(false)}
      >
        <View style={styles.modelContainer}>
          <TouchableOpacity
            style={{ width: "100%", height: "100%" }}
            onPress={() => setmodalOTPVisible(false)}
          />
          <View
            style={[
              styles.modelContainerChildOTP,
              { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
            ]}
          >
            <View>
              <EnterVerificationCode phoneNo={props.mobilePhoneNO} />
              <OtpInputs
                colNo={5}
                gridStyle={{ width: 60, height: 60 }}
                otpStyle={styles.otpInput}
                dismissKeyboard={modalOTPVisible ? false : true}
                getOtp={(otp) => {
                  if (otp?.length >= 5) {
                    let value = otp;
                    setotpEntered(true);
                    dispatch(
                      mobileVerifyFormUpdate({
                        prop: "mobileOtp",
                        value,
                      })
                    );
                    setmodalOTPVisible(false);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: ThemeManager.colors.modalBox }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: ThemeManager.colors.modalBox,
              flex: 1,
              // justifyContent: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <View>
                <View style={styles.searchContainer}>
                  <View style={styles.searchView}>
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_search_text }}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      value={searchData}
                      onChangeText={onSearch}
                      style={{
                        width: "80%",
                        color: ThemeManager.colors.textColor1,
                      }}
                      placeholder={strings.currencyDetails.search}
                      placeholderTextColor={
                        ThemeManager.colors.inactiveTextColor
                      }
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      // style={{flex: 0.3}}
                      onPress={() => {
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.cancelText}>
                        {strings.currencyDetails.cancel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ marginHorizontal: 15 }}>
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                    marginBottom: 5,
                  }}
                >
                  {strings.location.location}
                </Text>
                <BorderLine />
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.selectedTextColor,
                  }}
                >
                  {selectedCountry}
                </Text>
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                    marginBottom: 5,
                  }}
                >
                  {strings.location.countryRegion}
                </Text>
                <BorderLine />
                <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
                  {countryData.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                          flexDirection: "row",
                          marginBottom: 3,
                        }}
                        onPress={() => {
                          var phoneCode = item.countryCallingCode;
                          setSelectedCountry(item.countryNameEn);
                          setSelectedCountryFlag(item.flag);
                          setSelectedCountryCode(item.countryCallingCode);
                          setModalVisible(false);
                        }}
                      >
                        <View style={{ borderRadius: 15, marginRight: 10 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              marginTop: 10,
                              color: ThemeManager.colors.headTxt,
                            }}
                          >
                            {item.flag}
                          </Text>
                        </View>
                        <Text
                          style={{
                            marginTop: 15,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                            color: ThemeManager.colors.locationText,
                          }}
                        >
                          {item.countryNameEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <View>
                    {countryData?.length == 0 && (
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 16,
                          fontFamily: Fonts.medium,
                          marginTop: 60,
                          textAlign: "center",
                        }}
                      >
                        Country not found
                      </Text>
                    )}
                  </View>
                  <View style={{ height: 40 }}></View>
                </ScrollView>
                {/* <FlatList
                  keyboardShouldPersistTaps={"handled"}
                  style={styles.countryList}
                  data={countryData}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        var phoneCode = item.countryCallingCode;
                        setSelectedCountry(item.countryNameEn);
                        setSelectedCountryFlag(item.flag);
                        setSelectedCountryCode(item.countryCallingCode);
                        setModalVisible(false);
                      }}
                    >
                      <View style={{ borderRadius: 15, marginRight: 10 }}>
                        <Text style={{ fontSize: 16, marginTop: 10 }}>
                          {item.flag}
                        </Text>
                      </View>
                      <Text
                        style={{
                          marginTop: 15,
                          fontSize: 16,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.textColor1,
                        }}
                      >
                        {item.countryNameEn}
                      </Text>
                    </TouchableOpacity>
                  )}
                  scrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                  // extraData={this.props.selected}
                /> */}
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default EnterPhoneToVerify;
