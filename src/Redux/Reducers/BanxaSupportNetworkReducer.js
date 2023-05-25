import {
  BANXA_SUPPORTED_NETWORKS_SUBMIT,
  BANXA_SUPPORTED_NETWORKS_SUCCESS,
  BANXA_SUPPORTED_NETWORKS_FAIL,
  BANXA_SUPPORTED_NETWORKS_UPDATE,
  RESET_SUPPORTED_NETWORKS_CRYPTO,
} from '../Actions/types';

const INITIAL_STATE = {
  banxaSupportedNetworkList: null,
  error: '',
  isLoading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BANXA_SUPPORTED_NETWORKS_SUBMIT:
      return {
        ...state,
        isLoading: true,
        error: '',
        banxaSupportedNetworkList: null,
      };
    case RESET_SUPPORTED_NETWORKS_CRYPTO:
      return {...state, ...INITIAL_STATE};

    case BANXA_SUPPORTED_NETWORKS_UPDATE:
      return {
        ...state,
        banxaSupportedNetworkList: action.payload.value,
        error: '',
        isLoading: false,
      };

    case BANXA_SUPPORTED_NETWORKS_SUCCESS:
      return {
        ...state,
        banxaSupportedNetworkList: action.payload,
        error: '',
        isLoading: false,
      };
    case BANXA_SUPPORTED_NETWORKS_FAIL:
      return {...state, error: action.payload, isLoading: false};
    default:
      return state;
  }
};
