import { configureStore } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { reducers, RootState } from './reducers';
 // Adjust the path based on your project structure

let store: ReturnType<typeof initStore> | undefined;

function initStore(initialState?: Partial<RootState>) {
  return configureStore({   //createStore is replaced with configureStore
    reducer: reducers, 
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export const initializeStore = (preloadedState?: Partial<RootState>) => {
  let _store = store ?? initStore(preloadedState);

  if (store && preloadedState) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  if (typeof window === 'undefined') return _store;
  if (!store) store = _store;

  return store;
};

export const useStore = (initialState?: Partial<RootState>) => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
};

