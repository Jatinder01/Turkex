import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
export default StyleSheet.create({
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  titleStyle: {
    marginTop: 20,
    marginHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 22,
    textAlign: "center",
    color: ThemeManager.colors.textBW,
  },
  subTitleStyle: {
    marginHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: "center",
    color: ThemeManager.colors.textBW,
  },

  headerImage: {
    height: 130,
    width: 130,
    marginTop: 40,
    alignSelf: "center",
    borderRadius: 65,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 20,
  },
  searchView: {
    backgroundColor: ThemeManager.colors.dashboardSearchBarBg,
    borderRadius: 20,
    height: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  searchIcon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    padding: 5,
    marginHorizontal: 10,
  },
  cancelText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: ThemeManager.colors.btnColor3,
    marginLeft: 10,
  },
  viewContainer: {
    justifyContent: "space-between",
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
    // marginBottom: 28,
    marginVertical: 14,
    marginHorizontal: 20,
  },
});
