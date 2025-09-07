import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Avatar from '../../components/atoms/Avatar/index';

// Mock the AvatarSkeleton component since it was deleted
jest.mock('@/components/skeletons/AvatarSkeleton', () => {
  return function MockAvatarSkeleton({ size }: { size: string }) {
    return <div data-testid="avatar-skeleton" data-size={size}>Loading...</div>;
  };
});

describe('Avatar Component', () => {
  const defaultProps = {
    name: 'John Doe',
  };

  beforeEach(() => {
    // Reset any global mocks
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with initials when no avatar image is provided', () => {
      render(<Avatar {...defaultProps} />);
      
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders with custom name initials', () => {
      render(<Avatar name="Jane Smith" />);
      
      expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('renders with single name initial', () => {
      render(<Avatar name="Madonna" />);
      
      expect(screen.getByText('M')).toBeInTheDocument();
    });
  });

  describe('Image Avatar', () => {
    const imageUrl = 'https://example.com/avatar.jpg';

    it('renders image when avatar prop is provided', () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} />);
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', imageUrl);
      expect(image).toHaveAttribute('alt', "John Doe's avatar");
    });

    it('shows initials when image fails to load', async () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} />);
      
      const image = screen.getByRole('img');
      
      // Simulate image error
      fireEvent.error(image);
      
      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument();
      });
    });

    it('shows image with full opacity when loaded', async () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} />);
      
      const image = screen.getByRole('img');
      
      // Initially image should have opacity-0
      expect(image).toHaveClass('opacity-0');
      
      // Simulate image load
      fireEvent.load(image);
      
      await waitFor(() => {
        expect(image).toHaveClass('opacity-100');
      });
    });

    it('uses lazy loading for images with high index', () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} index={15} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('uses eager loading for images with low index', () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} index={5} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'eager');
    });
  });

  describe('Loading States', () => {
    const imageUrl = 'https://example.com/avatar.jpg';

    it('shows skeleton while image is loading', () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} />);
      
      // Before image loads, skeleton should be present
      expect(screen.getByTestId('avatar-skeleton')).toBeInTheDocument();
    });

    it('hides skeleton after image loads', async () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} />);
      
      const image = screen.getByRole('img');
      
      // Simulate image load
      fireEvent.load(image);
      
      await waitFor(() => {
        expect(screen.queryByTestId('avatar-skeleton')).not.toBeInTheDocument();
      });
    });

    it('passes correct size to skeleton', () => {
      render(<Avatar {...defaultProps} avatar={imageUrl} size="lg" />);
      
      const skeleton = screen.getByTestId('avatar-skeleton');
      expect(skeleton).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty name gracefully', () => {
      render(<Avatar name="" />);
      
      // Should still render the component without crashing
      const { container } = render(<Avatar name="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined avatar gracefully', () => {
      render(<Avatar {...defaultProps} avatar={undefined} />);
      
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('handles empty string avatar', () => {
      render(<Avatar {...defaultProps} avatar="" />);
      
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('applies default index when not provided', () => {
      render(<Avatar {...defaultProps} avatar="https://example.com/avatar.jpg" />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'eager'); // default index is 0
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for images', () => {
      render(<Avatar name="Jane Doe" avatar="https://example.com/avatar.jpg" />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', "Jane Doe's avatar");
    });

    it('maintains proper semantic structure', () => {
      const { container } = render(<Avatar {...defaultProps} />);
      const avatarElement = container.firstChild as HTMLElement;
      
      expect(avatarElement.tagName).toBe('DIV');
      expect(avatarElement).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });
  });
});
