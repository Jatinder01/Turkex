import END_POINT from '../EndPoints';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);

  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getMarketFromURL() {
  const regex = new RegExp('[\\?&]market=([^&#]*)');
  const results = regex.exec(location.search);

  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function initOnReady() {
  window.tvWidget = new TradingView.widget({
    symbol: getMarketFromURL() || 'ethbtc',
    // BEWARE: no trailing slash is expected in feed URL
    // tslint:disable-next-line:no-any
    // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
    //   'https://prod.xchangemonster.comm/api/v2/peatio/public/markets',
    // ),
    datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
      `${END_POINT.COMMON_URL}/api/v2/peatio/public/markets`,
    ),
    interval: '15',
    container_id: 'tv_chart_container',
    library_path: './charting_library/',
    // library_path:
    //   'https://stage-exchange-cultcoin.s3.us-east-2.amazonaws.com/trading3/charting_library/',
    locale: getLanguageFromURL() || 'en',
    // disabled_features: ['use_localstorage_for_settings'],
    // enabled_features: ['study_templates'],
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studies_overrides: {},
    disabled_features: [
      'use_localstorage_for_settings',
      'header_symbol_search',
    ],
    enabled_features: [
      'study_templates',
      'show_animated_logo',
      'hide_left_toolbar_by_default',
    ],
    enable_publishing: false,
    withdateranges: false,
    hide_side_toolbar: true,
    theme: 'Light',
    allow_symbol_change: false,
    details: true,
    hotlist: true,
    calendar: true,
  });
}

window.addEventListener('DOMContentLoaded', initOnReady, false);
