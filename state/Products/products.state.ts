import { PaginatedProducts, ProductInterface } from '../../interfaces';

export interface ProductsState {
  loading: boolean;
  error: string | null | undefined;
  data: PaginatedProducts;
}

export interface ProductState {
  loading: boolean;
  error: string | null;
  data: ProductInterface;
  success?: boolean;
}

export interface TopRatedProductsState {
  loading: boolean;
  error: string | null;
  data: ProductInterface[];
}
