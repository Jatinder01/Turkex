import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity as TouchableOpacityNative,
  Keyboard,
} from "react-native";
import useStyles from "./DeletionReasonStyle";
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, Header, InputVerification, Loader } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { strings } from "../../../../Localization";
import { string } from "prop-types";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";
import SimpleHeader from "../../common/SimpleHeader";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserAccountAction,
  fundsUser,
  logoutUser,
} from "../../../Redux/Actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

const DeletionReason = (props) => {
  const [isSelectedMode, setSelectedMode] = useState(" ");

  const styles = useStyles(ThemeManager);
  const [optionSelected, setOptionSelected] = useState(-1);
  const [userData, setuserData] = useState({});
  const [check2fa, setCheck2fa] = useState(false);
  const [kycPending, setKycPending] = useState(true);
  const [kycStatus, setKycStatus] = useState(null);
  const [isProfileFilled, setIsProfileFilled] = useState(false);
  const [balanceStatus, setBalanceStatus] = useState(false);
  // const [check2fa, setCheck2fa] = useState(false);
  const [code_2fa, setCode_2fa] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorRemove, setErrorRemove] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const { fundsUserDetails, coinToUsdData } = useSelector(
    (state) => state.FundsReducer
  );
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const [Dis, setDis] = useState("");
  useEffect(() => {
    dispatch(fundsUser(true))
      .then((res) => {
        let coinToDollar = 0;
        // console.log("res=-=-=-=-=-=res-", res);
        // Actions.pop();
        // fundsUserDetails &&
        res?.map((item, index) => {
          // console.log("res=-=-=-=-=-=item.id-", item.id);
          // console.log("res=-coinToUsdData-", coinToUsdData);
          let price = coinToUsdData[item.id.toUpperCase()];
          // console.log("res=-=-=-=-=-=price-", price);
          item.usdPrice = price ? price.USD : 1;
          // console.log("res=-=-=-=-=-=price-cal-", item.usdPrice);
          // console.log(
          //   "res=-=-=-=-=-=price-bal-",
          //   parseFloat(item.balance.balance)
          // );

          coinToDollar +=
            parseFloat(item.balance.balance) * parseFloat(item.usdPrice);
          // console.log("coinToDollar=-=-=-=-=-=-eee", coinToDollar);
        });
        // console.log("coinToDollar=-=-=-=-=-=-", coinToDollar);
        setTotalBalance(coinToDollar);
        if (parseFloat(coinToDollar) < 20) {
          setBalanceStatus(false);
        } else {
          setBalanceStatus(true);
        }
        setLoader(false);
      })
      .catch((err) => {
        console.log("fundsUser=-=err=-", err);
      });
    getProfileInfo();
    themeStatus();
  }, []);
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

  const getProfileInfo = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then(async (res) => {
        setuserData(JSON.parse(res));
        let userData = JSON.parse(res);
        if (JSON.parse(res)?.otp) {
          setCheck2fa(true);
        } else {
          setCheck2fa(false);
        }
      })
      .catch((err) => {
        console.log("----value- err-->", err);
      });
  };

  const onDeleteAccountPress = () => {
    if (check2fa === false) {
      alert("Please enable 2FA");
    } else {
      console.log("coinToDollar total balance=-=-", totalBalance);
      console.log("coinToDollar total balance=-=-check", totalBalance > 20);

      if (balanceStatus) {
        // if (totalBalance > 20) {
        Alert.alert(
          constants.APP_NAME_CAPS,
          strings.Profile.you_have_balance,
          [
            {
              text: "OK",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          constants.APP_NAME_CAPS,
          strings.Profile.are_you_sure,
          [
            {
              text: strings.spot.yes,
              onPress: () => {
                // dispatch(deleteUserAccountAction(userData?.uid, ""));
                setModalVisible(true);
              },
            },
            {
              text: strings.spot.no,
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    }
  };
  const deleteBtnClick = () => {
    setErrorRemove("");
    if (code_2fa?.length < 5 || code_2fa?.length > 6) {
      // Singleton.getInstance().showError(
      //   strings.add_beneficiary.please_enter_valid_pin
      // );
      setErrorRemove(strings.add_beneficiary.please_enter_valid_pin);
    } else {
      setLoading(true);
      console.log("chcek response=-=-=-=->>>userData?.uid", userData?.uid);
      console.log("chcek response=-=-=-=->>>code_2fa", code_2fa);

      dispatch(deleteUserAccountAction(userData?.uid, code_2fa))
        .then((res) => {
          console.log("chcek response=-=-=-=->>>", res);
          setCode_2fa("");
          setLoading(false);
          // setModalVisible(false);
          dispatch(logoutUser());
          Singleton.getInstance().showMsg("Account deleted successfully.");
        })
        .catch((err) => {
          console.log("chcek response=-=-=-=->>>err", err);
          setCode_2fa("");
          setLoading(false);
          // setModalVisible(false);
          setErrorRemove(err);
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
      <Loader isLoading={loader} />
      <View>
        <View style={{ marginHorizontal: 15, marginVertical: 10, height: 45 }}>
          <SimpleHeader
            titleName={""}
            // backImageColor={{tintColor: ThemeManager.colors.headTxt}}
            onBackPress={() => {
              Actions.pop();
            }}
          />
        </View>

        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text
            style={{
              marginHorizontal: 16,
              fontFamily: Fonts.medium,
              fontSize: 26,
              color: ThemeManager.colors.textColor1,
            }}
          >
            Deletion Reason
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setOptionSelected(0);
            }}
          >
            <View
              style={{
                backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                paddingHorizontal: 20,
                marginTop: 22,
                marginHorizontal: 16,
                height: 55,
                borderRadius: 6,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                No longer want to use this account
              </Text>
              <View
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 9,
                  backgroundColor:
                    optionSelected == 0 ? "#347899" : "transparent",

                  borderWidth: 1,
                  borderColor: optionSelected == 0 ? "#2EC7EB" : "#A1A1A1",
                }}
              />
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setOptionSelected(1);
            }}
          >
            <View
              style={{
                backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                paddingHorizontal: 20,
                marginTop: 22,
                marginHorizontal: 16,
                height: 55,
                borderRadius: 6,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                Merge multiple account
              </Text>
              <View
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 9,
                  borderWidth: 1,
                  backgroundColor:
                    optionSelected == 1 ? "#347899" : "transparent",

                  borderColor: optionSelected == 1 ? "#2EC7EB" : "#A1A1A1",
                }}
              />
            </View>
          </TouchableOpacity> */}

          <Text
            style={{
              marginHorizontal: 16,
              fontFamily: Fonts.regular,
              fontSize: 14,
              color: ThemeManager.colors.textColor1,
              marginTop: 20,
            }}
          >
            Others
          </Text>
          {optionSelected == 2 ? (
            <View
              style={{
                backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                paddingHorizontal: 20,
                marginTop: 6,
                marginHorizontal: 16,
                height: 180,
                borderRadius: 6,
                justifyContent: "space-between",
                // alignItems: "center",
                marginTop: 19,
                flexDirection: "row",
              }}
            >
              <TextInput
                editable={optionSelected == 2 ? true : false}
                placeholder={"Enter description"}
                value={Dis}
                multiline={true}
                onChangeText={(value) => {
                  if (constants.NAME_REGEX.test(value)) {
                    setDis(value);
                  }
                }}
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 14,
                  width: "90%",
                  // backgroundColor: "red",
                  textAlign: "justify",
                  textAlignVertical: "top",
                  paddingTop: 14,
                }}
                maxLength={150}
                autoCorrect={false}
                placeholderTextColor={ThemeManager.colors.inactiveTextColor}
                returnKeyType={"done"}
                blurOnSubmit={false}
              />
              <View
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 9,
                  borderWidth: 1,
                  marginTop: 19,
                  backgroundColor:
                    optionSelected == 2 ? "#347899" : "transparent",
                  borderColor: optionSelected == 2 ? "#2EC7EB" : "#A1A1A1",
                }}
              />
              <View style={{ position: "absolute", bottom: 10, right: 10 }}>
                <Text
                  style={{
                    color: ThemeManager.colors.inactiveTextColor,
                    fontSize: 12,
                    fontFamily: Fonts.regular,
                  }}
                >
                  Max Character Limit: 150
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOptionSelected(2);
              }}
            >
              <View
                style={{
                  backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                  paddingHorizontal: 20,
                  marginTop: 22,
                  marginHorizontal: 16,
                  height: 55,
                  borderRadius: 6,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                    color: ThemeManager.colors.inactiveTextColor,
                    // marginRight: 10,
                    width: "80%",
                  }}
                >
                  {/* {"Enter text"} */}
                  {Dis
                    ? Dis?.length > 30
                      ? `${Dis.substring(0, 30)}...`
                      : Dis
                    : `Enter description`}
                </Text>
                <View
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 9,
                    borderWidth: 1,
                    backgroundColor:
                      optionSelected == 1 ? "#347899" : "transparent",
                    borderColor: optionSelected == 2 ? "#2EC7EB" : "#A1A1A1",
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        </KeyboardAwareScrollView>
      </View>
      <ButtonPrimary
        title={"Delete Account"}
        onPress={() => {
          console.log("23123-------->>>", optionSelected);
          console.log("Dis.length=-=-=-=-=", Dis?.length);
          if (optionSelected < 0) {
            Singleton.getInstance().showWarn(
              "Please select reason for deleting the account."
            );
            // showMessage({
            //   message: "Please select reason for deleting the account.",
            //   backgroundColor: ThemeManager.colors.tabBottomBorder,
            //   autoHide: true,
            //   duration: 3000,
            //   type: "error",
            // });
            return;
          } else if (optionSelected == 2 && Dis?.length == 0) {
            Singleton.getInstance().showWarn("Please enter description.");
            // showMessage({
            //   message: "Please enter description.",
            //   backgroundColor: ThemeManager.colors.tabBottomBorder,
            //   autoHide: true,
            //   duration: 3000,
            //   type: "error",
            // });
            return;
          } else {
            onDeleteAccountPress();
          }
        }}
        style={{ bottom: 20 }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setErrorRemove("");
        }}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={styles.backgroundView}
          screenStyle={[styles.screenStyle, styles.backgroundView]}
          bottomStyle={styles.backgroundView}
        >
          <Loader isLoading={loading} />
          <View style={{ flex: 1 }}>
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacityNative
                style={{ marginRight: 15, marginTop: 15 }}
                onPress={() => {
                  // alert('hello');
                  setModalVisible(false);
                  setErrorRemove("");

                  setCode_2fa("");
                  setLoading(false);
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                  style={{ height: 25, width: 25, resizeMode: "contain" }}
                />
              </TouchableOpacityNative>
            </View>
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {balanceStatus ? (
                <View>
                  <Text style={styles.headerDeleteText}>
                    {strings.Profile.delete_account}
                  </Text>
                  <Text style={styles.beforeDeleteText}>
                    {strings.Profile.before_you_delete}
                  </Text>
                  <View style={styles.viewModal}>
                    <Text style={styles.totalBalanceText}>
                      {strings.Profile.the_total_balance}
                    </Text>
                  </View>
                  <Text style={styles.accountDeleteText}>
                    {strings.Profile.account_deletion}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.enterText}>
                    {strings.Profile.please_enter_the_2fa}
                  </Text>

                  <View style={{ marginTop: 30 }}>
                    <View style={{ marginHorizontal: 15 }}>
                      <InputVerification
                        verifyLable={{ color: ThemeManager.colors.textColor5 }}
                        inputLabel={strings.spot.enter_2fa_code}
                        editable={true}
                        verifyInputStyle={{
                          color: ThemeManager.colors.textColor1,
                          backgroundColor: ThemeManager.colors.tabBackground,
                        }}
                        placeHolder={`EG. "303454"`}
                        value={code_2fa}
                        onChangeText={(value) => {
                          // setOtp(value);
                          if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                            setCode_2fa(value);
                          }
                        }}
                        maxLength={6}
                        keyboardStyle={"numeric"}
                        returnKeyType={"done"}
                      />
                    </View>
                    {errorRemove ? (
                      <View>
                        <Text style={styles.errorMessageStyle}>
                          {errorRemove}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.errorMessageStyle}> </Text>
                      </View>
                    )}
                    <View style={{ marginTop: 30 }}>
                      <ButtonPrimary
                        style={styles.btnBottom}
                        title={strings.Profile.delete_account}
                        onPress={deleteBtnClick}
                      />
                    </View>
                  </View>
                  <Text style={styles.looseText}>
                    {strings.Profile.what_you_loose}
                  </Text>
                  <Text style={styles.accessText}>
                    {strings.Profile.access_to}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.kyc_and_platform}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.trading_data}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.any_available_balance}
                  </Text>
                  <Text style={styles.textModalStyle}>
                    {strings.Profile.app_preferences}
                  </Text>
                </View>
              )}
            </KeyboardAwareScrollView>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};
export default DeletionReason;
