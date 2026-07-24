import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import * as authService from '../services/auth.service';

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token, admin } = await authService.login(req.body);
  sendSuccess(res, { token, admin }, 'Login successful');
});

export const logoutHandler = asyncHandler(async (_req: Request, res: Response) => {
  // JWTs are stateless and carry no server-side session to invalidate —
  // logout is a client-side action (discard the stored token). This
  // endpoint exists so the admin frontend has a predictable call to make
  // on logout, and to leave room for token revocation later if needed.
  sendSuccess(res, null, 'Logout successful. Please discard the token on the client.');
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) {
    throw ApiError.unauthorized();
  }
  const admin = await authService.getCurrentAdmin(req.admin.id);
  sendSuccess(res, admin, 'Current admin fetched');
});
