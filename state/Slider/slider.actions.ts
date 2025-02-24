import { SliderInterface } from "../../interfaces";
import { ActionTypes } from "./slider.action-types";

export type SliderAction =
  | SliderUploadStart
  | SliderUploadSuccess
  | SliderUploadError
  | SliderFetchStart
  | SliderFetchSuccess
  | SliderFetchError
  | SliderDeleteStart
  | SliderDeleteSuccess
  | SliderDeleteError
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

export interface SliderFetchStart {
  type: ActionTypes.SLIDER_FETCH_REQUEST;
}

export interface SliderFetchSuccess {
  type: ActionTypes.SLIDER_FETCH_SUCCESS;
  payload: SliderInterface[];
}

export interface SliderFetchError {
  type: ActionTypes.SLIDER_FETCH_FAIL;
  payload: string;
}

export interface SliderDeleteStart {
  type: ActionTypes.SLIDER_DELETE_REQUEST;
}

export interface SliderDeleteSuccess {
  type: ActionTypes.SLIDER_DELETE_SUCCESS;
  payload: string; // The ID of the deleted slider
}

export interface SliderDeleteError {
  type: ActionTypes.SLIDER_DELETE_FAIL;
  payload: string;
}

export interface SliderReset {
  type: ActionTypes.SLIDER_RESET;
}
