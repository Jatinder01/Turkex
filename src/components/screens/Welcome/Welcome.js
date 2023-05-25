import React from 'react';
import {Text} from 'react-native';
import styles from './WelcomeStyle';
import {Wrap} from '../../common/Wrap';
import {ThemeManager} from '../../../../ThemeManager';

const Welcome = () => {
  return (
    <Wrap style screenStyle={styles.screenStyle} bottomStyle>
      <Text style={styles.textStyle}>Coin Cult</Text>
    </Wrap>
  );
};

export default Welcome;
