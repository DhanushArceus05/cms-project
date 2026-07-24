import rateLimit from 'express-rate-limit';

/**
 * Applied globally: generous enough not to interfere with normal use,
 * tight enough to blunt basic abuse/scraping.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.', details: [] } },
});

/**
 * Tighter limiter specifically on login, since credential-guessing is the
 * realistic threat there.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts, please try again later.', details: [] } },
});
