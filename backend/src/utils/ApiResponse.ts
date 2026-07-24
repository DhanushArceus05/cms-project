import { Response } from 'express';

/**
 * Every successful response in the API follows the same envelope:
 * { success: true, data, message }. Keeping this in one helper means
 * controllers never hand-roll the shape and it can't drift.
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};
