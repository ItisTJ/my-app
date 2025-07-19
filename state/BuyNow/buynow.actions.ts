// src/state/BuyNow/buynow.actions.ts

import { BuyNowActionTypes } from './buynow.action-types';

export type BuyNowAction = SetBuyNowItem | ClearBuyNowItem;

export interface SetBuyNowItem {
  type: BuyNowActionTypes.SET_BUY_NOW_ITEM;
  payload: any; // Replace `any` with your product + qty interface if available
}

export interface ClearBuyNowItem {
  type: BuyNowActionTypes.CLEAR_BUY_NOW_ITEM;
}
