import { BranchesInterface } from "../../interfaces";
import { ActionTypes } from "./branches.action-types";

export type BranchAction =
  | BranchUploadStart
  | BranchUploadSuccess
  | BranchUploadError
  | BranchFetchStart
  | BranchFetchSuccess
  | BranchFetchError
  | BranchDeleteStart
  | BranchDeleteSuccess
  | BranchDeleteError
  | BranchEditStart
  | BranchEditSuccess
  | BranchEditError
  | BranchReset;

export interface BranchUploadStart {
  type: ActionTypes.BRANCHES_UPLOAD_REQUEST;
}

export interface BranchUploadSuccess {
  type: ActionTypes.BRANCHES_UPLOAD_SUCCESS;
  payload: BranchesInterface;
}

export interface BranchUploadError {
  type: ActionTypes.BRANCHES_UPLOAD_FAIL;
  payload: string;
}

export interface BranchFetchStart {
  type: ActionTypes.BRANCHES_FETCH_REQUEST;
}

export interface BranchFetchSuccess {
  type: ActionTypes.BRANCHES_FETCH_SUCCESS;
  payload: BranchesInterface[];
}

export interface BranchFetchError {
  type: ActionTypes.BRANCHES_FETCH_FAIL;
  payload: string;
}

export interface BranchDeleteStart {
  type: ActionTypes.BRANCHES_DELETE_REQUEST;
}

export interface BranchDeleteSuccess {
  type: ActionTypes.BRANCHES_DELETE_SUCCESS;
  payload: string; // The ID of the deleted branch
}

export interface BranchDeleteError {
  type: ActionTypes.BRANCHES_DELETE_FAIL;
  payload: string;
}

export interface BranchEditStart {
  type: ActionTypes.BRANCHES_EDIT_REQUEST;
}

export interface BranchEditSuccess {
  type: ActionTypes.BRANCHES_EDIT_SUCCESS;
  payload: BranchesInterface;
}

export interface BranchEditError {
  type: ActionTypes.BRANCHES_EDIT_FAIL;
  payload: string;
}

export interface BranchReset {
  type: ActionTypes.BRANCHES_RESET;
}
