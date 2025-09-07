import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../../components/atoms/SearchBar';

// Mock the Search SVG component
jest.mock('../../components/svg/Search', () => {
  return function MockSearch(props: React.SVGProps<SVGSVGElement>) {
    return <svg data-testid="search-icon" {...props} />;
  };
});

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    const searchIcon = screen.getByTestId('search-icon');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search...');
    expect(searchIcon).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Search patients...';
    render(<SearchBar placeholder={customPlaceholder} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', customPlaceholder);
  });

  it('displays the provided value', () => {
    const testValue = 'John Doe';
    render(<SearchBar value={testValue} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(testValue);
  });

  it('calls onChange with correct value on input change', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new search term' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('new search term');
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-search-class';
    render(<SearchBar className={customClass} />);
    
    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('relative', customClass);
  });

  it('applies input class correctly', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input-search');
  });

  it('works without onChange prop', () => {
    render(<SearchBar value="test" />);
    
    const input = screen.getByRole('textbox');
    expect(() => {
      fireEvent.change(input, { target: { value: 'new value' } });
    }).not.toThrow();
  });

  it('has correct input type', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });


  it('handles controlled component pattern', async () => {
    let value = '';
    const handleChange = (newValue: string) => {
      value = newValue;
    };

    const { rerender } = render(
      <SearchBar value={value} onChange={handleChange} />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');

    // Simulate controlled update
    value = 'controlled value';
    rerender(<SearchBar value={value} onChange={handleChange} />);
    
    expect(input).toHaveValue('controlled value');
  });

  it('clears input when value prop changes to empty string', () => {
    const { rerender } = render(<SearchBar value="initial value" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial value');

    rerender(<SearchBar value="" />);
    expect(input).toHaveValue('');
  });
});
