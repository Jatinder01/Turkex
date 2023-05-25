/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {strings} from '../../../Localization';
import {ThemeManager} from '../../../ThemeManager';
import {colors, Fonts, Images} from '../../theme';

const WalletHeader = props => {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
      }}>
      <TouchableOpacity onPress={props.onBackPress}>
        <Image
          source={{uri: ThemeManager.ImageIcons.icon_back}}
          style={{height: 20, width: 20, resizeMode: 'contain', marginLeft: 15}}
        />
      </TouchableOpacity>
      {props.titleText ? (
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 18,
            color: ThemeManager.colors.textColor1,
          }}>
          {props.titleText}
        </Text>
      ) : null}
      {props.noRightIcons ? (
        <View style={{width: 20}} />
      ) : (
        <View
          style={{
            //   justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 10,
            marginRight: 20,
            //   marginLeft: 10,
          }}>
          {/* <TouchableOpacity onPress={props.askIconPress}>
            <Image
              source={{uri: Images.icon_ask}}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
                marginRight: 10,
              }}
            />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={props.onHistoryPress}>
            <Image
              source={{uri: ThemeManager.ImageIcons.icon_note_time}}
              style={{height: 20, width: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default WalletHeader;
