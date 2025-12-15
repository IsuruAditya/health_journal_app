import { Router } from 'express';
import { HealthRecordController } from '../controllers/HealthRecordController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/:recordId', HealthRecordController.getAnalysis);

export default router;