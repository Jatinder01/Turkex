/* eslint-disable no-unreachable */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Alert,
  AppState,
  FlatList,
  RefreshControl,
  StyleSheet,
  Modal,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import { Wrap } from "../../common/Wrap";
import { ThemeManager } from "../../../../ThemeManager";
import TradeHeader from "../../common/TradeHeader";
import { strings } from "../../../../Localization";
import { colors, Fonts, Images } from "../../../theme";
import BorderLine from "../../common/BorderLine";
import { Actions } from "react-native-router-flux";
import Singleton from "../../../Singleton";
import {
  ButtonPrimary,
  TabIcon,
  Loader,
  InputField,
  CustomEmptyView,
} from "../../common";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  getCardHolderDetails,
  getProfile1,
  getCheckDocumentSumSubDetails,
  getCardBindAction,
  getCardFees,
  getCurrencyDetails,
  getCurrencyConversionDetails,
  cardCostCheckAction,
  getCardList,
  cardReplace,
  getCardPasswordRetrieval,
  cardLossReport,
  cardRemoveUnblock,
  getCardTopUpTrxList,
  getCardPaytendBalance,
  getUploadDocsPaytendSide,
} from "../../../Redux/Actions";
import * as constants from "../../../Constants";
import { EventRegister } from "react-native-event-listeners";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import SimpleHeader from "../../common/SimpleHeader";
import SelectDropdown from "react-native-select-dropdown";
import Moment from "moment";
import { countryFlags } from "../../common/CountryFlags";
const { height, width } = Dimensions.get("window");
let paramTrx;
//view component
const ManageView = ({ icon, text, viewStyle }) => {
  const styles = useStyles(ThemeManager);
  return (
    <View style={styles.manageContainer}>
      <View style={[styles.recentView, styles.manageRow, viewStyle]}>
        <Image style={styles.manageIcon} source={{ uri: icon }} />
        <Text style={[styles.recentText, styles.headerTextStyle]}>{text}</Text>
      </View>
      {/* <Image
        source={{ uri: ThemeManager.ImageIcons.icon_forward }}
        style={{
          height: 20,
          width: 20,
          resizeMode: "contain",
          marginRight: 15,
        }}
      /> */}
    </View>
  );
};
const ManageModal = ({
  onRequestClose,
  manageModalVisible,
  title,
  children,
  showDropDown,
  description,
  data,
  onSelect,
  selectedCard,
  selectedCardIndex,
  onPressNo,
  onPressYes,
  extraDescription,
}) => {
  // const styles = useStyles(ThemeManager);
  const styles = useStyles(ThemeManager);
  const renderCustomButton = (selectedItem, index) => {
    return (
      <View style={[styles.dropdown3BtnChildStyle]}>
        <Text style={[styles.dropdown3BtnTxt, styles.dropdown3BtnTxtStyle]}>
          {selectedItem ? selectedItem?.card_number : selectedCard?.card_number}
        </Text>
        <Image
          source={{ uri: Images.icon_dropDown }}
          style={styles.dropdownIcon}
        />
      </View>
    );
  };
  const renderCustomRowButton = (item, index) => {
    return (
      <>
        <View style={styles.customRow}>
          <Text
            style={[
              styles.dropdown3RowTxt,
              {
                color:
                  selectedCardIndex === index
                    ? ThemeManager.colors.selectedTextColor
                    : ThemeManager.colors.textColor1,
                fontFamily: Fonts.regular,
                textTransform: "capitalize",
              },
            ]}
          >
            {item?.card_number}
          </Text>
        </View>
      </>
    );
  };
  if (!manageModalVisible) return null;
  return (
    <Modal
      animationType="Slide"
      transparent={true}
      visible={manageModalVisible}
      onRequestClose={onRequestClose}
    >
      <Wrap
        style={styles.rejectWrapStyle}
        screenStyle={styles.screenRejectStyle}
        bottomStyle={styles.bgColor}
      >
        <View style={styles.manageModalContainer}>
          <TouchableOpacity
            style={styles.flexOne}
            onPress={onRequestClose}
          ></TouchableOpacity>
          <View style={styles.alignCenter}>
            <View
              style={{
                width: width - 60,
                backgroundColor: ThemeManager.colors.modalBg,
                borderRadius: 8,
              }}
            >
              <View style={styles.spaceRow}>
                <Text style={styles.titleStyle}>{title}</Text>
                <TouchableOpacity
                  onPress={onRequestClose}
                  style={styles.closeButton}
                >
                  <Image
                    source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>

              <BorderLine style={styles.borderColor} />
              {showDropDown ? (
                <View>
                  {extraDescription && (
                    <Text style={styles.extraText}>{extraDescription}</Text>
                  )}
                  <Text style={styles.descriptionText}>{description}</Text>
                  <View style={styles.selectCardStyle}>
                    <Text style={styles.selectCardText}>
                      {strings.cardScreen.select_card}
                    </Text>
                    <View>
                      <SelectDropdown
                        key={"first"}
                        data={data}
                        dropdownOverlayColor={"transparent"}
                        defaultValueByIndex={selectedCardIndex}
                        onSelect={(selectedItem, index) => {
                          onSelect(selectedItem, index);
                        }}
                        // selectedIndex={genderIndex}
                        // buttonStyle={styles.dropdown3BtnStyle}
                        buttonStyle={styles.dropDownButtonStyle}
                        renderCustomizedButtonChild={renderCustomButton}
                        dropdownStyle={styles.tabBgColor}
                        rowStyle={styles.tabBgColor}
                        renderCustomizedRowChild={renderCustomRowButton}
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        marginVertical: 15,
                      }}
                    >
                      <ButtonPrimary
                        style={{ marginBottom: 10, width: 100, height: 40 }}
                        title={strings.cardScreen.no}
                        onPress={onPressNo}
                      />
                      <ButtonPrimary
                        style={{ marginBottom: 10, width: 100, height: 40 }}
                        title={strings.cardScreen.yes}
                        onPress={onPressYes}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <View>{children}</View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={onRequestClose}
          ></TouchableOpacity>
        </View>
      </Wrap>
    </Modal>
  );
};
const RowView = ({ title, value }) => {
  const styles = useStyles(ThemeManager);
  return (
    <View style={styles.rowViewStyle}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
};
const CardsScreen = (props) => {
  const dispatch = useDispatch();
  const [agreeMarketing, setagreeMarketing] = useState(false);
  const styles = useStyles(ThemeManager);
  const { isCardHolderLoading, cardHolderError, cardHolderInfo } = useSelector(
    (state) => state?.cardHolderDetailsReducer
  );
  const { checkDocumentError, checkDocumentInfo, isCheckDocumentLoading } =
    useSelector((state) => state?.cardCheckDocumentReducer);
  const [kycStatus, setKycStatus] = useState(false);
  const [isProfileFilled, setIsProfileFilled] = useState(false);
  const [userData, setuserData] = useState({});
  const [address, setAddress] = useState("");
  const { currentTheme, currentLanguage } = useSelector(
    (state) => state?.AuthReducer
  );
  const { isCardBindLoading, cardBindError, cardBindInfo } = useSelector(
    (state) => state?.cardBindReducer
  );
  const { cardFeesInfo, cardFeesError, isCardFeesLoading } = useSelector(
    (state) => state?.cardFeesReducer
  );

  const [countryCode, setCountryCode] = useState("");
  const [eaa, setEaa] = useState(false);
  const [loader, setLoader] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleReject, setModalVisibleReject] = useState(false);
  const [descriptionReject, setDescriptionReject] = useState("");

  const [modalCostVisible, setModalCostVisible] = useState(false);
  const [infoUploaded, setInfoUploaded] = useState(false);
  const [buttonChange, setButtonChange] = useState(false);
  const { currencyDetailsLoading, currencyDetails } = useSelector(
    (state) => state?.withDetails
  );
  const [viewDashboard, setViewDashboard] = useState(false);

  //activate card
  const { cardActivateInfo, cardActivateError, isCardActivateLoading } =
    useSelector((state) => state?.cardActivatePaytendReducer);

  const { cardListInfo, cardListError, isCardListLoading } = useSelector(
    (state) => state?.cardListReducer
  );
  const [cardInfos, setCardInfos] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const [myCardsToggle, setMyCardsToggle] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [replaceCardModal, setReplaceCardModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [blockCardModal, setBlockCardModal] = useState(false);
  const [unblockCardModal, setUnblockCardModal] = useState(false);
  const [viewCardModal, setViewCardModal] = useState(false);
  const [cardBindModal, setCardBindModal] = useState(false);

  const [viewAtmModal, setViewAtmModal] = useState(false);
  const [pageLimit, setPageLImit] = useState(10);
  const [pageNumberTrx, setPageNumberTrx] = useState(1);
  const {
    cardPaytendBalanceInfo,
    cardPaytendBalanceError,
    isCardPaytendBalanceLoading,
  } = useSelector((state) => state?.cardPaytendBalanceReducer);
  const {
    cardTopUpTrxListInfo,
    cardTopUpTrxListError,
    isCardTopUpTrxListLoading,
    totalRecords,
  } = useSelector((state) => state?.cardTopUpTrxListReducer);
  const [usdtBalance, setUsdtBalance] = useState("");

  const [addressSend, setAddressSend] = useState("");
  const [postcodeSend, setPostcodeSend] = useState("");
  const [citySend, setCitySend] = useState("");
  const [countryName, setCountryName] = useState("");
  const [editCard, setEditCard] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("🇺🇸");
  const [countryData, setCountryData] = useState(countryFlags);
  const [searchData, setSearchData] = useState(countryFlags);
  const [selectedCountry, setSelectedCountry] = useState("Select Country");
  const [firstNameSend, setFirstNameSend] = useState("");
  const [lastNameSend, setLastNameSend] = useState("");
  const [profileLoader, setProfileLoader] = useState(false);
  const [cardFeesData, setCardFees] = useState(null);
  const { cardCostHolder, cardCostError, isCardCostLoading } = useSelector(
    (state) => state?.cardCostReducer
  );
  const [updateError, setUpdateError] = useState("");
  const [isCompleteProfile, setIsCompleteProfile] = useState(false);
  const [cardholderDetails, setCardHolderDetails] = useState(null);
  const [sumSubDetails, setSumSubDetailsDetails] = useState(null);
  const [nonEaaValue, setNonEaaValue] = useState(null);
  const { isUploadDocPaytendSideLoading } = useSelector(
    (state) => state?.uploadDocsPaytendSideReducer
  );
  const [hideCardNumber, setHideCardNumber] = useState(false);
  const getProfileData = () => {
    setLoader(true);
    dispatch(getProfile1())
      .then((res) => {
        setProfileLoader(true);
        getProfileInfo();
        getCardListDetails();
      })
      .catch((err) => console.log("getProfileInfo=-=-=err-=->>", err));
  };
  const getMonth = (date) => {
    var month = new Date(date);
    var mm = (month?.getMonth() + 1).toString();

    if (mm?.length == 1) {
      mm = `0` + mm;
    }
    return mm;
    // return month.getMonth();
  };
  const getDate = (date) => {
    var date1 = new Date(date);
    var month = new Date(date1);
    var yyyy = month.getFullYear().toString().substring(2);

    return yyyy;
  };
  const getCurrencyBalance = () => {
    let coinName = "usdt";
    dispatch(getCurrencyDetails({ coinName }))
      .then((res) => {
        console.log("getCurrencyDetails-balance=-ee=res>>", res);
        setUsdtBalance(res?.balance);
      })
      .catch((err) => {
        console.log("getCurrencyDetails==balance=-ee=err>>", err);
        setUsdtBalance("");
      });
  };

  useEffect(() => {
    // Singleton.getInstance()
    //   .getData("hideCardNumber")
    //   .then((res) => {
    //     console.log("asdasdasdasdasd", res);
    //     if (res == "false" || res == undefined) {
    //       setHideCardNumber(true);
    //     } else {
    //       setHideCardNumber(false);
    //     }
    //   })
    //   .catch((err) => {});
    console.log("current screene=-=-=-", Actions.currentScene);
    setHideCardNumber(true);
    getProfileData();
    setMyCardsToggle(false);
    props.navigation.addListener("didFocus", () => {
      setHideCardNumber(true);
      getProfileData();
      setMyCardsToggle(false);
    });
  }, []);
  const getCardListDetails = () => {
    dispatch(getCardList())
      .then((res) => {
        if (res?.length > 0) {
          setCardInfos(res);
          setSelectedCard(res[0]);
          const test = res[0]?.next_charge_on;
          var d = new Date(test);
          getCardFeesDetails();
          dispatch(getCardPaytendBalance(res[0]?.card_number))
            .then((res) => {
              console.log("getCardPaytendBalance=-res[0]=-----", res);
            })
            .catch((err) => {
              console.log("getCardPaytendBalance=res[0]-err=-=", err);
            });
          getTransactionList(res[0]?.card_number);
        }
      })
      .catch((err) => {
        console.log("getCardList err=++-=->>", err);
      });
  };
  const onClickCardBind = () => {
    dispatch(getCardList()).then((res) => {
      if (res?.length == 0) {
        dispatch(getCardBindAction())
          .then((resp) => {
            getCurrencyBalance();
            console.log("getCardBindAction=-=-=22---resp", resp);

            getCardFeeList();

            setCardBindModal(false);
          })
          .catch((err) => {
            console.log("getCardBindAction=-=-++++=---err", err);
            setLoader(false);
            // setCardBindModal(false);
            Singleton.getInstance().showError(err);
          });
      } else {
        if (res?.length > 0) {
          if (
            res[0]?.next_charge_on == null &&
            res[0]?.fee_status == "unpaid"
          ) {
            getCardFeeList();
            getCurrencyBalance();
          } else if (res[0]?.fee_status == "paid" && res[0]?.next_charge_on) {
            // Actions.currentScene != "CardInitial" &&
            //   Actions.push("CardInitial");

            setViewDashboard(true);
            setInfoUploaded(false);
          }
        }
      }
    });
  };
  const getUserCardDetails = () => {
    setCardBindModal(false);
    setModalVisibleReject(false);
    if (kycStatus) {
      dispatch(getCardHolderDetails())
        .then((response) => {
          console.log("----getCardHolderDetails-22 response-->", response);
          setModalVisibleReject(false);
          setCardHolderDetails(response);
          if (response == null) {
            setModalVisible(false);
            setIsCompleteProfile(false);
            Actions.currentScene != "UserDetails" &&
              Actions.push("UserDetails");
          } else if (response?.selfie_status && response?.document_status) {
            if (response?.audit_status == "activation_successful") {
              setInfoUploaded(true);

              setModalVisible(false);
              dispatch(getCardList()).then((res) => {
                if (res?.length == 0) {
                  setCardBindModal(true);
                  setLoader(false);
                } else {
                  if (res?.length > 0) {
                    getCurrencyBalance();

                    if (
                      res[0]?.next_charge_on == null &&
                      res[0]?.fee_status == "unpaid"
                    ) {
                      getCardFeeList();
                    } else {
                      setViewDashboard(true);
                      setInfoUploaded(false);
                    }
                  }
                }
              });
            } else {
              setInfoUploaded(true);
              setModalVisible(true);
              setIsCompleteProfile(true);
              setLoader(false);
            }
          } else if (response?.audit_status == "rejection") {
            setModalVisible(false);
            setDescriptionReject(response?.description);
            setModalVisibleReject(true);
            setLoader(false);
          } else if (
            response?.audit_status == "under_review" &&
            !response?.selfie_status
          ) {
            if (response?.document_status) {
              setViewDashboard(false);
              setLoader(false);
              setModalVisible(false);
              setIsCompleteProfile(true);
              setInfoUploaded(false);
            } else {
              setViewDashboard(false);
              setLoader(false);
              setModalVisible(false);
              setIsCompleteProfile(true);
              setInfoUploaded(false);
              // Actions.currentScene != "UserDetails" &&
              //   Actions.push("UserDetails");
            }
          } else if (
            response?.audit_status == "under_review" &&
            response?.selfie_status
          ) {
            setViewDashboard(false);
            setLoader(false);
            setModalVisible(true);
            setModalVisibleReject(false);
            setIsCompleteProfile(false);
            setInfoUploaded(false);
            // Actions.currentScene != "UserDetails" &&
            //   Actions.push("UserDetails");
          }
        })
        .catch((err) => {
          console.log("----getCardHolderDetails-22 err-->", err);
        });
      // Actions.currentScene != "UploadFiles" && Actions.push("UploadFiles");
    } else {
      // Alert.alert(
      //   constants.APP_NAME_CAPS,
      //   "Please complete your account verification to apply for card."
      // );
      Singleton.getInstance().showError(
        "Please complete your account verification to apply for card."
      );
    }
  };
  const getUserDetails = () => {
    setCardBindModal(false);
    dispatch(getCardHolderDetails())
      .then((response) => {
        console.log(
          "----getUserDetails-getCardHolderDetails response-->",
          response
        );
        setCardHolderDetails(response);
        setModalVisibleReject(false);
        if (response == null) {
          setIsCompleteProfile(false);
          setInfoUploaded(false);
          setModalVisibleReject(false);
          setLoader(false);
          setModalVisible(false);
        } else if (response?.audit_status == "activation_successful") {
          setModalVisibleReject(false);
          setIsCompleteProfile(false);
          setInfoUploaded(true);

          setModalVisible(false);
          dispatch(getCardList()).then((res) => {
            console.log("getCardList=== response-->", res);
            if (res.length == 0) {
              setCardBindModal(true);
              setLoader(false);
            } else {
              if (res.length > 0) {
                // getCardFeeDetails();
                getCurrencyBalance();

                if (
                  res[0]?.next_charge_on == null &&
                  res[0].fee_status == "unpaid"
                ) {
                  getCardFeeList();
                } else {
                  setViewDashboard(true);
                  setInfoUploaded(false);
                }
              }
            }
          });
        } else if (response?.selfie_status && response?.document_status) {
          setInfoUploaded(true);
          setModalVisible(true);
          setIsCompleteProfile(true);
          setLoader(false);
          // }
        } else if (response?.audit_status == "rejection") {
          setInfoUploaded(true);
          setModalVisible(false);
          setDescriptionReject(response?.description);
          setModalVisibleReject(true);
          setLoader(false);
        } else if (
          response?.audit_status == "under_review" &&
          !response?.selfie_status
        ) {
          setLoader(false);
          setViewDashboard(false);
          setModalVisible(false);
          setModalVisibleReject(false);
          setIsCompleteProfile(true);
          setInfoUploaded(false);
        } else if (
          response?.audit_status == "under_review" &&
          response?.selfie_status
        ) {
          // alert("hello");
          setLoader(false);
          setViewDashboard(false);
          setModalVisible(true);
          setModalVisibleReject(false);
          setIsCompleteProfile(false);
          setInfoUploaded(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        setModalVisible(false);
        console.log("----getCardHolderDetails-44err-->", err);
      });
  };
  const getCardFeesDetails = () => {
    if (Actions.currentScene == "_CardsScreen") {
      dispatch(getCardFees())
        .then((res) => {
          console.log("getCardFeeList=-=-++++=-res", res);
          if (Actions.currentScene == "_CardsScreen") {
            setCardFees(res);
            // setModalCostVisible(true);
            // setInfoUploaded(false);
            // setButtonChange(true);
            setLoader(false);
            // setCardBindModal(false);
          } else {
            setLoader(false);
            // setModalCostVisible(false);
            // setInfoUploaded(false);
            // setCardBindModal(false);
          }
        })
        .catch((err) => {
          console.log("card fees list=-=-=-=-err", err);
          setLoader(false);
        });
    }
  };
  const getCardFeeList = () => {
    if (Actions.currentScene == "_CardsScreen") {
      dispatch(getCardFees())
        .then((res) => {
          console.log("getCardFeeList=-=-=-res", res);
          if (Actions.currentScene == "_CardsScreen") {
            setCardFees(res);
            setModalCostVisible(true);
            setInfoUploaded(false);
            setButtonChange(true);
            setLoader(false);
            setCardBindModal(false);
          } else {
            setLoader(false);
            setModalCostVisible(false);
            setInfoUploaded(false);
            setCardBindModal(false);
          }
        })
        .catch((err) => {
          console.log("card fees list=-=-=-=-err", err);
          setLoader(false);
        });
    }
  };
  const getProfileInfo = () => {
    Singleton.getInstance()
      .getData(constants.USER_DATA)
      .then(async (res) => {
        setuserData(JSON.parse(res));

        if (JSON.parse(res)?.level == 2 || JSON.parse(res)?.level == 1) {
          setKycStatus(false);
          setLoader(false);
          setProfileLoader(false);
        } else if (JSON.parse(res)?.level == 3) {
          setKycStatus(true);
          getUserDetails();
        }

        if (JSON.parse(res)?.profiles[0]?.gender != null) {
          setIsProfileFilled(true);
          let pro = JSON.parse(res)?.profiles[0];
          setUserInfo(pro);
          let firstName = pro?.first_name;
          let lastName = pro?.last_name;
          let addr = pro?.address;
          let city = pro?.city;
          let postcode = pro?.postcode;
          let country = pro?.country;

          setFirstNameSend(firstName);
          setLastNameSend(lastName);
          setCountryCode(country);
          setAddressSend(addr);
          setPostcodeSend(postcode);
          setCitySend(city);
          let countryData;
          if (pro?.country) {
            countryData = countryFlags.find(
              (res) => res?.countryCode == pro?.country
            );

            setCountryName(countryData?.countryNameEn);
          }
          let fullAddress = `${firstName} ${lastName} \n${addr} \n${city} \n${postcode} \n${countryData?.countryNameEn}`;
          setAddress(fullAddress);

          setProfileLoader(false);
        } else {
          setIsProfileFilled(false);
        }
      })
      .catch((err) => {
        console.log("----value- err-->", err);
      });
  };
  const onCompleteButtonPress = () => {
    let checkEAA = constants.EEA_COUNTRY.find(
      (code) => code.toUpperCase() === countryCode.toUpperCase()
    );
    console.log("onCompleteButtonPressr--checkEAA>", checkEAA);
    if (checkEAA != undefined) {
      setNonEaaValue(false);
      dispatch(getCheckDocumentSumSubDetails(countryCode))
        .then((res) => {
          setSumSubDetailsDetails(res);
          if (res?.document_type) {
            if (res?.document_status) {
              Actions.currentScene != "UploadFiles" &&
                Actions.push("UploadFiles", {
                  auditStatus: cardholderDetails,
                  documentType: res,
                  nonEaa: false,
                });
            } else {
              if (cardHolderInfo?.document_status) {
                Actions.currentScene != "UploadFiles" &&
                  Actions.push("UploadFiles", {
                    auditStatus: cardholderDetails,
                    documentType: res,
                    nonEaa: false,
                  });
              } else {
                dispatch(getUploadDocsPaytendSide(res?.document_type))
                  .then((res) => {
                    if (
                      res?.audit_status == "under_review" &&
                      !res?.selfie_status
                    ) {
                      Actions.currentScene != "UploadFiles" &&
                        Actions.push("UploadFiles", {
                          auditStatus: cardholderDetails,
                          documentType: res,
                          nonEaa: false,
                        });
                    }
                  })
                  .catch((err) => {
                    console.log(
                      "getUploadDocsPaytendSide-0-0>112==>",
                      JSON.stringify(err)
                    );
                    setTimeout(() => {
                      dispatch(getCardHolderDetails())
                        .then((response) => {
                          console.log(
                            "----getCardHolderDetails-22 res-dddatat99->",
                            response
                          );
                          if (
                            response?.document_status == true &&
                            response?.selfie_status == false
                          ) {
                            Actions.currentScene != "UploadFiles" &&
                              Actions.push("UploadFiles", {
                                auditStatus: response?.data,
                                documentType: res,
                                nonEaa: false,
                              });
                          }
                        })
                        .catch((err) => {
                          console.log(
                            "----getCardHolderDetails-22 err-->",
                            err
                          );
                        });
                    }, 10000);
                    // setUploadLoader(false);
                  });
              }
            }
          } else {
            Actions.currentScene != "UploadFiles" &&
              Actions.push("UploadFiles", {
                auditStatus: cardholderDetails,
                documentType: res,
                nonEaa: false,
              });
            // setUploadLoader(false);
          }
        })
        .catch((err) => {
          console.log("getCardHolderDetails=-=err44411====-", err);
          // setUploadLoader(false);
        });
    } else {
      setNonEaaValue(true);
      dispatch(getCheckDocumentSumSubDetails(countryCode))
        .then((res) => {
          setSumSubDetailsDetails(res);
          if (res?.document_type) {
            if (cardholderDetails?.document_status) {
              Actions.currentScene != "UploadFiles" &&
                Actions.push("UploadFiles", {
                  auditStatus: cardholderDetails,
                  documentType: res,
                  nonEaa: true,
                });
            } else {
              dispatch(getUploadDocsPaytendSide(res?.document_type))
                .then((response) => {
                  console.log("getUploadDocsPaytendSide-0-0res111>>", response);
                  if (response?.status == "201") {
                    Actions.currentScene != "UploadFiles" &&
                      Actions.push("UploadFiles", {
                        auditStatus: response?.data,
                        documentType: res,
                        nonEaa: true,
                      });
                  }
                })
                .catch((err) => {
                  console.log("getUploadDocsPaytendSide-0-0111>>", err);
                  if (err?.response?.status === 504) {
                    // setModalVisible(true);
                    Actions.pop();
                  }
                });
            }
          } else {
            Actions.currentScene != "UploadFiles" &&
              Actions.push("UploadFiles", {
                auditStatus: cardholderDetails,
                documentType: res,
                nonEaa: true,
              });
          }
        })
        .catch((err) => {
          console.log("getCardHolderDetails=-=err55511=-", err);
        });
    }
    // Actions.currentScene != "UploadFiles" &&
    //   Actions.push("UploadFiles", {
    //     auditStatus: response,
    //     documentType: res,
    //     nonEaa: true,
    //   });
  };
  const onButtonPress = () => {
    // Actions.currentScene != "CardInitial" && Actions.push("CardInitial");
    getUserCardDetails();
  };
  const onClickConfirm = () => {
    console.log("parseFloat(usdtBalance)===", parseFloat(usdtBalance));
    console.log(
      "parseFloat(cardFeesInfo?.fee)===",
      parseFloat(cardFeesInfo?.activation_fee)
    );

    if (parseFloat(usdtBalance) >= parseFloat(cardFeesInfo?.activation_fee)) {
      dispatch(
        cardCostCheckAction(
          cardListInfo[0]?.card_number,
          postcodeSend,
          citySend,
          addressSend,
          countryName
        )
      )
        .then((res) => {
          setModalCostVisible(false);
          // Actions.currentScene != 'CardInitial' && Actions.push('CardInitial');
          setViewDashboard(true);
          setInfoUploaded(false);
          Singleton.getInstance().showMsg(
            "Your Evo Europe Card is on the way."
          );
        })
        .catch((err) => {
          console.log("card_number-----card cost-err", err);
          setModalCostVisible(false);
          Singleton.getInstance().showError(err);
        });
    } else {
      setModalCostVisible(false);
      Singleton.getInstance().showError(
        "Ensure sufficient balance in your USDT wallet to apply for the card. "
      );
    }
  };
  const listFetch = () => {
    getCardListDetails();
  };
  const onReplaceCardClick = () => {
    if (cardListInfo[0]?.status == "loss") {
      setBlockCardModal(false);

      Singleton.getInstance().showError("Your card is blocked");
    } else {
      dispatch(cardReplace(selectedCard?.card_number))
        .then((res) => {
          listFetch();
          setReplaceCardModal(false);
          Singleton.getInstance().showMsg("Card replace successfully");
        })
        .catch((err) => {
          console.log("cardReplace=-=-=-=err>>>", err);
          listFetch();
          setReplaceCardModal(false);
          Singleton.getInstance().showError(err);
        });
    }
  };
  const onPasswordRetrievalClick = () => {
    if (cardListInfo[0]?.status == "loss") {
      setBlockCardModal(false);

      Singleton.getInstance().showError("Your card is blocked");
    } else {
      dispatch(getCardPasswordRetrieval(selectedCard?.card_number))
        .then((res) => {
          Singleton.getInstance().showMsg(
            "Card password retrieved successfully"
          );
          setPasswordModal(false);
        })
        .catch((err) => {
          console.log("onPasswordRetrievalClick=-=-=-=err>>>", err);

          Singleton.getInstance().showError(err);
          setPasswordModal(false);
        });
    }
  };
  const onCardLostClick = () => {
    if (cardListInfo[0]?.status == "loss") {
      setBlockCardModal(false);
      // Singleton.getInstance().showMsg(
      //   'Card has been reported as lost, no need to operate again.',
      // );
      Singleton.getInstance().showError("Already blocked card");
    } else {
      dispatch(cardLossReport(selectedCard?.card_number))
        .then((res) => {
          listFetch();
          setBlockCardModal(false);
          Singleton.getInstance().showMsg("Card blocked successfully.");
        })
        .catch((err) => {
          console.log("cardLossReport=-=-=-=err>>>", err);
          Singleton.getInstance().showError(err);
          setBlockCardModal(false);
        });
    }
  };
  const onUnblockCardClick = () => {
    if (cardListInfo[0]?.status == "normal") {
      setUnblockCardModal(false);
      // Singleton.getInstance().showMsg(
      //   'Card has been reported as unblocked, no need to operate again.',
      // );
      Singleton.getInstance().showError("Already unblocked card");
    } else {
      dispatch(cardRemoveUnblock(selectedCard?.card_number))
        .then((res) => {
          listFetch();
          setUnblockCardModal(false);
          Singleton.getInstance().showMsg("Card unblocked successfully.");
        })
        .catch((err) => {
          console.log("cardLossReport=-=-=-=err>>>", err);
          listFetch();
          Singleton.getInstance().showError(err);
          setUnblockCardModal(false);
        });
    }
  };
  const getTransactionList = (card_number) => {
    dispatch(getCardTopUpTrxList(card_number, pageNumberTrx, pageLimit))
      .then((res) => { })
      .catch((err) => {
        console.log("getCardTopUpTrxList=-+++=-err=-", err);
      });
  };
  const onAddFundsPress = () => {
    Actions.currentScene != "CardAddFunds" &&
      Actions.push("CardAddFunds", { cardNumber: selectedCard?.card_number });
  };
  const isCloseToBottomTrx = () => {
    let page = pageNumberTrx + 1;

    if (cardTopUpTrxListInfo?.length < totalRecords) {
      paramTrx = {
        page: `${page}`,
        limit: pageLimit,
      };

      dispatch(getCardTopUpTrxList(selectedCard?.card_number, page, pageLimit));
      setPageNumberTrx(page);
    }
  };
  const onSearch = (value) => {
    setCountryData(
      searchData.filter(
        (i) =>
          i?.countryNameEn.toLowerCase().includes(value?.toLowerCase()) ||
          i?.countryCallingCode.toLowerCase().includes(value?.toLowerCase()) ||
          i?.countryCallingCode
            ?.toLowerCase()
            .includes(value?.replace("+", "").toLowerCase())
      )
    );
  };
  const renderCountryList = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={() => {
          setCountryModalVisible(false);
          setSelectedCountry(item?.countryNameEn);
          setSelectedCountryFlag(item?.flag);
          setCountryName(item?.countryNameEn);
          setModalCostVisible(true);
          setCountryData(countryFlags);
        }}
      >
        <View style={{ borderRadius: 15, marginRight: 10 }}>
          <Text style={{ fontSize: 16, marginTop: 10 }}>{item?.flag}</Text>
        </View>
        <Text
          style={{
            marginTop: 15,
            fontSize: 16,
            fontFamily: Fonts.regular,
            color: ThemeManager.colors.textColor,
          }}
        >
          {item?.countryNameEn}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <>
        <BorderLine
          style={{
            backgroundColor: ThemeManager.colors.borderColor,
            opacity: 0.4,
          }}
        />
        <View style={styles.itemStyle}>
          <View style={[styles.rowStyle, { alignItems: "flex-start" }]}>
            <View style={styles.rowAlign}>
              <Image
                style={styles.topUpIconStyle}
                source={{ uri: Images.topUpIcon }}
              />
              <View style={styles.rowCenter}>
                <Text
                  style={[
                    styles.recentText,
                    {
                      color: ThemeManager.colors.headerText,
                      textAlign: "right",
                      marginLeft: 10,
                    },
                  ]}
                >
                  {Moment(item?.created_at)?.format("DD-MM-YY")}
                </Text>
                <Text style={[styles.recentText, styles.spaceStyle]}>
                  {" | "}
                </Text>
                <Text
                  style={[
                    styles.recentText,
                    {
                      color: ThemeManager.colors.headerText,
                      textAlign: "right",
                      // marginLeft: 10,
                    },
                  ]}
                >
                  {Moment(item?.created_at)?.format("hh:mm:ss")}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.rowStyle,
              {
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              },
            ]}
          >
            <Text
              style={[
                styles.recentText,
                {
                  color: ThemeManager.colors.headerText,
                  textAlign: "right",
                  // marginBottom: 3,
                },
              ]}
            >
              {item?.order_no}
            </Text>
            <Text
              style={[
                styles.recentText,
                {
                  fontSize: 16,
                  fontFamily: Fonts.semiBold,
                  // lineHeight: 20,
                },
              ]}
            >
              {parseFloat(item.amount)?.toFixed(2)} {item?.currency}
            </Text>
          </View>

          <View style={[styles.rowStyle, { alignItems: "flex-start" }]}>
            <Text
              style={[
                styles.recentText,
                {
                  color:
                    item?.topup_status == "success"
                      ? ThemeManager.colors.btnGreenColor
                      : ThemeManager.colors.headerText,
                  textAlign: "right",
                  textTransform: "capitalize",
                },
              ]}
            >
              {item?.topup_status}
            </Text>
          </View>
        </View>
      </>
    );
  };
  return (
    <Wrap
      style={styles.backgroundStyle}
      screenStyle={styles.backgroundStyle}
      darkMode={ThemeManager.colors.themeColor === "light" ? false : true}
      bottomStyle={styles.backgroundStyle}
    >
      {infoUploaded ? (
        <View>
          <Loader
            isLoading={
              loader ||
              isCardBindLoading ||
              isCardFeesLoading ||
              isUploadDocPaytendSideLoading
            }
          />
        </View>
      ) : (
        <>
          {viewDashboard ? (
            <Wrap
              style={styles.backgroundStyle}
              screenStyle={styles.backgroundStyle}
              darkMode={
                ThemeManager.colors.themeColor === "light" ? false : true
              }
              bottomStyle={styles.backgroundStyle}
            >
              <Loader
                isLoading={isCardListLoading || isCardTopUpTrxListLoading}
              />
              <View style={styles.headerView}>
                <SimpleHeader
                  noGoBack
                  titleName={strings.cardScreen.your_card}
                  backImageColor={{ tintColor: ThemeManager.colors.headTxt }}
                  onBackPress={() => {
                    Actions.pop();
                  }}
                />
              </View>

              <View style={styles.topContainer}>
                <ScrollView nestedScrollEnabled bounces={false}>
                  <View style={styles.subViewStyle}>
                    <View
                      style={[
                        styles.cardImgStyle,
                        { borderRadius: 6, overflow: "hidden" },
                      ]}
                    >
                      <ImageBackground
                        source={{ uri: Images.cardBackground }}
                        style={styles.cardImgStyle}
                      >
                        <View style={styles.horizontalMargin}>
                          <View style={styles.cardSubView}>
                            <View style={styles.logoRow}>
                              <Image
                                source={{ uri: Images.icon_card_logo }}
                                style={styles.logoStyle}
                              />
                              <View style={{ marginLeft: 10 }}>
                                <Text style={styles.balanceLabel}>
                                  {strings.cardScreen.balance}
                                </Text>
                                <Text style={styles.balanceText}>
                                  {hideCardNumber
                                    ? "XXXX"
                                    : cardPaytendBalanceInfo?.balance != null
                                      ? parseFloat(
                                        cardPaytendBalanceInfo?.balance
                                      ).toFixed(2)
                                      : 0.0}
                                  {" EUR"}
                                </Text>
                              </View>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                              <Text
                                style={{
                                  color:
                                    cardInfos[0]?.status == "loss"
                                      ? "red"
                                      : "#3ECA0D",
                                  fontSize: 15,
                                  fontFamily: Fonts.medium,
                                }}
                              >
                                •{" "}
                                {cardInfos.length > 0 &&
                                  cardInfos[0]?.status == "normal"
                                  ? "Active"
                                  : cardInfos[0]?.status == "loss"
                                    ? "Blocked"
                                    : "Inactive"}
                              </Text>
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 13,
                                  fontFamily: Fonts.medium,
                                }}
                              >
                                {"Virtual Card"}
                              </Text>
                            </View>
                          </View>
                          <View style={{ marginTop: 6 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text style={styles.cardNumberText}>
                                {hideCardNumber
                                  ? `${cardInfos[0]?.card_number.slice(
                                    0,
                                    4
                                  )} XXXX XXXX ${cardInfos[0]?.card_number.slice(
                                    -4
                                  )}`
                                  : cardInfos.length > 0 &&
                                  cardInfos[0]?.card_number
                                    ?.match(/(\d{4})/g)
                                    .join("  ")}
                                {/* {cardInfos.length > 0 &&
                                cardInfos[0]?.card_number
                                  ?.match(/(\d{4})/g)
                                  .join("  ")} */}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  var value = "";
                                  console.log("bbbbbbbbbbbb", hideCardNumber);

                                  if (hideCardNumber) {
                                    value = "false";
                                  } else {
                                    value = "true";
                                  }
                                  console.log("123123123123123123", value);

                                  Singleton.getInstance()
                                    .saveData("hideCardNumber", value)
                                    .then((res) => {
                                      setHideCardNumber(!hideCardNumber);
                                    });
                                }}
                              >
                                <Image
                                  source={
                                    !hideCardNumber
                                      ? {
                                        uri: ThemeManager.ImageIcons
                                          .icon_hide_eye
                                      }
                                      : {
                                        uri: ThemeManager.ImageIcons
                                          .icon_open_eye,
                                      }
                                  }
                                  style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: "contain",
                                  }}
                                />
                              </TouchableOpacity>
                            </View>

                            <View style={styles.validView}>
                              <View>
                                <Text style={styles.validDate}>
                                  {strings.cardScreen.valid_upto}
                                </Text>
                                <Text style={styles.dateText}>
                                  {hideCardNumber
                                    ? "XX"
                                    : getMonth(cardInfos[0]?.expiry_date)}
                                  /
                                  {hideCardNumber
                                    ? "XX"
                                    : getDate(cardInfos[0]?.expiry_date)}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.masterCardRow}>
                          <Text style={styles.firstNameText}>
                            {userInfo?.first_name} {userInfo?.last_name}
                          </Text>
                          <Image
                            source={{ uri: Images.icon_masterCard }}
                            style={styles.masterCardIcon}
                          />
                        </View>
                      </ImageBackground>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setMyCardsToggle(!myCardsToggle);
                      }}
                      style={[
                        styles.recentView,
                        {
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                          borderBottomLeftRadius: myCardsToggle ? 0 : 8,
                          borderBottomRightRadius: myCardsToggle ? 0 : 8,
                        },
                      ]}
                    >
                      <View style={styles.rowStyle}>
                        <Text style={styles.recentText}>
                          {strings.cardScreen.manage_my_card}
                        </Text>
                        <Image
                          style={{
                            height: 18,
                            width: 18,
                            resizeMode: "contain",
                          }}
                          source={{ uri: ThemeManager.ImageIcons.icon_down }}
                        />
                      </View>
                    </TouchableOpacity>
                    {myCardsToggle && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            // setMyCardsToggle(true);
                            setReplaceCardModal(true);
                          }}
                        >
                          <ManageView
                            icon={ThemeManager.ImageIcons.icon_replace_card}
                            viewStyle={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              marginTop: 0,
                            }}
                            text={strings.cardScreen.replace_card}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setPasswordModal(true);
                          }}
                        >
                          <ManageView
                            icon={Images.icon_password_retrieval_light}
                            viewStyle={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              marginTop: 0,
                            }}
                            text={strings.cardScreen.password_retrieval}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setBlockCardModal(true);
                          }}
                        >
                          <ManageView
                            icon={Images.icon_card_block}
                            viewStyle={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              marginTop: 0,
                            }}
                            text={strings.cardScreen.block_report_lost_card}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setUnblockCardModal(true);
                          }}
                        >
                          <ManageView
                            icon={Images.icon_card_unblock}
                            viewStyle={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              marginTop: 0,
                            }}
                            text={strings.cardScreen.unblock_card}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setViewCardModal(true);
                          }}
                        >
                          <ManageView
                            icon={Images.view_card_limit}
                            viewStyle={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              marginTop: 0,
                            }}
                            text={strings.cardScreen.view_card_limit}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setViewAtmModal(true);
                          }}
                        >
                          <ManageView
                            icon={Images.view_atm_limit}
                            viewStyle={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              marginTop: 0,
                              borderBottomLeftRadius: 8,
                              borderBottomRightRadius: 8,
                            }}
                            text={strings.cardScreen.view_atm_limit}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                    <View
                      style={[
                        styles.recentView,
                        { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                      ]}
                    >
                      <View style={styles.rowStyle}>
                        <Text style={styles.recentText}>
                          {strings.cardScreen.recent_activity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Actions.currentScene != "TransactionStatement" &&
                              Actions.TransactionStatement();
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.medium,
                            }}
                          >
                            {strings.cardScreen.view_all}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 500,
                      }}
                    >
                      <FlatList
                        nestedScrollEnabled
                        keyboardShouldPersistTaps={"handled"}
                        data={cardTopUpTrxListInfo}
                        showsVerticalScrollIndicator={false}
                        style={{
                          // marginTop: 5,
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                          backgroundColor: ThemeManager.colors.SwapInput,
                        }}
                        bounces={false}
                        // contentContainerStyle={{ height: 400 }}
                        // contentContainerStyle={{ flexGrow: 1 }}
                        onEndReachedThreshold={0.1}
                        // extraData={cardTopUpTrxListInfo}
                        onEndReached={isCloseToBottomTrx}
                        // onEndReached={isCloseToBottomTrade}
                        scrollEnabled={true}
                        renderItem={renderItem}
                        ListEmptyComponent={() => {
                          return (
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 60,
                              }}
                            >
                              <CustomEmptyView />
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontFamily: Fonts.regular,
                                  color: ThemeManager.colors.inactiveTextColor,
                                }}
                              >
                                {strings.cardScreen.no_record_found}
                              </Text>
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </View>
                </ScrollView>
              </View>
              <ButtonPrimary
                style={{ marginBottom: 10 }}
                title={strings.cardScreen.top_up_funds_}
                onPress={() => {
                  if (cardInfos[0]?.status == "loss") {
                    Singleton.getInstance().showError("Your card is blocked");
                  } else {
                    onAddFundsPress();
                  }
                }}
              />
            </Wrap>
          ) : (
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              contentContainerStyle={{ flex: 1 }}
            >
              <View style={styles.mainContainer}>
                <Text style={styles.moreText}>
                  {strings.cardScreen.there_s_more}
                </Text>
                <Text style={styles.classyText}>
                  {strings.cardScreen.obtain_a_classy}
                </Text>
                <Image
                  source={{ uri: Images.cardBanner }}
                  style={styles.bannerStyle}
                />
              </View>
              {isCompleteProfile && !loader ? (
                <ButtonPrimary
                  style={{ marginBottom: 50 }}
                  title={strings.cardScreen.complete_your_profile}
                  onPress={() => {
                    onCompleteButtonPress();
                  }}
                />
              ) : !loader ? (
                <ButtonPrimary
                  style={{ marginBottom: 50 }}
                  title={
                    buttonChange
                      ? strings.cardScreen.pay_your_card_cost
                      : strings.enterAccountDetails.applyForYourPhysicalCard
                  }
                  onPress={() => {
                    onButtonPress();
                  }}
                />
              ) : null}

              <Loader
                isLoading={
                  loader ||
                  isCardBindLoading ||
                  isCardFeesLoading ||
                  isUploadDocPaytendSideLoading
                }
              />
            </KeyboardAwareScrollView>
          )}
        </>
      )}

      {modalVisible && (
        <View style={styles.pendingModal}>
          <Wrap
            style={styles.rejectWrapStyle}
            screenStyle={styles.screenRejectStyle}
            bottomStyle={styles.backgroundStyle}
          >
            <View style={styles.pendingModalContainer}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  // setModalVisible(false);
                  // getUserCardDetails();
                }}
              ></TouchableOpacity>
              <View style={styles.alignCenter}>
                <View
                  style={{
                    //   height: 200,
                    width: width - 60,
                    backgroundColor: ThemeManager.colors.modalBg,
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <LottieView
                    style={{ height: 100, width: 100 }}
                    source={Images.timerLottie}
                    autoPlay
                    loop={true}
                  />
                  <Text style={styles.pendingText}>
                    {strings.cardScreen.verificationPending}
                  </Text>
                  <Text style={styles.thankYouText}>
                    {strings.cardScreen.thankYou}
                  </Text>
                  <ButtonPrimary
                    title={strings.cardScreen.ok}
                    style={styles.okButton}
                    btnStyle={{
                      height: 40,
                    }}
                    textstyle={{ paddingHorizontal: 50 }}
                    onPress={() => {
                      Actions.currentScene != "Main" && Actions.Main();
                    }}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  // setModalVisible(false);
                  // getUserCardDetails();
                }}
              ></TouchableOpacity>
            </View>
          </Wrap>
        </View>
      )}
      {modalVisibleReject && (
        <View style={styles.rejectContainer}>
          <Loader isLoading={loader} />
          <Wrap
            style={styles.rejectWrapStyle}
            screenStyle={[styles.screenRejectStyle]}
            bottomStyle={styles.backgroundStyle}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  // setModalVisible(false);
                  // getUserCardDetails();
                }}
              ></TouchableOpacity>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    //   height: 200,
                    width: width - 60,
                    backgroundColor: ThemeManager.colors.modalBg,
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: ThemeManager.colors.modalTitle,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      margin: 15,
                    }}
                  >
                    {strings.cardScreen.verification_failed}
                  </Text>
                  <Text
                    style={{
                      color: ThemeManager.colors.modalTitle1,
                      fontSize: 14,
                      fontFamily: Fonts.light,
                      textAlign: "center",
                      margin: 10,
                    }}
                  >
                    {descriptionReject}
                  </Text>
                  <ButtonPrimary
                    title={strings.cardScreen.ok}
                    style={{
                      height: 40,
                      marginVertical: 20,
                      width: "100%",
                      backgroundColor: ThemeManager.colors.selectedTextColor,
                      borderRadius: 4,
                    }}
                    textstyle={{ paddingHorizontal: 50 }}
                    onPress={() => {
                      dispatch(getCheckDocumentSumSubDetails(countryCode))
                        .then((res) => {
                          setSumSubDetailsDetails(res);
                          Actions.currentScene != "UploadFiles" &&
                            Actions.push("UploadFiles", {
                              auditStatus: cardholderDetails,
                              documentType: res,
                              nonEaa: nonEaaValue,
                            });
                        })
                        .catch((err) => {
                          console.log(
                            "getCardHolderDetails=-=err44411====-",
                            err
                          );
                        });
                    }}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  // setModalVisible(false);
                  // getUserCardDetails();
                }}
              ></TouchableOpacity>
            </View>
          </Wrap>
        </View>
      )}
      {cardBindModal && (
        <View style={styles.bindContainer}>
          <Wrap
            style={styles.rejectWrapStyle}
            screenStyle={styles.screenRejectStyle}
            bottomStyle={styles.backgroundStyle}
          >
            <View style={styles.bindModal}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  // setModalVisible(false);
                  // getUserCardDetails();
                }}
              ></TouchableOpacity>
              <View style={styles.alignCenter}>
                <View
                  style={{
                    //   height: 200,
                    width: width - 60,
                    backgroundColor: ThemeManager.colors.modalBg,
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Text style={styles.congratsText}>
                    {strings.cardScreen.congrats}
                  </Text>
                  <Text style={styles.yourProfileStyle}>
                    {strings.cardScreen.your_profile}
                  </Text>

                  <ButtonPrimary
                    title={strings.cardScreen.next}
                    style={styles.nextBtnStyle}
                    textstyle={{ paddingHorizontal: 50 }}
                    onPress={() => {
                      onClickCardBind();
                    }}
                  />
                  {/* )} */}
                </View>
              </View>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  // setModalVisible(false);
                  // getUserCardDetails();
                }}
              ></TouchableOpacity>
            </View>
          </Wrap>
        </View>
      )}
      <Modal
        animationType="Slide"
        transparent={true}
        visible={modalCostVisible}
        onRequestClose={() => {
          setModalCostVisible(false);
        }}
      >
        {
          <Loader
            isLoading={
              currencyDetailsLoading || isCardCostLoading || profileLoader
            }
          />
        }
        <Wrap
          style={styles.rejectWrapStyle}
          screenStyle={styles.screenRejectStyle}
          bottomStyle={styles.backgroundStyle}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setModalCostVisible(false);
              }}
            ></TouchableOpacity>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  //   height: 200,
                  width: width,
                  backgroundColor: ThemeManager.colors.DashboardBG,
                  // alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    width: width,
                  }}
                >
                  <Image
                    // source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                    style={{
                      marginLeft: 15,
                      height: 30,
                      width: 30,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color: ThemeManager.colors.modalTitle,
                      fontSize: 16,
                      fontFamily: Fonts.regular,
                      marginTop: 15,
                    }}
                  >
                    {editCard
                      ? strings.cardScreen.confirm_shipping_info
                      : "Card Activation Cost"}
                  </Text>
                  <TouchableOpacity
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: "center",
                      alignItems: "center",

                      marginRight: 15,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      if (editCard) {
                        setEditCard(false);
                      } else {
                        setModalCostVisible(false);
                        setEditCard(false);
                      }
                    }}
                  >
                    <Image
                      source={{ uri: ThemeManager.ImageIcons.icon_close_main }}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <BorderLine style={{ width: width, marginVertical: 10 }} />

                <>
                  {editCard ? (
                    <KeyboardAwareScrollView
                      bounces={false}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            styles.shippingText,
                            { marginHorizontal: 15 },
                          ]}
                        >
                          {strings.cardScreen.shipping_address}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.addressViewStyle,
                          {
                            backgroundColor: ThemeManager.colors.DashboardBG,
                            marginHorizontal: 0,
                            padding: 0,
                          },
                        ]}
                      >
                        <Text style={[styles.inputTitle, { marginTop: 0 }]}>
                          {strings.enterAccountDetails.address}
                        </Text>
                        <InputField
                          editable={true}
                          title={strings.enterAccountDetails.addressPlaceholder}
                          value={addressSend}
                          onChangeText={(text) => {
                            setAddressSend(text);
                          }}
                          maxlength={100}
                          placeholderTextColor={
                            ThemeManager.colors.placeholderTextColor
                          }
                          customContainerStyle={{
                            backgroundColor: ThemeManager.colors.SwapInput,
                          }}
                        />
                        <Text style={styles.inputTitle}>
                          {strings.enterAccountDetails.postcode}
                        </Text>
                        <InputField
                          editable={true}
                          title={
                            strings.enterAccountDetails.postcodePlaceholder
                          }
                          value={postcodeSend}
                          onChangeText={(text) => {
                            let value = text;
                            if (
                              constants.ALPHANUMERIC_SPACE_REGEX.test(value)
                            ) {
                              setPostcodeSend(text);
                            }
                          }}
                          autoCapitalize={"characters"}
                          defaulEmailInput={{ textTransform: "uppercase" }}
                          maxlength={10}
                          placeholderTextColor={
                            ThemeManager.colors.placeholderTextColor
                          }
                          customContainerStyle={{
                            backgroundColor: ThemeManager.colors.SwapInput,
                          }}
                        />
                        <Text style={styles.inputTitle}>
                          {strings.enterAccountDetails.town}
                        </Text>
                        <InputField
                          editable={true}
                          title={strings.enterAccountDetails.townPlaceholder}
                          value={citySend}
                          onChangeText={(text) => {
                            let value = text;
                            setCitySend(text);
                          }}
                          maxlength={100}
                          placeholderTextColor={
                            ThemeManager.colors.placeholderTextColor
                          }
                          customContainerStyle={{
                            backgroundColor: ThemeManager.colors.SwapInput,
                          }}
                        />
                        <Text style={styles.inputTitle}>
                          {strings.enterAccountDetails.country}
                        </Text>
                        <InputField
                          editable={false}
                          value={countryName ? countryName : "Select country"}
                          image={{ uri: Images.icon_selectCountry_RightArrow }}
                          rightImageStyle={{ resizeMode: "contain" }}
                          Next={() => {
                            setModalCostVisible(false);
                            setCountryModalVisible(true);
                          }}
                          textInactiveStyle={{
                            color: ThemeManager.colors.textColor,
                          }}
                          placeholderTextColor={
                            ThemeManager.colors.placeholderTextColor
                          }
                          customContainerStyle={{
                            backgroundColor: ThemeManager.colors.SwapInput,
                            marginBottom: 10,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: "red",
                          fontSize: 14,
                          fontFamily: Fonts.regular,
                          marginHorizontal: 15,
                        }}
                      >
                        {updateError}
                      </Text>
                      <ButtonPrimary
                        title={"Update"}
                        style={{
                          // height: 50,
                          marginVertical: 20,
                          marginRight: 10,
                          width: width - 30,
                          backgroundColor:
                            ThemeManager.colors.selectedTextColor,
                          borderRadius: 4,
                        }}
                        textstyle={{ paddingHorizontal: 10 }}
                        onPress={() => {
                          // onClickConfirm();

                          if (addressSend?.length == 0) {
                            setUpdateError("Please enter your address");
                          } else if (addressSend?.length < 3) {
                            setUpdateError("Please enter valid address");
                          } else if (postcodeSend?.length == 0) {
                            setUpdateError("Please enter your postcode");
                          } else if (postcodeSend?.length < 4) {
                            setUpdateError("Please enter valid postcode");
                          } else if (citySend?.length == 0) {
                            setUpdateError("Please enter your town/city name");
                          } else if (citySend?.length < 2) {
                            setUpdateError("Please enter valid town/city name");
                          } else {
                            setEditCard(false);
                          }
                        }}
                      />
                    </KeyboardAwareScrollView>
                  ) : (
                    <>
                      <View
                        style={{
                          marginHorizontal: 15,
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: ThemeManager.colors.modalTitle1,
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                            }}
                          >
                            {"USDT Wallet"}
                          </Text>
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontSize: 15,
                              fontFamily: Fonts.regular,
                            }}
                          >
                            {strings.cardScreen.balance}{" "}
                            {usdtBalance ? usdtBalance : 0}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            Actions.currentScene != "DepositSearch" &&
                              Actions.DepositSearch();
                            setModalCostVisible(false);
                          }}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ color: ThemeManager.colors.textColor }}
                          >
                            Add balance:{" "}
                          </Text>
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                            }}
                            source={{ uri: ThemeManager.ImageIcons.icon_add }}
                          />
                        </TouchableOpacity>
                      </View>
                      <BorderLine
                        style={{ width: width, marginVertical: 10 }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            styles.shippingText,
                            { marginHorizontal: 15 },
                          ]}
                        >
                          {strings.cardScreen.shipping_address}
                        </Text>
                        <TouchableOpacity
                          style={{
                            height: 40,
                            width: 40,
                            justifyContent: "flex-end",
                          }}
                          onPress={() => {
                            setEditCard(true);
                          }}
                        >
                          <Image
                            source={{ uri: ThemeManager.ImageIcons.icon_edit }}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                            }}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.addressViewStyle}>
                        <Text
                          style={styles.shippingText}
                        >{`${firstNameSend} ${lastNameSend} \n${addressSend} \n${citySend} \n${postcodeSend} \n${countryName}`}</Text>
                      </View>
                      <View
                        style={{
                          marginHorizontal: 16,
                          // marginTop: 20,
                          flexDirection: "row",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setagreeMarketing(!agreeMarketing);
                          }}
                        >
                          <Image
                            style={{
                              width: 18,
                              height: 18,
                              resizeMode: "contain",
                            }}
                            source={
                              agreeMarketing
                                ? { uri: Images.icon_Agree_check }
                                : { uri: ThemeManager.ImageIcons.icon_select_k }
                            }
                          />
                        </TouchableOpacity>
                        <Text style={styles.confirmText}>
                          {strings.cardScreen.i_confirm}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: width,
                        }}
                      >
                        <Text
                          style={{
                            color: ThemeManager.colors.modalTitle1,
                            fontSize: 14,
                            fontFamily: Fonts.light,
                            textAlign: "center",
                            // margin: 10,
                            width: width / 2 - 30,
                          }}
                        >
                          {`Activation Cost:\n`}
                          <Text
                            style={{
                              color: ThemeManager.colors.textColor,
                              fontFamily: Fonts.medium,
                            }}
                          >
                            {" "}
                            {cardFeesInfo?.activation_fee}
                            {" USDT"}
                          </Text>
                        </Text>

                        <ButtonPrimary
                          enable={!agreeMarketing}
                          title={strings.cardScreen.confirm}
                          style={[
                            styles.confirmButtonStyle,
                            {
                              width: width / 2 - 30,
                              opacity: agreeMarketing ? 1 : 0.6,
                            },
                          ]}
                          textstyle={{ paddingHorizontal: 10 }}
                          onPress={() => {
                            if (setagreeMarketing) {
                              onClickConfirm();
                            }
                          }}
                        />
                      </View>
                    </>
                  )}
                </>
              </View>
            </View>
          </View>
        </Wrap>
      </Modal>
      <ManageModal
        manageModalVisible={replaceCardModal}
        onRequestClose={() => {
          setReplaceCardModal(false);
        }}
        title={strings.cardScreen.replace_card}
        showDropDown={true}
        description={strings.cardScreen.are_you_sure_you}
        data={cardInfos}
        onSelect={(selectedItem, index) => {
          setSelectedCard(selectedItem);
          setSelectedCardIndex(index);
          // onSelect(selectedItem, index);
        }}
        selectedCard={selectedCard}
        selectedCardIndex={selectedCardIndex}
        onPressNo={() => {
          setReplaceCardModal(false);
        }}
        extraDescription={strings.cardScreen.after_the_card}
        onPressYes={() => {
          onReplaceCardClick();
        }}
      ></ManageModal>
      <ManageModal
        manageModalVisible={passwordModal}
        onRequestClose={() => {
          setPasswordModal(false);
        }}
        title={strings.cardScreen.password_retrieval}
        showDropDown={true}
        description={strings.cardScreen.are_you_sure_you_want_to_retrieve}
        data={cardInfos}
        onSelect={(selectedItem, index) => {
          setSelectedCard(selectedItem);
          setSelectedCardIndex(index);
        }}
        selectedCard={selectedCard}
        selectedCardIndex={selectedCardIndex}
        onPressNo={() => {
          setPasswordModal(false);
        }}
        onPressYes={() => {
          onPasswordRetrievalClick();
        }}
      ></ManageModal>
      <ManageModal
        manageModalVisible={blockCardModal}
        onRequestClose={() => {
          setBlockCardModal(false);
        }}
        title={strings.cardScreen.block_report_lost_card}
        showDropDown={true}
        description={strings.cardScreen.you_you_sure_you_want_to_block}
        data={cardInfos}
        onSelect={(selectedItem, index) => {
          setSelectedCard(selectedItem);
          setSelectedCardIndex(index);
        }}
        selectedCard={selectedCard}
        selectedCardIndex={selectedCardIndex}
        onPressNo={() => {
          setBlockCardModal(false);
        }}
        onPressYes={() => {
          onCardLostClick();
        }}
      ></ManageModal>
      <ManageModal
        manageModalVisible={unblockCardModal}
        onRequestClose={() => {
          setUnblockCardModal(false);
        }}
        title={strings.cardScreen.unblock_card}
        showDropDown={true}
        description={strings.cardScreen.you_you_sure_you_want_to_unblock}
        data={cardInfos}
        onSelect={(selectedItem, index) => {
          setSelectedCard(selectedItem);
          setSelectedCardIndex(index);
        }}
        selectedCard={selectedCard}
        selectedCardIndex={selectedCardIndex}
        onPressNo={() => {
          setUnblockCardModal(false);
        }}
        onPressYes={() => {
          onUnblockCardClick();
        }}
      ></ManageModal>
      <ManageModal
        manageModalVisible={viewCardModal}
        onRequestClose={() => {
          setViewCardModal(false);
        }}
        title={strings.cardScreen.view_card_limit}
        showDropDown={false}
      >
        <View style={{ marginVertical: 10 }}>
          <RowView
            title={strings.cardScreen.maximum_card_load_limit_per_day}
            value={`€ ${cardFeesData?.topup_limit}`}
          />
          <RowView
            title={strings.cardScreen.maximum_card_balance_at_any_time}
            value={`€ ${cardFeesData?.load_limit}`}
          />
          <RowView
            title={strings.cardScreen.monthly_trx_limit}
            value={"€ 50000.0"}
          />
          <RowView
            title={strings.cardScreen.maximum_card_payment_limit_per_day}
            value={"€ 5000.0"}
          />
        </View>
      </ManageModal>
      <ManageModal
        manageModalVisible={viewAtmModal}
        onRequestClose={() => {
          setViewAtmModal(false);
        }}
        title={strings.cardScreen.view_atm_limit}
        showDropDown={false}
      >
        <View style={{ marginVertical: 10 }}>
          <RowView
            title={strings.cardScreen.daily_atm_limits}
            value={"€ 1000"}
          />
          <RowView
            title={strings.cardScreen.minimum_atm_withdrawal}
            value={"€ 10"}
          />
          <RowView
            title={strings.cardScreen.maximum_per_atm_trx}
            value={"€ 1000"}
          />
        </View>
      </ManageModal>
      {countryModalVisible && (
        <View style={styles.countryModalStyle}>
          <View style={{ flex: 1 }}>
            <View>
              <View style={styles.searchContainer}>
                <View
                  style={[
                    styles.searchView,
                    {
                      backgroundColor: ThemeManager.colors.SwapInput,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: ThemeManager.ImageIcons.icon_search_text }
                    }
                    style={styles.searchIcon}
                  />
                  <TextInput
                    value={searchData}
                    onChangeText={onSearch}
                    style={styles.searchInput}
                    placeholder={strings.currencyDetails.search}
                    placeholderTextColor={
                      ThemeManager.colors.placeholderTextColor
                    }
                  />
                </View>
                <View>
                  <TouchableOpacity
                    // style={{flex: 0.3}}
                    onPress={() => {
                      setCountryModalVisible(false);
                      setCountryData(countryFlags);
                      setModalCostVisible(true);
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
              <Text style={styles.locationName}>
                {strings.location.location}
              </Text>
              <BorderLine />
              <Text style={styles.countryStyle}>{selectedCountry}</Text>
              <Text style={styles.regionStyle}>
                {strings.location.countryRegion}
              </Text>
              <BorderLine />
              <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
                {countryData?.map(renderCountryList)}
                <View>
                  {countryData?.length == 0 && (
                    <Text style={styles.notFound}>Country not found</Text>
                  )}
                </View>
                <View style={{ height: 50 }}></View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </Wrap>
  );
};

export default CardsScreen;

const useStyles = (theme) =>
  StyleSheet.create({
    mainContainer: { flex: 1, marginTop: 20, marginHorizontal: 15 },
    moreText: { color: ThemeManager.colors.textColor, fontSize: 25 },
    classyText: {
      color: ThemeManager.colors.headerText,
      fontSize: 14,
      marginTop: 10,
    },
    bannerStyle: {
      width: "100%",
      height: 180,
      resizeMode: "cover",
      marginTop: 20,
      borderRadius: 6,
    },
    shippingText: {
      color: theme.colors.headerText,
      fontSize: 14,
      marginTop: 5,
    },
    addressViewStyle: {
      backgroundColor: theme.colors.tabBackground,
      padding: 15,
      marginVertical: 15,
      borderRadius: 6,
      minHeight: 150,
      marginHorizontal: 15,
    },
    headerView: { marginHorizontal: 15, marginVertical: 10, height: 45 },
    headerTextStyle: { fontSize: 16, fontFamily: Fonts.regular },
    topContainer: { justifyContent: "space-between", flex: 1 },
    subViewStyle: { marginHorizontal: 15, marginBottom: 10 },
    cautionViewStyle: {
      backgroundColor: theme.colors.tabBackground,
      padding: 10,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 6,
    },
    cautionImgStyle: { height: 15, width: 15, resizeMode: "contain" },
    cautionText: {
      fontFamily: Fonts.regular,
      color: theme.colors.headerText,
      fontSize: 12,
      marginLeft: 10,
    },
    cardImgStyle: {
      height: 190,
      width: "100%",
      resizeMode: "cover",
      borderRadius: 6,
    },
    recentView: {
      backgroundColor: theme.colors.tabBackground,
      padding: 10,
      marginTop: 10,
      // borderRadius: 6,
    },
    rowStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    recentText: {
      color: theme.colors.textColor,
      fontSize: 14,
      fontFamily: Fonts.regular,
    },
    dropdown3BtnChildStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    dropdown3BtnTxt: {
      textAlign: "center",
      fontSize: 14,
      marginHorizontal: 2,
    },

    dropdown3RowChildStyle: {
      flex: 1,

      justifyContent: "center",
      alignItems: "flex-start",

      paddingHorizontal: 15,
    },

    dropdown3RowTxt: {
      textAlign: "center",
      fontSize: 14,
      marginHorizontal: 12,
    },
    inputRow: {
      marginHorizontal: 16,
      marginTop: 20,
    },
    inputTitle: {
      marginBottom: 6,
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: theme.colors.dashboardItemTextColor,
      marginHorizontal: 16,
      marginTop: 20,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 20,
      marginHorizontal: 20,
    },
    searchView: {
      backgroundColor: theme.colors.inputColor,
      borderRadius: 20,
      height: 40,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      flex: 1,
    },
    errorMessageStyle: {
      fontSize: 15,
      color: "red",
      alignSelf: "center",
      margin: 10,
    },

    searchIcon: {
      height: 20,
      width: 20,
      resizeMode: "contain",
      padding: 5,
      marginHorizontal: 10,
    },
    cancelText: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: theme.colors.selectedTextColor,
      marginLeft: 10,
    },
    rejectContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    screenRejectStyle: { backgroundColor: "transparent" },
    rejectWrapStyle: { backgroundColor: "rgba(0,0,0,0.5)" },
    //manageView styles
    manageContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.tabBackground,
      flex: 1,
    },
    manageRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: 0,
    },
    manageIcon: {
      height: 25,
      width: 25,
      resizeMode: "contain",
      tintColor: theme.colors.textColor,
      marginRight: 10,
    },
    headerTextStyle: { color: theme.colors.headerText },
    manageModalContainer: {
      backgroundColor: "rgba(255,255,255,0.1)",
      flex: 1,
      justifyContent: "center",
    },
    flexOne: { flex: 1 },
    alignCenter: { justifyContent: "center", alignItems: "center" },
    spaceRow: {
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    titleStyle: {
      color: theme.colors.modalTitle,
      fontSize: 16,
      fontFamily: Fonts.regular,
      padding: 12,
    },
    closeButton: {
      height: 30,
      width: 30,
      justifyContent: "center",
      alignItems: "flex-end",
      marginRight: 10,
    },
    closeIcon: { height: 20, width: 20, resizeMode: "contain" },
    borderColor: { backgroundColor: ThemeManager.colors.borderColor },
    extraText: {
      color: theme.colors.modalTitle1,
      fontSize: 14,
      fontFamily: Fonts.light,
      margin: 15,
    },
    descriptionText: {
      color: theme.colors.modalTitle1,
      fontSize: 14,
      fontFamily: Fonts.light,
      textAlign: "center",
      margin: 10,
    },
    selectCardStyle: {
      justifyContent: "center",
      marginHorizontal: 15,
    },
    selectCardText: {
      color: theme.colors.textColor,
      fontSize: 15,
      fontFamily: Fonts.regular,
    },
    dropDownButtonStyle: {
      width: "100%",
      borderBottomRightRadius: 4,
      borderTopRightRadius: 4,
      height: 49,
      marginBottom: 10,
      backgroundColor: theme.colors.tabBackground,
    },
    dropdown3BtnTxtStyle: {
      color: theme.colors.textColor1,
      textTransform: "capitalize",
      fontFamily: Fonts.regular,
      marginLeft: 5,
    },
    dropdownIcon: {
      height: 15,
      width: 15,
      resizeMode: "contain",
      tintColor: theme.colors.textColor1,
      marginRight: 8,
    },
    tabBgColor: {
      backgroundColor: theme.colors.tabBackground,
    },
    customRow: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    rowViewStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
    },
    rowTitle: {
      color: theme.colors.textColor,
      fontSize: 13,
      fontFamily: Fonts.regular,
      maxWidth: "80%",
    },
    rowValue: {
      color: theme.colors.textColor,
      fontSize: 13,
      minWidth: "20%",
      textAlign: "right",
    },
    backgroundStyle: { backgroundColor: theme.colors.DashboardBG },
    notFound: {
      color: theme.colors.textColor,
      fontSize: 16,
      fontFamily: Fonts.medium,
      marginTop: 60,
      textAlign: "center",
    },
    regionStyle: {
      marginTop: 10,
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: theme.colors.inactiveTextColor,
      marginBottom: 5,
    },
    countryStyle: {
      marginTop: 15,
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: theme.colors.selectedTextColor,
    },
    locationName: {
      marginTop: 15,
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: theme.colors.inactiveTextColor,
      marginBottom: 5,
    },
    searchInput: {
      width: "80%",
      color: theme.colors.textColor,
      fontSize: 14,
      paddingHorizontal: 10,
      padding: 4,
      fontFamily: Fonts.regular,
    },
    countryModalStyle: {
      backgroundColor: theme.colors.modalBox,
      flex: 1,
      position: "absolute",
      zIndex: 1000,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    confirmButtonStyle: {
      height: 50,
      marginVertical: 20,
      marginRight: 10,

      backgroundColor: theme.colors.selectedTextColor,
      borderRadius: 4,
    },
    confirmText: {
      left: 10,
      color: theme.colors.headTxt,
      fontFamily: Fonts.regular,
      fontSize: 14,
      marginRight: 20,
      flex: 1,
    },
    nextBtnStyle: {
      height: 40,
      marginVertical: 20,
      width: "100%",
      backgroundColor: theme.colors.selectedTextColor,
      borderRadius: 4,
    },
    yourProfileStyle: {
      color: theme.colors.modalTitle1,
      fontSize: 14,
      fontFamily: Fonts.light,
      textAlign: "center",
      margin: 10,
    },
    congratsText: {
      color: theme.colors.modalTitle,
      fontSize: 16,
      fontFamily: Fonts.regular,
      marginTop: 15,
    },
    bindModal: {
      backgroundColor: "rgba(255,255,255,0.1)",
      flex: 1,
      justifyContent: "center",
    },
    bindContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    okButton: {
      height: 40,
      marginVertical: 20,
      width: "100%",
      backgroundColor: theme.colors.selectedTextColor,
      borderRadius: 4,
    },
    thankYouText: {
      color: theme.colors.modalTitle1,
      fontSize: 14,
      fontFamily: Fonts.light,
      textAlign: "center",
      margin: 10,
    },
    pendingText: {
      color: theme.colors.modalTitle,
      fontSize: 16,
      fontFamily: Fonts.regular,
    },
    pendingModal: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    pendingModalContainer: {
      backgroundColor: "rgba(255,255,255,0.1)",
      flex: 1,
      justifyContent: "center",
    },
    masterCardIcon: {
      height: 30,
      width: 40,
      resizeMode: "contain",
    },
    firstNameText: {
      fontFamily: Fonts.medium,
      fontSize: 16,
      color: "white",
      textTransform: "uppercase",
    },
    masterCardRow: {
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexDirection: "row",
      marginHorizontal: 20,
      position: "absolute",
      bottom: 10,
      width: "90%",
    },
    dateText: {
      fontFamily: Fonts.medium,
      fontSize: 12,
      color: "white",
    },
    validDate: {
      fontFamily: Fonts.regular,
      fontSize: 12,
      color: "white",
    },
    validView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 12,
    },
    cardNumberText: {
      fontFamily: Fonts.bold,
      fontSize: 17,
      color: "white",
      letterSpacing: 1.8,
    },
    balanceText: {
      fontSize: 20,
      fontFamily: Fonts.medium,
      color: colors.white,
      lineHeight: 26,
    },
    balanceLabel: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      color: colors.white,
    },
    logoStyle: {
      height: 30,
      width: 30,
      resizeMode: "contain",
    },
    logoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    cardSubView: {
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 13,
      flexDirection: "row",
    },
    horizontalMargin: {
      marginHorizontal: 20,
    },
    topUpIconStyle: {
      marginTop: -4,
      height: 18,
      width: 18,
      resizeMode: "contain",
      tintColor: theme.colors.headerText,
    },
    rowAlign: {
      flexDirection: "row",
      alignItems: "center",
    },
    rowCenter: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    itemStyle: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    spaceStyle: {
      color: theme.colors.headerText,
      textAlign: "center",
      // marginLeft: 10,
      fontSize: 18,
      marginTop: 2,
    },
  });
