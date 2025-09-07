import patientsReducer, { 
  setPatients, 
  addPatient, 
  updatePatient, 
  filterPatients 
} from '../../store/slices/patientsSlice';
import type { PatientRecord, NewPatientRecord } from '../../interfaces/patient';

// Mock uuid to have predictable IDs in tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234')
}));

describe('patientsSlice', () => {
  const initialState = {
    patients: [],
    filteredPatients: [],
  };

  const mockPatient1: PatientRecord = {
    id: '1',
    name: 'John Doe',
    description: 'Test patient 1',
    website: 'https://example.com',
    avatar: 'https://example.com/avatar1.jpg',
    createdAt: '2024-01-01T00:00:00Z'
  };

  const mockPatient2: PatientRecord = {
    id: '2',
    name: 'Jane Smith',
    description: 'Test patient 2',
    website: 'https://example2.com',
    avatar: 'https://example.com/avatar2.jpg',
    createdAt: '2024-01-02T00:00:00Z'
  };

  const mockNewPatient: NewPatientRecord = {
    name: 'Bob Johnson',
    description: 'New test patient',
    website: 'https://example3.com',
    avatar: 'https://example.com/avatar3.jpg',
    createdAt: '2024-01-03T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(patientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setPatients', () => {
    it('should set patients and filteredPatients to the provided array', () => {
      const patients = [mockPatient1, mockPatient2];
      const action = setPatients(patients);
      const state = patientsReducer(initialState, action);

      expect(state).toEqual({
        patients: patients,
        filteredPatients: patients,
      });
    });

    it('should replace existing patients', () => {
      const existingState = {
        patients: [mockPatient1],
        filteredPatients: [mockPatient1],
      };
      
      const newPatients = [mockPatient2];
      const action = setPatients(newPatients);
      const state = patientsReducer(existingState, action);

      expect(state).toEqual({
        patients: newPatients,
        filteredPatients: newPatients,
      });
    });

    it('should handle empty array', () => {
      const existingState = {
        patients: [mockPatient1, mockPatient2],
        filteredPatients: [mockPatient1],
      };
      
      const action = setPatients([]);
      const state = patientsReducer(existingState, action);

      expect(state).toEqual({
        patients: [],
        filteredPatients: [],
      });
    });
  });

  describe('addPatient', () => {
    it('should add a new patient with generated ID', () => {
      const action = addPatient(mockNewPatient);
      const state = patientsReducer(initialState, action);

      const expectedPatient = {
        ...mockNewPatient,
        id: 'mock-uuid-1234'
      };

      expect(state.patients).toHaveLength(1);
      expect(state.patients[0]).toEqual(expectedPatient);
      expect(state.filteredPatients).toHaveLength(1);
      expect(state.filteredPatients[0]).toEqual(expectedPatient);
    });

    it('should add patient to existing patients array', () => {
      const existingState = {
        patients: [mockPatient1],
        filteredPatients: [mockPatient1],
      };

      const action = addPatient(mockNewPatient);
      const state = patientsReducer(existingState, action);

      expect(state.patients).toHaveLength(2);
      expect(state.patients[0]).toEqual(mockPatient1);
      expect(state.patients[1]).toEqual({
        ...mockNewPatient,
        id: 'mock-uuid-1234'
      });
      expect(state.filteredPatients).toHaveLength(2);
    });

    it('should handle patient with minimal required fields', () => {
      const minimalPatient: NewPatientRecord = {
        name: 'Minimal Patient',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const action = addPatient(minimalPatient);
      const state = patientsReducer(initialState, action);

      expect(state.patients[0]).toEqual({
        ...minimalPatient,
        id: 'mock-uuid-1234'
      });
    });
  });

  describe('updatePatient', () => {
    const existingState = {
      patients: [mockPatient1, mockPatient2],
      filteredPatients: [mockPatient1, mockPatient2],
    };

    it('should update existing patient in both arrays', () => {
      const updatedPatient: PatientRecord = {
        ...mockPatient1,
        name: 'John Doe Updated',
        description: 'Updated description'
      };

      const action = updatePatient(updatedPatient);
      const state = patientsReducer(existingState, action);

      expect(state.patients[0]).toEqual(updatedPatient);
      expect(state.patients[1]).toEqual(mockPatient2);
      expect(state.filteredPatients[0]).toEqual(updatedPatient);
      expect(state.filteredPatients[1]).toEqual(mockPatient2);
    });

    it('should not modify state if patient ID not found', () => {
      const nonExistentPatient: PatientRecord = {
        id: 'non-existent',
        name: 'Non Existent',
        createdAt: '2024-01-01T00:00:00Z'
      };

      const action = updatePatient(nonExistentPatient);
      const state = patientsReducer(existingState, action);

      expect(state).toEqual(existingState);
    });

    it('should update patient only in patients array if not in filtered', () => {
      const stateWithFiltered = {
        patients: [mockPatient1, mockPatient2],
        filteredPatients: [mockPatient1], // Only first patient in filtered
      };

      const updatedPatient: PatientRecord = {
        ...mockPatient2,
        name: 'Jane Smith Updated'
      };

      const action = updatePatient(updatedPatient);
      const state = patientsReducer(stateWithFiltered, action);

      expect(state.patients[1]).toEqual(updatedPatient);
      expect(state.filteredPatients).toHaveLength(1);
      expect(state.filteredPatients[0]).toEqual(mockPatient1);
    });
  });


  describe('filterPatients', () => {
    const existingState = {
      patients: [mockPatient1, mockPatient2],
      filteredPatients: [mockPatient1, mockPatient2],
    };

    it('should filter patients by name (case insensitive)', () => {
      const action = filterPatients('john');
      const state = patientsReducer(existingState, action);

      expect(state.patients).toEqual([mockPatient1, mockPatient2]); // Original unchanged
      expect(state.filteredPatients).toHaveLength(1);
      expect(state.filteredPatients[0]).toEqual(mockPatient1);
    });

    it('should filter patients by partial name match', () => {
      const action = filterPatients('doe');
      const state = patientsReducer(existingState, action);

      expect(state.filteredPatients).toHaveLength(1);
      expect(state.filteredPatients[0]).toEqual(mockPatient1);
    });

    it('should return all patients when query is empty', () => {
      const filteredState = {
        patients: [mockPatient1, mockPatient2],
        filteredPatients: [mockPatient1], // Previously filtered
      };

      const action = filterPatients('');
      const state = patientsReducer(filteredState, action);

      expect(state.filteredPatients).toEqual([mockPatient1, mockPatient2]);
    });

    it('should return all patients when query is only whitespace', () => {
      const filteredState = {
        patients: [mockPatient1, mockPatient2],
        filteredPatients: [mockPatient1],
      };

      const action = filterPatients('   ');
      const state = patientsReducer(filteredState, action);

      expect(state.filteredPatients).toEqual([mockPatient1, mockPatient2]);
    });

    it('should return empty array when no matches found', () => {
      const action = filterPatients('nonexistent');
      const state = patientsReducer(existingState, action);

      expect(state.filteredPatients).toHaveLength(0);
    });

    it('should handle uppercase query', () => {
      const action = filterPatients('JANE');
      const state = patientsReducer(existingState, action);

      expect(state.filteredPatients).toHaveLength(1);
      expect(state.filteredPatients[0]).toEqual(mockPatient2);
    });

    it('should handle mixed case query', () => {
      const action = filterPatients('JaNe SmItH');
      const state = patientsReducer(existingState, action);

      expect(state.filteredPatients).toHaveLength(1);
      expect(state.filteredPatients[0]).toEqual(mockPatient2);
    });
  });

  describe('action creators', () => {
    it('creates setPatients action', () => {
      const patients = [mockPatient1];
      const action = setPatients(patients);
      
      expect(action.type).toBe('patients/setPatients');
      expect(action.payload).toEqual(patients);
    });

    it('creates addPatient action', () => {
      const action = addPatient(mockNewPatient);
      
      expect(action.type).toBe('patients/addPatient');
      expect(action.payload).toEqual(mockNewPatient);
    });

    it('creates updatePatient action', () => {
      const action = updatePatient(mockPatient1);
      
      expect(action.type).toBe('patients/updatePatient');
      expect(action.payload).toEqual(mockPatient1);
    });


    it('creates filterPatients action', () => {
      const action = filterPatients('test query');
      
      expect(action.type).toBe('patients/filterPatients');
      expect(action.payload).toBe('test query');
    });
  });

  describe('complex state transitions', () => {
    it('handles add -> filter -> update sequence', () => {
      // Start with initial state
      let state = patientsReducer(initialState, addPatient(mockNewPatient));
      expect(state.patients).toHaveLength(1);
      expect(state.filteredPatients).toHaveLength(1);

      // Add another patient
      state = patientsReducer(state, addPatient({
        name: 'Alice Wonder',
        createdAt: '2024-01-04T00:00:00Z'
      }));
      expect(state.patients).toHaveLength(2);

      // Filter by name
      state = patientsReducer(state, filterPatients('bob'));
      expect(state.filteredPatients).toHaveLength(1);
      expect(state.filteredPatients[0].name).toBe('Bob Johnson');

      // Update the filtered patient (find Bob Johnson in the patients array)
      const bobPatient = state.patients.find(p => p.name === 'Bob Johnson');
      const updatedPatient = {
        ...bobPatient!,
        name: 'Bob Johnson Updated'
      };
      state = patientsReducer(state, updatePatient(updatedPatient));
      expect(state.patients.find(p => p.id === bobPatient!.id)?.name).toBe('Bob Johnson Updated');

      // Clear filter
      state = patientsReducer(state, filterPatients(''));
      expect(state.filteredPatients).toHaveLength(2);
    });

    it('maintains filter state after patient operations', () => {
      // Set up initial patients
      let state = patientsReducer(initialState, setPatients([mockPatient1, mockPatient2]));
      
      // Apply filter
      state = patientsReducer(state, filterPatients('john'));
      expect(state.filteredPatients).toHaveLength(1);

      // Add new patient - should appear in both arrays
      state = patientsReducer(state, addPatient({
        name: 'Johnny Cash',
        createdAt: '2024-01-05T00:00:00Z'
      }));
      expect(state.patients).toHaveLength(3);
      expect(state.filteredPatients).toHaveLength(2); // Both Johns should be visible

      // Update patient that matches filter
      const updatedPatient = {
        ...state.patients[0],
        description: 'Updated John'
      };
      state = patientsReducer(state, updatePatient(updatedPatient));
      expect(state.filteredPatients[0].description).toBe('Updated John');
    });
  });
});
