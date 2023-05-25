/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {Fonts} from '../../theme';
import {Loader} from './Loader';
const MaintenanceScreen = props => {
  return (
    <View
      style={[
        {
          // flex: 1,
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          // position: 'absolute',
          // top: 0,
          // bottom: 0,
          // left: 0,
          // right: 0,
        },
        props.viewColor,
      ]}>
      <Text
        style={[
          {
            color: ThemeManager.colors.textColor1,
            fontSize: 20,
            fontFamily: Fonts.bold,
            fontWeight: 'bold',
          },
          props.maintainTextColor,
        ]}>
        App is under maintenance.
      </Text>
      <TouchableOpacity
        onPress={props.onPress}
        style={[
          {
            backgroundColor: ThemeManager.colors.selectedTextColor,
            marginTop: 40,
          },
          props.btnColor,
        ]}>
        <Text
          style={[
            {
              color: ThemeManager.colors.textColor,
              fontSize: 20,
              fontFamily: Fonts.bold,
              fontWeight: 'bold',
              paddingHorizontal: 40,
              paddingVertical: 10,
            },
            props.txtColor,
          ]}>
          Refresh
        </Text>
      </TouchableOpacity>
      <Loader isLoading={props.loaderState} />
    </View>
  );
};
export {MaintenanceScreen};
