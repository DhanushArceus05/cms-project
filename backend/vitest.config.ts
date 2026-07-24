import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test_only_secret_do_not_use_in_prod_123456',
      JWT_EXPIRES_IN: '1h',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/placeholder-overridden-in-beforeAll',
      CORS_ORIGIN: 'http://localhost:3000',
      ADMIN_SEED_EMAIL: 'admin@example.com',
      ADMIN_SEED_USERNAME: 'admin',
      ADMIN_SEED_PASSWORD: 'TestPassword123!',
    },
  },
});
