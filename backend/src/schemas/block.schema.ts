import { z } from 'zod';

/**
 * Nested list items: depth is capped at 3 levels. Rather than open-ended
 * recursion (which would need a runtime depth counter to enforce the
 * "max 3" rule from the Phase 1 plan), the three allowed levels are
 * modeled explicitly — the type system itself makes a 4th level
 * impossible, and Zod rejects it if a client sends it anyway.
 */
const listItemLevel3 = z.object({
  text: z.string().trim().min(1, 'List item text cannot be empty'),
});

const listItemLevel2 = z.object({
  text: z.string().trim().min(1, 'List item text cannot be empty'),
  items: z.array(listItemLevel3).optional(),
});

const listItemLevel1 = z.object({
  text: z.string().trim().min(1, 'List item text cannot be empty'),
  items: z.array(listItemLevel2).optional(),
});

const headingData = z.object({
  level: z.number().int().min(1, 'Heading level must be 1-6').max(6, 'Heading level must be 1-6'),
  text: z.string().trim().min(1, 'Heading text cannot be empty'),
});

const paragraphData = z.object({
  text: z.string().trim().min(1, 'Paragraph text cannot be empty'),
});

const listData = z.object({
  style: z.enum(['ordered', 'unordered']),
  items: z.array(listItemLevel1).min(1, 'List must have at least one item'),
});

const tableData = z
  .object({
    headers: z.array(z.string().trim().min(1)).min(1, 'Table must have at least one header'),
    rows: z.array(z.array(z.string())).min(1, 'Table must have at least one row'),
  })
  .refine((table) => table.rows.every((row) => row.length === table.headers.length), {
    message: 'Every row must have the same number of cells as there are headers',
    path: ['rows'],
  });

const equationData = z.object({
  latex: z.string().trim().min(1, 'Equation latex cannot be empty'),
  displayMode: z.boolean().default(false),
});

/**
 * Discriminated union keyed on `type` — Zod picks the right `data` shape
 * to validate against based on the block's declared type, and rejects
 * any block type outside the five supported ones.
 */
export const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), order: z.number().int().min(0), data: headingData }),
  z.object({ type: z.literal('paragraph'), order: z.number().int().min(0), data: paragraphData }),
  z.object({ type: z.literal('list'), order: z.number().int().min(0), data: listData }),
  z.object({ type: z.literal('table'), order: z.number().int().min(0), data: tableData }),
  z.object({ type: z.literal('equation'), order: z.number().int().min(0), data: equationData }),
]);

export type BlockInput = z.infer<typeof blockSchema>;
