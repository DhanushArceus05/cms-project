'use client';

import { Button } from '@/components/ui/Button';
import type { Pagination } from '@/lib/types';

interface PaginationControlsProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const { page, totalPages, total, limit } = pagination;
  if (total === 0) return null;

  const rangeStart = (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 px-5 py-3.5 sm:flex-row">
      <p className="text-xs text-ink-500">
        Showing <span className="font-medium text-ink-700">{rangeStart}</span>–
        <span className="font-medium text-ink-700">{rangeEnd}</span> of{' '}
        <span className="font-medium text-ink-700">{total}</span> pages
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <span className="text-xs text-ink-500">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
