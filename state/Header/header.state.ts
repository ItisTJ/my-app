import { HeaderInterface } from '../../interfaces';

export interface HeaderState {
  loading: boolean;
  error: string | null;
  data: HeaderInterface | null;
  success?: boolean;
}

export interface HeadersState {
  loading: boolean;
  error: string | null;
  data: HeaderInterface[];
  success?: boolean;
}
