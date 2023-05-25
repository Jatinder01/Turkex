/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
} from "react-native";
import styles from "./CreateAccountStyle";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import {
  SubHeaderLinks,
  InputField,
  ButtonPrimary,
  PhoneNumberInput,
  HeaderCancel,
  CountryList,
  Header,
} from "../../common";
import PagerView from "react-native-pager-view";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { Actions } from "react-native-router-flux";
import * as constants from "../../../Constants";
import { useSelector } from "react-redux";
import { strings } from "../../../../Localization";
import END_POINT from "../../../EndPoints";

let pagera = null;
const arrData = [
  {
    title: "Create Account",
    subTitle: "Enter your account details.",
    image: ThemeManager.ImageIcons.icon_User_CreateAccount,
    // 'https://s2.staging-host.com/mobile_apps/CoinCult/icon_User_CreateAccount.png',
  },
  {
    title: "Verify Identity",
    subTitle: "Verify your identity to protect your account.",
    image: ThemeManager.ImageIcons.icon_indentity_CreateAccount,
    // 'https://s2.staging-host.com/mobile_apps/CoinCult/icon_indentity_CreateAccount.png',
  },
];

const CreateAccount = (props) => {
  const { isThemeUpdate } = useSelector((state) => state.tradeReducer);

  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      <View style={{ flex: 1 }}>
        {/* <Header
          customCenterTitle={{}}
          rightImage={{uri: Images.cross}}
          btnTextRight=" "
          customRightImage={[
            styles.customRightImage,
            {tintColor: ThemeManager.colors.textBW, marginRight: 10},
          ]}
          rightButtonClicked={() => {
            Actions.pop();
          }}
        /> */}
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}
          style={{
            height: 40,
            width: 40,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            alignSelf: "flex-end",
            marginRight: 20,
            marginVertical: 20,
          }}
        >
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
            style={{
              height: 25,
              width: 25,
              // tintColor: ThemeManager.colors.textBW,
            }}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: ThemeManager.colors.textBW }]}>
          {strings.register_Page.create_your_account}
        </Text>
        <Text style={[styles.SubTitle, { color: ThemeManager.colors.textBW }]}>
          {constants.APP_NAME_CAPS}{" "}
          {strings.register_Page.is_the_worlds_largest}
        </Text>
        {arrData.map((data, index) => {
          return (
            <View style={{ marginHorizontal: 16, marginTop: 30 }} key={index}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    height: 19,
                    width: 16,
                    // tintColor: ThemeManager.colors.headTxt,
                    marginTop: 5,
                  }}
                  source={{
                    uri: data.image,
                  }}
                />
                <Text
                  style={{
                    marginLeft: 15,
                    fontFamily: fonts.regular,
                    fontSize: 16,
                    color: ThemeManager.colors.textColor2,
                  }}
                >
                  {data.title}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 2 }}>
                <Text
                  style={{
                    marginLeft: 32,
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: ThemeManager.colors.headerText,
                  }}
                >
                  {data.subTitle}
                </Text>
              </View>
            </View>
          );
        })}
        <View style={{ marginTop: 20 }}>
          <View>
            <Text
              style={{
                color: ThemeManager.colors.headerText,
                marginHorizontal: 16,
                fontFamily: Fonts.regular,
              }}
            >
              {strings.register_Page.by_creating_an_account}
              <Text
                onPress={() => {
                  Linking.openURL(`${END_POINT.COMMON_URL}/terms`);
                }}
                style={{
                  color: ThemeManager.colors.Depositbtn,
                  textDecorationLine: "underline",
                }}
              >
                {strings.register_Page.terms}
              </Text>
              {strings.register_Page.and}
              <Text
                onPress={() => {
                  Linking.openURL(`${END_POINT.COMMON_URL}/privacy`);
                }}
                style={{
                  color: ThemeManager.colors.Depositbtn,
                  textDecorationLine: "underline",
                }}
              >
                {strings.register_Page.data_protection}
              </Text>
            </Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <ButtonPrimary
              title={strings.register_Page.create_personal_account}
              onPress={() => {
                Actions.currentScene != "EnterAccountDetails" &&
                  Actions.EnterAccountDetails();
              }}
            />
          </View>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => Actions.Login()}
          >
            <Text
              style={{
                color: ThemeManager.colors.headerText,
                marginHorizontal: 16,
              }}
            >
              {strings.register_Page.already_register}
              <Text style={{ color: ThemeManager.colors.Depositbtn }}>
                {strings.register_Page.log_in}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccount;
