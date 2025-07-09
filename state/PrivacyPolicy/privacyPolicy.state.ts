import { PrivacyPolicyInterface } from "../../interfaces";

export interface PrivacyPolicyState {
  loading: boolean;
  error: string | null;
  data: PrivacyPolicyInterface[] | null; // list of policies, nullable initially
  success?: boolean;
}
