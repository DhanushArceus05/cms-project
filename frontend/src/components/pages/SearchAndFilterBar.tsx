'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { PageStatus } from '@/lib/types';

interface SearchAndFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: PageStatus | 'all';
  onStatusChange: (value: PageStatus | 'all') => void;
}

export function SearchAndFilterBar({ search, onSearchChange, status, onStatusChange }: SearchAndFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search pages by title..."
          className="pl-9"
          aria-label="Search pages"
        />
      </div>
      <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PageStatus | 'all')}
        className="sm:w-44"
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </Select>
    </div>
  );
}
