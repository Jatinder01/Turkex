import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, View, Image } from "react-native";
import styles from "./ManageAccountStyle";
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, Header } from "../../common";
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

const arrData = [
  {
    title: "English",
    image: { uri: Images.Home_Active },
    selected: false,
  },
  {
    title: "Lorem Ipsum",
    image: { uri: Images.Home_Active },
    selected: false,
  },
  {
    title: "Lorem Ipsum",
    image: { uri: Images.Home_Active },
    selected: false,
  },
];

const ManageAccount = (props) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const [isSelectedMode, setSelectedMode] = useState(" ");

  useEffect(() => {
    // Actions.pop();
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
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      <View style={{ marginHorizontal: 15, marginVertical: 10, height: 45 }}>
        <SimpleHeader
          titleName={""}
          // backImageColor={{tintColor: ThemeManager.colors.headTxt}}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>
      <Text
        style={{
          marginHorizontal: 16,
          fontFamily: Fonts.medium,
          fontSize: 26,
          color: ThemeManager.colors.textColor1,
        }}
      >
        Manage Account
      </Text>
      <View style={{ marginHorizontal: 16, marginVertical: 26 }}>
        {/* <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.textColor1,
                fontFamily: Fonts.regular,
                fontSize: 16,
              }}
            >
              Manage Account
            </Text>
            <Image
              style={{ height: 12, width: 8 }}
              source={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
            />
          </View>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 14,
              marginTop: 2,
              color: ThemeManager.colors.inactiveTextColor,
            }}
          >
            Once the account is disabled, most of your actions will be
            restricted, such as logging in and trading. You can choose to
            unblock the account at any time.
          </Text>
          <View
            style={{ height: 1, backgroundColor: "#00000014", marginTop: 20 }}
          />
        </View>
       */}
        <View style={{ marginTop: 26 }}>
          <TouchableOpacity
            onPress={() => {
              Actions.currentScene != "DeletionReason" &&
                Actions.DeletionReason();
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: ThemeManager.colors.textColor1,
                  fontFamily: Fonts.regular,
                  fontSize: 16,
                }}
              >
                Delete Account
              </Text>
              <Image
                style={{ height: 12, width: 8 }}
                source={{ uri: ThemeManager.ImageIcons.icon_forward_arrow }}
              />
            </View>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 14,
                marginTop: 2,
                color: ThemeManager.colors.inactiveTextColor,
              }}
            >
              Please note that account deletion is irreversible. Once deleted,
              you will not be able to access it or view transaction histories.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ManageAccount;
