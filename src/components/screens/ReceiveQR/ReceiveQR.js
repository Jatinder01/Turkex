/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  ScrollView,
  FlatList,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {strings} from '../../../../Localization';
import {ThemeManager} from '../../../../ThemeManager';
import {colors, Fonts, Images} from '../../../theme';
import {Wrap} from '../../common';

import styles from './ReceiveQRStyle';

import QRCode from 'react-native-qrcode-svg';
const ReceiveQR = props => {
  return (
    <Wrap
      style={{backgroundColor: ThemeManager.colors.modalBox}}
      screenStyle={[
        styles.screenStyle,
        {backgroundColor: ThemeManager.colors.modalBox},
      ]}
      darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
      bottomStyle={{backgroundColor: ThemeManager.colors.tabBackground}}>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}>
          <Image
            source={{uri: ThemeManager.ImageIcons.icon_back}}
            style={{
              height: 20,
              width: 20,
              resizeMode: 'contain',
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
        <View style={{width: 20}} />
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: ThemeManager.colors.borderColor,
            marginRight: 15,
            borderRadius: 5,
            // marginLeft: 5,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.medium,
              color: ThemeManager.colors.textColor,
              paddingHorizontal: 5,
              padding: 2,
            }}>
            {strings.receive.send}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.viewStyle,
          {backgroundColor: ThemeManager.colors.modalBox},
        ]}>
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 26,
            color: ThemeManager.colors.textColor,
          }}>
          {strings.receive.receive}
        </Text>
        <Text style={styles.receiveText}>{strings.receive.receive_text}</Text>
        <View style={styles.qrView}>
          <Text style={styles.otherText}>{strings.receive.other_use}</Text>
          <QRCode value={' '} size={200} logoMargin={20} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <TouchableOpacity>
              {/* <Text>{strings.receive.add_amount}</Text> */}
              <Text
                style={{
                  color: ThemeManager.colors.selectedTextColor,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                }}>
                {strings.receive.save_qr}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Wrap>
  );
};
export default ReceiveQR;
