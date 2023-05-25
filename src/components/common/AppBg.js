import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { EventRegister } from "react-native-event-listeners";
import Singleton from "../../Singleton";
// import {CURRENT_THEME_MODE} from '../../Constant';
import * as constants from "../../Constants";
import { ThemeManager } from "../../../ThemeManager";

export default function AppBg(props) {
  const [bgColor, setBgColor] = useState("#fff");
  // const {currentTheme, currentLanguage} = useSelector(
  //   state => state.AuthReducer,
  // );

  useEffect(() => {
    Singleton.getInstance()
      .getData(constants.CURRENT_THEME_MODE)
      .then((res) => {
        // console.log("res=-=-=-=theme=-=", res);
        let color = "#fff";
        if (res != null) {
          color = res == 0 ? "#ffffff" : "#171c28";
          setBgColor(color);
        } else {
          setBgColor("#ffffff");
          // Singleton.getInstance()
          //   .getData(constants.STATUS_BAR_COLOR)
          //   .then((res) => {
          //     console.log("res=-=-=-=STATUS_BAR_COLOR=-=", res);
          //     console.log(
          //       "res=-=-=-=themeColor=-=",
          //       ThemeManager.colors.themeColor
          //     );
          //   });
        }
      });

    EventRegister.addEventListener("themeChange", (color) => {
      console.log("AppBg=-=-=-color>>>", color);
      setBgColor(color);
      Singleton.getInstance().saveData(
        constants.STATUS_BAR_COLOR,
        JSON.stringify(color)
      );
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      {props.children}
    </SafeAreaView>
  );
}
