import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';

const start = async () => {
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`CMS backend running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
