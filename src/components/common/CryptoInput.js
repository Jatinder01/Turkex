import React from 'react';
import {
  TextInput,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {colors, Fonts, Images} from '../../theme';
import {ThemeManager} from '../../../ThemeManager';
import fonts from '../../theme/fonts';
import {strings} from '../../../Localization';
import SelectDropdown from 'react-native-select-dropdown';

const CryptoInput = props => {
  //   const getName = name => {
  //     const textName = name.charAt(0);

  //     return (
  //       <Text
  //         style={{
  //           fontSize: 16,
  //           fontFamily: Fonts.bold,
  //           textAlign: 'center',
  //           marginTop: -2,
  //           color: ThemeManager.colors.textColor1,
  //         }}>
  //         {textName}
  //       </Text>
  //     );
  //   };
  return (
    <View
      style={[
        {
          backgroundColor: ThemeManager.colors.crypto_input,
          height: 80,
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
          marginHorizontal: 15,
          borderRadius: 5,
          marginTop: 30,
        },
        props.mainView,
      ]}>
      <View style={{flex: 7}}>
        <Text
          style={[
            {
              fontSize: 16,
              fontFamily: Fonts.regular,
              color: ThemeManager.colors.textColor1,
            },
            props.labelStyle,
          ]}>
          {props.labelText}
        </Text>
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          style={[
            {
              color: ThemeManager.colors.textColor1,
              fontSize: 15,
              fontFamily: Fonts.regular,
              marginTop: 5,
            },
            props.inputStyle,
          ]}
          keyboardType={props.keyboardType}
          returnKeyType={props.returnKeyType}
          onEndEditing={props.onEndEditing}
        />
      </View>
      <View style={{flex: 3, width: '100%'}}>
        <SelectDropdown
          key={props.key}
          data={props.data}
          // defaultValueByIndex={3}
          onSelect={props.onSelect}
          defaultValue={props.defaultValue}
          // buttonStyle={styles.dropdown3BtnStyle}
          buttonStyle={[
            {
              marginTop: 5,
              width: '100%',
              height: 50,
              backgroundColor: ThemeManager.colors.Depositbtn,
            },
            props.dropdownBtnStyle,
          ]}
          renderCustomizedButtonChild={(selectedItem, index) => {
            return (
              <View
                style={[
                  styles.dropdown3BtnChildStyle,
                  {
                    backgroundColor: ThemeManager.colors.Depositbtn,
                  },
                ]}>
                <Text
                  style={[
                    styles.dropdown3BtnTxt,
                    {
                      color: ThemeManager.colors.textColor,
                      textTransform: 'uppercase',
                    },
                    props.selectedItemText,
                  ]}>
                  {selectedItem ? selectedItem.id : props.itemSelected}
                </Text>

                <Image
                  source={{uri: Images.icon_dropDown}}
                  style={[
                    {
                      height: 15,
                      width: 15,
                      resizeMode: 'contain',
                      tintColor: ThemeManager.colors.textColor,
                      // tintColor: 'black',
                    },
                    props.dropdownImageStyle,
                  ]}
                />
              </View>
            );
          }}
          // dropdownStyle={styles.dropdown3DropdownStyle}
          dropdownStyle={[
            // styles.dropdown3DropdownStyle,
            {
              backgroundColor: ThemeManager.colors.tabBackground,
            },
          ]}
          // rowStyle={styles.dropdown3RowStyle}
          rowStyle={[
            // styles.dropdown3RowStyle,
            {
              backgroundColor: ThemeManager.colors.tabBackground,
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
                        textTransform: 'uppercase',
                      },
                    ]}>
                    {item.id}
                  </Text>
                </View>
              </>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // position: 'relative',
    height: 50,
    backgroundColor: ThemeManager.colors.inputColor,
    // marginHorizontal: 5,
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown3BtnChildStyle: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 10,
  },
  // dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  // dropdown3DropdownStyle: {backgroundColor: ThemeManager.colors.tabBackground},
  // dropdown3RowStyle: {
  //   backgroundColor: ThemeManager.colors.tabBackground,
  //   borderBottomColor: '#444',
  //   // height: 40,
  // },

  dropdown3BtnTxt: {
    textAlign: 'center',
    // fontWeight: ',
    fontSize: 12,
    marginHorizontal: 2,
  },
  // dropdown4BtnTxt: {
  //   color: ThemeManager.colors.textColor,
  //   textAlign: 'center',
  //   // fontWeight: 'bold',
  //   fontSize: 12,
  //   // marginHorizontal: 12,
  // },
  dropdown3RowChildStyle: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',

    paddingHorizontal: 15,
  },
});

export {CryptoInput};
