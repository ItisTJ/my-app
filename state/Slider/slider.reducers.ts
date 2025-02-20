import { SliderInterface } from "../../interfaces";
import { SliderAction } from "./slider.actions";
import { ActionTypes } from "./slider.action-types";

interface SliderState {
  loading: boolean;
  data?: SliderInterface | null;
  error?: string | null;
  success?: boolean;
}

const sliderInitialState: SliderState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

export const sliderReducer = (
  state: SliderState = sliderInitialState,
  action: SliderAction
): SliderState => {
  switch (action.type) {
    case ActionTypes.SLIDER_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case ActionTypes.SLIDER_UPLOAD_SUCCESS:
      return { loading: false, data: action.payload, error: null, success: true };
    case ActionTypes.SLIDER_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload, success: false };

    case ActionTypes.SLIDER_RESET:
      return sliderInitialState;

    default:
      return state;
  }
};

export default sliderReducer;
