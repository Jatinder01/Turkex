/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Linking,
  Platform,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Animated,
  TextInput,
  BackHandler,
} from "react-native";
// import styles from './AboutUsStyle';
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, Header } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, Fonts, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import { strings } from "../../../../Localization";
import Singleton from "../../../Singleton";
import { useDispatch, useSelector } from "react-redux";

import * as constants from "../../../Constants";
import BorderLine from "../../common/BorderLine";
import SimpleHeader from "../../common/SimpleHeader";
import DeviceInfo from "react-native-device-info";
import Clipboard from "@react-native-clipboard/clipboard";
import { showMessage, hideMessage } from "react-native-flash-message";
import END_POINT from "../../../EndPoints";
import { CoinCultApi } from "../../../api/CoinCultApi";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { getCardList, getCardActivatePaytend } from "../../../Redux/Actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

export const CELL_SIZE = 20;
export const CELL_BORDER_RADIUS = 4;
export const DEFAULT_CELL_BG_COLOR = ThemeManager.colors.modalBox;
export const NOT_EMPTY_CELL_BG_COLOR = ThemeManager.colors.selectedTextColor;
export const ACTIVE_CELL_BG_COLOR = ThemeManager.colors.convertBox;
// import MaskInput from "react-native-mask-input";
const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 16;
const source = {
  uri: "https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png",
};
const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};
const CardInitial = () => {
  const styles = useStyles(ThemeManager);
  const dispatch = useDispatch();
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  const [modalVisible, setModalVisible] = useState(false);

  const [value, setValue] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  // const [card, setCard] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  // const [creditCard, setCreditCard] = React.useState("");
  // const { cardListInfo, cardListError, isCardListLoading } = useSelector(
  //   (state) => state.cardListReducer
  // );
  // console.log('cardListInfo=-=--->>>', cardListInfo);
  useEffect(() => {
    dispatch(getCardList())
      .then((res) => {
        console.log("getCardList=-=--->>>", res);
      })
      .catch((err) => {
        console.log("getCardList err=-=->>", err);
      });
    //backhandler
    const backAction = () => {
      // console.log('Actions.currentScene=-=-=', Actions.currentScene);
      if (Actions.currentScene === "CardInitial") {
        Actions.currentScene != "Home" && Actions.Home();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      backHandler.remove();
    };
  }, []);
  const onButtonPress = () => {
    // Actions.currentScene != "ActivatedCards" && Actions.push("ActivatedCards");
    setModalVisible(true);
  };
  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };
  const handleCardDisplay = (text) => {
    const inputVal = text.replace(/ /g, ""); //remove all the empty spaces in the input
    let inputNumbersOnly = inputVal?.replace(/\D/g, ""); // Get only digits

    if (inputNumbersOnly?.length > 16) {
      //If entered value has a length greater than 16 then take only the first 16 digits
      inputNumbersOnly = inputNumbersOnly.substr(0, 16);
    }

    // Get nd array of 4 digits per an element EX: ["4242", "4242", ...]
    const splits = inputNumbersOnly.match(/.{1,4}/g);

    let spacedNumber = "";
    if (splits) {
      spacedNumber = splits.join(" "); // Join all the splits with an empty space
    }

    setCardNumber(spacedNumber); // Set the new CC number
  };
  const onCardVerifyPress = () => {
    dispatch(getCardActivatePaytend(cardNumber))
      .then((res) => {
        console.log("card varify hit-=-=-=>>0", res);
        Singleton.getInstance().showMsg("Your card is activated.");
        // Actions.currentScene != "ActivatedCards" &&
        //   Actions.push("ActivatedCards");
        Actions.pop();
      })
      .catch((err) => {
        console.log("card verify err=-=>>", err);
        Singleton.getInstance().showError(err);
      });
  };

  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[{ backgroundColor: ThemeManager.colors.DashboardBG }]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
    >
      <View style={styles.headerView}>
        <SimpleHeader
          titleName={" "}
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          onBackPress={() => {
            // Actions.pop();
            Actions.currentScene != "Home" && Actions.Home();
          }}
        />
      </View>

      <View style={styles.topContainer}>
        <ScrollView bounces={false}>
          <View style={styles.subViewStyle}>
            <View style={styles.cautionViewStyle}>
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_caution }}
                style={styles.cautionImgStyle}
              />
              <Text style={[styles.cautionText, { marginRight: 10 }]}>
                {strings.cardScreen.your_prepaid_card}
              </Text>
            </View>
            <View
              style={[
                styles.cardImgStyle,
                { marginTop: 20, borderRadius: 6, overflow: "hidden" },
              ]}
            >
              <ImageBackground
                source={{ uri: Images.cardBackground }}
                style={styles.cardImgStyle}
              >
                <View
                  style={{
                    marginHorizontal: 20,
                    // justifyContent: "space-between",
                    // alignItems: "flex-start",
                    // flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexDirection: "row",
                      marginTop: 15,
                    }}
                  >
                    <Image
                      source={{ uri: Images.icon_card_logo }}
                      style={{ height: 30, width: 30, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        color: "red",
                        fontSize: 15,
                        fontFamily: Fonts.medium,
                      }}
                    >
                      • {"Inactive"}
                    </Text>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: 16,
                        color: "white",
                      }}
                    >
                      XXXX XXXX XXXX XXXX
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: 10,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          {strings.cardScreen.valid_upto}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.medium,
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          XX/XX
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* <Image
                    source={{ uri: Images.icon_masterCard }}
                    style={{ height: 40, width: 40, resizeMode: "contain" }}
                  /> */}
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    flexDirection: "row",
                    marginHorizontal: 20,
                    position: "absolute",
                    bottom: 10,
                    width: "90%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 16,
                      color: "white",
                    }}
                  >
                    XXXXXX XXXXXX
                  </Text>
                  <Image
                    source={{ uri: Images.icon_masterCard }}
                    style={{ height: 30, width: 40, resizeMode: "contain" }}
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
        </ScrollView>
      </View>
      <ButtonPrimary
        style={{ marginBottom: 50 }}
        title={strings.cardScreen.activate_your_card}
        onPress={() => {
          onButtonPress();
        }}
      />
      {modalVisible && (
        <View
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        >
          <Wrap
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
            bottomStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              // style={{flex: 1}}
              contentContainerStyle={{ flex: 1 }}
            >
              <View
                style={{ flexShrink: 1 }}

                // onPress={() => setModalVisible(false)}
              ></View>
              <View style={styles.hiddenView}>
                <View style={styles.centerView}>
                  <TouchableOpacity
                    style={{
                      alignSelf: "flex-end",
                      marginBottom: 10,
                      marginTop: 4,
                    }}
                    onPress={() => {
                      setModalVisible(false);
                      setCardNumber("");
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ width: 20, height: 20 }}
                      source={{ uri: ThemeManager.ImageIcons.icon_cross }}
                    />
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.cardImgStyle,
                      { borderRadius: 6, overflow: "hidden" },
                    ]}
                  >
                    <ImageBackground
                      source={{ uri: Images.cardBackground }}
                      style={styles.cardImgStyle}
                    >
                      <View
                        style={{
                          marginHorizontal: 20,
                          // justifyContent: "space-between",
                          // alignItems: "flex-start",
                          // flexDirection: "row",
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "flex-start",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginTop: 15,
                          }}
                        >
                          <Image
                            source={{ uri: Images.icon_card_logo }}
                            style={{
                              height: 30,
                              width: 30,
                              resizeMode: "contain",
                            }}
                          />
                        </View>
                        <View style={{ marginTop: 20 }}>
                          <Text
                            style={{
                              fontFamily: Fonts.medium,
                              fontSize: 16,
                              color: "white",
                            }}
                          >
                            XXXX XXXX XXXX XXXX
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginTop: 10,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  fontFamily: Fonts.regular,
                                  fontSize: 12,
                                  color: "white",
                                }}
                              >
                                {strings.cardScreen.valid_upto}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Fonts.medium,
                                  fontSize: 12,
                                  color: "white",
                                }}
                              >
                                XX/XX
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/* <Image
                    source={{ uri: Images.icon_masterCard }}
                    style={{ height: 40, width: 40, resizeMode: "contain" }}
                  /> */}
                      </View>
                      <View
                        style={{
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          flexDirection: "row",
                          marginHorizontal: 20,
                          position: "absolute",
                          bottom: 10,
                          width: "90%",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.medium,
                            fontSize: 16,
                            color: "white",
                          }}
                        >
                          XXXXXX XXXXXX
                        </Text>
                        <Image
                          source={{ uri: Images.icon_masterCard }}
                          style={{
                            height: 30,
                            width: 40,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                    </ImageBackground>
                  </View>
                  <Text style={styles.activateText}>
                    {strings.cardScreen.activate_your_card}
                  </Text>
                  <Text style={styles.threeText}>
                    {strings.cardScreen.enter_three_digit_number}
                  </Text>
                  <View
                    style={{
                      height: 50,
                      backgroundColor: ThemeManager.colors.SwapInput,
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      // width: "100%",
                      flexGrow: 1,
                      width: 270,
                      // backgroundColor: "yellow",
                      // width: 200,
                    }}
                  >
                    <TextInput
                      autoFocus
                      style={{
                        height: 50,
                        width: 184,
                        // minWidth: "80%",
                        color: ThemeManager.colors.textColor,
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        // backgroundColor: "red",
                      }}
                      placeholder={"0000 0000 0000 0000"}
                      placeholderTextColor={
                        ThemeManager.colors.placeholderTextColor
                      }
                      value={cardNumber}
                      onChangeText={(text) => {
                        // setCardNumber(text);
                        if (constants.ACCOUNT_NUMBER_CARD_REGEX.test(text)) {
                          handleCardDisplay(text);
                        }
                      }}
                      onBlur={() => {
                        // alert("hello");
                        if (cardNumber?.length < 19) {
                          Singleton.getInstance().showError(
                            "Please enter valid card number."
                          );
                        } else {
                          onCardVerifyPress();
                        }
                      }}
                      onSubmitEditing={() => {
                        // alert("hey");
                        // console.log("cardNumber=)))))-=", cardNumber);
                        // let correctCardNumber = cardNumber?.replaceAll(" ", "");
                        // console.log("correctCardNumber=-=", correctCardNumber);
                        // console.log("cardNumber=-=", cardNumber);
                        // console.log("cardNumber=-=", cardNumber?.length);
                        // if (cardNumber.length < 19) {
                        //   Singleton.getInstance().showError(
                        //     "Please enter valid card number."
                        //   );
                        // } else {
                        //   onCardVerifyPress();
                        // }
                      }}
                      returnKeyType={"done"}
                      maxLength={19}
                      // multiline
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
              <View
                style={{ flexShrink: 1 }}
                // onPress={() => setModalVisible(false)}
              ></View>
            </KeyboardAwareScrollView>
          </Wrap>
        </View>
      )}
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          screenStyle={[
            styles.screenStyle,
            { backgroundColor: "rgba(255,255,255,0.1)" },
          ]}
          bottomStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          ></TouchableOpacity>
          <View style={styles.hiddenView}>
            <View style={styles.centerView}>
              <View
                style={[
                  styles.cardImgStyle,
                  { borderRadius: 6, overflow: "hidden" },
                ]}
              >
                <ImageBackground
                  source={{ uri: Images.cardBackground }}
                  style={styles.cardImgStyle}
                />
              </View>
              <Text style={styles.activateText}>
                {strings.cardScreen.activate_your_card}
              </Text>
              <Text style={styles.threeText}>
                {strings.cardScreen.enter_three_digit_number}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          ></TouchableOpacity>
        </Wrap>
      </Modal> */}
    </Wrap>
  );
};

export default CardInitial;
const useStyles = (theme) =>
  StyleSheet.create({
    headerView: { marginHorizontal: 15, marginVertical: 10, height: 45 },
    headerTextStyle: { fontSize: 16, fontFamily: fonts.regular },
    topContainer: { justifyContent: "space-between", flex: 1 },
    subViewStyle: { marginHorizontal: 15 },
    cautionViewStyle: {
      backgroundColor: theme.colors.tabBackground,
      padding: 10,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 6,
    },
    cautionImgStyle: { height: 15, width: 15, resizeMode: "contain" },
    cautionText: {
      fontFamily: Fonts.regular,
      color: theme.colors.headerText,
      fontSize: 12,
      marginLeft: 10,
    },
    cardImgStyle: {
      height: 190,
      width: "100%",
      resizeMode: "cover",
      borderRadius: 6,
    },
    screenStyle: {
      flex: 1,
    },
    threeText: {
      color: theme.colors.textColor1,
      fontSize: 14,
      fontFamily: Fonts.regular,
      marginTop: 10,
      alignSelf: "center",
      textAlign: "center",
      marginHorizontal: 10,
    },
    activateText: {
      color: theme.colors.textColor1,
      fontSize: 16,
      fontFamily: Fonts.medium,
      marginTop: 20,
      alignSelf: "center",
      textAlign: "center",
    },
    centerView: {
      backgroundColor: theme.colors.tabActiveBackgroundColor,
      marginHorizontal: 10,
      borderRadius: 8,
      padding: 15,
    },
    hiddenView: {
      backgroundColor: "rgba(255,255,255,0.1)",
      flex: 1,
      justifyContent: "center",
    },
    // root: {flex: 1, padding: 20},
    // title: {textAlign: 'center', fontSize: 30},
    // codeFieldRoot: {marginTop: 20},
    // cell: {
    //   width: 40,
    //   height: 40,
    //   lineHeight: 38,
    //   fontSize: 24,
    //   borderWidth: 2,
    //   borderColor: '#00000030',
    //   textAlign: 'center',
    // },
    // focusCell: {
    //   borderColor: '#000',
    // },
    codeFiledRoot: {
      height: CELL_SIZE,
      marginTop: 20,
      paddingHorizontal: 2,
      justifyContent: "center",
    },
    cell: {
      marginHorizontal: 8,
      height: CELL_SIZE,
      width: CELL_SIZE,
      lineHeight: CELL_SIZE - 5,
      fontSize: 12,
      textAlign: "center",
      borderRadius: CELL_BORDER_RADIUS,
      color: theme.colors.selectedTextColor,
      backgroundColor: theme.colors.tabActiveBackgroundColor,

      // IOS
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      // Android
      elevation: 3,
    },

    // =======================

    root: {
      minHeight: 800,
      padding: 20,
    },
    title: {
      paddingTop: 50,
      color: theme.colors.textColor,
      fontSize: 25,
      fontWeight: "700",
      textAlign: "center",
      paddingBottom: 40,
    },
    icon: {
      width: 217 / 2.4,
      height: 158 / 2.4,
      marginLeft: "auto",
      marginRight: "auto",
    },
    subTitle: {
      paddingTop: 30,
      color: "#000",
      textAlign: "center",
    },
    nextButton: {
      marginTop: 30,
      borderRadius: 60,
      height: 60,
      backgroundColor: theme.colors.tabActiveBackgroundColor,
      justifyContent: "center",
      minWidth: 300,
      marginBottom: 100,
    },
    nextButtonText: {
      textAlign: "center",
      fontSize: 20,
      color: "#fff",
      fontWeight: "700",
    },
  });
