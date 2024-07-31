import { configureStore } from '@reduxjs/toolkit';
import { pmsApi } from 'features/pmsApi';

const store = configureStore({
  reducer: {
      [pmsApi.reducerPath]: pmsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pmsApi.middleware),
})

export default store;