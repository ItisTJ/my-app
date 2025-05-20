import axios from "axios";
import { ActionTypes } from "./slider.action-types";
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

  const config = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  try {
    dispatch({ type: ActionTypes.SLIDER_DELETE_REQUEST });

    await axios.delete(`http://localhost:4000/api/slider/${id}`, config);

    dispatch({ type: ActionTypes.SLIDER_DELETE_SUCCESS, payload: id });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.SLIDER_DELETE_FAIL,
      payload: error.response?.data?.message ? error.response.data.message + " Delete failed" : error.message,
    });
  }
};


// ✅ Update Slider
export const updateSlider = (slider: { _id: string; name: string; description: string; image: string }) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.SLIDER_UPDATE_REQUEST });

    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.put(`http://localhost:4000/api/slider/${slider._id}`, slider, config);

    dispatch({
      type: ActionTypes.SLIDER_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.SLIDER_UPDATE_FAIL,
      payload:
        error.response?.data?.message
          ? error.response.data.message + ' Update failed'
          : error.message,
    });
  }
};
