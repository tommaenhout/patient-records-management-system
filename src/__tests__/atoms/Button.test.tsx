import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../../components/atoms/Button';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with default props', () => {
    const { container } = render(<Button>Click me</Button>);
    
    const button = container.firstChild as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toBeDisabled();
    expect(button.textContent).toBe('Click me');
  });

  it('applies custom className', () => {
    const customClass = 'custom-button-class';
    const { container } = render(<Button className={customClass}>Custom Button</Button>);
    
    const button = container.firstChild as HTMLButtonElement;
    expect(button).toHaveClass(customClass);
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const { container } = render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    const button = container.firstChild as HTMLButtonElement;
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    
    const button = container.firstChild as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    const { container } = render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    
    const button = container.firstChild as HTMLButtonElement;
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with submit type', () => {
    const { container } = render(<Button type="submit">Submit Button</Button>);
    
    const button = container.firstChild as HTMLButtonElement;
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders with reset type', () => {
    const { container } = render(<Button type="reset">Reset Button</Button>);
    
    const button = container.firstChild as HTMLButtonElement;
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('renders children correctly', () => {
    const { container } = render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    
    const button = container.firstChild as HTMLButtonElement;
    expect(button.children).toHaveLength(2);
    expect(button.children[0].textContent).toBe('Icon');
    expect(button.children[1].textContent).toBe('Text');
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline'] as const;
    
    variants.forEach(variant => {
      const { container } = render(<Button variant={variant}>{variant} Button</Button>);
      const button = container.firstChild as HTMLButtonElement;
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe(`${variant} Button`);
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach(size => {
      const { container } = render(<Button size={size}>{size} Button</Button>);
      const button = container.firstChild as HTMLButtonElement;
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe(`${size} Button`);
    });
  });

  it('combines all props correctly', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <Button
        variant="outline"
        size="lg"
        type="submit"
        className="custom-class"
        onClick={handleClick}
        disabled={false}
      >
        Complex Button
      </Button>
    );
    
    const button = container.firstChild as HTMLButtonElement;
    
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass('custom-class');
    expect(button.textContent).toBe('Complex Button');
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
