'use client';

import { useState, type DragEvent } from 'react';
import { BlockCard } from '@/components/blocks/BlockCard';
import { BlockTypeMenu } from '@/components/blocks/BlockTypeMenu';
import { createDefaultBlock, type EditorBlock } from '@/components/blocks/editorTypes';
import { EmptyState } from '@/components/ui/EmptyState';
import type { BlockType } from '@/lib/types';

interface BlockEditorProps {
  blocks: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
}

// Keeps `order` in sync with array position — the backend re-sorts by
// `order` on save, so the array index is always the source of truth here.
function withOrder(blocks: EditorBlock[]): EditorBlock[] {
  return blocks.map((block, index) => ({ ...block, order: index }));
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addBlock = (type: BlockType) => {
    onChange(withOrder([...blocks, createDefaultBlock(type, blocks.length)]));
  };

  const updateBlock = (index: number, next: EditorBlock) => {
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  };

  const removeBlock = (index: number) => {
    onChange(withOrder(blocks.filter((_, i) => i !== index)));
  };

  const moveBlock = (from: number, to: number) => {
    if (from < 0 || from >= blocks.length) return;
    if (to < 0 || to >= blocks.length) return;
    if (from === to) return;

    const moved = blocks[from];
    if (!moved) return; // satisfies noUncheckedIndexedAccess without an `as` cast

    const next = blocks.filter((_, i) => i !== from);
    next.splice(to, 0, moved);
    onChange(withOrder(next));
  };

  const handleDragStart = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
  };

  const handleDrop = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      return;
    }
    moveBlock(dragIndex, index);
    setDragIndex(null);
  };

  return (
    <div>
      {blocks.length === 0 ? (
        <EmptyState
          title="No content blocks yet"
          description="Add a heading, paragraph, list, table, or equation to start building this page."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {blocks.map((block, index) => (
            <BlockCard
              key={block.key}
              block={block}
              index={index}
              total={blocks.length}
              onChange={(next) => updateBlock(index, next)}
              onRemove={() => removeBlock(index)}
              onMoveUp={() => moveBlock(index, index - 1)}
              onMoveDown={() => moveBlock(index, index + 1)}
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
              isDragging={dragIndex === index}
            />
          ))}
        </div>
      )}

      <div className="mt-4">
        <BlockTypeMenu onAdd={addBlock} />
      </div>
    </div>
  );
}
