import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCardSkeleton from '../../components/skeletons/UserCardSkeleton';

describe('UserCardSkeleton', () => {
  afterEach(() => {
    cleanup();
  });


  it('applies custom className', () => {
    const customClass = 'custom-skeleton-card';
    const { container } = render(<UserCardSkeleton className={customClass} />);
    
    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv).toHaveClass(customClass);
  });

  it('maintains consistent structure with different className props', () => {
    const { container, rerender } = render(<UserCardSkeleton />);
    
    let cardDiv = container.firstChild as HTMLElement;
    const initialChildrenCount = cardDiv.children.length;
    
    rerender(<UserCardSkeleton className="custom-class" />);
    
    cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv.children).toHaveLength(initialChildrenCount);
    expect(cardDiv).toHaveClass('custom-class');
  });
});
