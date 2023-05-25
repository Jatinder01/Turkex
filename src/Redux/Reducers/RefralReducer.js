import {
  GET_REFRAL_REWARD,
  GET_RERFAL_AWARD_DETAILS_SUCCESS,
  GET_RERFAL_DETAILS_FAIL,
  GET_REFRAL_FRIEND,
  GET_RERFAL_FRIEND_DETAILS_FAIL,
  GET_RERFAL_FRIEND_DETAILS_SUCCESS,
  GET_RERFAL_RewardHistory_SUCCESS,
  GET_RERFAL_RewardHistory_FAIL,
  GET_REFRAL_REWARD_HOSTORY,
  SEND_REWARD_INIT,
  SEND_REWARD_SUCCESS,
  SEND_REWARD_FAILED,
} from "../Actions/types";

const INITIAL_STATE = {
  refralData: {},
  refralDataError: "",
  refralFriendData: "",
  refralRewardHistory: "",
  referralLoader: false,
  refralInfoLoading: false,
  sendSuccess: false,
  paginationLoader: false,
  moreData: true,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REFRAL_REWARD_HOSTORY:
      let page = action?.payload;
      return {
        ...state,

        refralRewardHistory: page == 1 ? [] : state.refralRewardHistory,

        referralLoader: page == 1,
        paginationLoader: page != 1,
      };
    case GET_RERFAL_RewardHistory_SUCCESS:
      if (action.payload.length != 0) {
        let record = state.refralRewardHistory.concat(action.payload);
        // action.payload
        return {
          ...state,
          referralLoader: false,
          paginationLoader: false,
          refralRewardHistory: record,
          moreData: true,
        };
      } else {
        return {
          ...state,
          moreData: false,
          referralLoader: false,
          paginationLoader: false,
        };
      }

    case GET_RERFAL_RewardHistory_FAIL:
      return {
        ...state,
        refralRewardHistory: [],
        paginationLoader: false,
        referralLoader: false,
      };

    case GET_REFRAL_FRIEND:
      return { ...state, refralFriendData: [], referralLoader: true };
    case GET_RERFAL_FRIEND_DETAILS_FAIL:
      return { ...state, refralFriendData: [], referralLoader: false };

    case GET_RERFAL_FRIEND_DETAILS_SUCCESS:
      return {
        ...state,
        refralFriendData: action.payload,
        referralLoader: false,
      };

    case SEND_REWARD_INIT:
      return {
        ...state,
        refralInfoLoading: true,
      };
    case SEND_REWARD_SUCCESS:
      return {
        ...state,
        refralInfoLoading: false,
        sendSuccess: true,
      };
    case SEND_REWARD_FAILED:
      return {
        ...state,
        refralInfoLoading: false,
        // sendSuccess: true,
      };
    case GET_REFRAL_REWARD:
      return {
        ...state,
        refralData: {},
        refralInfoLoading: true,
        refralDataError: "",
      };

    case GET_RERFAL_AWARD_DETAILS_SUCCESS:
      return {
        ...state,
        refralData: action.payload,
        refralDataError: "",
        refralInfoLoading: false,
        sendSuccess: false,
      };
    case GET_RERFAL_DETAILS_FAIL:
      return { ...state, refralData: {}, refralInfoLoading: false };
    default:
      return state;
  }
};
