import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from '../../components/atoms/Modal';

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

// Mock the Close component
jest.mock('../../components/svg/Close', () => {
  return function MockClose() {
    return <span data-testid="close-icon">×</span>;
  };
});

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
    
    mockOnClose.mockClear();
    
    document.body.style.overflow = '';
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
    
    document.body.style.overflow = '';
  });

  it('renders modal content when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render modal content when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  // it('calls onClose when backdrop is clicked', () => {
  //   render(<Modal {...defaultProps} />);
    
  //   const backdrop = screen.getByText('Modal Content').closest('[class*="fixed"]');
  //   fireEvent.click(backdrop!);
    
  //   expect(mockOnClose).toHaveBeenCalledTimes(1);
  // });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByTestId('close-icon').closest('div');
    fireEvent.click(closeButton!);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const modalContent = screen.getByText('Modal Content');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(window, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when other keys are pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: 'Space' });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('sets body overflow to hidden when modal is open', () => {
    render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('resets body overflow when modal is closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('');
  });

  it('renders close icon', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    const customChildren = (
      <div>
        <h1>Custom Title</h1>
        <p>Custom paragraph</p>
        <button>Custom Button</button>
      </div>
    );
    
    render(<Modal {...defaultProps}>{customChildren}</Modal>);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });
});
