import { Router } from 'express';
import authRoutes from './auth.routes';
import pageRoutes from './page.routes';
import publicRoutes from './public.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pages', pageRoutes);
router.use('/public', publicRoutes);

export default router;
