import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {View} from 'native-base';
import {ThemeManager} from '../../../../ThemeManager';
import {Fonts, Images, colors} from '../../../theme';
import fonts from '../../../theme/fonts';
import styles from './VerifyIndentityStyle';
import {InputField, ButtonPrimary, Header} from '../../common';
import {strings} from '../../../../Localization';
import {Actions} from 'react-native-router-flux';

const VerifyIndentity = props => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.DashboardBG,
      }}>
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View>
          <Header
            customCenterTitle={{}}
            rightImage={{uri: Images.cross}}
            btnTextRight=" "
            customRightImage={{
              width: 23,
              height: 23,
              right: 16,
              tintColor: ThemeManager.colors.textColor,
              resizeMode: 'contain',
            }}
            rightButtonClicked={() => {}}
          />
          <Text style={styles.title}>{strings.verifyIdentity}</Text>
          <Text style={styles.subTitle}>{strings.verifyIdentitySubTitle}</Text>
          <Text style={styles.inputTitle}>Identity document</Text>
          <InputField
            editable={false}
            leftImage={{uri: Images.icon_PhotoId}}
            value={'Take a photo of your ID'}
          />
          <Text style={styles.inputTitle}>Selfie</Text>
          <InputField
            editable={false}
            leftImage={{uri: Images.icon_Selfie}}
            value={'Take a Selfie'}
            customContainerStyle={{
              backgroundColor: ThemeManager.colors.SwapInput,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              marginBottom: 30,
              alignSelf: 'center',
              marginHorizontal: 16,
              color: colors.dashboarItemLightText,
              fontFamily: fonts.regular,
              fontSize: 12,
            }}>
            {strings.Profile.waring}
          </Text>
          <ButtonPrimary
            style={{marginBottom: 20}}
            title={strings.Continue}
            onPress={() => {
              Actions.currentScene != 'Home' && Actions.Home();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyIndentity;
