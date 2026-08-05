import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glow?: 'primary' | 'secondary' | 'accent' | 'none';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glass = false,
  glow = 'none',
  hoverable = false,
  ...props
}) => {
  const glowStyles = {
    primary: 'glow-primary glow-card-primary',
    secondary: 'glow-secondary glow-card-secondary',
    accent: 'glow-accent glow-card-accent',
    none: '',
  };

  return (
    <div
      className={`
        rounded-2xl border transition-all duration-300 overflow-hidden
        ${glass ? 'glass-panel' : 'bg-white dark:bg-[#121214] border-slate-100 dark:border-zinc-800/80'}
        ${hoverable ? 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/40' : 'shadow-sm'}
        ${glowStyles[glow]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 flex flex-col gap-1.5 border-b border-slate-50 dark:border-zinc-800/50 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-slate-400 dark:text-zinc-500 font-normal leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 bg-slate-50/50 dark:bg-zinc-800/10 border-t border-slate-50 dark:border-zinc-800/50 flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);
