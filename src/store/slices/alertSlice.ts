import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AlertState {
  message: string;
  isVisible: boolean;
  duration: number;
  isSuccess: boolean;
}

const initialState: AlertState = {
  message: '',
  isVisible: false,
  duration: 3,
  isSuccess: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<{ message: string; isSuccess?: boolean; duration?: number }>) => {
      state.message = action.payload.message;
      state.isVisible = true;
      state.isSuccess = action.payload.isSuccess ?? false;
      state.duration = action.payload.duration ?? 3;
    },
    hideAlert: (state) => {
      state.isVisible = false;
    },
    clearAlert: (state) => {
      state.message = '';
      state.isVisible = false;
      state.duration = 3;
      state.isSuccess = false;
    },
  },
});

export const { showAlert, hideAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
