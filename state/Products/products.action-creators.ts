import Router from 'next/router';
import { Dispatch } from 'redux';
import { ProductInterface, Review } from '../../interfaces';
import { proshopAPI } from '../../lib';
import { ActionTypes } from './products.action-types';
import { ProductsAction } from './products.actions';

// Utility function to extract error message
const getErrorMessage = (error: any): string => {
  return error.response?.data?.message || error.message || 'An error occurred';
};

export const fetchProducts =
  (keyword: string = '', pageId: number = 1) =>
  async (dispatch: Dispatch<ProductsAction>) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_PRODUCTS_START,
      });

      const { data } = await proshopAPI.get(
        `/api/products?keyword=${keyword}&pageId=${pageId}`
      );

      dispatch({
        type: ActionTypes.FETCH_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.FETCH_PRODUCTS_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };

export const fetchTopRatedProducts =
  () => async (dispatch: Dispatch<ProductsAction>) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_START,
      });

      const { data } = await proshopAPI.get('/api/products/topRated');

      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };


  export const fetchProductsByCategory = (category: string, pageId?: number) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_LIST_REQUEST' });
    const { data } = await proshopAPI.get(`/api/products/category/${category}?page=${pageId || 1}`);
    dispatch({ type: 'PRODUCT_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'PRODUCT_LIST_FAIL',
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const fetchProduct =
  (id: string) => async (dispatch: Dispatch<ProductsAction>) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_PRODUCT_START,
      });

      const { data } = await proshopAPI.get(`/api/products/${id}`);

      dispatch({
        type: ActionTypes.FETCH_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.FETCH_PRODUCT_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };

export const fetchProductReset =
  () => async (dispatch: Dispatch<ProductsAction>) => {
    dispatch({
      type: ActionTypes.FETCH_PRODUCT_RESET,
    });
  };

export const deleteProduct =
  (id: string) => async (dispatch: Dispatch<ProductsAction>) => {
    const config = {
      withCredentials: true,
    };

    try {
      dispatch({
        type: ActionTypes.DELETE_PRODUCT_START,
      });

      await proshopAPI.delete(`/api/products/${id}`, config);

      dispatch({
        type: ActionTypes.DELETE_PRODUCT_SUCCESS,
        payload: null,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.DELETE_PRODUCT_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };

export const createProduct =
  () => async (dispatch: Dispatch<ProductsAction>) => {
    const config = {
      withCredentials: true,
    };

    try {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_START,
      });

      const { data } = await proshopAPI.post(`/api/products`, {}, config);

      dispatch({
        type: ActionTypes.CREATE_PRODUCT_SUCCESS,
        payload: data,
      });

      Router.push(`/admin/products/edit/${data._id}`);
    } catch (error: any) {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };

export const updateProduct =
  (id: string, product: Partial<ProductInterface>) =>
  async (dispatch: Dispatch<ProductsAction>) => {
    const config = {
      withCredentials: true,
    };

    try {
      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_START,
      });

      const { data } = await proshopAPI.put(`/api/products/${id}`, product, config);

      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_RESET,
      });

      Router.push('/admin/products');
    } catch (error: any) {
      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };

export const createProductReview =
  (id: string, review: Review) =>
  async (dispatch: Dispatch<ProductsAction>) => {
    const config = {
      withCredentials: true,
    };

    try {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_START,
      });

      const { data } = await proshopAPI.put(
        `/api/products/${id}/review`,
        review,
        config
      );

      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_RESET,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };