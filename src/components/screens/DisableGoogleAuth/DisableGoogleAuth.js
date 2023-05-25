/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { Text, SafeAreaView, View } from "react-native";
import styles from "./DisableGoogleAuthStyle";
import { ButtonPrimary, Header, InputField, Spinner } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import {
  googledisableFormUpdate,
  disableGoogleAuthUser,
} from "../../../Redux/Actions";
import * as constants from "../../../Constants";
import BorderLine from "../../common/BorderLine";
import SimpleHeader from "../../common/SimpleHeader";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "../../../../Localization";
import { Fonts } from "../../../theme";

const DisableGoogleAuth = () => {
  const { gdisableError, gdisableLoading, code } = useSelector(
    (state) => state?.GoogleDisableReducer
  );
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();

  const renderError = () => {
    return (
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.errorMessageStyle}>{gdisableError}</Text>
      </View>
    );
  };

  const renderSpinner = () => {
    if (gdisableLoading) {
      return <Spinner size="large" />;
    }

    return (
      <ButtonPrimary
        title={"Submit"}
        onPress={() => {
          if (code?.length > 0) {
            dispatch(
              disableGoogleAuthUser({
                code: code,
              })
            );
          } else {
            alert("Please enter a valid Google Authenticator code.");
          }
        }}
      />
    );
  };

  const onButtonPress = () => {};
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
        justifyContent: "space-between",
      }}
    >
      <View style={{ marginHorizontal: 20, height: 40, marginBottom: 15 }}>
        <SimpleHeader
          titleName={"Verification"}
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          // titleName={'kjjkh'}
          titleStyle={{
            fontSize: 18,
            fontFamily: Fonts.medium,
            color: ThemeManager.colors.textColor1,
            // marginLeft: 10,
          }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>
      {/* <View>
        <Header
          titleCenter={'Verification'}
          mainView={{paddingHorizontal: 25}}
          customCenterTitle={{fontSize: 18}}
          leftImage={{uri: ThemeManager.ImageIcons.icon_back_arrow}}
          btnTextLeft=" "
          btnTextRight=" "
          leftButtonClicked={() => {
            Actions.pop();
          }}
        />
      </View> */}

      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 100 }}>
          <Text
            style={[styles.heading, { color: ThemeManager.colors.textColor1 }]}
          >
            Enter 2FA code from the app
          </Text>
          <InputField
            editable={true}
            customContainerStyle={{
              // borderWidth: 1,
              // borderColor: ThemeManager.colors.textColor1,
              backgroundColor: ThemeManager.colors.SwapInput,
              borderRadius: 6,
            }}
            title={`EG. "303454"`}
            // value={123654}
            // onChangeText={value => {
            //   dispatch(
            //     googledisableFormUpdate({
            //       prop: 'code',
            //       value,
            //     }),
            //   );
            // }}
            inputStyle={{ color: ThemeManager.colors.textColor1 }}
            value={otp}
            onChangeText={(value) => {
              if (constants.ACCOUNT_NUMBER_REGEX.test(value)) {
                setOtp(value);
                dispatch(
                  googledisableFormUpdate({
                    prop: "code",
                    value,
                  })
                );
              }
            }}
            maxlength={6}
            keyboardType="numeric"
            returnKeyType={"done"}
          />
          {renderError()}
          {renderSpinner()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DisableGoogleAuth;
