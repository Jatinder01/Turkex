import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Fonts} from '../../theme';

const HeaderCancel = ({
  btnTextLeft,
  onPressBtnBack,
  headerBtnText,
  customStyle,
  titleText,
}) => {
  const {viewStyle} = styles;

  return (
    <>
      <View>
        <SafeAreaView />
      </View>
      <View style={[viewStyle, customStyle]}>
        <Text style={{fontFamily: Fonts.bold, fontSize: 18}}>{titleText}</Text>
        <TouchableOpacity
          onPress={onPressBtnBack}
          style={[{position: 'absolute', right: 10, top: 10}, headerBtnText]}>
          <Image
            // source={require('../../../assets/images/icon_cancel.png')}
            style={{width: 28, height: 28}}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    shadowOpacity: 0,
    // backgroundColor: 'red'
  },
});
export {HeaderCancel};
