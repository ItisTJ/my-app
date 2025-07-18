import { ServiceInterface } from "../../interfaces";

export interface ServicesState {
  loading: boolean;
  error: string | null;
  data: ServiceInterface[] | null;  // list of services, nullable initially
  success?: boolean;
}
