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
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Fonts, Images } from "../../../theme";
import styles from "./ManageBanksStyle";
import { useDispatch, useSelector } from "react-redux";
import { ThemeManager } from "../../../../ThemeManager";
import { ButtonPrimary, InputField, Wrap, Loader } from "../../common";
import { strings } from "../../../../Localization";
import SimpleHeader from "../../common/SimpleHeader";
import {
  bankListAction,
  deleteBankAccountAction,
  addBankCardUpdate,
  addBankCardAction,
} from "../../../Redux/Actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import * as constants from "../../../Constants";

const ManageBanks = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const bankListReducer = useSelector((state) => state?.bankListReducer);
  const deleteBankAccountReducer = useSelector(
    (state) => state?.deleteBankAccountReducer
  );
  const addBankCardReducer = useSelector((state) => state?.addBankCardReducer);

  useEffect(() => {
    props.navigation.addListener("didFocus", async (event) => {
      dispatch(bankListAction());
    });
  }, []);

  const modalClose = () => {
    dispatch(
      addBankCardUpdate({
        prop: "account_holder_name",
        value: "",
      })
    );
    dispatch(
      addBankCardUpdate({
        prop: "account_no",
        value: "",
      })
    );
    dispatch(
      addBankCardUpdate({
        prop: "bic",
        value: "",
      })
    );
    dispatch(
      addBankCardUpdate({
        prop: "error",
        value: "",
      })
    );
  };
  const onButtonPress = () => {
    const reg = constants.STRING_WITHOUT_SPECIAL_CHARACTER;

    if (!addBankCardReducer?.account_holder_name) {
      dispatch(
        addBankCardUpdate({
          prop: "error",
          value: strings.trade_tab.account_holder_name_required,
        })
      );
    } else if (!addBankCardReducer?.account_no) {
      dispatch(
        addBankCardUpdate({
          prop: "error",
          value: strings.trade_tab.account_no_required,
        })
      );
    } else if (!addBankCardReducer?.bic) {
      dispatch(
        addBankCardUpdate({
          prop: "error",
          value: strings.trade_tab.bic_required,
        })
      );
    } else if (reg.test(addBankCardReducer?.bic) == false) {
      dispatch(
        addBankCardUpdate({
          prop: "error",
          value: strings.trade_tab.bic_valid,
        })
      );
    } else {
      dispatch(
        addBankCardAction(
          addBankCardReducer?.account_holder_name,
          addBankCardReducer?.account_no,
          addBankCardReducer?.bic
        )
      ).then((res) => {
        modalClose();
        dispatch(bankListAction());
        setIsModalVisible(false);
      });
    }
  };

  const onRemoveAccount = (id) => {
    dispatch(deleteBankAccountAction(id)).then((res) => {
      if (res == 200) {
        dispatch(bankListAction());
      }
      //   openOderDetails(res, true);
    });
  };
  const renderError = () => {
    if (addBankCardReducer?.error) {
      return (
        <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
          <Text style={styles.errorMessageStyle}>
            {addBankCardReducer?.error}
          </Text>
        </View>
      );
    }
    // }
  };
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: ThemeManager.colors.tabBackground,
          width: "95%",
          //   height: 80,

          alignSelf: "center",
          margin: 5,
          borderRadius: 8,
          padding: 5,
        }}
      >
        <View
          style={{
            padding: 5,
            // height: 49,
            width: "100%",
            // flexDirection: 'row',
            // alignItems: 'center',
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
              {strings.trade_tab.account_holder_name}{" "}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                }}
              >
                {item.holder_name}
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
              {strings.trade_tab.account_no}{" "}
            </Text>
            <View
              style={{
                alignItems: "flex-end",
                flex: 1,
                // justifyContent: 'flex-start',
              }}
            >
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  // textAlign: 'right',
                }}
              >
                {item.iban}
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
              {strings.trade_tab.bic}{" "}
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
                {item.bic}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{ alignItems: "flex-end", marginRight: 5, marginVertical: 10 }}
        >
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                constants.APP_NAME_CAPS,
                strings.trade_tab.are_you_really,
                [
                  {
                    text: strings.spot.yes,
                    onPress: () => {
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
              //   width: 48,
              alignItems: "center",
              justifyContent: "center",
              //   flexDirection: 'row',
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
        {/* <SafeAreaView
        style={[
          styles.root,
          {backgroundColor: ThemeManager.colors.backgroundColor},
        ]}> */}
        <Loader
          isLoading={
            bankListReducer?.isLoading ||
            addBankCardReducer?.isLoading ||
            deleteBankAccountReducer?.isLoading
          }
        />
        <View
          style={[
            styles.ViewMainContainer,
            { backgroundColor: ThemeManager.colors.bgDarkwhite },
          ]}
        >
          <View style={{ marginHorizontal: 16, height: 40, marginVertical: 8 }}>
            <SimpleHeader
              titleName={strings.trade_tab.manage_bank}
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
                Actions.pop();
              }}
              customRightImage={[{ tintColor: ThemeManager.colors.textBW }]}
            />
          </View>

          <View
            style={{ width: "100%", marginTop: 20, flex: 1, marginBottom: 40 }}
          >
            <FlatList
              data={bankListReducer?.bankList}
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
                bankListReducer?.isLoading ||
                addBankCardReducer?.isLoading ||
                deleteBankAccountReducer?.isLoading
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
                    title={strings.trade_tab.account_holder_name}
                    value={addBankCardReducer?.account_holder_name}
                    onChangeText={(value) => {
                      dispatch(
                        addBankCardUpdate({
                          prop: "account_holder_name",
                          value: value,
                        })
                      );
                    }}
                    maxlength={50}
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.inputBackground,
                      marginVertical: 15,
                    }}
                  />
                  <InputField
                    editable={true}
                    title={strings.trade_tab.account_no}
                    value={addBankCardReducer?.account_no}
                    onChangeText={(value) => {
                      dispatch(
                        addBankCardUpdate({
                          prop: "account_no",
                          value: value,
                        })
                      );
                    }}
                    maxlength={40}
                    customContainerStyle={{
                      backgroundColor: ThemeManager.colors.inputBackground,
                    }}
                  />
                  <InputField
                    editable={true}
                    title={strings.trade_tab.bic}
                    value={addBankCardReducer?.bic}
                    onChangeText={(value) => {
                      dispatch(
                        addBankCardUpdate({
                          prop: "bic",
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
      </Wrap>
    </>
  );
};
export default ManageBanks;
