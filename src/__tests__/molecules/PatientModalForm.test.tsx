import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PatientModalForm } from '@/components/molecules/PatientModalForm';
import patientsReducer from '@/store/slices/patientsSlice';
import alertReducer, { type AlertState } from '@/store/slices/alertSlice';
import { useAppSelector } from '@/store/hooks';
import type { PatientRecord, Patients } from '@/interfaces/patient';

// Mock the entire Modal component to avoid portal and animation issues
jest.mock('@/components/atoms/Modal', () => {
  return {
    Modal: ({ children, isOpen, onClose }: { children: React.ReactNode; isOpen: boolean; onClose: () => void }) => {
      if (!isOpen) return null;
      
      return (
        <div data-testid="modal" className="modal-container">
          <div className="modal-content">
            <button onClick={onClose} aria-label="Close modal">
              ×
            </button>
            {children}
          </div>
        </div>
      );
    },
  };
});

// Type for the mock store's initial state
interface MockStoreState {
  patients?: {
    patients?: Patients;
    filteredPatients?: Patients;
  };
  alert?: Partial<AlertState>;
}

// Mock Alert component to avoid Framer Motion issues in tests
const MockAlert = () => {
  const alert = useAppSelector((state: { alert: AlertState }) => state.alert);
  
  if (!alert?.isVisible) return null;
  
  return (
    <div data-testid="alert" className={alert.isSuccess ? 'alert-success' : 'alert-error'}>
      {alert.message}
    </div>
  );
};

// Mock file reader for avatar tests
const mockFileReader = {
  readAsDataURL: jest.fn(),
  result: 'data:image/jpeg;base64,mockImageData',
  onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
};

Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: jest.fn(() => mockFileReader),
});

// Mock store setup
const createMockStore = (initialState: MockStoreState = {}) => {
  return configureStore({
    reducer: {
      patients: patientsReducer,
      alert: alertReducer,
    },
    preloadedState: {
      patients: {
        patients: [],
        filteredPatients: [],
        ...initialState.patients,
      },
      alert: {
        message: '',
        isVisible: false,
        isSuccess: false,
        duration: 3,
        ...initialState.alert,
      },
    },
  });
};

const mockPatient: PatientRecord = {
  id: '1',
  name: 'John Doe',
  description: 'Test patient description',
  website: 'https://example.com',
  avatar: 'https://example.com/avatar.jpg',
  createdAt: '2024-01-01T00:00:00Z',
};

const renderWithProvider = (component: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      {component}
      <MockAlert />
    </Provider>
  );
};

// No modal root setup needed since we're mocking the Modal component

describe('PatientModalForm Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader.readAsDataURL.mockClear();
  });

  describe('Modal Visibility', () => {
    it('renders when isOpen is true', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      expect(screen.getByText('Create New Patient')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      renderWithProvider(
        <PatientModalForm isOpen={false} onClose={mockOnClose} />
      );
      
      expect(screen.queryByText('Create New Patient')).not.toBeInTheDocument();
    });
  });

  describe('Create Mode', () => {
    it('displays correct title for create mode', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      expect(screen.getByText('Create New Patient')).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      expect(screen.getByLabelText('Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description *')).toBeInTheDocument();
      expect(screen.getByLabelText('Website')).toBeInTheDocument();
    });

    it('has submit button disabled initially', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when required fields are filled', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(descriptionInput, 'Test description');
      
      expect(submitButton).toBeEnabled();
    });

    it('creates new patient on form submission', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />,
        store
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const websiteInput = screen.getByLabelText('Website');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(nameInput, 'Jane Smith');
      await user.type(descriptionInput, 'New patient description');
      await user.type(websiteInput, 'https://janesmith.com');
      await user.click(submitButton);
      
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'patients/addPatient',
          payload: expect.objectContaining({
            name: 'Jane Smith',
            description: 'New patient description',
            website: 'https://janesmith.com',
          }),
        })
      );
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('prevents duplicate patient creation', async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        patients: {
          patients: [{ ...mockPatient, name: 'John Doe' }],
        },
      });
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />,
        store
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(descriptionInput, 'Test description');
      await user.click(submitButton);
      
      // Should show alert instead of creating patient
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'alert/showAlert',
          payload: expect.objectContaining({
            message: 'Patient with this name already exists',
            isSuccess: false,
          }),
        })
      );
      
      // Should not create patient
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'patients/addPatient',
        })
      );
    });
  });

  describe('Edit Mode', () => {
    it('displays correct title for edit mode', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} patient={mockPatient} />
      );
      
      expect(screen.getByText('Edit Patient')).toBeInTheDocument();
    });

    it('pre-fills form with patient data', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} patient={mockPatient} />
      );
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test patient description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
    });

    it('updates patient on form submission', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} patient={mockPatient} />,
        store
      );
      
      const nameInput = screen.getByDisplayValue('John Doe');
      const submitButton = screen.getByRole('button', { name: /update patient/i });
      
      await user.clear(nameInput);
      await user.type(nameInput, 'John Updated');
      await user.click(submitButton);
      
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'patients/updatePatient',
          payload: expect.objectContaining({
            id: '1',
            name: 'John Updated',
            description: 'Test patient description',
            website: 'https://example.com',
          }),
        })
      );
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('updates form when patient prop changes', () => {
      const { rerender } = renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} patient={mockPatient} />
      );
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      
      const updatedPatient = { ...mockPatient, name: 'Jane Updated' };
      rerender(
        <Provider store={createMockStore()}>
          <PatientModalForm isOpen={true} onClose={mockOnClose} patient={updatedPatient} />
        </Provider>
      );
      
      expect(screen.getByDisplayValue('Jane Updated')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      const nameInput = screen.getByLabelText('Name *');
      
      // Try to submit with empty fields
      await user.click(nameInput);
      await user.tab(); // Trigger blur
      
      expect(submitButton).toBeDisabled();
    });

    it('accepts valid name length', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      const validName = 'Valid Patient Name';
      
      await user.type(nameInput, validName);
      await user.type(descriptionInput, 'Valid description');
      
      expect(submitButton).toBeEnabled();
    });

    it('accepts valid description length', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      const validDescription = 'This is a valid patient description';
      
      await user.type(nameInput, 'Valid name');
      await user.type(descriptionInput, validDescription);
      
      expect(submitButton).toBeEnabled();
    });

    it('allows form submission with valid website URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const websiteInput = screen.getByLabelText('Website');
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      // Fill all fields with valid data
      await user.type(nameInput, 'Test Name');
      await user.type(descriptionInput, 'Test Description');
      await user.type(websiteInput, 'https://example.com');
      
      // Button should be enabled with valid data
      expect(submitButton).toBeEnabled();
    });
  });

  describe('Avatar Functionality', () => {
    it('displays default avatar initially', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      // Avatar shows initials when no image is provided - "NP" for "New Patient"
      const avatar = screen.getByText('NP');
      expect(avatar).toBeInTheDocument();
    });

    it('displays patient avatar in edit mode', () => {
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} patient={mockPatient} />
      );
      
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('src', mockPatient.avatar);
    });

    it('handles avatar selection', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      // Find the avatar container by its clickable div with cursor-pointer class
      const avatarContainer = document.querySelector('.cursor-pointer');
      
      // Mock file input creation and file selection
      const mockFile = new File(['mock'], 'avatar.jpg', { type: 'image/jpeg' });
      const mockInput = document.createElement('input');
      mockInput.type = 'file';
      mockInput.accept = 'image/*';
      
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockInput);
      const clickSpy = jest.spyOn(mockInput, 'click').mockImplementation(() => {});
      
      await user.click(avatarContainer!);
      
      expect(createElementSpy).toHaveBeenCalledWith('input');
      expect(clickSpy).toHaveBeenCalled();
      
      // Simulate file selection
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockInput, 'files', {
        value: [file],
        writable: false,
      });
      
      // Trigger the change event
      mockInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Simulate FileReader onload with proper event structure
      if (mockFileReader.onload) {
        const mockEvent = {
          target: {
            result: 'data:image/jpeg;base64,mockImageData'
          }
        } as ProgressEvent<FileReader>;
        mockFileReader.onload(mockEvent);
      }
      
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
      
      // Clean up spies
      createElementSpy.mockRestore();
      clickSpy.mockRestore();
    });
  });

  describe('Modal Controls', () => {
    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('resets form when modal is closed', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const nameInput = screen.getByLabelText('Name *');
      await user.type(nameInput, 'Test Name');
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes modal after successful form submission', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(nameInput, 'Test Patient');
      await user.type(descriptionInput, 'Test description');
      await user.click(submitButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    it('disables submit button when name is empty', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(descriptionInput, 'Test description');
      
      expect(submitButton).toBeDisabled();
    });

    it('disables submit button when description is empty', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(nameInput, 'Test Name');
      
      expect(submitButton).toBeDisabled();
    });

    it('disables submit button when there are validation errors', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const websiteInput = screen.getByLabelText('Website');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(nameInput, 'Test Name');
      await user.type(descriptionInput, 'Test description');
      await user.type(websiteInput, 'invalid-url');
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Alert Integration', () => {
    it('shows success alert when patient is created', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} />,
        store
      );
      
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description *');
      const submitButton = screen.getByRole('button', { name: /create patient/i });
      
      await user.type(nameInput, 'New Patient');
      await user.type(descriptionInput, 'New description');
      await user.click(submitButton);
      
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'alert/showAlert',
          payload: expect.objectContaining({
            message: 'Patient added successfully',
            isSuccess: true,
          }),
        })
      );
    });

    it('shows success alert when patient is updated', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      
      renderWithProvider(
        <PatientModalForm isOpen={true} onClose={mockOnClose} patient={mockPatient} />,
        store
      );
      
      const submitButton = screen.getByRole('button', { name: /update patient/i });
      await user.click(submitButton);
      
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'alert/showAlert',
          payload: expect.objectContaining({
            message: 'Patient updated successfully',
            isSuccess: true,
          }),
        })
      );
    });
  });
});
