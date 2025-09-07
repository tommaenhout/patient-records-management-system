import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Add from '../../components/svg/Add';
import Close from '../../components/svg/Close';
import Edit from '../../components/svg/Edit';
import Expand from '../../components/svg/Expand';
import Patients from '../../components/svg/Patients';
import Search from '../../components/svg/Search';
import Success from '../../components/svg/Success';
import Warning from '../../components/svg/Warning';
import Web from '../../components/svg/Web';

describe('SVG Components', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Add icon', () => {
    const { container } = render(<Add />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders Close icon', () => {
    const { container } = render(<Close />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
  });

  it('renders Edit icon', () => {
    const { container } = render(<Edit />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders Expand icon', () => {
    const { container } = render(<Expand />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders Patients icon', () => {
    const { container } = render(<Patients />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders Search icon', () => {
    const { container } = render(<Search />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders Success icon', () => {
    const { container } = render(<Success />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 50 50');
  });

  it('renders Warning icon', () => {
    const { container } = render(<Warning />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders Web icon', () => {
    const { container } = render(<Web />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('accepts custom props', () => {
    const { container } = render(<Close width={32} height={32} stroke="red" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('renders with default props when none provided', () => {
    const { container } = render(<Close />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  describe('all SVG components render without errors', () => {
    const svgComponents = [
      { name: 'Add', Component: Add },
      { name: 'Close', Component: Close },
      { name: 'Edit', Component: Edit },
      { name: 'Expand', Component: Expand },
      { name: 'Patients', Component: Patients },
      { name: 'Search', Component: Search },
      { name: 'Success', Component: Success },
      { name: 'Warning', Component: Warning },
      { name: 'Web', Component: Web },
    ];

    svgComponents.forEach(({ name, Component }) => {
      it(`${name} component renders without crashing`, () => {
        expect(() => render(<Component />)).not.toThrow();
      });
    });
  });
});
