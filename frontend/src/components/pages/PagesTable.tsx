'use client';

import Link from 'next/link';
import type { Page } from '@/lib/types';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface PagesTableProps {
  pages: Page[];
  onDeleteRequest: (page: Page) => void;
}

export function PagesTable({ pages, onDeleteRequest }: PagesTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {pages.map((page) => (
              <tr key={page._id} className="transition-colors hover:bg-ink-50/60">
                <td className="max-w-xs px-5 py-3.5">
                  <Link href={`/pages/${page._id}/edit`} className="truncate font-medium text-ink-800 hover:text-accent-600">
                    {page.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-ink-500">/{page.slug}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={page.status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-ink-500">{formatDateTime(page.updatedAt)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <Link href={`/pages/${page._id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => onDeleteRequest(page)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-ink-100 md:hidden">
        {pages.map((page) => (
          <li key={page._id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/pages/${page._id}/edit`} className="block truncate text-sm font-medium text-ink-800">
                  {page.title}
                </Link>
                <p className="mt-0.5 truncate font-mono text-xs text-ink-500">/{page.slug}</p>
                <p className="mt-1 text-xs text-ink-400">{formatDateTime(page.updatedAt)}</p>
              </div>
              <StatusBadge status={page.status} />
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/pages/${page._id}/edit`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" className="flex-1" onClick={() => onDeleteRequest(page)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
