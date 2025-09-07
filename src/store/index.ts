import { configureStore } from '@reduxjs/toolkit';
import patientsReducer from './slices/patientsSlice';
import alertReducer from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
