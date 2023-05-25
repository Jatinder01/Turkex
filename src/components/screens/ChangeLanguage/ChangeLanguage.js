/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, View, Image } from "react-native";
import useStyles from "./ChangeLanguageStyle";
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, Header, Loader } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { strings } from "../../../../Localization";
import { string } from "prop-types";
import { useSelector } from "react-redux";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";
import SimpleHeader from "../../common/SimpleHeader";

const arrData = [
  {
    title: "English",
    image: { uri: Images.icon_select },
    selected: false,
  },
  // {
  //   title: "简体中文",
  //   image: { uri: Images.icon_select },
  //   selected: false,
  // },
];

const ChangeLanguage = () => {
  const styles = useStyles(ThemeManager);
  const [selectedIndex, setselectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isThemeUpdate } = useSelector((state) => state?.tradeReducer);
  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    await Singleton.getInstance()
      .getData(constants.SET_LANGUAGE)
      .then((res) => {
        if (res === "English") {
          strings.setLanguage("English");
          setselectedIndex(0);
        } else if (res === "简体中文") {
          strings.setLanguage("简体中文");
          setselectedIndex(1);
        }
        setTimeout(() => {
          setLoading(false);
        }, 200);
      });
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <SimpleHeader
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <Text style={styles.langText}>{strings.language_screen.language}</Text>
      <Loader isLoading={loading} />
      {loading ? null : (
        <View style={styles.marginView}>
          {arrData.map((data, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={async () => {
                  setselectedIndex(index);
                  strings.setLanguage(data.title);
                  await Singleton.getInstance().saveData(
                    constants.SET_LANGUAGE,
                    data.title
                  );
                }}
              >
                <View style={styles.viewHeight}>
                  <View style={styles.rowView}>
                    <Text style={styles.titleStyle}>{data.title}</Text>
                    {selectedIndex == index && (
                      <Image style={styles.iconStyle} source={data.image} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChangeLanguage;
