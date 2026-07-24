export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INVALID_ID'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR';

/**
 * A single error shape thrown anywhere in the app (services, controllers,
 * middleware). The global error handler is the only place that knows how
 * to turn this into an HTTP response.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown[];

  constructor(statusCode: number, code: ErrorCode, message: string, details?: unknown[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown[]) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'You do not have access to this resource') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string) {
    return new ApiError(409, 'CONFLICT', message);
  }

  static invalidId(message = 'Invalid identifier') {
    return new ApiError(400, 'INVALID_ID', message);
  }

  static internal(message = 'Something went wrong') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}
