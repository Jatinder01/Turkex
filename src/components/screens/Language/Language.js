import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, View, Image } from "react-native";
import styles from "./LanguageStyle";
import { Wrap } from "../../common/Wrap";
import { ButtonPrimary, Header } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { strings } from "../../../../Localization";
import { string } from "prop-types";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";

const arrData = [
  {
    title: "English",
    image: { uri: Images.Home_Active },
    selected: false,
  },
  {
    title: "Lorem Ipsum",
    image: { uri: Images.Home_Active },
    selected: false,
  },
  {
    title: "Lorem Ipsum",
    image: { uri: Images.Home_Active },
    selected: false,
  },
];

const Language = (props) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const [isSelectedMode, setSelectedMode] = useState(" ");

  useEffect(() => {
    props.navigation.addListener("didFocus", () => {
      themeStatus();
      Actions.refresh();
    });
  }, []);
  const themeStatus = () => {
    Singleton.getInstance()
      .getData(constants.IS_THEME_ENABLE)
      .then((res) => {
        if (res === "theme2") {
          setSelectedMode("Dark Mode");
        } else {
          setSelectedMode("Light Mode");
        }
      })
      .catch((err) => {
        Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, "theme1");
        setSelectedMode("Light Mode");
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}
    >
      <Header
        mainView={{ marginHorizontal: 16 }}
        leftImage={{ uri: ThemeManager.ImageIcons.icon_back }}
        btnTextLeft=" "
        btnTextRight=" "
        leftButtonClicked={() => {
          Actions.pop();
        }}
      />
      <Text
        style={{
          marginHorizontal: 16,
          fontFamily: Fonts.medium,
          fontSize: 22,
          color: ThemeManager.colors.textColor1,
        }}
      >
        Language
      </Text>
      <View style={{ marginHorizontal: 16, marginVertical: 20 }}>
        {arrData.map((data, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setselectedIndex(index);
              }}
            >
              <View style={{ height: 50 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.regular,
                      fontSize: 16,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {data.title}
                  </Text>
                  {selectedIndex == index && (
                    <Image
                      style={{ width: 20, height: 16 }}
                      source={data.image}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
// Language.navigationOptions = ({navigation}) => {
//   // console.log(Utils.testVariable);
//   return {
//     header: null,
//     animation: 'fade_from_bottom',
//     cardStyle: {backgroundColor: ThemeManager.colors.DashboardBG},
//     // animationEnabled: false,
//     cardStyleInterpolator: ({current: {progress}}) => ({
//       cardStyle: {
//         opacity: progress.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, 1],
//         }),
//       },
//       overlayStyle: {
//         opacity: progress.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, 0.5],
//           extrapolate: 'clamp',
//         }),
//       },
//     }),
//   };
// };
export default Language;
