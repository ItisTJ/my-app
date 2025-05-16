import axios from "axios";
import {
  ActionTypes
} from "./slider.action-types";
import { Dispatch } from "redux";



// ✅ Fetch Sliders (Redux Integrated)
export const fetchSliders = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.SLIDER_FETCH_REQUEST });

    const { data } = await axios.get("http://localhost:4000/api/slider");

    dispatch({ type: ActionTypes.SLIDER_FETCH_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.SLIDER_FETCH_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Fetch failed" : error.message,
    });
  }
};


// ✅ Delete Slider
export const deleteSlider = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.SLIDER_DELETE_REQUEST });

    await axios.delete(`http://localhost:4000/api/slider/${id}`);

    dispatch({ type: ActionTypes.SLIDER_DELETE_SUCCESS, payload: id });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.SLIDER_DELETE_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Delete failed" : error.message,
    });
  }
};