import {
  GET_CHECK_DOCUMENT_SUBMIT,
  GET_CHECK_DOCUMENT_SUCCESS,
  GET_CHECK_DOCUMENT_FAIL,
  GET_CHECK_DOCUMENT_UPDATE,
  RESET_CHECK_DOCUMENT,
} from "../Actions/types";

const INITIAL_STATE = {
  checkDocumentInfo: null,
  checkDocumentError: "",
  isCheckDocumentLoading: false,
  checkDocumentUpdate: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHECK_DOCUMENT_SUBMIT:
      return {
        ...state,
        isCheckDocumentLoading: true,
        checkDocumentError: "",
        checkDocumentInfo: null,
      };
    case GET_CHECK_DOCUMENT_UPDATE:
      return {
        ...state,
        checkDocumentUpdate: action.payload.value,
        checkDocumentError: "",
        isLoading: false,
      };

    case GET_CHECK_DOCUMENT_SUCCESS:
      return {
        ...state,
        checkDocumentInfo: action.payload,
        checkDocumentError: "",
        isCheckDocumentLoading: false,
      };

    case RESET_CHECK_DOCUMENT:
      return { ...state, ...INITIAL_STATE };

    case GET_CHECK_DOCUMENT_FAIL:
      return {
        ...state,
        checkDocumentError: action.payload,
        isCheckDocumentLoading: false,
      };
    default:
      return state;
  }
};
