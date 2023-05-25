/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  TextInput,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {colors, Fonts, Images} from '../../theme';
import {ThemeManager} from '../../../ThemeManager';
import fonts from '../../theme/fonts';
import {strings} from '../../../Localization';
import SelectDropdown from 'react-native-select-dropdown';

const BuySellCryptoInput = props => {
  return (
    <View style={[styles.containerStyle, props.customContainerStyle]}>
      <View style={{flex: 0.9}}>
        <Text style={props.labelTextStyle}>{props.leftLabelText}</Text>
        <View style={[styles.inputStyle, props.leftTextInputStyle]}>
          <TextInput
            editable={props.editable}
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            placeholderTextColor={props.placeholderTextColor}
            keyboardType={props.keyboardType}
            returnKeyType={props.returnKeyType}
            onEndEditing={props.onEndEditing}
            // showSoftInputOnFocus={false}
            ref={props.ref}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            style={props.textInputStyle}
          />
          <View style={{width: '40%'}}>
            <SelectDropdown
              key={'first'}
              data={props?.fromCurrencyList}
              // defaultValueByIndex={3}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              buttonStyle={{
                width: '80%',
                height: 48,
                backgroundColor: 'white',
              }}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={[styles.dropdown3BtnChildStyle]}>
                    <Text
                      style={[
                        styles.dropdown3BtnTxt,
                        {color: ThemeManager.colors.textColor1},
                      ]}>
                      {selectedItem ? selectedItem.name : 'USD'}
                    </Text>

                    <Image
                      source={{uri: Images.icon_dropDown}}
                      style={{
                        height: 15,
                        width: 15,
                        resizeMode: 'contain',
                        tintColor: ThemeManager.colors.textColor1,
                        // tintColor: 'black',
                      }}
                    />
                  </View>
                );
              }}
              // dropdownStyle={styles.dropdown3DropdownStyle}
              dropdownStyle={[
                // styles.dropdown3DropdownStyle,
                {
                  // backgroundColor: ThemeManager.colors.tabBackground,
                },
              ]}
              // rowStyle={styles.dropdown3RowStyle}
              rowStyle={[
                // styles.dropdown3RowStyle,
                {
                  // backgroundColor: ThemeManager.colors.tabBackground,
                },
              ]}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <>
                    <View style={styles.dropdown3RowChildStyle}>
                      <Text
                        style={[
                          styles.dropdown3RowTxt,
                          {
                            color: ThemeManager.colors.selectedTextColor,
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </View>
                  </>
                );
              }}
            />
          </View>
        </View>
      </View>
      <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={{uri: Images.iconRightArrow}}
          style={{
            height: 10,
            width: 10,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginTop: 25,
          }}
        />
      </View>
      <View style={{flex: 0.4}}>
        <Text style={props.labelTextStyle}>{props.rightLabelText}</Text>
        <View
          style={{
            width: '80%',
          }}>
          <SelectDropdown
            key={'second'}
            data={props?.coinList}
            // defaultValueByIndex={3}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            // buttonStyle={styles.dropdown3BtnStyle}
            buttonStyle={{
              // marginTop: 5,
              // marginBottom: 5,
              borderRadius: 4,
              borderColor: 'black',
              borderWidth: 1,
              width: '100%',
              height: 48,
              backgroundColor: 'white',
              // marginVertical: 10,
              // backgroundColor: ThemeManager.colors.Depositbtn,
            }}
            renderCustomizedButtonChild={(selectedItem, index) => {
              return (
                <View
                  style={[
                    styles.dropdown3BtnChildStyle,
                    // {
                    //   backgroundColor: ThemeManager.colors.Depositbtn,
                    // },
                  ]}>
                  <Text
                    style={[
                      styles.dropdown3BtnTxt,
                      {color: ThemeManager.colors.textColor1},
                    ]}>
                    {selectedItem ? selectedItem.name : 'USD'}
                  </Text>

                  <Image
                    source={{uri: Images.icon_dropDown}}
                    style={{
                      height: 15,
                      width: 15,
                      resizeMode: 'contain',
                      tintColor: ThemeManager.colors.textColor1,
                      // tintColor: 'black',
                    }}
                  />
                </View>
              );
            }}
            dropdownStyle={[
              // styles.dropdown3DropdownStyle,
              {
                // backgroundColor: ThemeManager.colors.tabBackground,
              },
            ]}
            rowStyle={[
              // styles.dropdown3RowStyle,
              {
                // backgroundColor: ThemeManager.colors.tabBackground,
              },
            ]}
            renderCustomizedRowChild={(item, index) => {
              return (
                <>
                  <View style={styles.dropdown3RowChildStyle}>
                    <Text
                      style={[
                        styles.dropdown3RowTxt,
                        {
                          color: ThemeManager.colors.selectedTextColor,
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </View>
                </>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputStyle: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdown3BtnChildStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdown3BtnTxt: {
    textAlign: 'center',
    fontSize: 12,
    marginHorizontal: 2,
  },

  dropdown3RowChildStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',

    paddingHorizontal: 15,
  },
});

export {BuySellCryptoInput};
