import { tempId } from '@/lib/utils';
import type { Block, BlockType } from '@/lib/types';

// A Block plus a stable client-side key for React lists and drag/drop —
// `key` is never sent to the API; it's derived from `_id` when the block
// already exists on the server, or a generated temp id for new blocks.
export type EditorBlock = Block & { key: string };

export function toEditorBlock(block: Block): EditorBlock {
  return { ...block, key: block._id ?? tempId() };
}

export function stripEditorKey(block: EditorBlock): Block {
  const { key, ...rest } = block;
  void key;
  return rest;
}

export function createDefaultBlock(type: BlockType, order: number): EditorBlock {
  const key = tempId();
  switch (type) {
    case 'heading':
      return { key, type: 'heading', order, data: { level: 2, text: '' } };
    case 'paragraph':
      return { key, type: 'paragraph', order, data: { text: '' } };
    case 'list':
      return { key, type: 'list', order, data: { style: 'unordered', items: [{ text: '' }] } };
    case 'table':
      return {
        key,
        type: 'table',
        order,
        data: { headers: ['Column 1', 'Column 2'], rows: [['', '']] },
      };
    case 'equation':
      return { key, type: 'equation', order, data: { latex: '', displayMode: false } };
  }
}

export const blockTypeLabels: Record<BlockType, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  list: 'List',
  table: 'Table',
  equation: 'Equation',
};
