/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from "react";
import {
    Text,
    SafeAreaView,
    BackHandler,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    TextInput,
    Alert,
} from "react-native";
import styles from "./VerifyEmailStyle";
import { View } from "native-base";
import { ThemeManager } from "../../../../ThemeManager";
import { Fonts, Images, colors } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as constants from "../../../Constants";
import {
    InputField,
    ButtonPrimary,
    HeaderCancel,
    CountryList,
    Header,
    Loader,
    LocationInput,
    Wrap,
    PhoneNumberInput,
} from "../../common";
import {
    registerFormUpdate,
    registerUser,
    resetRegisterForm,
} from "../../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import PagerView from "react-native-pager-view";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { strings } from "../../../../Localization";
import { Actions } from "react-native-router-flux";
import ConfirmGoogleCaptcha from "react-native-google-recaptcha-v2";
import END_POINT from "../../../EndPoints";
import { countryFlags } from "../../common/CountryFlags";
import BorderLine from "../../common/BorderLine";
import SimpleHeader from "../../common/SimpleHeader";
let captchaForm;
const VerifyEmail = (props) => {
    const NAME_REX = /^[a-zA-Z ]*$/;
    const dispatch = useDispatch();
    // let captchaForm = useRef(null);
    const [ViewPassword, setViewPassword] = useState(false);
    const [ReferralClicked, setReferralClicked] = useState(false);
    const [agreeEmail, setagreeEmail] = useState(false);
    const [agreeMarketing, setagreeMarketing] = useState(false);

    const {
        registerCountryCallingFlag,
        registerCountryCallingCode,
        registerFirstName,
        registerLastName,
        registerEmail,
        // registerPhoneNumber,
        registerPassword,
        recaptchaCheck,
        registerMiddleName,
        registerCountry,
        registerCountryName,
        regEmailUpdates,
        registerReferralId,
        recaptchaData,
        regMarketing,
        registerRefID,
        registerError,
        regLoading,
    } = useSelector((state) => state?.RegisterReducer);

    const [sendCodeText, setsendCodeText] = useState("Send OTP");
    const [modalOTPVisible, setmodalOTPVisible] = useState(false);
    const [optEntered, setotpEntered] = useState(false);
    const [selectedCountryFlag, setSelectedCountryFlag] = useState(
        registerCountryCallingFlag
    );
    const [countryData, setCountryData] = useState(countryFlags);
    const [searchData, setSearchData] = useState(countryFlags);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(registerCountryName);
    const [selectedCountryCode, setSelectedCountryCode] = useState(
        registerCountryCallingCode
    );
    // const onSearch = (value) => {
    //     setCountryData(
    //         searchData.filter(
    //             (i) =>
    //                 i.countryNameEn.toLowerCase().includes(value.toLowerCase()) ||
    //                 i.countryCallingCode.toLowerCase().includes(value.toLowerCase()) ||
    //                 i?.countryCallingCode
    //                     ?.toLowerCase()
    //                     .includes(value.replace("+", "").toLowerCase())
    //         )
    //     );
    // };

    const { isThemeUpdate } = useSelector((state) => state.tradeReducer);

    useEffect(() => {
        return () => {
            // alert('vj');
            isThemeUpdate;
        };
    }, [isThemeUpdate]);


    const onButtonPress = () => {
        Actions.currentScene != "PhoneVerification" &&
            Actions.PhoneVerification()
        return
        // console.log("sign Up details", accountDetails);

        // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let reg = /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        let passReg =
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
        if (!registerFirstName?.length) {
            // Alert.alert(constants.APP_NAME, 'Please enter first name');
            dispatch(
                registerFormUpdate({
                    prop: "registerError",
                    value: "Please enter first name",
                })
            );
        } else if (!registerLastName) {
            // Alert.alert(constants.APP_NAME, 'Please enter last name');
            dispatch(
                registerFormUpdate({
                    prop: "registerError",
                    value: "Please enter last name",
                })
            );
        } else if (reg.test(registerEmail) == false) {
            dispatch(
                registerFormUpdate({
                    prop: "registerError",
                    value: constants.VALID_EMAIL,
                })
            );
            // } else if (registerPhoneNumber?.length < 5) {
            //   // Alert.alert(constants.APP_NAME, 'Please enter a valid phone number');
            //   dispatch(
            //     registerFormUpdate({
            //       prop: "registerError",
            //       value: "Please enter a valid phone number",
            //     })
            //   );
        } else if (registerPassword?.length <= 0) {
            dispatch(
                registerFormUpdate({
                    prop: "registerError",
                    value: "Please enter password.",
                })
            );
        } else if (passReg.test(registerPassword) == false) {
            dispatch(
                registerFormUpdate({
                    prop: "registerError",
                    value: constants.VALID_PASSWORD,
                })
            );
        } else if (!recaptchaCheck) {
            captchaForm.show();
        } else {
            // const mobileNo = "+" + selectedCountryCode + registerPhoneNumber;
            console.log("mobileNo=-=-=-=-=-=>>>", mobileNo);

            dispatch(
                registerFormUpdate({
                    prop: "registerPhoneNumberWithCode",
                    value: mobileNo,
                })
            );
            dispatch(
                registerUser({ //TODO:- Hide this functionality and move on screen directly
                    registerFirstName: registerFirstName,
                    registerLastName: registerLastName,
                    registerMiddleName: registerMiddleName,
                    registerEmail: registerEmail,
                    // registerPhoneNumber: mobileNo,
                    registerCountry: registerCountry,
                    registerCountryCode: selectedCountryCode,
                    registerPassword: registerPassword,
                    regEmailUpdates: regEmailUpdates,
                    recaptchaCheck: recaptchaCheck,
                    registerReferralId: registerReferralId,
                    recaptchaData: recaptchaData,
                    regMarketing: regMarketing,
                    registerRefID: registerRefID,
                })
            );
        }
    };
    // useEffect(() => {
    //     dispatch(registerFormUpdate({ prop: "registerError", value: "" }));
    //     dispatch(registerFormUpdate({ prop: "registerFirstName", value: "" }));
    //     dispatch(registerFormUpdate({ prop: "registerLastName", value: "" }));
    //     dispatch(registerFormUpdate({ prop: "registerMiddleName", value: "" }));

    //     // dispatch(registerFormUpdate({ prop: "registerPhoneNumber", value: "" }));
    //     dispatch(registerFormUpdate({ prop: "registerEmail", value: "" }));
    //     // dispatch(
    //     //   registerFormUpdate({
    //     //     prop: 'registerPhoneNumberWithCode',
    //     //     value: '',
    //     //   }),
    //     // );
    //     dispatch(registerFormUpdate({ prop: "registerPassword", value: "" }));
    //     dispatch(registerFormUpdate({ prop: "regTermsCheck", value: false }));
    //     dispatch(registerFormUpdate({ prop: "registerReferralId", value: "" }));
    //     dispatch(registerFormUpdate({ prop: "registerRefID", value: "" }));

    //     dispatch(registerFormUpdate({ prop: "recaptchaCheck", value: false }));
    //     dispatch(registerFormUpdate({ prop: "regLoading", value: false }));
    //     dispatch(registerFormUpdate({ prop: "recaptchaData", value: "" }));
    //     return () => {
    //         dispatch(registerFormUpdate({ prop: "registerError", value: "" }));
    //         dispatch(registerFormUpdate({ prop: "registerFirstName", value: "" }));
    //         dispatch(registerFormUpdate({ prop: "registerLastName", value: "" }));
    //         dispatch(registerFormUpdate({ prop: "registerMiddleName", value: "" }));

    //         // dispatch(registerFormUpdate({ prop: "registerPhoneNumber", value: "" }));
    //         // dispatch(
    //         //   registerFormUpdate({
    //         //     prop: 'registerPhoneNumberWithCode',
    //         //     value: '',
    //         //   }),
    //         // );
    //         dispatch(registerFormUpdate({ prop: "registerPassword", value: "" }));
    //         dispatch(registerFormUpdate({ prop: "regTermsCheck", value: false }));
    //         dispatch(registerFormUpdate({ prop: "registerReferralId", value: "" }));
    //         dispatch(registerFormUpdate({ prop: "registerRefID", value: "" }));

    //         dispatch(registerFormUpdate({ prop: "recaptchaCheck", value: false }));
    //         dispatch(registerFormUpdate({ prop: "regLoading", value: false }));
    //         dispatch(registerFormUpdate({ prop: "recaptchaData", value: "" }));
    //     };
    // }, []);


    return (

        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: ThemeManager.colors.DashboardBG,
            }}
        >
            <View
                style={{ marginHorizontal: 16, marginBottom: 15, marginVertical: 10 }}
            >
                <SimpleHeader
                    // backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
                    onBackPress={() => {
                        Actions.pop();
                    }}
                />
            </View>

            <View style={{ flex: 1, }}>
                <KeyboardAwareScrollView
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 120 }}>
                        <Image
                            source={Images.verifyEmail}
                            style={styles.emailIcon}
                        />
                    </View>
                    <Text
                        style={{
                            marginTop: 25,
                            marginHorizontal: 16,
                            color: ThemeManager.colors.headTxt,
                            fontFamily: fonts.medium,
                            fontSize: 26,
                            textAlign: 'center'
                        }}
                    >
                        {strings.enterAccountDetails.verifyYourEmail}
                    </Text>
                    <Text
                        style={{
                            // marginTop: 10,
                            marginHorizontal: 30,
                            color: ThemeManager.colors.black_white,
                            fontFamily: fonts.light,
                            fontSize: 15,
                            marginBottom: 10,
                            textAlign: 'center'

                        }}
                    >
                        {strings.enterAccountDetails.verifyEmailMessage}{"john@123gmail.com"}{strings.enterAccountDetails.verifyEmailMessage2}
                    </Text>

                    <ButtonPrimary
                        style={{ marginTop: 30, marginBottom: 10 }}
                        title={strings.enterAccountDetails.checkMyInbox}
                        onPress={() => {
                            onButtonPress();
                        }}
                    />
                    <View style={{
                        marginHorizontal: 20
                    }}>
                        <TouchableOpacity
                            style={{
                                height: 40, justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={() => {
                                console.log("--------Resend Email click-------------");
                            }}
                        >
                            <Text style={styles.resendEmailText}>
                                {strings.enterAccountDetails.resendEmail}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                {<Loader isLoading={regLoading} />}
            </View>
            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setCountryData(countryFlags);
                    setModalVisible(false);
                }}
            >
                <Wrap
                    darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
                    style={{ backgroundColor: ThemeManager.colors.modalBox }}
                    screenStyle={[styles.screenStyle, { backgroundColor: "transparent" }]}
                    bottomStyle={{ backgroundColor: ThemeManager.colors.DashboardBG }}
                >
                    <View
                        style={{
                            backgroundColor: ThemeManager.colors.modalBox,
                            flex: 1,
                            // justifyContent: 'center',
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View>
                                <View style={styles.searchContainer}>
                                    <View
                                        style={[
                                            styles.searchView,
                                            { backgroundColor: ThemeManager.colors.SwapInput },
                                        ]}
                                    >
                                        <Image
                                            source={ThemeManager.ImageIcons.icon_search_text}
                                            style={styles.searchIcon}
                                        />
                                        <TextInput
                                            value={searchData}
                                            onChangeText={onSearch}
                                            style={{
                                                width: "100%",
                                                color: ThemeManager.colors.textColor,
                                            }}
                                            placeholder={strings.currencyDetails.search}
                                            placeholderTextColor={
                                                ThemeManager.colors.inactiveTextColor
                                            }
                                        />
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            // style={{flex: 0.3}}
                                            onPress={() => {
                                                setModalVisible(false);
                                                setCountryData(countryFlags);
                                            }}
                                        >
                                            <Text style={styles.cancelText}>
                                                {strings.currencyDetails.cancel}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 15, flex: 1 }}>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        fontSize: 16,
                                        marginBottom: 5,
                                        fontFamily: Fonts.regular,
                                        color: ThemeManager.colors.inactiveTextColor,
                                    }}
                                >
                                    {strings.location.location}
                                </Text>
                                <BorderLine />
                                <Text
                                    style={{
                                        marginTop: 15,
                                        fontSize: 16,
                                        fontFamily: Fonts.regular,
                                        color: ThemeManager.colors.selectedTextColor,
                                    }}
                                >
                                    {selectedCountry}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        fontSize: 16,
                                        fontFamily: Fonts.regular,
                                        marginBottom: 5,
                                        color: ThemeManager.colors.inactiveTextColor,
                                    }}
                                >
                                    {strings.location.countryRegion}
                                </Text>
                                <BorderLine />
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    bounces={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    {countryData.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    justifyContent: "flex-start",
                                                    alignItems: "center",
                                                    flexDirection: "row",
                                                    marginBottom: 3,
                                                }}
                                                onPress={() => {
                                                    var phoneCode = item.countryCallingCode;
                                                    setSelectedCountry(item.countryNameEn);
                                                    dispatch(
                                                        registerFormUpdate({
                                                            prop: "registerCountryName",
                                                            value: item.countryNameEn,
                                                        })
                                                    );
                                                    dispatch(
                                                        registerFormUpdate({
                                                            prop: "registerCountryCallingFlag",
                                                            value: item.flag,
                                                        })
                                                    );
                                                    dispatch(
                                                        registerFormUpdate({
                                                            prop: "registerCountryNameCode",
                                                            value: item.countryCode,
                                                        })
                                                    );

                                                    dispatch(
                                                        registerFormUpdate({
                                                            prop: "registerCountryCallingCode",
                                                            value: item.countryCallingCode,
                                                        })
                                                    );
                                                    setSelectedCountryFlag(item.flag);
                                                    setSelectedCountryCode(item.countryCallingCode);
                                                    setModalVisible(false);
                                                    setCountryData(countryFlags);
                                                }}
                                            >
                                                <View style={{ borderRadius: 15, marginRight: 10 }}>
                                                    <Text style={{ fontSize: 16, marginTop: 10 }}>
                                                        {item.flag}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        marginTop: 15,
                                                        fontSize: 16,
                                                        fontFamily: Fonts.regular,
                                                        color: ThemeManager.colors.textColor1,
                                                    }}
                                                >
                                                    {item.countryNameEn}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    <View>
                                        {countryData?.length == 0 && (
                                            <Text
                                                style={{
                                                    color: ThemeManager.colors.textColor,
                                                    fontSize: 16,
                                                    fontFamily: Fonts.medium,
                                                    marginTop: 60,
                                                    textAlign: "center",
                                                }}
                                            >
                                                Country not found
                                            </Text>
                                        )}
                                    </View>
                                    <View style={{ height: 40 }}></View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </Wrap>
            </Modal> */}
        </SafeAreaView>
    );
};

export default VerifyEmail;
