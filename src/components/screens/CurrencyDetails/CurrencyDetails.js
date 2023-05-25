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
  Alert,
  Dimensions,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import { ButtonPrimary, ConvertInput, Wrap, Loader } from "../../common";
import styles from "./CurrencyDetailsStyle";
import {
  getCurrencyDetails,
  getBalanceDetails,
  tradeValuesUpdate,
  buySellSocket,
  getDepositCoinListPairs,
  getProfile1,
  getCoinAddress,
  updateMarketPair,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import * as constants from "../../../Constants";
import Singleton from "../../../Singleton";
import LinearGradient from "react-native-linear-gradient";

const { height, width } = Dimensions.get("window");
var blockchain_key;
const CurrencyDetails = (props) => {
  // const marketSocketReducer = useSelector(
  //   (state) => state?.marketSocketReducer
  // );
  const { marketData } = useSelector((state) => state?.marketSocketReducer);
  const [coinList, setcoinList] = useState([]);
  const dispatch = useDispatch();
  // const withDetails = useSelector((state) => state?.withDetails);
  const { currencyDetailsLoading, currencyDetails } = useSelector(
    (state) => state?.withDetails
  );

  const [userData, setuserData] = useState(null);
  // const activeCoin = useSelector((state) => state?.activeCoin);
  const { error } = useSelector((state) => state?.activeCoin);

  const [coinName, setcoinName] = useState(props?.coin?.id);
  // const depositListReducer = useSelector((state) => state?.depositListReducer);
  const { depositCoinListInfo, isLoading } = useSelector(
    (state) => state?.depositListReducer
  );

  useEffect(() => {
    getData();
    return () => {};
  }, [marketData]);

  useEffect(() => {
    blockchain_key = props?.coin?.networks[0].blockchain_key;
    dispatch(getCurrencyDetails({ coinName }));
    dispatch(getBalanceDetails({ coinName }));
    dispatch(getCoinAddress(coinName, blockchain_key));
    dispatch(getDepositCoinListPairs("withdrawal"));
    props.navigation.addListener("didFocus", (event) => {
      blockchain_key = props?.coin?.networks[0].blockchain_key;
      dispatch(getCurrencyDetails({ coinName }));
      dispatch(getBalanceDetails({ coinName }));
      dispatch(getDepositCoinListPairs("withdrawal"));
      dispatch(getCoinAddress(coinName, blockchain_key));
      getData();
    });

    getData();
    return () => {};
  }, []);
  const getData = () => {
    var coin = [];
    marketData?.filter((value) => {
      if (value.base_unit == coinName) {
        coin.push(value);
      }
      setcoinList(coin);
    });
  };
  const getClickedItem = (data) => {
    let item = data?.find((value) => value.id == coinName);
    return item;
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
              const item = getClickedItem(depositCoinListInfo);
              Actions.currentScene != "WithdrawWallet" &&
                Actions.WithdrawWallet({ coin: item });
            } else {
              // Alert.alert(constants.APP_NAME_CAPS, "KYC is not verified.");
              Singleton.getInstance().showError("KYC is not verified.");
            }
            // let confirmations = JSON.parse(res)?.labels.find(
            //   (item) => item.value === "verified" && item.key === "tier_1"
            // );

            // if (confirmations === undefined) {
            //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
            // } else if (confirmations?.value === "verified") {
            //   const item = getClickedItem(
            //     depositListReducer?.depositCoinListInfo
            //   );
            //   Actions.currentScene != "WithdrawWallet" &&
            //     Actions.WithdrawWallet({ coin: item });
            // } else {
            //   Alert.alert(constants.APP_NAME, "KYC is not verified.");
            // }
          } catch (err) {}
        }
      })
      .catch((err) => {});
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
          dispatch(updateMarketPair(item.base_unit + item.quote_unit));

          dispatch(
            buySellSocket({
              pair: item.base_unit + item.quote_unit,
            })
          );
          Actions.currentScene != "Trades" && Actions.Trades();
        }}
        style={{
          backgroundColor: ThemeManager.colors.tabBackground,
          flex: 1,
          margin: 2,
          padding: 10,
          borderRadius: 6,
        }}
      >
        <Text style={[styles.nameText, { color: colors.searchPlaceHolder }]}>
          {item.name}
        </Text>
        <View style={styles.flexRow}>
          <Text
            style={[
              styles.availableText,
              {
                color: ThemeManager.colors.textColor1,
                maxWidth: "65%",
              },
            ]}
          >
            {Singleton.getInstance().ParseFloatNumberOnly(item.avg_price, 8)}
          </Text>
          <Text
            style={[
              styles.availableText,
              {
                color:
                  item.price_change_percent > 0
                    ? ThemeManager.colors.textGreenColor
                    : ThemeManager.colors.textRedColor,
                maxWidth: "35%",
              },
            ]}
          >
            {item.price_change_percent}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Wrap
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      style={{ backgroundColor: ThemeManager.colors.modalBox }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.modalBox },
      ]}
      bottomStyle={{ backgroundColor: ThemeManager.colors.tabBackground }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}
        >
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_back }}
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Image
            source={{ uri: props.coin.icon_url }}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor1,
              marginLeft: 5,
            }}
          >
            {coinName.toUpperCase()}
          </Text>
        </View>
        <View style={{ width: 20 }} />
      </View>
      {<Loader isLoading={currencyDetailsLoading || isLoading} />}
      <View
        style={[
          styles.viewStyle,
          { backgroundColor: ThemeManager.colors.modalBox },
        ]}
      >
        <View style={{ marginHorizontal: 15, marginTop: 20, flexGrow: 1 }}>
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={coinList}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 5 }}
            // numColumns="2"
            renderItem={renderItem}
            ListHeaderComponent={() => {
              return (
                <>
                  <Text style={styles.totalText}>
                    {strings.currencyDetails.total}
                  </Text>
                  <View style={styles.horizontalFlex}>
                    <Text
                      style={[
                        styles.totalBalanceText,
                        { color: ThemeManager.colors.textColor1 },
                      ]}
                    >
                      {currencyDetails?.balance
                        ? parseFloat(currencyDetails?.balance)
                        : 0 + currencyDetails?.locked
                        ? parseFloat(currencyDetails?.locked)
                        : 0}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      width: "85%",
                      marginTop: 20,
                    }}
                  >
                    <View style={{ width: "50%", marginRight: 20 }}>
                      <Text style={[styles.totalText]}>
                        {strings.currencyDetails.available}
                      </Text>
                      <Text
                        style={[
                          styles.availableText,
                          {
                            color: ThemeManager.colors.textColor1,
                            flex: 1,
                          },
                        ]}
                      >
                        {currencyDetails?.balance
                          ? currencyDetails?.balance
                          : 0}
                      </Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text style={[styles.totalText]}>
                        {strings.currencyDetails.in_order}
                      </Text>
                      <Text
                        style={[
                          styles.availableText,
                          {
                            color: ThemeManager.colors.textColor1,
                          },
                        ]}
                      >
                        {currencyDetails?.locked ? currencyDetails?.locked : 0}
                      </Text>
                    </View>
                  </View>
                  {/* <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    
                    <View
                      style={{
                        alignItems: "flex-end",
                        backgroundColor: 'red',
                        flex: 1,
                        marginRight: 120,
                      }}
                    >
                      
                    </View>
                  </View> */}
                  <View style={styles.goToView}>
                    {coinList?.length > 0 ? (
                      <Text
                        style={[
                          styles.availableText,
                          { color: ThemeManager.colors.textColor1 },
                        ]}
                      >
                        {strings.currencyDetails.go_to_trade}
                      </Text>
                    ) : null}
                  </View>
                </>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>

      <View
        style={{
          justifyContent: "flex-end",
          // backgroundColor: ThemeManager.colors.tabBackground,
        }}
      >
        <View style={styles.btnView}>
          {/* <TouchableOpacity
            onPress={() => {
              if (
                activeCoin?.error !=
                "Deposit has been disabled for this address"
              ) {
                Actions.currentScene != "DepositWallet" &&
                  Actions.DepositWallet({ coin: props.coin });
              } else {
                Singleton.getInstance().showWarn(activeCoin?.error);
              }
            }}
            style={styles.withdrawalView}
          >
            <Text
              style={[
                styles.withdrawalText,
                { color: ThemeManager.colors.textColor },
              ]}
            >
              {strings.currencyDetails.deposit}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              if (error != "Deposit has been disabled for this address") {
                Actions.currentScene != "DepositWallet" &&
                  Actions.DepositWallet({ coin: props.coin });
              } else {
                Singleton.getInstance().showWarn(error);
              }
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
              {strings.currencyDetails.deposit}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const item = getClickedItem(depositCoinListInfo);
              Actions.currentScene != "WithdrawWallet" &&
                Actions.WithdrawWallet({ coin: item });
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
                {strings.currencyDetails.withdrawal}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              // updateState();
              const item = getClickedItem(
                depositListReducer?.depositCoinListInfo
              );
              Actions.currentScene != "WithdrawWallet" &&
                Actions.WithdrawWallet({ coin: item });
            }}
            style={[
              styles.depositView,
              {
                backgroundColor: ThemeManager.colors.convertBox,
                borderWidth: 2,
                borderColor: ThemeManager.colors.Depositbtn,
              },
            ]}
          >
            <Text
              style={[
                styles.depositText,
                { color: ThemeManager.colors.walletDPbtn },
              ]}
            >
              {strings.currencyDetails.withdrawal}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Wrap>
  );
};
export default CurrencyDetails;
