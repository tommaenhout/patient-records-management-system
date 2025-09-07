import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvatarSkeleton from '../../components/skeletons/AvatarSkeleton';

describe('AvatarSkeleton', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with default props', () => {
    const { container } = render(<AvatarSkeleton />);
    
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toBeInTheDocument();
    expect(outerDiv).toHaveClass('absolute', 'inset-0', 'flex', 'items-center', 'justify-center');
  });

  it('renders with default medium size', () => {
    const { container } = render(<AvatarSkeleton />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass('w-12', 'h-12', 'text-sm');
  });

  it('renders with small size', () => {
    const { container } = render(<AvatarSkeleton size="sm" />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass('w-8', 'h-8', 'text-xs');
  });

  it('renders with large size', () => {
    const { container } = render(<AvatarSkeleton size="lg" />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass('w-16', 'h-16', 'text-base');
  });

  it('renders with extra large size', () => {
    const { container } = render(<AvatarSkeleton size="xl" />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass('w-24', 'h-24', 'text-lg');
  });

  it('applies custom className', () => {
    const customClass = 'custom-skeleton-class';
    const { container } = render(<AvatarSkeleton className={customClass} />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass(customClass);
  });

  it('has required skeleton styling classes', () => {
    const { container } = render(<AvatarSkeleton />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass('bg-gray-200', 'animate-pulse', 'rounded-full');
  });

  it('combines size classes with custom className', () => {
    const customClass = 'border-2 border-blue-500';
    const { container } = render(<AvatarSkeleton size="lg" className={customClass} />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass('w-16', 'h-16', 'text-base', 'border-2', 'border-blue-500');
  });

  it('renders with empty className when not provided', () => {
    const { container } = render(<AvatarSkeleton />);
    
    const outerDiv = container.firstChild as HTMLElement;
    const skeletonDiv = outerDiv.firstChild as HTMLElement;
    expect(skeletonDiv).toHaveClass('bg-gray-200', 'animate-pulse', 'rounded-full');
  });

  it('maintains consistent structure regardless of props', () => {
    const { container, rerender } = render(<AvatarSkeleton />);
    
    let outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.children).toHaveLength(1);
    
    rerender(<AvatarSkeleton size="xl" className="custom-class" />);
    
    outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.children).toHaveLength(1);
    expect(outerDiv).toHaveClass('absolute', 'inset-0', 'flex', 'items-center', 'justify-center');
  });

  describe('all size variants', () => {
    const sizes = [
      { size: 'sm' as const, classes: ['w-8', 'h-8', 'text-xs'] },
      { size: 'md' as const, classes: ['w-12', 'h-12', 'text-sm'] },
      { size: 'lg' as const, classes: ['w-16', 'h-16', 'text-base'] },
      { size: 'xl' as const, classes: ['w-24', 'h-24', 'text-lg'] },
    ];

    sizes.forEach(({ size, classes }) => {
      it(`renders correctly with ${size} size`, () => {
        const { container } = render(<AvatarSkeleton size={size} />);
        
        const outerDiv = container.firstChild as HTMLElement;
        const skeletonDiv = outerDiv.firstChild as HTMLElement;
        classes.forEach(className => {
          expect(skeletonDiv).toHaveClass(className);
        });
      });
    });
  });
});
