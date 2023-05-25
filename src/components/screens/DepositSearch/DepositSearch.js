/* eslint-disable prettier/prettier */
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
  Wrap,
  Loader,
  CustomEmptyView,
} from "../../common";
import ConvertHeader from "../../common/ConvertHeader";
import styles from "./DepositSearchStyle";
import LinearGradient from "react-native-linear-gradient";
import TradeHeader from "../../common/TradeHeader";
import { useDispatch, useSelector } from "react-redux";
import Singleton from "../../../Singleton";
import { EventRegister } from "react-native-event-listeners";
import {
  tradeValuesUpdate,
  placeTradeOrder,
  getDepositCoinListPairs,
  resetDepositList,
} from "../../../Redux/Actions";

const DepositSearch = () => {
  // const [balance, setBalance] = useState("0.067576 ETH");
  // const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  // const marketSocketReducer = useSelector(state => state?.marketSocketReducer);
  const [favArray, setFavArray] = useState([]);
  const [clickedFav, setClickedFav] = useState(false);
  const [pairData, setPairData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const { depositCoinListInfo, isLoading } = useSelector(
    (state) => state?.depositListReducer
  );
  console.log("depositCoinListInfo=-=-=->>", depositCoinListInfo);
  const getSavedFav = () => {
    Singleton.getInstance()
      .getData("favArr")
      .then((res) => {
        if (res != null && res != "[]") {
          let favData = JSON.parse(res);
          setFavArray(favData);
        }
      });
  };
  useEffect(() => {
    // getSavedFav();
    dispatch(getDepositCoinListPairs("deposit"));
    return () => {
      dispatch(resetDepositList);
    };
  }, []);
  useEffect(() => {
    setSearchData(depositCoinListInfo);
    setPairData(depositCoinListInfo);
    return () => { };
  }, [depositCoinListInfo]);
  const onSearch = (value) => {
    setPairData(
      searchData.filter(
        (i) =>
          i.name.toLowerCase().includes(value.toLowerCase()) ||
          i.id.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const getName = (name) => {
    const textName = name.charAt(0);

    return (
      <Text
        style={{
          fontSize: 16,
          fontFamily: Fonts.bold,
          textAlign: "center",
          marginTop: -2,
          color: ThemeManager.colors.textColor1,
        }}
      >
        {textName}
      </Text>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <>
        {item?.type !== "fiat" && item?.networks?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              Actions.currentScene != "DepositWallet" &&
                Actions.DepositWallet({ coin: item });
              setSearchData("");
            }}
          >
            <View style={styles.viewContainer}>
              <View style={[styles.flexStart]}>
                {item.icon_url ? (
                  <Image
                    source={{ uri: item.icon_url }}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: ThemeManager.colors.Depositbtn,
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getName(item.name)}
                  </View>
                )}

                <Text
                  style={[
                    styles.activeTextStyle,
                    { color: ThemeManager.colors.textColor },
                  ]}
                >
                  {item.id.toUpperCase()}
                </Text>
                <Text style={styles.inactiveTextStyle}>
                  {item.name.toUpperCase()}
                </Text>
                <Text style={styles.xStyle}>{item.xValue}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </>
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
          keyboardShouldPersistTaps={"handled"}
          data={pairData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            flexGrow: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
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
      <Loader isLoading={isLoading ? true : false} />
    </Wrap>
  );
};
export default DepositSearch;
