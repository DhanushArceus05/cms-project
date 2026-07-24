import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import * as pageService from '../services/page.service';

export const listPagesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { search, status, page, limit } = req.query as unknown as {
    search?: string;
    status?: 'draft' | 'published';
    page: number;
    limit: number;
  };

  const result = await pageService.listPages({ search, status, page, limit });
  // Pagination metadata travels alongside the items inside `data`, keeping
  // the top-level response envelope identical across every endpoint.
  sendSuccess(res, { items: result.items, pagination: result.pagination }, 'Pages fetched');
});

export const getPageHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = await pageService.getPageById(req.params.id);
  sendSuccess(res, page, 'Page fetched');
});

export const createPageHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = await pageService.createPage(req.body);
  sendSuccess(res, page, 'Page created', 201);
});

export const updatePageHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = await pageService.updatePage(req.params.id, req.body);
  sendSuccess(res, page, 'Page updated');
});

export const deletePageHandler = asyncHandler(async (req: Request, res: Response) => {
  await pageService.deletePage(req.params.id);
  sendSuccess(res, null, 'Page deleted');
});
