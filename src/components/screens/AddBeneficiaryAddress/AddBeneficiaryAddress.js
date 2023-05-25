/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { lightBlueBorder, screenWhiteBackground } from "../../../../app.json";
import {
  Button,
  HeaderVerification,
  Spinner,
  InputVerification,
  BenificiaryList,
  Wrap,
  InputField,
} from "../../common";

import {
  resetBenificiaryForm,
  benificiaryFormUpdate,
  addNewBenificiary,
  getAllBenificiary,
  deleteBenificiary,
  activateBenificiary,
} from "../../../Redux/Actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import * as constants from "../../../Constants";
const { height } = Dimensions.get("window");
import DialogInput from "react-native-dialog-input";
import { ThemeManager } from "../../../../ThemeManager";
import { useDispatch, useSelector } from "react-redux";
import SimpleHeader from "../../common/SimpleHeader";
import { strings } from "../../../../Localization";
import { Images } from "../../../theme";
import styles from "./AddBeneficiaryAddressStyle";
import Singleton from "../../../Singleton";
const AddBeneficiaryAddress = (props) => {
  const dispatch = useDispatch();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  //
  // const benificiaryeReducer = useSelector(state => state?.benificiaryeReducer);
  const { beniError, isLoadingBeni, allBenificiaries } = useSelector(
    (state) => state?.benificiaryeReducer
  );

  useEffect(() => {
    dispatch(resetBenificiaryForm());
    dispatch(getAllBenificiary());

    return () => {};
  }, []);
  const renderError = () => {
    if (beniError) {
      return (
        <View>
          <Text style={styles.errorMessageStyle}>{beniError}</Text>
        </View>
      );
    }
  };
  const renderAddButton = () => {
    if (isLoadingBeni) {
      return (
        <View style={{ height: 40 }}>
          <Spinner />
        </View>
      );
    }

    return (
      <Button
        defaultBtn={styles.btnBottom}
        children={strings.add_beneficiary.add}
        onPress={() => {
          //   const {beniName, beniAddress, beniDesc} = benificiaryeReducer;
          //   //   var currency = props.selectedCoin.id;
          //   var currency = 'eth';
          //   dispatch(
          //     addNewBenificiary({
          //       beniName,
          //       beniAddress,
          //       beniDesc,
          //       currency,
          //     }),
          //   );
        }}
      />
    );
  };
  const renderBenificiaryList = () => {
    let addArray = [];
    let coinId = props?.navigation?.state?.params?.coinId;
    for (let i = 0; i < allBenificiaries?.length; i++) {
      if (allBenificiaries[i]?.currency == coinId) {
        addArray.push(allBenificiaries[i]);
      }
    }
    return (
      <View style={{ height: "auto" }}>
        <BenificiaryList
          data={addArray}
          activateClicked={(item) => {}}
          removeClicked={(item) => {
            let beniId = item.id;
          }}
        />
      </View>
    );
  };
  return (
    <Wrap
      style={{ backgroundColor: ThemeManager.colors.modalBox }}
      screenStyle={[
        styles.screenStyle,
        { backgroundColor: ThemeManager.colors.modalBox },
      ]}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={{ backgroundColor: ThemeManager.colors.tabBackground }}
    >
      <View style={{ marginLeft: 10 }}>
        <SimpleHeader
          titleName={strings.titleName.add_beneficiary_address}
          backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
          onBackPress={() => {
            Actions.pop();
          }}
        />
      </View>

      <View
        style={[
          styles.viewMainContainer,
          { backgroundColor: ThemeManager.colors.lightdark },
        ]}
      >
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, width: "100%" }}
        >
          <View style={{ padding: 15 }}></View>
        </KeyboardAwareScrollView>

        <DialogInput
          isDialogVisible={isDialogVisible}
          title={strings.add_beneficiary.enter_pin_code}
          message={strings.add_beneficiary.enter_pin_code_which_is}
          hintInput={strings.add_beneficiary.pin_code}
          submitInput={(inputText) => {
            if (inputText?.length < 5 || inputText?.length > 6) {
              Singleton.getInstance().showError(
                strings.add_beneficiary.please_enter_valid_pin
              );
            } else {
            }
          }}
          closeDialog={() => {}}
        ></DialogInput>
      </View>
    </Wrap>
  );
};

export default AddBeneficiaryAddress;
