/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import useStyles from "./MarketsStyle";
import { Wrap, TabIcon } from "../../common";
import { HeaderComponent } from "../../common/HeaderComponent";
import { ThemeManager } from "../../../../ThemeManager";
import { strings } from "../../../../Localization";
import { MarketView } from "../../common";
import { ScrollableTabView } from "../../../Libs/react-native-scrollable-tabview";
import FavMarket from "../../common/FavMarket";
import BchPage from "../../common/BchPage";
import {
  tradeValuesUpdate,
  getMarketList,
  favMarketTicker,
} from "../../../Redux/Actions";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";
import { EventRegister } from "react-native-event-listeners";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

import { useDispatch, useSelector } from "react-redux";
import fonts from "../../../theme/fonts";
import { Images, colors } from "../../../theme";
import Singleton from "../../../Singleton";
import * as constants from "../../../Constants";

const Markets = (props) => {
  const ref = useRef(null);
  const styles = useStyles(ThemeManager);
  const [selectedTab, setSelectedTab] = useState(true);
  const [selectedPage, setSelectedPage] = useState(0);
  const { marketData, marketFavData, pairArray } = useSelector(
    (state) => state?.marketSocketReducer
  );
  const { coinToUsdData } = useSelector((state) => state?.FundsReducer);

  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (global.fromMarket) {
      setSelectedTab(false);
    } else {
      setSelectedTab(true);
    }
    EventRegister.emit("favRefresh", "it works!!!");
    // global.fromMarket = false;
    props.navigation.addListener("didFocus", () => {
      EventRegister.emit("favRefresh", "it works!!!");
      if (global.fromMarket) {
        setSelectedTab(false);
      } else {
        setSelectedTab(true);
      }
    });
    return () => {
      setSelectedTab(false);
    };
  }, []);
  // const onScrollEnd = (e) => {
  //   let pageNumber = Math.min(
  //     Math.max(
  //       Math.floor(e.nativeEvent.contentOffset.x / screenWidth + 0.5) + 1,
  //       0
  //     ),
  //     listItems.length
  //   );
  // };
  // const ListItem = ({ item, index }) => {
  //   if (index === 0) {
  //     alert("1");
  //     return <Text style={{ width: screenWidth }}>hello i m here</Text>;
  //   } else {
  //     alert("2");
  //     return <Text style={{ width: screenWidth }}>hello i m here two</Text>;
  //   }
  // };

  return (
    <Wrap
      style={styles.containerColor}
      screenStyle={[styles.screenStyle, styles.containerColor]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={styles.containerColor}
    >
      <HeaderComponent
        headerViewStyle={styles.containerColor}
        searchViewStyle={styles.searchView}
        onPressRightFilter={() => {}}
        onSearchPress={() => {
          Actions.currentScene != "SearchCoinPair" &&
            Actions.push("SearchCoinPair");
        }}
      />
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
            <Text style={styles.favText}>{strings.markets_tab.Favorites}</Text>

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
                    if (isLogin == "true") {
                      setSelectedTab(false);
                    } else {
                      Actions.currentScene != "Login" &&
                        Actions.Login({ fromScreen: "Markets" });
                    }
                  });
              }}
              value={marketData}
              favShow={true}
              selectedMarketItem={(item) => {
                dispatch(
                  tradeValuesUpdate({
                    prop: "selectedCoinPair",
                    value: item,
                  })
                );
                // Actions.push('BuySellMarket');
                global.fromMarket = false;
                Actions.currentScene != "BuySellMarket" &&
                  Actions.BuySellMarket({ item: item });
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
                  backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
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
                      console.log("item=-=----->>>", item);
                      dispatch(
                        tradeValuesUpdate({
                          prop: "selectedCoinPair",
                          value: item,
                        })
                      );
                      global.fromMarket = true;
                      Actions.currentScene != "BuySellMarket" &&
                        Actions.BuySellMarket({ item: item });
                    }}
                  />
                );
              })}
            </ScrollableTabView>
          )}
        </View>
      </ScrollView>
    </Wrap>
  );
};
// Markets.navigationOptions = ({navigation}) => {
//   return {
//     header: null,
//     tabBarLabel: ' ',
//     tabBarIcon: ({focused}) => (
//       <TabIcon
//         focused={focused}
//         title={strings.bottom_tab.Markets}
//         ImgSize={{width: 24, height: 20}}
//         activeImg={{uri: Images.Markets_Active}}
//         defaultImg={{uri: Images.Markets_InActive}}
//       />
//     ),
//     tabBarOptions: {
//       style: {
//         backgroundColor: ThemeManager.colors.tabBackground,
//       },
//     },
//   };
// };
export default Markets;
