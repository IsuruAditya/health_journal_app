import { Router } from 'express';
import { HealthRecordController } from '@/controllers/HealthRecordController';
import { authMiddleware } from '@/middleware/auth';
import { validateRequest, healthRecordSchema } from '@/middleware/validation';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', validateRequest(healthRecordSchema), HealthRecordController.createRecord);
router.get('/', HealthRecordController.getRecords);
router.get('/:id', HealthRecordController.getRecord);

export default router;