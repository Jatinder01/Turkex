/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import styles from "./PaymentMethodStyle";
import { Wrap } from "../../common/Wrap";
import SimpleHeader from "../../common/SimpleHeader";
import { ThemeManager } from "../../../../ThemeManager";
import BorderLine from "../../common/BorderLine";
import { Fonts, Images } from "../../../theme";
import { ButtonPrimary } from "../../common";
import { Actions } from "react-native-router-flux";
import CustomModal from "../../common/CustomModal";
import fonts from "../../../theme/fonts";
import { useSelector } from "react-redux";
const AccountDetail = [
  { info: "Personal Information", img: Images.Dot },
  { info: "Identify Verification", img: Images.Dot },
  { info: "Proof of Address", img: Images.Dot },
  { info: "Questionnaire", img: Images.Dot },
  { info: "Source of Wealth Declaration", img: Images.Dot },
];

const PaymentMethod = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetail, setmodalDetail] = useState(false);
  const [modalActivate, setmodalActivate] = useState(false);
  const { isThemeUpdate } = useSelector((state) => state.tradeReducer);
  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  return (
    <Wrap>
      <View style={{ marginLeft: 15 }}>
        <SimpleHeader
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          titleName={"Select Payment Method"}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <View style={{ flex: 1, backgroundColor: "#ffff" }}>
        <View
          style={{
            marginTop: 160,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.textStyle}>You will receive</Text>
          <Text style={{ fontSize: 30, color: ThemeManager.colors.textBW }}>
            0.038998 BNB
          </Text>
          <Text style={styles.textStyle}>=15 USD</Text>
        </View>
        <BorderLine />
        <Text
          style={{
            marginTop: 15,
            marginLeft: 15,
            fontSize: 14,
            color: ThemeManager.colors.textBW,
            fontFamily: Fonts.regular,
          }}
        >
          Payment Methods
        </Text>

        <View
          style={{
            height: 140,
            width: "90%",
            alignSelf: "center",
            backgroundColor: "#F7F7F8",
            marginTop: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textBW,
              }}
            >
              Pay with Card
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textBW,
              }}
            >
              384.63 USD
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textBW,
              }}
            >
              <Image
                source={{ uri: Images.icon_visa }}
                style={{ height: 20, width: 58 }}
              />{" "}
              Visa / Mastercards
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textBW,
              }}
            >
              =1 BNB
            </Text>
          </View>

          <View>
            <Image
              source={Images.okbtn}
              style={{
                height: 20,
                width: 20,
                alignSelf: "flex-end",
                marginRight: 10,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 10,
              marginRight: 10,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textBW,
              }}
            >
              Transaction Requirements
            </Text>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textBW,
                }}
              >
                15-20.000 USD
              </Text>
              <TouchableOpacity onPress={() => alert("info")}>
                <Image
                  source={Images.payInfo}
                  style={{ height: 17, width: 17, marginTop: 1, marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            marginLeft: 15,
            marginRight: 15,
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.regular,
              color: ThemeManager.colors.textBW,
            }}
          >
            The quotation may differ for different paymentmethods. Please choose
            your prederred payment methods to proceed.
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: ThemeManager.colors.textBW,
            marginTop: 100,
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 10,
            marginRight: 10,
            marginTop: 15,
          }}
        >
          <View style={{ marginLeft: 15, marginRight: 15 }}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textBW,
              }}
            >
              You will pay
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textBW,
                fontSize: 20,
              }}
            >
              15
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  color: ThemeManager.colors.textBW,
                  fontSize: 14,
                }}
              >
                {" "}
                USD
              </Text>
            </Text>
          </View>
          <View style={{ width: 190 }}>
            <ButtonPrimary
              title={"Add New Card"}
              onPress={() => setModalVisible(true)}
            />
          </View>
        </View>

        {/* ////////////////////////////////////////////////MODAL 1st /////////////////////////////////////////////////////// */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                  style={{
                    height: 20,
                    width: 20,
                    alignSelf: "flex-end",
                    margin: 15,
                    // tintColor: ThemeManager.colors.Purewhite,
                  }}
                />
              </TouchableOpacity>

              <Image
                source={Images.payLogo}
                style={{ height: 92, width: 79, alignSelf: "center" }}
              />
              <Text style={styles.modalText}>Activate Fiat Service</Text>

              <Text
                style={{
                  alignSelf: "center",
                  width: 350,
                  color: ThemeManager.colors.Purewhite,
                  fontFamily: fonts.regular,
                }}
              >
                {" "}
                To start trading fiat, please activate the service and allow us
                to share your account information with our service provider.{" "}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 15,
                  marginLeft: 15,
                  marginRight: 10,
                }}
              >
                <Image
                  source={Images.okbtn}
                  style={{ height: 15, width: 15, marginRight: 3 }}
                />
                <Text
                  style={{
                    color: ThemeManager.colors.Purewhite,
                    fontFamily: fonts.regular,
                  }}
                >
                  By proceeding you agree to the{" "}
                  <Text
                    style={{
                      color: ThemeManager.colors.Depositbtn,
                      fontFamily: fonts.regular,
                    }}
                  >
                    Terms of Use{" "}
                  </Text>
                  and{" "}
                  <Text
                    style={{
                      color: ThemeManager.colors.Depositbtn,
                      fontFamily: fonts.regular,
                    }}
                  >
                    Privacy Policy
                  </Text>{" "}
                  of Bifinity UAB.
                </Text>
              </View>

              <View
                style={{ width: "100%", alignSelf: "center", marginTop: 20 }}
              >
                <ButtonPrimary
                  title={"Start"}
                  // onPress={() => setModalVisible(!modalVisible)}
                  onPress={() => {
                    setmodalDetail(true);
                    setModalVisible(false);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* ////////////////////////////////////////////////////////// MODAL 2nd //////////////////////////////// */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalDetail}
          onRequestClose={() => {
            setmodalDetail(!modalDetail);
          }}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView]}>
              <TouchableOpacity onPress={() => setmodalDetail(!modalDetail)}>
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                  style={{
                    height: 20,
                    width: 20,
                    alignSelf: "flex-end",
                    margin: 15,
                    // tintColor: ThemeManager.colors.Purewhite,
                  }}
                />
              </TouchableOpacity>

              <Text style={styles.modalText}>Share Account Details</Text>

              <Text
                style={{
                  alignSelf: "center",
                  width: 350,
                  color: ThemeManager.colors.Purewhite,
                  fontFamily: fonts.regular,
                }}
              >
                {" "}
                To process your funds for future payment, please confirm that
                you are willing to share the following account information
                under:
              </Text>

              <Text
                style={{
                  alignSelf: "center",
                  color: ThemeManager.colors.Purewhite,
                  fontFamily: fonts.medium,
                }}
              >
                70181 34403
              </Text>

              <View
                style={{
                  width: "95%",
                  alignSelf: "center",
                  backgroundColor: ThemeManager.colors.bgDarkwhite,
                }}
              >
                <FlatList
                  data={AccountDetail}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 5,
                        marginBottom: 3,
                      }}
                    >
                      <Image
                        source={item.img}
                        style={{
                          height: 5,
                          width: 5,
                          marginRight: 10,
                          marginLeft: 8,
                        }}
                      />
                      <Text
                        style={{
                          color: ThemeManager.colors.textBW,
                          fontFamily: Fonts.regular,
                        }}
                      >
                        {item.info}
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View
                style={{ width: "100%", alignSelf: "center", marginTop: 20 }}
              >
                <ButtonPrimary
                  title={"Confirm"}
                  onPress={() => {
                    setmodalActivate(true);
                    setmodalDetail(false);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* /////////////////////////////////////////////////////// / MODAL 3rd ///////////////////////////////////////////////////////////////////// */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalActivate}
          onRequestClose={() => {
            setmodalActivate(!modalActivate);
          }}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView]}>
              <TouchableOpacity
                onPress={() => setmodalActivate(!modalActivate)}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                  style={{
                    height: 20,
                    width: 20,
                    alignSelf: "flex-end",
                    margin: 15,
                    // tintColor: ThemeManager.colors.Purewhite,
                  }}
                />
              </TouchableOpacity>

              <Image
                source={{ uri: Images.Applogo }}
                style={{
                  height: 84,
                  width: 106,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />

              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 16,
                  fontFamily: fonts.medium,
                  color: ThemeManager.colors.Purewhite,
                  marginTop: 10,
                }}
              >
                Activated
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: ThemeManager.colors.Purewhite,
                  marginTop: 10,
                }}
              >
                You may now start trading with fiat on Binance.
              </Text>

              <View
                style={{ width: "100%", alignSelf: "center", marginTop: 125 }}
              >
                <ButtonPrimary
                  title={"Confirm"}
                  onPress={() => {
                    setmodalActivate(false);
                    Actions.AddNewCard();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Wrap>
  );
};

export default PaymentMethod;
