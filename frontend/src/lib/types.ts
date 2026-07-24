// Types mirror the backend exactly (see backend/src/schemas and backend/src/models).
// Do not diverge from these shapes — the API layer relies on them matching the wire format.

export type PageStatus = 'draft' | 'published';

export type BlockType = 'heading' | 'paragraph' | 'list' | 'table' | 'equation';

export interface HeadingData {
  level: number; // 1-6
  text: string;
}

export interface ParagraphData {
  text: string;
}

// Nested list items: the backend caps nesting at 3 levels (see backend/src/schemas/block.schema.ts).
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

// Payload shape the backend accepts for create/update (see page.schema.ts).
export interface PageInput {
  title: string;
  slug: string;
  status: PageStatus;
  blocks: Block[];
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PagesListResult {
  items: Page[];
  pagination: Pagination;
}

// Envelope shapes returned by the backend (see backend/src/utils/ApiResponse.ts
// and backend/src/middleware/error.middleware.ts).
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
