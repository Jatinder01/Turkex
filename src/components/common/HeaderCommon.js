import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {colors, Images} from '../../theme';
import {ThemeManager} from '../../../ThemeManager';

const HeaderCommon = props => {
  const {textStyle, viewStyle} = styles;
  return (
    <View
      style={[
        styles.viewMainContainer,
        {backgroundColor: ThemeManager.colors.dashboardDarkBg},
      ]}>
      <SafeAreaView />
      <View
        style={[
          viewStyle,
          props.mainContainerStyle,
          {backgroundColor: ThemeManager.colors.dashboardDarkBg},
        ]}>
        <View
          style={{
            width: '50%',
            alignSelf: 'center',
            flexDirection: 'row',
            backgroundColor: ThemeManager.colors.dashboardDarkBg,
          }}>
          {props.iconTradeHeader != undefined && (
            <View
              style={[
                styles.iconLeft,
                {backgroundColor: ThemeManager.colors.dashboardDarkBg},
              ]}>
              <TouchableWithoutFeedback
                style={{width: 35, height: 35}}
                onPress={props.onPressBack}>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    width: 35,
                    height: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 25,
                  }}>
                  <Image
                    style={[
                      styles.backImg,
                      props.backImgStyle,
                      {tintColor: ThemeManager.colors.textColor},
                    ]}
                    source={props.iconTradeHeader}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
          <TouchableWithoutFeedback onPress={props.titleClicked}>
            <View
              style={[
                styles.selectBtn,
                {backgroundColor: ThemeManager.colors.dashboardDarkBg},
              ]}>
              <Text
                style={[
                  textStyle,
                  props.customTxtCoinA,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {props.coinA}{' '}
              </Text>
              <Text
                style={[
                  textStyle,
                  props.customTxtCoinB,
                  {color: ThemeManager.colors.textColor},
                ]}>
                /{props.coinB}
              </Text>
              <Image
                style={[
                  styles.drpdwn,
                  props.drpdwnStyle,
                  {tintColor: ThemeManager.colors.textColor},
                ]}
                source={props.dropDownArrow}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            width: '50%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableWithoutFeedback onPress={props.chartTabClicked}>
            <Text
              style={[
                styles.openTextStyle,
                props.hidetitleRight,
                {color: ThemeManager.colors.textColor},
              ]}>
              {props.titleRight}
            </Text>
          </TouchableWithoutFeedback>

          {props.right2Img && (
            <TouchableWithoutFeedback onPress={props.right2TabClicked}>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  width: 35,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image
                  style={[
                    styles.starImg1,
                    {tintColor: ThemeManager.colors.textColor},
                  ]}
                  source={props.right2Img}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
          <View style={{width: 10}} />
          {props.rightImg && (
            <TouchableWithoutFeedback onPress={props.rightTabClicked}>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  width: 35,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image
                  style={[
                    styles.starImg,
                    props.starImgStyle,
                    {tintColor: ThemeManager.colors.textColor},
                  ]}
                  source={props.rightImg}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  viewMainContainer: {},
  viewStyle: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'relative',
    shadowOpacity: 0,
    // flexWrap: 'wrap',
    paddingTop: 20,
    // paddingBottom: 20,
    // backgroundColor:colors.lightThemeBg,
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textStyle: {
    // fontFamily: `${Avenir_Medium}`,
    fontSize: 18,
    color: colors.white,
    // textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: -0.45,
    fontWeight: '500',
  },
  trandeHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: 'yellow',
  },
  iconLeft: {
    // width: 24,
    // justifyContent: 'center',
    alignSelf: 'center',
    paddingRight: 15,
  },
  titleRightBlock: {
    justifyContent: 'flex-end',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  openTextStyle: {
    fontSize: 16,
    color: colors.blackTxt,
    textAlign: 'right',
  },
  backImg: {
    tintColor: colors.blackTxt,
    height: 18,
    width: 15,
  },
  drpdwn: {
    marginLeft: 7,
    height: 8,
    width: 12,
  },
  starImg: {
    height: 18,
    width: 18,
  },
  starImg1: {
    height: 22,
    width: 22,
  },
});
export default HeaderCommon;
