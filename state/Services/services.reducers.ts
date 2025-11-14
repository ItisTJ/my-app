import { ServiceInterface } from "../../interfaces";
import { ServiceAction } from "./services.actions";
import { ActionTypes } from "./services.action-types";

interface ServiceState {
  loading: boolean;
  data?: ServiceInterface[] | null;
  error?: string | null;
  success?: boolean;
}

const ServiceInitialState: ServiceState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

export const servicesReducer = (
  state: ServiceState = ServiceInitialState,
  action: ServiceAction
): ServiceState => {
  switch (action.type) {
    case ActionTypes.SERVICES_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.SERVICES_UPLOAD_SUCCESS:
      return { loading: false, data: [action.payload], error: null, success: true };

    case ActionTypes.SERVICES_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.SERVICES_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case ActionTypes.SERVICES_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload, success: true };

    case ActionTypes.SERVICES_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.SERVICES_DELETE_REQUEST:
      return { ...state, loading: true };

    case ActionTypes.SERVICES_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data ? state.data.filter(service => service._id !== action.payload) : [],
        success: true,
      };

    case ActionTypes.SERVICES_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.SERVICES_EDIT_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case ActionTypes.SERVICES_EDIT_SUCCESS:
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

    case ActionTypes.SERVICES_EDIT_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.SERVICES_RESET:
      return ServiceInitialState;

    default:
      return state;
  }
};

export default servicesReducer;
