import mongoose from 'mongoose';
import { Page } from '../models/Page';
import { ApiError } from '../utils/ApiError';
import { CreatePageInput } from '../schemas/page.schema';

/**
 * Blocks are always stored in `order` sequence, regardless of the order
 * the client sent them in. This keeps rendering on the public frontend a
 * simple array map with no client-side sorting needed.
 */
const sortBlocks = <T extends { order: number }>(blocks: T[]): T[] =>
  [...blocks].sort((a, b) => a.order - b.order);

/**
 * The `search` param is embedded directly into a MongoDB $regex filter.
 * Without escaping, regex metacharacters in user input (e.g. `.*`, `(`,
 * `|`) would be interpreted as regex syntax rather than literal text —
 * at best giving surprising matches, at worst a ReDoS vector. Escaping
 * every regex-special character makes the search behave as a literal,
 * case-insensitive substring match, which is the intended behaviour.
 */
const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

interface ListPagesParams {
  search?: string;
  status?: 'draft' | 'published';
  page: number;
  limit: number;
}

export const listPages = async ({ search, status, page, limit }: ListPagesParams) => {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) filter.title = { $regex: escapeRegExp(search), $options: 'i' };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Page.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Page.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const assertValidObjectId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.invalidId(`Invalid page id: ${id}`);
  }
};

export const getPageById = async (id: string) => {
  assertValidObjectId(id);
  const page = await Page.findById(id);
  if (!page) {
    throw ApiError.notFound('Page not found');
  }
  return page;
};

export const createPage = async (input: CreatePageInput) => {
  const page = await Page.create({
    ...input,
    blocks: sortBlocks(input.blocks),
    publishedAt: input.status === 'published' ? new Date() : null,
  });
  return page;
};

export const updatePage = async (id: string, input: Partial<CreatePageInput>) => {
  assertValidObjectId(id);

  const existing = await Page.findById(id);
  if (!existing) {
    throw ApiError.notFound('Page not found');
  }

  if (input.title !== undefined) existing.title = input.title;
  if (input.slug !== undefined) existing.slug = input.slug;
  if (input.blocks !== undefined) existing.blocks = sortBlocks(input.blocks) as typeof existing.blocks;

  if (input.status !== undefined && input.status !== existing.status) {
    existing.status = input.status;
    existing.publishedAt = input.status === 'published' ? new Date() : null;
  }

  await existing.save();
  return existing;
};

export const deletePage = async (id: string) => {
  assertValidObjectId(id);
  const page = await Page.findByIdAndDelete(id);
  if (!page) {
    throw ApiError.notFound('Page not found');
  }
};

export const getPublishedPageBySlug = async (slug: string) => {
  const page = await Page.findOne({ slug: slug.toLowerCase(), status: 'published' });
  if (!page) {
    throw ApiError.notFound('Page not found');
  }
  return page;
};
