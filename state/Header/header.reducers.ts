import { HeaderInterface } from "../../interfaces";
import { HeaderAction } from "./header.actions";
import { ActionTypes } from "./header.action-types";

interface HeaderState {
  loading: boolean;
  data?: HeaderInterface[] | null;
  error?: string | null;
  success?: boolean;
}

const HeaderInitialState: HeaderState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

export const headerReducer = (
  state: HeaderState = HeaderInitialState,
  action: HeaderAction
): HeaderState => {
  switch (action.type) {
    case ActionTypes.HEADER_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.HEADER_UPLOAD_SUCCESS:
      return { loading: false, data: [action.payload], error: null, success: true };

    case ActionTypes.HEADER_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.HEADER_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case ActionTypes.HEADER_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload, success: true };

    case ActionTypes.HEADER_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.HEADER_DELETE_REQUEST:
      return { ...state, loading: true };

    case ActionTypes.HEADER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data ? state.data.filter(header=> header._id !== action.payload) : [],
        success: true,
      };

    case ActionTypes.HEADER_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.HEADER_RESET:
      return HeaderInitialState;

    default:
      return state;
  }
};

export default headerReducer;
