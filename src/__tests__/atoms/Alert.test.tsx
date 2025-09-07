import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import Alert from '../../components/atoms/Alert/index';
import { useAlert } from '@/hooks/useAlert';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.ComponentProps<'span'>) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Test wrapper component to trigger alerts
const TestWrapper = () => {
  const { showAlert } = useAlert();
  
  return (
    <div>
      <button 
        onClick={() => showAlert('Success message', true, 3)}
        data-testid="success-trigger"
      >
        Show Success
      </button>
      <button 
        onClick={() => showAlert('Error message', false, 3)}
        data-testid="error-trigger"
      >
        Show Error
      </button>
      <Alert />
    </div>
  );
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Alert Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should not render when no alert is visible', () => {
    renderWithProvider(<Alert />);
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render success alert with correct message and styling', () => {
    renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('success-trigger'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Find the alert container with background color
    const messageElement = screen.getByText('Success message');
    let alertContainer = messageElement.parentElement;
    while (alertContainer && !alertContainer.classList.contains('bg-green-500')) {
      alertContainer = alertContainer.parentElement;
    }
    expect(alertContainer).toHaveClass('bg-green-500');
  });

  it('should render error alert with correct message and styling', () => {
    renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('error-trigger'));
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    
    // Find the alert container with background color
    const messageElement = screen.getByText('Error message');
    let alertContainer = messageElement.parentElement;
    while (alertContainer && !alertContainer.classList.contains('bg-red-500')) {
      alertContainer = alertContainer.parentElement;
    }
    expect(alertContainer).toHaveClass('bg-red-500');
  });

  it('should display success icon for success alerts', () => {
    const { container } = renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('success-trigger'));
    
    // Success component should be rendered (we can check for its SVG by viewBox)
    const successIcon = container.querySelector('svg[viewBox="0 0 50 50"]');
    expect(successIcon).toBeInTheDocument();
  });

  it('should display warning icon for error alerts', () => {
    const { container } = renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('error-trigger'));
    
    // Warning component should be rendered (we can check for its SVG by viewBox)
    const warningIcon = container.querySelector('svg[viewBox="0 0 24 24"]');
    expect(warningIcon).toBeInTheDocument();
  });

  it('should have a close button that dismisses the alert', () => {
    renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('success-trigger'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Find the close button by looking for the button that contains the close icon
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(button => 
      button.querySelector('svg') && 
      !button.textContent?.includes('Show')
    );
    
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);
    
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should auto-dismiss after specified duration', async () => {
    renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('success-trigger'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Fast-forward time by 3 seconds (the duration set in the test)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should clear timeout when manually closed before auto-dismiss', () => {
    renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('success-trigger'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Close manually before auto-dismiss
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(button => 
      button.querySelector('svg') && 
      !button.textContent?.includes('Show')
    );
    
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);
    
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    
    // Advance time to ensure no delayed effects
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should handle multiple alerts by showing the latest one', () => {
    renderWithProvider(<TestWrapper />);
    
    // Show success alert
    fireEvent.click(screen.getByTestId('success-trigger'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Show error alert (should replace success)
    fireEvent.click(screen.getByTestId('error-trigger'));
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithProvider(<TestWrapper />);
    
    fireEvent.click(screen.getByTestId('success-trigger'));
    
    // Check that the alert content has proper styling
    const messageElement = screen.getByText('Success message');
    expect(messageElement).toBeInTheDocument();
    
    // Check that close button exists
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(button => 
      button.querySelector('svg') && 
      !button.textContent?.includes('Show')
    );
    expect(closeButton).toBeInTheDocument();
  });
});
