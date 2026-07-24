import { cn } from '@/lib/utils';
import type { Block, ListItemLevel1, ListItemLevel2 } from '@/lib/types';

const headingSizeClasses: Record<number, string> = {
  1: 'text-3xl font-bold',
  2: 'text-2xl font-bold',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
  5: 'text-base font-semibold',
  6: 'text-sm font-semibold uppercase tracking-wide',
};

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
      return (
        <Tag className={cn(headingSizeClasses[block.data.level] ?? 'text-2xl font-bold', 'text-ink-900')}>
          {block.data.text || <span className="text-ink-300">(empty heading)</span>}
        </Tag>
      );
    }

    case 'paragraph':
      return (
        <p className="whitespace-pre-wrap leading-relaxed text-ink-700">
          {block.data.text || <span className="text-ink-300">(empty paragraph)</span>}
        </p>
      );

    case 'list': {
      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag className={cn('space-y-1 pl-5 text-ink-700', block.data.style === 'ordered' ? 'list-decimal' : 'list-disc')}>
          {block.data.items.map((item, i) => (
            <ListLevel1 key={i} item={item} ordered={block.data.style === 'ordered'} />
          ))}
        </ListTag>
      );
    }

    case 'table':
      return (
        <div className="overflow-x-auto rounded-lg border border-ink-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-ink-50">
                {block.data.headers.map((header, i) => (
                  <th key={i} className="border-b border-ink-100 px-3 py-2 font-semibold text-ink-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.data.rows.map((row, r) => (
                <tr key={r} className="border-b border-ink-50 last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} className="px-3 py-2 text-ink-600">
                      {cell || <span className="text-ink-300">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'equation':
      return (
        <div
          className={cn(
            'rounded-lg border border-ink-100 bg-ink-50 px-4 py-3 font-mono text-sm text-ink-800',
            block.data.displayMode && 'text-center text-base'
          )}
        >
          {block.data.latex || <span className="text-ink-300">(empty equation)</span>}
        </div>
      );

    default:
      return null;
  }
}

function ListLevel1({ item, ordered }: { item: ListItemLevel1; ordered: boolean }) {
  return (
    <li>
      {item.text}
      {item.items && item.items.length > 0 && (
        <ol className={cn('mt-1 space-y-1 pl-5', ordered ? 'list-decimal' : 'list-disc')}>
          {item.items.map((child, i) => (
            <ListLevel2 key={i} item={child} ordered={ordered} />
          ))}
        </ol>
      )}
    </li>
  );
}

function ListLevel2({ item, ordered }: { item: ListItemLevel2; ordered: boolean }) {
  return (
    <li>
      {item.text}
      {item.items && item.items.length > 0 && (
        <ol className={cn('mt-1 space-y-1 pl-5', ordered ? 'list-decimal' : 'list-disc')}>
          {item.items.map((child, i) => (
            <li key={i}>{child.text}</li>
          ))}
        </ol>
      )}
    </li>
  );
}
