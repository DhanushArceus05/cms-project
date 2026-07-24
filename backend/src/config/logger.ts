/**
 * Deliberately minimal logger. For an assignment of this scope, pulling in
 * Pino (plus pretty-printer, transports, etc.) is more ceremony than value.
 * This wraps console with consistent, timestamped, leveled output, and is a
 * drop-in seam to swap for Pino/Winston later without touching call sites.
 */
type LogMeta = unknown;

const timestamp = () => new Date().toISOString();

export const logger = {
  info: (message: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${timestamp()} - ${message}`, meta ?? '');
  },
  warn: (message: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${timestamp()} - ${message}`, meta ?? '');
  },
  error: (message: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${timestamp()} - ${message}`, meta ?? '');
  },
};
