import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { SucessScreen } from "../../common/SucessScreen";
import { Actions } from "react-native-router-flux";
import styles from "./WithdrawalSuccessfulStyle";
import { ThemeManager } from "../../../../ThemeManager";
import { Images } from "../../../theme";
import { fundsUser } from "../../../Redux/Actions";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { Wrap } from "../../common";
import * as constants from "../../../Constants";

export class WithdrawalSuccessful extends Component {
  componentDidMount() {
    this.props?.fundsUser(true);
    //backhandler

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  backAction = () => {
    // alert('hy');

    var currentRoute = this.props?.navigation.state.routeName;
    if (Actions.currentScene === "WithdrawalSuccessful") {
      // alert('hello');
      // Alert.alert(constants.APP_NAME, 'Are you sure you want to exit app?', [
      //   {
      //     text: 'Cancel',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   {text: 'YES', onPress: () => BackHandler.exitApp()},
      // ]);
      // Actions.replace('Wallets');
      // Actions.popTo('Wallets');
      // Actions.pop();

      return true;
    }
    return false;
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  render() {
    return (
      <Wrap
        style={{ backgroundColor: ThemeManager.colors.dashboardSubViewBg }}
        screenStyle={[
          styles.screenStyle,
          { backgroundColor: ThemeManager.colors.dashboardSubViewBg },
        ]}
        bottomStyle={{
          backgroundColor: ThemeManager.colors.dashboardSubViewBg,
        }}
      >
        <SucessScreen
          imageSource={{ uri: Images.icon_select }}
          title={"Withdrawal successful"}
          text1={
            this.props?.deposit == true
              ? "Your deposit request has been added"
              : "Your withdrawal request has been sent"
          }
          text2="successfully."
          buttonClicked={() => this.props?.navigation.navigate("Home")}
        />
      </Wrap>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    fundsError,
    fundsUserDetails,
    selectedPosition,
    fundsLoading,
    coinToUsdData,
  } = state.FundsReducer;

  return {
    fundsError,
    fundsUserDetails,
    selectedPosition,
    fundsLoading,
    coinToUsdData,
  };
};

export default connect(mapStateToProps, {
  fundsUser,
})(WithdrawalSuccessful);
