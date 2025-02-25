import axios from "axios";
import {
  ActionTypes
} from "./footer.action-types";
import { Dispatch } from "redux";



// ✅ Fetch FOOTERs (Redux Integrated)
export const fetchFooter = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.FOOTER_FETCH_REQUEST });

    const { data } = await axios.get("http://localhost:4000/FOOTER");

    dispatch({ type: ActionTypes.FOOTER_FETCH_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.FOOTER_FETCH_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Fetch failed" : error.message,
    });
  }
};


// ✅ Delete FOOTER
export const deleteFooter = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.FOOTER_DELETE_REQUEST });

    await axios.delete(`http://localhost:4000/FOOTERs/${id}`);

    dispatch({ type: ActionTypes.FOOTER_DELETE_SUCCESS, payload: id });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.FOOTER_DELETE_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Delete failed" : error.message,
    });
  }
};