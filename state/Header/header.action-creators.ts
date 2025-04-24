import axios from "axios";
import {
  ActionTypes
} from "./header.action-types";
import { Dispatch } from "redux";



// ✅ F (Redux Integrated)
export const fetchHeader = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.HEADER_FETCH_REQUEST });

    const { data } = await axios.get("http://localhost:4000/api/header");
    console.log("Header Data:", data);

    dispatch({ type: ActionTypes.HEADER_FETCH_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.HEADER_FETCH_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Fetch failed" : error.message,
    });
  }
};


// ✅ Delete Slider
// export const deleteSlider = (id: string) => async (dispatch: Dispatch) => {
//   try {
//     dispatch({ type: ActionTypes.FOOTER_DELETE_FAIL });

//     await axios.delete(`http://localhost:4000/sliders/${id}`);

//     dispatch({ type: ActionTypes.FOOTER_DELETE_SUCCESS, payload: id });
//   } catch (error: any) {
//     dispatch({
//       type: ActionTypes.FOOTER_DELETE_FAIL,
//       payload: error.response?.data?.message ? error.response.data.message + " Delete failed" : error.message,
//     });
//   }
// };