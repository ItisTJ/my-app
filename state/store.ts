import { configureStore } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { reducers, RootState as CombinedRootState } from './reducers';

// 👇 Add these exports
let store: ReturnType<typeof initStore> | undefined;

function initStore(initialState?: Partial<CombinedRootState>) {
  return configureStore({
    reducer: reducers,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export const initializeStore = (preloadedState?: Partial<CombinedRootState>) => {
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

export const useStore = (initialState?: Partial<CombinedRootState>) => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
};

// ✅ Add these exports
export type AppStore = ReturnType<typeof initStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
