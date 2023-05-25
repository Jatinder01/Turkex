/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import React, { Component, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Alert,
  AppState,
  Appearance,
  StatusBar,
  SafeAreaView,
  Platform,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { Provider } from "react-redux";
import { Actions } from "react-native-router-flux";
import { createStore, applyMiddleware } from "redux";
import { firebase } from "@react-native-firebase/messaging";
import ReduxThunk from "redux-thunk";
import NetInfo from "@react-native-community/netinfo";
import { persistedReducer } from "././Redux/Reducers";
import Router from "./Router";
import Singleton from "././Singleton";
import {
  getProfile,
  stopAllConnection,
  logoutUser,
  tradeValuesUpdate,
  testSession,
  refreshTestSession,
  stopMarketTickerConnection,
  callMarketTicker,
  stopFavMarketTickerConnection,
  favMarketTicker,
} from "./Redux/Actions";
import * as constants from "././Constants";
import {
  showMessage,
  hideMessage,
  renderFlashMessageIcon,
} from "react-native-flash-message";
import messaging from "@react-native-firebase/messaging";
import FlashMessage from "react-native-flash-message";
import { colors, audioFile, Fonts, Images } from "./theme";
import { ThemeManager } from "../ThemeManager";
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from "react-native-navigation-bar-color";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import analytics from "@react-native-firebase/analytics";
import firebaseApp from "@react-native-firebase/app";
import { Loader, MaintenanceScreen, Wrap } from "./components/common";
import { CoinCultApi } from "./api/CoinCultApi";
import END_POINT from "./EndPoints";
import AppBg from "./components/common/AppBg";
import moment from "moment";
import { APIClient } from "./api";
var Sound = require("react-native-sound");
const store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store);
let previousState = "";
var count = 0;
const App = () => {
  // const [count, setCount] = useState(0);
  global.fetchRefreshToken = "yes";

  StatusBar.setBarStyle("dark-content");

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    global.fromMarket = false;
    // initialiseFirebase();
    firebaseMethods();
    notificationTasks();
    NetInfo.addEventListener(checkConnection);
    // getProfile();
    themeStatus();
    // openShow();
    // setTimeout(() => {
    //   Singleton.getInstance().showMaintenance.showMaintenanceAlert(true);
    // }, 5000);
    return () => {
      subscription.remove();
      // subscribe1.remove();
    };
  }, []);
  const customRenderFlashMessageIcon = (
    icon = "success",
    style = {},
    customProps = {}
  ) => {
    switch (icon) {
      case "success":
        return (
          <Image
            source={{ uri: Images.icon_card_logo }}
            style={{
              height: 20,
              width: 20,
              resizeMode: "stretch",
              marginRight: 10,
            }}
          />
        );
      case "circle":
        return (
          <View
            style={{
              width: 21,
              height: 21,
              backgroundColor: "purple",
              borderRadius: 21,
              marginRight: 20,
            }}
          />
        );
    }

    // it's good to inherit the original method...
    return renderFlashMessageIcon(icon, style, customProps);
  };
  // _handleAppStateChange = (nextAppState) => {
  //   if (this.previousState == "background" && nextAppState == "active") {
  //     console.log('foreground_state');
  //     // open socket
  //     if (Actions.currentScene == "_Trade") {
  //       store.dispatch(refreshTradeScreen())
  //     }
  //     if (Actions.currentScene == "_Home") {
  //       Singleton.getInstance().socketTicker.connect()
  //     }

  //   } else {
  //     // close socket
  //     console.log('background_state');
  //     store.dispatch(disconnectTicker())
  //     let pairName = store.getState()?.AllOrderReducer?.pairSelectedPair?.replace('_', '') || "BTCUSDT"
  //     let pairKey = store.getState().marketSocket.pairData[pairName]?.pairName?.toUpperCase()
  //     console.log("pairKey---------", pairKey);
  //     // Singleton.getInstance().GraphSocket.removeListener();
  //     Singleton.getInstance().GraphSocket.removeListener(
  //       `${pairKey}_BINANCE_ORDERBOOK`,
  //     );
  //     Singleton.getInstance().GraphSocket.removeListener(
  //       `${pairKey}_TRADE_ORDERBOOK`,
  //     );
  //     Singleton.getInstance().socketTicker.disconnect()
  //     Singleton.getInstance().socketTicker.on('disconnect');
  //     // store.dispatch(disconnectTicker())
  //   }
  //   this.previousState = nextAppState;

  // };
  const handleAppStateChange = (nextAppState) => {
    // console.log("nextAppState------++++---", nextAppState);
    if (previousState == "background" && nextAppState == "active") {
      // console.log("nextAppState------++++-111");
      // //     // open socket
      // console.log("nextAppStatActions.currentScene--", Actions.currentScene);
      // store.dispatch(callMarketTicker());

      // if (Actions.currentScene == "_Trades") {
      //   // store.dispatch(refreshTradeScreen())
      // }
      // if (Actions.currentScene == "_Home") {
      //   // Singleton.getInstance().socketTicker.connect()
      // }
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          console.log("isLogin=handleAppStateChange======", isLogin);
          checkSessionMaintaining();
          if (isLogin == "true") {
            store.dispatch(favMarketTicker());
            refreshTestSession()
              .then((res) => {
                // console.log("=handleAppStateChange======", res);
                // checkSessionMaintaining();
              })
              .catch((err) => {
                Actions.currentScene != "Main" && Actions.replace("Main");
              });
          } else {
            // console.log("else=handleAppStateChange======");
            // checkSessionMaintaining();
          }
        });
    } else {
      stopMarketTickerConnection();
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          console.log("isLogin=handleAppStateChange======", isLogin);
          checkSessionMaintaining();
          if (isLogin == "true") {
            stopFavMarketTickerConnection();
          } else {
            // console.log("else=handleAppStateChange======");
            // checkSessionMaintaining();
          }
        });
    }
    // console.log("fgd0------++-22--", previousState);
    previousState = nextAppState;
    // console.log("fgd0------++---", previousState);
  };

  const initialiseFirebase = async () => {
    // const instance = {
    //   apiKey: 'AIzaSyAts4ynvWCdIgbijzvvmXNaFOxc5KOnQIY',
    // };
    // await firebaseApp.initializeApp(instance);
  };
  const checkSessionMaintaining = () => {
    console.log("Narender =====>>>>1");
    APIClient.getInstance()
      .getWithoutAuthFullResponse(END_POINT.MAINTENANCE_SCREEN_URL)
      // CoinCultApi.get(END_POINT.MAINTENANCE_SCREEN_URL)
      .then((response) => {
        console.log("Narender ===++=+++=>>>>", response);
        let res = response;
        // console.log("Narender ===++==>>>>res-----", res);
        // console.log("Narender ===++==>>>res?.status----", res?.status);

        // console.log("Narender ===++=res?.bodyString---22--", res?.bodyString);

        if (response?.status == "200") {
          let data = JSON.parse(response?.bodyString);
          // console.log("Narender ===++==>>>>data11", data);

          let status = data == "false" ? false : true;
          // console.log("Narender =====>>>>status", status);
          if (status != null) {
            Singleton.getInstance().showMaintenance?.showMaintenanceAlert(
              status
            );
          }
        }
      })
      .catch((error) => {
        console.log("Narender error ===++==>>>>", error);
        setTimeout(() => {
          if (count <= 5) {
            checkSessionMaintaining();
          }
          count += 1;
        }, 2000);
        console.log(
          "Error checkSessionMaintaining error details",
          JSON.stringify(error)
        );
      });
  };
  const firebaseMethods = () => {
    // alert("firebase");
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        // User has authorised
        firebase
          .messaging()
          .getToken()
          .then((res) => {
            // console.log("requestPermission DeviceToken====>", res);
            // console.log('DeviceToken====>', res);
            Singleton.getInstance().deviceToken = res;
          })
          .catch((err) => { });
      })
      .catch((error) => {
        // User has rejected permissions
      });

    // Singleton.getInstance()
    //   .getData(constants.ACCESS_TOKEN)
    //   .then((res) => {
    //     Singleton.getInstance().accessToken = res;
    //   })
    //   .catch((err) => {});
    Singleton.getInstance()
      .getDataSecure(constants.ACCESS_TOKEN)
      .then((res) => {
        // console.log("getDataSecure=========>", res);
        Singleton.getInstance().accessToken = res;
      })
      .catch((err) => { });
  };

  const notificationTasks = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log(
      //   "Notification caused app to open from background state:=-=-=",
      //   remoteMessage
      // );
      if (remoteMessage?.data?.type === "UnderMaintenance") {
        Singleton.getInstance().showMaintenance != null &&
          Singleton.getInstance().showMaintenance?.showMaintenanceAlert(true);
      } else {
        onPressNotificationFromBackground(remoteMessage.data);
      }
    });

    messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived:==--- ", remoteMessage);
      if (remoteMessage?.data?.type === "UnderMaintenance") {
        Singleton.getInstance().showMaintenance != null &&
          Singleton.getInstance().showMaintenance?.showMaintenanceAlert(true);
      } else {
        let msg = remoteMessage.notification.body;
        // let fcm_id = remoteMessage?.data?.fcm_id;
        let fcm_id = remoteMessage?.data?.type;
        console.log("A new FCM message arrived:==-fcm_id-- ", fcm_id);
        Singleton.getInstance()
          .getData(constants.IS_LOGIN)
          .then((isLogin) => {
            if (isLogin == "true") {
              showNotifyData(msg, fcm_id, remoteMessage?.data);
            }
          });
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          );
          onPressNotificationFromBackground(remoteMessage.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const audioCallback = (error, sound) => {
    if (error) {
      console.error("error", error.message);
      return;
    }
    sound.play(() => {
      sound.release();
    });
  };
  const showNotifyData = (msg, type, data) => {
    console.log("notify=====++========" + msg, type);
    // const sound = new Sound(audioFile.notificationSound, error =>
    //   audioCallback(error, sound),
    // );
    if (type === "UnderMaintenance") {
      Singleton.getInstance().showMaintenance != null &&
        Singleton.getInstance().showMaintenance?.showMaintenanceAlert(true);
    } else {
      if (
        type == "document" ||
        type == "Enable Authentication" ||
        type == "phone"
      ) {
        getProfile(store.dispatch);
      }
      showMessage({
        message: msg,
        backgroundColor: ThemeManager.colors.tabBottomBorder,
        autoHide: true,
        duration: 6000,
        type: "success",
        icon: { icon: "success", position: "left" },
        onPress: () => {
          if (
            type == "document" ||
            type == "Enable Authentication" ||
            type == "phone"
          ) {
            Actions.currentScene != "Notifications" && Actions.Notifications();
          } else if (type == "Trade") {
            var markerID = data?.market_id;
            Actions.currentScene != "Notifications" && Actions.Notifications();
            // Actions.currentScene != "OrderHistory" &&
            //   Actions.SpotTrade({ selectedPair: markerID });
          } else if (
            type == "Withdraw" ||
            type == "Withdraws" ||
            type == "Deposit"
          ) {
            // Actions.currentScene != "Wallets" && Actions.Wallets();
            Actions.currentScene != "Notifications" && Actions.Notifications();
          }
        },
      });
    }
  };
  const onPressNotificationFromBackground = (data) => {
    console.log("check data=-=-=-=-=-=->>>>>>", data);
    if (data?.type === "UnderMaintenance") {
      Singleton.getInstance().showMaintenance != null &&
        Singleton.getInstance().showMaintenance?.showMaintenanceAlert(true);
    } else {
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          if (isLogin == "true") {
            if (Actions.currentScene == "Splash") {
              global.checkNotify = data;
            } else {
              Actions.currentScene != "Notifications" &&
                Actions.Notifications();
            }
          }
        });
    }
  };

  const themeStatus = () => {
    Singleton.getInstance()
      .getData(constants.IS_THEME_ENABLE)
      .then((res) => {
        ThemeManager.setLanguage(res);
      })
      .catch((err) => {
        Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, "theme1");
      });
  };

  const checkConnection = (state) => {
    console.log("Internet State: ", state);
    global.isConnected = state.isConnected;
    global.ipAddress = state.details.ipAddress;
    global.isInternetReachable =
      state.isInternetReachable == null ? true : state.isInternetReachable;
    showNetworkErr();
  };

  const showNetworkErr = () => {
    if (!global.isConnected || !global.isInternetReachable) {
      Singleton.getInstance().showError("NO INTERNET");
    } else {
      hideMessage();
    }
  };

  return (
    <>
      <AppBg>
        <CustomStatus
          ref={(ref) => {
            Singleton.getInstance().statusChange = ref;
          }}
        />
        <MaintenanceAlert
          ref={(ref) => {
            Singleton.getInstance().showMaintenance = ref;
          }}
        />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <View style={{ backgroundColor: "rgba(0, 7, 0, 0.01)", flex: 1 }}>
              <Router
                onRouteChanged={(state) => {
                  // console.log("s--+++---++++++--", Actions.currentScene);
                  Singleton.getInstance()
                    .getData(constants.IS_LOGIN)
                    .then((isLogin) => {
                      if (isLogin == "true") {
                        // console.log("s--+++---++++++--isLogin1", isLogin);
                        if (Actions.currentScene == "Splash") {
                          // global.checkNotify = data;
                        } else {
                          // global.fetchRefreshToken = "yes";
                          Singleton.getInstance().checkSessionTimeout();
                        }
                      } else {
                        // console.log('s--+++---++++++--isLogin2', isLogin);
                        // console.log('s--+++---++++++--2', Actions.currentScene);
                        if (Actions.currentScene === "_Wallets") {
                          // console.log('alert =-=-=-=-=-=-=home');
                          Actions.currentScene != "Login" &&
                            Actions.push("Login");
                        }
                      }
                    });
                }}
              //stopAllConnection
              />
            </View>
            {/* <FlashMessage position="top" /> */}
            <FlashMessage
              renderFlashMessageIcon={customRenderFlashMessageIcon}
            />
          </PersistGate>
        </Provider>
      </AppBg>
    </>
  );
};

export default App;

export class CustomStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: "none",
    };
    setTimeout(() => {
      const colorScheme = Appearance.getColorScheme();
      this.updateStatusBar(colorScheme);
    }, 1000);
  }
  componentDidMount() {
    this.themelistener = Appearance.addChangeListener((listner) => {
      this.updateStatusBar(listner?.colorScheme);
      // console.log("listner?.colorScheme--", listner?.colorScheme);
    });
  }
  componentWillUnmount() {
    this.themelistener?.remove();
  }

  updateStatusBar(colorScheme) {
    console.log(" START updateStatusBar=-=-ismode colorScheme=", colorScheme);

    Singleton.getInstance()
      .getData(constants.CURRENT_THEME_MODE)
      .then(async (isMode) => {
        console.log("updateStatusBar=-=-ismode", isMode);
        if (isMode === "2") {
          const tempThemeStatus = Appearance.getColorScheme();
          const finalThemeStatus =
            colorScheme != undefined ? colorScheme : tempThemeStatus;
          console.log(" isMode === 2 -------finalThemeStatus-------->", finalThemeStatus);
          if (finalThemeStatus === "dark") {
            if (Platform.OS == "android") {
              changeNavigationBarColor("#171c28");
              StatusBar.setBackgroundColor("#171c28");
              StatusBar.setBarStyle("light-content");
            }
            var val = "theme2";
            ThemeManager.setLanguage(val);
            await Singleton.getInstance().saveData(
              constants.IS_THEME_ENABLE,
              val
            );
            await Singleton.getInstance().saveData(
              constants.CURRENT_THEME_MODE,
              JSON.stringify(2)
            );
            this.setState({ darkMode: true });
            // store.dispatch(
            //   tradeValuesUpdate({prop: 'isThemeUpdate', value: new Date()}),
            // );
          } else {
            if (Platform.OS == "android") {
              changeNavigationBarColor("#FFFFFF", true);
              StatusBar.setBackgroundColor("#FFFFFF");
              StatusBar.setBarStyle("dark-content");
            }
            var val = "theme1";
            ThemeManager.setLanguage(val);
            await Singleton.getInstance().saveData(
              constants.IS_THEME_ENABLE,
              val
            );
            await Singleton.getInstance().saveData(
              constants.CURRENT_THEME_MODE,
              JSON.stringify(2)
            );
            this.setState({ darkMode: false });
            // store.dispatch(
            //   tradeValuesUpdate({prop: 'isThemeUpdate', value: new Date()}),
            // );
          }
        } else {
          Singleton.getInstance()
            .getData(constants.IS_THEME_ENABLE)
            .then(async (status) => {

              console.log("updateStatusBar=-= - --- In case when enter in app at First Time ----  status", status);

              // if (status === "theme2") {
              //   this.setState({ darkMode: true });
              //   if (Platform.OS == "android") {
              //     changeNavigationBarColor("#171c28");
              //     StatusBar.setBackgroundColor("#171c28");
              //     StatusBar.setBarStyle("light-content");
              //   }
              // } else {
              //   this.setState({ darkMode: false });
              //   if (Platform.OS == "android") {
              //     changeNavigationBarColor("#FFFFFF", true);
              //     StatusBar.setBackgroundColor("#FFFFFF");
              //     StatusBar.setBarStyle("dark-content");
              //   }
              // }

              if (status === "theme1") {//DARK
                if (Platform.OS == "android") {
                  changeNavigationBarColor("#171c28");
                  StatusBar.setBackgroundColor("#171c28");
                  StatusBar.setBarStyle("light-content");
                }
                var val = "theme2";
                ThemeManager.setLanguage(val);
                await Singleton.getInstance().saveData(
                  constants.IS_THEME_ENABLE,
                  val
                );
                await Singleton.getInstance().saveData(
                  constants.CURRENT_THEME_MODE,
                  JSON.stringify(2)
                );
                this.setState({ darkMode: true });
                // store.dispatch(
                //   tradeValuesUpdate({prop: 'isThemeUpdate', value: new Date()}),
                // );
              } else {
                if (Platform.OS == "android") {
                  changeNavigationBarColor("#FFFFFF", true);
                  StatusBar.setBackgroundColor("#FFFFFF");
                  StatusBar.setBarStyle("dark-content");
                }
                var val = "theme1";
                ThemeManager.setLanguage(val);
                await Singleton.getInstance().saveData(
                  constants.IS_THEME_ENABLE,
                  val
                );
                await Singleton.getInstance().saveData(
                  constants.CURRENT_THEME_MODE,
                  JSON.stringify(2)
                );
                this.setState({ darkMode: false });
                // store.dispatch(
                //   tradeValuesUpdate({prop: 'isThemeUpdate', value: new Date()}),
                // );
              }


            });
        }
      });
  }

  render() {
    const { darkMode } = this.state;

    return (
      <>
        {Platform.OS == "ios" ? (
          this.state.darkMode == true ? (
            <StatusBar
              backgroundColor={
                this.state.darkMode == false ? "#fff" : "#171c28"
              }
              barStyle="light-content"
              translucent={true}
            />
          ) : (
            <StatusBar
              backgroundColor={
                this.state.darkMode == false ? "#fff" : "#171c28"
              }
              barStyle="dark-content"
              translucent={true}
            />
          )
        ) : null}
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor:
              darkMode == "none"
                ? "#FFFFFF"
                : darkMode == true
                  ? "#171c28"
                  : "#FFFFFF",
          }}
        />
      </>
    );
  }
}

export class MaintenanceAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMaintenance: false,
      loader: false,
    };
  }
  componentDidMount() {
    this.checkSessionMaintaining();
  }
  showMaintenanceAlert(state) {
    // console.log("showMaintenanceAlert==-=-0-=->>", state);
    this.setState({ showMaintenance: state });
  }
  checkSessionMaintaining = () => {
    // console.log('checkSessionMaintaining==-=-0-=->>');
    // alert('hi');
    this.setState({
      loader: true,
    });

    // CoinCultApi.get(END_POINT.MAINTENANCE_SCREEN_URL, null)
    APIClient.getInstance()
      .getWithoutAuthFullResponse(END_POINT.MAINTENANCE_SCREEN_URL)
      .then((response) => {
        // console.log("Narender ===++==>>>>11", response);
        // let res = response;
        // console.log("Narender ===++==>>>>res-----11", res);
        // console.log("Narender ===++==>>>res?.status----11", res?.status);

        // console.log("Narender ===++=res?.bodyString-----11", res?.bodyString);

        if (response?.status == "200") {
          let data = JSON.parse(response?.bodyString);
          // console.log("Narender ===++==>>>>data", data);

          let status = data == "false" ? false : true;
          if (status != null) {
            this.showMaintenanceAlert(status);
          }

          // console.log(
          //   'succ=-=checkSessionMaintaining==-=-0++++++-=->>',
          //   response?.data,
          // );
        }
        //      Singleton.getInstance().showMaintenance.showMaintenanceAlert(true);
      })
      .catch((error) => {
        console.log("Narender22 error =====>>>>", error);
        // console.log(
        //   'Narender2 error1 =====>>>>',
        //   JSON.stringify(error?.response?.data),
        // );

        this.setState({
          loader: false,
        });
        // Singleton.getInstance().showError(error?.response?.data);
        // console.log('Error checkSessionMaintaining error details=-=-=-', error);
      });
  };

  render() {
    if (this.state.showMaintenance)
      return (
        <MaintenanceScreen
          viewColor={{ backgroundColor: ThemeManager.colors.tabBackground }}
          maintainTextColor={{ color: ThemeManager.colors.textColor1 }}
          btnColor={{ color: ThemeManager.colors.selectedTextColor }}
          txtColor={{ color: ThemeManager.colors.textColor }}
          loaderState={this.state.loader}
          onPress={() => {
            this.checkSessionMaintaining();
          }}
        />
      );

    return null;
  }
}
