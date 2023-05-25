import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import {
  buttonBackground,
  buttonTextColor,
  textBlue,
  normal,
  homeButtonBorder,
} from "../../../app.json";

import { colors, Fonts } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import { strings } from "../../../Localization";

function PairItems({ name, status, address, activateClicked, removeClicked }) {
  const styles = useStyles(ThemeManager);
  return (
    <View
      style={[
        styles.tableTrd,
        { backgroundColor: ThemeManager.colors.lightdark },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            styles.tableThTextStyle,
            {
              color: ThemeManager.colors.inactiveTextColor,
              width: "20%",
              marginRight: 5,
            },
          ]}
        >
          {name}
        </Text>
        <Text
          style={[
            styles.tableThTextStyle,
            { color: ThemeManager.colors.inactiveTextColor, width: "34%" },
          ]}
        >
          {address}
        </Text>
        <Text
          style={[
            styles.tableThTextStyle,
            {
              color:
                status === "pending"
                  ? ThemeManager.colors.textRedColor
                  : ThemeManager.colors.inactiveTextColor,
              width: "18%",
              textAlign: "center",
              marginLeft: 4,
              textTransform: "capitalize",
              fontSize: 12,
            },
          ]}
        >
          {status}
        </Text>
        <View style={styles.buttonsContainer}>
          {status == "pending" ? (
            <TouchableOpacity
              style={[
                styles.acceptBtn,
                { borderColor: colors.btnTextColor1, borderWidth: 1 },
              ]}
              onPress={activateClicked}
            >
              <Text
                style={[
                  styles.tableThTextStyle,
                  { color: colors.btnTextColor1 },
                ]}
              >
                Activate
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.acceptBtn,
                { borderColor: colors.btnRemoveText, borderWidth: 1 },
              ]}
              onPress={removeClicked}
            >
              <Text
                style={[
                  styles.tableThTextStyle,
                  { color: colors.btnRemoveText },
                ]}
              >
                Remove
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const BenificiaryList = (props) => {
  const styles = useStyles(ThemeManager);
  return (
    <View
      style={[
        styles.tableTradeBlock,
        { backgroundColor: ThemeManager.colors.lightdark },
      ]}
    >
      <View
        style={[
          styles.tableTr,
          { backgroundColor: ThemeManager.colors.lightdark },
        ]}
      >
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "20%",
          }}
        >
          <Text style={styles.tableThTextStyle}>
            {strings.beneficiary_screen.name}
          </Text>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            // backgroundColor: 'red',
            width: "34%",
          }}
        >
          <Text style={styles.tableThTextStyle}>
            {strings.beneficiary_screen.address}
          </Text>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            // backgroundColor: 'red',
            width: "18%",
            marginLeft: 10,
          }}
        >
          <Text style={[styles.tableThTextStyle]}>
            {strings.beneficiary_screen.status}
          </Text>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            // backgroundColor: 'red',
            width: "20%",
          }}
        />
      </View>
      {props.data?.length > 0 ? (
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          data={props.data}
          extraData={props.extraData}
          renderItem={({ item }) => {
            return (
              <PairItems
                name={item.name}
                address={item.data.address}
                status={item.state}
                activateClicked={(sender) => props.activateClicked(item)}
                removeClicked={(sender) => props.removeClicked(item)}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={(rs) => {
            return <View style={{ height: 50 }} />;
          }}
        />
      ) : (
        <View
          style={{
            height: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[styles.textStyle, { color: ThemeManager.colors.textColor }]}
          >
            {strings.beneficiary_screen.no_data}
          </Text>
        </View>
      )}
    </View>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    tableTradeBlock: {
      backgroundColor: "#fff",
    },
    buttonStyle: {
      justifyContent: "center",
      alignItems: "center",
    },
    textStyle: {
      fontFamily: Fonts.regular,
      alignSelf: "center",
      color: ThemeManager.colors.textColor,
      fontSize: 13,
      paddingTop: 5,
    },
    tableTr: {
      flexDirection: "row",
      justifyContent: "space-between",
      // backgroundColor: "#FFEDED",
      backgroundColor: ThemeManager.colors.whiteScreen,
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    tableTh: {
      flex: 1,
      maxWidth: "33.3333%",
    },
    withArrow: {
      flexDirection: "row",
      alignItems: "center",
    },
    tableThTextStyle: {
      fontFamily: Fonts.medium,
      fontSize: 12,
      // color: "#868686",
      color: ThemeManager.colors.textColor,
    },
    volTextStyle: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: "#868686",
    },

    tableTrd: {
      // flexDirection: 'row',
      justifyContent: "space-between",
      backgroundColor: "#ffffff",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(91,80,78,0.22)",
    },
    tableTd: {
      flex: 1,
      flexWrap: "wrap",
      width: "33.3333%",
      flexDirection: "row",
    },
    textDark: {
      color: "#3C3C3C",
    },
    textDarkRed: {
      color: "#C00000",
    },
    tableTdTextRight: {
      justifyContent: "flex-end",
    },
    tableTdTextStyle: {
      fontFamily: Fonts.PoppinsRegular,
      fontSize: 14,
      color: "#868686",
    },
    volCurrentText: {
      color: "#fff",
      backgroundColor: "#70A800",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
      overflow: "hidden",
      width: "70%",
      height: 35,
    },
    volCurrentTextRed: {
      color: "#fff",
      backgroundColor: "#C00000",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
      overflow: "hidden",
    },
    favButton: {
      marginLeft: -5,
      marginRight: 5,
      height: 15,
      width: 15,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonsContainer: {
      width: "20%",
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      alignItems: "center",
      marginHorizontal: 5,
      // marginTop: 20,
    },
    acceptBtn: {
      width: "100%",
      // backgroundColor: ThemeManager.colors.textRedColor,
      justifyContent: "center",
      alignItems: "center",
      height: 35,
      borderRadius: 4,
    },
  });

export { BenificiaryList };
