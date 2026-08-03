import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import apiRoutes from './routes';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Body parser
app.use(express.json());

// Request logging with UUID, Timestamp, ExecutionTime
app.use(requestLogger);

// Rate Limiting (MVP config)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
