import { ActionTypes } from "./privacyPolicy.action-types";
import { PrivacyPolicyInterface } from "../../interfaces";

export type PrivacyPolicyAction =
  | PolicyUploadStart
  | PolicyUploadSuccess
  | PolicyUploadError
  | PolicyFetchStart
  | PolicyFetchSuccess
  | PolicyFetchError
  | PolicyDeleteStart
  | PolicyDeleteSuccess
  | PolicyDeleteError
  | PolicyEditStart
  | PolicyEditSuccess
  | PolicyEditError
  | PolicyReset;

export interface PolicyUploadStart {
  type: ActionTypes.POLICY_UPLOAD_REQUEST;
}

export interface PolicyUploadSuccess {
  type: ActionTypes.POLICY_UPLOAD_SUCCESS;
  payload: PrivacyPolicyInterface;
}

export interface PolicyUploadError {
  type: ActionTypes.POLICY_UPLOAD_FAIL;
  payload: string;
}

export interface PolicyFetchStart {
  type: ActionTypes.POLICY_FETCH_REQUEST;
}

export interface PolicyFetchSuccess {
  type: ActionTypes.POLICY_FETCH_SUCCESS;
  payload: PrivacyPolicyInterface[];
}

export interface PolicyFetchError {
  type: ActionTypes.POLICY_FETCH_FAIL;
  payload: string;
}

export interface PolicyDeleteStart {
  type: ActionTypes.POLICY_DELETE_REQUEST;
}

export interface PolicyDeleteSuccess {
  type: ActionTypes.POLICY_DELETE_SUCCESS;
  payload: string; // ID of the deleted policy
}

export interface PolicyDeleteError {
  type: ActionTypes.POLICY_DELETE_FAIL;
  payload: string;
}

export interface PolicyEditStart {
  type: ActionTypes.POLICY_EDIT_REQUEST;
}

export interface PolicyEditSuccess {
  type: ActionTypes.POLICY_EDIT_SUCCESS;
  payload: PrivacyPolicyInterface; // Updated policy object
}

export interface PolicyEditError {
  type: ActionTypes.POLICY_EDIT_FAIL;
  payload: string;
}

export interface PolicyReset {
  type: ActionTypes.POLICY_RESET;
}
