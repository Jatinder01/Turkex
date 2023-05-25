import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts, Images } from "../../theme";

const HeaderGoogleAuthentication = ({
  isDoneAuth1st,
  isDoneAuth2nd,
  isDoneAuth3rd,
  isDoneAuth4th,
  isDoneAuthText1st,
  isDoneAuthText2nd,
  isDoneAuthText3rd,
  isDoneAuthText4th,
  hBtnText,
  headerStyle,
  headerInfo,
  onPress,
  goBacklink,
  isEnable,
}) => {
  const { textStyle, viewStyle } = styles;
  return (
    <ImageBackground
      style={[
        styles.viewMainContainer,
        { backgroundColor: ThemeManager.colors.DashboardBG },
      ]}
      // source={Images.dashboard_Banner}
    >
      <SafeAreaView />
      <View
        style={[
          viewStyle,
          headerStyle,
          { backgroundColor: ThemeManager.colors.tabBackground },
        ]}
      >
        <TouchableOpacity
          style={[styles.btnBackWhite, { marginTop: 20 }]}
          onPress={goBacklink}
        >
          <Image
            source={{ uri: ThemeManager.ImageIcons.icon_back }}
            style={{
              width: 20,
              height: 20,
              marginLeft: 7,
              // tintColor: ThemeManager.colors.cryptoAmountTextColor,
              resizeMode: "contain",
            }}
            // tintColor={ThemeManager.colors.cryptoAmountTextColor}
          />
          <Text
            style={[
              styles.btnText,
              {
                color: ThemeManager.colors.textColor1,
              },
            ]}
          >
            {hBtnText}
          </Text>
        </TouchableOpacity>
        {!isEnable ? (
          <View style={[styles.headerSteps]}>
            <View
              style={[
                styles.step,
                isDoneAuth1st,
                { borderColor: ThemeManager.colors.textColor1 },
              ]}
            >
              <Text style={[styles.stepText, isDoneAuthText1st]}>1</Text>
            </View>
            <View
              style={[
                styles.step,
                isDoneAuth2nd,
                { borderColor: ThemeManager.colors.textColor1 },
              ]}
            >
              <Text style={[styles.stepText, isDoneAuthText2nd]}>2</Text>
            </View>
            <View
              style={[
                styles.step,
                isDoneAuth3rd,
                { borderColor: ThemeManager.colors.textColor1 },
              ]}
            >
              <Text style={[styles.stepText, isDoneAuthText3rd]}>3</Text>
            </View>
            <View
              style={[
                styles.step,
                isDoneAuth4th,
                { borderColor: ThemeManager.colors.textColor1 },
              ]}
            >
              <Text style={[styles.stepText, isDoneAuthText4th]}>4</Text>
            </View>
          </View>
        ) : (
          <View style={styles.headerSteps} />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  viewMainContainer: {
    borderTopWidth: 0,
    borderColor: "#2C0000",
  },
  viewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative",
    paddingLeft: 15,
    paddingRight: 15,
    shadowOpacity: 0,
    flexWrap: "wrap",
  },
  headerSteps: {
    width: "100%",
    fontSize: 17,
    flexDirection: "row",
    fontFamily: Fonts.bold,
    color: "#0081FF",
    textAlign: "center",
    paddingTop: "20%",
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerEmptySteps: {
    width: "100%",
    fontSize: 17,
    flexDirection: "row",
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.selectedCurrency,
    textAlign: "center",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  step: {
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: ThemeManager.colors.textColor1,
    // borderColor: ThemeManager.colors.placeholderColorInsideForLight,
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingTop: 4,
    marginHorizontal: 20,
  },
  stepText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    textAlign: "center",
    // color: ThemeManager.colors.textColor1,
  },
  btnBackWhite: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: ThemeManager.colors.cryptoAmountTextColor,
  },
  btnText: {
    fontSize: 18,
    color: ThemeManager.colors.cryptoAmountTextColor,
    marginLeft: 15,
  },
  textStyle: {
    fontSize: 20,
    color: ThemeManager.colors.cryptoAmountTextColor,
  },
  textGa: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    color: ThemeManager.colors.cryptoAmountTextColor,
  },
});
export { HeaderGoogleAuthentication };
