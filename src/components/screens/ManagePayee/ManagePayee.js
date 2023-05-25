/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Actions } from "react-native-router-flux";

import { Colors, Fonts, Images } from "../../../theme";
import styles from "./ManagePayeeStyle";

import { useDispatch, useSelector } from "react-redux";
import { ThemeManager } from "../../../../ThemeManager";
import {
  ButtonPrimary,
  InputField,
  Wrap,
  Loader,
  Button,
  InputVerification,
} from "../../common";
import { strings } from "../../../../Localization";
import SimpleHeader from "../../common/SimpleHeader";
import {
  beneficiaryFiatFormUpdate,
  addNewBeneficiaryFiat,
  getAllBeneficiaryFiat,
  deleteBeneficiaryFiat,
  activateBeneficiaryFiat,
  resendPinCodeBenificiaryFiat,
} from "../../../Redux/Actions";
import { showMessage, hideMessage } from "react-native-flash-message";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import * as constants from "../../../Constants";
import Singleton from "../../../Singleton";
const ManagePayee = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [coinArray, setCoinArray] = useState([]);
  const [code_2fa, setCode_2fa] = useState("");
  const [beniId, setBeniId] = useState("");
  const [errorRemove, setErrorRemove] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const deleteBankAccountReducer = useSelector(
    (state) => state?.deleteBankAccountReducer
  );
  const addBankCardReducer = useSelector((state) => state?.addBankCardReducer);
  const withdrawFiatBeneficiaryReducer = useSelector(
    (state) => state?.withdrawFiatBeneficiaryReducer
  );

  useEffect(() => {
    props.navigation.addListener("didFocus", async (event) => {
      dispatch(getAllBeneficiaryFiat(props.currency));
    });
  }, []);

  const modalClose = () => {
    dispatch(
      beneficiaryFiatFormUpdate({
        prop: "beniNameFiat",
        value: "",
      })
    );
    dispatch(
      beneficiaryFiatFormUpdate({
        prop: "beniAccountNo",
        value: "",
      })
    );
    dispatch(
      beneficiaryFiatFormUpdate({
        prop: "beniBankCode",
        value: "",
      })
    );

    dispatch(
      beneficiaryFiatFormUpdate({
        prop: "error",
        value: "",
      })
    );
  };
  const onButtonPress = () => {
    const reg = constants.STRING_WITHOUT_SPECIAL_CHARACTER;

    if (!withdrawFiatBeneficiaryReducer?.beniNameFiat) {
      dispatch(
        beneficiaryFiatFormUpdate({
          prop: "error",
          value: strings.trade_tab.full_name_required,
        })
      );
    } else if (!withdrawFiatBeneficiaryReducer?.beniAccountNo) {
      dispatch(
        beneficiaryFiatFormUpdate({
          prop: "error",
          value: strings.trade_tab.account_number_required,
        })
      );
    } else if (!withdrawFiatBeneficiaryReducer?.beniBankCode) {
      dispatch(
        beneficiaryFiatFormUpdate({
          prop: "error",
          value: strings.trade_tab.bank_code_required,
        })
      );
    } else {
      dispatch(
        addNewBeneficiaryFiat(
          props.currency,
          withdrawFiatBeneficiaryReducer?.beniNameFiat,
          withdrawFiatBeneficiaryReducer?.beniAccountNo,
          withdrawFiatBeneficiaryReducer?.beniBankCode
        )
      ).then((res) => {
        modalClose();

        dispatch(getAllBeneficiaryFiat(props.currency));
        setIsModalVisible(false);
      });
    }
  };

  const onRemoveAccount = (id) => {
    setModalVisible(true);
  };
  const renderError = () => {
    if (withdrawFiatBeneficiaryReducer?.error) {
      return (
        <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
          <Text style={styles.errorMessageStyle}>
            {withdrawFiatBeneficiaryReducer?.error}
          </Text>
        </View>
      );
    }
    // }
  };
  const renderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          backgroundColor: ThemeManager.colors.tabBackground,
          width: "95%",
          alignSelf: "center",
          margin: 5,
          borderRadius: 8,
          padding: 5,
        }}
      >
        <View
          style={{
            padding: 5,
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.anouncementtextColour,
                fontSize: 16,
                fontFamily: Fonts.bold,
                flex: 1,
              }}
            >
              {strings.trade_tab.full_name}{" "}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  textTransform: "capitalize",
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              opacity: 0.1,
              marginVertical: 2,
              backgroundColor: ThemeManager.colors.anouncementtextColour,
              width: "100%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.anouncementtextColour,
                fontSize: 16,
                fontFamily: Fonts.bold,
                flex: 1,
              }}
            >
              {strings.trade_tab.account_number}{" "}
            </Text>
            <View
              style={{
                alignItems: "flex-end",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                }}
              >
                {item.data.address}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              opacity: 0.1,
              marginVertical: 2,
              backgroundColor: ThemeManager.colors.anouncementtextColour,
              width: "100%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.anouncementtextColour,
                fontSize: 16,
                fontFamily: Fonts.bold,
                flex: 1,
              }}
            >
              {strings.trade_tab.bank_code}{" "}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  flex: 1,
                }}
              >
                {item.data.bic}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.anouncementtextColour,
                fontSize: 16,
                fontFamily: Fonts.bold,
                flex: 1,
              }}
            >
              {strings.trade_tab.state}{" "}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  flex: 1,
                  textTransform: "capitalize",
                }}
              >
                {item.state}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            marginRight: 5,
            marginVertical: 10,
          }}
        >
          {item.state != "verified" &&
            item.state != "rejected" &&
            item.state != "active" && (
              <TouchableOpacity
                onPress={() => {
                  showDialog(true);
                  setBeniId(item.id);
                }}
                style={{
                  backgroundColor: ThemeManager.colors.textGreenColor,
                  height: 30,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: ThemeManager.colors.textColor,
                    paddingHorizontal: 10,
                  }}
                >
                  {strings.trade_tab.activate}
                </Text>
              </TouchableOpacity>
            )}
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                constants.APP_NAME_CAPS,
                strings.trade_tab.are_you_really,
                [
                  {
                    text: strings.spot.yes,
                    onPress: () => {
                      setBeniId(item.id);
                      onRemoveAccount(item.id);
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
            }}
            style={{
              backgroundColor: ThemeManager.colors.textRedColor,
              height: 30,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: ThemeManager.colors.textColor,
                paddingHorizontal: 10,
              }}
            >
              {strings.trade_tab.remove}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const showDialog = (value) => {
    setPinCode("");
    setIsDialogVisible(value);
  };

  return (
    <>
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
        screenStyle={[
          styles.screenStyle,
          {
            backgroundColor: ThemeManager.colors.bgDarkwhite,
          },
        ]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
      >
        <Loader
          isLoading={
            addBankCardReducer?.isLoading ||
            deleteBankAccountReducer?.isLoading ||
            withdrawFiatBeneficiaryReducer?.isLoadingBeni ||
            withdrawFiatBeneficiaryReducer?.isLoading ||
            withdrawFiatBeneficiaryReducer?.isLoadingDelete
          }
        />
        {isDialogVisible ? (
          <View
            style={{
              flex: 1,
              backgroundColor: ThemeManager.colors.dashboardSubViewBg,
            }}
          >
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity
                style={{ marginRight: 15, marginTop: 15 }}
                onPress={() => {
                  dispatch(getAllBeneficiaryFiat(props.currency));
                  setIsDialogVisible(false);
                  setPinCode("");
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                  style={{ height: 25, width: 25, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: Fonts.medium,
                  color: ThemeManager.colors.textColor,
                  marginTop: 10,
                  marginLeft: 15,
                }}
              >
                {strings.spot.pin_code}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginRight: 10,
                  marginTop: 10,
                  marginLeft: 15,
                }}
              >
                {strings.spot.enter_pin_code_which}
              </Text>
              <View style={{ marginTop: 30 }}>
                <View style={{ marginHorizontal: 15 }}>
                  <InputVerification
                    verifyLable={{ color: ThemeManager.colors.textColor5 }}
                    inputLabel={strings.spot.enter_pin_code}
                    editable={true}
                    verifyInputStyle={{
                      color: ThemeManager.colors.textColor1,
                      backgroundColor: ThemeManager.colors.tabBackground,
                    }}
                    placeHolder={`EG. "303454"`}
                    value={pinCode}
                    onChangeText={(value) => {
                      // setOtp(value);
                      if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                        setPinCode(value);
                      }
                    }}
                    maxLength={6}
                    keyboardStyle={"numeric"}
                    returnKeyType={"done"}
                  />
                </View>

                <View style={{ marginTop: 30 }}>
                  <Button
                    defaultBtn={styles.btnBottom}
                    children={strings.spot.submit}
                    onPress={() => {
                      if (pinCode.length < 5 || pinCode.length > 6) {
                        // Alert.alert(
                        //   constants.APP_NAME_CAPS,
                        //   strings.add_beneficiary.please_enter_valid_pin
                        // );
                        Singleton.getInstance().showError(
                          strings.add_beneficiary.please_enter_valid_pin
                        );
                      } else {
                        let code = pinCode;

                        dispatch(activateBeneficiaryFiat({ beniId, code }))
                          .then((res) => {
                            if (res?.state === "active") {
                              showMessage({
                                message:
                                  strings.add_beneficiary
                                    .beneficiary_address_activated,
                                backgroundColor:
                                  ThemeManager.colors.tabBottomBorder,
                                autoHide: true,
                                duration: 3000,
                                type: "success",
                                icon: "success",
                                position: "right",
                                style: {
                                  marginHorizontal: 10,
                                  borderRadius: 10,
                                  marginTop: Platform.OS == "android" ? 10 : 40,
                                },
                              });

                              showDialog(true);
                              setPinCode("");
                            }

                            dispatch(getAllBeneficiaryFiat(props.currency));
                            showDialog(false);
                          })
                          .catch((error) => {
                            setPinCode("");
                            // Alert.alert(constants.APP_NAME_CAPS, error);
                            Singleton.getInstance().showError(error);
                          });
                      }
                    }}
                  />
                  <View
                    style={{
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      marginRight: 15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // beniId = beniId;
                        dispatch(resendPinCodeBenificiaryFiat({ beniId }))
                          .then((res) => {
                            setPinCode("");
                            if (res === 200) {
                              showMessage({
                                message: strings.add_beneficiary.pin_code_sent,
                                backgroundColor:
                                  ThemeManager.colors.tabBottomBorder,
                                autoHide: true,
                                duration: 3000,
                                type: "success",
                                icon: "success",
                                position: "right",
                                style: {
                                  marginHorizontal: 10,
                                  borderRadius: 10,
                                  marginTop: Platform.OS == "android" ? 10 : 40,
                                },
                              });

                              showDialog(true);
                            }
                          })
                          .catch((error) => {
                            // Alert.alert(constants.APP_NAME_CAPS, error);
                            Singleton.getInstance().showError(error);
                          });
                      }}
                    >
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 16,
                          fontFamily: Fonts.medium,
                        }}
                      >
                        {strings.add_beneficiary.resend_pin}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        ) : (
          <View
            style={[
              styles.ViewMainContainer,
              { backgroundColor: ThemeManager.colors.bgDarkwhite },
            ]}
          >
            <View
              style={{ marginHorizontal: 16, height: 40, marginVertical: 8 }}
            >
              <SimpleHeader
                titleName={strings.trade_tab.manage_payee}
                rightIcon
                backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
                rightIconUrl={{
                  uri:
                    ThemeManager.colors.themeColor === "dark"
                      ? Images.icon_without_circle_plus
                      : Images.icon_without_circle_plus,
                }}
                rightIconPress={async () => {
                  setIsModalVisible(true);
                }}
                onBackPress={() => {
                  // dispatch(resetBeneficiaryFiatForm());
                  Actions.currentScene != "ChooseCrypto" && Actions.pop();
                  //   setShowConvertModal(false);
                }}
                customRightImage={[
                  // styles.modeIcon,
                  { tintColor: ThemeManager.colors.textBW },
                ]}
              />
            </View>

            <View
              style={{
                width: "100%",
                marginTop: 20,
                flex: 1,
                marginBottom: 40,
              }}
            >
              <FlatList
                keyboardShouldPersistTaps={"handled"}
                data={withdrawFiatBeneficiaryReducer?.allBenificiariesFiat}
                style={{ backgroundColor: "transparent" }}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        {
                          color: ThemeManager.colors.textColor1,
                          fontFamily: Fonts.medium,
                          fontSize: 16,
                          marginTop: 150,
                        },
                      ]}
                    >
                      No bank account found
                    </Text>
                  </View>
                }
              />
            </View>
          </View>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            modalClose();
            setIsModalVisible(false);
          }}
        >
          <Wrap
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: "transparent" },
            ]}
            bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
          >
            <Loader
              isLoading={
                addBankCardReducer?.isLoading ||
                deleteBankAccountReducer?.isLoading ||
                withdrawFiatBeneficiaryReducer.isLoadingBeni
              }
            />
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  modalClose();
                  setIsModalVisible(false);
                }}
              ></TouchableOpacity>
              <KeyboardAwareScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <Loader isLoading={addBankCardReducer?.isLoading} />
                <View
                  style={{
                    backgroundColor: ThemeManager.colors.whiteScreen,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    paddingHorizontal: 15,
                    marginVertical: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      modalClose();

                      setIsModalVisible(false);
                    }}
                    style={{
                      alignSelf: "flex-end",
                      height: 40,
                      width: 40,
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor1,
                      marginVertical: 10,
                      fontSize: 22,
                      fontFamily: Fonts.bold,
                    }}
                  >
                    {strings.trade_tab.manage_bank}
                  </Text>
                  <InputField
                    editable={true}
                    title={strings.trade_tab.full_name}
                    value={withdrawFiatBeneficiaryReducer?.beniNameFiat}
                    onChangeText={(value) => {
                      if (constants.NAME_REGEX.test(value)) {
                        dispatch(
                          beneficiaryFiatFormUpdate({
                            prop: "beniNameFiat",
                            value: value,
                          })
                        );
                      }
                    }}
                    maxlength={50}
                    // keyboardType="email-address"
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                      marginVertical: 15,
                    }}
                  />
                  <InputField
                    editable={true}
                    title={strings.trade_tab.account_number}
                    value={withdrawFiatBeneficiaryReducer?.beniAccountNo}
                    onChangeText={(value) => {
                      dispatch(
                        beneficiaryFiatFormUpdate({
                          prop: "beniAccountNo",
                          value: value,
                        })
                      );
                    }}
                    maxlength={40}
                    // keyboardType="email-address"
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                      // marginVertical: 10,
                    }}
                  />
                  <InputField
                    editable={true}
                    title={strings.trade_tab.bank_code}
                    value={withdrawFiatBeneficiaryReducer?.beniBankCode}
                    onChangeText={(value) => {
                      dispatch(
                        beneficiaryFiatFormUpdate({
                          prop: "beniBankCode",
                          value: value,
                        })
                      );
                    }}
                    maxlength={10}
                    // keyboardType="email-address"
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.SwapInput,
                      marginVertical: 15,
                    }}
                  />
                  <View style={styles.btnStyleView}>{renderError()}</View>
                  <ButtonPrimary
                    style={{ marginVertical: 20 }}
                    title={strings.trade_tab.add}
                    onPress={() => {
                      Alert.alert(
                        constants.APP_NAME_CAPS,
                        strings.trade_tab.are_you_really_want_to_add,
                        [
                          {
                            text: strings.spot.yes,
                            onPress: () => {
                              onButtonPress();
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

                      //  Actions.currentScene != "Home" && Actions.Home()
                    }}
                  />
                </View>
              </KeyboardAwareScrollView>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  modalClose();

                  setIsModalVisible(false);
                }}
              ></TouchableOpacity>
            </View>
          </Wrap>
        </Modal>
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
            style={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
            ]}
            bottomStyle={{
              backgroundColor: ThemeManager.colors.dashboardSubViewBg,
            }}
          >
            <Loader isLoading={loading} />
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={{ marginRight: 15, marginTop: 15 }}
                  onPress={() => {
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
                </TouchableOpacity>
              </View>
              <KeyboardAwareScrollView
                bounces={false}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: Fonts.medium,
                    color: ThemeManager.colors.textColor,
                    marginTop: 10,
                    marginLeft: 15,
                  }}
                >
                  {strings.spot.pin_code}
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
                  ) : null}
                  <View style={{ marginTop: 30 }}>
                    <Button
                      defaultBtn={styles.btnBottom}
                      children={strings.spot.submit}
                      onPress={() => {
                        if (code_2fa.length < 5 || code_2fa.length > 6) {
                          Singleton.getInstance().showError(
                            strings.add_beneficiary.please_enter_valid_pin
                          );
                        } else {
                          setLoading(true);
                          dispatch(deleteBeneficiaryFiat(beniId, code_2fa))
                            .then((res) => {
                              setPinCode("");
                              setCode_2fa("");
                              setLoading(false);
                              setModalVisible(false);
                              showMessage({
                                message:
                                  strings.add_beneficiary.address_deleted,
                                backgroundColor:
                                  ThemeManager.colors.tabBottomBorder,
                                autoHide: true,
                                duration: 3000,
                                type: "success",
                                icon: "success",
                                position: "right",
                                style: {
                                  marginHorizontal: 10,
                                  borderRadius: 10,
                                  marginTop: Platform.OS == "android" ? 10 : 40,
                                },
                              });

                              dispatch(getAllBeneficiaryFiat(props.currency));
                            })
                            .catch((error) => {
                              setCode_2fa("");
                              setErrorRemove(error);
                              setLoading(false);
                            });
                        }
                      }}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Wrap>
        </Modal>
      </Wrap>
    </>
  );
};
export default ManagePayee;
