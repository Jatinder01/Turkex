/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Appearance as RNAppearance,
} from "react-native";
import useStyles from "./AppearanceStyle";
import { Wrap } from "../../common/Wrap";
import { Header } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { strings } from "../../../../Localization";
import { string } from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";
import SimpleHeader from "../../common/SimpleHeader";
import { EventRegister } from "react-native-event-listeners";
import { changeThemeAction } from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";

const arrData = [
  {
    title: strings.appearance_screen.dark_mde,
    subTitle: "",
    image: { uri: Images.icon_select },
    selected: false,
    id: 1,
  },
  {
    title: strings.appearance_screen.light_mode,
    subTitle: "",
    image: { uri: Images.icon_select },
    selected: false,
    id: 2,
  },
  // {
  //   title: strings.appearance_screen.use_device,
  //   subTitle: strings.appearance_screen.after_opening,
  //   image: { uri: Images.icon_select },
  //   selected: false,
  //   id: 3,
  // },
];

const Appearance = (props) => {
  const styles = useStyles(ThemeManager);
  const [selectedIndex, setselectedIndex] = useState(null);
  const [darkModeOn, setDarkModeOn] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.addListener("didFocus", () => {
      getDeviceData();
      Actions.refresh();
    });
  }, []);
  const getDeviceData = async () => {
    Singleton.getInstance()
      .getData(constants.IS_THEME_ENABLE)
      .then((res) => {
        if (res === "theme2") {
          setselectedIndex(0);
        } else {
          setselectedIndex(1);
        }
      })
      .catch((err) => {
        Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, "theme1");
        setselectedIndex(1);
      });
  };
  const renderList = (data, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={async () => {
          await Singleton.getInstance()
            .getData(constants.IS_THEME_ENABLE)
            .then(async (res) => {
              let themeValue = "0";
              // console.log("data.id=-=-=-=>>>>", data.id);
              if (data.id === 1) {
                var val = "theme2";
                ThemeManager.setLanguage(val);
                await Singleton.getInstance().saveData(
                  constants.IS_THEME_ENABLE,
                  val
                );
                await Singleton.getInstance().saveData(
                  constants.CURRENT_THEME_MODE,
                  JSON.stringify(1)
                );
                setselectedIndex(0);
                themeValue = "0";
                await Singleton.getInstance().statusChange.updateStatusBar();
                setDarkModeOn(0);
                EventRegister.emit("themeChange", "#171c28");
                dispatch(changeThemeAction("0"));
              } else if (data.id === 2) {
                var val = "theme1";
                ThemeManager.setLanguage(val);
                const valu = ThemeManager.getLanguage();
                await Singleton.getInstance().saveData(
                  constants.IS_THEME_ENABLE,
                  val
                );
                await Singleton.getInstance().saveData(
                  constants.CURRENT_THEME_MODE,
                  JSON.stringify(0)
                );
                await Singleton.getInstance().statusChange.updateStatusBar();
                setselectedIndex(1);
                themeValue = "1";
                setDarkModeOn(1);
                EventRegister.emit("themeChange", "#ffffff");
                dispatch(changeThemeAction("1"));
              } else {
                // setselectedIndex(2);
                const colorScheme = RNAppearance.getColorScheme();
                if (colorScheme === "dark") {
                  var val = "theme2";
                  ThemeManager.setLanguage(val);
                  await Singleton.getInstance().saveData(
                    constants.IS_THEME_ENABLE,
                    val
                  );
                  await Singleton.getInstance().saveData(
                    constants.CURRENT_THEME_MODE,
                    JSON.stringify(1)
                  );
                  themeValue = "0";
                  setselectedIndex(2);
                  EventRegister.emit("themeChange", "#171c28");
                  await Singleton.getInstance().statusChange.updateStatusBar();
                } else if (colorScheme === "light") {
                  var val = "theme1";
                  ThemeManager.setLanguage(val);
                  await Singleton.getInstance().saveData(
                    constants.IS_THEME_ENABLE,
                    val
                  );
                  await Singleton.getInstance().saveData(
                    constants.CURRENT_THEME_MODE,
                    JSON.stringify(0)
                  );
                  setselectedIndex(2);
                  themeValue = "1";
                  await Singleton.getInstance().statusChange.updateStatusBar();
                  EventRegister.emit("themeChange", "#ffffff");
                }
                dispatch(changeThemeAction(themeValue));
              }
              try {
                const jsonValue = await AsyncStorage.getItem("theme");
              } catch (e) {}
            });
        }}
      >
        <View>
          <View style={styles.rowBtn}>
            <Text style={styles.titleTextStyle}>{data.title}</Text>
            {selectedIndex == index ? (
              <Image style={styles.selectedIcon} source={data.image} />
            ) : (
              <View />
            )}
          </View>
          <Text style={styles.subStyle}>{data.subTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <SimpleHeader
            titleName={" "}
            backImageColor={styles.backImageStyle}
            // titleName={'kjjkh'}
            titleStyle={styles.headerTitle}
            onBackPress={() => {
              Actions.pop();
            }}
          />
        </View>

        <Text style={styles.topTextStyle}>
          {strings.appearance_screen.appearance}
        </Text>
        <View style={styles.listStyle}>{arrData.map(renderList)}</View>
      </View>
    </SafeAreaView>
  );
};

export default Appearance;
