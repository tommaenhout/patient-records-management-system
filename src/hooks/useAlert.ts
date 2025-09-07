import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showAlert, hideAlert, clearAlert } from '../store/slices/alertSlice';

export const useAlert = () => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector((state) => state.alert);

  const showAlertAction = useCallback((message: string, isSuccess: boolean = false, duration: number = 3) => {
    dispatch(showAlert({ message, isSuccess, duration }));
  }, [dispatch]);

  const hideAlertAction = useCallback(() => {
    dispatch(hideAlert());
  }, [dispatch]);

  const clearAlertAction = useCallback(() => {
    dispatch(clearAlert());
  }, [dispatch]);

  return {
    alert,
    showAlert: showAlertAction,
    hideAlert: hideAlertAction,
    clearAlert: clearAlertAction,
  };
};


