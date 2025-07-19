// src/state/BuyNow/buynow.reducer.ts

import { BuyNowActionTypes } from './buynow.action-types';
import { BuyNowAction } from './buynow.actions';

interface BuyNowState {
  item: any | null; // Replace `any` with your product + qty interface if available
}

export const buyNowInitialState: BuyNowState = {
  item: null,
};

export const buyNowReducer = (
  state: BuyNowState = buyNowInitialState,
  action: BuyNowAction
): BuyNowState => {
  switch (action.type) {
    case BuyNowActionTypes.SET_BUY_NOW_ITEM:
      return {
        ...state,
        item: action.payload,
      };

    case BuyNowActionTypes.CLEAR_BUY_NOW_ITEM:
      return {
        ...state,
        item: null,
      };

    default:
      return state;
  }
};
