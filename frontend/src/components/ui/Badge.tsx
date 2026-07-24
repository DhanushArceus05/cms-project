import { cn } from '@/lib/utils';
import type { PageStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: PageStatus }) {
  const isPublished = status === 'published';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', isPublished ? 'bg-emerald-500' : 'bg-amber-500')}
        aria-hidden="true"
      />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}
