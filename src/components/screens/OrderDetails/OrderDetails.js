/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import styles from "./OrderDetailsStyle";
import { Wrap } from "../../common/Wrap";
import { HeaderComponent } from "../../common/HeaderComponent";
import { ThemeManager } from "../../../../ThemeManager";
import Moment from "moment";
import { Actions } from "react-native-router-flux";
import WalletHeader from "../../common/WalletHeader";
import { strings } from "../../../../Localization";
import TradeHeader from "../../common/TradeHeader";
import BorderLine from "../../common/BorderLine";
import { colors, Fonts, Images } from "../../../theme";
import PagerView from "react-native-pager-view";
import { useSelector } from "react-redux";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-simple-toast";
import { showMessage, hideMessage } from "react-native-flash-message";
import Singleton from "../../../Singleton";

const screenWidth = Dimensions.get("window").width;

const OrderDetails = (props) => {
  const [currencyText, setCurrencyText] = useState("BTC/USDT");
  const [type, setType] = useState("Filled(100%)");
  const [orderNo, setOrderNo] = useState("09809809");
  const [typeInfo, setTypeInfo] = useState("Limit/Buy");
  const [filled, setFilled] = useState("0.00122");
  const [amount, setAmount] = useState("0.00122");
  const [avg, setAvg] = useState("4000");
  const [price, setPrice] = useState("4000");
  const [conditions, setConditions] = useState("");
  const [fee, setFee] = useState("0.0000145 BTC");
  const [total, setTotal] = useState("58.40000000 USDT");
  const [createTime, setCreateTime] = useState("2022-01-21 07:11:13");
  const [updateTime, setUpdateTime] = useState("2022-01-21 07:11:13");
  const [date, setDate] = useState("2022-01-21 07:11:13");
  const [priceOnly, setPriceOnly] = useState("4000");
  const [role, setRole] = useState("Maker");
  const orderHistoryReducer = useSelector(
    (state) => state?.orderHistoryReducer
  );

  useEffect(() => {
    return () => {};
  }, []);

  const getName = (name) => {
    let data = orderHistoryReducer?.marketCoinInfo.find(
      (value) => value.id == name
    );
    return data?.name;
  };
  const copyToClipboard = (id) => {
    Clipboard.setString(id);
    Singleton.getInstance().showMsg(strings.spot.order_no_copied);
    // showMessage({
    //   message: strings.spot.order_no_copied,
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
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[
        styles.screenStyle,
        {
          backgroundColor: ThemeManager.colors.DashboardBG,
        },
      ]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
    >
      <WalletHeader
        onBackPress={() => Actions.pop()}
        titleText={strings.orderDetails.order_details}
        noRightIcons={true}
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: ThemeManager.colors.DashboardBG,
          flexGrow: 1,
        }}
      >
        <View>
          <View style={styles.pairView}>
            <Text style={[styles.pairText]}>{strings.orderDetails.pair}</Text>
            <Text
              style={[
                styles.pairCurrencyText,
                { color: ThemeManager.colors.textColor1 },
              ]}
            >
              {getName(props.detail.market)}
            </Text>
          </View>
          <View
            style={[
              styles.mainView,
              { backgroundColor: ThemeManager.colors.BackgroundDarkView },
            ]}
          >
            <View style={styles.rowStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.order_no}
              </Text>
              <View style={styles.orderView}>
                <Text style={styles.activeText}>{props.detail.id}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // alert(props?.detail?.id);
                    copyToClipboard(JSON.stringify(props?.detail?.id));
                  }}
                >
                  <Image
                    source={{ uri: Images.icon_copy }}
                    style={styles.iconStyle}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.type}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  {
                    color:
                      props.detail.side == "sell"
                        ? colors.appRed
                        : colors.appGreen,
                  },
                ]}
              >
                {props.detail.ord_type}/{props.detail.side}
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.filled_account}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.detail.executed_volume}
                <Text style={[styles.inactiveText]}>
                  {"/"}
                  {props.detail.origin_volume}
                </Text>
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.avg_price}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.detail.avg_price}
                <Text style={[styles.inactiveText]}>
                  {"/"}
                  {props.detail.price}
                </Text>
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.conditions}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              ></Text>
            </View>
            <BorderLine />

            <View style={styles.rowStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.create_time}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {Moment(props.detail.created_at).format("DD-MM-YY hh:mm:ss")}
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.update_time}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {Moment(props.detail.updated_at).format("DD-MM-YY hh:mm:ss")}
              </Text>
            </View>
            <View
              style={{
                height: 5,
                backgroundColor: ThemeManager.colors.tabBackground,
              }}
            />
            <View style={styles.subView}>
              <Text style={styles.tradeText}>
                {strings.orderDetails.trade_details}
              </Text>
            </View>
            <View style={styles.subViewStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.date}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {Moment(props.detail.created_at).format("DD-MM-YY hh:mm:ss")}
              </Text>
            </View>
            <View style={styles.subViewStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.price}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.detail.price}
              </Text>
            </View>
            <View style={styles.subViewStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.amount}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.detail.origin_volume}
              </Text>
            </View>
            <View style={styles.subViewStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.fee}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {props.detail.maker_fee}
              </Text>
            </View>
            <View style={styles.subViewStyle}>
              <Text style={styles.inactiveText}>
                {strings.orderDetails.role}
              </Text>
              <Text
                style={[
                  styles.activeText,
                  { color: ThemeManager.colors.textColor },
                ]}
              >
                {role}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Wrap>
  );
};

export default OrderDetails;
