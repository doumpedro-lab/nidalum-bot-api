import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../../logging/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  req.headers['x-request-id'] = requestId;
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`[HTTP] ${req.method} ${req.originalUrl}`, {
      requestId,
      timestamp: new Date().toISOString(),
      executionTimeMs: duration,
      status: res.statusCode
    });
  });

  next();
};
