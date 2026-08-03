import 'dotenv/config';
import 'reflect-metadata';
import './infrastructure/di/container';
import app from './infrastructure/http/app';
import { logger } from './infrastructure/logging/logger';
import { ConfigService } from './core/config/ConfigService';

const PORT = ConfigService.getInstance().get('PORT', '8080');

const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
