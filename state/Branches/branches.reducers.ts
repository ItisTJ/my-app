import { BranchesInterface } from "../../interfaces";
import { BranchAction } from "./branches.actions";
import { ActionTypes } from "./branches.action-types";

interface BranchesState {
  loading: boolean;
  data?: BranchesInterface[] | null;
  error?: string | null;
  success?: boolean;
}

const BranchesInitialState: BranchesState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

export const branchesReducer = (
  state: BranchesState = BranchesInitialState,
  action: BranchAction
): BranchesState => {
  switch (action.type) {
    case ActionTypes.BRANCHES_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.BRANCHES_UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data ? [...state.data, action.payload] : [action.payload],
        error: null,
        success: true,
      };

    case ActionTypes.BRANCHES_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.BRANCHES_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case ActionTypes.BRANCHES_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload, success: true };

    case ActionTypes.BRANCHES_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.BRANCHES_DELETE_REQUEST:
      return { ...state, loading: true };

    case ActionTypes.BRANCHES_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data ? state.data.filter(branches => branches._id !== action.payload) : [],
        success: true,
      };

    case ActionTypes.BRANCHES_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.BRANCHES_EDIT_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.BRANCHES_EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        data: state.data
          ? state.data.map(service =>
              service._id === action.payload._id ? action.payload : service
            )
          : [],
        error: null,
      };

    case ActionTypes.BRANCHES_EDIT_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.BRANCHES_RESET:
      return BranchesInitialState;

    default:
      return state;
  }
};

export default branchesReducer;
