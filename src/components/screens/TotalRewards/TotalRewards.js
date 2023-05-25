/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Image, Text, View, ScrollView} from 'react-native';
import {Loader} from '../../common';
import {ThemeManager} from '../../../../ThemeManager';
import {colors, Fonts, Images} from '../../../theme';
import {TouchableOpacity} from 'react-native';
// import {NavList, CardRoundShadow} from '../../common';
import {Actions} from 'react-native-router-flux';
import {getRefralReward, sendReward} from '../../../Redux/Actions';
import {useSelector, useDispatch} from 'react-redux';
import Singleton from '../../../Singleton';
import {USER_DATA} from '../../../Constants';
import SimpleHeader from '../../common/SimpleHeader';
const TotalRewards = props => {
  const {refralData, refralInfoLoading, sendSuccess} = useSelector(
    state => state?.RefralReducer,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    console.log(
      'TotalRewards sd===',
      refralInfoLoading,
      Object.keys(refralData).length,
    );

    Singleton.getInstance()
      .getData(USER_DATA)
      .then(res => {
        var data = JSON.parse(res);
        dispatch(getRefralReward(data?.uid));
      })
      .catch(err => {});
  }, [sendSuccess]);

  return (
    <View style={{flex: 1, backgroundColor: ThemeManager.colors.DashboardBG}}>
      <View style={{marginHorizontal: 16, height: 40}}>
        <SimpleHeader
          titleName={'Total Rewards'}
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

      <ScrollView bounces={false} style={{flex: 1}}>
        {refralInfoLoading && (
          <View
            style={{
              flex: 1,
              backgroundColor: ThemeManager.colors.BackgroundDarkView,
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
              marginTop: 10,
            }}>
            <Loader isLoading={refralInfoLoading} />
          </View>
        )}
        {!refralInfoLoading && (
          <View
            style={{
              flex: 1,
              backgroundColor: ThemeManager.colors.BackgroundDarkView,
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 8,
                marginLeft: 20,
                marginRight: 30,
              }}>
              <TouchableOpacity>
                <Text
                  style={{
                    color: '#A1A1A1',
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                  }}>
                  Currency
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  style={{
                    color: '#A1A1A1',
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                  }}>
                  Total Rewards
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  style={{
                    color: '#A1A1A1',
                    fontSize: 14,
                    fontFamily: Fonts.regular,
                  }}>
                  Action
                </Text>
              </TouchableOpacity>
            </View>

            {!refralInfoLoading && Object.keys(refralData).length == 0 && (
              <View style={{alignItems: 'center', marginTop: '50%'}}>
                <Image
                  style={{height: 80, width: 50}}
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
            )}
            {(!refralInfoLoading || Object.keys(refralData).length > 0) &&
              Object.keys(refralData).map(key => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      marginBottom: 10,
                      paddingHorizontal: 22,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.regular,
                        textTransform: 'uppercase',
                        width: '50%',
                        color: ThemeManager.colors.textColor,
                      }}>
                      {key}
                    </Text>

                    <Text style={{color: '#A1A1A1', width: '30%'}}>
                      {refralData[key]}
                    </Text>

                    <TouchableOpacity
                      disabled={refralData[key] == 0}
                      style={{
                        height: 36,
                        backgroundColor:
                          refralData[key] == 0 ? '#ff6666' : '#E14E3E',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        width: '20%',
                      }}
                      onPress={() => {
                        var reqData = {
                          uid: props.refID,
                          amount: refralData[key],
                          currency_id: key,
                        };
                        dispatch(sendReward(reqData));
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 14,
                          fontWeight: '500',
                        }}>
                        Send
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TotalRewards;
