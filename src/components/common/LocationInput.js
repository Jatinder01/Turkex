/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { colors, Images, Fonts } from "../../theme";
import fonts from "../../theme/fonts";
import { ThemeManager } from "../../../ThemeManager";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
const LocationInput = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.clicked}>
      <View>
        <View
          style={[styles.mainView, { backgroundColor: props.backgroundColor }]}
        >
          <View style={[styles.subView]}>
            <Text style={[styles.labelText, { fontSize: 20, marginTop: 2 }]}>
              {props.flag}
            </Text>

            {/* <Image style={{width: 20, height: 20}} source={{uri: Images.flag}} /> */}
            <Text style={[styles.labelText, { color: props.textColor }]}>
              {props.location}
            </Text>
          </View>
          <View style={[styles.subView]}>
            <Image
              style={{
                resizeMode: "contain",
                width: 12,
                height: 14,
                // tintColor: ThemeManager.colors.Depositbtn,
                marginRight: 5,
              }}
              source={{ uri: props.uri }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 25,
    height: 50,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    marginVertical: 20,
    justifyContent: "space-between",
  },
  subView: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: ThemeManager.colors.headTxt,
    textAlign: "right",
    marginLeft: 5,
  },
});
export { LocationInput };
