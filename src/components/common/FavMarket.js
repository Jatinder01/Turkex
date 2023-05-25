import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
// import {TableMarket} from '../../common';

// import Singleton from '../../../Singleton';
import { EventRegister } from "react-native-event-listeners";
import { useSelector, useDispatch } from "react-redux";
// import {colors} from '../../../theme';
import { ThemeManager } from "../../../ThemeManager";
import { getFavMarketData, getMarketList } from "../../Redux/Actions";
import Singleton from "../../Singleton";
import { colors } from "../../theme";
import { TableMarket } from "./TableMarket";
import * as constants from "../../Constants";
// import {ThemeManager} from '../../../../ThemeManager'
let coinBasedArray = [];
const FavMarket = (props) => {
  const dispatch = useDispatch();
  const [favArray, setFavArray] = useState([]);
  const { marketData, marketFavData } = useSelector(
    (state) => state.marketSocketReducer
  );
  // const { marketCoinInfo } = useSelector((state) => state?.orderHistoryReducer);
  // console.log("favData=-=marketFavData-=-", marketFavData);
  const getFavMarket = () => {
    dispatch(getMarketList())
      .then((res) => {
        // console.log("favData==-=--=res-=-", res);
        getSavedFav(res);
      })
      .catch((err) => {
        console.log("favData==-=--=err-=-", err);
      });
  };
  useEffect(() => {
    getFavMarket();
    EventRegister.addEventListener("favRefresh", (data) => {
      // getSavedFav();
      // console.log("favData==-=-+++-=res-=-");
    });

    return () => {};
  }, [marketFavData]);
  const getName = (marketPair, name) => {
    let data = marketPair?.find((value) => value.id == name);
    return data?.name;
  };
  const getSavedFav = (marketPair) => {
    let coinBasedArray = [];
    // Singleton.getInstance()
    //   .getData("favArr")
    //   .then((res) => {
    //     if (res != null || res != "[]") {
    //       let arr = JSON.parse(res);
    //       setFavArray(arr);
    //     }
    //   });
    Singleton.getInstance()
      .getData(constants.IS_LOGIN)
      .then((isLogin) => {
        // console.log("check isLogin=-=-3=-=>>>", isLogin);
        if (isLogin == "true") {
          // let arr = marketFavData.map((item) => {
          //   return getName(marketPair, item);
          // });
          // if (arr.length > 0) {
          //   setFavArray(arr);
          //   // setPairData(marketData);
          // } else {
          //   setFavArray([]);
          //   // setPairData(marketData);
          // }
          // return;
          dispatch(getFavMarketData())
            .then((res) => {
              // console.log("getFavMarketData=-=res=+++-", res);

              let arr = res?.map((item) => {
                return getName(marketPair, item);
              });
              // console.log("getFavMarketData=-=arr=+++-", arr);

              if (arr?.length > 0) {
                setFavArray(arr);
                // setPairData(marketData);
              } else {
                setFavArray([]);
                // setPairData(marketData);
              }
              // console.log("getFavMarketData=-=arr=-", arr);
            })
            .catch((err) => {
              console.log("getFavMarketData=-=err=-", err);
            });
        }
      });
  };

  let coinBasedArray = [];

  if (favArray != undefined) {
    for (let i = 0; i < favArray?.length; i++) {
      for (let j = 0; j < marketData?.length; j++) {
        if (marketData[j]?.name == favArray[i]) {
          let item = marketData[j];
          item.fav = true;
          coinBasedArray.push(item);
        }
      }
    }
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: ThemeManager.colors.dashboardDarkBg }}
    >
      <TableMarket
        selectedMarket={(item) => {
          props.selectedMarketItem(item);
        }}
        data={coinBasedArray}
        coinToUsdData={props.coinToUsdData}
        favShow={props.favShow}
        favClicked={props.favClicked}
      />
    </View>
  );
};

export default FavMarket;
