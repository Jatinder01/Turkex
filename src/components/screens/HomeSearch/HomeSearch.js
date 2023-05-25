/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import {
  ButtonPrimary,
  ConvertInput,
  CustomEmptyView,
  Wrap,
} from "../../common";
import ConvertHeader from "../../common/ConvertHeader";
import styles from "./HomeSearchStyle";
import LinearGradient from "react-native-linear-gradient";
import TradeHeader from "../../common/TradeHeader";
import { useDispatch, useSelector } from "react-redux";
import Singleton from "../../../Singleton";
import { EventRegister } from "react-native-event-listeners";
import {
  tradeValuesUpdate,
  updateFavMarketData,
  getFavMarketData,
  getMarketList,
} from "../../../Redux/Actions";
import * as constants from "../../../Constants";

const HomeSearch = (props) => {
  const dispatch = useDispatch();
  // const marketSocketReducer = useSelector(
  //   (state) => state?.marketSocketReducer
  // );
  const { marketData, marketFavData } = useSelector(
    (state) => state?.marketSocketReducer
  );
  const [favArray, setFavArray] = useState([]);
  const [pairData, setPairData] = useState(null);
  const [searchData, setSearchData] = useState(marketData);
  const [marketArr, setMarketArr] = useState([]);
  const [loginStatus, setLoginStatus] = useState(null);
  const [loader, setLoader] = useState(true);
  // const { marketCoinInfo } = useSelector((state) => state?.orderHistoryReducer);
  // console.log("pairData=-=-++=>>", pairData);
  // console.log("marketData=-=-++=>>", marketData);

  const getName = (market, name) => {
    console.log("market=-=-=--->>", market);
    let data = market?.find((value) => value.id == name);
    return data?.name;
  };
  const getSavedFav = (market) => {
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        console.log("check isLogin=-=-3=-=>>>", isLogin);
        if (isLogin == "true") {
          setLoginStatus(true);
          dispatch(getFavMarketData())
            .then((res) => {
              console.log("getFavMarketData=-++=res=-", res);
              let arr = res.map((item) => {
                return getName(market, item);
              });
              console.log("arr=-++=res=-", arr);
              if (arr?.length > 0) {
                setFavArray(arr);
                setPairData(marketData);
              } else {
                setFavArray([]);
                setPairData(marketData);
              }
              console.log("getFavMarketData=++-=arr=-", arr);
              setLoader(false);
            })
            .catch((err) => {
              console.log("getFavMarketData=+++-=err=-", err);
            });
        } else {
          setLoginStatus(false);

          setPairData(marketData);
          setLoader(false);
        }
      });
    // Singleton.getInstance()
    //   .getData("favArr")
    //   .then((res) => {
    //     console.log("favArr=-=res=-", res);
    //     if (res != null && res != "[]") {
    //       let favData = JSON.parse(res);
    //       setFavArray(favData);
    //     } else {
    //       setFavArray([]);
    //     }
    //   });
  };
  const marketPairFav = () => {
    console.log("favData===-=res-=-33");
    dispatch(getMarketList())
      .then((res) => {
        console.log("favData===-=res-=-", res);
        setMarketArr(res);
        getSavedFav(res);
      })
      .catch((err) => {
        console.log("favData=-=err-=-", err);
      });
  };
  useEffect(() => {
    // dispatch(getMarketList());
    marketPairFav();
    console.log("favData===-=res-=-111");

    props.navigation.addListener("didFocus", () => {
      console.log("favData===-=res-=-222");
      marketPairFav();
    });
    return () => { };
  }, [marketFavData]);
  const onSearch = (value) => {
    setPairData(
      searchData.filter((i) => {
        // console.log("text name-=-=-=>>", i.name);
        const subText = i.name.toLowerCase().replace("/", "");

        return (
          i.name.toLowerCase().includes(value.toLowerCase()) ||
          subText.includes(value.toLowerCase())
        );
      })
    );
  };
  return (
    <Wrap
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.DashboardBG },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
    >
      <View>
        <View style={[styles.searchContainer]}>
          <View
            style={[
              styles.searchView,
              { backgroundColor: ThemeManager.colors.tabBackground },
            ]}
          >
            <Image
              source={{ uri: ThemeManager.ImageIcons.icon_search_text }}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchData}
              onChangeText={onSearch}
              style={{ width: "80%", color: ThemeManager.colors.textColor1 }}
              placeholder={strings.currencyDetails.search}
              placeholderTextColor={ThemeManager.colors.inactiveTextColor}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                Actions.pop();
              }}
            >
              <Text
                style={[
                  styles.cancelText,
                  { color: ThemeManager.colors.Depositbtn },
                ]}
              >
                {strings.currencyDetails.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ alignItems: "flex-start", marginLeft: 15 }}>
        <View style={{ marginRight: 10, marginTop: 20 }}>
          <TradeHeader
            title={strings.currencyDetails.top_search}
            underLine={true}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.dashboardSubViewBg,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingTop: 20,
        }}
      >
        <FlatList
          data={pairData}
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            flexGrow: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    tradeValuesUpdate({
                      prop: "selectedCoinPair",
                      value: item,
                    })
                  );
                  Actions.currentScene != "Trades" &&
                    Actions.Trades({ passedTrade: item });
                }}
              >
                <View style={styles.viewContainer}>
                  <View style={[styles.flexStart]}>
                    {/* <Text
                      style={[
                        styles.indexStyle,
                        { color: ThemeManager.colors.inactiveTextColor },
                      ]}
                    >
                      {index + 1}
                    </Text> */}
                    <Text
                      style={[
                        styles.activeTextStyle,
                        { color: ThemeManager.colors.textColor },
                      ]}
                    >
                      {item.base_unit.toUpperCase()}
                    </Text>
                    <Text style={styles.inactiveTextStyle}>
                      {"/"}
                      {item.quote_unit.toUpperCase()}
                    </Text>
                    <Text style={styles.xStyle}>{item.xValue}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={[
                          styles.valueText,
                          { color: ThemeManager.colors.textColor },
                        ]}
                      >
                        {parseFloat(item.avg_price).toFixed(4)}
                      </Text>
                      <Text
                        style={[
                          styles.fluctuateText,
                          {
                            color:
                              item?.price_change_percent?.slice(0, -1) >= 0
                                ? colors.appGreen
                                : colors.appRed,
                          },
                        ]}
                      >
                        {item.price_change_percent}
                      </Text>
                    </View>
                    <TouchableOpacity
                      disabled={loginStatus ? false : true}
                      onPress={() => {
                        let pairName = item.base_unit + item.quote_unit;
                        console.log(
                          "fav item deatils=-=->pairName>>",
                          pairName
                        );
                        Singleton.getInstance()
                          .getData(constants.IS_LOGIN)
                          .then((isLogin) => {
                            console.log("check isLogin=-=-3=-=>>>", isLogin);
                            if (isLogin == "true") {
                              dispatch(updateFavMarketData(pairName))
                                .then((res) => {
                                  console.log(
                                    "updateFavMarketData=-=-res>>>",
                                    res
                                  );
                                  getSavedFav(marketArr);
                                  EventRegister.emit(
                                    "favRefresh",
                                    "it works!!!"
                                  );
                                })
                                .catch((err) => {
                                  console.log(
                                    "updateFavMarketData=-err=->>>",
                                    err
                                  );
                                });
                              console.log("fav item deatils=-=->>>", item);
                            }
                          });
                        // Singleton.getInstance()
                        //   .saveToFav(pairName)
                        //   .then((res) => {
                        //     getSavedFav();
                        //     EventRegister.emit("favRefresh", "it works!!!");
                        //   })
                        //   .catch((err) => {});
                      }}
                    >
                      <Image
                        source={
                          favArray.filter((e) => e === item.name)?.length > 0
                            ? { uri: ThemeManager.ImageIcons.icon_star }
                            : { uri: ThemeManager.ImageIcons.icon_star }
                        }
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          marginLeft: 15,
                          tintColor:
                            favArray.filter((e) => e === item.name)?.length > 0
                              ? ThemeManager.colors.selectedTextColor
                              : null,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 90,
                  }}
                >
                  <CustomEmptyView />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.cardScreen.no_record_found}
                  </Text>
                </View>
              </>
            );
          }}
        />
      </View>
    </Wrap>
  );
};
export default HomeSearch;
