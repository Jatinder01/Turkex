import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, View, Image } from "react-native";
import styles from "./DisableAccountStyle";
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

const DisableAccount = (props) => {
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
        justifyContent: "space-between",
      }}
    >
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
        <Text
          style={{
            marginHorizontal: 16,
            fontFamily: Fonts.medium,
            fontSize: 26,
            color: ThemeManager.colors.textColor1,
          }}
        >
          Disable Account
        </Text>
        <View
          style={{ marginHorizontal: 16, marginVertical: 20, borderRadius: 10 }}
        >
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 16,
              color: ThemeManager.colors.textColor5,
            }}
          >
            Disable your account will cause the following:
          </Text>
          <View
            style={{
              backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
              padding: 15,
              marginTop: 22,
            }}
          >
            <View style={{ flexDirection: "row", marginTop: 7 }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 16,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginLeft: 9,
                }}
              >
                {`All pending withdrawals will be canceled.`}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 7 }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 16,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginLeft: 9,
                }}
              >
                {`All trading capacities for your account will be disabled.`}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 7 }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 16,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginLeft: 9,
                }}
              >
                {`All API keys for your account will be deleted.`}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 7 }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 16,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginLeft: 9,
                }}
              >
                {`All devices for your account will be deleted.`}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 7 }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 16,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginLeft: 9,
                }}
              >
                {`In order to reactivate your account, you will need to contact Binance support.`}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 7 }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 16,
                  color: ThemeManager.colors.inactiveTextColor,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: ThemeManager.colors.inactiveTextColor,
                  marginLeft: 9,
                }}
              >
                {`Verified personal information will not be deleted.`}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 14,
            color: "#F6465D",
            marginHorizontal: 16,
          }}
        >
          If you failed to reactivate your account, please contact customer
          service.
        </Text>
      </View>
      <ButtonPrimary
        title={"Disable Account"}
        onPress={() => {}}
        style={{ bottom: 20 }}
      />
    </SafeAreaView>
  );
};
export default DisableAccount;
