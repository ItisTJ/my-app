import { BranchesInterface } from "../../interfaces";

export interface BranchesState {
  loading: boolean;
  error: string | null;
  data: BranchesInterface[] | null;  // list of branches, nullable initially
  success?: boolean;
}
