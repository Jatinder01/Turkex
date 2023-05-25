/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";
import { useSelector } from "react-redux";
import { strings } from "../../../Localization";
import { ThemeManager } from "../../../ThemeManager";
import { Images } from "../../theme";
import { TabIcon } from "./TabIcon";
import Singleton from "../../Singleton";
// import {CURRENT_THEME_MODE} from '../../Constant';
import * as constants from "../../Constants";
function CustomTabBar(props) {
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );

  const { state } = props.navigation;
  const activeTabIndex = state.index;
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: ThemeManager.colors.DashboardBG,
        justifyContent: "space-around",
        alignItems: "center",
        alignContent: "center",
        height: 58,
        // paddingBottom: DeviceInfo.hasNotch() ? 45 : 20,
        // borderWidth: 1,
        borderTopWidth: 0.3,
        // borderColor: '#F5F7FA0F',
        borderTopColor: ThemeManager.colors.textColor,
      }}
    >
      {state.routes.map((element, index) => {
        switch (index) {
          case 0: {
            return (
              <TouchableOpacity
                key={element.key}
                onPress={() => {
                  Actions[element.key]();
                  console.log("element.key-=-=-=>>>", element.key);
                }}
              >
                <TabIcon
                  focused={activeTabIndex == index}
                  title={strings.bottom_tab.Home}
                  ImgSize={{ width: 19, height: 19 }}
                  activeImg={ThemeManager.ImageIcons.icon_home_active}
                  defaultImg={ThemeManager.ImageIcons.icon_home_inactive}
                />
              </TouchableOpacity>
            );
          }

          case 1: {
            return (
              <TouchableOpacity
                key={element.key}
                onPress={() => Actions[element.key]()}
              >
                <TabIcon
                  focused={activeTabIndex == index}
                  title={strings.bottom_tab.Markets}
                  ImgSize={{ width: 19, height: 19 }}
                  activeImg={ThemeManager.ImageIcons.icon_market_active}
                  defaultImg={ThemeManager.ImageIcons.icon_market_inactive}
                />
              </TouchableOpacity>
            );
          }
          case 2: {
            return (
              <TouchableOpacity
                key={element.key}
                onPress={() => Actions[element.key]()}
              >
                <TabIcon
                  focused={activeTabIndex == index}
                  title={strings.bottom_tab.Trades}
                  ImgSize={{ width: 19, height: 19 }}
                  activeImg={ThemeManager.ImageIcons.icon_trade_active}
                  defaultImg={ThemeManager.ImageIcons.icon_trade_inactive}
                />
              </TouchableOpacity>
            );
          }
          case 3: {
            return (
              <TouchableOpacity
                key={element.key}
                onPress={() => {
                  // global.currentScreen = 'tabs';
                  // Actions[element.key]();
                  // console.log('element.key==-=-=>>>', element.key);
                  // const routeName = props.navigation.state.key;
                  Singleton.getInstance()
                    .getData(constants.IS_LOGIN)
                    .then((isLogin) => {
                      if (isLogin == "true") {
                        props.navigation.navigate(element.key);
                      } else {
                        if (
                          element.key == "Wallets" ||
                          element.key == "_Wallets"
                        ) {
                          // props.navigation.navigate('Login');
                          Actions.currentScene != "Login" &&
                            Actions.Login({ fromScreen: "Wallets" });
                        } else {
                          props.navigation.navigate(element.key);
                        }
                      }
                    });
                }}
              >
                <TabIcon
                  focused={activeTabIndex == index}
                  title={strings.bottom_tab.Wallets}
                  ImgSize={{ width: 19, height: 19 }}
                  activeImg={ThemeManager.ImageIcons.icon_wallet_active}
                  defaultImg={ThemeManager.ImageIcons.icon_wallet_inactive}
                />
              </TouchableOpacity>
            );
          }
          case 4: {
            return (
              <TouchableOpacity
                key={element.key}
                onPress={() => {
                  // Actions[element.key]()
                  Singleton.getInstance()
                    .getData(constants.IS_LOGIN)
                    .then((isLogin) => {
                      if (isLogin == "true") {
                        props.navigation.navigate(element.key);
                      } else {
                        if (
                          element.key == "CardsScreen" ||
                          element.key == "_CardsScreen"
                        ) {
                          // props.navigation.navigate('Login');
                          Actions.currentScene != "Login" &&
                            Actions.Login({ fromScreen: "CardsScreen" });
                        } else {
                          props.navigation.navigate(element.key);
                        }
                      }
                    });
                }}
              >
                <TabIcon
                  focused={activeTabIndex == index}
                  title={strings.bottom_tab.Cards}
                  ImgSize={{ width: 19, height: 19 }}
                  activeImg={ThemeManager.ImageIcons.iconCardActive}
                  defaultImg={ThemeManager.ImageIcons.iconCardsInactive}
                />
              </TouchableOpacity>
            );
          }
          default:
            null;
        }
      })}
    </View>
  );
}
export { CustomTabBar };
