import { configureStore } from '@reduxjs/toolkit';
import { miningPoolsApi } from './api/miningPoolsApi';
import miningPoolsReducer from './slices/miningPoolsSlice';

export const store = configureStore({
  reducer: {
    [miningPoolsApi.reducerPath]: miningPoolsApi.reducer,
    miningPools: miningPoolsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      },
    }).concat(miningPoolsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 