import {
  POST_UPLOAD_DOCUMENTS_USER_SUBMIT,
  POST_UPLOAD_DOCUMENTS_USER_SUCCESS,
  POST_UPLOAD_DOCUMENTS_USER_FAIL,
  POST_UPLOAD_DOCUMENTS_USER_UPDATE,
  RESET_POST_UPLOAD_DOCUMENTS_USER,
} from "../Actions/types";

const INITIAL_STATE = {
  uploadDocUserSide: null,
  uploadDocUserSideError: "",
  isUploadDocUserSideLoading: false,
  uploadDocUserSideUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_UPLOAD_DOCUMENTS_USER_SUBMIT:
      return {
        ...state,
        isUploadDocUserSideLoading: true,
        uploadDocUserSideError: "",
        uploadDocUserSide: null,
      };
    case POST_UPLOAD_DOCUMENTS_USER_UPDATE:
      return {
        ...state,
        uploadDocUserSideUpdate: action.payload.value,
        uploadDocUserSideError: "",
        isUploadDocUserSideLoading: false,
      };

    case POST_UPLOAD_DOCUMENTS_USER_SUCCESS:
      return {
        ...state,
        uploadDocUserSide: action.payload,
        uploadDocUserSideError: "",
        isUploadDocUserSideLoading: false,
      };

    case RESET_POST_UPLOAD_DOCUMENTS_USER:
      return { ...state, ...INITIAL_STATE };

    case POST_UPLOAD_DOCUMENTS_USER_FAIL:
      return {
        ...state,
        uploadDocUserSideError: action.payload,
        isUploadDocUserSideLoading: false,
      };
    default:
      return state;
  }
};
