import { cn } from '@/lib/utils';

export function Alert({ message, variant = 'error' }: { message: string; variant?: 'error' | 'info' }) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-3.5 py-2.5 text-sm',
        variant === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-accent-200 bg-accent-50 text-accent-800'
      )}
    >
      {message}
    </div>
  );
}
