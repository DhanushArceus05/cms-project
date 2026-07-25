import { Schema, model } from 'mongoose';

export const BLOCK_TYPES = ['heading', 'paragraph', 'list', 'table', 'equation'] as const;
export const PAGE_STATUSES = ['draft', 'published'] as const;

/**
 * Blocks are polymorphic by design: `data` shape depends entirely on `type`.
 * Zod schemas (src/schemas) enforce the actual per-type shape and constraints
 * before anything reaches this model — Mongoose only needs to know "this is
 * a block with a type, order, and some validated data".
 */
const blockSchema = new Schema(
  {
    type: {
      type: String,
      enum: BLOCK_TYPES,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: true }
);

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: PAGE_STATUSES,
      default: 'draft',
    },
    blocks: {
      type: [blockSchema],
      default: [],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

pageSchema.index({ title: 'text' });

export const Page = model('Page', pageSchema);
