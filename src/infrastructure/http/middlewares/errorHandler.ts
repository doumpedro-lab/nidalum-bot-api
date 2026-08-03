import { Request, Response, NextFunction } from 'express';
import { logger } from '../../logging/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[Error] ${req.method} ${req.originalUrl} - ${status} - ${message}`, {
    stack: err.stack,
    requestId: req.headers['x-request-id']
  });

  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};
