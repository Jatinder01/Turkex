/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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

const FiatDropDown = props => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  return (
    <View style={{marginHorizontal: 15, marginTop: 30}}>
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
      <View
        style={[
          {
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            borderRadius: 5,
          },
          props.mainView,
        ]}>
        <View style={{flex: 1, width: '100%'}}>
          <SelectDropdown
            key={props.key}
            data={props.data}
            defaultValueByIndex={0}
            onSelect={props.onSelect}
            defaultValue={props.defaultValue}
            // buttonStyle={styles.dropdown3BtnStyle}
            buttonStyle={[
              {
                marginTop: 5,
                width: '100%',
                height: 50,
                // backgroundColor: 'red',
                // backgroundColor: ThemeManager.colors.Depositbtn,
              },
              props.dropdownBtnStyle,
            ]}
            renderCustomizedButtonChild={(selectedItem, index) => {
              return (
                <View
                  style={[
                    styles.dropdown3BtnChildStyle,
                    // {
                    //   backgroundColor: ThemeManager.colors.Depositbtn,
                    // },
                  ]}>
                  {props.withImage ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.dropdown3BtnTxt,
                          {
                            color: ThemeManager.colors.textColor1,
                            textTransform: 'uppercase',
                          },
                          props.selectedItemText,
                        ]}>
                        {selectedItem ? selectedItem.id : props.itemSelected}
                      </Text>
                      <Image
                        source={{uri: props.imageUri}}
                        style={[
                          {
                            height: 15,
                            width: 15,
                            resizeMode: 'contain',
                            tintColor: ThemeManager.colors.textColor1,
                            // tintColor: 'black',
                          },
                          props.dropdownImageStyle,
                        ]}
                      />
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.dropdown3BtnTxt,
                        {
                          color: ThemeManager.colors.textColor1,
                          textTransform: 'uppercase',
                        },
                        props.selectedItemText,
                      ]}>
                      {selectedItem ? selectedItem.id : props.itemSelected}
                    </Text>
                  )}

                  <Image
                    source={{uri: Images.icon_dropDown}}
                    style={[
                      {
                        height: 15,
                        width: 15,
                        resizeMode: 'contain',
                        tintColor: ThemeManager.colors.textColor1,
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
              console.log('print item -0-0-0>>', item, '=-=index=-=', index);
              return (
                <>
                  <View style={styles.dropdown3RowChildStyle}>
                    <Text
                      style={[
                        styles.dropdown3RowTxt,
                        {
                          //   color: ThemeManager.colors.selectedTextColor,
                          color:
                            props.selectedIndex == index
                              ? ThemeManager.colors.selectedTextColor
                              : ThemeManager.colors.textColor1,

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

export {FiatDropDown};
