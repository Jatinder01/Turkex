/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, FlatList } from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import {
  ButtonPrimary,
  ConvertInput,
  CustomEmptyView,
  Loader,
  Wrap,
} from "../../common";
import styles from "./ConversionHistoryStyle";
import { useDispatch, useSelector } from "react-redux";
import { getTuxHistory } from "../../../Redux/Actions";
import Moment from "moment";
import Singleton from "../../../Singleton";

const historyData = [
  {
    fromCurrency: "0.004545 BTC",
    toCurrency: "0.076555 ETH",
    dateTme: "2022-06-22 13:11:42",
    status: "completed",
  },
  {
    fromCurrency: "0.004545 BTC",
    toCurrency: "0.076555 ETH",
    dateTme: "2022-06-22 13:11:42",
    status: "completed",
  },
  {
    fromCurrency: "0.004545 BTC",
    toCurrency: "0.076555 ETH",
    dateTme: "2022-06-22 13:11:42",
    status: "completed",
  },
];
const ConversionHistory = () => {
  const dispatch = useDispatch();
  const { historyData, historyLoader } = useSelector(
    (state) => state?.buxTuxReducer
  );

  useEffect(() => {
    dispatch(getTuxHistory());
  }, []);

  const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ":" + min + ":" + sec;
    return time;
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            marginBottom: 5,
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <View style={{ marginRight: 5, flex: 1 }}>
            <Text
              style={[
                styles.currencyText,
                { color: ThemeManager.colors.textColor1 },
              ]}
            >
              {item?.price + " " + item?.ask_currency?.toUpperCase()}
            </Text>
            <Text style={styles.dateTime}>
              {Moment(item?.created_at).format("YYYY-MM-DD hh:mm:ss a")}
            </Text>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              flex: 1,
              marginLeft: 5,
            }}
          >
            <Text
              style={[
                styles.currencyText,
                {
                  color: ThemeManager.colors.textColor1,
                  textAlign: "right",
                },
              ]}
            >
              {parseFloat(
                Singleton.getInstance().ParseFloatNumberOnly(item?.amount, 7)
              ) +
                " " +
                item.currency.toUpperCase()}
            </Text>
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor:
                    item.state == "collected"
                      ? ThemeManager.colors.textGreenColor
                      : ThemeManager.colors.textRedColor,
                  marginRight: 5,
                }}
              />
              <Text
                style={[
                  styles.dateTime,
                  {
                    color:
                      item.state == "collected"
                        ? colors.appGreen
                        : colors.appRed,
                    textTransform: "capitalize",
                  },
                ]}
              >
                {item.state}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.modalBox }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.modalBox },
      ]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.modalBox }}
    >
      <View
        style={{
          backgroundColor: ThemeManager.colors.modalBox,
          flex: 1,
        }}
      >
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <View
            style={{
              justifyContent: "flex-start",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Actions.pop();
              }}
            >
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_back }}
                style={{ height: 20, width: 20, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                marginTop: 10,
                fontSize: 26,
                fontFamily: Fonts.medium,
                color: ThemeManager.colors.textColor1,
              }}
            >
              {strings.convert.conversionHistory}
            </Text>
          </View>
          {historyData?.length > 0 ? (
            <FlatList
              keyboardShouldPersistTaps={"handled"}
              showsVerticalScrollIndicator={false}
              data={historyData}
              style={{ marginTop: 5 }}
              renderItem={renderItem}
              ListHeaderComponent={() => {
                if (historyData?.length > 0) {
                  return (
                    <View
                      style={{
                        marginTop: 20,
                        marginBottom: 10,
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}
                      >
                        {strings.convert.from}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}
                      >
                        {strings.convert.to}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          marginVertical: 30,
                        }}
                      >
                        <Image
                          source={{
                            uri: ThemeManager.ImageIcons.icon_open_order,
                          }}
                          style={{
                            height: 40,
                            width: 40,
                            resizeMode: "contain",
                            tintColor: ThemeManager.colors.inactiveTextColor,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: Fonts.regular,
                            color: ThemeManager.colors.inactiveTextColor,
                            top: 10,
                          }}
                        >
                          {strings.no_conversion_history}
                        </Text>
                      </View>
                    </View>
                  );
                }
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <>
              {historyLoader ? null : (
                <View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      marginTop: 20,
                    }}
                  ></View>
                  <View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 100,
                      }}
                    >
                      {/* <Image
                        source={{
                          uri: ThemeManager.ImageIcons.icon_no_open_order,
                        }}
                        style={{
                          height: 80,
                          width: 80,
                          resizeMode: 'contain',
                          marginTop: 100,
                        }}
                      /> */}
                      <CustomEmptyView />
                      <Text
                        style={{
                          marginTop: 10,
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          color: ThemeManager.colors.inactiveTextColor,
                        }}
                      >
                        {strings.convert.no_conversion_history}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </View>
      <Loader isLoading={historyLoader} />
    </Wrap>
  );
};
export default ConversionHistory;
