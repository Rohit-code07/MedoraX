import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold tracking-wide text-slate-500 dark:text-zinc-400 uppercase select-none"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-3 text-sm rounded-xl outline-none border transition-all duration-200
            appearance-none bg-white dark:bg-zinc-900/50 
            text-slate-800 dark:text-zinc-100
            ${error 
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50' 
              : 'border-border-light dark:border-border-dark focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50'
            }
            disabled:bg-slate-50 dark:disabled:bg-zinc-950 disabled:opacity-60
            cursor-pointer
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100">
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron icon */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <span className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5 fade-in">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5 select-none">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
