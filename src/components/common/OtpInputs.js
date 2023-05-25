import React from "react";
import { StyleSheet } from "react-native";
import { Content, Item, Input } from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import { ThemeManager } from "../../../ThemeManager";

class OtpInputs extends React.Component {
  state = { otp: [] };
  otpTextInput = [];

  componentDidMount() {
    // this.otpTextInput[0]._root.focus();
  }

  renderInputs() {
    let noBox = this.props.colNo == null ? 6 : this.props.colNo;
    const inputs = Array(noBox).fill(0);
    const txt = inputs.map((i, j) => (
      <Col key={j} style={[styles.txtMargin, this.props.gridStyle]}>
        {/* <Item regular> */}
        <Input
          onEndEditing={this.props.dismissKeyboard}
          style={[
            styles.inputRadius,
            this.props.otpStyle,
            { color: ThemeManager.colors.textColor },
          ]}
          keyboardType={
            this.props.keyboardType == null
              ? "numeric"
              : this.props.keyboardType
          }
          maxLength={1}
          autoCapitalize="none"
          onChangeText={(v) => this.focusNext(j, v)}
          onKeyPress={(e) => this.focusPrevious(e.nativeEvent.key, j)}
          ref={(ref) => (this.otpTextInput[j] = ref)}
        />
        {/* </Item> */}
      </Col>
    ));
    return txt;
  }

  focusPrevious(key, index) {
    if (key === "Backspace" && index !== 0)
      this.otpTextInput[index - 1]._root.focus();
  }

  focusNext(index, value) {
    if (index < this.otpTextInput?.length - 1 && value) {
      this.otpTextInput[index + 1]._root.focus();
    }
    if (index === this.otpTextInput?.length - 1) {
      this.otpTextInput[index]?._root.blur();
    }
    const otp = this.state.otp;
    otp[index] = value;
    this.setState({ otp });
    this.props.getOtp(otp.join(""));
  }

  render() {
    return (
      <Content padder disableKBDismissScroll scrollEnabled={false}>
        <Grid style={styles.gridPad}>{this.renderInputs()}</Grid>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  gridPad: { padding: 10 },
  txtMargin: { margin: 3, borderRadius: 4 },
  inputRadius: { textAlign: "center" },
});

export { OtpInputs };
