import React, {Component} from 'react';
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';

import {Images, Fonts} from '../../theme';
import {countryData} from '../../../countryCodes';
import {ThemeManager} from '../../../ThemeManager';

class CountryList extends Component {
  state = {
    data: countryData,
  };

  searchFilterFunction = seacher => {
    const countryDataList = [];
    this.setState(
      {
        data: [],
      },
      () => {
        if (seacher == '') {
          this.setState({
            data: countryData,
          });
        } else {
          countryData.filter(value => {
            if (value.name.toLowerCase().includes(seacher.toLowerCase())) {
              countryDataList.push(value);
              this.setState({
                data: countryDataList,
              });
            }
          });
        }
      },
    );
  };
  render() {
    return (
      <>
        <View style={styles.searchBar}>
          <Image style={styles.iconSearch} source={Images.iconSearch} />
          <TextInput
            secureTextEntry={this.props.secureTextEntry}
            value={this.props.value}
            placeholder={this.props.placeHolder}
            onChangeText={text => this.searchFilterFunction(text)}
            style={styles.inputStyle}
            autoCorrect={false}
            placeholderTextColor={ThemeManager.colors.placeholderTextColor}
          />
        </View>

        {/* <SafeAreaView style={styles.container}> */}
        <View style={{height: '80%', width: '100%'}}>
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            style={styles.countryList}
            data={this.state.data}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => this.props.selectedListItem(item)}
                style={[
                  styles.countryItem,
                  {backgroundColor: this.props.selected ? '#fff' : '#fff'},
                ]}>
                <Text style={styles.countryName}>{item.name}</Text>
                {this.props.hideDialCode == false && (
                  <Text style={styles.dialCode}>{item.dial_code}</Text>
                )}
              </TouchableOpacity>
            )}
            scrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.props.selected}
          />
        </View>

        {/* </SafeAreaView> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    position: 'relative',
    marginRight: 15,
    marginLeft: 15,
    paddingTop: 18,
    paddingBottom: 8,
    width: '95%',
  },
  inputStyle: {
    color: '#000',
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 17,
    lineHeight: 23,
    backgroundColor: '#fff',
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(6,19,38,0.12)',
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,

    marginBottom: 0,
    fontFamily: Fonts.medium,
    paddingLeft: 35,
  },
  countryName: {
    fontSize: 17,
    paddingRight: 100,
    fontFamily: Fonts.bold,
  },
  dialCode: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    position: 'absolute',
    right: 10,
  },
  iconSearch: {
    position: 'absolute',
    top: 33,
    left: 11,
    zIndex: 5,
  },
  countryItem: {
    borderColor: '#900',
    marginBottom: 12,
  },
  countryList: {
    margin: 20,
    flex: 1,
  },
  scrollBlock: {
    height: 400,
  },
});

export {CountryList};
