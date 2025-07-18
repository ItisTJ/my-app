import axios from "axios";
import { ActionTypes } from "./branches.action-types";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../index"; // adjust path if needed

// Define Branch type
interface Branch {
  city: string;
  image: string;
  contact: string;
  openAt: string;
  closeAt: string;
  location: string;
}

// Upload Branches Action
export const uploadBranches = (
  branchesData: Branch[]
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.BRANCHES_UPLOAD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      for (const branch of branchesData) {
        await axios.post("http://localhost:4000/api/branches", branch, config);
      }

      dispatch({
        type: ActionTypes.BRANCHES_UPLOAD_SUCCESS,
        payload: "Branches uploaded successfully",
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.BRANCHES_UPLOAD_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Upload failed`
          : error.message,
      });

      return false;
    }
  };
};

// Fetch Branches Action
export const fetchBranches = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.BRANCHES_FETCH_REQUEST });

      const { data } = await axios.get("http://localhost:4000/api/branches");

      dispatch({
        type: ActionTypes.BRANCHES_FETCH_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.BRANCHES_FETCH_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Fetch failed`
          : error.message,
      });
    }
  };
};

// Delete Branch Action
export const deleteBranch = (
  id: string
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.BRANCHES_DELETE_REQUEST });

      await axios.delete(`http://localhost:4000/api/branches/${id}`);

      dispatch({
        type: ActionTypes.BRANCHES_DELETE_SUCCESS,
        payload: id,
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.BRANCHES_DELETE_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Delete failed`
          : error.message,
      });

      return false;
    }
  };
};

// Edit Branch Action
export const editBranch = (
  id: string,
  updatedBranchData: Branch
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.BRANCHES_EDIT_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.put(
        `http://localhost:4000/api/branches/${id}`,
        updatedBranchData,
        config
      );

      dispatch({
        type: ActionTypes.BRANCHES_EDIT_SUCCESS,
        payload: data,
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.BRANCHES_EDIT_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Edit failed`
          : error.message,
      });

      return false;
    }
  };
};
