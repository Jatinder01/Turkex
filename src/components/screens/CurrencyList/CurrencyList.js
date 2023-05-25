/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import styles from "./CurrencyListStyle";
import { ButtonPrimary, Header } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Actions } from "react-native-router-flux";
import { Images, colors, Fonts } from "../../../theme";

import { strings } from "../../../../Localization";
import { AlphabetList } from "react-native-section-alphabet-list";
import SimpleHeader from "../../common/SimpleHeader";
import { getActiveCoinList } from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
const data = [
  { value: "Lillie-Mai Allen", key: "lCUTs2" },
  { value: "Emmanuel Goldstein", key: "TXdL0c" },
  { value: "Winston Smith", key: "zqsiEw" },
  { value: "William Blazkowicz", key: "psg2PM" },
  { value: "Gordon Comstock", key: "1K6I18" },
  { value: "Philip Ravelston", key: "NVHSkA" },
  { value: "Rosemary Waterlow", key: "SaHqyG" },
  { value: "Julia Comstock", key: "iaT1Ex" },
  { value: "Mihai Maldonado", key: "OvMd5e" },
  { value: "Murtaza Molina", key: "25zqAO" },
  { value: "Peter Petigrew", key: "8cWuu3" },
];
const exampleData = [
  { value: "JPY", key: "JP" },
  { value: "KES", key: "KE" },
  { value: "KZT", key: "KZ" },
  { value: "USD", key: "US" },
  { value: "EUR", key: "EU" },
  { value: "INR", key: "IN" },
];
const sizes = {
  itemHeight: 40,
  headerHeight: 30,
  listHeaderHeight: 80,

  spacing: {
    small: 10,
    regular: 15,
    large: 20,
  },
};
const colorsSample = {
  background: {
    light: "white",
    dark: "#8e8e93",
  },

  seperatorLine: "#e6ebf2",

  text: {
    dark: "#1c1b1e",
  },

  primary: "#007aff",
};

const CurrencyList = () => {
  const dispatch = useDispatch();
  const { activeCoinInfo } = useSelector((state) => state?.activeCoin);
  const [currencyData, setCurrencyData] = useState(activeCoinInfo);
  const [searchData, setSearchData] = useState(activeCoinInfo);
  const [selectedItem, setSelectedItem] = useState("usdt");
  console.log("activeCoin-=-=-=-", activeCoinInfo);
  const onSearch = (value) => {
    console.log("searchData-=-=-=-", searchData);
    setCurrencyData(
      searchData.filter(
        (i) =>
          i?.id.toLowerCase().includes(value.toLowerCase()) ||
          i?.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const renderListItem = ({ item, index }) => {
    console.log("renderListItem==-", item);
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedItem(item?.id);
        }}
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginVertical: 10,
          marginHorizontal: 1,
        }}
      >
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Image
            source={{ uri: item?.icon_url }}
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              fontSize: 16,
              color: ThemeManager.colors.textColor,
              fontFamily: Fonts.regular,
              marginLeft: 10,
              textTransform: "uppercase",
            }}
          >
            {item?.id}
          </Text>
        </View>
        {selectedItem == item?.id ? (
          <Image
            source={{ uri: Images.icon_select }}
            style={{
              width: 20,
              height: 16,
              resizeMode: "contain",
              tintColor: ThemeManager.colors.selectedTextColor,
            }}
          />
        ) : (
          <View style={{ width: 20, height: 16 }} />
        )}
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (section) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
      </View>
    );
  };
  useEffect(() => {
    dispatch(getActiveCoinList());
    return () => { };
  }, []);
  // const renderCustomListHeader = () => {
  //   return (
  //     <View style={styles.listHeaderContainer}>
  //       <Text>List Header</Text>
  //     </View>
  //   );
  // };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{ marginHorizontal: 16, marginBottom: 15, marginVertical: 10 }}
      >
        <SimpleHeader
          // backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* <Header
          mainView={{ paddingHorizontal: 25 }}
          customCenterTitle={{ fontSize: 18 }}
          leftImage={{ uri: ThemeManager.ImageIcons.icon_back }}
          titleCenter=" "
          btnTextLeft=" "
          btnTextRight=" "
          leftButtonClicked={() => {
            Actions.pop();
          }}
        /> */}
        <View style={{ marginHorizontal: 15 }}>
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 22,
              color: ThemeManager.colors.textColor,
            }}
          >
            {strings.titleName.currency}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: ThemeManager.colors.tabActiveBackgroundColor,
              // backgroundColor: "red",
              borderRadius: 8,
              paddingHorizontal: 10,
              // paddingVertical: 10,
              height: 40,
              // marginTop: 15,
            }}
          >
            <Image
              source={{ uri: ThemeManager.ImageIcons.icon_search_text }}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
            <TextInput
              value={searchData}
              placeholder={strings.currency.search}
              placeholderTextColor={ThemeManager.colors.inactiveTextColor}
              onChangeText={onSearch}
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.regular,
                width: "85%",
                fontSize: 14,
                marginLeft: 10,
                marginBottom: Platform.OS == "android" ? -4 : 0,
              }}
            />
          </View>
        </View>
        <ScrollView>
          <View style={{ marginHorizontal: 20 }}>
            {/* <AlphabetList
              style={{ flex: 1 }}
              data={["1", "2", "3"]}
              renderCustomItem={renderListItem}
              getItemHeight={() => sizes.itemHeight}
              renderCustomSectionHeader={(section) => <View></View>}
            /> */}
            <FlatList
              keyboardShouldPersistTaps={"handled"}
              style={styles.countryList}
              data={currencyData}
              renderItem={renderListItem}
              scrollEnabled={true}
              keyExtractor={(item, index) => index.toString()}
            // extraData={this.props.selected}
            />
            {/* <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {currencyData.map(renderListItem)}
            </ScrollView> */}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CurrencyList;
