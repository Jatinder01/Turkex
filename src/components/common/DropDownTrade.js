import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import {Images} from '../../theme';

const DropDownButtonTrade = ({
  value,
  inputLabel,
  btnLabel,
  onChangeText,
  placeHolder,
  secureTextEntry,
  labelText,
  selectedItem,
  currentValue,
  customDrpdwn,
  customTxt,
  customSelectBtn,
  customDrpContainer,
  hideArrow,
}) => {
  const {selectBtn, labelStyle, containerStyle} = styles;
  const [val, setVal] = useState('');
  useEffect(() => {
    setVal(currentValue);
  }, [currentValue]);
  return (
    <View style={[styles.darkInputBloc, customDrpdwn]}>
      <Text style={[styles.labelText, customTxt]}>{inputLabel}</Text>
      <View style={[selectBtn, customSelectBtn]}>
        <View
          style={{
            position: 'absolute',
            overflow: 'hidden',
            height: 15,
            width: '100%',
            top: 10,
            left: 50,
          }}>
          <Text style={{}}>{val}</Text>
          <View style={{position: 'absolute'}}>
            <Dropdown
              containerStyle={[styles.drpContainer, {overflow: 'hidden'}]}
              // itemPadding={20}
              renderAccessory={<View />}
              itemTextStyle={styles.selectBtnText}
              inputContainerStyle={{borderBottomWidth: 0}}
              label={placeHolder}
              value={currentValue}
              data={value}
              onChangeText={(item, index) => selectedItem(item, index)}>
              {/* <Text style={styles.selectBtnText}>{btnLabel}</Text> */}
            </Dropdown>
          </View>
        </View>
        <View style={{left: 40}}>
          <Image
            source={{uri: Images.icon_dropDown}}
            style={[styles.dropArrow, hideArrow]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  darkInputBloc: {
    paddingBottom: 8,
    marginBottom: 18,
    height: 50,
  },
  labelText: {
    fontSize: 17,
    marginBottom: 10,
  },
  selectBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    backgroundColor: '#fff',
    paddingRight: 10,
    paddingLeft: 10,
    lineHeight: 23,
    height: 48,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopEndRadius: 5,

    borderWidth: 1,
    // borderColor: `${lightBlueBorder}`,
  },
  selectBtnText: {
    fontSize: 17,
    // fontFamily: `${normal}`,
    // color: `${placeholderLight}`,
  },
  drpContainer: {
    width: 100,
    height: 80,
  },
  dropArrow: {
    width: 10,
    height: 5,
    marginRight: 0,
    position: 'absolute',
    right: 0,
  },
});

export {DropDownButtonTrade};
