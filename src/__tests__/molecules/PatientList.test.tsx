import { render, screen } from '@testing-library/react';
import PatientList from '../../components/molecules/PatientList';
import type { PatientRecord } from '../../interfaces/patient';

// Mock the PatientCard component
jest.mock('../../components/molecules/PatientCard', () => {
  return function MockPatientCard({ patient }: { patient: PatientRecord }) {
    return (
      <div data-testid="patient-card" data-patient-id={patient.id}>
        {patient.name}
      </div>
    );
  };
});

// Mock the UserCardSkeleton component
jest.mock('../../components/skeletons/UserCardSkeleton', () => {
  return function MockUserCardSkeleton({ className }: { className?: string }) {
    return <div data-testid="skeleton-card" className={className}>Loading...</div>;
  };
});

describe('PatientList Component', () => {
  const mockPatients: PatientRecord[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      createdAt: '2024-06-10T09:15:00Z',
      description: 'Regular checkup patient',
      website: 'https://alice-portfolio.com',
      avatar: 'https://example.com/alice.jpg'
    },
    {
      id: '2',
      name: 'Bob Smith',
      createdAt: '2024-06-11T14:30:00Z',
      description: 'Follow-up appointment',
      avatar: 'https://example.com/bob.jpg'
    },
    {
      id: '3',
      name: 'Carol Davis',
      createdAt: '2024-06-12T11:45:00Z',
      website: 'carol-blog.net'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders skeleton cards when loading is true', () => {
      render(<PatientList patients={[]} loading={true} />);
      
      const skeletonCards = screen.getAllByTestId('skeleton-card');
      expect(skeletonCards).toHaveLength(6);
    });

    it('applies correct grid classes when loading', () => {
      const { container } = render(<PatientList patients={[]} loading={true} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });

    it('applies w-full class to skeleton cards', () => {
      render(<PatientList patients={[]} loading={true} />);
      
      const skeletonCards = screen.getAllByTestId('skeleton-card');
      skeletonCards.forEach(card => {
        expect(card).toHaveClass('w-full');
      });
    });

    it('does not render patient cards when loading', () => {
      render(<PatientList patients={mockPatients} loading={true} />);
      
      expect(screen.queryByTestId('patient-card')).not.toBeInTheDocument();
      expect(screen.queryByText('No patients found')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty message when no patients and not loading', () => {
      render(<PatientList patients={[]} loading={false} />);
      
      expect(screen.getByText('No patients found')).toBeInTheDocument();
    });

    it('applies correct styling to empty state', () => {
      render(<PatientList patients={[]} loading={false} />);
      
      const emptyContainer = screen.getByText('No patients found').parentElement;
      expect(emptyContainer).toHaveClass('text-center', 'py-8');
    });

    it('does not render grid when empty and not loading', () => {
      const { container } = render(<PatientList patients={[]} loading={false} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).not.toBeInTheDocument();
    });
  });

  describe('Patient Rendering', () => {
    it('renders all patients when provided', () => {
      render(<PatientList patients={mockPatients} loading={false} />);
      
      const patientCards = screen.getAllByTestId('patient-card');
      expect(patientCards).toHaveLength(3);
      
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Carol Davis')).toBeInTheDocument();
    });

    it('passes correct patient data to PatientCard components', () => {
      render(<PatientList patients={mockPatients} loading={false} />);
      
      const patientCards = screen.getAllByTestId('patient-card');
      
      expect(patientCards[0]).toHaveAttribute('data-patient-id', '1');
      expect(patientCards[1]).toHaveAttribute('data-patient-id', '2');
      expect(patientCards[2]).toHaveAttribute('data-patient-id', '3');
    });

    it('applies correct grid layout for patients', () => {
      const { container } = render(<PatientList patients={mockPatients} loading={false} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });

    it('does not render empty message when patients exist', () => {
      render(<PatientList patients={mockPatients} loading={false} />);
      
      expect(screen.queryByText('No patients found')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <PatientList patients={mockPatients} loading={false} className="custom-class" />
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('custom-class');
    });

    it('applies custom className to empty state', () => {
      const { container } = render(
        <PatientList patients={[]} loading={false} className="custom-empty-class" />
      );
      
      const emptyContainer = container.firstChild as HTMLElement;
      expect(emptyContainer).toHaveClass('custom-empty-class');
    });

    it('applies custom className to loading state', () => {
      const { container } = render(
        <PatientList patients={[]} loading={true} className="custom-loading-class" />
      );
      
      const loadingContainer = container.firstChild as HTMLElement;
      expect(loadingContainer).toHaveClass('custom-loading-class');
    });
  });
  describe('Props Handling', () => {
    it('handles undefined loading prop (defaults to false)', () => {
      render(<PatientList patients={mockPatients} />);
      
      expect(screen.getAllByTestId('patient-card')).toHaveLength(3);
      expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single patient correctly', () => {
      const singlePatient = [mockPatients[0]];
      render(<PatientList patients={singlePatient} loading={false} />);
      
      const patientCards = screen.getAllByTestId('patient-card');
      expect(patientCards).toHaveLength(1);
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    it('handles large number of patients', () => {
      const manyPatients = Array.from({ length: 20 }, (_, index) => ({
        id: `patient-${index}`,
        name: `Patient ${index}`,
        createdAt: '2024-06-10T09:15:00Z'
      }));
      
      render(<PatientList patients={manyPatients} loading={false} />);
      
      const patientCards = screen.getAllByTestId('patient-card');
      expect(patientCards).toHaveLength(20);
    });

    it('prioritizes loading state over empty state', () => {
      render(<PatientList patients={[]} loading={true} />);
      
      expect(screen.getAllByTestId('skeleton-card')).toHaveLength(6);
      expect(screen.queryByText('No patients found')).not.toBeInTheDocument();
    });

    it('prioritizes loading state over patient data', () => {
      render(<PatientList patients={mockPatients} loading={true} />);
      
      expect(screen.getAllByTestId('skeleton-card')).toHaveLength(6);
      expect(screen.queryByTestId('patient-card')).not.toBeInTheDocument();
    });
  });
});