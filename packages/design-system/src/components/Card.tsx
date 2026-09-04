import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'flat',
  padding = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl border border-slate-200 transition-all duration-150';

  const variants = {
    elevated: 'shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] hover:shadow-md',
    flat: 'shadow-sm',
    interactive:
      'shadow-sm hover:border-[#0D746F] hover:shadow-[0_4px_16px_-4px_rgba(13,116,111,0.12)] cursor-pointer active:scale-[0.99]',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variants[variant], paddings[padding], className))}
      {...props}
    >
      {children}
    </div>
  );
};
