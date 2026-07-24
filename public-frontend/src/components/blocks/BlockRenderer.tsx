import type { Block } from '@/lib/types';
import { ListBlock } from '@/components/blocks/ListBlock';
import { TableBlock } from '@/components/blocks/TableBlock';
import { EquationBlock } from '@/components/blocks/EquationBlock';

const headingSizeClasses: Record<number, string> = {
  1: 'text-3xl font-bold',
  2: 'text-2xl font-bold',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
  5: 'text-base font-semibold',
  6: 'text-sm font-semibold uppercase tracking-wide',
};

function BlockItem({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
      const sizeClass = headingSizeClasses[block.data.level] ?? 'text-2xl font-bold';
      return <Tag className={`${sizeClass} text-ink-900`}>{block.data.text}</Tag>;
    }

    case 'paragraph':
      return <p className="whitespace-pre-wrap leading-relaxed text-ink-700">{block.data.text}</p>;

    case 'list':
      return <ListBlock data={block.data} />;

    case 'table':
      return <TableBlock data={block.data} />;

    case 'equation':
      return <EquationBlock data={block.data} />;

    default:
      return null;
  }
}

/**
 * Renders a page's content blocks in the exact order the backend provided them.
 * Blocks are already sorted by `order` server-side, but we sort defensively here
 * too since it's cheap and this is the one place rendering order actually matters.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="prose-cms flex flex-col gap-6">
      {sorted.map((block, i) => (
        <BlockItem key={block._id ?? i} block={block} />
      ))}
    </div>
  );
}
