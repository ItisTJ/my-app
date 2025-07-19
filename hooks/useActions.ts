import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import {
  CartActionCreators,
  OrderActionCreators,
  ProductsActionCreators,
  UserActionCreators,
  SliderActionCreators,
  FooterActionCreators,
  HeaderActionCreators,
  ServicesActionCreators,
  BuyNowActionCreators,  // ✅ Import BuyNow actions here
} from '../state';

export const useProductsActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(ProductsActionCreators, dispatch);
  }, [dispatch]);
};

export const useSliderActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(SliderActionCreators, dispatch);
  }, [dispatch]);
};

export const useFooterActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(FooterActionCreators, dispatch);
  }, [dispatch]);
};

export const useHeaderActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(HeaderActionCreators, dispatch);
  }, [dispatch]);
};

export const useCartActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(CartActionCreators, dispatch);
  }, [dispatch]);
};

export const useUserActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(UserActionCreators, dispatch);
  }, [dispatch]);
};

export const useOrderActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(OrderActionCreators, dispatch);
  }, [dispatch]);
};

export const useServicesActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(ServicesActionCreators, dispatch);
  }, [dispatch]);
};

// ✅ New hook for BuyNow actions
export const useBuyNowActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(BuyNowActionCreators, dispatch);
  }, [dispatch]);
};
