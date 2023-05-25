/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  TextInput,
  StatusBar,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { strings } from "../../../../Localization";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts, Images } from "../../../theme";
import { Wrap, Loader, CustomEmptyView } from "../../common";
import useStyles from "./WithdrawSearchStyle";
import TradeHeader from "../../common/TradeHeader";
import { useDispatch, useSelector } from "react-redux";
import Singleton from "../../../Singleton";
import { getWithdrawCoinList } from "../../../Redux/Actions";

const WithdrawSearch = (props) => {
  const styles = useStyles(ThemeManager);
  const dispatch = useDispatch();
  const [favArray, setFavArray] = useState([]);
  const [pairData, setPairData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const { withdrawListCoinInfo, isWithdrawListLoading } = useSelector(
    (state) => state.depositListReducer
  );

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
    getSavedFav();

    dispatch(getWithdrawCoinList("withdrawal"));
    return () => { };
  }, []);
  useEffect(() => {
    setSearchData(withdrawListCoinInfo);
    setPairData(withdrawListCoinInfo);
    return () => { };
  }, [withdrawListCoinInfo]);
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

    return <Text style={styles.nameTextStyle}>{textName}</Text>;
  };
  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <CustomEmptyView />
        <Text style={styles.noRecordText}>
          {strings.cardScreen.no_record_found}
        </Text>
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <>
        {item.type !== "fiat" && item.networks.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              Actions.currentScene != "WithdrawWallet" &&
                Actions.WithdrawWallet({ coin: item });
              setSearchData("");
            }}
          >
            <View style={styles.viewContainer}>
              <View style={[styles.flexStart]}>
                {item.icon_url ? (
                  <Image
                    source={{ uri: item.icon_url }}
                    style={styles.iconStyle}
                  />
                ) : (
                  <View style={styles.nameView}>{getName(item.name)}</View>
                )}
                <Text style={[styles.activeTextStyle]}>
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
    <>
      <Wrap
        style={styles.bgColor}
        screenStyle={[styles.screenStyle, styles.bgColor]}
        bottomStyle={styles.bgColor}
      >
        <View>
          <View style={[styles.searchContainer]}>
            <View style={[styles.searchView]}>
              <Image
                source={{ uri: ThemeManager.ImageIcons.icon_search_text }}
                style={styles.searchIcon}
              />
              <TextInput
                value={searchData}
                onChangeText={onSearch}
                style={styles.searchInput}
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
                    // { color: ThemeManager.colors.Depositbtn },
                  ]}
                >
                  {strings.currencyDetails.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.topSearchView}>
          <View style={styles.topSearch}>
            <TradeHeader
              title={strings.currencyDetails.top_search}
              underLine={true}
            />
          </View>
        </View>
        <View style={styles.listView}>
          <FlatList
            data={pairData}
            keyboardShouldPersistTaps={"handled"}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={renderItem}
            ListEmptyComponent={listEmptyComponent}
          />
        </View>
        <Loader isLoading={isWithdrawListLoading ? true : false} />
      </Wrap>
    </>
  );
};
export default WithdrawSearch;
