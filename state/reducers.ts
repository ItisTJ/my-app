import { combineReducers } from 'redux';
import { cartReducer } from './Cart/cart.reducers';
import {
  orderDeliverReducer,
  orderReducer,
  ordersReducer,
  userOrdersReducer,
} from './Order/order.reducers';
import {
  productCreateReducer,
  productCreateReviewReducer,
  productDeleteReducer,
  productEditReducer,
  productReducer,
  productsReducer,
  productsTopRatedReducer,
} from './Products/products.reducers';
import {
  userDetailsReducer,
  userEditReducer,
  userLoginReducer,
  userRegisterReducer,
  usersReducer,
  userUpdateReducer,
} from './User/user.reducers';


import { sliderReducer } from './Slider/slider.reducers';


export const reducers = combineReducers({
  products: productsReducer as never,
  productsTopRated: productsTopRatedReducer as never,
  product: productReducer as never,
  productDelete: productDeleteReducer as never,
  productCreate: productCreateReducer as never,
  productEdit: productEditReducer as never,
  productCreateReview: productCreateReviewReducer as never,
  cart: cartReducer as never,
  user: userDetailsReducer as never,
  userLogin: userLoginReducer as never,
  userRegister: userRegisterReducer as never,
  userUpdate: userUpdateReducer as never,
  userEdit: userEditReducer as never,
  order: orderReducer as never,
  orderDeliver: orderDeliverReducer as never, //I have added the as never to fix the error
  orders: ordersReducer as never,
  userOrders: userOrdersReducer as never,
  users: usersReducer as never,
  slider: sliderReducer as never,
});

export type RootState = ReturnType<typeof reducers>;
