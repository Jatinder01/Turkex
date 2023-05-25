import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {colors, Fonts} from '../../theme';
const currencyList = [
  {name: 'BNB', coinId: 1},
  {name: 'BTC', coinId: 2},
  {name: 'ALTS', coinId: 3},
  {name: 'USDT', coinId: 4},
  {name: 'BUSD', coinId: 5},
  {name: 'FIAT', coinId: 6},
];
const MarketView = props => {
  return (
    <View>
      <FlatList
        data={[
          {key: 'Android'},
          {key: 'iOS'},
          {key: 'Java'},
          {key: 'Swift'},
          {key: 'Php'},
          {key: 'Hadoop'},
          {key: 'Sap'},
          {key: 'Python'},
          {key: 'Ajax'},
          {key: 'C++'},
          {key: 'Ruby'},
          {key: 'Rails'},
          {key: '.Net'},
          {key: 'Perl'},
          {key: 'Sap'},
          {key: 'Python'},
          {key: 'Ajax'},
          {key: 'C++'},
          {key: 'Ruby'},
          {key: 'Rails'},
          {key: '.Net'},
          {key: 'Perl'},
        ]}
        renderItem={({item}) => (
          <Text style={styles.item} onPress={() => {}}>
            {item.key}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={this.renderSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tableTradeBlock: {
    backgroundColor: colors.white,
    // height: '100%',
    paddingBottom: 0,
    flexDirection: 'row',
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    color: colors.black,
    fontSize: 13,
    paddingTop: 5,
  },
  tableHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tableLabelTextStyle: {
    color: '#3C3C3C',
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  tableTr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tableTh: {
    flex: 1,
    maxWidth: '33.3333%',
  },
  tableThTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: colors.greyTxt,
    letterSpacing: -0.3,
    fontWeight: '500',
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  tableTrd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 15,
    paddingVertical: 10,
  },
  tableTd: {
    flex: 1,
    maxWidth: '33.3333%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textDark: {
    color: colors.black,
    paddingVertical: 2,
    alignSelf: 'center',
  },
  textDarkRed: {
    color: '#C00000',
  },
  tableTdTextRight: {
    justifyContent: 'flex-end',
  },
  volCurrentText: {
    color: colors.white,
    fontSize: 12,
    backgroundColor: colors.appGreen,
    borderRadius: 4,
    overflow: 'hidden',
    width: '85%',
    textAlign: 'center',
    paddingVertical: 2,
    alignSelf: 'center',
  },
  tableTdTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#868686',
  },
});

export {MarketView};
