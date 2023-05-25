import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import { strings } from "../../../Localization";

const announcement = ["74th phase of Dual Investment Launched", "Adding LU..."];
const HeaderComponent = (props) => {
  return (
    <View style={[styles.mainView, props.headerViewStyle]}>
      <View style={styles.subView}>
        {props.showUserIcon ? (
          <TouchableOpacity
            style={styles.icon_user}
            onPress={props.onProfileClick}
          >
            <Image
              style={{ height: 34, width: 34 }}
              source={{ uri: ThemeManager.ImageIcons.icon_profile_k }}
            />
          </TouchableOpacity>
        ) : null}

        <View style={[styles.insideHeader, props.searchViewStyle]}>
          <View style={{ alignSelf: "center" }}>
            <Image
              style={styles.icon_Search}
              source={{ uri: ThemeManager.ImageIcons.icon_search_text }}
            />
          </View>
          <TouchableOpacity
            onPress={props.onSearchPress}
            style={styles.inputStyle}
          >
            <Text
              style={{
                color: ThemeManager.colors.inactiveTextColor,
                fontSize: 14,
                fontFamily: Fonts.regular,
              }}
            >
              {strings.home_tab.search}
            </Text>
          </TouchableOpacity>
          {/* <TextInput
            // onChangeText={this.search}
            placeholder="Search"
            style={styles.inputStyle}
            placeholderTextColor={colors.searchPlaceHolder}
            autoCorrect={false}
            ref={ref => {
              // this.input = ref;
            }}
          /> */}
        </View>
        {props.showScanIcon ? (
          <View onPress={props.onPressScan} style={styles.icon_scan}>
            <Image
              style={{ width: 20, height: 20, resizeMode: "contain" }}
              source={{ uri: ThemeManager.ImageIcons.icon_scan }}
            />
          </View>
        ) : null}
        {props.showUserIcon ? (
          <TouchableWithoutFeedback onPress={props.NotificationPress}>
            <View style={[styles.icon_notification, { overflow: "visible" }]}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={{ uri: ThemeManager.ImageIcons.icon_notification_k }}
              />
              {props.records > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    left: -5,

                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: Fonts.regular,
                      fontSize: 10,
                      marginTop: 3,
                      textAlign: "center",
                    }}
                  >
                    {props.records > 99 ? "+99" : props.records}
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View>
            {/* <TouchableOpacity
            onPress={props.onPressRightFilter}
            style={styles.icon_notification}>
            <Image
              style={{width: 20, height: 20}}
              source={{uri: ThemeManager.ImageIcons.icon_market_filter_right}}
            />
          </TouchableOpacity> */}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    // height: 290,
    flexDirection: "column",
    marginBottom: 10,
    backgroundColor: ThemeManager.colors.bgDarkwhite,
  },
  subView: {
    // top: 10,
    marginTop: 10,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  icon_user: {
    marginLeft: 10,
    marginTop: 5,
    // left: 10,
    // position: 'absolute',
  },
  icon_Search: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    padding: 5,
  },
  banner: {
    padding: 16,
    backgroundColor: "white",
    resizeMode: "contain",
    alignSelf: "center",
    top: 20,
  },
  icon_notification: {
    // backgroundColor: 'red',
    // position: 'absolute',
    width: 35,
    height: 35,
    // right: 10,
    alignItems: "center",
    marginHorizontal: 2,
    marginRight: 10,
    marginLeft: 5,
    justifyContent: "center",
  },
  icon_scan: {
    // position: 'absolute',
    width: 30,
    height: 30,
    // right: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  announcementView: {
    top: 25,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  announcementLeftImage: {
    height: 25,
    width: 25,
    left: 10,
  },
  announcementListing: {
    position: "absolute",
    right: 40,
    left: 50,
  },
  announcementRightImage: {
    position: "absolute",
    width: 20,
    height: 20,
    right: 10,
    alignContent: "center",
  },
  inputStyle: {
    fontSize: 14,
    paddingLeft: 8,
    color: colors.darkBlack,
    width: "90%",
    opacity: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  insideHeader: {
    // position: 'absolute',
    flex: 1,
    flexDirection: "row",
    // width: '65%',
    height: 36,
    backgroundColor: colors.insideBgColor,
    borderRadius: 18,
    marginTop: 5,
    marginHorizontal: 10,
    // marginRight: 10,
    paddingHorizontal: 10,
    // marginLeft: 10,
    // right: 60,
    // left: 50,
  },
});
export { HeaderComponent };
