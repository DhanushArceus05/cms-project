import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Validates req.body / req.params / req.query against a Zod schema shaped
 * like { body?, params?, query? }. On success, the parsed (and
 * coerced/defaulted) values are written back onto req so controllers
 * always see clean, typed data.
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.params !== undefined) Object.assign(req.params, parsed.params);
      if (parsed.query !== undefined) Object.assign(req.query, parsed.query);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        next(ApiError.badRequest('Validation failed', details));
        return;
      }
      next(error);
    }
  };
