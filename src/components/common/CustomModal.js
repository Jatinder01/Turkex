import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
} from 'react-native';
// import {baseProps} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import {Fonts, Images} from '../../theme';

const CustomModal = props => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={props.modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={Images.AppLogo} style={styles.Img} />
            <Text style={styles.modalText}>{props.headText}</Text>
            <Text style={styles.modalText2}>{props.subtext}</Text>
            {props.btnTxt && (
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={props.onPressClose}>
                <Text style={styles.textStyle}>{props.btnTxt}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 309,
    height: 230,
    margin: 20,
    backgroundColor: '#2D5355',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 50,
    padding: 10,
    marginTop: 15,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#60B4B9',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  modalText2: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  Img: {height: 30, width: 30, marginBottom: 10},
});

export default CustomModal;
