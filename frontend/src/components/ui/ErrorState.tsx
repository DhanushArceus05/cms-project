import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-rose-100 bg-rose-50/60 px-6 py-16 text-center">
      <h3 className="text-sm font-semibold text-rose-800">Something went wrong</h3>
      <p className="mt-1.5 max-w-sm text-sm text-rose-600">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
