import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { requestLogger } from '@/middleware/logger';

// Load environment variables
dotenv.config();

const app = express();

// Essential middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://172.29.192.1:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging - Industry standard
app.use(requestLogger);

// API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;