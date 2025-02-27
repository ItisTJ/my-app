import { FooterInterface } from '../../interfaces';

export interface FooterState {
  loading: boolean;
  error: string | null;
  data: FooterInterface | null;
  success?: boolean;
}

export interface FooterState {
  loading: boolean;
  error: string | null;
  data: FooterInterface[];
  success?: boolean;
}
