import React from 'react';
import { motion } from 'framer-motion';

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  className = '',
  showLabel = false,
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const colors = {
    primary: 'bg-brand-primary',
    secondary: 'bg-brand-secondary',
    accent: 'bg-brand-accent',
    success: 'bg-teal-500',
    danger: 'bg-rose-500',
  };

  const bgColors = {
    primary: 'bg-blue-500/10',
    secondary: 'bg-teal-500/10',
    accent: 'bg-purple-500/10',
    success: 'bg-teal-500/10',
    danger: 'bg-rose-500/10',
  };

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-zinc-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${heights[size]} ${bgColors[variant]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${colors[variant]}`}
        />
      </div>
    </div>
  );
};
