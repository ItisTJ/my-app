import axios from "axios";
import {
  ActionTypes
} from "./slider.action-types";
import { Dispatch } from "redux";


export const uploadSliderItem = (formData: FormData) => async (dispatch: any) => {
  try {
    dispatch({ type: ActionTypes.SLIDER_UPLOAD_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    console.log("formData", formData);
    const { data } = await axios.post("http://localhost:4000/slider/upload", formData, config);
    console.log("data", data);

    dispatch({ type: ActionTypes.SLIDER_UPLOAD_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.SLIDER_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message + " Upload failed "
          : error.message,
    });
  }
};


// ✅ Fetch Sliders (Redux Integrated)
export const fetchSliders = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.SLIDER_FETCH_REQUEST });

    const { data } = await axios.get("http://localhost:4000/slider");

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

    await axios.delete(`http://localhost:4000/sliders/${id}`);

    dispatch({ type: ActionTypes.SLIDER_DELETE_SUCCESS, payload: id });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.SLIDER_DELETE_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Delete failed" : error.message,
    });
  }
};