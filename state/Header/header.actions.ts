import { HeaderInterface } from "../../interfaces";
import { ActionTypes } from "./header.action-types";

export type HeaderAction =
  | HeaderUploadStart
  | HeaderUploadSuccess
  | HeaderUploadError
  | HeaderFetchStart
  | HeaderFetchSuccess
  | HeaderFetchError
  | HeaderDeleteStart
  | HeaderDeleteSuccess
  | HeaderDeleteError
  | HeaderReset;

export interface HeaderUploadStart {
  type: ActionTypes.HEADER_UPLOAD_REQUEST;
}

export interface HeaderUploadSuccess {
  type: ActionTypes.HEADER_UPLOAD_SUCCESS;
  payload: HeaderInterface;
}

export interface HeaderUploadError {
  type: ActionTypes.HEADER_UPLOAD_FAIL;
  payload: string;
}

export interface HeaderFetchStart {
  type: ActionTypes.HEADER_FETCH_REQUEST;
}

export interface HeaderFetchSuccess {
  type: ActionTypes.HEADER_FETCH_SUCCESS;
  payload: HeaderInterface[];
}

export interface HeaderFetchError {
  type: ActionTypes.HEADER_FETCH_FAIL;
  payload: string;
}

export interface HeaderDeleteStart {
  type: ActionTypes.HEADER_DELETE_REQUEST;
}

export interface HeaderDeleteSuccess {
  type: ActionTypes.HEADER_DELETE_SUCCESS;
  payload: string; // The ID of the deleted Header
}

export interface HeaderDeleteError {
  type: ActionTypes.HEADER_DELETE_FAIL;
  payload: string;
}

export interface HeaderReset {
  type: ActionTypes.HEADER_RESET;
}
