/* eslint-disable react/self-closing-comp */
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
import { colors, Fonts } from "../../theme";
import LinearGradient from "react-native-linear-gradient";
const TradeHeader = (props) => {
  const [size, setSize] = useState(0);
  const onLayout = (event) => {
    // alert('hello');
    let x = event.nativeEvent.layout;
    setSize(x.width);
    // console.log('width---=-=-=>>>>', x);
  };
  return (
    <View
      onLayout={onLayout}
      style={{ justifyContent: "center", alignItems: "baseline" }}
    >
      <Text
        style={[
          {
            fontSize: 14,
            fontFamily: Fonts.bold,
            fontWeight: "700",
            color: props.underLine
              ? ThemeManager.colors.headTxt
              : ThemeManager.colors.headTxt,
          },
          props.custmTabTxt,
        ]}
      >
        {props.title}
      </Text>
      {props.underLine ? (
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={["#64B77C", "#347899", "#1F5BA7"]}
          // style={{
          //   justifyContent: 'center',
          //   alignItems: 'center',
          // }}
          style={{
            // alignItems: 'baseline',
            // justifyContent: 'center',
            height: 3,
            width: size,
            marginTop: 4,
            backgroundColor: ThemeManager.colors.tabBottomBorder,
            // width: size,
          }}
        ></LinearGradient>
      ) : null}
    </View>
  );
};
export default TradeHeader;
{
  /* <View
style={{
  // alignItems: 'baseline',
  // justifyContent: 'center',
  height: 4,
  width: size,
  marginTop: 4,
  backgroundColor: ThemeManager.colors.tabBottomBorder,
  // width: size,
}}
/> */
}
