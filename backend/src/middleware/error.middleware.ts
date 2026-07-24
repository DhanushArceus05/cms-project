import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { env } from '../config/env';

/**
 * Single place that turns any thrown error into the API's standard error
 * envelope. Recognizes the specific error types that show up in practice
 * (Mongo CastError / duplicate key, ApiError) and falls back to a generic
 * 500 for anything unexpected — never leaks internals in production.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details ?? [] },
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_ID', message: `Invalid identifier: ${err.value}`, details: [] },
    });
    return;
  }

  // Mongo duplicate key error (e.g. duplicate slug or email)
  if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: unknown }).code === 11000) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue ?? {};
    const field = Object.keys(keyValue)[0] ?? 'field';
    res.status(409).json({
      success: false,
      error: { code: 'CONFLICT', message: `A record with this ${field} already exists.`, details: [] },
    });
    return;
  }

  if (err instanceof mongoose.Error) {
    logger.error('Database error', err);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'A database error occurred.', details: [] },
    });
    return;
  }

  logger.error('Unhandled error', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: env.isProduction ? 'Something went wrong.' : (err as Error)?.message ?? 'Unknown error',
      details: [],
    },
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route not found: ${req.method} ${req.originalUrl}`, details: [] },
  });
};
