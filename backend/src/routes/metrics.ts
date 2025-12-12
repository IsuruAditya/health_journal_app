/**
 * Metrics & Health Check Endpoints
 */

import { Router } from 'express';
import { metrics } from '@/utils/Metrics';
import { analysisCache } from '@/utils/Cache';
import { analysisQueue } from '@/utils/Queue';
import { circuitBreakers } from '@/utils/CircuitBreaker';
import { rateLimiters } from '@/utils/RateLimiter';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    circuitBreaker: {
      aiService: circuitBreakers.aiService.getState()
    }
  };

  res.json(health);
});

// Metrics endpoint
router.get('/metrics', (req, res) => {
  const metricsData = {
    ...metrics.getMetrics(),
    cache: analysisCache.getStats(),
    queue: analysisQueue.getStats(),
    rateLimiting: {
      aiService: {
        available: rateLimiters.aiService.getAvailableTokens()
      }
    },
    timestamp: new Date().toISOString()
  };

  res.json(metricsData);
});

// Reset metrics (admin only)
router.post('/metrics/reset', (req, res) => {
  metrics.reset();
  analysisCache.clear();
  analysisQueue.clear();
  
  res.json({ message: 'Metrics reset successfully' });
});

export default router;
