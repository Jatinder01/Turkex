import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
const Loader = ({isLoading}) => {
  if (isLoading == true) {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator
          animating={isLoading}
          size={'large'}
          color={'white'}
        />
        <Text style={{color: 'white'}}>Loading...</Text>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  mainView: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});

export {Loader};
