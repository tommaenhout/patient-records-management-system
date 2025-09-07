import { useEffect, useCallback, useState } from 'react';
import type { Patients, PatientRecord } from '../interfaces/patient';
import { useAlert } from './useAlert';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPatients } from '../store/slices/patientsSlice';

interface UseGetPatientsReturn {
  patients: Patients;
  loading: boolean;
  refetch: () => void;
}

export const useGetPatients = (): UseGetPatientsReturn => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const { patients } = useAppSelector((state) => state.patients);
  const { showAlert } = useAlert();

  const fetchPatients = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const response = await fetch('https://63bedcf7f5cfc0949b634fc8.mockapi.io/users', {
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData: PatientRecord[] = await response.json();
      
      const data = rawData.map(patient => ({
        ...patient,
        avatar: typeof patient.avatar === 'string' && patient.avatar.includes('cloudflare-ipfs.com') 
          ? undefined 
          : patient.avatar
      }));
      
      if (!signal?.aborted) {
        dispatch(setPatients(data));
      }
    } catch (err) {
      if (!signal?.aborted) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            return;
          }
          showAlert(err.message, false);
        } else {
          const errorMessage = 'An unexpected error occurred while fetching patients';
          showAlert(errorMessage, false);
        }
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [dispatch, showAlert]);

  const refetch = () => {
    const controller = new AbortController();
    fetchPatients(controller.signal);
  };

  useEffect(() => {
    const controller = new AbortController();
    
    fetchPatients(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchPatients]);

  return {
    patients,
    loading,
    refetch,
  };
};