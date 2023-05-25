import {
  KYC_FIRST_FORM_UPDATE,
  KYC_FIRST_SUCCESS,
  KYC_FIRST_FAIL,
  KYC_FIRST_SUBMIT,
  KYC_FIRST_RESET,
  KYC_DOC_GET,
  KYC_DOC_INITIAL,
  KYC_DOC_FAIL,
} from "../Actions/types";

const INITIAL_STATE = {
  kycFirstName: "",
  kycLastName: "",
  kycMiddleName: "",
  kycDob: "DD/MM/YYYY",
  kycCountry: "",
  kycCity: "",
  kycGender: "",
  kycCountryId: "",
  kycZip: "",
  kycError: "",
  kycResponse: "",
  kycDocData: "",
  kycLoading: false,
  kycAddress: "",
  kycTown: "",
  KycShowDatePicker: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case KYC_FIRST_RESET:
      return { ...state, ...INITIAL_STATE };
    case KYC_FIRST_FORM_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
      };
    case KYC_FIRST_SUBMIT:
      return { ...state, kycLoading: true, kycError: "" };

    case KYC_DOC_INITIAL:
      return { ...state, kycLoading: true, kycDocData: "", kycError: "" };
    case KYC_DOC_FAIL:
      return {
        ...state,
        kycLoading: false,
        kycDocData: "",
        kycError: action.payload,
      };
    case KYC_DOC_GET:
      return {
        ...state,
        kycLoading: false,
        kycDocData: action.payload,
        kycError: "",
      };

    case KYC_FIRST_SUCCESS:
      return {
        ...state,
        kycResponse: action.payload,
        kycLoading: false,
        kycError: "",
      };
    case KYC_FIRST_FAIL:
      return { ...state, kycError: action.payload, kycLoading: false };

    default:
      return state;
  }
};
