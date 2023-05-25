/* eslint-disable react-native/no-inline-styles */
import React from "react";

import { View } from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts, Images } from "../../theme";

const BorderLine = (props) => {
  return (
    <View>
      <View
        style={[
          {
            height: 0.5,
            backgroundColor: ThemeManager.colors.borderColor,
          },
          props.style,
        ]}
      />
    </View>
  );
};
export default BorderLine;
