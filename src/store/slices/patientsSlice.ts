import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PatientRecord, Patients, NewPatientRecord } from '../../interfaces/patient';
import { v4 as uuidv4 } from 'uuid';

interface PatientsState {
  patients: Patients;
  filteredPatients: Patients;
}

const initialState: PatientsState = {
  patients: [],
  filteredPatients: [],
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patients>) => {
      state.patients = action.payload;
      state.filteredPatients = action.payload;
    },
    addPatient: (state, action: PayloadAction<NewPatientRecord>) => {
      const newPatient: PatientRecord = {
        ...action.payload,
        id: uuidv4()
      };
      state.patients.push(newPatient);
      state.filteredPatients.push(newPatient);
    },
    updatePatient: (state, action: PayloadAction<PatientRecord>) => {
      const index = state.patients.findIndex((p: PatientRecord) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
      const filteredIndex = state.filteredPatients.findIndex((p: PatientRecord) => p.id === action.payload.id);
      if (filteredIndex !== -1) {
        state.filteredPatients[filteredIndex] = action.payload;
      }
    },
    filterPatients: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase().trim();
      if (query === '') {
        state.filteredPatients = state.patients;
      } else {
        state.filteredPatients = state.patients.filter((p: PatientRecord) => 
          p.name.toLowerCase().includes(query)
        );
      }
    },
  },
});

export const {
  setPatients,
  addPatient,
  updatePatient,
  filterPatients,
} = patientsSlice.actions;

export default patientsSlice.reducer;
