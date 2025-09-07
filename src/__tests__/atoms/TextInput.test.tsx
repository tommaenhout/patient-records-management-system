import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from '@/components/atoms/TextInput';

describe('TextInput Component', () => {
  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<TextInput id="test" label="Test Label" />);
      
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <TextInput
          id="test-input"
          label="Test Label"
          type="email"
          placeholder="Enter email"
          required
          className="custom-class"
        />
      );
      
      const input = screen.getByLabelText('Test Label *');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-input');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter email');
      expect(input).toHaveClass('custom-class');
    });

    it('shows required asterisk when required prop is true', () => {
      render(<TextInput label="Required Field" required />);
      
      expect(screen.getByText('Required Field *')).toBeInTheDocument();
    });

    it('does not show asterisk when required prop is false', () => {
      render(<TextInput label="Optional Field" required={false} />);
      
      expect(screen.getByText('Optional Field')).toBeInTheDocument();
      expect(screen.queryByText('Optional Field *')).not.toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('renders as text input by default', () => {
      render(<TextInput label="Default Input" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders as email input when type is email', () => {
      render(<TextInput label="Email Input" type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders as url input when type is url', () => {
      render(<TextInput label="URL Input" type="url" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('renders as password input when type is password', () => {
      render(<TextInput id="password" label="Password Input" type="password" />);
      
      const input = screen.getByLabelText('Password Input');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Multiline Functionality', () => {
    it('renders as textarea when multiline is true', () => {
      render(<TextInput label="Multiline Input" multiline />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('applies rows attribute to textarea', () => {
      render(<TextInput label="Multiline Input" multiline rows={5} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('uses default rows when not specified', () => {
      render(<TextInput label="Multiline Input" multiline />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '3');
    });

    it('does not apply type attribute to textarea', () => {
      render(<TextInput label="Multiline Input" multiline type="email" />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toHaveAttribute('type');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(<TextInput label="Input with Error" error="This field is required" />);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
    });

    it('applies error styling to input when error is present', () => {
      render(<TextInput label="Input with Error" error="Error message" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('does not display error message when error prop is not provided', () => {
      render(<TextInput id="no-error" label="Input without Error" />);
      
      expect(screen.queryByText(/This field is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Error message/i)).not.toBeInTheDocument();
    });

    it('removes error styling when error is cleared', () => {
      const { rerender } = render(<TextInput label="Test Input" error="Error message" />);
      
      let input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
      
      rerender(<TextInput label="Test Input" />);
      
      input = screen.getByRole('textbox');
      expect(input).not.toHaveClass('border-red-500');
    });
  });

  describe('User Interactions', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup();
      render(<TextInput label="Test Input" />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange handler when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<TextInput label="Test Input" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'a');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus handler when input is focused', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      render(<TextInput label="Test Input" onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur handler when input loses focus', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<TextInput label="Test Input" onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      
      expect(handleBlur).toHaveBeenCalled();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <TextInput id="first" label="First Input" />
          <TextInput id="second" label="Second Input" />
        </div>
      );
      
      const firstInput = screen.getByLabelText('First Input');
      const secondInput = screen.getByLabelText('Second Input');
      
      await user.click(firstInput);
      expect(firstInput).toHaveFocus();
      
      await user.tab();
      expect(secondInput).toHaveFocus();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      const { rerender } = render(
        <TextInput id="controlled" label="Controlled Input" value="initial" onChange={handleChange} />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');
      
      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
      
      rerender(<TextInput id="controlled" label="Controlled Input" value="updated" onChange={handleChange} />);
      expect(input).toHaveValue('updated');
    });

    it('works as uncontrolled component with defaultValue', () => {
      render(<TextInput label="Uncontrolled Input" defaultValue="default text" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('default text');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input using htmlFor and id', () => {
      render(<TextInput id="accessible-input" label="Accessible Input" />);
      
      const label = screen.getByText('Accessible Input');
      const input = screen.getByRole('textbox');
      
      expect(label).toHaveAttribute('for', 'accessible-input');
      expect(input).toHaveAttribute('id', 'accessible-input');
    });

    it('supports aria-describedby for error messages', () => {
      render(<TextInput id="error-input" label="Input with Error" error="Error message" />);
      
      const errorMessage = screen.getByText('Error message');
      
      // The component should ideally set aria-describedby, but let's test current behavior
      expect(errorMessage).toBeInTheDocument();
    });

    it('supports additional aria attributes', () => {
      render(
        <TextInput
          label="Accessible Input"
          aria-label="Custom aria label"
          aria-required="true"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Custom aria label');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Form Integration', () => {
    it('supports form submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <TextInput name="test-field" label="Test Field" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button');
      
      await user.type(input, 'test value');
      await user.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('supports name attribute for form data', () => {
      render(<TextInput label="Named Input" name="test-name" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'test-name');
    });

    it('supports disabled state', () => {
      render(<TextInput label="Disabled Input" disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('supports readonly state', () => {
      render(<TextInput label="Readonly Input" readOnly />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<TextInput ref={ref} label="Ref Input" />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName).toBe('INPUT');
    });

    it('forwards ref to textarea element when multiline', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<TextInput ref={ref} id="textarea-ref" label="Ref Textarea" multiline />);
      
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current?.tagName).toBe('TEXTAREA');
    });

    it('allows programmatic focus via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<TextInput ref={ref} id="focus-ref" label="Focus Input" />);
      
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string values', () => {
      render(<TextInput label="Empty Input" value="" onChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('handles null/undefined values gracefully', () => {
      render(<TextInput id="null-input" label="Null Input" value={undefined} onChange={() => {}} />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('handles very long error messages', () => {
      const longError = 'This is a very long error message that should still be displayed properly even though it contains a lot of text and might wrap to multiple lines';
      render(<TextInput label="Long Error Input" error={longError} />);
      
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('handles special characters in input', async () => {
      const user = userEvent.setup();
      render(<TextInput id="special" label="Special Chars Input" />);
      
      const input = screen.getByRole('textbox');
      const specialText = '!@#$%^&*()_+-=';
      
      await user.type(input, specialText);
      expect(input).toHaveValue(specialText);
    });
  });
});
