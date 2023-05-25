/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Fonts } from "../../theme";
import ActionSheet from "react-native-actionsheet";
import { strings } from "../../../Localization";
import BorderLine from "./BorderLine";
import { Wrap } from "./Wrap";
const OrderBookMemo = (props) => {
  const ActionSheetAsk = useRef(null);
  const [precision, setPrecision] = useState(4);
  const [actionModal, setActionModal] = useState(false);
  const [dropdownSelectedValue, setDropdownSelectedValue] = useState("0.0001");
  const marketSocketReducer = useSelector((state) => state.marketSocketReducer);
  // console.log("MARKET-----");
  return (
    <View>
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
          marginTop: 10,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            flex: 1,
            marginRight: 4,
          }}
        >
          <Text
            style={{
              color: ThemeManager.colors.inactiveTextColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {strings.buy_sell_market.bid}
          </Text>
          <Text></Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 4,
          }}
        >
          <Text
            style={{
              color: ThemeManager.colors.inactiveTextColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {strings.buy_sell_market.ask}
          </Text>
          <TouchableOpacity
            onPress={() => {
              // ActionSheetAsk.current.show();
              setActionModal(true);
            }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 24,
              width: "48%",
              backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: Fonts.regular,
                padding: 4,
                paddingLeft: 6,
                textAlign: "center",
                color: ThemeManager.colors.textColor1,
              }}
            >
              {dropdownSelectedValue}
            </Text>
            <Image
              source={{
                uri: ThemeManager.ImageIcons.icon_dropdown,
              }}
              style={{
                height: 14,
                width: 14,
                resizeMode: "contain",
                marginRight: 8,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
          marginTop: 8,
          marginBottom: -5,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            flex: 1,
            marginRight: 4,
          }}
        >
          <Text
            style={{
              color: ThemeManager.colors.inactiveTextColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {"Size"}
          </Text>
          <Text
            style={{
              color: ThemeManager.colors.inactiveTextColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {"Price"}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 4,
          }}
        >
          <Text
            style={{
              color: ThemeManager.colors.inactiveTextColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {"Price"}
          </Text>
          <Text
            style={{
              color: ThemeManager.colors.inactiveTextColor,
              fontFamily: Fonts.regular,
              fontSize: 12,
            }}
          >
            {"Size"}
          </Text>
        </View>
      </View>

      <View
        style={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: "row",
          flex: 1,
          marginTop: 10,
        }}
      >
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          data={marketSocketReducer?.buyData}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  flex: 1,
                  marginRight: 4,
                  width: "98%",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                    maxWidth: "48%",
                  }}
                >
                  {item[1]}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: ThemeManager.colors.textGreenColor,
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                    maxWidth: "48%",
                  }}
                >
                  {parseFloat(item[0]).toFixed(precision)}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,
              }}
            >
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontFamily: Fonts.regular,
                  fontSize: 16,
                }}
              >
                {strings.buy_sell_market_screen.no_data}
              </Text>
            </View>
          }
        />
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          keyExtractor={(item, index) => index.toString()}
          data={marketSocketReducer?.sellData}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  marginLeft: 4,
                  width: "98%",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: ThemeManager.colors.textRedColor,
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                    maxWidth: "48%",
                  }}
                >
                  {parseFloat(item[0]).toFixed(precision)}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                    maxWidth: "48%",
                  }}
                >
                  {item[1]}
                </Text>
              </View>
            );
          }}
        />
      </View>
      <ActionSheet
        ref={ActionSheetAsk}
        // title={strings.profile.chooseBackUpoption}
        options={[
          "0.000000001",
          "0.00001",
          "0.0001",
          "0.001",
          "0.01",
          strings.buy_sell_market.cancel,
        ]}
        cancelButtonIndex={5}
        //destructiveButtonIndex={1}
        onPress={(index) => {
          if (index !== 5) {
            if (index == 0) {
              setDropdownSelectedValue("0.000000001");
              setPrecision(8);
            } else if (index === 1) {
              setDropdownSelectedValue("0.00001");
              setPrecision(5);
            } else if (index === 2) {
              setDropdownSelectedValue("0.0001");
              setPrecision(4);
            } else if (index === 3) {
              setDropdownSelectedValue("0.001");
              setPrecision(3);
            } else if (index === 4) {
              setDropdownSelectedValue("0.01");
              setPrecision(2);
            }
          }
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={actionModal}
        onRequestClose={() => setActionModal(false)}
      >
        <Wrap
          // darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setActionModal(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.whiteScreen,
                // marginHorizontal: 15,
                // borderRadius: 8,
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  // backgroundColor: ThemeManager.colors.whiteScreen,
                }}
                onPress={() => {
                  setDropdownSelectedValue("0.000000001");
                  setPrecision(8);
                  // ActionSheetOrders.current.hide();
                  setActionModal(false);
                }}
                // style={{ backgroundColor: "red" }}
              >
                <Text
                  style={{
                    color:
                      dropdownSelectedValue === "0.000000001"
                        ? ThemeManager.colors.selectedTextColor
                        : ThemeManager.colors.headerText,
                    fontFamily: Fonts.regular,
                    fontSize: 16,
                  }}
                >
                  {"0.000000001"}
                </Text>
              </TouchableOpacity>
              <BorderLine
                style={{
                  opacity: 0.3,
                  backgroundColor: ThemeManager.colors.inactiveTextColor,
                }}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  // backgroundColor: ThemeManager.colors.whiteScreen,
                }}
                onPress={() => {
                  setDropdownSelectedValue("0.00001");
                  setPrecision(5);
                  setActionModal(false);
                }}
              >
                <Text
                  style={{
                    color:
                      dropdownSelectedValue === "0.00001"
                        ? ThemeManager.colors.selectedTextColor
                        : ThemeManager.colors.headerText,
                    fontFamily: Fonts.regular,
                    fontSize: 16,
                  }}
                >
                  {"0.00001"}
                </Text>
              </TouchableOpacity>
              <BorderLine
                style={{
                  opacity: 0.5,
                  backgroundColor: ThemeManager.colors.inactiveTextColor,
                }}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  // backgroundColor: ThemeManager.colors.whiteScreen,
                }}
                onPress={() => {
                  setDropdownSelectedValue("0.0001");
                  setPrecision(4);
                  setActionModal(false);
                }}
              >
                <Text
                  style={{
                    color:
                      dropdownSelectedValue === "0.0001"
                        ? ThemeManager.colors.selectedTextColor
                        : ThemeManager.colors.headerText,
                    fontFamily: Fonts.regular,
                    fontSize: 16,
                  }}
                >
                  {"0.0001"}
                </Text>
              </TouchableOpacity>
              <BorderLine
                style={{
                  opacity: 0.5,
                  backgroundColor: ThemeManager.colors.inactiveTextColor,
                }}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  // backgroundColor: ThemeManager.colors.whiteScreen,
                }}
                onPress={() => {
                  setDropdownSelectedValue("0.001");
                  setPrecision(3);
                  setActionModal(false);
                }}
              >
                <Text
                  style={{
                    color:
                      dropdownSelectedValue === "0.001"
                        ? ThemeManager.colors.selectedTextColor
                        : ThemeManager.colors.headerText,
                    fontFamily: Fonts.regular,
                    fontSize: 16,
                  }}
                >
                  {"0.001"}
                </Text>
              </TouchableOpacity>
              <BorderLine
                style={{
                  opacity: 0.5,
                  backgroundColor: ThemeManager.colors.inactiveTextColor,
                }}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  // backgroundColor: ThemeManager.colors.whiteScreen,
                }}
                onPress={() => {
                  setDropdownSelectedValue("0.01");
                  setPrecision(2);
                  setActionModal(false);
                }}
              >
                <Text
                  style={{
                    color:
                      dropdownSelectedValue === "0.01"
                        ? ThemeManager.colors.selectedTextColor
                        : ThemeManager.colors.headerText,
                    fontFamily: Fonts.regular,
                    fontSize: 16,
                  }}
                >
                  {"0.01"}
                </Text>
              </TouchableOpacity>

              <BorderLine
                style={{
                  height: 5,
                  backgroundColor: ThemeManager.colors.inactiveTextColor,
                  opacity: 0.3,
                }}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  // backgroundColor: ThemeManager.colors.whiteScreen,
                }}
                onPress={() => {
                  // setSelectedOrderListIndex(2);
                  // setShowBuyOrder(false);
                  // setShowSellOrder(true);
                  // setShowLargeData(true);
                  setActionModal(false);
                }}
              >
                <Text
                  style={{
                    color: ThemeManager.colors.headerText,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {strings.buy_sell_market.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Wrap>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buySellTabBlock: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  btnBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    borderBottomWidth: 0,
  },
  btnText: {
    fontSize: 13,
    lineHeight: 44,
    color: "#333",
  },
  textUppercase: {
    textTransform: "uppercase",
  },
  btnActive: {
    backgroundColor: "#900",
  },
});

// export {MarketTradeBuySell};

export const OrderBook = React.memo(OrderBookMemo);
