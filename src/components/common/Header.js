import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors, Images, Fonts } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import fonts from "../../theme/fonts";

const Header = ({
  btnTextLeft,
  btnTextRight,
  rightButtonClicked,
  leftButtonClicked,
  titleCenter,
  customCenterTitle,
  mainView,
  leftImage,
  rightImage,
  customLeftTitle,
  customRightTitle,
  customRightImage,
  custmImg,
  custmRightBtn,
  disabled,
  textClicked,
}) => {
  const { textStyle, viewStyle } = styles;
  return (
    <View
      // onPress={rightButtonClicked}
      style={[
        styles.viewMainContainer,
        mainView,
        { backgroundColor: ThemeManager.colors.dashboardDarkBg },
      ]}
      // disabled={titleCenter ? true : false}
    >
      <View style={viewStyle}>
        <View
          // disabled={disabled}
          disabled={titleCenter ? true : false}
          style={[styles.btnBackWhite]}
          onPress={leftButtonClicked}
        >
          {btnTextLeft && (
            <Image
              source={leftImage}
              style={[
                {
                  width: 20,
                  height: 20,
                  // tintColor: ThemeManager.colors.headTxt,
                  resizeMode: "contain",
                },
                custmImg,
              ]}
            />
          )}
          <Text
            style={[
              styles.btnText,
              customLeftTitle,
              { color: ThemeManager.colors.headTxt },
            ]}
            onPress={textClicked}
          >
            {btnTextLeft}
          </Text>
        </View>
        {titleCenter && (
          <Text
            style={
              ([styles.centerTitleText, customCenterTitle],
              {
                fontFamily: fonts.medium,
                fontSize: 18,
                color: ThemeManager.colors.headTxt,
              })
            }
          >
            {titleCenter}
          </Text>
        )}
        {btnTextRight && (
          <View
            // disabled={titleCenter ? true : false}
            // disabled={disabled}
            style={[
              styles.btnBackWhite,
              { justifyContent: "center" },
              custmRightBtn,
            ]}
            // onPress={rightButtonClicked}
          >
            <Text style={[customRightTitle]}>{btnTextRight}</Text>
            {rightImage && (
              <Image source={rightImage} style={customRightImage} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewMainContainer: {
    width: "100%",
  },
  viewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  btnBackWhite: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // color: '#fff',
    color: colors.black,
  },
  btnText: {
    fontSize: 18,
    // color: '#fff',

    marginLeft: 10,
  },
  textStyle: {
    fontSize: 20,
    color: "#fff",
  },
  profieImage: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 100,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centerTitleText: {
    fontSize: 18,
    fontFamily: fonts.regular,
  },
});
export { Header };
