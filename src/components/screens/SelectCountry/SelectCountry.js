import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import styles from "./SelectCountryStyle";
import {
  SubHeaderLinks,
  InputField,
  ButtonPrimary,
  PhoneNumberInput,
  HeaderCancel,
  CountryList,
  Header,
} from "../../common";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";

const SelectCountry = (props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <View>
          <Header
            customCenterTitle={{}}
            rightImage={{ uri: Images.cross }}
            btnTextRight=" "
            customRightImage={{
              width: 23,
              height: 23,
              right: 16,
              tintColor: ThemeManager.colors.textColor,
              resizeMode: "contain",
            }}
            rightButtonClicked={() => {
              Actions.pop();
            }}
          />
          <Text style={styles.title}>{strings.selectCountry.title}</Text>
          <Text style={styles.subTitle}>{strings.selectCountry.subTitle}</Text>
          <View style={{ height: 30 }}></View>
          <InputField
            editable={false}
            leftImage={{ uri: Images.flag }}
            value={"India"}
            image={{ uri: Images.icon_selectCountry_RightArrow }}
            rightImageStyle={{ resizeMode: "contain" }}
          />
          <Text style={styles.inputTitle}>
            {strings.selectCountry.documentTypeTitle}
          </Text>
          <InputField
            editable={false}
            customContainerStyle={{ marginVertical: 10 }}
            leftImage={{ uri: Images.icon_PhotoId }}
            value={"ID Card"}
            image={{ uri: Images.icon_selectCountry_RightArrow }}
            rightImageStyle={{ resizeMode: "contain" }}
          />
          <InputField
            customContainerStyle={{ marginVertical: 10 }}
            editable={false}
            leftImage={{ uri: Images.icon_Passport }}
            value={"Passport"}
            image={{ uri: Images.icon_selectCountry_RightArrow }}
            rightImageStyle={{ resizeMode: "contain" }}
          />
          <InputField
            customContainerStyle={{ marginVertical: 10 }}
            editable={false}
            leftImage={{ uri: Images.icon_ResidencePermit }}
            value={"Residence Permit"}
            image={{ uri: Images.icon_selectCountry_RightArrow }}
            rightImageStyle={{ resizeMode: "contain" }}
          />
          <InputField
            customContainerStyle={{ marginVertical: 10 }}
            editable={false}
            leftImage={{ uri: Images.icon_DriverLicense }}
            value={"Driver License"}
            image={{ uri: Images.icon_selectCountry_RightArrow }}
            rightImageStyle={{ resizeMode: "contain" }}
            Next={() => {
              Actions.currentScene != "VerifyIndentity" &&
                Actions.VerifyIndentity();
            }}
          />
        </View>
        <View>
          <Text
            style={{
              marginBottom: 30,
              alignSelf: "center",
              marginHorizontal: 16,
              color: colors.dashboarItemLightText,
              fontFamily: fonts.regular,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            If you can't find your document type or country of issue, please
            contact support
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectCountry;
