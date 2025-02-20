import axios from "axios";
import {
  ActionTypes
} from "./slider.action-types";

export const uploadSliderItem = (formData: FormData) => async (dispatch: any) => {
  try {
    dispatch({ type: ActionTypes.SLIDER_UPLOAD_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post("http://localhost:4000/slider/upload", formData, config);

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
