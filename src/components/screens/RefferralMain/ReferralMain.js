/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  View,
  Share,
  Linking,
  Dimensions,
  Clipboard,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
// import {Button, Header, HeaderVerification} from '../../common';
import {ThemeManager} from '../../../../ThemeManager';
import {colors, Images, Fonts} from '../../../theme';
import {TouchableOpacity} from 'react-native';
import {NavList, Wrap} from '../../common';
import {Actions} from 'react-native-router-flux';
import {USER_DATA} from '../../../Constants';
import Singleton from '../../../Singleton';
import {useSelector, useDispatch} from 'react-redux';
import {getRefralFriend} from '../../../Redux/Actions';
import * as constants from '../../../Constants';
import SimpleHeader from '../../common/SimpleHeader';
import {strings} from '../../../../Localization';
import END_POINT from '../../../EndPoints';

const levelDetail = [
  {
    icon: Images.Ref1,
    level: '1st level 5%',
  },
  {
    icon: Images.Ref2,
    level: '2nd level 3%',
  },
  {
    icon: Images.Ref3,
    level: '3rd level 1%',
  },
];
const ReferralMain = () => {
  const [id, setID] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    Singleton.getInstance()
      .getData(USER_DATA)
      .then(res => {
        var data = JSON.parse(res);
        setID(data?.uid);
        dispatch(getRefralFriend(data?.uid));
      })
      .catch(err => {});
  }, []);

  const shareAction = async () => {
    try {
      let link =
        Platform.OS == 'android'
          ? constants.INVITE_TEXT +
            id +
            ' Check it out! ' +
            constants.ANDROID_PLAY_STORE
          : END_POINT.COMMON_URL;
      const result = await Share.share({
        message: link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
      if (result.action === Share.sharedAction) {
        console.log('djdjhu', result.action);
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const copyKey = async id => {
    if (id != '') {
      await Clipboard.setString(id);
      // Alert.alert(constants.APP_NAME, 'Copied to Clipboard!');
      Singleton.getInstance().showWarn('Copied to Clipboard!');
    }
  };
  const copyUrlKey = async url => {
    if (url != '') {
      await Clipboard.setString(url);
      // Alert.alert(constants.APP_NAME, 'Copied to Clipboard!');
      Singleton.getInstance().showWarn('Copied to Clipboard!');
    }
  };
  return (
    <>
      <Wrap
        style={{backgroundColor: ThemeManager.colors.DashboardBG, flex: 1}}
        screenStyle={[{backgroundColor: ThemeManager.colors.DashboardBG}]}
        darkMode={ThemeManager.colors.themeColor === 'light' ? false : true}
        bottomStyle={{backgroundColor: ThemeManager.colors.tabBackground}}>
        <View style={{marginHorizontal: 16, height: 40}}>
          <SimpleHeader
            titleName="Referral"
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

        <ScrollView bounces={false}>
          {/* <Image
            style={{
              width: Dimensions.get('window').width,
              height: 250,
              alignSelf: 'center',
              borderRadius: 8,
              resizeMode: 'stretch',
            }}
            // source={{uri: ThemeManager.ImageIcons.refBanner}}
            source={{uri: Images.ref_ban}}
          /> */}
          <View
            style={{
              backgroundColor: ThemeManager.colors.tabBackground,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              marginHorizontal: 10,
              borderRadius: 8,
              marginBottom: 15,
              marginTop: 20,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderBottomColor: '#edc189',
                borderBottomWidth: 0.6,
                marginTop: 10,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    alignSelf: 'center',
                    borderRadius: 8,
                    resizeMode: 'stretch',
                    marginLeft: 10,
                  }}
                  // source={{uri: ThemeManager.ImageIcons.refBanner}}
                  source={{uri: Images.Logo_MAIN}}
                />
                <Text
                  style={{color: ThemeManager.colors.lightGreen, fontSize: 14}}>
                  {'XCHANGE \nMONSTER'}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: ThemeManager.colors.lightGreen,
                fontFamily: Fonts.bold,
                marginLeft: 10,
                textAlign: 'center',
                marginTop: 10,
              }}>
              It pays to have friends
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 20,
                marginHorizontal: 15,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    // alignSelf: 'center',
                    marginLeft: 20,

                    resizeMode: 'contain',
                    tintColor: '#edc189',
                  }}
                  // source={{uri: ThemeManager.ImageIcons.refBanner}}
                  source={{uri: Images.link}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: ThemeManager.colors.lightGreen,
                    fontFamily: Fonts.bold,
                    marginLeft: 10,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  1. Get your link
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    marginLeft: 20,
                    // alignSelf: 'center',
                    tintColor: '#edc189',

                    resizeMode: 'contain',
                  }}
                  // source={{uri: ThemeManager.ImageIcons.refBanner}}
                  source={{uri: Images.friends}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: ThemeManager.colors.lightGreen,
                    fontFamily: Fonts.bold,
                    marginLeft: 10,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  2. Invite friends
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    marginLeft: 20,
                    // alignSelf: 'center',
                    borderRadius: 8,
                    resizeMode: 'contain',
                    tintColor: '#edc189',
                  }}
                  // source={{uri: ThemeManager.ImageIcons.refBanner}}
                  source={{uri: Images.coins}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: ThemeManager.colors.lightGreen,
                    fontFamily: Fonts.bold,
                    marginLeft: 10,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  3. Get rewards
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <FlatList
              numColumns={3}
              keyboardShouldPersistTaps={'handled'}
              data={levelDetail}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View
                  style={{
                    // borderColor: ThemeManager.colors.greyWhiteColor,
                    backgroundColor: ThemeManager.colors.selectedTextColor,
                    height: 50,
                    // width: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderWidth: 0.8,
                    marginHorizontal: 8,
                    borderRadius: 5,
                    padding: 5,
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 2,
                    }}>
                    <Image
                      source={{uri: item.icon}}
                      style={{height: 22, width: 18, marginRight: 10}}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.medium,
                      }}>
                      {item.level}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View
            style={{
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: 20,
                paddingLeft: 15,
              }}>
              <View style={{flex: 1}}>
                <NavList
                  hideNavIcon={{display: 'none_them'}}
                  menuText={'My Referral ID'}
                />
              </View>

              <View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                  onPress={() => {
                    copyKey(id);
                  }}>
                  <Text
                    style={{
                      color: ThemeManager.colors.greyWhiteColor,
                      fontSize: 14,
                    }}>
                    {id}
                  </Text>
                  <Image
                    source={{uri: Images.icon_copy}}
                    style={{
                      height: 18,
                      width: 17,
                      // marginLeft: 2,
                      resizeMode: 'contain',
                      tintColor: ThemeManager.colors.textColor1,
                      marginLeft: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: 20,
                paddingLeft: 15,
              }}>
              <View style={{flex: 1}}>
                <NavList
                  hideNavIcon={{display: 'none_them'}}
                  menuText={'Referral link'}
                />
              </View>

              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => {
                    let url = `${END_POINT.COMMON_URL}/register?ref=' +${id}`;
                    // alert(url);
                    copyUrlKey(url);
                  }}>
                  <Text
                    style={{
                      color: ThemeManager.colors.greyWhiteColor,
                      fontFamily: Fonts.regular,
                      fontSize: 14,
                    }}>
                    {'Website URL Link'}
                  </Text>
                  <Image
                    source={{uri: Images.icon_copy}}
                    style={{
                      height: 18,
                      width: 17,
                      // marginLeft: 2,
                      resizeMode: 'contain',
                      tintColor: ThemeManager.colors.textColor1,
                      marginLeft: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{paddingRight: 15, paddingLeft: 15}}>
            <NavList
              hideNavIcon={{display: 'none'}}
              menuText={'Invite Friend'}
              onPress={() => {
                shareAction();
              }}
            />
          </View>
          <View style={{paddingRight: 15, paddingLeft: 15}}>
            <NavList
              hideNavIcon={{display: 'none'}}
              menuText={'Total Rewards'}
              onPress={() => {
                Actions.currentScene != 'TotalRewards' &&
                  Actions.TotalRewards({refID: id});
              }}
            />
          </View>
          <View style={{paddingRight: 15, paddingLeft: 15}}>
            <NavList
              onPress={() => {
                // alert('jjjjj');
                Actions.currentScene != 'RefralFriend' &&
                  Actions.push('RefralFriend');
              }}
              hideNavIcon={{display: 'none'}}
              menuText={'Referral Friends'}
            />
          </View>
          <View style={{paddingRight: 15, paddingLeft: 15}}>
            <NavList
              onPress={() => {
                Actions.currentScene != 'LatestRewardHistory' &&
                  Actions.LatestRewardHistory();
              }}
              hideNavIcon={{display: 'none'}}
              menuText={'Latest Reward History'}
            />
          </View>

          {/* <View
          style={{
            backgroundColor: ThemeManager.colors.linkbg,
            flexDirection: 'row',
            height: 40,
            width: 120,
            alignSelf: 'flex-end',
            marginTop: 10,
            marginRight: 15,
            borderRadius: 20,
            elevation: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://twitter.com/')}>
            <Image
              source={Images.Twitter}
              style={{height: 24, width: 24, margin: 3}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.facebook.com/')}>
            <Image
              source={Images.FB}
              style={{height: 24, width: 24, margin: 3}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.linkedin.com/signup')}>
            <Image
              source={Images.linkdin}
              style={{height: 24, width: 24, margin: 3}}
            />
          </TouchableOpacity>
        </View> */}
        </ScrollView>
      </Wrap>
    </>
  );
};

export default ReferralMain;
