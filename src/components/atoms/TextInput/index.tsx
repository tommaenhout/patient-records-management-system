import React, { forwardRef } from 'react';

interface TextInputProps {
  id?: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'password';
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  rows?: number; // For textarea
  multiline?: boolean;
}

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
>(({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  className = '',
  rows = 3,
  multiline = false,
  ...props
}, ref) => {
  const inputClasses = `
    input
    ${error ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : ''}
    ${className}
  `.trim();

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <InputComponent
        ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
        id={id}
        type={multiline ? undefined : type}
        placeholder={placeholder}
        className={inputClasses}
        rows={multiline ? rows : undefined}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
