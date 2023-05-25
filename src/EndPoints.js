import React from "react";
import Config from "react-native-config";
import Singleton from "./Singleton";
let address = Singleton.getInstance().methodAddress();
const PRODUCTION = false;
// let MAIN_URL = PRODUCTION
//   ? "www.xchangemonster.com"
//   : "exchange.stage-evoeuro.com"; //Prod url
// let MAIN_URL = PRODUCTION ? Config.API_URL : Config.API_URL; //Prod url
// console.log("JSON.stringify(address)-0-0-0->.", JSON.stringify(address));
// console.log(
//   "JSON.stringify(address)-0-0-0->11.",
//   address.toString().replace(/\n/g, "")
// );

// let url = 'exchange2.stage-evoeuro.com';
// let MAIN_URL = url; //Prod url
// let MAIN_GRAPH_URL = 'https://stage-evoeurope.s3.us-east-2.amazonaws.com';
// let MAIN_IMAGE_URL = 'https://stage-evoeurope.s3.us-east-2.amazonaws.com';

let addressImage = Singleton.getInstance().methodImageAddress();
// console.log(
//   "JSON.stringify(addressImage)-0-0-0->11.",
//   addressImage.toString().replace(/\n/g, "")
// );
// let MAIN_URL = PRODUCTION
//   ? address.toString().replace(/\n/g, "")
//   : address.toString().replace(/\n/g, ""); //Prod url
// let MAIN_URL = PRODUCTION ? address : address; //Prod url


// let MAIN_URL = "exchange2.stage-evoeuro.com";
let MAIN_URL = "stage-exchange.turkex.com";

let MAIN_GRAPH_URL = "https://stage-turkex-exchange.s3.ap-southeast-1.amazonaws.com";//"https://evos3.stage-evoeuro.com";
let MAIN_IMAGE_URL = "https://stage-exchange.s3.ap-southeast-1.amazonaws.com";//"https://evos3.stage-evoeuro.com";
// let MAIN_IMAGE_URL = "https://evos3.stage-evoeuro.com";


// console.log("MAIN_IMAGE_URL=-=-=-=-=-=>>>", MAIN_IMAGE_URL);
const END_POINT = {
  CURRENT_BUILD_VERSION_ANDROID: "1.7",
  CURRENT_BUILD_VERSION_IOS: "1.3",

  CAPTCHA_KEY: PRODUCTION,
  // IMAGE_BASE_URL: 'https://s2.staging-host.com/mobile_apps/CoinCult/',
  // GOONEY_API_KEY: 'aD4rMQsfmjQEXRe2u99H', //stage
  GOONEY_API_KEY: PRODUCTION ? "KaFkeFjnkJbp2PMRQUHG" : "uvZNG5Wx4lDcfOHuPc8x", //Production
  GRAPH_URL: PRODUCTION //light
    ? MAIN_GRAPH_URL + "/trading4/main.html?market="
    : MAIN_GRAPH_URL + "/trading4/main.html?market=",

  GRAPH_URL_DARK: PRODUCTION
    ? MAIN_GRAPH_URL + "/trading2/main.html?market="
    : MAIN_GRAPH_URL + "/trading2/main.html?market=",
  // GOONEY_API_KEY: 'XMKaFkeFjnkJbp2PMRQUHG', //stage
  // IMAGE_BASE_URL: 'https://stage-exchange-monster.s3.us-east-2.amazonaws.com/',//stage
  IMAGE_BASE_URL: PRODUCTION
    ? "https://prod-exchange-monster.s3.us-west-1.amazonaws.com/"
    : "https://stage-exchange-monster.s3.us-east-2.amazonaws.com/", //production
  // https://stage-exchange-monster.s3.us-east-2.amazonaws.com
  MAIN_IMAGE_BASE_URL: MAIN_IMAGE_URL + "/images/",//"/mobile_icons_stage/",
  // COMMON_URL: 'https://exchange.coincult.io',
  COMMON_URL: `https://${MAIN_URL}`,
  LOCAL_URL: "http://10.1.5.161:3001/api/v2/",
  //  stage-exchange.xchangemonster.com

  // BASE_URL: 'https://exchange.coincult.io' + '/api/v2',
  BASE_URL: `https://${MAIN_URL}/api/v2`,
  LOGIN_API_FIRST: "/barong/identity",
  GET_APP_VERSION: "/barong/public/mobile_version",
  REGISTER_USER_API_POST: "/barong/identity/users",
  LOGIN_USER_API_POST: "/barong/identity/sessions",
  CHANGE_PASSWORD_API_POST: "barong/resource/users/password",
  GET_USER_ME: "/barong/resource/users/me",
  GENERATE_CODE_API_POST: "/barong/identity/users/email/generate_code",

  FORGOT_PASSWORD_API_POST: "/barong/identity/users/password/generate_code",
  RESEND_REGISTER_PHONE_OTP: "/barong/identity/users/send_otp/phone",
  RESEND_REGISTER_EMAIL_OTP: "/barong/identity/users/send_otp/email",
  GET_TRADE_ORDER_API: "/peatio/market/orders",
  // MARKET_DATA_URL_PRIVATE:
  //   'wss://stage-exchange.xchangemonster.com/api/v2/ranger/public/?stream=',
  MARKET_DATA_URL_PRIVATE: `wss://${MAIN_URL}/api/v2/ranger/public/?stream=`,
  GET_USER_ALL_BALANCE: "/peatio/account/balances",
  GET_ACTIVE_COIN_LIST: "/peatio/public/currencies",
  GET_COIN_BALANCE_LIST: "/peatio/account/balances",
  SINGLE_CRYPTO_CONVERSION: "/peatio/currency/conversation",
  MULTI_COIN_CONVERSION: "/peatio/public/currency/multi-conversion",

  GET_ACTIVE_COIN_PAIRS_LIST: "/buysell/trading/getPairs/",

  MARKET_DATA_URL: `wss://${MAIN_URL}/api/v2/ranger/public/?stream=`,
  FAV_PAIR_DATA_URL: `wss://${MAIN_URL}/api/v2/ranger/private/?stream=`,

  GET_MARKET_LIST: "/peatio/public/markets",
  PLACE_TRADE_ORDER_API_POST: "/peatio/market/orders",
  GET_USER_ACCOUNT_BAL: "/peatio/account/balances/",
  GET_DEPOSIT_LIST_API: "/peatio/account/deposits",
  CANCEL_ORDER_API: "/peatio/market/orders/",
  CANCEL_ALL_ORDER: "/peatio/market/orders/cancel",
  GET_TRADE_HISTORY: "/peatio/market/trades",
  GET_ALL_TRANS_API: "/peatio/account/transactions",
  ORDER_CANCEL_API: "/market/orders/{id}/cancel",
  SWAP_COIN_LIST: "/peatio/account/amount_quote",

  // GET_TRADE_ORDER_API: '/peatio/market/orders',

  GET_CURRENT_TUX_PRICE: "/peatio/public/current_price",
  GET_MY_USDT_BALANCE: "/peatio/account/balances/usdt",
  BUY_TUX_FROM_USD: "/peatio/account/adjustments?",
  TRADING_RULE: "/peatio/public/trading_fees",
  POST_SWAP_URL: "/peatio/account/adjustments",
  GET_COIN_ADDRESS: "/peatio/account/deposit_address/",
  GOOGLE_AUTH_DETAILS_API_POST: "/barong/resource/otp/generate_qrcode",
  WITHDRAWAL_LIMIT_URL: "/peatio/account/check_withdraw_limit",
  WITHDRAW_API_POST: "/peatio/account/withdraws",
  GET_ALL_BENIFICIARY_LIST: "/peatio/account/beneficiaries",
  ADD_BENIFICIARY_DETAILS_POST: "/peatio/account/beneficiaries",
  GET_PUBLIC_TRADE_API: "/peatio/public/markets/btcusdt/trades",
  DELETE_BENIFICIARY_API: "/peatio/account/beneficiaries/",
  ACTIVATE_BENIFICIARY_API_PATCH: "/peatio/account/beneficiaries/",

  //peatio/account/deposit_address/btc?phone_no=
  WITHDRAW_VALIDATE_API_POST: "/withdraw_request_validation",
  WITHDRAW_SUBMIT_API_POST: "/peatio/account/withdraws/",

  RESEND_OTP_API_POST: "/barong/resource/phones/send_code",
  SEND_OTP_API_POST: "/barong/resource/phones/",
  VERIFY_OTP_API_POST: "/barong/resource/phones/verify",
  GET_USER_PHONES_API: "/barong/resource/phones",

  CREATE_USER_PROFILE_POST: "/barong/resource/profiles",
  GET_SUM_SUB_TOKEN: "/barong/resource/sumsub/token",
  // GET_USER_ME: '/barong/resource/users/me',
  UPLOAD_DOC_FILE_API: "/barong/resource/documents",
  // GET_SUM_SUB_TOKEN: '/barong/resource/sumsub/token',

  GOOGLE_AUTH_ENABLE_API_POST: "/barong/resource/otp/enable",
  GOOGLE_AUTH_DISABLE_API_POST: "/barong/resource/otp/disable",
  RESEND_BENEFICIARY_PIN_CODE: "/peatio/account/beneficiaries/",
  CONVERSION_RATE_POST: "/peatio/account/gooney/conversion",
  POST_PAYMENT_GATEWAY_TOKEN: "https://gateway.gooney.com/integrated/tokenize/",
  TRANSACTION_BUY_SELL: "/peatio/account/gooney/transaction",
  TRANSACTION_CALLBACK: "/peatio/account/gooney/callback",
  GET_REFRAL_FRIENDLIST_API: "/peatio/account/referred_members?uid=",
  GET_REFRAL_REAWARD_HISTORY: "/peatio/account/trade_rewards?uid=",
  GET_REFRAL_REAWARD_API: "/peatio/account/currency_based_rewards?uid=",
  SEND_REWARDS: "/peatio/account/send_rewards",
  REFRESH_SESSION: "/barong/identity/sessions/refresh",
  DELETE_USER_DEVICE_TOKEN: "/barong/identity/sessions/devises",
  // GET_USER_NOTIFICATION: '/barong/resource/fcm/fcm_listing',
  GET_USER_NOTIFICATION: "/peatio/account/notifications",
  // TRANSACTION_LIST_BUY_SELL:'/peatio/account/gooney/transactions'
  GET_BANK_ACCOUNT_LIST: "/peatio/account/iban_accounts",
  DEPOSIT_BY_BANK_CARD: "/peatio/account/fiats/deposits",
  FIAT_TRANSACTION_CALLBACK: "/peatio/account/fiats/callback",
  GOONEY_DETAILS_API: "/peatio/account/fiats/gooney_details",

  /******************************* KYC PAGE******************** */
  GET_SUMSUB_TOKEN: "/barong/resource/sumsub/token",
  SUMSUB_WEB_URL: `https://${MAIN_URL}/verification/`,

  //withdraw fiat beneficiary
  WITHDRAW_FIAT_BENEFICIARY:
    "/peatio/account/beneficiaries/fiats/payees?currency=",
  ADD_WITHDRAW_PAYEE: "/peatio/account/beneficiaries/fiats/payees",
  WITHDRAW_LIMIT_EXCEED: "/peatio/account/check_withdraw_limit?currency=",
  WITHDRAW_FIAT_CURRENCY: "/peatio/account/fiats/withdraws",
  WITHDRAW_FIAT_CALLBACK: "/peatio/account/fiats/withdraw/callback",
  FUNDS_LIMIT: "/peatio/account/funds/info",
  GET_BANXA_SUPPORTED_COUNTRIES:
    "/peatio/account/banxa/supported-currencies?trans_type=",
  GET_BANXA_PRICE_CONVERSION:
    "/peatio/account/banxa/price-conversation?source=",
  GET_BANXA_PAYMENT_METHODS: "/peatio/account/banxa/payment-methods?source=",
  BUY_SELL_ORDER_BANXA: "/peatio/account/banxa/create-order",
  POST_BANXA_CALLBACK: "/peatio/account/banxa/callback",

  BANXA_ALL_ORDERS: "/peatio/account/banxa/orders?start_date=",
  SELL_ORDER_CONFIRM: "/peatio/account/banxa/order/confirm",
  SUPPORTED_BLOCKCHAIN_NETWORK: "/peatio/account/banxa/blockchains/",
  SINGLE_BANXA_ORDER_DETAILS: "/peatio/account/banxa/orders/",
  MAINTENANCE_SCREEN_URL: "/peatio/public/application_status",
  DELETE_USER_ACCOUNT_URL: "/barong/identity/users",
  REGISTER_SUM_SUB_ID: "/barong/resource/sumsub/applicant_id",

  //PAYTEND api
  CARD_HOLDER_DETAILS_URL: "/peatio/account/cardholder_details",
  CARD_HOLDER_URL: "/peatio/account/cardholder",
  CHECK_DOCUMENT_URL: "/peatio/account/cardholder/check_document",
  UPLOAD_DOCUMENT_USER_URL: "/peatio/account/upload_document",
  UPLOAD_DOCUMENT_PAYTEND_URL: "/peatio/account/cardholder_document",
  CARD_APPLY_URL: "/peatio/account/card_apply",
  CARD_BIND_URL: "/peatio/account/card_activate",
  CARD_ACTIVATE_URL: "/peatio/account/verify",
  CURRENCY_CONVERSION_URL: "/peatio/account/price/conversion",
  CARD_TOPUP_URL: "/peatio/account/card_topup",
  CARD_BALANCE_URL: "/peatio/account/card_audit",
  REPLACE_CARD_URL: "/peatio/account/replace_card",
  REPORT_CARD_URL: "/peatio/account/report/card_loss",
  REMOVE_CARD_URL: "/peatio/account/remove/card_loss",
  LIST_CARD_URL: "/peatio/account/cards",
  // CARD_TRANSACTION_URL: "/peatio/account/cards",
  CARD_TRANSACTION_URL: "/peatio/account/card_transaction",

  CARD_FEE_URL: "/peatio/account/card_fee",
  CARD_COST_URL: "/peatio/account/card_cost",
  TOP_UP_TRX_LIST_URL: "/peatio/account/list/topup_transactions",
  PASSWORD_RETRIEVAL: "/peatio/account/password/retrieval",
  NOTIFICATION_READ_URL: "/peatio/account/notifications/action",
  SINGLE_WITHDRAW_API_POST: "/peatio/account/withdraw/",
  SINGLE_DEPOSIT_API_POST: "/peatio/account/deposit/",
  SINGLE_TRADE_API_POST: "/peatio/market/orders/",
  GET_FAV_MARKETS_URL: "/peatio/account/fav_market/list",
  UPDATE_FAV_MARKETS_URL: "/peatio/account/fav_market",
  WITHDRAW_OTP_URL: "/peatio/account/withdraw_otp",
  WITHDRAW_OTP_EXPIRE_URL: "/peatio/account/otp/reset",
  //edit phone number
  EDIT_PHONE_NUMBER_URL: "/barong/identity/users/edit/phone_number?email=",
  // GET_BANXA_SUPPORTED_COUNTRIES:
  //   'account/banxa/supported-currencies?trans_type=',
  // GET_BANXA_PRICE_CONVERSION: 'account/banxa/price-conversation?source=',
  // GET_BANXA_PAYMENT_METHODS: 'account/banxa/payment-methods?source=',
  // BUY_SELL_ORDER_BANXA: 'account/banxa/create-order',
  // POST_BANXA_CALLBACK: 'account/banxa/callback',

  // BANXA_ALL_ORDERS: 'account/banxa/orders?start_date=',
  // SELL_ORDER_CONFIRM: 'account/banxa/order/confirm',
  // SUPPORTED_BLOCKCHAIN_NETWORK: 'account/banxa/blockchains/',
  // SINGLE_BANXA_ORDER_DETAILS: 'account/banxa/orders/',

  CHANGE_PHONE_NUMBER: "/barong/identity/users/edit/phone_number?",
};
export default END_POINT;
