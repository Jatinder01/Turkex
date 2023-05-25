import {
  UPLOAD_DOCUMENTS_PAYTEND_SUBMIT,
  UPLOAD_DOCUMENTS_PAYTEND_SUCCESS,
  UPLOAD_DOCUMENTS_PAYTEND_FAIL,
  UPLOAD_DOCUMENTS_PAYTEND_UPDATE,
  RESET_UPLOAD_DOCUMENTS_PAYTEND,
} from "../Actions/types";

const INITIAL_STATE = {
  uploadDocPaytendSide: null,
  uploadDocPaytendSideError: "",
  isUploadDocPaytendSideLoading: false,
  uploadDocPaytendSideUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPLOAD_DOCUMENTS_PAYTEND_SUBMIT:
      return {
        ...state,
        isUploadDocPaytendSideLoading: true,
        uploadDocPaytendSideError: "",
        uploadDocPaytendSide: null,
      };
    case UPLOAD_DOCUMENTS_PAYTEND_UPDATE:
      return {
        ...state,
        uploadDocPaytendSideUpdate: action.payload.value,
        uploadDocPaytendSideError: "",
        isUploadDocPaytendSideLoading: false,
      };

    case UPLOAD_DOCUMENTS_PAYTEND_SUCCESS:
      return {
        ...state,
        uploadDocPaytendSide: action.payload,
        uploadDocPaytendSideError: "",
        isUploadDocPaytendSideLoading: false,
      };

    case RESET_UPLOAD_DOCUMENTS_PAYTEND:
      return { ...state, ...INITIAL_STATE };

    case UPLOAD_DOCUMENTS_PAYTEND_FAIL:
      return {
        ...state,
        uploadDocPaytendSideError: action.payload,
        isUploadDocPaytendSideLoading: false,
      };
    default:
      return state;
  }
};
