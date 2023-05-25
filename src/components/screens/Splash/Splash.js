/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  ImageBackground,
  Dimensions,
  NativeModules,
} from "react-native";
import styles from "./SplashStyle";
// import {Wrap} from '../../common/';
import { Images, Colors, Fonts } from "../../../theme";
import { Actions } from "react-native-router-flux";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";
import { ThemeManager } from "../../../../ThemeManager";
import { Wrap } from "../../common";
import LottieView from "lottie-react-native";
import { useDispatch } from "react-redux";
import { testSession } from "../../../Redux/Actions";
import JailMonkey from "jail-monkey";
import { EventRegister } from "react-native-event-listeners";
import DeviceInfo from "react-native-device-info";
const { height, width } = Dimensions.get("window");
let timeout1, timeout2, timeout3, timeout4;
const Splash = () => {
  // const [animateScale] = useState(new Animated.Value(0));
  const [colorTheme, setColorTheme] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    themeStatus();
    loadUserData()
    // if (JailMonkey.isJailBroken()) {
    //   //   // Alternative behaviour for jail-broken/rooted devices.
    //   alert("Your device is rooted. You cannot proceed.");
    // } else {
    // DeviceInfo.isEmulator().then((isEmulator) => {
    //   // false
    //   // console.log("check devie isemulator=-=>", isEmulator);
    //   if (!isEmulator) {
    //     alert(
    //       "Your device is not a real device or physical device. You cannot proceed."
    //     );
    //   } else {
    //     if (Platform.OS == "android") {
    //       // const { rootStatus } = AtlasNativeModules;
    //       var ClrStorageModule = NativeModules.ClrStorageModule;
    //       ClrStorageModule?.rootStatus()
    //         .then(async (res) => {
    //           if (res) {
    //             res == "It is not rooted device"
    //               ? loadUserData()
    //               : alert("Your device is rooted. You cannot proceed.");
    //           }
    //         })
    //         .catch((err) => {
    //           console.log("ERORRRRRR=====", err);
    //         });
    //     } else {
    //       const { EvoNativeModules } = NativeModules;
    //       loadUserData()
    //       // EvoNativeModules.rootStatus((res) => {
    //       //   res == "It is not rooted device"
    //       //     ? loadUserData()
    //       //     : alert("Your device is rooted. You cannot proceed.");
    //       // });
    //     }
    //   }
    // });
    // }
    return () => {
      setColorTheme("");
      if (timeout1) {
        clearTimeout(timeout1);
      }
      if (timeout2) {
        clearTimeout(timeout2);
      }
      if (timeout3) {
        clearTimeout(timeout3);
      }
      if (timeout4) {
        clearTimeout(timeout4);
      }
    };
  }, []);

  const loadUserData = () => {
    console.log("");
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        if (isLogin == "true") {
          // Actions.Home();

          Singleton.getInstance()
            .getDataSecure(constants.ACCESS_TOKEN)
            .then((res) => {
              // console.log(
              //   "Singleton.getInstance().accessToken = res=-->>",
              //   res
              // );
              Singleton.getInstance().accessToken = res;
              timeout1 = setTimeout(() => {
                dispatch(testSession())
                  .then((response) => {
                    timeout2 = setTimeout(() => {
                      // console.log(
                      //   "testSession=-=-response==",
                      //   JSON.stringify(response)
                      // );
                      Actions.currentScene != "Main" && Actions.replace("Main");
                    }, 1000);
                  })
                  .catch((err) => {
                    console.log("testSession=-=-error==", JSON.stringify(err));
                    // Actions.currentScene != 'Login' &&
                    //   Actions.replace('Login');
                    // Actions.currentScene != "Main" &&
                    //   Actions.replace("Main");
                  });
              }, 150);
            });
        } else {
          timeout3 = setTimeout(() => {
            // Actions.currentScene != 'Login' && Actions.replace('Login');
            Actions.currentScene != "Main" && Actions.replace("Main");
          }, 2200);
        }
      })
      .catch((err) => {
        timeout4 = setTimeout(() => {
          // Actions.currentScene != 'Login' && Actions.replace('Login');
          Actions.currentScene != "Main" && Actions.replace("Main");
        }, 2200);
      });
  };
  const themeStatus = () => {
    let themeValue;
    Singleton.getInstance()
      .getData(constants.IS_THEME_ENABLE)
      .then((res) => {
        global.themeColor = res;
        console.log("check color theme-=-=->>>", res);
        // setColorTheme(res);
        ThemeManager.setLanguage(res);
      })
      .catch((err) => {
        Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, "theme1");
        themeValue = 0;
      });
    // EventRegister.emit('themeChange', themeValue == 0 ? '#ffffff' : '#171c28');
  };
  return (
    <Wrap
      style={{
        backgroundColor: colorTheme == "theme2" ? "#171c28" : "white",
      }}
      screenStyle={{
        backgroundColor: colorTheme == "theme2" ? "#171c28" : "white",
        flex: 1,
      }}
      // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true} .
      bottomStyle={{
        backgroundColor: colorTheme == "theme2" ? "#171c28" : "white",
      }}
    >
      <View
        style={{ backgroundColor: ThemeManager.colors.bgDarkwhite, flex: 1 }}
      >
        {/* {ThemeManager.colors.themeColor === "light" ? ( */}
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          {/* <Image
              source={{ uri: Images.icon_app_logo }}
              style={{ height: 150, width: 150, resizeMode: "contain" }}
            /> */}
          <LottieView
            style={{ height: "100%", width: "100%" }}
            source={Images.splashImage}
            autoPlay
            loop={true}
          />
        </View>
        {/* ) : (
          <ImageBackground
            source={{ uri: Images.icon_background_screen }}
            resizeMode={"cover"}
            style={{ height: height, width: width }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Image
                source={{ uri: Images.icon_app_logo }}
                style={{ height: 150, width: 150, resizeMode: "contain" }}
              />
            </View>
          </ImageBackground>
        )} */}
      </View>
    </Wrap>
  );
};

export default Splash;

