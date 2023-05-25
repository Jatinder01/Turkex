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
  TextInput,
  Platform,
} from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Fonts, Images } from "../../theme";

const TradeInput = (props) => {
  return (
    <View
      style={{
        // flexDirection: 'row',
        // flex: 1,
        // width: '100%',
        flexDirection: "row",
        // backgroundColor: 'red',
        // justifyContent: 'space-between',
        // justifyContent: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        borderRadius: 6,
        backgroundColor: ThemeManager.colors.tabBackground,
        // paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        // onPress={props.onPressMinus}
        style={{
          height: 35,
          width: 28,
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "red",
        }}
        onPress={props.decOnPress}
        onPressIn={props.decOnPressIn}
        onPressOut={props.decOnPressOut}
      >
        <Image
          source={{ uri: Images.icon_minus }}
          style={{
            height: 16,
            width: 16,
            resizeMode: "contain",
            tintColor: ThemeManager.colors.inactiveTextColor,
          }}
        />
      </TouchableOpacity>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={
          props.placeholderTextColor
            ? props.placeholderTextColor
            : ThemeManager.colors.inactiveTextColor
        }
        maxLength={props.maxLength}
        style={[
          {
            // height: Platform.OS == "android" ? 50 : 30,
            fontFamily: Fonts.regular,
            alignSelf: "center",
            fontSize: 11,
            textAlign: "center",
            // paddingTop: Platform.OS == "android" ? 10 : 0,
            marginBottom: Platform.OS == "android" ? -4 : 0,
            // textAlignVertical: "top",
          },
          props.textInputStyle,
        ]}
        keyboardType={props.keyboardType}
        multiline={props.multiline}
        returnKeyType={"done"}
        numberOfLines={1}
        scrollEnabled={true}
        // numberOfLines={props.numberOfLines ? props.numberOfLines : 1}
        // maxLines={1}
      />
      <TouchableOpacity
        // onPress={props.onPressPlus}
        onPress={props.incOnPress}
        onPressIn={props.incOnPressIn}
        onPressOut={props.incOnPressOut}
        style={{
          height: 35,
          width: 28,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: Images.icon_without_circle_plus }}
          style={{
            height: 16,
            width: 16,
            resizeMode: "contain",
            tintColor: ThemeManager.colors.inactiveTextColor,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default TradeInput;
