'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listPages } from '@/lib/api/pages';
import { ApiClientError } from '@/lib/api/client';
import type { Page } from '@/lib/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateTime } from '@/lib/utils';

interface Summary {
  total: number;
  published: number;
  draft: number;
}

export default function DashboardPage() {
  const { admin } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentPages, setRecentPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [all, published, draft, recent] = await Promise.all([
        listPages({ limit: 1 }),
        listPages({ limit: 1, status: 'published' }),
        listPages({ limit: 1, status: 'draft' }),
        listPages({ limit: 5 }),
      ]);
      setSummary({
        total: all.pagination.total,
        published: published.pagination.total,
        draft: draft.pagination.total,
      });
      setRecentPages(recent.items);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink-900">
          Welcome back{admin?.username ? `, ${admin.username}` : ''}
        </h1>
        <p className="text-sm text-ink-500">Here&apos;s what&apos;s happening with your content.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} className="text-ink-400" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadDashboard} />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard label="Total pages" value={summary?.total ?? 0} accent="ink" />
            <SummaryCard label="Published" value={summary?.published ?? 0} accent="emerald" />
            <SummaryCard label="Drafts" value={summary?.draft ?? 0} accent="amber" />
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/pages/new" className="flex-1">
              <Button className="w-full sm:w-auto">+ Create new page</Button>
            </Link>
            <Link href="/pages" className="flex-1">
              <Button variant="secondary" className="w-full sm:w-auto">
                Manage all pages
              </Button>
            </Link>
          </div>

          <Card>
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">Recently updated</h2>
              <Link href="/pages" className="text-sm font-medium text-accent-600 hover:text-accent-700">
                View all
              </Link>
            </div>
            {recentPages.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No pages yet"
                  description="Create your first page to see it here."
                  action={
                    <Link href="/pages/new">
                      <Button size="sm">+ Create new page</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="divide-y divide-ink-100">
                {recentPages.map((page) => (
                  <li key={page._id}>
                    <Link
                      href={`/pages/${page._id}/edit`}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-ink-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-800">{page.title}</p>
                        <p className="truncate text-xs text-ink-400">/{page.slug}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="hidden text-xs text-ink-400 sm:inline">
                          {formatDateTime(page.updatedAt)}
                        </span>
                        <StatusBadge status={page.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: 'ink' | 'emerald' | 'amber';
}) {
  const dotClass = { ink: 'bg-ink-400', emerald: 'bg-emerald-500', amber: 'bg-amber-500' }[accent];
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
        <p className="text-sm text-ink-500">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-semibold text-ink-900">{value}</p>
    </Card>
  );
}
