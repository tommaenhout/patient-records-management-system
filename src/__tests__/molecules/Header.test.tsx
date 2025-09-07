import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Header } from '../../components/molecules/Header';
import patientsReducer, { filterPatients } from '../../store/slices/patientsSlice';

// Define types for mock components
interface MockSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

// Mock use-debounce
jest.mock('use-debounce', () => ({
  useDebounce: (value: string) => [value], // Return immediately without debouncing for tests
}));

// Mock the child components
jest.mock('../../components/atoms/SearchBar', () => ({
  SearchBar: ({ placeholder, value, onChange, className }: MockSearchBarProps) => (
    <input
      data-testid="search-bar"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={className}
    />
  ),
}));

jest.mock('../../components/atoms/Button', () => ({
  Button: ({ children, onClick, variant, className }: MockButtonProps) => (
    <button
      data-testid="action-button"
      onClick={onClick}
      className={`${variant} ${className}`}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../components/svg/Patients', () => {
  return function MockPatients(props: React.SVGProps<SVGSVGElement>) {
    return <svg data-testid="patients-icon" {...props} />;
  };
});

jest.mock('../../components/svg/Add', () => {
  return function MockAdd(props: React.SVGProps<SVGSVGElement>) {
    return <svg data-testid="add-icon" {...props} />;
  };
});

describe('Header', () => {
  let store: ReturnType<typeof configureStore>;
  let mockDispatch: jest.Mock;

  const createMockStore = () => {
    return configureStore({
      reducer: {
        patients: patientsReducer,
      },
      preloadedState: {
        patients: {
          patients: [],
          filteredPatients: [],
          error: null,
          searchQuery: '',
          selectedPatient: null,
        },
      },
    });
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  beforeEach(() => {
    store = createMockStore();
    mockDispatch = jest.fn();
    store.dispatch = mockDispatch;
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    renderWithProvider(<Header />);
    
    expect(screen.getByText('Patient Records Management')).toBeInTheDocument();
    expect(screen.getByText('Manage and view patient information')).toBeInTheDocument();
    expect(screen.getByTestId('patients-icon')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  it('displays custom title and subtitle correctly', () => {
    renderWithProvider(<Header title="Custom Title" subtitle="Custom Subtitle" />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('renders without subtitle when explicitly set to empty string', () => {
    renderWithProvider(<Header title="Test Title" subtitle="" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Manage and view patient information')).not.toBeInTheDocument();
  });

  it('uses custom search placeholder', () => {
    renderWithProvider(
      <Header searchPlaceholder="Search custom..." />
    );
    
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toHaveAttribute('placeholder', 'Search custom...');
  });

  it('dispatches filterPatients action when search input changes', async () => {
    renderWithProvider(<Header />);
    
    const searchBar = screen.getByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'new search' } });
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: filterPatients.type,
          payload: 'new search'
        })
      );
    });
  });

  it('uses default search placeholder when not provided', () => {
    renderWithProvider(<Header />);
    
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toHaveAttribute('placeholder', 'Search patients...');
  });

  it('displays custom action button text', () => {
    renderWithProvider(
      <Header actionButtonText="Custom Action" />
    );
    
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('uses default action button text when not provided', () => {
    renderWithProvider(<Header />);
    
    expect(screen.getByText('Add Patient')).toBeInTheDocument();
  });

  it('calls onActionClick when action button is clicked', () => {
    const mockOnActionClick = jest.fn();
    
    renderWithProvider(
      <Header onActionClick={mockOnActionClick} />
    );
    
    const actionButton = screen.getByTestId('action-button');
    fireEvent.click(actionButton);
    
    expect(mockOnActionClick).toHaveBeenCalledTimes(1);
  });

  it('works without onActionClick handler', () => {
    renderWithProvider(<Header />);
    
    const actionButton = screen.getByTestId('action-button');
    expect(() => {
      fireEvent.click(actionButton);
    }).not.toThrow();
  });


  it('renders title as h1 element', () => {
    renderWithProvider(<Header title="Test Title" />);
    
    const title = screen.getByText('Test Title');
    expect(title.tagName).toBe('H1');
  });

  it('renders subtitle as p element', () => {
    renderWithProvider(<Header subtitle="Test Subtitle" />);
    
    const subtitle = screen.getByText('Test Subtitle');
    expect(subtitle.tagName).toBe('P');
  });

  it('renders action button correctly', () => {
    renderWithProvider(<Header />);
    
    const button = screen.getByTestId('action-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add Patient');
  });

  it('contains both Add icon and Patients icon', () => {
    renderWithProvider(<Header />);
    
    expect(screen.getByTestId('patients-icon')).toBeInTheDocument();
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
  });

  it('starts with empty search value', () => {
    renderWithProvider(<Header />);
    
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toHaveValue('');
  });

  it('manages internal search state correctly', async () => {
    renderWithProvider(<Header />);
    
    const searchBar = screen.getByTestId('search-bar');
    
    // Initially empty
    expect(searchBar).toHaveValue('');
    
    // Update search value
    fireEvent.change(searchBar, { target: { value: 'test search' } });
    expect(searchBar).toHaveValue('test search');
    
    // Should dispatch filter action
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: filterPatients.type,
          payload: 'test search'
        })
      );
    });
  });
});
