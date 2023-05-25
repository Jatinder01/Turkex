/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";
import styles from "./LocationStyle";
import { Wrap } from "../../common/Wrap";
import { LocationInput, ButtonPrimary, Header } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, colors, Images } from "../../../theme";
import { strings } from "../../../../Localization";
import fonts from "../../../theme/fonts";
import { Actions } from "react-native-router-flux";
import GetLocation from "react-native-get-location";
import { countryFlags } from "../../common/CountryFlags";
import LinearGradient from "react-native-linear-gradient";
import { registerFormUpdate } from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import * as constants from "../../../Constants";
import Singleton from "../../../Singleton";
import SimpleHeader from "../../common/SimpleHeader";
import BorderLine from "../../common/BorderLine";
// const data = {
//   countryNameEn: "United States of America",
//   countryNameLocal: "United States of America",
//   countryCode: "US",
//   currencyCode: "USD",
//   currencyNameEn: "United States dollar",
//   tinType: "EIN",
//   tinName: "Tax Identification Number",
//   officialLanguageCode: "en",
//   officialLanguageNameEn: "English",
//   officialLanguageNameLocal: "English",
//   countryCallingCode: "1",
//   region: "North America",
//   flag: "🇺🇸",
// };
const data = {
  countryNameEn: "United Kingdom",
  countryNameLocal: "Great Britain",
  countryCode: "GB",
  currencyCode: "GBP",
  currencyNameEn: "Pound sterling",
  tinType: "VAT Reg No",
  tinName: "Value added tax registration number",
  officialLanguageCode: "en",
  officialLanguageNameEn: "English",
  officialLanguageNameLocal: "English",
  countryCallingCode: "44",
  region: "Europe",
  flag: "🇬🇧",
};
const Location = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United Kingdom");
  const [countrySelected, setCountrySelected] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("🇬🇧");
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [noData, setNoData] = useState(false);
  const { isThemeUpdate } = useSelector((state) => state?.tradeReducer);
  useEffect(() => {
    return () => {
      isThemeUpdate;
    };
  }, [isThemeUpdate]);
  useEffect(() => {
    Singleton.getInstance().saveData(
      constants.LOCATION_DATA,
      JSON.stringify(data)
    );
  }, []);

  useEffect(() => {
    dispatch(
      registerFormUpdate({
        prop: "registerCountry",
        value: "GB",
      })
    );
    dispatch(
      registerFormUpdate({
        prop: "registerCountryCallingCode",
        value: "44",
      })
    );
    dispatch(
      registerFormUpdate({
        prop: "registerCountryName",
        value: "United Kingdom",
      })
    );
    dispatch(
      registerFormUpdate({
        prop: "registerCountryCallingFlag",
        value: "🇬🇧",
      })
    );
  }, []);

  const onSearch = (value) => {
    setCountryData(
      searchData.filter(
        (i) =>
          i?.countryNameEn?.toLowerCase().includes(value.toLowerCase()) ||
          i?.countryCallingCode?.toLowerCase().includes(value.toLowerCase()) ||
          i?.countryCallingCode
            ?.toLowerCase()
            .includes(value.replace("+", "").toLowerCase())
      )
    );
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={() => {
          setSelectedCountry(item.countryNameEn);
          setCountrySelected(true);
          setSelectedCountryFlag(item.flag);
          dispatch(
            registerFormUpdate({
              prop: "registerCountry",
              value: item.countryCode,
            })
          );
          dispatch(
            registerFormUpdate({
              prop: "registerCountryCallingCode",
              value: item.countryCallingCode,
            })
          );
          dispatch(
            registerFormUpdate({
              prop: "registerCountryCallingFlag",
              value: item.flag,
            })
          );
          setModalVisible(false);
          setCountryData(countryFlags);
        }}
      >
        <View style={{ borderRadius: 15, marginRight: 10 }}>
          <Text
            style={{
              fontSize: 16,
              marginTop: 10,
              color: ThemeManager.colors.headTxt,
            }}
          >
            {item.flag}
          </Text>
        </View>
        <Text
          style={{
            marginTop: 15,
            fontSize: 16,
            fontFamily: Fonts.regular,
            color: ThemeManager.colors.textBW,
          }}
        >
          {item.countryNameEn}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* <Header
            mainView={{ marginHorizontal: 16 }}
            btnTextLeft=" "
            leftImage={{ uri: ThemeManager.ImageIcons.icon_back }}
            leftButtonClicked={() => {
              Actions.pop();
            }}
          /> */}
          <Image
            style={styles.headerImage}
            source={{ uri: ThemeManager.ImageIcons.earth_icon }}
          />
          <Text
            style={[
              styles.titleStyle,
              { color: ThemeManager.colors.black_white },
            ]}
          >
            {strings.location.title}
          </Text>
          <LocationInput
            mainView={{ marginHorizontal: 16 }}
            btnTextLeft=" "
            btnTextRight=" "
            backgroundColor={ThemeManager.colors.inputBackground}
            flag={selectedCountryFlag}
            location={selectedCountry}
            clicked={() => {
              setModalVisible(true);
            }}
            textColor={ThemeManager.colors.lightText83}
            uri={ThemeManager.ImageIcons.icon_swap_c}
          />


          <View style={{ marginTop: 25, marginBottom: 15 }}>
            <ButtonPrimary
              style={{ marginTop: 5 }}
              title={strings.titleName.continue}
              onPress={() => {
                // if (countrySelected) {
                //   Actions.currentScene != "CreateAccount" &&
                //     Actions.CreateAccount();
                // } else {
                //   Actions.currentScene != "CreateAccount" &&
                //     Actions.CreateAccount();
                // }
                Actions.currentScene != "EnterAccountDetails" &&
                  Actions.EnterAccountDetails();
              }}
            />
          </View>

          <Text
            style={[
              styles.subTitleStyle,
              { color: ThemeManager.colors.lightText83 },
            ]}
          >
            {strings.location.subTitle}
          </Text>
        </View>
        {/* <View
          style={{
            alignItems: "flex-end",
            flex: 0.1,
            paddingBottom: 50,
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              if (countrySelected) {
                Actions.currentScene != "CreateAccount" &&
                  Actions.CreateAccount();
              } else {
                Actions.currentScene != "CreateAccount" &&
                  Actions.CreateAccount();
              }
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={["#64B77C", "#347899", "#1F5BA7"]}
              // style={{
              //   justifyContent: 'center',
              //   alignItems: 'center',
              // }}
              style={{
                // right: 16,
                // bottom: 0,
                width: 50,
                height: 50,
                backgroundColor: ThemeManager.colors.Depositbtn,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Image
                style={{
                  width: 20,
                  height: 16,
                  tintColor: ThemeManager.colors.Purewhite,
                }}
                source={{ uri: Images.icon_forward_arrow }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View> */}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCountryData(countryFlags);
        }}
      >
        <Wrap
          darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
          style={{ backgroundColor: ThemeManager.colors.modalBox }}
          screenStyle={[styles.screenStyle]}
          bottomStyle
        >
          <View
            style={{
              backgroundColor: ThemeManager.colors.bgDarkwhite,
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <View>
                <View style={styles.searchContainer}>
                  <View
                    style={[
                      styles.searchView,
                      {
                        backgroundColor: ThemeManager.colors.SwapInput,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_search_text }}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      value={searchData}
                      onChangeText={onSearch}
                      style={{
                        width: "80%",
                        // color: "black",
                        color: ThemeManager.colors.textColor,
                        // backgroundColor: "red",
                        height: 50,
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                        paddingTop: Platform.OS === "android" ? 12 : 0,
                      }}
                      placeholder={strings.currencyDetails.search}
                      placeholderTextColor={
                        ThemeManager.colors.inactiveTextColor
                      }
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        setCountryData(countryFlags);
                      }}
                    >
                      <Text
                        style={[
                          styles.cancelText,
                          { color: ThemeManager.colors.black_white },
                        ]}
                      >
                        {strings.currencyDetails.cancel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ marginHorizontal: 15, flex: 1 }}>
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.black_white,
                    marginBottom: 5,
                  }}
                >
                  {strings.location.location}
                </Text>
                <BorderLine />
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: colors.btnTextColor, //ThemeManager.colors.locationText,
                  }}
                >
                  {selectedCountryFlag} {selectedCountry}
                </Text>

                <Text
                  style={{
                    marginTop: 25,
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.black_white,
                    marginBottom: 5,
                  }}
                >
                  {strings.location.countryRegion}
                </Text>
                <BorderLine />
                <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
                  {countryData.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                          flexDirection: "row",
                          marginBottom: 3,
                        }}
                        onPress={() => {
                          setSelectedCountry(item.countryNameEn);
                          setCountrySelected(true);
                          setSelectedCountryFlag(item.flag);
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountry",
                              value: item.countryCode,
                            })
                          );
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryCallingCode",
                              value: item.countryCallingCode,
                            })
                          );
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryName",
                              value: item.countryNameEn,
                            })
                          );
                          dispatch(
                            registerFormUpdate({
                              prop: "registerCountryCallingFlag",
                              value: item.flag,
                            })
                          );
                          setModalVisible(false);
                          setCountryData(countryFlags);
                        }}
                      >
                        <View style={{ borderRadius: 15, marginRight: 10 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              marginTop: 10,
                              color: ThemeManager.colors.lightText83,
                            }}
                          >
                            {item.flag}
                          </Text>
                        </View>
                        <Text
                          style={{
                            marginTop: 15,
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                            color: ThemeManager.colors.lightText83,
                          }}
                        >
                          {item.countryNameEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <View>
                    {countryData?.length == 0 && (
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 16,
                          fontFamily: Fonts.medium,
                          marginTop: 60,
                          textAlign: "center",
                        }}
                      >

                        {strings.currencyDetails.country_not_found}
                      </Text>
                    )}
                  </View>
                  <View style={{ height: 40 }}></View>
                </ScrollView>
                {/* <FlatList
                  keyboardShouldPersistTaps={'handled'}
                  style={styles.countryList}
                  data={countryData}
                  renderItem={renderItem}
                  ListFooterComponent={() => {
                    return <View style={{marginBottom: 20}}></View>;
                  }}
                  scrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                /> */}
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
    </SafeAreaView>
  );
};

export default Location;
