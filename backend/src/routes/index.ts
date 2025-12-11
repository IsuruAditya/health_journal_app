import { Router } from 'express';
import authRoutes from './auth';
import healthRecordRoutes from './healthRecords';
import analysisRoutes from './analysis';

const router = Router();

router.use('/auth', authRoutes);
router.use('/health-records', healthRecordRoutes);
router.use('/analysis', analysisRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Health Journal API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;