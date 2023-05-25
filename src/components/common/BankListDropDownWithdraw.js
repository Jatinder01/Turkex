/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
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
import { strings } from "../../../Localization";
import SelectDropdown from "react-native-select-dropdown";
let benList = [];
const BankListDropDownWithdraw = (props) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [arrList, setArrList] = useState([]);
  useEffect(() => {
    if (props.data) {
      benList = [];
      props.data.map((item, index) => {
        if (item.state === "verified") {
          benList.push(item);
        }
        setArrList(benList);
      });
    }
    if (props?.data?.length <= 0) {
      setArrList([]);
    }
  }, [props.data]);
  return (
    <View style={{ marginHorizontal: 15, marginTop: 30 }}>
      <Text
        style={[
          {
            fontSize: 16,
            fontFamily: Fonts.regular,
            color: ThemeManager.colors.textColor1,
          },
          props.labelStyle,
        ]}
      >
        {props.labelText}
      </Text>
      <View
        style={[
          {
            height: 50,
            flexDirection: "row",
            // padding: 10,
            justifyContent: "space-between",
            marginTop: 5,
            borderRadius: 5,
          },
          props.mainView,
        ]}
      >
        <View style={{ flex: 1, width: "100%" }}>
          {arrList?.length > 0 ? (
            <SelectDropdown
              key={props.key}
              data={arrList}
              defaultValueByIndex={0}
              onSelect={props.onSelect}
              defaultValue={props.defaultValue}
              buttonStyle={[
                {
                  marginTop: 5,
                  width: "100%",
                  height: 50,
                },
                props.dropdownBtnStyle,
              ]}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={[styles.dropdown3BtnChildStyle]}>
                    <Text
                      style={[
                        styles.dropdown3BtnTxt,
                        {
                          color: ThemeManager.colors.textColor1,
                          textTransform: "uppercase",
                        },
                        props.selectedItemText,
                      ]}
                    >
                      {selectedItem ? selectedItem.name : props.itemSelected}
                    </Text>

                    <Image
                      source={{ uri: Images.icon_dropDown }}
                      style={[
                        {
                          height: 15,
                          width: 15,
                          resizeMode: "contain",
                          tintColor: ThemeManager.colors.textColor1,
                          // tintColor: 'black',
                        },
                        props.dropdownImageStyle,
                      ]}
                    />
                  </View>
                );
              }}
              dropdownStyle={[
                {
                  backgroundColor: ThemeManager.colors.tabBackground,
                },
              ]}
              rowStyle={[
                {
                  backgroundColor: ThemeManager.colors.tabBackground,
                },
              ]}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <>
                    <View style={styles.dropdown3RowChildStyle}>
                      <Text
                        style={[
                          styles.dropdown3RowTxt,
                          {
                            color:
                              props.selectedIndex == index
                                ? ThemeManager.colors.selectedTextColor
                                : ThemeManager.colors.textColor1,

                            textTransform: "uppercase",
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </>
                );
              }}
            />
          ) : (
            <TouchableOpacity
              onPress={props.onAddBank}
              style={[
                styles.dropdown3BtnChildStyle,
                {
                  backgroundColor: ThemeManager.colors.tabBackground,
                  padding: 15,
                  height: 50,
                },
              ]}
            >
              <Text
                style={[
                  styles.dropdown3BtnTxt,
                  {
                    color: ThemeManager.colors.textColor1,
                    textTransform: "uppercase",
                  },
                  props.selectedItemText,
                ]}
              >
                {props.emptyText}
              </Text>
              {/* 
              <Image
                source={{uri: Images.icon_dropDown}}
                style={[
                  {
                    height: 15,
                    width: 15,
                    resizeMode: 'contain',
                    tintColor: ThemeManager.colors.textColor1,
                    // tintColor: 'black',
                  },
                  props.dropdownImageStyle,
                ]}
              /> */}
            </TouchableOpacity>
          )}
        </View>
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
  dropdown3BtnChildStyle: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdown3BtnTxt: {
    textAlign: "center",
    fontSize: 12,
    marginHorizontal: 2,
  },

  dropdown3RowChildStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",

    paddingHorizontal: 15,
  },
});

export { BankListDropDownWithdraw };
