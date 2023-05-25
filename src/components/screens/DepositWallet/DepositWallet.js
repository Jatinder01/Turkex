/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  ScrollView,
  FlatList,
  Share,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { Actions } from "react-native-router-flux";
import CameraRoll from "@react-native-community/cameraroll";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import { Wrap, Loader } from "../../common";
import WalletHeader from "../../common/WalletHeader";
import QRCode from "react-native-qrcode-svg";
import styles from "./DepositWalletStyle";
import {
  getCoinAddress,
  resetCoinAddress,
  resetDepositList,
  getDepositCoinListPairs,
  resetWithdrawalForm,
  getCurrencyDetailsList,
  resetDepositDetails,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import Clipboard from "@react-native-clipboard/clipboard";
import ViewShot from "react-native-view-shot";
import * as constants from "../../../Constants";
import { showMessage, hideMessage } from "react-native-flash-message";
import LinearGradient from "react-native-linear-gradient";
import BorderLine from "../../common/BorderLine";
import { getIpAddress } from "react-native-device-info";
import Singleton from "../../../Singleton";
let blockchain_key;
var coinName;
const { height, width } = Dimensions.get("window");
const DepositWallet = (props) => {
  const dispatch = useDispatch();
  const viewShot = useRef(null);
  const [networkName, setNetworkName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [coin, setCoin] = useState("");
  const [networkList, setNetworkList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  //reducers
  // const activeCoin = useSelector((state) => state?.activeCoin);
  const { getCoinAddress: getCoinAddressData, isLoading } = useSelector(
    (state) => state?.activeCoin
  );

  // const depositListReducer = useSelector((state) => state?.depositListReducer);
  const { depositCoinListInfo } = useSelector(
    (state) => state?.depositListReducer
  );

  const { currencyBalanceList, currencyBalanceIsLoading } = useSelector(
    (state) => state?.withDetails
  );
  // console.log("currencyBalanceList=-=-=->>>", currencyBalanceList);
  const copyToClipboard = (data) => {
    Clipboard.setString(data);
    Singleton.getInstance().showMsg(strings.spot.address_copied);
    // showMessage({
    //   message: strings.spot.address_copied,
    //   backgroundColor: ThemeManager.colors.tabBottomBorder,
    //   autoHide: true,
    //   duration: 3000,
    //   type: "success",
    //   icon: "success",
    //   position: "right",
    //   style: {
    //     marginHorizontal: 10,
    //     borderRadius: 10,
    //     marginTop: Platform.OS == "android" ? 10 : 40,
    //   },
    // });
  };
  const getAddress = (coinName) => {
    dispatch(getCoinAddress(coinName, blockchain_key))
      .then((res) => {
        if (res.address === "" || res.address === null) {
          setTimeout(() => {
            dispatch(getCoinAddress(coinName, blockchain_key))
              .then((res) => {
                if (res.address != null || res.address != "") {
                  setLoader(false);
                }
                if (res.address === "" || res.address === null) {
                  setTimeout(() => {
                    dispatch(getCoinAddress(coinName, blockchain_key))
                      .then((res) => {
                        setLoader(false);
                      })
                      .catch((err) => {
                        setLoader(false);
                      });
                  }, 2000);
                } else {
                  setLoader(false);
                }
              })
              .catch((err) => {
                console.log("getCoinAddress=-=-=-=--->>>err3333", err);
                setLoader(false);
              });
          }, 2000);
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log("getCoinAddress=-=-=-=--->>>err", err);
      });
  };
  useEffect(() => {
    setLoading(true);
    dispatch(resetCoinAddress());
    dispatch(resetDepositList);
    dispatch(resetWithdrawalForm());
    dispatch(resetDepositDetails());

    dispatch(getCurrencyDetailsList())
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    dispatch(getDepositCoinListPairs("deposit"));

    props.navigation.addListener("didFocus", (event) => {
      setLoading(true);
      dispatch(getCurrencyDetailsList())
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
      const ch = props?.coin?.id;
      if (ch === undefined) {
        coinName = props?.coin?.currencyDetails?.currency;
        // dispatch(getCoinAddress(coinName, blockchain_key));
        getAddress(coinName, blockchain_key);
        setNetworkName(blockchain_key);
        setNetworkList(props?.coin?.currencyDetails?.networks);
      } else {
        setNetworkList(props?.coin?.networks);
        blockchain_key = props?.coin?.networks[0].blockchain_key;
        setNetworkName(blockchain_key);
        coinName = props?.coin?.id;
        getAddress(coinName, blockchain_key);
        // dispatch(getCoinAddress(coinName, blockchain_key));
      }
    });

    return () => {
      dispatch(resetCoinAddress());
      dispatch(resetDepositList);
      dispatch(resetWithdrawalForm());
    };
  }, []);

  const getItemBalance = (data) => {
    let selectedCurrencyDetails = data?.find(
      (value) => value.currency == coinName
    );

    return selectedCurrencyDetails?.balance;
  };

  useEffect(() => {
    if (getCoinAddressData !== null) {
      setAddress(getCoinAddressData?.address);
      setCoin(getCoinAddressData?.currency);
    } else {
    }

    return () => {};
  }, [getCoinAddressData]);

  const getMinimumDepositAmount = (data) => {
    let currency = data?.find((value) => value.id == coinName);
    return currency?.min_deposit_amount;
  };

  const getMinConfirmation = (data) => {
    let confirmations = data?.find((value) => value.id == coinName);
    return confirmations?.min_confirmations;
  };
  const checkConfirmations = (data) => {
    let confirmationCheck = data?.find((value) => value.id == coinName);
    return confirmationCheck === 1
      ? strings.spot.network_confirmation
      : strings.spot.network_confirmations;
  };

  const onShare = async () => {
    try {
      let network_type = networkName
        .replace("-Testnet", "")
        .replace("-testnet", "")
        .replace("-Mainnet", "")
        .replace("-mainnet", "");
      const result = await Share.share({
        title: strings.spot.appLink,
        message: `Currency: ${coinName.toUpperCase()} \nNetwork: ${network_type.toUpperCase()}\nAddress: ${address}`,
      });
      // const result = await Share.share({
      //   title: strings.spot.appLink,
      //   message:
      //     "Network: " + network_type.toUpperCase() + " Address: " + address,
      // });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const hasAndroidPermission = async () => {
    if (Platform.OS === "android") {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      let status = await PermissionsAndroid.request(permission);
      if (status === "granted") {
        savePicture();
        return true;
      } else {
        Alert.alert(constants.APP_NAME_CAPS, "CAMERA permission denied");
      }
      return status === "granted";
    } else {
      savePicture();
    }
  };
  const savePicture = async (uri) => {
    const type = "photo";
    const album = "XChangeMonster";
    viewShot.current.capture().then((uri) => {
      var promise = CameraRoll.save(uri, [type, album]);
      promise
        .then(function (result) {
          Singleton.getInstance().showMsg(
            "Image successfully saved in gallery"
          );
          // showMessage({
          //   message: "Image successfully saved in gallery",
          //   backgroundColor: ThemeManager.colors.tabBottomBorder,
          //   autoHide: true,
          //   duration: 3000,
          //   type: "success",
          //   icon: "success",
          //   position: "right",
          //   style: {
          //     marginHorizontal: 10,
          //     borderRadius: 10,
          //     marginTop: Platform.OS == "android" ? 10 : 40,
          //   },
          // });
        })
        .catch(function (error) {
          Singleton.getInstance().showWarn("Image not saved in gallery");
          // showMessage({
          //   message: "Image not saved in gallery",
          //   backgroundColor: ThemeManager.colors.tabBottomBorder,
          //   autoHide: true,
          //   duration: 3000,
          //   type: "danger",
          //   icon: "warning",
          //   position: "right",
          //   style: {
          //     marginHorizontal: 10,
          //     borderRadius: 10,
          //     marginTop: Platform.OS == "android" ? 10 : 40,
          //   },
          // });
        });
    });
  };
  const captureImage = () => {
    hasAndroidPermission();
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(getCoinAddress(item.currency_id, item.blockchain_key));
          setNetworkName(item.blockchain_key);
          setAddress(item.address);
          setModalVisible(false);
        }}
        style={{
          height: 50,
          marginTop: 5,
          backgroundColor: ThemeManager.colors.tabBackground,
          justifyContent: "center",
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
          {item.blockchain_key.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Wrap
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      style={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.tabBackground }}
    >
      <Loader isLoading={isLoading ? true : loader ? true : false} />
      <Loader isLoading={currencyBalanceIsLoading || loading} />
      <WalletHeader
        onBackPress={() => Actions.pop()}
        onHistoryPress={() => {
          Actions.currentScene != "HistoryWallet" &&
            Actions.push("HistoryWallet");
        }}
      />
      <ViewShot
        ref={viewShot}
        options={{ format: "jpg", quality: 1.0 }}
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.dashboardSubViewBg,
        }}
      >
        <ScrollView bounces={false}>
          <View
            style={{
              backgroundColor: ThemeManager.colors.dashboardSubViewBg,
              flex: 1,
            }}
          >
            <View style={{ margin: 15 }}>
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: Fonts.medium,
                  color: ThemeManager.colors.textColor,
                }}
              >
                {strings.spot.deposit} {coinName?.toUpperCase()}
              </Text>
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <View
                  style={{ width: "100%", height: 180, alignItems: "center" }}
                >
                  {address ? (
                    <QRCode value={address} size={160} logoMargin={20} />
                  ) : (
                    getCoinAddressData?.address != null && (
                      <QRCode
                        value={address ? address : getCoinAddressData?.address}
                        size={160}
                        logoMargin={20}
                      />
                    )
                  )}
                </View>

                <Text
                  style={{
                    color: ThemeManager.colors.inactiveTextColor,
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                    marginTop: 15,
                  }}
                >
                  {strings.spot.send_only} {coinName?.toUpperCase()}{" "}
                  {strings.spot.to_this_deposit_address}
                </Text>
              </View>
              <BorderLine style={{ opacity: 0.3 }} />
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 30,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.spot.network}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor,
                    }}
                  >
                    {networkName
                      ? networkName.toUpperCase()
                      : "Please select network"}
                  </Text>
                </View>

                <Image
                  source={{ uri: ThemeManager.ImageIcons.icon_swap_c }}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",

                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 15,
                  flex: 1,
                }}
              >
                <View style={{ flex: 1, marginRight: 20 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.spot.wallet_address}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      copyToClipboard(
                        address ? address : getCoinAddressData?.address
                      );
                    }}
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        color: ThemeManager.colors.textColor,
                      }}
                    >
                      {address ? address : getCoinAddressData?.address}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    copyToClipboard(
                      address ? address : getCoinAddressData?.address
                    );
                  }}
                  style={{ flex: 0.1, justifyContent: "flex-start" }}
                >
                  <Image
                    source={{ uri: ThemeManager.ImageIcons.Icon_Profile_Copy }}
                    style={{ height: 20, width: 20, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: ThemeManager.colors.SwapInput,
                  borderRadius: 6,
                  marginTop: 20,
                  padding: 15,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.spot.minimum_deposit}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {depositCoinListInfo
                      ? getMinimumDepositAmount(depositCoinListInfo)
                      : null}{" "}
                    {getCoinAddressData?.currency.toUpperCase()}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 14,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.spot.balance}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {currencyBalanceList
                      ? getItemBalance(currencyBalanceList)
                      : null}{" "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 14,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.inactiveTextColor,
                    }}
                  >
                    {strings.spot.expected_arrival}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.textColor1,
                    }}
                  >
                    {depositCoinListInfo
                      ? getMinConfirmation(depositCoinListInfo)
                      : null}{" "}
                    {depositCoinListInfo
                      ? checkConfirmations(depositCoinListInfo)
                      : null}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            // marginTop: 10,
            paddingHorizontal: 16,
            paddingVertical: 5,
            marginBottom: 15,
            // backgroundColor: ThemeManager.colors.tabBackground,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              captureImage();
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: "48%",
              borderWidth: 1,
              borderRadius: 6,
              borderColor: ThemeManager.colors.withdrawText,
              // backgroundColor: ThemeManager.colors.tabBottomBorder,
            }}
          >
            <Text
              style={{
                color: ThemeManager.colors.withdrawText,
                fontSize: 14,
                fontFamily: Fonts.medium,
              }}
            >
              {strings.spot.save_image}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onShare();
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={["#64B77C", "#347899", "#1F5BA7"]}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                borderRadius: 6,
                // backgroundColor: ThemeManager.colors.btnColor2,

                width: width / 2 - 20,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.medium,
                  color: colors.white,
                }}
              >
                {strings.spot.share_address}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ViewShot>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
          bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setModalVisible(false);
              }}
            ></TouchableOpacity>
            <View
              style={{
                backgroundColor: ThemeManager.colors.whiteScreen,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 15,
                  marginVertical: 15,
                }}
              >
                <View style={{ width: 40 }} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.textColor1,
                  }}
                >
                  {strings.spot.choose_network}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Image
                    source={{ uri: Images.icon_cancel_light }}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.inactiveTextColor,
                  }}
                >
                  {strings.spot.ensure_the_network}
                </Text>
                <FlatList
                  keyboardShouldPersistTaps={"handled"}
                  data={networkList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  ListFooterComponent={() => {
                    return <View style={{ marginBottom: 40 }} />;
                  }}
                />
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
    </Wrap>
  );
};
export default DepositWallet;
