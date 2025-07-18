// src/state/BuyNow/buynow.action-creators.ts

import { Dispatch } from 'redux';
import { BuyNowActionTypes } from './buynow.action-types';
import { BuyNowAction } from './buynow.actions';

// Synchronous action creator to set BuyNow item (product + qty)
export const setBuyNowItem =
  (item: any) => (dispatch: Dispatch<BuyNowAction>) => {
    dispatch({
      type: BuyNowActionTypes.SET_BUY_NOW_ITEM,
      payload: item,
    });
  };

// Synchronous action creator to clear BuyNow item
export const clearBuyNowItem = () => (dispatch: Dispatch<BuyNowAction>) => {
  dispatch({
    type: BuyNowActionTypes.CLEAR_BUY_NOW_ITEM,
  });
};
