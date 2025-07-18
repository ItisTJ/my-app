import { FooterInterface } from '../../interfaces';

export interface FooterState {
  loading: boolean;
  error: string | null;
  data: FooterInterface | null | FooterInterface[];
  success?: boolean;
}
