import { BlockRenderer } from '@/components/preview/BlockRenderer';
import { StatusBadge } from '@/components/ui/Badge';
import type { Block, PageStatus } from '@/lib/types';

interface PagePreviewProps {
  title: string;
  slug: string;
  status: PageStatus;
  blocks: Block[];
}

export function PagePreview({ title, slug, status, blocks }: PagePreviewProps) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-ink-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{title || <span className="text-ink-300">Untitled page</span>}</h1>
          <p className="mt-1 font-mono text-xs text-ink-400">/{slug || 'your-slug-here'}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-ink-400">This page has no content blocks yet.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {sorted.map((block, i) => (
            <BlockRenderer key={block._id ?? i} block={block} />
          ))}
        </div>
      )}
    </div>
  );
}
