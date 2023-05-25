/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { ThemeManager } from "../../../ThemeManager";
import { colors, Fonts, Images } from "../../theme";
import ActionSheet from "react-native-actionsheet";
import { strings } from "../../../Localization";
import * as constants from "../../Constants";
import { Wrap } from "./Wrap";
import { useDispatch } from "react-redux";
import {
  buySellSocket,
  tradeValuesUpdate,
  getBalanceDetails,
  callTradeSocket,
  getUserAllBalance,
  getPublicTrade,
  placeTradeOrder,
  stopPreviousConnection,
  getTreadingRules,
  getTreadingFeee,
  tradeSocketClose,
  updateMarketPair,
} from "../../Redux/Actions";
import { ScrollableTabView } from "../../Libs/react-native-scrollable-tabview";
import FavMarket from "./FavMarket";
import BchPage from "./BchPage";
import LinearGradient from "react-native-linear-gradient";
import Singleton from "../../Singleton";
import { Actions } from "react-native-router-flux";
const screenHeight = Dimensions.get("window").height;
const MarketPairChangeModalMemo = (props) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const styles = useStyles(ThemeManager);
  const ActionSheetAsk = useRef(null);
  const [precision, setPrecision] = useState(4);
  const [dropdownSelectedValue, setDropdownSelectedValue] = useState("0.0001");
  // const marketSocketReducer = useSelector((state) => state.marketSocketReducer);
  const tradeReducer = useSelector((state) => state.tradeReducer);
  const FundsReducer = useSelector((state) => state.FundsReducer);
  const [modalVisible, setModalVisible] = useState(props.visible);
  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const { marketData, marketFavData, pairArray } = useSelector(
    (state) => state?.marketSocketReducer
  );
  const { coinToUsdData } = useSelector((state) => state?.FundsReducer);
  useEffect(() => {
    setModalVisible(props.visible);
  }, [props.visible]);

  const updateSocket = async (pair) => {
    dispatch(updateMarketPair(pair));
    dispatch(buySellSocket({ pair: pair }));
    dispatch(
      callTradeSocket({
        pair: pair,
      })
    );
  };
  const getUserBalance = (coinName) => {
    // alert(coinName);
    // dispatch(getBalanceDetails({ coinName }));
  };
  useEffect(() => {
    dispatch(
      getPublicTrade(
        tradeReducer.selectedCoinPair.base_unit +
        tradeReducer.selectedCoinPair.quote_unit
      )
    );
    return () => { };
  }, []);
  const tradeFeesFun = async (pair) => {
    let data = tradeReducer.tradeFeeData;
    let pairData = data.find((item) => item.id == pair);
    dispatch(
      tradeValuesUpdate({
        prop: "tradeFees",
        value: pairData,
      })
    );
    dispatch(
      tradeValuesUpdate({
        prop: "amountDecimalValue",
        value: pairData?.amount_precision,
      })
    );
    dispatch(
      tradeValuesUpdate({
        prop: "priceDecimalValue",
        value: pairData?.price_precision,
      })
    );
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => props.closeModal()}
    >
      <Wrap
        style={styles.containerColor}
        screenStyle={[styles.screenStyle, styles.containerColor]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={styles.containerColor}
      >
        <Text
          style={{
            color: ThemeManager.colors.textColor1,
            fontSize: 20,
            fontFamily: Fonts.medium,
            marginTop: 20,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          Markets
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedPage(0);
            // setModalVisibleMarket(false);
            props.closeModal();
          }}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            height: 40,
            width: 40,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        {/* <HeaderComponent
              headerViewStyle={styles.containerColor}
              searchViewStyle={styles.searchView}
              onPressRightFilter={() => {}}
              onSearchPress={() => {
                Actions.currentScene != "SearchCoinPair" &&
                  Actions.push("SearchCoinPair");
              }}
            /> */}
        <ScrollView
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }}
          nestedScrollEnabled={true}
          style={styles.scrollStyle}
        >
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab(true);
                setSelectedPage(0);
              }}
              style={styles.horizontalMargin}
            >
              <Text style={styles.favText}>
                {strings.markets_tab.Favorites}
              </Text>

              {selectedTab && (
                <LinearGradient
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#64B77C", "#347899", "#1F5BA7"]}
                  style={styles.gradientStyle}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab(false);
                setSelectedPage(0);
              }}
              style={{
                marginHorizontal: 20,
              }}
            >
              <Text style={styles.favText}>{strings.markets_tab.Spot}</Text>
              {selectedTab == false && (
                <LinearGradient
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#64B77C", "#347899", "#1F5BA7"]}
                  style={styles.gradientStyle}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.subContainer}>
            <View style={{ marginTop: 5 }}></View>
            {selectedTab ? (
              <FavMarket
                coinToUsdData={coinToUsdData}
                tabLabel="BNB"
                favClicked={() => {
                  Singleton.getInstance()
                    .getData(constants.IS_LOGIN)
                    .then((isLogin) => {
                      console.log("check isLogin=-=-3=-=>>>", isLogin);

                      console.log(
                        "cActions.currentScene=-=>>>",
                        Actions.currentScene
                      );

                      if (isLogin == "true") {
                        setSelectedTab(false);
                      } else {
                        Actions.currentScene != "Login" &&
                          Actions.Login({ fromScreen: "BuySellMarket" });
                        props.closeModal();
                      }
                    });
                }}
                value={marketData}
                favShow={true}
                selectedMarketItem={(item) => {
                  let pairValue = item.base_unit + item.quote_unit;
                  dispatch(updateMarketPair(pairValue));
                  dispatch(stopPreviousConnection()).then((res) => {
                    dispatch(tradeSocketClose()).then((res) => {
                      setTimeout(function () {
                        updateSocket(pairValue);
                      }, 1500);
                    });
                  });

                  getUserBalance(item?.quote_unit);
                  dispatch(
                    tradeValuesUpdate({
                      prop: "selectedCoinPair",
                      value: item,
                    })
                  );
                  setSelectedPage(0);
                  props.closeModal();
                }}
              />
            ) : (
              <ScrollableTabView
                tabBarPosition={"overlayTop"}
                // style={[styles.scrollBar]}
                style={{ height: screenHeight - 300 }}
                // selectedPosition
                initialPage={selectedPage}
                // ref={o => (this.activeTab = o)}
                ref={ref}
                tabBarUnderlineStyle={[
                  styles.tabStyle,
                  {
                    backgroundColor:
                      ThemeManager.colors.tabActiveBackgroundColor,
                  },
                ]}
                tabBarBackgroundColor="transparent"
                tabBarInactiveTextColor={ThemeManager.colors.inactiveTextColor}
                tabBarActiveTextColor={ThemeManager.colors.textColor}
                tabBarTextStyle={styles.tabTextStyle}
                onChangeTab={(i, index) => {
                  setSelectedPage(i.i);
                }}
                showCustomHeader={true}
              >
                {pairArray.map((item, key) => {
                  return (
                    <BchPage
                      coinToUsdData={coinToUsdData}
                      tabLabel={item?.toUpperCase()}
                      value={marketData}
                      selectedMarketItem={(item) => {
                        let arr = [];
                        let pairValue = item.base_unit + item.quote_unit;
                        dispatch(updateMarketPair(pairValue));
                        dispatch(stopPreviousConnection()).then((res) => {
                          dispatch(tradeSocketClose()).then((res) => {
                            setTimeout(function () {
                              updateSocket(pairValue);
                            }, 1500);
                          });
                        });

                        getUserBalance(item?.quote_unit);
                        dispatch(
                          tradeValuesUpdate({
                            prop: "selectedCoinPair",
                            value: item,
                          })
                        );
                        setSelectedPage(0);
                        props.closeModal();
                      }}
                    />
                  );
                })}
              </ScrollableTabView>
            )}
          </View>
        </ScrollView>
      </Wrap>
      {/* <Wrap
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
        bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            flex: 1,
          }}
        >
          <Text
            style={{
              color: ThemeManager.colors.textColor1,
              fontSize: 20,
              fontFamily: Fonts.medium,
              marginTop: 20,
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            Coin Pair Change
          </Text>
          <TouchableOpacity
            onPress={props.closeModal}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              height: 40,
              width: 40,
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
          >
            <Image
              source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={marketSocketReducer?.marketData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let arr = [];
                    let pairValue = item.base_unit + item.quote_unit;
                    dispatch(updateMarketPair(pairValue));
                    dispatch(stopPreviousConnection()).then((res) => {
                      dispatch(tradeSocketClose()).then((res) => {
                        setTimeout(function () {
                          updateSocket(pairValue);
                        }, 1500);
                      });
                    });

                    getUserBalance(item?.quote_unit);
                    dispatch(
                      tradeValuesUpdate({
                        prop: "selectedCoinPair",
                        value: item,
                      })
                    );

                    props.closeModal();
                  }}
                  style={{
                    height: 50,
                    marginTop: 5,
                    backgroundColor: ThemeManager.colors.tabBackground,
                    justifyContent: "center",
                    marginHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                      marginLeft: 10,
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Wrap> */}
    </Modal>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
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
    screenStyle: {
      flex: 1,
    },
    scrollBar: {
      flexGrow: 1,
    },
    textStyle: {
      fontSize: 16,
      fontFamily: Fonts.regular,
    },
    tabTextStyle: {
      textAlign: "center",
      color: theme.colors.textColor,
      fontSize: 11,
      paddingTop: 8,
      marginTop: 20,
      height: 30,
      width: 60,
      overflow: "hidden",
    },
    tabStyle: {
      backgroundColor: theme.colors.inactiveTextColor,
      height: 30,
      bottom: 0,
      zIndex: -1,
      borderRadius: 4,
    },
    containerColor: { backgroundColor: theme.colors.bgDarkwhite },
    searchView: {
      backgroundColor: theme.colors.dashboardSearchBarBg,
    },
    favText: {
      color: theme.colors.textBW,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    subContainer: {
      flexGrow: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    scrollStyle: {
      backgroundColor: theme.colors.bgDarkwhite,
      flexGrow: 1,
    },
    horizontalMargin: {
      marginHorizontal: 20,
    },
    gradientStyle: {
      height: 3,
      backgroundColor: theme.colors.tabBottomBorder,
      // width: size,
    },
  });

export const MarketPairChangeModal = React.memo(MarketPairChangeModalMemo);
