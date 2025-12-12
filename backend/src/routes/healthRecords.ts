import { Router } from 'express';
import { HealthRecordController } from '@/controllers/HealthRecordController';
import { authMiddleware } from '@/middleware/auth';
import { validateRequest, healthRecordSchema } from '@/middleware/validation';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', validateRequest(healthRecordSchema), HealthRecordController.createRecord);
router.get('/', HealthRecordController.getRecords);
router.get('/analysis/overall', HealthRecordController.getOverallAnalysis); // Must be before /:id
router.get('/:id', HealthRecordController.getRecord);
router.put('/:id', validateRequest(healthRecordSchema), HealthRecordController.updateRecord);
router.delete('/:id', HealthRecordController.deleteRecord);

export default router;