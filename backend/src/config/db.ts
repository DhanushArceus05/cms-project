import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDB = async (uri: string = env.MONGODB_URI): Promise<void> => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};

/**
 * Simple string representation of the current connection state,
 * used by the /health endpoint.
 */
export const getDBStatus = (): 'connected' | 'disconnected' | 'connecting' | 'disconnecting' => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'] as const;
  const state = mongoose.connection.readyState;
  return states[state as 0 | 1 | 2 | 3] ?? 'disconnected';
};
