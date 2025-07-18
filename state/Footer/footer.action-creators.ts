import axios from "axios";
import {
  ActionTypes
} from "./footer.action-types";
import { Dispatch } from "redux";



// ✅ F (Redux Integrated)
export const fetchFooter = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.FOOTER_FETCH_REQUEST });

    const { data } = await axios.get("http://localhost:4000/api/footer");
    console.log("Footer Data:", data);

    dispatch({ type: ActionTypes.FOOTER_FETCH_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.FOOTER_FETCH_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Fetch failed" : error.message,
    });
  }
};

const fetchServices = () => async (dispatch: Dispatch) => {
  try { 
    dispatch({ type: ActionTypes.SERVICES_FETCH_REQUEST });

    const { data } = await axios.get("http://localhost:4000/api/services");

    dispatch({ type: ActionTypes.SERVICES_FETCH_SUCCESS, payload: data });
  }
  catch (error: any) {
    dispatch({
      type: ActionTypes.SERVICES_FETCH_FAIL,
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