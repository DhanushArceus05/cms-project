import { Router } from 'express';
import {
  listPagesHandler,
  getPageHandler,
  createPageHandler,
  updatePageHandler,
  deletePageHandler,
} from '../controllers/page.controller';
import { validate } from '../middleware/validate.middleware';
import { protectRoute } from '../middleware/auth.middleware';
import {
  createPageSchema,
  updatePageSchema,
  getPageSchema,
  listPagesQuerySchema,
} from '../schemas/page.schema';

const router = Router();

// Every route in this file manages content, so the guard is applied once
// at the router level rather than repeated per-route.
router.use(protectRoute);

router.get('/', validate(listPagesQuerySchema), listPagesHandler);
router.get('/:id', validate(getPageSchema), getPageHandler);
router.post('/', validate(createPageSchema), createPageHandler);
router.put('/:id', validate(updatePageSchema), updatePageHandler);
router.delete('/:id', validate(getPageSchema), deletePageHandler);

export default router;
