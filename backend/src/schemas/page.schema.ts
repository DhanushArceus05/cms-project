import { z } from 'zod';
import { blockSchema } from './block.schema';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Blocks are persisted in `order` sequence (see page.service.ts), so two
 * blocks sharing the same `order` is an ambiguous request, not something
 * to silently resolve — reject it here with a clear, addressable error.
 */
const blocksSchema = z
  .array(blockSchema)
  .default([])
  .superRefine((blocks, ctx) => {
    const seen = new Set<number>();
    const duplicates = new Set<number>();

    for (const block of blocks) {
      if (seen.has(block.order)) {
        duplicates.add(block.order);
      }
      seen.add(block.order);
    }

    if (duplicates.size > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate block order value(s): ${[...duplicates].join(', ')}. Each block must have a unique order.`,
      });
    }
  });

const pageBody = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugRegex, 'Slug must be lowercase, alphanumeric, and hyphen-separated'),
  status: z.enum(['draft', 'published']).default('draft'),
  blocks: blocksSchema,
});

export const createPageSchema = z.object({
  body: pageBody,
});

export const updatePageSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: pageBody.partial(),
});

export const getPageSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const listPagesQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    status: z.enum(['draft', 'published']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export const publicPageSchema = z.object({
  params: z.object({ slug: z.string().trim().toLowerCase().min(1) }),
});

export type CreatePageInput = z.infer<typeof pageBody>;
