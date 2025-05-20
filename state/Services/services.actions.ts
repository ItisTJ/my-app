import { ServiceInterface } from "../../interfaces";  
import { ActionTypes } from "./services.action-types";

export type ServiceAction =
  | ServiceUploadStart
  | ServiceUploadSuccess
  | ServiceUploadError
  | ServiceFetchStart
  | ServiceFetchSuccess
  | ServiceFetchError
  | ServiceDeleteStart
  | ServiceDeleteSuccess
  | ServiceDeleteError
  | ServiceReset;

export interface ServiceUploadStart {
  type: ActionTypes.SERVICES_UPLOAD_REQUEST;
}

export interface ServiceUploadSuccess {
  type: ActionTypes.SERVICES_UPLOAD_SUCCESS;
  payload: ServiceInterface;
}

export interface ServiceUploadError {
  type: ActionTypes.SERVICES_UPLOAD_FAIL;
  payload: string;
}

export interface ServiceFetchStart {
  type: ActionTypes.SERVICES_FETCH_REQUEST;
}

export interface ServiceFetchSuccess {
  type: ActionTypes.SERVICES_FETCH_SUCCESS;
  payload: ServiceInterface[];
}

export interface ServiceFetchError {
  type: ActionTypes.SERVICES_FETCH_FAIL;
  payload: string;
}

export interface ServiceDeleteStart {
  type: ActionTypes.SERVICES_DELETE_REQUEST;
}

export interface ServiceDeleteSuccess {
  type: ActionTypes.SERVICES_DELETE_SUCCESS;
  payload: string; // The ID of the deleted Service
}

export interface ServiceDeleteError {
  type: ActionTypes.SERVICES_DELETE_FAIL;
  payload: string;
}

export interface ServiceReset {
  type: ActionTypes.SERVICES_RESET;
}
