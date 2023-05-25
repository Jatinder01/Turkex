/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {FlatList, Image, ImageBackground, Text, View} from 'react-native';
import {Loader} from '../../common';
import {ThemeManager} from '../../../../ThemeManager';
import {Actions} from 'react-native-router-flux';
import {useSelector, useDispatch} from 'react-redux';
import {USER_DATA} from '../../../Constants';
import Singleton from '../../../Singleton';
import {getRefralFriend} from '../../../Redux/Actions';
import {Fonts} from '../../../theme';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import SimpleHeader from '../../common/SimpleHeader';
import {strings} from '../../../../Localization';

function Item({emailValue, dateValue}) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          paddingHorizontal: 15,
          marginTop: 10,
        }}>
        <Text
          style={{
            color:
              emailValue == 'Email' ? '#A1A1A1' : ThemeManager.colors.textColor,
            fontFamily: Fonts.regular,
            width: '58%',
          }}>
          {emailValue}
        </Text>
        <Text
          style={{
            color:
              dateValue == 'Date' ? '#A1A1A1' : ThemeManager.colors.textColor,
            fontFamily: Fonts.regular,
            width: '40%',
            marginLeft: 10,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          {dateValue}
        </Text>
      </View>
      <LinearGradient
        colors={[
          ThemeManager.colors.refBGColor,
          ThemeManager.colors.tickerBg,
          ThemeManager.colors.refBGColor,
        ]}
        style={{height: 1, width: '100%', marginTop: 3}}
      />
    </View>
  );
}

const RefralFriend = props => {
  const {refralFriendData, referralLoader} = useSelector(
    state => state?.RefralReducer,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    Singleton.getInstance()
      .getData(USER_DATA)
      .then(res => {
        var data = JSON.parse(res);
        dispatch(getRefralFriend(data?.uid));
      })
      .catch(err => {});
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: ThemeManager.colors.DashboardBG}}>
      <View style={{marginHorizontal: 16, height: 40}}>
        <SimpleHeader
          titleName={'Referral Friends'}
          backImageColor={{tintColor: ThemeManager.colors.headTxt}}
          // titleName={'kjjkh'}
          titleStyle={{
            fontSize: 18,
            fontFamily: Fonts.medium,
            color: ThemeManager.colors.textColor1,
            // marginLeft: 10,
          }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.BackgroundDarkView,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: 10,
        }}>
        <Item emailValue="Email" dateValue="Date" />

        <FlatList
          bounces={false}
          data={refralFriendData}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                  marginTop: '50%',
                }}>
                <Image
                  style={{
                    height: 80,
                    width: 50,
                    tintColor: ThemeManager.colors.textColor,
                  }}
                  resizeMode="center"
                  source={{uri: ThemeManager.ImageIcons.icon_no_open_order}}
                />
                <Text
                  style={{
                    color: '#A1A1A1',
                    fontFamily: Fonts.regular,
                  }}>
                  You Have No History{' '}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={value => (
            <Item
              emailValue={value?.item?.email}
              dateValue={moment(value.item?.created_at).format(
                'DD MMM hh:mm a',
              )}
            />
          )}
        />
      </View>
      <Loader isLoading={referralLoader} />
    </View>
  );
};

export default RefralFriend;
