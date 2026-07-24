// Types mirror the backend exactly for the fields the public site consumes.
// See backend/src/models/Page.ts and backend/src/schemas/block.schema.ts.

export type PageStatus = 'draft' | 'published';

export type BlockType = 'heading' | 'paragraph' | 'list' | 'table' | 'equation';

export interface HeadingData {
  level: number; // 1-6
  text: string;
}

export interface ParagraphData {
  text: string;
}

// Nested list items: the backend caps nesting at 3 levels.
export interface ListItemLevel3 {
  text: string;
}

export interface ListItemLevel2 {
  text: string;
  items?: ListItemLevel3[];
}

export interface ListItemLevel1 {
  text: string;
  items?: ListItemLevel2[];
}

export interface ListData {
  style: 'ordered' | 'unordered';
  items: ListItemLevel1[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface EquationData {
  latex: string;
  displayMode: boolean;
}

interface BlockBase {
  _id?: string;
  order: number;
}

export type Block =
  | (BlockBase & { type: 'heading'; data: HeadingData })
  | (BlockBase & { type: 'paragraph'; data: ParagraphData })
  | (BlockBase & { type: 'list'; data: ListData })
  | (BlockBase & { type: 'table'; data: TableData })
  | (BlockBase & { type: 'equation'; data: EquationData });

export interface Page {
  _id: string;
  title: string;
  slug: string;
  status: PageStatus;
  blocks: Block[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Envelope shapes returned by the backend.
export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;
