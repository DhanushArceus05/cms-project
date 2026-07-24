import { Router } from 'express';
import { loginHandler, logoutHandler, meHandler } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { protectRoute } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', authRateLimiter, validate(loginSchema), loginHandler);
router.post('/logout', logoutHandler);
router.get('/me', protectRoute, meHandler);

export default router;
