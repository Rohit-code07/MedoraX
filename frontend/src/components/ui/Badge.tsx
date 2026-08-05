import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  showDot = false,
}) => {
  const baseStyle = 'inline-flex items-center font-medium rounded-full select-none';
  
  const variants = {
    primary: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    success: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    info: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    neutral: 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] tracking-wide',
    md: 'px-2.5 py-1 text-xs tracking-normal',
  };

  const dotColors = {
    primary: 'bg-blue-500',
    success: 'bg-teal-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-purple-500',
    neutral: 'bg-slate-400 dark:bg-zinc-500',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
