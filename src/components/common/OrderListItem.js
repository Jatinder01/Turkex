import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import {
  buttonBackground,
  buttonTextColor,
  textBlue,
  normal,
  bold,
  homeButtonBorder,
  Avenir_Heavy,
  Avenir_Black,
  Avenir_Book,
  Avenir_Light,
  Avenir_Medium,
  Avenir_Roman,
} from "../../../app.json";
import { ThemeManager } from "../../../ThemeManager";
import Singleton from "../../Singleton.js";
import { colors, Fonts } from "../../theme";
import fonts from "../../theme/fonts";
import * as constants from "../../Constants";

const OrderListItem = (props) => {
  return (
    <View
      style={[
        styles.tableTrd,
        { backgroundColor: ThemeManager.colors.refBGColor },
      ]}
    >
      <View style={[styles.tableTdNew]}>
        <View style={styles.tdRow}>
          <View style={[styles.tdCol, styles.secCol, { flexDirection: "row" }]}>
            <Text
              style={[
                styles.volTextStyle,
                styles.tableTdTextStyle,
                {
                  textAlign: "left",
                  color: ThemeManager.colors.textColor1,
                  textTransform: "uppercase",
                },
                props.pairNameStyle,
              ]}
            >
              {props.pairName}
            </Text>
            <Text
              style={[
                styles.volTextStyle,
                styles.tableTdTextStyle,
                {
                  textAlign: "left",
                  color: props.side == "buy" ? colors.appGreen : colors.appRed,
                  fontSize: 12,
                  alignSelf: "center",
                  textTransform: "capitalize",
                },
              ]}
            >
              {` (${props.side}/${props.ord_type})`}
            </Text>
          </View>
          <View style={[styles.tdCol, styles.thirdCol]}>
            <Text style={[styles.volTextStyle, { textAlign: "right" }]}>
              {props.createdAt}{" "}
            </Text>
          </View>
        </View>
        <View style={styles.tdRow}>
          <View style={[styles.tdCol, styles.firstCol]}>
            <Text style={[styles.volTextStyle, { textAlign: "left" }]}>
              Amount
            </Text>
          </View>
          <View style={[styles.tdCol, styles.secCol]}>
            {renderFilledAmount()}
          </View>
          <View style={[styles.tdCol, styles.thirdCol]}>
            <Text style={[styles.volTextStyle, { textAlign: "left" }]}></Text>
          </View>
        </View>
        <View style={styles.tdRow}>
          <View style={[styles.tdCol, styles.firstCol]}>
            <Text style={[styles.volTextStyle, { textAlign: "left" }]}>
              Price:
            </Text>
          </View>
          <View style={[styles.tdCol, styles.secCol]}>
            <Text
              style={[
                styles.volTextStyle,
                { textAlign: "left", color: ThemeManager.colors.textColor1 },
                props.priceTextStyle,
              ]}
            >
              {props.ord_type == "market" ? `Market` : `${props.price}`}
            </Text>
          </View>
          {renderCancelButton()}
        </View>
      </View>
    </View>
  );
  function checkState(state) {
    switch (state) {
      case "wait": {
        return "New";
      }
      case "pending": {
        return "Partial";
      }
      case "done": {
        return "Completed";
      }
      case "cancel": {
        return "Cancelled";
      }
      case "reject": {
        return "Rejected";
      }
      default: {
        return "New";
      }
    }
  }

  function renderCancelButton() {
    if (props.state == "wait" || props.state == "pending") {
      return (
        <TouchableOpacity onPress={props.cancelOrderItem}>
          <View
            style={{
              backgroundColor: ThemeManager.colors.selectedTextColor,
              padding: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                textAlign: "right",
                fontSize: 12,
                fontFamily: Fonts.regular,
              }}
            >
              Cancel
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return;
  }

  function renderFilledAmount() {
    if (props.state.toLowerCase() == "done") {
      return (
        <Text style={[styles.volTextStyle, { textAlign: "left" }]}>
          {props.filled}/{props.filled}
        </Text>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              styles.volTextStyle,
              { textAlign: "left", color: ThemeManager.colors.textColor1 },
              props.filledStyle,
            ]}
          >
            {props.filled}
          </Text>
          <Text style={[styles.volTextStyle, { textAlign: "left" }]}>
            {"/"}
            {props.amount}
          </Text>
        </View>
      );
    }
  }

  function renderTotalAmount() {
    if (props.state.toLowerCase() == "done") {
      return (
        <Text style={[styles.volTextStyle, { textAlign: "left" }]}>
          {calculateTotal(props.filled, props.avg)} {props.quote_unit}
        </Text>
      );
    } else {
      return (
        <Text style={[styles.volTextStyle, { textAlign: "left" }]}>
          {calculateTotal(props.amount, props.price)} {props.quote_unit}
        </Text>
      );
    }
  }
};
function calculateTotal(a, b) {
  var c = a * b;
  if (c.toString().includes(".")) {
    var e = c.toString().split(".");
    if (e[1]?.length >= 8) {
      c = c.toFixed(8);
    }
  }
  return c;
}
export { OrderListItem };
const styles = StyleSheet.create({
  tableTradeBlock: {
    backgroundColor: "#fff",
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    // fontFamily: `${normal}`,
    alignSelf: "center",
    // color: `${textBlue}`,
    fontSize: 13,
    paddingTop: 5,
  },
  tableTr: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFEDED",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tableTh: {
    flex: 1,
    maxWidth: "33.3333%",
  },
  withArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableThTextStyle: {
    // fontFamily: `${normal}`,
    fontSize: 14,
    color: "#868686",
  },
  volTextStyle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.greyTxt,
    marginVertical: 1,
  },
  buttTextStyle: {
    // fontFamily: `${bold}`,
    fontSize: 14,
    color: "#868686",
  },
  textRight: {
    textAlign: "right",
  },
  tableTrdNew: {},
  tableTdNew: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  firstCol: { width: "25%" },
  secCol: { flex: 1 },
  thirdCol: { width: "40%" },
  tdRow: {
    flexDirection: "row",
  },

  tableTrd: {
    backgroundColor: "#ffffff",
    // paddingHorizontal: 15,
    // paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "rgba(91,80,78,0.22)",
  },

  tableTd: {
    flex: 1,
    flexWrap: "wrap",
    width: "33.3333%",
    flexDirection: "row",
  },
  textDark: {
    color: "#3C3C3C",
    fontSize: 15,
    marginBottom: 10,
  },
  textDarkRed: {
    color: "#C00000",
  },
  tableTdTextRight: {
    justifyContent: "flex-end",
  },
  tableTdTextStyle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.greyTxt,
    fontWeight: "500",
  },
  volCurrentText: {
    color: "#fff",
    backgroundColor: "#70A800",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    overflow: "hidden",
    width: "70%",
    height: 35,
  },
  volCurrentTextRed: {
    color: "#fff",
    backgroundColor: "#C00000",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  favButton: {
    marginLeft: -5,
    marginRight: 5,
    height: 15,
    width: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
