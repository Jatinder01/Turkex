import React from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import fonts from "../../theme/fonts";

const InputField = (props) => {
  return (
    <View style={[styles.containerStyle, props.customContainerStyle]}>
      {props.leftImage && (
        <Image style={styles.leftImage} source={props.leftImage} />
      )}
      {props.editable ? (
        <TextInput
          editable={props.editable}
          secureTextEntry={props.secureTextEntry}
          value={props.value}
          placeholder={props.title}
          onChangeText={props.onChangeText}
          style={[
            styles.inputStyle,

            {
              color: ThemeManager.colors.textColor1,
              width: props.image ? "92%" : "100%",
              ...(Platform.OS === "ios" ? { paddingVertical: 10 } : {}),
            },
            props.defaulEmailInput,
          ]}
          autoCorrect={false}
          autoCapitalize={props.autoCapitalize ? props.autoCapitalize : "none"}
          maxLength={props.maxlength}
          onEndEditing={props.endEditing}
          keyboardType={props.keyboardType}
          returnKeyType={props.returnKeyType}
          //returnKeyType={"done"}
          placeholderTextColor={ThemeManager.colors.lightText83}
          caretHidden={props.caretHidden}
        // autoComplete={'off'}
        // value={props.inputText}
        />
      ) : (
        <TouchableOpacity style={{ flex: 1 }} onPress={props.Next}>
          <View
            style={{
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  textAlignVertical: "center",
                },
                props.textInactiveStyle,
              ]}
            >
              {props.value}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.viewPasswordStyle}
        onPress={props.onPress}
      >
        <Image
          style={[styles.viewPasswordImage, props.rightImageStyle]}
          source={props.image}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    position: "relative",
    height: 50,

    marginHorizontal: 16,
    flexDirection: "row",
    // borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    // borderColor: ThemeManager.colors.textColor1,
  },
  inputStyle: {
    fontFamily: fonts.regular,
    color: colors.textfieldTextColor,

    fontSize: 14,
    lineHeight: 20,
    // paddingLeft: 15,
    height: 50,
    backgroundColor: colors.transparent,
    // textTransform: "capitalize",
  },
  inputIcon: {
    position: "absolute",
    width: 16,
    height: 14,
    top: "33%",
    resizeMode: "stretch",
    alignItems: "center",
  },
  viewPasswordImage: {
    height: 14,
    width: 17.5,
    alignSelf: "center",
    resizeMode: "contain",
    // tintColor: colors.White,
  },
  viewPasswordStyle: {
    height: 40,
    width: 35,
    // justifyContent: 'center',
    // alignItems: 'center',
    position: "absolute",
    right: 5,
    bottom: -8,
  },
  leftImage: {
    height: 14,
    width: 17.5,
    alignSelf: "center",
    resizeMode: "contain",
    marginRight: 10,
  },
  text: {
    fontFamily: fonts.regular,
    color: colors.textfieldTextColor,
    fontSize: 14,
    // paddingLeft: 15,
  },
});

export { InputField };
