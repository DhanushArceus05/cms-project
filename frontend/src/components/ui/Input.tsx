'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400',
        'focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500',
        'disabled:bg-ink-50 disabled:text-ink-400',
        error ? 'border-rose-400' : 'border-ink-200',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
