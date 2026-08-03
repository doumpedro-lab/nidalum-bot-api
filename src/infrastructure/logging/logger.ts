import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Format local (dev) : colorisé et lisible
const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  })
);

// Format prod (GCP) : JSON structuré
const prodFormat = combine(
  timestamp(),
  json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console()
  ],
});
