import React, { forwardRef } from 'react';

// Reusable Input
export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  placeholder = '',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random()}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-dark-900/50 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:ring-primary-500/30 transition-all text-sm backdrop-blur-sm ${
          error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5 pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Reusable TextArea
export const TextArea = forwardRef(({
  label,
  error,
  placeholder = '',
  className = '',
  rows = 4,
  id,
  ...props
}, ref) => {
  const inputId = id || `textarea-${label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random()}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-dark-900/50 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:ring-primary-500/30 transition-all text-sm backdrop-blur-sm ${
          error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5 pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
