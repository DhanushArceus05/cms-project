'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Server-side error is already logged by Next; this is just a hook point
    // if client-side error reporting is added later.
    console.error(error);
  }, [error]);

  return (
    <div>
      <ErrorState message="We couldn't load this page right now. The server may be unavailable — please try again in a moment." />
      <div className="flex justify-center pb-16">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-ink-900 px-5 text-sm font-medium text-white hover:bg-ink-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
