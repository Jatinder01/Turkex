import React, { Component } from "react";
import { connect } from "react-redux";
// import {TableMarket} from '../../common';

// import Singleton from '../../../Singleton';

// import {EventRegister} from 'react-native-event-listeners';
import { View } from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { TableMarket } from "./TableMarket";
import Singleton from "../../Singleton";
import { EventRegister } from "react-native-event-listeners";

// import {colors} from '../../../theme';
// import {ThemeManager} from '../../../../ThemeManager';

class BchPage extends Component {
  state = {
    favArray: [],
  };

  componentDidMount() {
    this.getSavedFav();
    this.listener = EventRegister.addEventListener("favRefresh", (data) => {
      this.getSavedFav();
    });
  }

  getSavedFav() {
    Singleton.getInstance()
      .getData("favArr")
      .then((res) => {
        // debugger
        if (res != null || res != "[]") {
          this.setState({ favArray: JSON.parse(res) });
        } else {
          this.setState({ favArray: [] });
        }
      });
  }

  render() {
    let coinBasedArray = [];
    if (this.props.value != undefined) {
      for (let i = 0; i < this.props.value?.length; i++) {
        if (
          this.props.value[i]?.quote_unit?.toUpperCase() == this.props.tabLabel
        ) {
          let indexValue = this.props.value[i];
          indexValue.fav = false;
          coinBasedArray.push(indexValue);
        }
      }
    }

    if (this.state.favArray != undefined) {
      for (let i = 0; i < this.state.favArray?.length; i++) {
        for (let j = 0; j < coinBasedArray?.length; j++) {
          if (coinBasedArray[j].name == this.state.favArray[i]?.name) {
            coinBasedArray[j].fav = true;
          }
        }
      }
    }
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: ThemeManager.colors.dashboardSubViewBg,
        }}
      >
        <TableMarket
          selectedMarket={(item) => {
            this.props.selectedMarketItem(item);
          }}
          data={coinBasedArray}
          coinToUsdData={this.props.coinToUsdData}
        />
      </View>
    );
  }
}

export default BchPage;
