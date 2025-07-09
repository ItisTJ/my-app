import { PrivacyPolicyInterface } from "../../interfaces";
import { PrivacyPolicyAction } from "./privacyPolicy.actions";
import { ActionTypes } from "./privacyPolicy.action-types";

interface PrivacyPolicyState {
  loading: boolean;
  data?: PrivacyPolicyInterface[] | null;
  error?: string | null;
  success?: boolean;
}

const PrivacyPolicyInitialState: PrivacyPolicyState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

export const privacyPolicyReducer = (
  state: PrivacyPolicyState = PrivacyPolicyInitialState,
  action: PrivacyPolicyAction
): PrivacyPolicyState => {
  switch (action.type) {
    case ActionTypes.POLICY_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.POLICY_UPLOAD_SUCCESS:
      return { loading: false, data: [action.payload], error: null, success: true };

    case ActionTypes.POLICY_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.POLICY_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case ActionTypes.POLICY_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload, success: true };

    case ActionTypes.POLICY_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.POLICY_DELETE_REQUEST:
      return { ...state, loading: true };

    case ActionTypes.POLICY_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data
          ? state.data.filter(policy => policy._id !== action.payload)
          : [],
        success: true,
      };

    case ActionTypes.POLICY_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.POLICY_EDIT_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.POLICY_EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        data: state.data
          ? state.data.map(policy =>
              policy._id === action.payload._id ? action.payload : policy
            )
          : [],
        error: null,
      };

    case ActionTypes.POLICY_EDIT_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.POLICY_RESET:
      return PrivacyPolicyInitialState;

    default:
      return state;
  }
};

export default privacyPolicyReducer;
