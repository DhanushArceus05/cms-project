import { Router } from 'express';
import { getPublicPageHandler } from '../controllers/public.controller';
import { validate } from '../middleware/validate.middleware';
import { publicPageSchema } from '../schemas/page.schema';

const router = Router();

router.get('/pages/:slug', validate(publicPageSchema), getPublicPageHandler);

export default router;
