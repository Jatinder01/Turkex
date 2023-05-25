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
import { strings } from "../../../Localization";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Fonts, Images } from "../../theme";

const ConvertHeader = (props) => {
  const [size, setSize] = useState(0);
  const onLayout = (event) => {
    // alert('hello');
    let x = event.nativeEvent.layout;
    setSize(x.width);
    // console.log('width---=-=-=>>>>', x);
  };
  return (
    <View>
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginVertical: 20,
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={props.onBackPress}>
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_back }}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
        </TouchableOpacity>
        <Text
          style={[
            {
              fontSize: 18,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor1,
              marginLeft: 10,
            },
            props.titleStyle,
          ]}
        >
          {props.title}
        </Text>
        {props.history ? (
          <TouchableOpacity onPress={props.onHistoryPress}>
            <Image
              source={{ uri: Images.icon_convert_right }}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }} />
        )}
      </View>
    </View>
  );
};
export default ConvertHeader;
