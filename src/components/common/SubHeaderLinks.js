import React from "react";
import {
  TouchableOpacity,
  Image,
  FlatList,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts, Images, colors } from "../../theme";
import fonts from "../../theme/fonts";

const SubHeaderLinks = (props) => {
  return (
    <>
      {props.forEmail ? (
        <View
          style={[
            styles.navigationLoginStyle,
            props.customNavigationLoginStyle,
          ]}
        >
          {props.navItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => props.onPress({ item, index })}
              style={[
                styles.wrapLoginStyle,
                {
                  backgroundColor:
                    props.selectedPage == index
                      ? ThemeManager.colors.tabBackground
                      : colors.transparent,
                  width: index == 0 ? 97 : 150,
                },
              ]}
            >
              <Text
                style={[
                  styles.titleStyle,
                  {
                    color:
                      props.selectedPage == index
                        ? ThemeManager.colors.textColor
                        : colors.searchPlaceHolder,
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[styles.navigationStyle, props.style]}>
          {props.navItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => props.onPress({ item, index })}
              style={[
                styles.wrapStyle,
                {
                  borderBottomColor:
                    props.selectedPage == index ? "red" : "blue",
                },
              ]}
            >
              <Text
                style={[
                  styles.titleStyle,
                  {
                    color: props.selectedPage == index ? "red" : "blue",
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  navigationStyle: {
    flexDirection: "row",
    height: 40,
  },
  wrapStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    alignSelf: "stretch",
    width: "100%",
    left: 16,
  },
  titleStyle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
  },

  navigationLoginStyle: {
    flexDirection: "row",
    height: 40,
    width: "55%",
    left: 16,
    // overflow: 'hidden',
    marginTop: "20%",
  },
  wrapLoginStyle: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: 'stretch',
    width: "100%",
  },
});

export { SubHeaderLinks };
