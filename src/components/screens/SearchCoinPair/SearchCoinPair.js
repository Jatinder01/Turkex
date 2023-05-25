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
import styles from "./SearchCoinPairStyle";
import LinearGradient from "react-native-linear-gradient";
import TradeHeader from "../../common/TradeHeader";
import { useDispatch, useSelector } from "react-redux";
import Singleton from "../../../Singleton";
import { EventRegister } from "react-native-event-listeners";
import {
  tradeValuesUpdate,
  getMarketList,
  getFavMarketData,
  updateFavMarketData,
} from "../../../Redux/Actions";
import * as constants from "../../../Constants";
const SearchCoinPair = () => {
  const dispatch = useDispatch();
  // const marketSocketReducer = useSelector((state) => state.marketSocketReducer);
  const { marketData, marketFavData } = useSelector(
    (state) => state.marketSocketReducer
  );

  const [favArray, setFavArray] = useState([]);
  const [pairData, setPairData] = useState(null);
  const [marketArr, setMarketArr] = useState([]);
  const [searchData, setSearchData] = useState(marketData);
  const [loginStatus, setLoginStatus] = useState(null);
  // const { marketCoinInfo } = useSelector((state) => state?.orderHistoryReducer);
  console.log("getFavMarketData=-=marketData=-", marketData);
  const getName = (market, name) => {
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
              console.log("getFavMarketData=-=res=-", res);
              let arr = res.map((item) => {
                return getName(market, item);
              });
              if (arr.length > 0) {
                setFavArray(arr);
                setPairData(marketData);
              } else {
                setFavArray([]);
                setPairData(marketData);
              }
              console.log("getFavMarketData=-+++=arr=-", arr);
            })
            .catch((err) => {
              console.log("getFavMarketData=-=err=-", err);
            });
        } else {
          setPairData(marketData);
          setLoginStatus(false);
        }
      });
    // Singleton.getInstance()
    //   .getData("favArr")
    //   .then((res) => {
    //     if (res != null && res != "[]") {
    //       let favData = JSON.parse(res);
    //       console.log("favData=-=-=-", favData);
    //       // setFavArray(favData);
    //     } else {
    //       // setFavArray([]);
    //     }
    //   });
  };
  useEffect(() => {
    console.log("marketFavData=-=err-=-");
    dispatch(getMarketList())
      .then((res) => {
        setMarketArr(res);
        getSavedFav(res);
      })
      .catch((err) => {
        console.log("favData=-=err-=-", err);
      });

    return () => { };
  }, [marketFavData]);
  // const onSearch = value => {
  //   setPairData(
  //     searchData.filter(i =>
  //       i.name.toLowerCase().includes(value.toLowerCase()),
  //     ),
  //   );
  // };
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
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(
            tradeValuesUpdate({
              prop: "selectedCoinPair",
              value: item,
            })
          );

          Actions.currentScene != "Trades" && Actions.Trades();
        }}
        style={
          {
            // backgroundColor: ThemeManager.colors.inputColor,
            // borderTopLeftRadius: 30,
            // borderTopRightRadius: 30,
          }
        }
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
              // alignItems: 'flex-end',
              // justifyContent: 'flex-end',
              flexDirection: "row",
              // justifyContent: 'flex-start',
              //tradeReducer.selectedCoinPair.price_change_percent.slice(0,-1,);
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                // justifyContent: 'flex-start',
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
                console.log("fav item deatils=-=->pairName>>", pairName);
                Singleton.getInstance()
                  .getData(constants.IS_LOGIN)
                  .then((isLogin) => {
                    console.log("check isLogin=-=-3=-=>>>", isLogin);
                    if (isLogin == "true") {
                      dispatch(updateFavMarketData(pairName))
                        .then((res) => {
                          console.log("updateFavMarketData=-=-res>>>", res);
                          getSavedFav(marketArr);
                          EventRegister.emit("favRefresh", "it works!!!");
                        })
                        .catch((err) => {
                          console.log("updateFavMarketData=-err=->>>", err);
                        });
                      console.log("fav item deatils=-=->>>", item);
                    }
                  });
              }}
            >
              <Image
                source={
                  favArray.filter((e) => e != null && e == item.name).length > 0
                    ? { uri: ThemeManager.ImageIcons.icon_star }
                    : { uri: ThemeManager.ImageIcons.icon_star }
                }
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  marginLeft: 15,
                  tintColor:
                    favArray.filter((e) => e === item.name).length > 0
                      ? ThemeManager.colors.selectedTextColor
                      : null,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.DashboardBG },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
    >
      <View>
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchView,
              { backgroundColor: ThemeManager.colors.dashboardSearchBarBg },
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
              // style={{flex: 0.3}}
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
          // flex: 1,
          // height: 30,
        }}
      >
        <FlatList
          data={pairData}
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            flexGrow: 1,
            // backgroundColor: ThemeManager.colors.whiteScreen,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // marginTop: 20,
          }}
          // style={{flexGrow: 1}}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return (
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
            );
          }}
        />
      </View>
    </Wrap>
  );
};
export default SearchCoinPair;
