import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, Fonts, Images } from "../../../theme";
import styles from "./BankAccountStyle";
import { ThemeManager, LanguageManager } from "../../../../ThemeManager";
import { emailRegex, passwordRegEx } from "../../../Utils";
import {
  InputWithLabel,
  Header,
  Button,
  HeaderWithoutImage,
} from "../../common";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";

export const BankAccount = () => {
  const [email, setEmail] = useState("");
  const [coinArray, setCoinArray] = useState([]);
  const bankData = useSelector((state) => state.BankaccountReducer.bankDetails);

  useEffect(() => {
    let arrr = [];

    setCoinArray((result) => [...result, arrr]);
  }, []);

  const nextForgot = () => {
    if (!emailRegex.test(email.replace(/\s/g, ""))) {
      alert("Please enter valid email");
    } else {
      Actions.Verification({ email_mobile: email });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: ThemeManager.colors.buttonBgColor,
          width: "95%",
          height: 80,
          borderRadius: 8,
          alignSelf: "center",
          margin: 5,
        }}
      >
        <View
          style={{
            padding: 5,
            height: 49,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "flex-start", width: "15%" }}>
            <FastImage
              style={{ height: 35, width: 35, marginLeft: 5 }}
              source={{
                uri: Images.bank_icon,
                priority: FastImage.priority.normal,
              }}
            />
          </View>

          <View
            style={{
              height: 49,
              width: "65%",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: ThemeManager.colors.txt_white_black,
                fontFamily: Fonts.PoppinsSemiBold,
              }}
            >
              {item.bankName}
            </Text>
          </View>
          <View style={{ width: "20%", alignItems: "center" }}>
            <View
              style={{
                backgroundColor:
                  item.verified == "Verified" ? "#00C566" : "#A7AEBF",
                height: 25,
                borderRadius: 5,
                width: 48,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: 10, color: Colors.PrimaryDark }}>
                {item.verified}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ height: 29, alignItems: "flex-start" }}>
          <Text
            style={{
              fontSize: 10,
              marginLeft: 55,
              color: "#1394DC",
            }}
          >
            {item.accountNumber}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: ThemeManager.colors.backgroundColor,
          flex: 1,
        }}
      ></SafeAreaView>
      {/* <StatusBar
        backgroundColor={ThemeManager.colors.backgroundColor}
        barStyle="light-content"
      /> */}

      <SafeAreaView
        style={[
          styles.root,
          { backgroundColor: ThemeManager.colors.backgroundColor },
        ]}
      >
        <View
          style={[
            styles.ViewMainContainer,
            { backgroundColor: ThemeManager.colors.backgroundColor },
          ]}
        >
          <HeaderWithoutImage
            onPress={() =>
              Actions.currentScene != "UserSetting" && Actions.UserSetting()
            }
            onPressAdd={() =>
              Actions.currentScene != "AddBankAccount" &&
              Actions.AddBankAccount()
            }
            titleColor={ThemeManager.colors.txt_white_black}
            header={LanguageManager.settings.bank_account}
          />
          <View
            style={{ width: "100%", marginTop: 20, flex: 1, marginBottom: 40 }}
          >
            <FlatList
              data={bankData}
              style={{ backgroundColor: "transparent" }}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
