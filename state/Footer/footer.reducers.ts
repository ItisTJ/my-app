import { FooterInterface } from "../../interfaces";
import { FooterAction } from "./footer.actions";
import { ActionTypes } from "./footer.action-types";

interface FooterState {
  loading: boolean;
  data?: FooterInterface[] | null;
  error?: string | null;
  success?: boolean;
}

const FooterInitialState: FooterState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

export const footerReducer = (
  state: FooterState = FooterInitialState,
  action: FooterAction
): FooterState => {
  switch (action.type) {
    case ActionTypes.FOOTER_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.FOOTER_UPLOAD_SUCCESS:
      return { loading: false, data: action.payload, error: null, success: true };

    case ActionTypes.FOOTER_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.FOOTER_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case ActionTypes.FOOTER_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload, success: true };

    case ActionTypes.FOOTER_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.FOOTER_DELETE_REQUEST:
      return { ...state, loading: true };

    case ActionTypes.FOOTER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data ? state.data.filter(footer=> footer._id !== action.payload) : [],
        success: true,
      };

    case ActionTypes.FOOTER_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.FOOTER_RESET:
      return FooterInitialState;

    default:
      return state;
  }
};

export default footerReducer;
