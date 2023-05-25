import {combineReducers} from 'redux';
import {createStore, applyMiddleware} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReduxThunk from 'redux-thunk';
import {LOGOUT} from '../Actions/types';
import RegisterReducer from './RegisterReducer';
import AuthReducer from './AuthReducer';
import ForgotPasswordReducer from './ForgotPasswordReducer';
import MarketSocketReducer from './MarketSocketReducer';
import FundsReducer from './FundsReducer';
import GetActiveCoinReducer from './GetActiveCoinReducer';
import TradeReducer from './TradeReducer';
import WithdrawalDetailReducer from './WithdrawalDetailReducer';
import OrderHistoryReducer from './OrderHistoryReducer';
import ChangePasswordReducer from './ChangePasswordReducer';
import BuyTuxReducer from './BuyTuxReducer';
import SwapCurrencyReducer from './SwapCurrencyReducer';
import DepositListReducer from './DepositListReducer';
import SwapReducer from './SwapReducer';
import BenificiaryeReducer from './BenificiaryeReducer';
import WithdrawalSubmitReducer from './WithdrawalSubmitReducer';
import MobileVerifyReducer from './MobileVerifyReducer';
import KycFirstReducer from './KycFirstReducer';
import QrCodeReducer from './QrCodeReducer';
import GoogleValidateReducer from './GoogleValidateReducer';
import GoogleDisableReducer from './GoogleDisableReducer';
import BuySellReducer from './BuySellReducer';
import PaymentGatewayReducer from './PaymentGatewayReducer';
import TransactionBuySellReducer from './TransactionBuySellReducer';
import TransactionCallbackReducer from './TransactionCallbackReducer';
import RefralReducer from './RefralReducer';
import AccountReducer from './AccountReducer';
import BankListReducer from './BankListReducer';
import AddBankCardReducer from './AddBankCardReducer';
import DeleteBankAccountReducer from './DeleteBankAccountReducer';
import FiatDepositReducer from './FiatDepositReducer';
import FiatTrxCallbackReducer from './FiatTrxCallbackReducer';
import GooneyDetailsReducer from './GooneyDetailsReducer';
import WithdrawListReducer from './WithdrawListReducer';
import WithdrawFiatBeneficiaryReducer from './WithdrawFiatBeneficiaryReducer';
import WithdrawLimitCheckReducer from './WithdrawLimitCheckReducer';
import WithdrawFiatCurrencyReducer from './WithdrawFiatCurrencyReducer';
import FiatTrxWithdrawCallbackReducer from './FiatTrxWithdrawCallbackReducer';
import {persistStore, persistReducer} from 'redux-persist';
import FundsLimitReducer from './FundsLimitReducer';
import BanxaSupportedCurrenciesReducer from './BanxaSupportedCurrenciesReducer';
import BanxaPriceConversionReducer from './BanxaPriceConversionReducer';
import BanxaPaymentMethodReducer from './BanxaPaymentMethodReducer';
import BanxaSupportedCurrenciesSellReducer from './BanxaSupportedCurrenciesSellReducer';
import BanxaPriceConversionSellReducer from './BanxaPriceConversionSellReducer';
import BanxaBuyCryptoReducer from './BanxaBuyCryptoReducer';
import BanxaBuyCallbackReducer from './BanxaBuyCallbackReducer';
import BanxaSupportNetworkReducer from './BanxaSupportNetworkReducer';
import BanxaAllOrderReducer from './BanxaAllOrderReducer';
import BanxaSellConfirmReducer from './BanxaSellConfirmReducer';
import BanxaSingleOrderReducer from './BanxaSingleOrderReducer';
import CardHolderDetailsReducer from './CardHolderDetailsReducer';
import CreateCardHolderReducer from './CreateCardHolderReducer';
import CardCheckDocumentReducer from './CardCheckDocumentReducer';
import UploadDocsUserSideReducer from './UploadDocsUserSideReducer';
import CardApplyPaytendReducer from './CardApplyPaytendReducer';
import UploadDocsPaytendSideReducer from './UploadDocsPaytendSideReducer';
import CardBindReducer from './CardBindReducer';
import CardActivatePaytendReducer from './CardActivatePaytendReducer';
import CardTopupReducer from './CardTopupReducer';
import CardPaytendBalanceReducer from './CardPaytendBalanceReducer';
import CardReplaceReducer from './CardReplaceReducer';
import CardLossReportReducer from './CardLossReportReducer';
import CardRemoveReducer from './CardRemoveReducer';
import CardListReducer from './CardListReducer';
import CardTransactionReducer from './CardTransactionReducer';
import CardFeesReducer from './CardFeesReducer';
import CardTopUpTrxListReducer from './CardTopUpTrxListReducer';
import CardPasswordRetrievalReducer from './CardPasswordRetrievalReducer';
import CurrencyConversionPaytendReducer from './CurrencyConversionPaytendReducer';
import CardCostReducer from './CardCostReducer';
import GetActiveSwapReducer from './GetActiveSwapReducer';
import NotificationReadReducer from './NotificationReadReducer';
import GetFavMarketReducers from './GetFavMarketReducers';

// import OpenOrderHistoryReducer from './OpenOrderHistoryReducer';
const appReducer = combineReducers({
  RegisterReducer: RegisterReducer,
  AuthReducer: AuthReducer,
  ForgotPasswordReducer: ForgotPasswordReducer,
  marketSocketReducer: MarketSocketReducer,
  FundsReducer: FundsReducer,
  activeCoin: GetActiveCoinReducer,
  tradeReducer: TradeReducer,
  withDetails: WithdrawalDetailReducer,
  orderHistoryReducer: OrderHistoryReducer,
  changePass: ChangePasswordReducer,
  buxTuxReducer: BuyTuxReducer,
  swapCurrencyReducer: SwapCurrencyReducer,
  depositListReducer: DepositListReducer,
  swapReducer: SwapReducer,
  benificiaryReducer: BenificiaryeReducer,
  withdrawSubmit: WithdrawalSubmitReducer,
  MobileVerifyReducer: MobileVerifyReducer,
  kycFirst: KycFirstReducer,
  qrCodeRed: QrCodeReducer,
  googleValidate: GoogleValidateReducer,
  GoogleDisableReducer: GoogleDisableReducer,
  buySellReducer: BuySellReducer,
  paymentGatewayReducer: PaymentGatewayReducer,
  transactionBuySellReducer: TransactionBuySellReducer,
  transactionCallbackReducer: TransactionCallbackReducer,
  RefralReducer: RefralReducer,
  accountRed: AccountReducer,
  bankListReducer: BankListReducer,
  addBankCardReducer: AddBankCardReducer,
  deleteBankAccountReducer: DeleteBankAccountReducer,
  fiatDepositReducer: FiatDepositReducer,
  fiatTrxCallbackReducer: FiatTrxCallbackReducer,
  gooneyDetailsReducer: GooneyDetailsReducer,
  withdrawListReducer: WithdrawListReducer,
  withdrawFiatBeneficiaryReducer: WithdrawFiatBeneficiaryReducer,
  withdrawLimitCheckReducer: WithdrawLimitCheckReducer,
  withdrawFiatCurrencyReducer: WithdrawFiatCurrencyReducer,
  fiatTrxWithdrawCallbackReducer: FiatTrxWithdrawCallbackReducer,
  fundsLimitReducer: FundsLimitReducer,
  banxaSupportedCurrenciesReducer: BanxaSupportedCurrenciesReducer,
  banxaPriceConversionReducer: BanxaPriceConversionReducer,
  banxaPaymentMethodReducer: BanxaPaymentMethodReducer,
  banxaSupportedCurrenciesSellReducer: BanxaSupportedCurrenciesSellReducer,
  banxaPriceConversionSellReducer: BanxaPriceConversionSellReducer,
  banxaBuyCryptoReducer: BanxaBuyCryptoReducer,
  banxaBuyCallbackReducer: BanxaBuyCallbackReducer,
  banxaSupportNetworkReducer: BanxaSupportNetworkReducer,
  banxaAllOrderReducer: BanxaAllOrderReducer,
  banxaSellConfirmReducer: BanxaSellConfirmReducer,
  banxaSingleOrderReducer: BanxaSingleOrderReducer,

  //paytend reducers
  cardHolderDetailsReducer: CardHolderDetailsReducer,
  createCardHolderReducer: CreateCardHolderReducer,
  cardCheckDocumentReducer: CardCheckDocumentReducer,
  uploadDocsUserSideReducer: UploadDocsUserSideReducer,
  uploadDocsPaytendSideReducer: UploadDocsPaytendSideReducer,
  cardApplyPaytendReducer: CardApplyPaytendReducer,
  cardBindReducer: CardBindReducer,
  cardActivatePaytendReducer: CardActivatePaytendReducer,
  cardTopupReducer: CardTopupReducer,
  cardPaytendBalanceReducer: CardPaytendBalanceReducer,
  cardReplaceReducer: CardReplaceReducer,
  cardLossReportReducer: CardLossReportReducer,
  cardRemoveReducer: CardRemoveReducer,
  cardListReducer: CardListReducer,
  cardTransactionReducer: CardTransactionReducer,
  cardFeesReducer: CardFeesReducer,
  cardTopUpTrxListReducer: CardTopUpTrxListReducer,
  cardPasswordRetrievalReducer: CardPasswordRetrievalReducer,
  currencyConversionPaytendReducer: CurrencyConversionPaytendReducer,
  cardCostReducer: CardCostReducer,
  getActiveSwapReducer: GetActiveSwapReducer,
  notificationReadReducer: NotificationReadReducer,
  getFavMarketReducers: GetFavMarketReducers,
  // openOrderHistoryReducer: OpenOrderHistoryReducer,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'marketSocketReducer',
    'FundsReducer',
    'activeCoin',
    'withDetails',
    'benificiaryReducer',
    'fundsLimitReducer',
    'depositListReducer',
  ],
};
const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

// export const store = createStore(rootReducer, {}, applyMiddleware(ReduxThunk));
export const persistedReducer = persistReducer(persistConfig, rootReducer);
// export default persistedReducer = persistReducer(persistConfig, rootReducer);
