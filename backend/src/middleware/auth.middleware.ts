import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { JwtPayload, verifyToken } from '../utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }
  return null;
};

/**
 * Guards admin-only routes. Accepts the token only as an
 * `Authorization: Bearer <token>` header — the admin frontend is a
 * separate SPA (not server-rendered against this API), so a cookie-based
 * session adds CSRF surface area without buying anything here.
 */
export const protectRoute = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    next(ApiError.unauthorized('Access denied. No authentication credentials found.'));
    return;
  }

  try {
    req.admin = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired authorization token.'));
  }
};
