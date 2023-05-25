/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";

import {
  Scene,
  Router,
  Actions,
  Tabs,
  Overlay,
  Modal,
  Lightbox,
} from "react-native-router-flux";
import * as constants from "./Constants";
import { BackHandler, Alert } from "react-native";
import { View } from "react-native";
import {
  Splash,
  Welcome,
  Home,
  Markets,
  Trades,
  Wallets,
  Login,
  ResetPassword,
  Location,
  EnterAccountDetails,
  PhoneVerification,
  VerifyEmail,
  BuySellMarket,
  Profile,
  EnterPhoneToVerify,
  LoginOrRegister,
  VerifyIndentity,
  SelectCountry,
  Verification,
  Settings,
  ChangePassword,
  ConvertTrade,
  CreateAccount,
  Notifications,
  Appearance,
  Language,
  SpotTrade,
  ConversionHistory,
  DepositWallet,
  HistoryWallet,
  Conversion,
  CurrencyDetails,
  SearchCoinPair,
  OrderDetails,
  AboutUs,
  CurrencyList,
  HomeSearch,
  DepositSearch,
  ReceiveQR,
  WithdrawSearch,
  AddBeneficiaryAddress,
  WithdrawWallet,
  AddWithdrawAddress,
  WithdrawConfirmation,
  WithdrawalSuccessful,
  GoogleAuthenticatorStep01,
  GoogleAuthenticatorStep02,
  GoogleAuthenticatorStep03,
  GoogleAuthenticatorStep04,
  ChangeLanguage,
  DisableGoogleAuth,
  ChooseCrypto,
  RegisterVerification,
  LoginVerification,
  CardDetails,
  AddNewCard,
  ReferralMain,
  TotalRewards,
  RefralFriend,
  LatestRewardHistory,
  KycScreen,
  ManageBanks,
  ManagePayee,
  NotificationTradeHistory,
  BuyCryptoBanxa,
  KycLevel,
  BanxaOrderList,
  CardsScreen,
  CardInitial,
  CardActivate,
  ActivatedCards,
  CardAddFunds,
  UploadFiles,
  UserDetails,
  TransactionStatement,
  ManageAccount,
  DisableAccount,
  DeletionReason,
} from "./components/screens/index";

import { CustomTabBar, TabIcon } from "./components/common/";
import { colors, Images } from "./theme/";
import { strings } from "../Localization";
import Singleton from "./Singleton";
import { EventRegister } from "react-native-event-listeners";
import { ThemeManager } from "../ThemeManager";
// import {StackViewStyleInterpolator} from 'react-navigation-stack';
const RouterComponent = ({ onRouteChanged }) => {
  const [isSelectedMode, setSelectedMode] = useState(" ");
  function handleBackButton() {
    BackHandler.exitApp();
    return true;
  }
  const getSceneStyle = (props, computedProps) => {
    const style = {
      backgroundColor: ThemeManager.colors.DashboardBG,
    };
    return style;
  };
  // useEffect(() => {
  //   themeStatus();
  //   Actions.refresh();
  // }, [onRouteChanged]);
  // const themeStatus = () => {
  //   Singleton.getInstance()
  //     .getData(constants.IS_THEME_ENABLE)
  //     .then(res => {
  //       if (res === 'theme2') {
  //         setSelectedMode('Dark Mode');
  //       } else {
  //         setSelectedMode('Light Mode');
  //       }
  //     })
  //     .catch(err => {
  //       Singleton.getInstance().saveData(constants.IS_THEME_ENABLE, 'theme1');
  //       setSelectedMode('Light Mode');
  //     });
  // };
  const MyTransitionSpec = {
    duration: 200,
    // easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
    // timing: Animated.timing,
  };
  // const transitionConfig = () => ({
  //   screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
  // });
  // const transitionConfig = () => ({
  //   transitionSpec: MyTransitionSpec,
  //   // screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
  //   screenInterpolator: sceneProps => {
  //     const {layout, position, scene} = sceneProps;
  //     const {index} = scene;
  //     const width = layout.initWidth;

  //     //right to left by replacing bottom scene
  //     // return {
  //     //     transform: [{
  //     //         translateX: position.interpolate({
  //     //             inputRange: [index - 1, index, index + 1],
  //     //             outputRange: [width, 0, -width],
  //     //         }),
  //     //     }]
  //     // };

  //     const inputRange = [index - 1, index, index + 1];

  //     const opacity = position.interpolate({
  //       inputRange,
  //       outputRange: [0, 1, 0],
  //     });

  //     const translateX = position.interpolate({
  //       inputRange,
  //       outputRange: [width, 0, 0],
  //     });

  //     return {
  //       opacity,
  //       transform: [{translateX}],
  //     };

  //     //from center to corners
  //     // const inputRange = [index - 1, index, index + 1];
  //     // const opacity = position.interpolate({
  //     //     inputRange,
  //     //     outputRange: [0.8, 1, 1],
  //     // });

  //     // const scaleY = position.interpolate({
  //     //     inputRange,
  //     //     outputRange: ([0.8, 1, 1]),
  //     // });

  //     // return {
  //     //     opacity,
  //     //     transform: [
  //     //         { scaleY }
  //     //     ]
  //     // };
  //   },
  // });
  return (
    <>
      <Router
        // getSceneStyle={getSceneStyle}
        onStateChange={onRouteChanged}
        navigationBarStyle={{
          // backgroundColor: 'rgba(0,0,0,0)',
          borderBottomWidth: 0,
        }}
        hideNavBar={false}
        leftButtonIconStyle={{ width: 21, height: 18 }}
        mode="modal"
        titleStyle={{ color: "#fff" }}
      >
        {/* <Overlay key="overlay">
          <Modal key="modal" hideNavBar transitionConfig={transitionConfig}>
            <Lightbox key="lightbox"> */}
        <Scene
          key="root"
          hideNavBar
        // transitionConfig={{animationEnabled: false}}
        >
          <Scene
            key="Splash"
            hideNavBar={true}
            component={Splash}
            gestureEnable={false}
            panHandlers={null}
            initial
          />
          <Scene
            key="Welcome"
            hideNavBar={true}
            component={Welcome}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Login"
            hideNavBar={true}
            component={Login}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ResetPassword"
            hideNavBar={true}
            component={ResetPassword}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Location"
            hideNavBar={true}
            component={Location}
            gestureEnable={false}
            panHandlers={null}
            sceneStyle={{ backgroundColor: "red" }}
          />
          <Scene
            key="EnterAccountDetails"
            hideNavBar={true}
            component={EnterAccountDetails}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="VerifyEmail"
            hideNavBar={true}
            component={VerifyEmail}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="PhoneVerification"
            hideNavBar={true}
            component={PhoneVerification}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Profile"
            hideNavBar={true}
            component={Profile}
            gestureEnable={false}
            panHandlers={null}
          // sceneStyle={{backgroundColor: 'red'}}
          />
          <Scene
            key="Settings"
            hideNavBar={true}
            component={Settings}
            gestureEnable={false}
            panHandlers={null}
          // transitionConfig={transitionConfig}
          // sceneStyle={{backgroundColor: 'red'}}
          />
          <Scene
            key="EnterPhoneToVerify"
            hideNavBar={true}
            component={EnterPhoneToVerify}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="LoginOrRegister"
            hideNavBar={true}
            component={LoginOrRegister}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="VerifyIndentity"
            hideNavBar={true}
            component={VerifyIndentity}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="SelectCountry"
            hideNavBar={true}
            component={SelectCountry}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Verification"
            hideNavBar={true}
            component={Verification}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ChangePassword"
            hideNavBar={true}
            component={ChangePassword}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="CreateAccount"
            hideNavBar={true}
            component={CreateAccount}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Notifications"
            hideNavBar={true}
            component={Notifications}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Appearance"
            hideNavBar={true}
            component={Appearance}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Language"
            hideNavBar={true}
            component={Language}
            gestureEnable={false}
            panHandlers={null}
          // activeBackgroundColor={'red'}
          // sceneStyle={{backgroundColor: 'red'}}
          />
          <Scene
            key="GoogleAuthenticatorStep01"
            component={GoogleAuthenticatorStep01}
          />
          <Scene
            key="GoogleAuthenticatorStep02"
            component={GoogleAuthenticatorStep02}
          />
          <Scene
            key="GoogleAuthenticatorStep03"
            component={GoogleAuthenticatorStep03}
          />
          <Scene
            key="GoogleAuthenticatorStep04"
            component={GoogleAuthenticatorStep04}
          />
          <Scene
            key="DisableGoogleAuth"
            hideNavBar={true}
            component={DisableGoogleAuth}
            gestureEnable={false}
            panHandlers={null}
          />

          <Scene key="Main" hideNavBar>
            <Tabs
              showLabel={false}
              lazy={true}
              swipeEnabled={false}
              gestureEnable={false}
              panHandlers={null}
              tabBarStyle={{
                height: 50,
                // borderTopWidth: 0.5,
                // borderTopColor: colors.tabTopBorder,
                backgroundColor: colors.tabBg,
                paddingBottom: 20,
              }}
              tabBarOnPress={(props) => {
                const routeName = props.navigation.state.key;
                console.log("tab bar onpres=-=-=>>>", routeName);
                Singleton.getInstance()
                  .getData(constants.IS_LOGIN)
                  .then((isLogin) => {
                    if (isLogin == "true") {
                      props.navigation.navigate(routeName);
                    } else {
                      if (routeName == "Wallets" || routeName == "_Wallets") {
                        // props.navigation.navigate('Login');
                        Actions.currentScene != "Login" &&
                          Actions.Login({ fromScreen: "Wallets" });
                      } else {
                        props.navigation.navigate(routeName);
                      }
                    }
                  });
                // Singleton.getInstance()
                //   .getData(constants.IS_LOGIN)
                //   .then(isLogin => {
                //     if (isLogin == 'true') {
                //       props.navigation.navigate(routeName);
                //     } else {
                //       if (routeName == 'Wallets' || routeName == '_Wallets') {
                //         props.navigation.navigate('Login');
                //       } else {
                //         props.navigation.navigate(routeName);
                //       }
                //     }
                //   });
              }}
              tabBarComponent={CustomTabBar}
              type="reset"
            >
              <Scene
                hideNavBar={true}
                key="Home"
                component={Home}
                gestureEnable={false}
                panHandlers={null}

              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={strings.bottom_tab.Home}
              //     ImgSize={{width: 21.0, height: 21}}
              //     activeImg={{uri: Images.Home_Active}}
              //     defaultImg={{uri: Images.Home_InActive}}
              //   />
              // )}
              />
              <Scene
                hideNavBar={true}
                key="Markets"
                component={Markets}
                gestureEnable={false}
                panHandlers={null}
              // tabBarOnPress={obj => {
              //   // Actions.jump('_MArket', {screenData: false});
              //   // obj.navigation.navigate(obj.navigation.state.routeName);
              //   // Alert.alert(constants.APP_NAME,JSON.stringify(obj))
              //   // const routeName = obj.navigation.state.key;
              //   // obj.navigation.navigate(obj.navigation.state.routeName);
              //   // EventRegister.emit('fundsClicked', 'it works!!!');
              // }}
              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={strings.bottom_tab.Markets}
              //     ImgSize={{width: 24, height: 20}}
              //     activeImg={{uri: Images.Markets_Active}}
              //     defaultImg={{uri: Images.Markets_InActive}}
              //   />
              // )}
              />
              <Scene
                hideNavBar={true}
                key="Trades"
                component={Trades}
                gestureEnable={false}
                panHandlers={null}

              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={strings.bottom_tab.Trades}
              //     ImgSize={{width: 19.8, height: 20}}
              //     activeImg={{uri: Images.Trades_Active}}
              //     defaultImg={{uri: Images.Trades_InActive}}
              //   />
              // )}
              />
              <Scene
                hideNavBar={true}
                key="Wallets"
                component={Wallets}
                gestureEnable={false}
                panHandlers={null}
                tabBarOnPress={(obj) => {
                  console.log("tabBarOnPress=-=-=-=>>", obj);
                  // Alert.alert(constants.APP_NAME,JSON.stringify(obj))
                  const routeName = obj.navigation.state.key;
                  obj.navigation.navigate(obj.navigation.state.routeName);
                  EventRegister.emit("fundsClicked", "it works!!!");
                }}

              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={strings.bottom_tab.Wallets}
              //     ImgSize={{width: 22, height: 20}}
              //     activeImg={{uri: Images.Wallets_Active}}
              //     defaultImg={{uri: Images.Wallets_InActive}}
              //   />
              // )}
              />
              <Scene
                hideNavBar={true}
                key="CardsScreen"
                component={CardsScreen}
                gestureEnable={false}
                panHandlers={null}
              />
            </Tabs>
          </Scene>
          <Scene
            hideNavBar={true}
            key="CardsScreens"
            component={CardsScreen}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="BuySellMarket"
            hideNavBar={true}
            component={BuySellMarket}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ConvertTrade"
            hideNavBar={true}
            component={ConvertTrade}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="SpotTrade"
            hideNavBar={true}
            component={SpotTrade}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ConversionHistory"
            hideNavBar={true}
            component={ConversionHistory}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="DepositWallet"
            hideNavBar={true}
            component={DepositWallet}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="WithdrawWallet"
            hideNavBar={true}
            component={WithdrawWallet}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="HistoryWallet"
            hideNavBar={true}
            component={HistoryWallet}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="Conversion"
            hideNavBar={true}
            component={Conversion}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="CurrencyDetails"
            hideNavBar={true}
            component={CurrencyDetails}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="SearchCoinPair"
            hideNavBar={true}
            component={SearchCoinPair}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="OrderDetails"
            hideNavBar={true}
            component={OrderDetails}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="AboutUs"
            hideNavBar={true}
            component={AboutUs}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="CurrencyList"
            hideNavBar={true}
            component={CurrencyList}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="HomeSearch"
            hideNavBar={true}
            component={HomeSearch}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="DepositSearch"
            hideNavBar={true}
            component={DepositSearch}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ReceiveQR"
            hideNavBar={true}
            component={ReceiveQR}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="WithdrawSearch"
            hideNavBar={true}
            component={WithdrawSearch}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="AddBeneficiaryAddress"
            hideNavBar={true}
            component={AddBeneficiaryAddress}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="AddWithdrawAddress"
            hideNavBar={true}
            component={AddWithdrawAddress}
            gestureEnable={false}
            panHandlers={null}
          />

          <Scene
            key="WithdrawConfirmation"
            hideNavBar={true}
            component={WithdrawConfirmation}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="WithdrawalSuccessful"
            hideNavBar={true}
            component={WithdrawalSuccessful}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ChangeLanguage"
            hideNavBar={true}
            component={ChangeLanguage}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ChooseCrypto"
            hideNavBar={true}
            component={ChooseCrypto}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="RegisterVerification"
            hideNavBar={true}
            component={RegisterVerification}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="LoginVerification"
            hideNavBar={true}
            component={LoginVerification}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ManageAccount"
            hideNavBar={true}
            component={ManageAccount}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="DisableAccount"
            hideNavBar={true}
            component={DisableAccount}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="DeletionReason"
            hideNavBar={true}
            component={DeletionReason}
            gestureEnable={false}
            panHandlers={null}
          />

          <Scene
            key="CardDetails"
            hideNavBar={true}
            component={CardDetails}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="AddNewCard"
            hideNavBar={true}
            component={AddNewCard}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ReferralMain"
            hideNavBar={true}
            component={ReferralMain}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="RefralFriend"
            hideNavBar={true}
            component={RefralFriend}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="TotalRewards"
            hideNavBar={true}
            component={TotalRewards}
            gestureEnable={false}
            panHandlers={null}
          />

          <Scene
            key="LatestRewardHistory"
            hideNavBar={true}
            component={LatestRewardHistory}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="KycScreen"
            hideNavBar={true}
            component={KycScreen}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ManageBanks"
            hideNavBar={true}
            component={ManageBanks}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ManagePayee"
            hideNavBar={true}
            component={ManagePayee}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="NotificationTradeHistory"
            hideNavBar={true}
            component={NotificationTradeHistory}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="BuyCryptoBanxa"
            hideNavBar={true}
            component={BuyCryptoBanxa}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="KycLevel"
            hideNavBar={true}
            component={KycLevel}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="BanxaOrderList"
            hideNavBar={true}
            component={BanxaOrderList}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="CardInitial"
            hideNavBar={true}
            component={CardInitial}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="CardActivate"
            hideNavBar={true}
            component={CardActivate}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="ActivatedCards"
            hideNavBar={true}
            component={ActivatedCards}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="CardAddFunds"
            hideNavBar={true}
            component={CardAddFunds}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="UploadFiles"
            hideNavBar={true}
            component={UploadFiles}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="UserDetails"
            hideNavBar={true}
            component={UserDetails}
            gestureEnable={false}
            panHandlers={null}
          />
          <Scene
            key="TransactionStatement"
            hideNavBar={true}
            component={TransactionStatement}
            gestureEnable={false}
            panHandlers={null}
          />
        </Scene>
        {/* </Lightbox>
          </Modal>
        </Overlay> */}
      </Router>
    </>
  );
};

export default RouterComponent;
