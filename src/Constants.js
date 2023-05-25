import END_POINT from "./EndPoints";

export const APP_NAME = "EVO Europe";
export const APP_NAME_CAPS = "EVO EUROPE";

export const STATUS_BAR_COLOR = "status_bar_color";
export const WANT_TO_UPDATE_APP = "Do you want to Update App?";
export const COUNTRY_NAME = "country_name";
export const SET_LANGUAGE = "set_language";
// siteKey: "6LdPlOEZAAAAAM3RXZzNoKjbBau8UFOa-ZTknEPt"
//   secretKey: "6LdPlOEZAAAAAEAREQz7f8O58cZCs5xSECfGcJCj"
// export const RECAPTCHA_KEY = '6LfuJHQeAAAAAH3uOOdg_pdK9BQVKyGz-LG1Y7bI';
// export const RECAPTCHA_KEY = '6Lf2a8YeAAAAAKB67szNRzaMtCznuaJe4WX71QTe'; //staging
// 6Lf6EpcjAAAAAEz6m1CYlarZvRMGiQ4Iwffw6Nf7 ant evo

//exchange2  : "6LfrxYMjAAAAAJU4TVICrsEbmTf9h-rB-Y9wkncj"; //stage
export const RECAPTCHA_KEY = END_POINT.CAPTCHA_KEY
  ? "6Lcv06ofAAAAACTx2LCxZ-O5NHuYYXgMUzkr-GdY" //Prod
  : "6Le64Q0mAAAAABI-D8qYY8f5fEFbK_adC1PV0dB1"; //stage BARONG_RECAPTCHA_SITE_KEY

// : "6LfIob4iAAAAAAARwEZgnJEFP5n-O5ZR_CYXhBHK"; //stage

// ERROR MESSAGES
export const VALID_EMAIL = "Please enter a valid email address";
export const VALID_PASSWORD =
  "Password should have one uppercase, one lowercase, one number, one special character, minimum 8 characters";
export const VALID_OLD_PASSWORD = "Please enter your valid old password.";
export const VALID_NEW_PASSWORD =
  "Please enter new password and should have one uppercase, one lowercase, one number, one special character, minimum 8 characters";
export const VALID_NEW_CON_PASSWORD =
  "Please enter re-enter new password and should have one uppercase, one lowercase, one number, one special character, minimum 8 characters";
export const VALID_MISMATCH_PASSWORD =
  "New entered password & re-entered password are not same.";
export const VALID_FIRST_NAME = "Please Enter first name.";
export const CHECK_TERMS = "Please agree terms & condtions before sign up";
export const VALID_LAST_NAME = "Please Enter last name.";
export const VALID_GENDER = "Please select your gender.";
export const VALID_DOB = "Please enter your date of birth.";
export const VALID_COUNTRY = "Please select your country.";
export const VALID_CITY = "Please enter your city.";
export const VALID_ZIP_CODE = "Please enter your zip code.";
export const VALID_ADDRESS_DETAIL = "Please enter your address.";
export const VALID_PHONE_CODE = "Please select your Country code.";
export const VALID_PHONE_NO = "Please enter a valid Phone number.";
export const VALID_OTP_CODE = "Please enter OTP";
export const VALID_PASSPORT_NO = "Please enter a valid passport number.";
export const VALID_DRIVING_LIS_NO =
  "Please enter a valid driver license number.";
export const VALID_NATIONAL_ID_NO = "Please enter a valid National ID number.";
export const VALID_PASSPORT_EXPIRY_DATE =
  "Please enter a valid expiry date of your document.";
export const VALID_PASSPORT_SELFIE = "Please select your selfie.";
export const VALID_GOOGLE_AUTH_CODE =
  "Please enter a valid Google Authenticator code.";

export const VALID_ACCOUNT_NO = "Please enter a valid account number.";
export const VALID_ACCOUNT_TYPE = "Please enter a valid account type.";
export const VALID_BANK_NAME = "Please enter a valid bank name.";
export const VALID_BRANCH_NAME = "Please enter a valid branch name.";
export const VALID_BRANCH_CODE = "Please enter a valid branch code.";
export const VALID_SWIFT_CODE = "Please enter a valid swift code.";

export const VALID_BENI_NAME = "Please enter a valid beneficiary name.";
export const VALID_BENI_ADDRESS = "Please enter a valid beneficiary address.";
export const ENTER_BENI_NAME = "Please enter a beneficiary name.";
export const ENTER_BENI_ADDRESS = "Please enter a beneficiary address.";
export const VALID_FIRST_NAME_LENGTH =
  "First name must have minimum 2 and maximum 20 characters.";
export const VALID_LAST_NAME_LENGTH =
  "Last name must have minimum 2 and maximum 20 characters.";

export const FIELDS_MANDATORY = "All fields are mandatory";
export const ENTER_NAME = "Name is a required Field.";
export const ENTER_NAME_MORE = "Minimum 2 Character are required in name.";
export const ENTER_SUBJECT = "Subject is a required Field.";
export const ENTER_SUBJECT_MORE =
  "Minimum 5 character are required in subject.";
export const ENTER_MESSAGE = "Message is a required Field.";
export const ENTER_MESSAGE_MORE =
  "Minimum 5 character are required in message.";
export const ENTER_EMAIL = "Email Address is a required Field.";

// AsyncStorageKeys
export const ACCESS_TOKEN = "access_token";
export const LOGIN_TIME = "LOGIN_TIME";
export const CHECK_TIME = "CHECK_TIME";

export const SAVED_COOKIES = "saved_cookies";
export const KYC_ID = "kyc_id";
export const USER_DATA = "userdata";
export const TIME_INTERVAL = "time_interval";
export const TIME_STAMP = "time_stamp";

export const HIDE_ZERO_BALANCE = "hideZero";

export const IS_LOGIN = "is_login";
export const IS_THEME_ENABLE = "theme_enabled";
export const CURRENT_THEME_MODE = "current_mode";

export const VERIFY_INFO_STEP = "verify_info_step";
export const PHONE_VERIFY_STEP = "phone_verify_step";
export const SELECT_DOC_STEP = "select_doc_step";
export const DOC_DETAILS_STEP = "doc_details_step";
export const SELFIE_STEP = "selfie_step";
export const FILE_DOC_STEP = "fileDoc_step";

export const LOGIN_CREDENTIALS = "login_credentials";
export const LOCATION_DATA = "location_data";
export const CRYPTO_DECIMAL_ROUNDOFF = 5;
export const BALANCE_ROUNDOFF = 6;
export const NOTIFICATION_RECORD_NUMBER = "notification_record_number";
export let ALPHABET_REGEX = /\d+$/;
export let ALPHABET_HYPEN_REGEX = /^[a-zA-Z]*\-?[a-zA-Z]*$/;
export let NAME_REGEX = /^[a-zA-Z ]*$/;
export let RemoveDecimal = /\..*$/;

export let CITY_REGEX = /^[ A-Za-z0-9_@./#&+-]*$/;
export let NUMBER_REGEX = /^\d*$/;
export let NUMBER_ONLY_REGEX = /^[0-9]*$/;
export let ACCOUNT_NUMBER_REGEX = /^[0-9]{0,18}$/;
export let ACCOUNT_NUMBER_CARD_REGEX = /^[\d ]*$/;
export let SUBJECT_REGEX = /^([a-zA-Z0-9_-]){0,3}$/;
export let DECIMAL_REGEX = /^\d+(\.\d{1,5})?$/;
export let ONE_DECIMAL_REGEX = /^\d*\.?\d*$/;
export let TWO_DECIMAL_REGEX = /^\d*\.?\d{0,2}$/;
export let THREE_DECIMAL_REGEX = /^\d*\.?\d{0,3}$/;
export let FIVE_DECIMAL_REGEX = /^\d*\.?\d{0,4}$/;
export let EIGHT_DECIMAL_REGEX = /^\d*\.?\d{0,8}$/;
export let TEN_DECIMAL_REGEX = /^\d*\.?\d{0,10}$/;

export let ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]*$/;
export let ALPHANUMERIC_SPACE_REGEX = /^[a-zA-Z0-9 ]*$/;
export let ALPHABET_SPACE_REGEX = /^[a-zA-Z ]*$/;
export let NUMBER_START_DOT_OR_NOT_ZERO = /^[1-9.][0-9]*$/;
export let SPACE_REGEX = /[^-\s]/;
export let NO_SPACE = /^\S+$/;
export let NO_NUMBER_REGEX = /^([^0-9]*)$/;
export let NO_ZERO_AT_START_NUMBER_REGEX = /^(?!0.)\d+$/;
export let USERNAME_REGEX = /^[a-zA-Z0-9_-]*$/;
export let STRING_WITHOUT_SPECIAL_CHARACTER = /^[A-Za-z0-9]{0,50}$/;
export const EMAIL_REGEX_ONE =
  /^\w+([\.-\.+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const INVITE_TEXT =
  "I use Evo Europe and love it! Their latest unique feature helps crypto investors. Use my referral code during signup to get rewards ";
export const ANDROID_PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.xchangemonster=en_IN";
export const REFRESH_TOKEN = "refresh_token";
export const EXPIRE_TIME = "expire_time";
export const EXACT_EXPIRE_TIME = "exact_expire_time";
export const NO_NETWORK = "Please check your network connection.";
export const PAYTEND_ID_TYPE = "paytend_id_type";
export const EEA_COUNTRY = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LI",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
];
export const statusTypoObj = {
  // TRANSACTION_TYPE
  1: "Success",
  2: "Reversal",
  3: "Reversed",
  6: "Cancelled",
  7: "Cancel",
  10: "Refund",

  // TRANSACTION_STATUS
  150: "Pre-authorization",
  151: "Payment",
  100: "Top-up",
  110: "Withdrawal",
  120: "Transfer-In",
  121: "Transfer-Out",
  200: "Settlement adjustment",
  500: "Fee",
};
