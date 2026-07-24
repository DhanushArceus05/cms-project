import { Request, Response } from 'express';
import { getDBStatus } from '../config/db';

export const healthHandler = (_req: Request, res: Response): void => {
  const dbStatus = getDBStatus();

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
    message: 'Service is healthy',
  });
};
