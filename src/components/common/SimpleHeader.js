/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Fonts, Images } from "../../theme";

const SimpleHeader = (props) => {
  const [size, setSize] = useState(0);
  const onLayout = (event) => {
    let x = event.nativeEvent.layout;
    setSize(x.width);
  };
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 10,
        flex: 1,
      }}
    >
      {props.noGoBack ? (
        <View style={{ width: 20 }}></View>
      ) : (
        <TouchableOpacity onPress={props.onBackPress}>
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_back }}
            style={[
              {
                width: 20,
                height: 20,
                resizeMode: "contain",
                // tintColor: ThemeManager.colors.headTxt,
              },
              // props.backImageColor,
            ]}
          />
        </TouchableOpacity>
      )}
      {props.titleName ? (
        <Text
          style={[
            {
              fontSize: 18,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor1,
              marginLeft: 20,
            },
            props.titleStyle,
          ]}
        >
          {props.titleName}
        </Text>
      ) : (
        <View style={{ width: 25 }} />
      )}

      {props.rightIcon ? (
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
          onPress={props.rightIconPress}
        >
          <Image
            source={props.rightIconUrl}
            style={[
              { height: 22, width: 22, resizeMode: "contain" },
              props.customRightImage,
            ]}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 30 }} />
      )}
    </View>
  );
};
export default SimpleHeader;
