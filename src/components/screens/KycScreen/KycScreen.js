/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Loader, Wrap } from "../../common";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../../ThemeManager";
import WebView from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import * as constants from "../../../Constants";
import Singleton from "../../../Singleton";
import { getMultiLingualData } from "../../../../Utils";
import DeviceCountry, {
  TYPE_ANY,
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
} from "react-native-device-country";
import { Fonts } from "../../../theme";
import END_POINT from "../../../EndPoints";
import { CoinCultApi } from "../../../api";
import { getProfile1 } from "../../../Redux/Actions";
let fiatArr = [];
let coinArr = [];
const KycScreen = (props) => {
  const dispatch = useDispatch();
  const webViewRef = useRef();
  const { isThemeUpdate } = useSelector((state) => state?.tradeReducer);
  const [buySelected, setBuySelected] = useState(props.buySell);
  const [showLoader, setShowLoader] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [tierLevel, setTierLevel] = useState("");

  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);

  useEffect(() => {
    getAccessToken();
  }, []);
  const getAccessToken = (_) => {
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((response) => {
        dispatch(getProfile1())
          .then((responseProfile) => {
            let emailId = responseProfile.email;
            let phone = responseProfile.phones[0].number;
            let dt = response.replace("Bearer ", "");

            CoinCultApi.post(
              END_POINT.GET_SUMSUB_TOKEN,
              { level: props.keyLevel },
              {
                headers: {
                  contentType: "application/json",
                  // 'X-CSRF-Token': res,
                  Authorization: response,
                },
              }
            )
              .then((res) => {
                setWebUrl(
                  END_POINT.SUMSUB_WEB_URL +
                    res?.data?.token +
                    "/" +
                    emailId +
                    "/" +
                    phone
                );
              })
              .catch((err) => {
                Actions.currentScene != "KycLevel" && Actions.pop();
                Singleton.getInstance().showError(
                  getMultiLingualData(err?.response?.data?.errors[0])
                );
              });
          })
          .catch(() => {});
      });
  };

  return (
    <>
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.tabBackground }}
        screenStyle={[
          { backgroundColor: ThemeManager.colors.tabBackground, flex: 1 },
        ]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={{ backgroundColor: ThemeManager.colors.tabBackground }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginTop: 10,
              marginHorizontal: 15,
              height: 50,
              //   flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Actions.pop();
                // setShowWeb(false);
                //   setShowConvertModal(false);
              }}
            >
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_back }}
                style={{ height: 20, width: 20, resizeMode: "contain" }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: ThemeManager.colors.textColor1,
                fontFamily: Fonts.medium,
                fontSize: 18,
              }}
            >
              {"KYC"}
            </Text>
            <View style={{ width: 30 }} />
          </View>
          <>
            {webUrl !== "" ? (
              <WebView
                source={{
                  // uri: 'https://stage-exchange.xchangemonster.com/access-token/:token',
                  // uri: `${'https://stage-exchange.xchangemonster.com/access-token/'}${accessToken}`,
                  // uri: webUrl,
                  // uri: 'https://stage-exchange.xchangemonster.com/verification/_act-sbx-6d91fe17-dbb4-412b-bb53-3f84413936b1',

                  uri: webUrl,
                  // headers: {
                  //   Authorization: accessToken,
                  // },
                }}
                ref={(ref) => (webViewRef.current = ref)}
                allowsInlineMediaPlayback={true}
                cacheEnabled={true}
                geolocationEnabled={false}
                javaScriptEnabled
                javaScriptEnabledAndroid={true}
                //               injectedJavaScriptBeforeContentLoaded={`
                //   window.onerror = function(message, sourcefile, lineno, colno, error) {
                //     alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
                //     return true;
                //   };
                //   true;
                // `}
                mediaPlaybackRequiresUserAction={false}
                mixedContentMode={"compatibility"}
                originWhitelist={["*"]}
                scalesPageToFit
                startInLoadingState={true}
                useWebkit
                bounces={true}
                // userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"

                onShouldStartLoadWithRequest={() => true}
                onLoadStart={() => setShowLoader(true)}
                onLoad={() => setShowLoader(false)}
                domStorageEnabled={true}
                onNavigationStateChange={(data) => {
                  if (data?.url?.includes("success")) {
                    Actions.currentScene != "KycLevel" && Actions.pop();
                    // Alert.alert(
                    //   constants.APP_NAME_CAPS,
                    //   "Your request has been submitted !"
                    // );
                    Singleton.getInstance().showError(
                      "Your request has been submitted !"
                    );
                  } else if (data?.url?.includes("fail")) {
                    // setShowWeb(false);
                    Actions.currentScene != "KycLevel" && Actions.pop();
                    // Alert.alert(
                    //   constants.APP_NAME_CAPS,
                    //   "Your request has been submitted !"
                    // );
                    Singleton.getInstance().showError(
                      "Your request has been submitted !"
                    );
                  }
                }}
                onMessage={(event) => {
                  console.log(
                    "event.nativeEvent.data-=-=-=>>>",
                    event.nativeEvent.data
                  );
                }}
              />
            ) : null}
          </>

          {/* <Loader isLoading={showLoader} /> */}
        </View>
      </Wrap>
    </>
  );
};

export default KycScreen;
