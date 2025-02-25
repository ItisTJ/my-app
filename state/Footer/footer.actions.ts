import { FooterInterface } from "../../interfaces";
import { ActionTypes } from "./footer.action-types";

export type FooterAction =
  | FooterUploadStart
  | FooterUploadSuccess
  | FooterUploadError
  | FooterFetchStart
  | FooterFetchSuccess
  | FooterFetchError
  | FooterDeleteStart
  | FooterDeleteSuccess
  | FooterDeleteError
  | FooterReset;

export interface FooterUploadStart {
  type: ActionTypes.FOOTER_UPLOAD_REQUEST;
}

export interface FooterUploadSuccess {
  type: ActionTypes.FOOTER_UPLOAD_SUCCESS;
  payload: FooterInterface;
}

export interface FooterUploadError {
  type: ActionTypes.FOOTER_UPLOAD_FAIL;
  payload: string;
}

export interface FooterFetchStart {
  type: ActionTypes.FOOTER_FETCH_REQUEST;
}

export interface FooterFetchSuccess {
  type: ActionTypes.FOOTER_FETCH_SUCCESS;
  payload: FooterInterface[];
}

export interface FooterFetchError {
  type: ActionTypes.FOOTER_FETCH_FAIL;
  payload: string;
}

export interface FooterDeleteStart {
  type: ActionTypes.FOOTER_DELETE_REQUEST;
}

export interface FooterDeleteSuccess {
  type: ActionTypes.FOOTER_DELETE_SUCCESS;
  payload: string; // The ID of the deleted Footer
}

export interface FooterDeleteError {
  type: ActionTypes.FOOTER_DELETE_FAIL;
  payload: string;
}

export interface FooterReset {
  type: ActionTypes.FOOTER_RESET;
}
