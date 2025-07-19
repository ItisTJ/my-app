import { Dispatch } from 'redux';
import { ProductInterface, ShippingDetails } from '../../interfaces';
import { proshopAPI } from '../../lib';
import { ActionTypes } from './cart.action-types';
import { CartAction } from './cart.actions';
import { cartWithPrices } from '../../utils';
import Router from 'next/router';

interface AddToCart {
  qty: number;
  productId?: string;
  product?: ProductInterface;
}

// Utility function to extract error message
const getErrorMessage = (error: any): string => {
  return error.response?.data?.message || error.message || 'An error occurred';
};

export const addToCart =
  ({ qty, productId, product }: AddToCart) =>
  async (dispatch: Dispatch<CartAction>) => {
    try {
      if (product) {
        dispatch({
          type: ActionTypes.ADD_CART_ITEM_START,
        });
      }

      const { data } = await proshopAPI.post(
        'api/cart',
        {
          product,
          qty,
          productId,
        },
        { withCredentials: true }
      );

      dispatch({
        type: ActionTypes.ADD_CART_ITEM_SUCCESS,
        payload: data,
      });

      if (Router.asPath !== '/api/cart') {
        Router.push('/cart');
      }
    } catch (error: any) {
      dispatch({
        type: ActionTypes.ADD_CART_ITEM_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };

export const removeFromCart =
  (id: string) => async (dispatch: Dispatch<CartAction>) => {
    try {
      await proshopAPI.delete(`api/cart/${id}`, { withCredentials: true });

      dispatch({
        type: ActionTypes.REMOVE_CART_ITEM,
        payload: id,
      });
    } catch (error: any) {
      console.log(getErrorMessage(error));
    }
  };

export const saveShippingAddress =
  (shippingDetails: ShippingDetails) =>
  async (dispatch: Dispatch<CartAction>) => {
    try {
      const { data } = await proshopAPI.post(
        'api/cart/shipping',
        shippingDetails,
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: ActionTypes.SAVE_CART_SHIPPING_ADDRESS,
        payload: data,
      });

      Router.push('/payment');
    } catch (error: any) {
      console.log(getErrorMessage(error));
    }
  };

export const getCart = () => async (dispatch: Dispatch<CartAction>) => {
  try {
    dispatch({
      type: ActionTypes.GET_CART_START,
    });

    const { data } = await proshopAPI.get('api/cart', { withCredentials: true });

    dispatch({
      type: ActionTypes.GET_CART_SUCCESS,
      payload: data,
    });

    const newCart = cartWithPrices(data);

    dispatch({
      type: ActionTypes.CALCULATE_PRICES,
      payload: newCart,
    });
  } catch (error: any) {
    dispatch({
      type: ActionTypes.GET_CART_ERROR,
      payload: getErrorMessage(error),
    });
  }
};

export const savePaymentMethod =
  (paymentMethod: string) => async (dispatch: Dispatch<CartAction>) => {
    try {
      const { data } = await proshopAPI.post(
        'api/cart/payment',
        { paymentMethod },
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: ActionTypes.SAVE_CART_PAYMENT_METHOD,
        payload: data,
      });

      Router.push('/placeorder');
    } catch (error: any) {
      console.log(getErrorMessage(error));
    }
  };

// ✅ New: Clear Cart action creator
export const clearCart = () => async (dispatch: Dispatch<CartAction>) => {
  try {
    await proshopAPI.delete('api/cart', { withCredentials: true }); // Call backend API

    // Optionally clear localStorage if used
    localStorage.removeItem('cartItems');

    dispatch({
      type: ActionTypes.CLEAR_CART,
    });

    console.log('Cart cleared successfully');
  } catch (error: any) {
    console.log(getErrorMessage(error));
  }
};
