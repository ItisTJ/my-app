import axios from "axios";
import { ActionTypes } from "./header.action-types";
import { Dispatch } from "redux";



// ✅ F (Redux Integrated)
export const fetchHeader = () => async (dispatch: Dispatch) => {

  try {
    dispatch({ type: ActionTypes.HEADER_FETCH_REQUEST });

    const { data } = await axios.get("https://server-amsw4cxpk-thisarasenadeera2000-gmailcoms-projects.vercel.app/api/header");
    console.log("Header Data:", data);

    dispatch({ type: ActionTypes.HEADER_FETCH_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.HEADER_FETCH_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Fetch failed" : error.message,
    });
  }
};


