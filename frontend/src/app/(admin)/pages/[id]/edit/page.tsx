'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPage } from '@/lib/api/pages';
import { ApiClientError } from '@/lib/api/client';
import type { Page } from '@/lib/types';
import { PageForm } from '@/components/pages/PageForm';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';

export default function EditPagePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPage(id);
      setPage(result);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load this page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={24} className="text-ink-400" />
      </div>
    );
  }

  if (error || !page) {
    return <ErrorState message={error ?? 'Page not found.'} onRetry={load} />;
  }

  return <PageForm mode="edit" initialPage={page} />;
}
