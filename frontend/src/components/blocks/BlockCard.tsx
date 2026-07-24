'use client';

import type { DragEvent } from 'react';
import { HeadingBlockForm } from '@/components/blocks/forms/HeadingBlockForm';
import { ParagraphBlockForm } from '@/components/blocks/forms/ParagraphBlockForm';
import { ListBlockForm } from '@/components/blocks/forms/ListBlockForm';
import { TableBlockForm } from '@/components/blocks/forms/TableBlockForm';
import { EquationBlockForm } from '@/components/blocks/forms/EquationBlockForm';
import { blockTypeLabels, type EditorBlock } from '@/components/blocks/editorTypes';

interface BlockCardProps {
  block: EditorBlock;
  index: number;
  total: number;
  onChange: (block: EditorBlock) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}

export function BlockCard({
  block,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: BlockCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`rounded-xl border bg-white transition-shadow ${
        isDragging ? 'border-accent-300 shadow-popover' : 'border-ink-100 shadow-card'
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-ink-100 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="cursor-grab text-ink-300 active:cursor-grabbing"
            title="Drag to reorder"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="6" r="1.6" />
              <circle cx="8" cy="12" r="1.6" />
              <circle cx="8" cy="18" r="1.6" />
              <circle cx="16" cy="6" r="1.6" />
              <circle cx="16" cy="12" r="1.6" />
              <circle cx="16" cy="18" r="1.6" />
            </svg>
          </span>
          <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
            {blockTypeLabels[block.type]}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            title="Move down"
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onRemove}
            title="Remove block"
            className="rounded-md p-1.5 text-ink-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        {block.type === 'heading' && (
          <HeadingBlockForm data={block.data} onChange={(data) => onChange({ ...block, data })} />
        )}
        {block.type === 'paragraph' && (
          <ParagraphBlockForm data={block.data} onChange={(data) => onChange({ ...block, data })} />
        )}
        {block.type === 'list' && (
          <ListBlockForm data={block.data} onChange={(data) => onChange({ ...block, data })} />
        )}
        {block.type === 'table' && (
          <TableBlockForm data={block.data} onChange={(data) => onChange({ ...block, data })} />
        )}
        {block.type === 'equation' && (
          <EquationBlockForm data={block.data} onChange={(data) => onChange({ ...block, data })} />
        )}
      </div>
    </div>
  );
}
