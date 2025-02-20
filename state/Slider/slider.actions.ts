import { SliderInterface } from "../../interfaces";
import { ActionTypes } from "./slider.action-types";

export type SliderAction =
  | SliderUploadStart
  | SliderUploadSuccess
  | SliderUploadError
    | SliderReset;

export interface SliderUploadStart {
    type: ActionTypes.SLIDER_UPLOAD_REQUEST;
    }
    export interface SliderUploadSuccess {
    type: ActionTypes.SLIDER_UPLOAD_SUCCESS;
    payload: SliderInterface;
    }
    export interface SliderUploadError {
    type: ActionTypes.SLIDER_UPLOAD_FAIL;
    payload: string;
    }
    export interface SliderReset {
    type: ActionTypes.SLIDER_RESET;
    }

