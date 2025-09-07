import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PatientCard from '../../components/molecules/PatientCard/index';
import type { PatientRecord } from '../../interfaces/patient';
import patientsReducer from '@/store/slices/patientsSlice';
import alertReducer from '@/store/slices/alertSlice';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: {
      children?: React.ReactNode;
      onClick?: (e: React.MouseEvent) => void;
      className?: string;
      initial?: Record<string, unknown>;
      animate?: Record<string, unknown>;
      exit?: Record<string, unknown>;
      transition?: Record<string, unknown>;
      key?: string;
    } & Record<string, unknown>) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

// Mock the Avatar component
jest.mock('../../components/atoms/Avatar', () => {
  return function MockAvatar({ name, size }: { name: string; size: string }) {
    return <div data-testid="avatar" data-name={name} data-size={size}>Avatar</div>;
  };
});

// Mock SVG components
jest.mock('@/components/svg/Edit', () => {
  return function MockEdit() {
    return <span data-testid="edit-icon">Edit</span>;
  };
});

jest.mock('@/components/svg/Expand', () => {
  return function MockExpand({ className }: { className?: string }) {
    return <span data-testid="expand-icon" className={className}>Expand</span>;
  };
});

jest.mock('@/components/svg/Web', () => {
  return function MockWeb({ className }: { className?: string }) {
    return <span data-testid="web-icon" className={className}>Web</span>;
  };
});

// Mock PatientModalForm to avoid Redux dependency issues
jest.mock('@/components/molecules/PatientModalForm', () => {
  return {
    PatientModalForm: ({ isOpen }: { isOpen: boolean }) => {
      return isOpen ? <div data-testid="patient-modal">Modal</div> : null;
    },
  };
});

// Create mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      patients: patientsReducer,
      alert: alertReducer,
    },
    preloadedState: {
      patients: {
        patients: [],
        filteredPatients: [],
      },
      alert: {
        message: '',
        isVisible: false,
        isSuccess: false,
        duration: 3000,
      },
    },
  });
};

// Helper function to render with Redux Provider
const renderWithProvider = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('PatientCard Component', () => {
  const mockPatient: PatientRecord = {
    id: '123',
    name: 'John Doe',
    createdAt: '2024-06-14T10:30:00Z',
    description: 'This is a test description for the patient card component.',
    website: 'https://example.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  const minimalPatient: PatientRecord = {
    id: '456',
    name: 'Jane Smith',
    createdAt: '2024-06-15T14:20:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders patient card with basic information', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/Added Jun 14, 2024/)).toBeInTheDocument();
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderWithProvider(<PatientCard patient={mockPatient} className="custom-class" />);
      const cardElement = container.firstChild as HTMLElement;
      
      expect(cardElement).toHaveClass('custom-class');
    });

    it('passes correct props to Avatar component', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-name', 'John Doe');
      expect(avatar).toHaveAttribute('data-size', 'md');
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('starts in collapsed state by default', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      // Content should not be visible initially
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
      expect(screen.queryByText('Website')).not.toBeInTheDocument();
      expect(screen.queryByText('ID: 123')).not.toBeInTheDocument();
    });

    it('expands when expand button is clicked', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('ID: 123')).toBeInTheDocument();
    });

    it('collapses when expand button is clicked again', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      
      // Expand first
      fireEvent.click(expandButton!);
      expect(screen.getByText('Description')).toBeInTheDocument();
      
      // Then collapse
      fireEvent.click(expandButton!);
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('applies correct rotation class to expand icon', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandIcon = screen.getByTestId('expand-icon');
      const expandButton = expandIcon.closest('button');
      
      // Initially should have rotate-180 class (collapsed state)
      expect(expandIcon).toHaveClass('rotate-180');
      
      // After clicking, should not have rotate-180 class (expanded state)
      fireEvent.click(expandButton!);
      expect(expandIcon).not.toHaveClass('rotate-180');
    });
  });

  describe('Conditional Content Rendering', () => {
    it('shows description section when patient has description', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText(mockPatient.description!)).toBeInTheDocument();
    });

    it('shows website section when patient has website', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByTestId('web-icon')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
    });

    it('does not show description section when patient has no description', () => {
      renderWithProvider(<PatientCard patient={minimalPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('does not show website section when patient has no website', () => {
      renderWithProvider(<PatientCard patient={minimalPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      expect(screen.queryByText('Website')).not.toBeInTheDocument();
      expect(screen.queryByTestId('web-icon')).not.toBeInTheDocument();
    });
  });

  describe('Website URL Formatting', () => {
    it('displays formatted website URL in link text', () => {
      const patientWithPlainUrl: PatientRecord = {
        ...mockPatient,
        website: 'example.com'
      };
      
      renderWithProvider(<PatientCard patient={patientWithPlainUrl} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveTextContent('https://example.com');
    });

    it('handles URLs that already have protocol', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveTextContent('https://example.com');
    });
  });

  describe('Footer Information', () => {
    it('displays patient ID and formatted date in footer', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      expect(screen.getByText('ID: 123')).toBeInTheDocument();
      expect(screen.getByText('Jun 14, 2024')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      // Check header date
      expect(screen.getByText(/Added Jun 14, 2024/)).toBeInTheDocument();
      
      // Check footer date (when expanded)
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      expect(screen.getByText('Jun 14, 2024')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles for interactive elements', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // Edit and Expand buttons
    });

    it('provides proper link attributes for website', () => {
      renderWithProvider(<PatientCard patient={mockPatient} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Edge Cases', () => {
    it('handles patient with empty string values', () => {
      const patientWithEmptyValues: PatientRecord = {
        id: '789',
        name: 'Empty Patient',
        createdAt: '2024-06-16T12:00:00Z',
        description: '',
        website: ''
      };
      
      renderWithProvider(<PatientCard patient={patientWithEmptyValues} />);
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      // Should not show sections with empty values
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
      expect(screen.queryByText('Website')).not.toBeInTheDocument();
    });

    it('handles patient with undefined optional fields', () => {
      renderWithProvider(<PatientCard patient={minimalPatient} />);
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText(/Added Jun 15, 2024/)).toBeInTheDocument();
      
      const expandButton = screen.getByTestId('expand-icon').closest('button');
      fireEvent.click(expandButton!);
      
      expect(screen.getByText('ID: 456')).toBeInTheDocument();
    });
  });
});
