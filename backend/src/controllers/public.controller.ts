import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import * as pageService from '../services/page.service';

export const getPublicPageHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = await pageService.getPublishedPageBySlug(req.params.slug);
  sendSuccess(res, page, 'Page fetched');
});
