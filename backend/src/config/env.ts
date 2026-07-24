import 'dotenv/config';
import { z } from 'zod';

/**
 * All environment variables the app depends on are validated once, at boot.
 * If anything required is missing or malformed, the process fails fast with
 * a clear message instead of crashing later at an unpredictable point.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  ADMIN_SEED_USERNAME: z.string().min(1).default('admin'),
  ADMIN_SEED_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_SEED_PASSWORD: z.string().min(8).default('ChangeMe123!'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  isProduction: parsed.data.NODE_ENV === 'production',
  isTest: parsed.data.NODE_ENV === 'test',
};
