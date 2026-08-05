import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold tracking-wide text-slate-500 dark:text-zinc-400 uppercase select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none select-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full px-4 py-3 text-sm rounded-xl outline-none border transition-all duration-200
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon ? 'pr-11' : ''}
            bg-white dark:bg-zinc-900/50 
            text-slate-800 dark:text-zinc-100
            ${error 
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50' 
              : 'border-border-light dark:border-border-dark focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50'
            }
            placeholder:text-slate-400 dark:placeholder:text-zinc-600
            disabled:bg-slate-50 dark:disabled:bg-zinc-950 disabled:opacity-60
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 dark:text-zinc-500">
            {rightIcon}
          </div>
        )}
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

Input.displayName = 'Input';
