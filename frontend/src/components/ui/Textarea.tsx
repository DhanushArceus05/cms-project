'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400',
        'focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500',
        'disabled:bg-ink-50 disabled:text-ink-400',
        error ? 'border-rose-400' : 'border-ink-200',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
