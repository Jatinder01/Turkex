/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import fonts from "../../theme/fonts";
import { strings } from "../../../Localization";

const ConvertInput = (props) => {
  const getName = (name) => {
    const textName = name.charAt(0);

    return (
      <Text
        style={{
          fontSize: 14,
          fontFamily: Fonts.bold,
          textAlign: "center",
          marginTop: -2,
          color: props.textColor,
        }}
      >
        {textName}
      </Text>
    );
  };
  return (
    <View
      style={[
        styles.containerStyle,
        props.customContainerStyle,
        { backgroundColor: props.backgroundColor },
      ]}
    >
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          width: "90%",
        }}
      >
        <TouchableOpacity
          onPress={props.onLeftTextPress}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            width: 85,
          }}
        >
          {props.flag ? (
            <Image
              source={{ uri: props.flag }}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
          ) : (
            <>
              {props.coinName ? (
                <View
                  style={{
                    backgroundColor: props.coinViewColor,
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  {getName(props.coinName)}
                </View>
              ) : (
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: props.inActiveColor,
                  }}
                />
              )}
            </>
          )}

          <Text
            style={{
              color: props.textColor,
              fontFamily: Fonts.medium,
              fontSize: 13,
              marginHorizontal: 3,
            }}
          >
            {props.coinName
              ? props.coinName?.length < 4
                ? props.coinName
                : props.coinName?.substring(0, 4)
              : Platform.OS === "ios"
              ? "-----"
              : "-------"}
          </Text>
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_dropdown }}
            style={{ height: 10, width: 10, resizeMode: "contain" }}
          />
        </TouchableOpacity>
        <View
          style={{
            width: 0.8,
            height: 30,
            alignSelf: "center",
            justifyContent: "center",
            opacity: 0.5,
            backgroundColor: props.inActiveColor,
            marginHorizontal: 10,
          }}
        ></View>
        <View style={{ width: "60%", height: 45 }}>
          <TextInput
            style={[
              {
                height: 48,
                width: props.max ? "90%" : "100%",
                fontFamily: Fonts.regular,
                color: props.inActiveColor,
                fontSize: 14,
                paddingLeft: 5,
              },
              props.textInputStyle,
            ]}
            editable={props.editable}
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            placeholderTextColor={props.placeholderTextColor}
            keyboardType={props.keyboardType}
            returnKeyType={props.returnKeyType}
            onEndEditing={props.onEndEditing}
            showSoftInputOnFocus={false}
            ref={props.ref}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            multiline={props.multiline}
          />
        </View>
      </View>
      <View>
        {props.max ? (
          <TouchableOpacity
            disabled={props.disabled}
            onPress={props.onMaxPress}
          >
            <Text style={{ color: props.selectedTextColor }}>
              {strings.convert.max}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // position: 'relative',
    height: 50,
    backgroundColor: ThemeManager.colors.inputColor,
    // marginHorizontal: 5,
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export { ConvertInput };
