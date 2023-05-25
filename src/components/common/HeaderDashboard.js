/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Linking,
  ScrollView,
} from "react-native";
import { colors, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import { HeaderComponent } from "./HeaderComponent";
import FastImage from "react-native-fast-image";
import { SliderBox } from "react-native-image-slider-box";
// import { onChange } from "react-native-reanimated";
import { Actions } from "react-native-router-flux";
import Singleton from "../../Singleton";
import * as constants from "../../Constants";

// import Carousel from "react-native-reanimated-carousel";
const { width, height } = Dimensions.get("window");
const announcement = ["74th phase of Dual Investment Launched", "Adding LU..."];
const HeaderDashboard = ({ onPress, banners }) => {
  // const [BANNER, setBANNER] = useState([]);
  const [imgActive, setImgActive] = useState(0);
  const onChange = (nativeEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
      );
      if (slide != imgActive) {
        setImgActive(slide);
      }
    }
  };
  return (
    <View style={styles.mainView}>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          // style={[styles.wrap, { height: height / 4 + 15 }]}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: width - 24,
            height: 200,
            // backgroundColor: 'black',
            borderRadius: 10,
            marginBottom: 10,
            // width: width - 40,
            // height: height / 3,
          }}
          onPress={() => {
            Singleton.getInstance()
              .getData(constants.IS_LOGIN)
              .then((isLogin) => {
                if (isLogin == "true") {
                  Actions.currentScene != "CardsScreen" &&
                    Actions.CardsScreen();
                } else {
                  Actions.currentScene != "Login" && Actions.reset("Login");
                }
              })
              .catch((err) => {
                // Actions.currentScene != 'Login' && Actions.reset('Login');
              });
          }}
        >
          {/* <ScrollView
            onScroll={({ nativeEvent }) => onChange(nativeEvent)}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            style={styles.wrap}
            contentContainerStyle={{ borderRadius: 6 }}
          >
            {banners.map((e, index) => {
              return (
                <View style={[styles.wrap, { overflow: "hidden" }]}>
                  <Image
                    key={e}
                    resizeMode="stretch"
                    style={styles.wrap}
                    source={{ uri: e }}
                  />
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.wrapDot}>
            {banners.map((e, index) => (
              <Text
                key={e}
                style={imgActive == index ? styles.dotActive : styles.dot}
              >
                ●
              </Text>
            ))}
          </View> */}
          <Image
            source={{ uri: Images.banner2 }}
            style={{
              width: width - 24,
              height: 200,
              resizeMode: "stretch",
              borderRadius: 10,
              // alignSelf: 'center',
              // marginLeft: 45,
              // marginHorizontal: 40,
            }}
          />

          {/* <SliderBox
            parentWidth={Dimensions.get("window").width}
            images={banners}
            // autoplay
            // autoplayInterval={3000}
            // circleLoop
            imageLoadingColor={colors.greyTxt}
            sliderBoxHeight={200}
            onCurrentImagePressed={(index) => {
              // Linking.openURL(BANNER[index].link);
            }}
            dotColor={colors.dotColor}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 4,
              top: 5,
              bottom: 5,
            }}
            inactiveDotColor="#90A4AE"
            resizeMode="contain"
            ImageComponentStyle={{
              width: "90%",
              borderRadius: 14,
              marginBottom: 5,
              // marginLeft: 20,
            }}
            useScrollView={true}
          /> */}
        </TouchableOpacity>
      </View>

      {/* <View style={styles.announcementView}>
        <Image
          style={styles.announcementLeftImage}
          source={{uri: Images.announcement}}
        />
        <FlatList
          style={styles.announcementListing}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={announcement}
          renderItem={({item}) => {
            return (
              <Text
                style={{
                  color: ThemeManager.colors.anouncementtextColour,
                }}>{`${item} - `}</Text>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity
          onPress={onPress}
          style={styles.announcementRightImage}>
          <Image
            style={{width: 20, height: 20}}
            source={{uri: Images.icon_menu}}
          />
        </TouchableOpacity>
      </View>
     */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    // height: 290,
    // flexDirection: 'column',
    // marginHorizontal: 16,
  },
  subView: {
    top: 10,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  icon_user: {
    left: 10,
    position: "absolute",
  },
  icon_Search: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  banner: {
    padding: 16,
    backgroundColor: "white",
    resizeMode: "contain",
    alignSelf: "center",
    marginHorizontal: 10,
    // top: 20,
    // marginTop: 20,
  },
  icon_notification: {
    position: "absolute",
    width: 30,
    height: 30,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon_scan: {
    position: "absolute",
    width: 30,
    height: 30,
    right: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  announcementView: {
    // top: 25,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  announcementLeftImage: {
    height: 25,
    width: 25,
    left: 0,
  },
  announcementListing: {
    marginHorizontal: 8,
  },
  announcementRightImage: {
    width: 20,
    height: 20,
    marginRight: 0,
    alignContent: "center",
  },
  inputStyle: {
    fontSize: 14,
    paddingLeft: 8,
    color: colors.darkBlack,
    width: "80%",
    opacity: 20,
  },
  insideHeader: {
    position: "absolute",
    flexDirection: "row",
    height: 36,
    backgroundColor: colors.insideBgColor,
    borderRadius: 18,
    marginRight: 20,
    paddingHorizontal: 10,
    right: 60,
    left: 50,
  },
  wrap: {
    width: width - 40,
    height: height / 4,
    borderRadius: 6,
  },
  wrapDot: {
    position: "absolute",
    bottom: -15,
    flexDirection: "row",
    alignSelf: "center",
  },
  dotActive: {
    margin: 3,
    color: "#61CAE6",
    fontSize: 19,
  },
  dot: {
    margin: 3,
    color: "#A1A1A1",
    fontSize: 19,
  },
});
export { HeaderDashboard };
