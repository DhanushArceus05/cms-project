'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900',
        'focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500',
        'disabled:bg-ink-50 disabled:text-ink-400',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
