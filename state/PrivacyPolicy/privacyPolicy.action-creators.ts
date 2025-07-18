import axios from "axios";
import { ActionTypes } from "./privacyPolicy.action-types";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../index"; // Adjust if needed

// Define PrivacyPolicy type
interface PrivacyPolicy {
  title: string;
  description: string;
}

// Upload Privacy Policies
export const uploadPrivacyPolicy = (
  policyData: PrivacyPolicy[]
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.POLICY_UPLOAD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      for (const policy of policyData) {
        await axios.post("http://localhost:4000/api/privacyPolicy", policy, config);
      }

      dispatch({
        type: ActionTypes.POLICY_UPLOAD_SUCCESS,
        payload: "Privacy Policies uploaded successfully",
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.POLICY_UPLOAD_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Upload failed`
          : error.message,
      });

      return false;
    }
  };
};

// Fetch Privacy Policies
export const fetchPrivacyPolicies = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.POLICY_FETCH_REQUEST });

      const { data } = await axios.get("http://localhost:4000/api/privacyPolicy");

      dispatch({
        type: ActionTypes.POLICY_FETCH_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.POLICY_FETCH_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Fetch failed`
          : error.message,
      });
    }
  };
};

// Delete Privacy Policy
export const deletePrivacyPolicy = (
  id: string
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.POLICY_DELETE_REQUEST });

      await axios.delete(`http://localhost:4000/api/privacyPolicy/${id}`);

      dispatch({
        type: ActionTypes.POLICY_DELETE_SUCCESS,
        payload: id,
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.POLICY_DELETE_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Delete failed`
          : error.message,
      });

      return false;
    }
  };
};

// Edit Privacy Policy
export const editPrivacyPolicy = (
  id: string,
  updatedPolicyData: {
    title: string;
    description: string;
  }
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.POLICY_EDIT_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.put(
        `http://localhost:4000/api/privacyPolicy/${id}`,
        updatedPolicyData,
        config
      );

      dispatch({
        type: ActionTypes.POLICY_EDIT_SUCCESS,
        payload: data,
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.POLICY_EDIT_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Edit failed`
          : error.message,
      });

      return false;
    }
  };
};
