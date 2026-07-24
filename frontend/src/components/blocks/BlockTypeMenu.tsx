'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { blockTypeLabels } from '@/components/blocks/editorTypes';
import type { BlockType } from '@/lib/types';

const blockTypeIcons: Record<BlockType, string> = {
  heading: 'H',
  paragraph: '¶',
  list: '≡',
  table: '⊞',
  equation: '∑',
};

const blockTypeOrder: BlockType[] = ['heading', 'paragraph', 'list', 'table', 'equation'];

export function BlockTypeMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Button type="button" variant="secondary" onClick={() => setOpen((v) => !v)}>
        + Add block
      </Button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-lg border border-ink-100 bg-white p-1.5 shadow-popover animate-in">
          {blockTypeOrder.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink-700 hover:bg-ink-50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-ink-100 text-xs font-semibold text-ink-500">
                {blockTypeIcons[type]}
              </span>
              {blockTypeLabels[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
