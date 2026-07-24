'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listPages } from '@/lib/api/pages';
import { ApiClientError } from '@/lib/api/client';
import { useDebounce } from '@/lib/hooks/useDebounce';
import type { Page, PageStatus, Pagination } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchAndFilterBar } from '@/components/pages/SearchAndFilterBar';
import { PaginationControls } from '@/components/pages/PaginationControls';
import { PagesTable } from '@/components/pages/PagesTable';
import { DeletePageDialog } from '@/components/pages/DeletePageDialog';

const PAGE_SIZE = 10;

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PageStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  // Reset to page 1 whenever the search or status filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const loadPages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listPages({ search: debouncedSearch, status, page, limit: PAGE_SIZE });
      setPages(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load pages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, page]);

  const handleDeleted = () => {
    setPageToDelete(null);
    // If we just deleted the last item on a page beyond page 1, step back a page.
    if (pages.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      loadPages();
    }
  };

  const hasFilters = search.trim().length > 0 || status !== 'all';

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Pages</h1>
          <p className="text-sm text-ink-500">Create, edit, and manage your site&apos;s content.</p>
        </div>
        <Link href="/pages/new">
          <Button>+ Create new page</Button>
        </Link>
      </div>

      <div className="mb-4">
        <SearchAndFilterBar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size={24} className="text-ink-400" />
          </div>
        ) : error ? (
          <div className="p-5">
            <ErrorState message={error} onRetry={loadPages} />
          </div>
        ) : pages.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={hasFilters ? 'No matching pages' : 'No pages yet'}
              description={
                hasFilters
                  ? 'Try adjusting your search or filter.'
                  : 'Get started by creating your first page.'
              }
              action={
                !hasFilters && (
                  <Link href="/pages/new">
                    <Button size="sm">+ Create new page</Button>
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <>
            <PagesTable pages={pages} onDeleteRequest={setPageToDelete} />
            {pagination && <PaginationControls pagination={pagination} onPageChange={setPage} />}
          </>
        )}
      </Card>

      <DeletePageDialog page={pageToDelete} onClose={() => setPageToDelete(null)} onDeleted={handleDeleted} />
    </div>
  );
}
