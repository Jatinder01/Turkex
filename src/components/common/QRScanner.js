/* eslint-disable react-native/no-inline-styles */
import React from "react";

import { View, Dimensions } from "react-native";
// import {CameraKitCameraScreen} from 'react-native-camera-kit';
import { ThemeManager } from "../../../ThemeManager";
import { Fonts, Images } from "../../theme";
import { Wrap } from "./Wrap";

const QRScanner = () => {
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.DashboardBG }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.DashboardBG },
      ]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
    >
      {/* <CameraKitCameraScreen
        // actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        style={{
          width: Dimensions.get('window').width,
          flex: 1,
          backgroundColor: '#000',
        }}
        showFrame={true}
        scanBarcode={true}
        laserColor={'#FF3D00'}
        frameColor={'#00C853'}
        colorForScannerFrame={'black'}
        onReadCode={event => {
          //   this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
        }}
      /> */}
    </Wrap>
  );
};
export default QRScanner;
const styles = {
  screenStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
};
