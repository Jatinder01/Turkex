import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts } from "../../../theme";

function PercentageChange({ pair }) {
  let { marketData } = useSelector((state) => state?.marketSocketReducer);
  let obj = marketData.find((res) => res?.name == pair);

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: Fonts.medium,
          marginLeft: 10,
          color:
            obj?.price_change_percent?.slice(0, -1) >= 0
              ? ThemeManager.colors.textGreenColor
              : ThemeManager.colors.textRedColor,
        }}
      >
        {obj?.price_change_percent ? obj?.price_change_percent : null}
      </Text>
    </View>
  );
}
export default PercentageChange;
