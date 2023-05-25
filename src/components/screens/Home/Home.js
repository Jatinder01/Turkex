/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  ScrollView,
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  PermissionsAndroid,
  Platform,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Tab, Tabs, Container } from "native-base";
import styles from "./HomeStyle";
import {
  HeaderDashboard,
  ButtonDashboardNew,
  TableTrade,
  TabIcon,
  Wrap,
} from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Images, colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { Actions } from "react-native-router-flux";
import { useDispatch, useSelector } from "react-redux";
import { HeaderComponent } from "../../common/HeaderComponent";
import { strings } from "../../../../Localization";
import * as constants from "../../../Constants";
import ActionSheet from "react-native-actionsheet";
import ImagePicker, { launchImageLibrary } from "react-native-image-picker";
import {
  callMarketTicker,
  logoutUser,
  getProfile,
  fundsFormUpdate,
  fundsUser,
  setSelectedCoin,
  tradeValuesUpdate,
  getProfile1,
  getAllMarket,
  getNotificationDataOnly,
  resetNotificationHistory,
  favMarketTicker,
  resetFavMarketList,
} from "../../../Redux/Actions";
import Singleton from "../../../Singleton";
// import { CameraKitCameraScreen } from "react-native-camera-kit";
import { Profile } from "..";
import QRScanner from "../../common/QRScanner";
import QrImageReader, { DecodeOptions } from "react-native-qr-image-reader";
import CustomModal from "../../common/CustomModal";
// import MarqueeText from "react-native-marquee";
import { SliderBox } from "react-native-image-slider-box";
import messaging from "@react-native-firebase/messaging";
function Item({
  cName,
  cValue,
  currentValue,
  cValueStyle,
  currentValueStyle,
  didSelectItem,
  key,
}) {
  return (
    <TouchableOpacity key={key} style={[styles.cItem]} onPress={didSelectItem}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={[
            styles.cName,
            { color: ThemeManager.colors.dashboardItemTextColor },
          ]}
        >
          {cName}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.currentValue, currentValueStyle]}
        >
          {" "}
          {currentValue}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 5,
        }}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.cValue,
            cValueStyle,
            { color: ThemeManager.colors.textColor },
          ]}
        >
          {parseFloat(cValue).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const Home = (props) => {
  const ActionSheetOrders = useRef(null);
  const { marketData } = useSelector((state) => state?.marketSocketReducer);

  const dispatch = useDispatch();
  const [userData, setuserData] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [isDocumentVerified, setisDocumentVerified] = useState(false);
  const [faEnabled, setfaEnabled] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [result, setResult] = useState();
  const [response, setResponse] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [selectedBtn, setSelectedBtn] = useState("Gainers");
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state.AuthReducer
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLImit] = useState(10);
  const [banner, setBanner] = useState([Images.banner1, Images.banner2]);

  const [unreadCount, setUnreadCount] = useState(0);

  const getTotalRecords = () => {
    dispatch(getNotificationDataOnly(pageNumber, pageLimit)).then((res) => {
      setUnreadCount(res?.data[0]?.unread_count);
    });
  };
  const checkNotificationStatus = () => {
    messaging().onMessage(async (remoteMessage) => {
      dispatch(getNotificationDataOnly(pageNumber, pageLimit)).then((res) => {
        setUnreadCount(res?.data[0]?.unread_count);
      });
    });
  };
  useEffect(() => {
    checkNotificationStatus();
    dispatch(callMarketTicker());
    dispatch(getAllMarket());
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        if (isLogin == "true") {
          setLoginStatus(true);
          getTotalRecords();
          dispatch(resetFavMarketList());
          dispatch(favMarketTicker());
          dispatch(getProfile1()).then((res) => {
            dispatch(fundsUser(true));
          });
        } else {
          setLoginStatus(false);
        }
      })
      .catch((err) => { });

    const { navigation } = props;
    navigation.addListener("didFocus", async (event) => {
      console.log("check =-=-start=-=-2=-=");
      Actions.refresh();
      getLoginStatus();

      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          if (isLogin == "true") {
            setLoginStatus(true);
            getTotalRecords();

            dispatch(getProfile1());
          } else {
            setLoginStatus(false);
          }
        });
    });

    //backhandler
    const backAction = () => {
      var currentRoute = navigation.state?.routeName;
      if (Actions.currentScene === "_Home") {
        Alert.alert(
          constants.APP_NAME_CAPS,
          "Are you sure you want to exit app?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      dispatch(resetNotificationHistory());
      backHandler.remove();
    };
  }, []);
  useEffect(() => {
    if (marketData?.length > 0 && marketData !== undefined) {
      setShowLoader(false);
    }
  }, [marketData, showLoader]);

  const getLoginStatus = () => {
    setTimeout(() => {
      Singleton.getInstance()
        .getData(constants.IS_LOGIN)
        .then((isLogin) => {
          if (isLogin == "true") {
            setLoginStatus(isLogin);
          } else {
            setLoginStatus(isLogin);
          }
        })
        .catch((err) => {
          // Actions.currentScene != 'Login' && Actions.reset('Login');
        });
    }, 2200);
  };
  const updateState = () => {
    dispatch(getProfile1());
    checkUserVerification();
  };
  const checkUserVerification = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then((res) => {
        setuserData(JSON.parse(res));
        if (JSON.parse(res).otp === false) {
          // Alert.alert(constants.APP_NAME_CAPS, "Please enable 2FA.");
          Singleton.getInstance().showError("Please enable 2FA.");
        } else {
          try {
            if (JSON.parse(res)?.level == 3) {
              // setKycStatus(true);
              Actions.currentScene != "WithdrawSearch" &&
                Actions.WithdrawSearch();
            } else {
              // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
              Singleton.getInstance().showError("KYC is not verified.");
            }
          } catch (err) { }
        }
      })
      .catch((err) => { });
  };

  const selectedMarketItem = (item) => {
    dispatch(
      tradeValuesUpdate({
        prop: "selectedCoinPair",
        value: item,
      })
    );
    Actions.currentScene != "BuySellMarket" &&
      Actions.BuySellMarket({ item: item });
  };

  const renderTable = (tabType) => {
    let marketArray = [];
    let GainerArray = [];
    let LoserArray = [];
    let hotArray = [];
    for (let i = 0; i < marketData?.length; i++) {
      if (marketData[i]?.name != "HOT/USDT") {
        var priceUpDown = marketData[i]?.price_change_percent;
        var priceUpDown1 =
          priceUpDown === undefined ? "0" : priceUpDown.slice(0, -1);
        // if (tabType == 0 && priceUpDown1 >= 0) {
        //   hotArray.push(marketSocketReducer?.marketData[i]);
        // } else

        if (tabType == 1 && priceUpDown1 >= 0) {
          GainerArray?.length < 10 && GainerArray.push(marketData[i]);
        } else if (tabType == 2 && priceUpDown1 < 0) {
          LoserArray?.length < 10 && LoserArray.push(marketData[i]);
        } else if (tabType == 3 && marketData[i].quote_unit == "btc") {
          marketArray?.length < 10 && marketArray.push(marketData[i]);
        }
      }
    }

    if (marketData == undefined || marketData?.length == 1) {
      return (
        <View
          style={{
            flex: 1,
            height: 400,
            backgroundColor: ThemeManager.colors.dashboardDarkBg,
            paddingBottom: 300,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.regular,
              color: ThemeManager.colors.textColor,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            Loading...
          </Text>
        </View>
      );
    } else {
      if (tabType == 0) {
        return (
          <View>
            <TableTrade
              selectedMarketItem={(item) => {
                dispatch(
                  tradeValuesUpdate({
                    prop: "selectedCoinPair",
                    value: item,
                  })
                );
                Actions.currentScene != "BuySellMarket" &&
                  Actions.BuySellMarket({ item: item });
              }}
              tableThFirstText="Pair"
              tableThSecondText="Last Price"
              tableThThirdText="24h Change"
              data={hotArray}
              tabType={tabType}
            />
          </View>
        );
      } else if (tabType == 1) {
        return (
          <View>
            <TableTrade
              selectedMarketItem={(item) => {
                dispatch(
                  tradeValuesUpdate({
                    prop: "selectedCoinPair",
                    value: item,
                  })
                );
                Actions.currentScene != "BuySellMarket" &&
                  Actions.BuySellMarket({ item: item });
              }}
              tableThFirstText="Pair"
              tableThSecondText="Last Price"
              tableThThirdText="24h Change"
              data={GainerArray}
              tabType={tabType}
              allMarketClicked={() => {
                ActionSheetOrders.current.show();
              }}
            />
          </View>
        );
      } else if (tabType == 2) {
        return (
          <View>
            <TableTrade
              selectedMarketItem={(item) => {
                dispatch(
                  tradeValuesUpdate({
                    prop: "selectedCoinPair",
                    value: item,
                  })
                );
                Actions.currentScene != "BuySellMarket" &&
                  Actions.BuySellMarket({ item: item });
              }}
              tableThFirstText="Pair"
              tableThSecondText="Last Price"
              tableThThirdText="24h Change"
              data={LoserArray}
              tabType={tabType}
              allMarketClicked={() => {
                ActionSheetOrders.current.show();
              }}
            />
          </View>
        );
      } else {
        return (
          <View>
            <TableTrade
              selectedMarketItem={(item) => {
                dispatch(
                  tradeValuesUpdate({
                    prop: "selectedCoinPair",
                    value: item,
                  })
                );
                Actions.currentScene != "BuySellMarket" &&
                  Actions.BuySellMarket({ item: item });
              }}
              tableThFirstText="Pair"
              tableThSecondText="Last Price"
              tableThThirdText="Volume (BTC)"
              data={marketArray}
              tabType={tabType}
              allMarketClicked={() => {
                ActionSheetOrders.current.show();
              }}
            />
          </View>
        );
      }
    }
  };

  const renderTopList = () => {
    if (marketData.length == 0 || marketData == undefined) {
      return (
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.regular,
            color: ThemeManager.colors.textColor,
            textAlign: "center",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Loading...
        </Text>
      );
    }
  };

  const onQRCodeScanDone = (QR_Codes) => {
    let QR_C = QR_Codes;
    let QR_Code = QR_C.replace("ethereum:", "");
    // console.log('QR_Code---_____++++--onQR_Code_Scan_Done------', QR_Code);
    // console.log('abc---_____++++--onQR_Code_Scan_Done------', QR_C);
    // Singleton.getInstance().showNavigationWhiteView = true;
    // if (QR_Code.includes('/')) {
    //   console.log('QR_Code-----------', QR_Code);
    //   let scannedArr = QR_Code.split('/');
    //   console.log(
    //     'QR_Code------scannedArr-----',
    //     scannedArr + '------------' + scannedArr.length + 'scannedArr[6]------',
    //     scannedArr[4],
    //   );
    // } else {
    //   if (state?.params.myCoin_symbol != null) {
    //     this.setState({
    //       QR_Code_Value: QR_Code,
    //       amountText: '',
    //       selectedValue: state?.params.myCoin_symbol,
    //       Start_Scanner: false,
    //     });
    //   } else {
    //     this.setState({
    //       QR_Code_Value: QR_Code,
    //       amountText: '',
    //       selectedValue: '',
    //       // selectedValue: this.state?.selectedValue,
    //       Start_Scanner: false,
    //     });
    //   }
    // }
  };
  const decode = async (options) => {
    const {
      result: decodeResult,
      errorCode,
      errorMessage,
    } = await QrImageReader.decode(options);

    if (decodeResult !== undefined) {
      setResult(decodeResult);
      setShowScanner(false);
      setQrCodeValue(decodeResult);
    } else {
      alert("Not found any qr code");
    }
  };
  const onChooseImage = () => {
    setResult("");
    var options = {
      mediaType: "photo",
      CancelButtonTitle: "Cancel",
      takePhotoButtonTitle: "Take Photo",
      chooseFromLibraryButtonTitle: "Choose From Gallery",
      title: "Choose Option",
      allowsEditing: true,
      quality: 0.2,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    launchImageLibrary({ mediaType: "photo" }, async (res) => {
      decode({
        path: res?.uri,
      });
    });
  };
  return (
    <>
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
        screenStyle={[
          styles.screenStyle,
          {
            backgroundColor: ThemeManager.colors.bgDarkwhite,
          },
        ]}
        darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
        bottomStyle={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
      >
        {/* <ImageBackground style={[
          { flex: 1 }
        ]}
        // source={Images.darkBG}
        > */}
        <HeaderComponent
          showUserIcon
          headerViewStyle={{ backgroundColor: ThemeManager.colors.bgDarkwhite }}
          searchViewStyle={{
            backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
          }}
          onSearchPress={() => {
            Actions.currentScene != "HomeSearch" && Actions.push("HomeSearch");
          }}
          records={unreadCount}
          onProfileClick={() => {
            Singleton.getInstance()
              .getData(constants.IS_LOGIN)
              .then((isLogin) => {
                // console.log('check isLogin=-=-=-=>>>', isLogin);
                if (isLogin == "true") {
                  Actions.currentScene != "Profile" && Actions.Profile();
                } else {
                  Actions.currentScene != "Login" &&
                    Actions.Login({ fromScreen: "Home" });
                }
              })
              .catch((err) => { });
          }}
          showScanIcon={false}
          NotificationPress={() => {
            Singleton.getInstance()
              .getData(constants.IS_LOGIN)
              .then((isLogin) => {
                // console.log('check isLogin=-=-=-=>>>', isLogin);
                if (isLogin == "true") {
                  Actions.currentScene != "Notifications" &&
                    Actions.push("Notifications");
                } else {
                  Actions.currentScene != "Login" &&
                    Actions.Login({ fromScreen: "Home" });
                }
              })
              .catch((err) => { });
          }}
        />
        <ScrollView
          bounces={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <HeaderDashboard banners={banner} />
          <View
            style={{
              // backgroundColor: ThemeManager.colors.dashboardSubViewBg,
              marginTop: 1,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              flex: 1,
            }}
          >
            <View
              style={[
                styles.helperBtns,
                {
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  // backgroundColor: ThemeManager.colors.dashboardSubViewBg,
                },
              ]}
            >
              <ButtonDashboardNew
                style={{
                  backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                  // padding: 10,
                  width: "23%",
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                btnIcon={{ uri: ThemeManager.ImageIcons.icon_deposit }}
                btnText={strings.home_tab.Deposit}
                onPress={() => {
                  // if (loginStatus) {
                  //   Actions.currentScene != 'DepositSearch' &&
                  //     Actions.push('DepositSearch');
                  // } else {
                  //   Actions.currentScene != 'Login' && Actions.push('Login');
                  // }
                  if (loginStatus) {
                    Actions.currentScene != "DepositSearch" &&
                      Actions.push("DepositSearch");
                  } else {
                    // Actions.currentScene != 'Login' && Actions.push('Login');
                    Actions.currentScene != "Login" &&
                      Actions.Login({ fromScreen: "Home" });
                  }
                }}
              />
              <ButtonDashboardNew
                style={{
                  backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                  width: "23%",
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                btnIcon={{ uri: ThemeManager.ImageIcons.icon_withdraw }}
                btnText={strings.home_tab.Withdrawal}
                onPress={() => {
                  if (loginStatus) {
                    Actions.currentScene != "WithdrawSearch" &&
                      Actions.WithdrawSearch();
                  } else {
                    Actions.currentScene != "Login" &&
                      Actions.Login({ fromScreen: "Home" });
                  }
                }}
              />
              <ButtonDashboardNew
                style={{
                  backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                  width: "23%",
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                btnIcon={{ uri: ThemeManager.ImageIcons.icon_spot }}
                btnText={strings.home_tab.Spot}
                onPress={() => {
                  global.fromMarket = true;
                  Actions.currentScene != "_Markets" &&
                    Actions.jump("_Markets", { screenData: true });
                }}
              />
              <ButtonDashboardNew
                style={{
                  backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
                  width: "23%",
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                btnIcon={{ uri: ThemeManager.ImageIcons.icon_swap_k }}
                btnText={strings.home_tab.swap}
                onPress={() => {
                  Actions.currentScene != "ConvertTrade" &&
                    Actions.ConvertTrade();
                }}
              />
            </View>
            <View
              style={
                {
                  // backgroundColor: ThemeManager.colors.dashboardSubViewBg,
                }
              }
            >
              {/* {renderTopList()} */}
              {/* <ScrollView
                style={{
                  marginHorizontal: 8,
                  paddingHorizontal: 10,
                }}
                // snapToAlignment="center"
                bounces={false}
                alwaysBounceHorizontal={false}
                // pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                onScroll={event => {}}>
                {marketSocketReducer?.marketData.map((prop, key) => {
                  var priceUpDown =
                    prop?.price_change_percent != null
                      ? prop?.price_change_percent?.substring(
                          0,
                          prop?.price_change_percent?.length - 1,
                        )
                      : '0.0';

                  return (
                    <Item
                      key={key}
                      didSelectItem={() => {
                        selectedMarketItem(prop);
                      }}
                      cName={prop.name}
                      cValue={prop.last}
                      cValueStyle={{
                        color:
                          parseFloat(priceUpDown) >= 0
                            ? colors.appGreen
                            : colors.appRed,
                        fontSize: 18,
                      }}
                      currentValue={prop?.price_change_percent}
                      currentValueStyle={{
                        color:
                          parseFloat(priceUpDown) >= 0
                            ? colors.appGreen
                            : colors.appRed,
                        fontSize: 13,
                      }}
                      onPress={() => {}}
                    />
                  );
                })}
              </ScrollView> */}
              <View
                style={{ height: 2, backgroundColor: colors.lightGray }}
              ></View>
            </View>
            <View
              style={
                {
                  // backgroundColor: ThemeManager.colors.dashboardSubViewBg,
                }
              }
            >
              <Tabs
                style={{ marginTop: 10 }}
                tabBarUnderlineStyle={[styles.navBarUnderlineBg]}
                tabContainerStyle={[
                  styles.tabsWrap,
                  {
                    backgroundColor: ThemeManager.colors.dashboardSubViewBg,
                    width: "75%",
                  },
                ]}
                onChangeTab={(i) => { }}
              >
                <Tab
                  style={{
                    backgroundColor: "clear",
                  }}
                  tabStyle={styles.navBarBg}
                  activeTabStyle={[
                    styles.navBarActiveBg,
                    { backgroundColor: ThemeManager.colors.tabBg },
                  ]}
                  textStyle={{
                    color: ThemeManager.colors.headerInActiveText,
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: fonts.regular,
                  }}
                  activeTextStyle={{
                    fontSize: 14,
                    textAlign: "center",
                    color: ThemeManager.colors.headerActiveText,
                    fontFamily: fonts.regular,
                  }}
                  heading={strings.home_tab.Gainers}
                >
                  {renderTable(1)}
                </Tab>
                <Tab
                  style={{
                    backgroundColor: "clear",
                  }}
                  tabStyle={styles.navBarBg}
                  activeTabStyle={[
                    styles.navBarActiveBg,
                    { backgroundColor: ThemeManager.colors.tabBg },
                  ]}
                  textStyle={{
                    textAlign: "center",
                    fontSize: 14,
                    color: ThemeManager.colors.headerInActiveText,
                    fontFamily: fonts.regular,
                  }}
                  activeTextStyle={{
                    fontSize: 14,
                    textAlign: "center",
                    color: ThemeManager.colors.headerActiveText,
                    fontFamily: fonts.regular,
                  }}
                  heading={strings.home_tab.Losers}
                >
                  {renderTable(2)}
                </Tab>
                <Tab
                  style={{ backgroundColor: "clear" }}
                  tabStyle={styles.navBarBg}
                  activeTabStyle={[
                    styles.navBarActiveBg,
                    { backgroundColor: ThemeManager.colors.tabBg },
                  ]}
                  textStyle={{
                    color: ThemeManager.colors.headerInActiveText,
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: fonts.regular,
                  }}
                  activeTextStyle={{
                    fontSize: 14,
                    textAlign: "center",
                    color: ThemeManager.colors.headerActiveText,
                    fontFamily: fonts.regular,
                  }}
                  heading={strings.home_tab.Vol}
                >
                  {renderTable(3)}
                </Tab>
              </Tabs>
            </View>
          </View>
        </ScrollView>
        <ActionSheet
          ref={ActionSheetOrders}
          options={[
            "All Markets",
            "BUSD Markets",
            "BNB Markets",
            "BTC Markets",
            "ETH Markets",
            strings.buy_sell_market.cancel,
          ]}
          cancelButtonIndex={5}
          onPress={(index) => {
            if (index !== 4) {
              if (index === 0) {
              } else if (index === 1) {
              } else if (index === 2) {
              }
            }
          }}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={showScanner}
          onRequestClose={() => setShowScanner(false)}
        >
          <Wrap
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            style={{ backgroundColor: "transparent" }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: "transparent", flex: 1 },
            ]}
            bottomStyle={{ backgroundColor: "transparent" }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 20,
                  left: 10,
                  zIndex: 100,
                  height: 80,
                  width: 80,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  backgroundColor: "transparent",
                }}
                onPress={() => {
                  // alert('he');
                  setShowScanner(false);
                  setQrCodeValue("");
                }}
              >
                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_back }}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 20,
                    resizeMode: "contain",
                    tintColor: "white",
                  }}
                />
              </TouchableOpacity>
              {/* <CameraKitCameraScreen
                style={{
                  width: Dimensions.get("window").width,
                  flex: 1,
                  backgroundColor: "#000",
                }}
                showFrame={true}
                scanBarcode={true}
                laserColor={"#FF3D00"}
                frameColor={"#00C853"}
                colorForScannerFrame={"black"}
                onReadCode={(event) => {
                  onQRCodeScanDone(event.nativeEvent.codeStringValue);
                }}
              /> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 50,
                  marginBottom: 30,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    //
                    Actions.currentScene != "ReceiveQR" &&
                      Actions.push("ReceiveQR");
                  }}
                  style={styles.scannerButton}
                >
                  <Image
                    source={{ uri: Images.icon_scanner }}
                    style={{ height: 30, width: 30, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onChooseImage();
                  }}
                  style={styles.scannerButton}
                >
                  <Image
                    source={{ uri: Images.icon_gallery }}
                    style={{ height: 30, width: 30, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Wrap>
        </Modal>
        {/* <Modal
          animationType="fade"
          transparent={true}
          visible={showLoader}
          onRequestClose={() => setShowLoader(false)}
        >
          <Wrap
            darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            screenStyle={[
              styles.screenStyle,
              { backgroundColor: "transparent", flex: 1 },
            ]}
            bottomStyle={{ backgroundColor: "transparent" }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator
                animating={showLoader}
                size={"large"}
                color={"white"}
              />
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                }}
              >
                Loading...
              </Text>
            </View>
          </Wrap>
        </Modal> */}
        {/* </ImageBackground> */}
      </Wrap>
    </>
  );
};
// Home.navigationOptions = ({navigation}) => {
//   return {
//     header: null,
//     tabBarLabel: ' ',
//     tabBarIcon: ({focused}) => (
//       <TabIcon
//         focused={focused}
//         title={strings.bottom_tab.Home}
//         ImgSize={{width: 21.0, height: 21}}
//         activeImg={{uri: Images.Home_Active}}
//         defaultImg={{uri: Images.Home_InActive}}
//       />
//     ),
//     tabBarOptions: {
//       style: {
//         backgroundColor: ThemeManager.colors.tabBackground,
//       },
//     },
//   };
// };

export default Home;
