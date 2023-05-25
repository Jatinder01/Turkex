/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  View,
  Share,
} from "react-native";
import { Loader } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import { TouchableOpacity } from "react-native";
import { NavList, CardRoundShadow } from "../../common";
import { Actions } from "react-native-router-flux";
import { useSelector, useDispatch } from "react-redux";
import { USER_DATA } from "../../../Constants";
import Singleton from "../../../Singleton";
import { getRewardHistory } from "../../../Redux/Actions";
// import {Value} from 'react-native-reanimated';
import moment from "moment";
import { Spinner } from "native-base";
import SimpleHeader from "../../common/SimpleHeader";

const InnerValues = ({ title, value, customStyle }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={[
          {
            paddingTop: 10,
            flex: 1,
            color: ThemeManager.colors.textColor1,
            fontFamily: Fonts.regular,
            fontSize: 13,
            width: "30%",
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          {
            paddingTop: 10,
            width: "70%",
            marginLeft: 15,
            color: "#A1A1A1",
            fontFamily: Fonts.regular,
            fontSize: 13,
          },
          customStyle,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const LatestRewardHistory = (props) => {
  const dispatch = useDispatch();

  const { refralRewardHistory, paginationLoader, referralLoader, moreData } =
    useSelector((state) => state?.RefralReducer);
  const [uid, setUid] = useState("");
  const [page, setPage] = useState(1);

  function onReached() {
    // alert('SD=');'

    if (moreData) {
      dispatch(getRewardHistory(uid, page + 1));

      setPage(page + 1);
    }
  }

  useEffect(() => {
    Singleton.getInstance()
      .getData(USER_DATA)
      .then((res) => {
        var data = JSON.parse(res);
        setUid(data?.uid);
        dispatch(getRewardHistory(data?.uid, page));
      })
      .catch((err) => {});
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.DashboardBG }}>
      <View style={{ marginHorizontal: 16, height: 40 }}>
        <SimpleHeader
          titleName={"Latest Reward History"}
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          titleStyle={{
            fontSize: 18,
            fontFamily: Fonts.medium,
            color: ThemeManager.colors.textColor1,
          }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: ThemeManager.colors.BackgroundDarkView,
          flex: 1,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: 10,
          paddingBottom: 5,
          padding: 5,
        }}
      >
        {!referralLoader && refralRewardHistory?.length == 0 && (
          <View style={{ alignItems: "center", marginTop: "50%" }}>
            <Image
              style={{ height: 80, width: 50 }}
              resizeMode="center"
              source={{ uri: ThemeManager.ImageIcons.icon_no_open_order }}
            />
            <Text
              style={{
                color: "#A1A1A1",
                fontFamily: Fonts.regular,
              }}
            >
              You Have No Hostory{" "}
            </Text>
          </View>
        )}
        <FlatList
          data={refralRewardHistory}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: ThemeManager.colors.rewHisbg,
                  borderRadius: 7,
                  marginTop: 20,
                  marginLeft: 15,
                  marginRight: 15,
                }}
              >
                <View style={{ padding: 15, borderRadius: 4 }}>
                  <InnerValues
                    title="Currency"
                    value={item?.currency_id}
                    customStyle={{ textTransform: "uppercase" }}
                  />
                  <InnerValues title="Reward" value={item?.credit} />
                  <InnerValues
                    title="Email"
                    value={item?.data[0]?.email}
                    customStyle={{ letterSpacing: -0.5 }}
                  />
                  <InnerValues
                    title="Date"
                    value={moment(item?.created_at).format("DD MMM YYYY")}
                  />
                  <InnerValues title="Level" value={item?.data[0]?.level} />
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.1}
          onEndReached={onReached}
        />
        {paginationLoader && <Spinner />}
      </View>
      <Loader isLoading={referralLoader} />
    </View>
  );
};

export default LatestRewardHistory;
