/* eslint-disable no-sparse-arrays */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import { strings } from "../../../Localization";
import Singleton from "../../Singleton";
import { EventRegister } from "react-native-event-listeners";
import fonts from "../../theme/fonts";
import { Loader } from "./Loader";
import * as constants from "../../Constants";
function PairItems({
  coinA,
  coinB,
  lastPrice,
  vol,
  volCurrent,
  favIcon,
  favOnPress,
  didSelectItem,
  usdPrice,
}) {
  return (
    <TouchableOpacity
      onPress={didSelectItem}
      style={[
        styles.tableTrd,
        { backgroundColor: ThemeManager.colors.lightdark },
      ]}
    >
      {/* <TouchableOpacity  onPress={didSelectItem}> */}
      <View style={[styles.tableTd]}>
        <Text
          style={[
            styles.tableTdTextStyle,
            styles.textDark,
            {
              color: ThemeManager.colors.textColor2,
              fontFamily: Fonts.semiBold,
            },
          ]}
        >
          {coinA}
        </Text>
        <Text
          style={[
            styles.tableTdTextStyle,
            styles.coinBStyle,
            ,
            {
              color: ThemeManager.colors.headerText,
              fontSize: 14,
              fontFamily: Fonts.semiBold,
            },
          ]}
        >
          /{coinB}
        </Text>
        <View style={{ width: "100%" }}>
          <Text
            style={[
              styles.volTextStyle,
              styles.usdPriceStyle,
              { color: ThemeManager.colors.headerText },
            ]}
          >
            Vol {Singleton.getInstance().numbersToBillion(vol)}
          </Text>
        </View>
      </View>
      {/* </TouchableOpacity> */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "60%",
        }}
      >
        <View
          style={[
            styles.tableTd1,
            { justifyContent: "center", alignItems: "flex-end", width: "50%" },
          ]}
        >
          {/* <View style={styles.tableTd1}> */}
          <Text
            style={[
              styles.tableTdTextStyle,
              styles.textDark /*styles.textDarkRed*/,
              { textAlign: "right" },
              {
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.semiBold,
              },
            ]}
          >
            {lastPrice}
          </Text>
          <Text
            style={[
              styles.usdPriceStyle,
              { color: ThemeManager.colors.headerText },
            ]}
          >
            ${usdPrice}
          </Text>
          {/* </View> */}
        </View>
        <View style={[styles.tableTd2, styles.tableTdTextRight]}>
          {volCurrent && (
            <Text
              style={[
                styles.tableTdTextStyle,
                volCurrent.slice(0, -1) >= 0
                  ? styles.volCurrentText
                  : styles.volCurrentText1,

                ,
              ]}
            >
              {volCurrent}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const TableMarket = (props) => {
  const [allData, setAlldata] = useState([]);
  const [sortArray, setSortArray] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [valueType, setValueType] = useState("");
  useEffect(() => {
    let dArray = [];
    props.data &&
      props.data?.map((item, index) => {
        let price = props.coinToUsdData[item?.quote_unit?.toUpperCase()];
        item.usdPrice = price ? price.USD : 1;
        dArray.push(item);
      });

    setAlldata(dArray);
    sortingList(allData);
  }, [props.data, props.coinToUsdData]);

  const sortingList = (allData) => {
    let type = valueType;
    if (type == "Vol") {
      if (toggle == false) {
        let asceArray = [];
        asceArray = allData.sort(function (a, b) {
          return parseFloat(b.volume) - parseFloat(a.volume);
        });
        setSortArray(asceArray);
      } else {
        let descArray = [];
        descArray = allData.sort(function (a, b) {
          return parseFloat(a.volume) - parseFloat(b.volume);
        });
        setSortArray(descArray);
      }
    } else if (type == "LastPrice") {
      if (toggle == false) {
        let asceArray = [];
        asceArray = allData.sort(function (a, b) {
          return parseFloat(b.last) - parseFloat(a.last);
        });
        setSortArray(asceArray);
      } else {
        let descArray = [];
        descArray = allData.sort(function (a, b) {
          return parseFloat(a.last) - parseFloat(b.last);
        });
        setSortArray(descArray);
      }
    } else if (type == "24hChange") {
      if (toggle == false) {
        let asceArray = [];
        asceArray = allData.sort(function (a, b) {
          return (
            parseFloat(b.price_change_percent) -
            parseFloat(a.price_change_percent)
          );
        });
        setSortArray(asceArray);
      } else {
        let descArray = [];
        descArray = allData.sort(function (a, b) {
          return (
            parseFloat(a.price_change_percent) -
            parseFloat(b.price_change_percent)
          );
        });
        setSortArray(descArray);
      }
    } else if (type == "Name") {
      if (toggle == false) {
        let asceArray = [];
        asceArray = allData.sort((a, b) => {
          if (b.base_unit.toLowerCase() < a.base_unit.toLowerCase()) return -1;
          if (b.base_unit.toLowerCase() > a.base_unit.toLowerCase()) return 1;
          return 0;
        });
        setSortArray(asceArray);
      } else {
        let descArray = [];
        descArray = allData.sort((a, b) => {
          if (a.base_unit.toLowerCase() < b.base_unit.toLowerCase()) return -1;
          if (a.base_unit.toLowerCase() > b.base_unit.toLowerCase()) return 1;
          return 0;
        });
        setSortArray(descArray);
      }
    }
  };
  function loaderFun() {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }
  return (
    <View
      style={[
        styles.tableTradeBlock,
        { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
      ]}
    >
      <View
        style={[
          styles.tableTrd,
          {
            backgroundColor: ThemeManager.colors.dashboardSubViewBg,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // backgroundColor: "red",
            alignItems: "flex-start",
          }}
        >
          <TouchableOpacity
            style={styles.headingTxt}
            onPress={() => {
              setValueType("Name");
              loaderFun();
              setToggle(!toggle);
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.textColor5,
                fontFamily: Fonts.regular,
              }}
            >
              Name{" "}
            </Text>
          </TouchableOpacity>
          <View>
            <Image
              source={{ uri: Images.icon_arrow_up_light }}
              style={{
                height: 5.44,
                width: 8,
                top: 3,
                left: 2.5,
                resizeMode: "contain",
                tintColor:
                  valueType == "Name" && toggle == false
                    ? colors.black
                    : colors.greyTxt,
              }}
            />
            <Image
              source={{ uri: Images.icon_arrow_dropdown_dark }}
              style={{
                height: 5.44,
                width: 8,
                top: 5,
                left: 2.5,
                resizeMode: "contain",
                tintColor:
                  valueType == "Name" && toggle == true
                    ? colors.black
                    : colors.greyTxt,
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.headingTxt}
            onPress={() => {
              setValueType("Vol");
              loaderFun();
              setToggle(!toggle);
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.textColor5,
                fontFamily: Fonts.regular,
              }}
            >
              {" "}
              / Vol{" "}
            </Text>
          </TouchableOpacity>
          <View>
            <Image
              source={{ uri: Images.icon_arrow_up_light }}
              style={{
                height: 5.44,
                width: 8,
                top: 3,
                left: 2.5,
                resizeMode: "contain",
                tintColor:
                  valueType == "Vol" && toggle == false
                    ? colors.black
                    : colors.greyTxt,
              }}
            />
            <Image
              source={{ uri: Images.icon_arrow_dropdown_dark }}
              style={{
                height: 5.44,
                width: 8,
                top: 5,
                left: 2.5,
                resizeMode: "contain",
                tintColor:
                  valueType == "Vol" && toggle == true
                    ? colors.black
                    : colors.greyTxt,
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginRight: 20,
            }}
          >
            <TouchableOpacity
              style={[styles.headingTxt, { marginLeft: 20 }]}
              onPress={() => {
                setValueType("LastPrice");
                loaderFun();
                setToggle(!toggle);
              }}
            >
              <Text
                style={{
                  color: ThemeManager.colors.textColor5,
                  fontFamily: Fonts.regular,
                }}
              >
                Last Price{" "}
              </Text>
            </TouchableOpacity>
            <View>
              <Image
                source={{ uri: Images.icon_arrow_up_light }}
                style={{
                  height: 4.44,
                  width: 8,
                  top: 3,
                  left: 2.5,
                  resizeMode: "contain",
                  tintColor:
                    valueType == "LastPrice" && toggle == false
                      ? colors.black
                      : colors.greyTxt,
                }}
              />
              <Image
                source={{ uri: Images.icon_arrow_dropdown_dark }}
                style={{
                  height: 5.44,
                  width: 8,
                  top: 5,
                  left: 2.5,
                  resizeMode: "contain",
                  tintColor:
                    valueType == "LastPrice" && toggle == true
                      ? colors.black
                      : colors.greyTxt,
                }}
              />
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={styles.headingTxt}
              onPress={() => {
                setValueType("24hChange");
                loaderFun();
                setToggle(!toggle);
              }}
            >
              <Text
                style={{
                  color: ThemeManager.colors.textColor5,
                  fontFamily: Fonts.regular,
                }}
              >
                24h Chg%{" "}
              </Text>
            </TouchableOpacity>
            <View>
              <Image
                source={{ uri: Images.icon_arrow_up_light }}
                style={{
                  height: 5.44,
                  width: 8,
                  top: 3,
                  left: 2.5,
                  resizeMode: "contain",
                  tintColor:
                    valueType == "24hChange" && toggle == false
                      ? colors.black
                      : colors.greyTxt,
                }}
              />
              <Image
                source={{ uri: Images.icon_arrow_dropdown_dark }}
                style={{
                  height: 5.44,
                  width: 8,
                  top: 5,
                  left: 2.5,
                  resizeMode: "contain",
                  tintColor:
                    valueType == "24hChange" && toggle == true
                      ? colors.black
                      : colors.greyTxt,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      {props.data?.length > 0 ? (
        <FlatList
          bounces={false}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{ paddingBottom: 50 }}
          data={sortArray?.length == 0 ? allData : sortArray}
          extraData={props.extraData}
          renderItem={({ item }) => (
            <PairItems
              didSelectItem={() => props.selectedMarket(item)}
              coinA={item?.base_unit?.toUpperCase()}
              coinB={item?.quote_unit?.toUpperCase()}
              lastPrice={item?.last}
              vol={item?.total_volume}
              volCurrent={item?.price_change_percent}
              favIcon={
                item.fav == true
                  ? { uri: Images.icon_spot }
                  : { uri: Images.icon_spot }
              }
              usdPrice={(item?.last * item?.usdPrice).toFixed(2)}
            />
          )}
          ListFooterComponent={() => {
            return (
              <View>
                {props.favShow ? (
                  <TouchableOpacity onPress={props.favClicked}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 40,
                      }}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          // backgroundColor: ThemeManager.colors.tabBottomBorder,
                        }}
                      >
                        <Image
                          style={{
                            height: 18,
                            width: 18,
                            // tintColor: ThemeManager.colors.whiteScreen,
                          }}
                          source={{ uri: Images.icon_plus_color }}
                        />
                      </View>
                      <Text
                        style={{
                          marginLeft: 6,
                          // fontSize: 20,
                          fontSize: 15,
                          color: ThemeManager.colors.tabBottomBorder,
                          fontFamily: fonts.regular,
                        }}
                      >
                        {strings.markets_tab.add_favorite}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View
          style={{
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[styles.textStyle, { color: ThemeManager.colors.textColor }]}
          >
            You don’t have any pairs
          </Text>
          {props.favShow ? (
            <TouchableOpacity onPress={props.favClicked}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: ThemeManager.colors.tabBottomBorder,
                  }}
                >
                  <Image
                    style={{
                      height: 18,
                      width: 18,
                      // tintColor: ThemeManager.colors.whiteScreen,
                    }}
                    source={{ uri: Images.icon_plus_color }}
                  />
                </View>
                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 15,
                    color: ThemeManager.colors.tabBottomBorder,
                    fontFamily: Fonts.regular,
                  }}
                >
                  {strings.markets_tab.add_favorite}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      <Loader isLoading={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  tableTradeBlock: {
    backgroundColor: colors.white,
    height: "100%",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    marginTop: 10,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    alignSelf: "center",
    color: colors.textfieldTextColor,
    fontSize: 12,
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
    fontSize: 14,
    color: "#868686",
  },
  volTextStyle: {
    fontSize: 14,
    color: "#868686",
  },
  textRight: {
    textAlign: "right",
  },
  tableTrd: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tableTd: {
    // flex: 1,
    flexWrap: "wrap",
    width: "33.3333%",
    flexDirection: "row",
  },
  tableTd2: {
    flex: 1,
    // flexWrap: 'wrap',
    width: "33.3333%",
    flexDirection: "row",
  },
  tableTd1: {
    width: "33.3333%",
  },
  textDark: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.15,
  },
  textDarkRed: {
    color: colors.appRed,
  },
  tableTdTextRight: {
    justifyContent: "flex-end",
  },
  tableTdTextStyle: {
    fontSize: 14,
    color: "#868686",
  },
  volCurrentText: {
    color: colors.white,
    backgroundColor: colors.appGreen,
    // paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 5,
    overflow: "hidden",
    width: "70%",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    letterSpacing: 0.13,
  },
  volCurrentText1: {
    color: colors.white,
    backgroundColor: colors.appRed,
    // paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 5,
    overflow: "hidden",
    width: "70%",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    letterSpacing: 0.13,
  },

  volCurrentTextRed: {
    color: "#fff",
    backgroundColor: colors.appRed,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  headingTxt: {
    color: colors.greyTxt,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: -0.3,
  },
  favButton: {
    marginLeft: -5,
    marginRight: 5,
    height: 25,
    width: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  usdPriceStyle: {
    fontWeight: "400",
    fontSize: 10,
    color: colors.textfieldTextColor,
    letterSpacing: 0.12,
  },
  coinBStyle: {
    fontSize: 12,
    alignSelf: "flex-end",
    letterSpacing: 0.15,
    fontWeight: "500",
    color: colors.textfieldTextColor,
    marginBottom: 1,
  },
});

export { TableMarket };
